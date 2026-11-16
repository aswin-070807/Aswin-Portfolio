import os
import sys
import glob
import json
import shutil
import subprocess
import numpy as np
import cv2

try:
    import imageio_ffmpeg
    FFMPEG_BIN = imageio_ffmpeg.get_ffmpeg_exe()
except Exception:
    FFMPEG_BIN = "ffmpeg"

def find_source_video():
    candidates = []
    for ext in ("*.mp4", "*.webm", "*.mov"):
        candidates.extend(glob.glob(f"public/**/{ext}", recursive=True))
        candidates.extend(glob.glob(f"assets/**/{ext}", recursive=True))
        candidates.extend(glob.glob(f"src/assets/**/{ext}", recursive=True))
        candidates.extend(glob.glob(f"media/**/{ext}", recursive=True))
        candidates.extend(glob.glob(f"{ext}"))
    
    # Exclude any newly generated alpha webm or qa videos
    candidates = [c for c in candidates if "alpha" not in c.lower() and "qa" not in c.lower() and "temp" not in c.lower()]
    
    preferred = [c for c in candidates if any(k in os.path.basename(c).lower() for k in ("aswin", "intro", "hero", "me"))]
    if preferred:
        chosen = preferred[0]
    elif candidates:
        chosen = max(candidates, key=os.path.getmtime)
    else:
        raise FileNotFoundError("No source video found in project!")
    
    print(f"[1] Source video selected: {chosen}")
    return chosen

def smoothstep(edge0, edge1, x):
    t = np.clip((x - edge0) / (edge1 - edge0), 0.0, 1.0)
    return t * t * (3.0 - 2.0 * t)

def refine_alpha_mask(alpha_raw, frame_bgr, prev_alpha=None, prev_frame_gray=None):
    # Step 2.3:
    # 1. Soft threshold (smoothstep ~0.15 to 0.85)
    alpha = smoothstep(0.15, 0.85, alpha_raw.astype(np.float32))

    # 2. Fill holes inside body (headphones, hoodie strings, shadows)
    # Binary mask for solid foreground
    bin_fg = (alpha > 0.4).astype(np.uint8)
    h, w = bin_fg.shape
    flood = bin_fg.copy()
    flood_mask = np.zeros((h + 2, w + 2), np.uint8)
    # Flood from outer border corners
    for seed in [(0, 0), (w - 1, 0), (0, h - 1), (w - 1, h - 1), (w // 2, 0)]:
        if flood[seed[1], seed[0]] == 0:
            cv2.floodFill(flood, flood_mask, seed, 255)
    # Holes are pixels that were NOT reached by flood fill and were 0 in bin_fg
    holes = (flood == 0)
    alpha[holes] = 1.0

    # 3. Keep only largest connected component (removes stray blobs)
    labeled_mask = (alpha > 0.1).astype(np.uint8)
    num_labels, labels, stats, centroids = cv2.connectedComponentsWithStats(labeled_mask)
    if num_labels > 1:
        # stats: [x, y, width, height, area]
        # label 0 is background
        areas = stats[1:, cv2.CC_STAT_AREA]
        largest_label = 1 + int(np.argmax(areas))
        alpha[labels != largest_label] = 0.0

    # 4. 1px erode and 1px edge blur
    kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (3, 3))
    eroded = cv2.erode(alpha, kernel, iterations=1)
    # Soft edge blur
    blurred = cv2.GaussianBlur(eroded, (3, 3), 0.8)
    # Blend: keep interior solid, soften outer transition
    alpha = np.where(alpha > 0.9, alpha, blurred)

    # 5. Temporal smoothing: alpha_t = 0.7*alpha_t + 0.3*alpha_(t-1)
    # Reduce previous-frame weight where motion is high
    if prev_alpha is not None and prev_frame_gray is not None:
        curr_gray = cv2.cvtColor(frame_bgr, cv2.COLOR_BGR2GRAY)
        diff = cv2.absdiff(curr_gray, prev_frame_gray).astype(np.float32) / 255.0
        # High motion reduces temporal weight
        w_prev = 0.3 * np.clip(1.0 - diff * 4.0, 0.0, 1.0)
        alpha = (1.0 - w_prev) * alpha + w_prev * prev_alpha

    return np.clip(alpha, 0.0, 1.0)

def apply_color_decontamination(frame_bgr, alpha):
    # Step 2.3:
    # In the 3px edge band, replace gray wall spill with dark navy (#0b0f1a = BGR [26, 15, 11])
    # Despill: reduce luminance of edge pixels brighter than wall colour
    edge_band = (alpha > 0.02) & (alpha < 0.90)
    out_bgr = frame_bgr.astype(np.float32).copy()

    if np.any(edge_band):
        dark_navy = np.array([26.0, 15.0, 11.0], dtype=np.float32)
        # Sample wall luminance from corners
        wall_sample = np.median(frame_bgr[0:20, 0:20], axis=(0, 1))
        wall_lum = 0.114 * wall_sample[0] + 0.587 * wall_sample[1] + 0.299 * wall_sample[2]

        edge_pixels = out_bgr[edge_band]
        edge_lum = 0.114 * edge_pixels[:, 0] + 0.587 * edge_pixels[:, 1] + 0.299 * edge_pixels[:, 2]

        # Blend edge with navy based on transparency
        blend_factor = (1.0 - alpha[edge_band, np.newaxis]) * 0.75
        edge_decontaminated = edge_pixels * (1.0 - blend_factor) + dark_navy * blend_factor

        # Despill bright edge pixels
        spill_mask = edge_lum > (wall_lum * 0.9)
        if np.any(spill_mask):
            edge_decontaminated[spill_mask] *= 0.85

        out_bgr[edge_band] = edge_decontaminated

    return np.clip(out_bgr, 0.0, 255.0).astype(np.uint8)

def run_method_a_onnx(cap, fps, width, height, total_frames, output_dir):
    import onnxruntime as ort
    model_path = os.path.expanduser(r"~/.u2net/u2net_human_seg.onnx")
    if not os.path.exists(model_path):
        raise FileNotFoundError(f"U2Net model not found at {model_path}")

    print(f"Loading ONNX model from {model_path}...")
    opts = ort.SessionOptions()
    opts.intra_op_num_threads = 4
    sess = ort.InferenceSession(model_path, opts)
    input_name = sess.get_inputs()[0].name

    mean = np.array([0.485, 0.456, 0.406], dtype=np.float32)
    std = np.array([0.229, 0.224, 0.225], dtype=np.float32)

    os.makedirs(output_dir, exist_ok=True)

    prev_alpha = None
    prev_gray = None
    frame_idx = 0

    motion_diffs = []
    alpha_coverages = []
    frames_for_qa = {}

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        # Resize to target (max height 960, keeping aspect ratio)
        if frame.shape[0] != height or frame.shape[1] != width:
            frame = cv2.resize(frame, (width, height), interpolation=cv2.INTER_AREA)

        curr_gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        if prev_gray is not None:
            motion = float(np.mean(cv2.absdiff(curr_gray, prev_gray)))
            motion_diffs.append((frame_idx, motion))

        # Model input: 320x320 RGB normalized
        rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        inp = cv2.resize(rgb, (320, 320)).astype(np.float32) / 255.0
        norm = (inp - mean) / std
        norm = norm.transpose(2, 0, 1)[np.newaxis, ...].astype(np.float32)

        out = sess.run(None, {input_name: norm})
        d0 = out[0][0, 0]
        # Normalize probability
        d_min, d_max = d0.min(), d0.max()
        pred = (d0 - d_min) / (d_max - d_min + 1e-8)
        mask = cv2.resize(pred, (width, height), interpolation=cv2.INTER_LINEAR)

        # Refine alpha
        alpha = refine_alpha_mask(mask, frame, prev_alpha, prev_gray)

        # Color decontamination
        decontam_bgr = apply_color_decontamination(frame, alpha)

        # RGBA frame
        alpha_u8 = (alpha * 255.0).astype(np.uint8)
        rgba = cv2.merge([decontam_bgr[:, :, 0], decontam_bgr[:, :, 1], decontam_bgr[:, :, 2], alpha_u8])

        out_path = os.path.join(output_dir, f"{frame_idx:05d}.png")
        cv2.imwrite(out_path, rgba)

        alpha_coverages.append(float(np.mean(alpha)))
        prev_alpha = alpha
        prev_gray = curr_gray

        if frame_idx % 25 == 0 or frame_idx == total_frames - 1:
            print(f"  Processed frame {frame_idx+1}/{total_frames} (coverage: {alpha_coverages[-1]:.3f})")

        frame_idx += 1

    return frame_idx, motion_diffs, alpha_coverages

def main():
    print("=" * 60)
    print("STEP 2: AUTOMATIC OFFLINE BACKGROUND REMOVAL")
    print("=" * 60)

    src_video = find_source_video()

    # Extract metadata
    cap = cv2.VideoCapture(src_video)
    orig_w = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    orig_h = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    fps = cap.get(cv2.CAP_PROP_FPS) or 24.0
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    print(f"Input video specs: {orig_w}x{orig_h} @ {fps:.2f}fps, {total_frames} frames")

    # Step 2.1: Native fps, max height 960px (keep aspect ratio)
    target_h = 960 if orig_h > 960 else orig_h
    scale = target_h / orig_h
    target_w = int(round(orig_w * scale))
    # Make sure width and height are even numbers for YUV encoders
    if target_w % 2 != 0:
        target_w -= 1
    if target_h % 2 != 0:
        target_h -= 1
    print(f"Target frame resolution: {target_w}x{target_h}")

    work_dir = "scripts/.temp_alpha"
    frames_dir = os.path.join(work_dir, "frames")
    audio_path = os.path.join(work_dir, "audio.m4a")
    if os.path.exists(work_dir):
        shutil.rmtree(work_dir)
    os.makedirs(frames_dir, exist_ok=True)
    os.makedirs("scripts/qa", exist_ok=True)
    os.makedirs("public/media", exist_ok=True)

    # Extract audio separately
    print("\n[2.1] Extracting audio...")
    extract_audio_cmd = [
        FFMPEG_BIN, "-y", "-i", src_video,
        "-vn", "-c:a", "aac", "-b:a", "96k",
        audio_path
    ]
    res = subprocess.run(extract_audio_cmd, capture_output=True, text=True)
    has_audio = os.path.exists(audio_path) and os.path.getsize(audio_path) > 1000
    print(f"Audio extracted successfully: {has_audio} ({audio_path})")

    # Run Fallback Chain: Method A -> B -> C
    active_method = None
    processed_count = 0
    motion_diffs = []
    alpha_coverages = []

    print("\n[2.2] Trying Method A (u2net_human_seg with ONNX runtime)...")
    try:
        cap.set(cv2.CAP_PROP_POS_FRAMES, 0)
        processed_count, motion_diffs, alpha_coverages = run_method_a_onnx(
            cap, fps, target_w, target_h, total_frames, frames_dir
        )
        active_method = "Method A (u2net_human_seg ONNX)"
        print(f"Method A completed successfully for {processed_count} frames.")
    except Exception as e:
        print(f"Method A failed with error: {e}. Falling back to next method...")

    if active_method is None:
        print("\n[2.2] Trying Method B (MediaPipe/Color Lab fallback)...")
        # Fallback implementation if needed
        raise RuntimeError("Method A failed and fallback needed!")

    cap.release()

    # Step 2.4: Save transparent WebM with audio
    alpha_webm = "public/media/aswin-intro-alpha.webm"
    print(f"\n[2.4] Encoding transparent WebM: {alpha_webm}...")
    
    # We will test CRF 32 as requested
    crf = 32
    for attempt in range(3):
        encode_cmd = [
            FFMPEG_BIN, "-y",
            "-framerate", str(fps),
            "-i", os.path.join(frames_dir, "%05d.png")
        ]
        if has_audio:
            encode_cmd.extend(["-i", audio_path])
        
        encode_cmd.extend([
            "-c:v", "libvpx-vp9",
            "-pix_fmt", "yuva420p",
            "-auto-alt-ref", "0",
            "-b:v", "0",
            "-crf", str(crf),
            "-row-mt", "1",
            "-deadline", "good",
            "-cpu-used", "2"
        ])
        if has_audio:
            encode_cmd.extend(["-c:a", "libopus", "-b:a", "96k", "-shortest"])
        encode_cmd.append(alpha_webm)

        print(f"Running ffmpeg encode (CRF {crf})...")
        enc_res = subprocess.run(encode_cmd, capture_output=True, text=True)
        if enc_res.returncode != 0:
            print("FFmpeg stderr:", enc_res.stderr)
            raise RuntimeError(f"FFmpeg encoding failed: {enc_res.stderr}")

        size_mb = os.path.getsize(alpha_webm) / (1024 * 1024)
        print(f"Encoded WebM size: {size_mb:.2f} MB")
        if size_mb <= 6.0:
            break
        print(f"Size {size_mb:.2f} MB exceeds 6MB. Retrying with higher CRF...")
        crf += 4

    # Step 2.5: Generate public/media/aswin-poster.png (transparent first frame)
    poster_src = os.path.join(frames_dir, "00000.png")
    poster_dst = "public/media/aswin-poster.png"
    shutil.copyfile(poster_src, poster_dst)
    print(f"[2.5] Generated transparent poster: {poster_dst}")

    # Step 2.6: Automatic Quality Check Loop
    print("\n[2.6] AUTOMATIC QUALITY CHECK LOOP")
    qa_report = {}

    # Check 1: ffprobe confirm pix_fmt yuva420p and audio stream
    probe_cmd = [FFMPEG_BIN, "-i", alpha_webm]
    probe_res = subprocess.run(probe_cmd, capture_output=True, text=True)
    probe_output = probe_res.stderr
    has_yuva420p = "yuva420p" in probe_output
    has_audio_stream = "Audio: opus" in probe_output or "Audio:" in probe_output
    qa_report["yuva420p_confirmed"] = has_yuva420p
    qa_report["audio_stream_confirmed"] = has_audio_stream
    print(f"  Quality Check 1 - pix_fmt yuva420p: {has_yuva420p}, audio: {has_audio_stream}")

    # Select 5 QA sample frames: start, middle, end, two high-motion frames
    sorted_motion = sorted(motion_diffs, key=lambda x: x[1], reverse=True)
    high_motion_1 = sorted_motion[0][0] if len(sorted_motion) > 0 else total_frames // 4
    high_motion_2 = sorted_motion[1][0] if len(sorted_motion) > 1 else (3 * total_frames) // 4
    sample_indices = [
        ("qa_frame_01_start.png", 0),
        ("qa_frame_02_motion1.png", high_motion_1),
        ("qa_frame_03_middle.png", total_frames // 2),
        ("qa_frame_04_motion2.png", high_motion_2),
        ("qa_frame_05_end.png", total_frames - 1)
    ]

    dark_room_bgr = np.array([26, 14, 10], dtype=np.float32) # #0a0e1a
    qa_checks_passed = True

    for name, idx in sample_indices:
        frame_file = os.path.join(frames_dir, f"{idx:05d}.png")
        if not os.path.exists(frame_file):
            frame_file = os.path.join(frames_dir, f"{min(idx, processed_count-1):05d}.png")
        rgba = cv2.imread(frame_file, cv2.IMREAD_UNCHANGED)
        bgr = rgba[:, :, :3].astype(np.float32)
        alpha = rgba[:, :, 3].astype(np.float32) / 255.0

        # Composite over dark room
        comp = (bgr * alpha[:, :, np.newaxis] + dark_room_bgr * (1.0 - alpha[:, :, np.newaxis])).astype(np.uint8)
        qa_path = os.path.join("scripts/qa", name)
        cv2.imwrite(qa_path, comp)

        # Measure (a): mean luminance of 3px ring outside alpha edge must be close to background
        # ring is where alpha is between 0.001 and 0.05
        ring_mask = (alpha > 0.001) & (alpha < 0.05)
        if np.any(ring_mask):
            ring_pixels = comp[ring_mask]
            ring_lum = np.mean(0.114 * ring_pixels[:, 0] + 0.587 * ring_pixels[:, 1] + 0.299 * ring_pixels[:, 2])
            bg_lum = 0.114 * dark_room_bgr[0] + 0.587 * dark_room_bgr[1] + 0.299 * dark_room_bgr[2]
            lum_diff = abs(ring_lum - bg_lum)
        else:
            lum_diff = 0.0

        # Measure (c): face/hoodie center opacity
        center_y, center_x = target_h // 2, target_w // 2
        center_patch_alpha = np.mean(alpha[center_y-50:center_y+50, center_x-50:center_x+50])

        print(f"  Sample {name} (Frame {idx}): ring_lum_diff={lum_diff:.2f}, center_opacity={center_patch_alpha:.3f}")
        if lum_diff > 15.0 or center_patch_alpha < 0.95:
            qa_checks_passed = False

    # Measure (b): alpha coverage stability
    coverages = np.array(alpha_coverages)
    diffs = np.abs(np.diff(coverages))
    max_jump = np.max(diffs)
    print(f"  Alpha coverage stability: max adjacent jump={max_jump:.4f} (must be < 0.05)")
    if max_jump >= 0.05:
        qa_checks_passed = False

    qa_report["active_method"] = active_method
    qa_report["output_size_mb"] = os.path.getsize(alpha_webm) / (1024 * 1024)
    qa_report["qa_checks_passed"] = qa_checks_passed
    with open("scripts/qa/qa_results.json", "w") as f:
        json.dump(qa_report, f, indent=2)

    print("\n" + "=" * 60)
    print(f"SUCCESS: Pipeline complete! Method used: {active_method}")
    print(f"Output alpha video: {alpha_webm} ({qa_report['output_size_mb']:.2f} MB)")
    print(f"QA Samples saved to: scripts/qa/")
    print(f"All QA checks passed: {qa_checks_passed}")
    print("=" * 60)

if __name__ == "__main__":
    main()
