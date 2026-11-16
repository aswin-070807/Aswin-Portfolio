import { useQuery } from "@tanstack/react-query";

export interface CertificateItem {
  id: string;
  name: string;
  rawName: string;
  category: "MATLAB" | "Online Certification" | "Workshop" | string;
  viewUrl: string;
  previewUrl: string;
}

export const CERTIFICATE_FOLDERS = [
  { id: "1qQLWztV6_v91-NGMdQcyvt7ifcsMF9tL", category: "MATLAB" },
  { id: "1QdtqfFG7SDgVaiOLqwQMDtdZmTBSBjAz", category: "Online Certification" },
  { id: "1AnFi5PZx7d45eemGyNv0Au_n1k8b66oq", category: "Workshop" },
];

const MATLAB_TOPIC_MAP: Record<string, string> = {
  COMMONDATAANALYSISTECHNIQUE: "Common Data Analysis Techniques",
  CONFIGURESIMULINKSOLVERS: "Configure Simulink Solvers",
  LINEARALGEBRA: "Linear Algebra",
  LINEARIZATIONOFNONLINEARSYSTEMS: "Linearization of Nonlinear Systems",
  MACHINELEARNINGONRAMP: "Machine Learning Onramp",
  MODELDYNAMICS: "Model Dynamics",
  STATISTICSONRAMP: "Statistics Onramp",
  VECTORANDMATRICES: "Vectors & Matrices",
  CALCULATIONSONGROUPEDDATA: "Calculations on Grouped Data",
  CLEANANDPREPAREDATAFORANALYSIS: "Clean & Prepare Data for Analysis",
  DATAANALYSIS: "Data Analysis",
  FINDANDEXTRACTSUBSETSOFDATA: "Find & Extract Subsets of Data",
  TABLES: "Working with Tables",
  MATLABONRAMP: "MATLAB Onramp",
};

export function formatCertName(rawName: string, category: string): string {
  let name = rawName
    .replace(/\.(?:pdf|png|jpg|jpeg|webp)$/i, "")
    .replace(/^x22/i, "")
    .replace(/\+/g, " ")
    .replace(/_/g, " ")
    .replace(/\s*\(\d+\)$/, "")
    .trim();

  // Check MATLAB topic map
  const upperClean = name
    .replace(/^MATLAB(?:CERTIFICATE)?-?/i, "")
    .trim()
    .toUpperCase();
  if (category === "MATLAB" && MATLAB_TOPIC_MAP[upperClean]) {
    const topic = MATLAB_TOPIC_MAP[upperClean];
    return topic.includes("MATLAB") ? topic : `${topic} (MATLAB)`;
  }

  // Handle specific title cleanups
  name = name.replace(/^Aswin A - /i, "");
  name = name.replace(/^aswin-a-/i, "");
  name = name.replace(/canva-for-work-certificate.*/i, "Canva for Work Certificate");
  name = name.replace(
    /graphic-design-essentials-certificate.*/i,
    "Graphic Design Essentials Certificate",
  );
  name = name.replace(/Google certification.*/i, "Google Cloud & Analytics Certification");
  name = name.replace(/NPTEL DESIGN THINKING PRIMER/i, "Design Thinking: A Primer (NPTEL)");
  name = name.replace(/Professional English/i, "Government Certified Typist — English");

  // Title case if ALL CAPS
  if (name === name.toUpperCase() && name.length > 5) {
    name = name
      .toLowerCase()
      .split(" ")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  }

  return name.trim();
}

// Seed fallback data matching all 24 certificates from the 3 Google Drive folders
export const fallbackCertificates: CertificateItem[] = [
  // Folder 1: MATLAB
  {
    id: "1Cxni9QlPQWRUM1A1sSvv-EuqUCu46k7J",
    rawName: "MATLAB-COMMONDATAANALYSISTECHNIQUE.pdf",
    name: "Common Data Analysis Techniques (MATLAB)",
    category: "MATLAB",
    viewUrl: "https://drive.google.com/file/d/1Cxni9QlPQWRUM1A1sSvv-EuqUCu46k7J/view",
    previewUrl: "https://drive.google.com/file/d/1Cxni9QlPQWRUM1A1sSvv-EuqUCu46k7J/preview",
  },
  {
    id: "1Tul6dshpti9Cut65FJedpdq9IABH5Jnj",
    rawName: "MATLAB-CONFIGURESIMULINKSOLVERS.pdf",
    name: "Configure Simulink Solvers (MATLAB)",
    category: "MATLAB",
    viewUrl: "https://drive.google.com/file/d/1Tul6dshpti9Cut65FJedpdq9IABH5Jnj/view",
    previewUrl: "https://drive.google.com/file/d/1Tul6dshpti9Cut65FJedpdq9IABH5Jnj/preview",
  },
  {
    id: "1KCvExUehDZOomWDgUIH6uJQ6nixGkZ9N",
    rawName: "MATLAB-LINEARALGEBRA.pdf",
    name: "Linear Algebra (MATLAB)",
    category: "MATLAB",
    viewUrl: "https://drive.google.com/file/d/1KCvExUehDZOomWDgUIH6uJQ6nixGkZ9N/view",
    previewUrl: "https://drive.google.com/file/d/1KCvExUehDZOomWDgUIH6uJQ6nixGkZ9N/preview",
  },
  {
    id: "1c3ivFM14ViueY5Btd8JnTLXGuMqRViSm",
    rawName: "MATLAB-LINEARIZATIONOFNONLINEARSYSTEMS.pdf",
    name: "Linearization of Nonlinear Systems (MATLAB)",
    category: "MATLAB",
    viewUrl: "https://drive.google.com/file/d/1c3ivFM14ViueY5Btd8JnTLXGuMqRViSm/view",
    previewUrl: "https://drive.google.com/file/d/1c3ivFM14ViueY5Btd8JnTLXGuMqRViSm/preview",
  },
  {
    id: "1fbTYr2amCq593vSbHQOOQjY4v3lPMaUW",
    rawName: "MATLAB-MACHINELEARNINGONRAMP.pdf",
    name: "Machine Learning Onramp (MATLAB)",
    category: "MATLAB",
    viewUrl: "https://drive.google.com/file/d/1fbTYr2amCq593vSbHQOOQjY4v3lPMaUW/view",
    previewUrl: "https://drive.google.com/file/d/1fbTYr2amCq593vSbHQOOQjY4v3lPMaUW/preview",
  },
  {
    id: "1ozf3DD2fmdpk1uF52C3iGfXiTegQNijR",
    rawName: "MATLAB-MODELDYNAMICS.pdf",
    name: "Model Dynamics (MATLAB)",
    category: "MATLAB",
    viewUrl: "https://drive.google.com/file/d/1ozf3DD2fmdpk1uF52C3iGfXiTegQNijR/view",
    previewUrl: "https://drive.google.com/file/d/1ozf3DD2fmdpk1uF52C3iGfXiTegQNijR/preview",
  },
  {
    id: "1UCvov3XNrO98EmuyOMdKig3cqyma9lB-",
    rawName: "MATLAB-STATISTICSONRAMP.pdf",
    name: "Statistics Onramp (MATLAB)",
    category: "MATLAB",
    viewUrl: "https://drive.google.com/file/d/1UCvov3XNrO98EmuyOMdKig3cqyma9lB-/view",
    previewUrl: "https://drive.google.com/file/d/1UCvov3XNrO98EmuyOMdKig3cqyma9lB-/preview",
  },
  {
    id: "1HvC5nS7E8UllCy2VggVGLE2Kj4iQeTF9",
    rawName: "MATLAB-VECTORANDMATRICES.pdf",
    name: "Vectors & Matrices (MATLAB)",
    category: "MATLAB",
    viewUrl: "https://drive.google.com/file/d/1HvC5nS7E8UllCy2VggVGLE2Kj4iQeTF9/view",
    previewUrl: "https://drive.google.com/file/d/1HvC5nS7E8UllCy2VggVGLE2Kj4iQeTF9/preview",
  },
  {
    id: "12kd2ptTMXtWzEVQlnG1YuU9bgMT4h8oX",
    rawName: "MATLABCERTIFICATE-CALCULATIONSONGROUPEDDATA.pdf",
    name: "Calculations on Grouped Data (MATLAB)",
    category: "MATLAB",
    viewUrl: "https://drive.google.com/file/d/12kd2ptTMXtWzEVQlnG1YuU9bgMT4h8oX/view",
    previewUrl: "https://drive.google.com/file/d/12kd2ptTMXtWzEVQlnG1YuU9bgMT4h8oX/preview",
  },
  {
    id: "1AYwgsZuZklQkXX3CAqHHMBqXILaF27TR",
    rawName: "MATLABCERTIFICATE-CLEANANDPREPAREDATAFORANALYSIS.pdf",
    name: "Clean & Prepare Data for Analysis (MATLAB)",
    category: "MATLAB",
    viewUrl: "https://drive.google.com/file/d/1AYwgsZuZklQkXX3CAqHHMBqXILaF27TR/view",
    previewUrl: "https://drive.google.com/file/d/1AYwgsZuZklQkXX3CAqHHMBqXILaF27TR/preview",
  },
  {
    id: "1EhxfszqsYw5oUpwuAGTdUfn4dPo3O-fz",
    rawName: "MATLABCERTIFICATE-DATAANALYSIS.pdf",
    name: "Data Analysis (MATLAB)",
    category: "MATLAB",
    viewUrl: "https://drive.google.com/file/d/1EhxfszqsYw5oUpwuAGTdUfn4dPo3O-fz/view",
    previewUrl: "https://drive.google.com/file/d/1EhxfszqsYw5oUpwuAGTdUfn4dPo3O-fz/preview",
  },
  {
    id: "159_vSerhyoTbIfGuKl_K2n-i5stzPXeK",
    rawName: "MATLABCERTIFICATE-FINDANDEXTRACTSUBSETSOFDATA.pdf",
    name: "Find & Extract Subsets of Data (MATLAB)",
    category: "MATLAB",
    viewUrl: "https://drive.google.com/file/d/159_vSerhyoTbIfGuKl_K2n-i5stzPXeK/view",
    previewUrl: "https://drive.google.com/file/d/159_vSerhyoTbIfGuKl_K2n-i5stzPXeK/preview",
  },
  {
    id: "1Va2YIEazMrkr2ntTvgd_U_4lyZ4RR5MY",
    rawName: "MATLABCERTIFICATE-TABLES.pdf",
    name: "Working with Tables (MATLAB)",
    category: "MATLAB",
    viewUrl: "https://drive.google.com/file/d/1Va2YIEazMrkr2ntTvgd_U_4lyZ4RR5MY/view",
    previewUrl: "https://drive.google.com/file/d/1Va2YIEazMrkr2ntTvgd_U_4lyZ4RR5MY/preview",
  },
  {
    id: "1jBgDLGJOXLxjrKJIR2ogha9GSOE_r_7p",
    rawName: "MATLABONRAMP.pdf",
    name: "MATLAB Onramp",
    category: "MATLAB",
    viewUrl: "https://drive.google.com/file/d/1jBgDLGJOXLxjrKJIR2ogha9GSOE_r_7p/view",
    previewUrl: "https://drive.google.com/file/d/1jBgDLGJOXLxjrKJIR2ogha9GSOE_r_7p/preview",
  },

  // Folder 2: Online Certification
  {
    id: "13RXBIwQoYwuGXq6OMmtggwOrd_tDEUSe",
    rawName: "Aswin A - Prompt Engineering Certificate.pdf",
    name: "Prompt Engineering Certificate",
    category: "Online Certification",
    viewUrl: "https://drive.google.com/file/d/13RXBIwQoYwuGXq6OMmtggwOrd_tDEUSe/view",
    previewUrl: "https://drive.google.com/file/d/13RXBIwQoYwuGXq6OMmtggwOrd_tDEUSe/preview",
  },
  {
    id: "1GPRyIpqhQL6aXbljW2MlydAYGoSz9_bb",
    rawName: "aswin-a-canva-for-work-certificate_20260416_101129_0000.pdf",
    name: "Canva for Work Certificate",
    category: "Online Certification",
    viewUrl: "https://drive.google.com/file/d/1GPRyIpqhQL6aXbljW2MlydAYGoSz9_bb/view",
    previewUrl: "https://drive.google.com/file/d/1GPRyIpqhQL6aXbljW2MlydAYGoSz9_bb/preview",
  },
  {
    id: "10vp3WalHaPiG56NJu8uMIS0Z_CBbpi3U",
    rawName: "aswin-a-graphic-design-essentials-certificate_20260424_204045_0000.pdf",
    name: "Graphic Design Essentials Certificate",
    category: "Online Certification",
    viewUrl: "https://drive.google.com/file/d/10vp3WalHaPiG56NJu8uMIS0Z_CBbpi3U/view",
    previewUrl: "https://drive.google.com/file/d/10vp3WalHaPiG56NJu8uMIS0Z_CBbpi3U/preview",
  },
  {
    id: "19Z8yz7DF2wUeu_et61YtvEEEsDNV4wI_",
    rawName: "Diploma+in+Administrative+Human+Resources+Management+(HRM).pdf",
    name: "Diploma in Administrative Human Resources Management (HRM)",
    category: "Online Certification",
    viewUrl: "https://drive.google.com/file/d/19Z8yz7DF2wUeu_et61YtvEEEsDNV4wI_/view",
    previewUrl: "https://drive.google.com/file/d/19Z8yz7DF2wUeu_et61YtvEEEsDNV4wI_/preview",
  },
  {
    id: "1cO8loGZSxZZl-4VsdbphGXOlTrwxL0Jf",
    rawName: "Google certification (1).pdf",
    name: "Google Cloud & Analytics Certification",
    category: "Online Certification",
    viewUrl: "https://drive.google.com/file/d/1cO8loGZSxZZl-4VsdbphGXOlTrwxL0Jf/view",
    previewUrl: "https://drive.google.com/file/d/1cO8loGZSxZZl-4VsdbphGXOlTrwxL0Jf/preview",
  },
  {
    id: "139NSxOBpikSBIdTZDEEs2UKZBtaGr5Td",
    rawName: "NPTEL DESIGN THINKING PRIMER.pdf",
    name: "Design Thinking: A Primer (NPTEL)",
    category: "Online Certification",
    viewUrl: "https://drive.google.com/file/d/139NSxOBpikSBIdTZDEEs2UKZBtaGr5Td/view",
    previewUrl: "https://drive.google.com/file/d/139NSxOBpikSBIdTZDEEs2UKZBtaGr5Td/preview",
  },
  {
    id: "11-hGH_hQCzrsy8pnt-vIx-BDhJq8o7ne",
    rawName: "Professional English.jpg",
    name: "Government Certified Typist — English",
    category: "Online Certification",
    viewUrl: "https://drive.google.com/file/d/11-hGH_hQCzrsy8pnt-vIx-BDhJq8o7ne/view",
    previewUrl: "https://drive.google.com/file/d/11-hGH_hQCzrsy8pnt-vIx-BDhJq8o7ne/preview",
  },
  {
    id: "1N--0Ls4fbyjTV6khnj3tPsZY8G63ZOwE",
    rawName: "Professional Networking for Career Growth.pdf",
    name: "Professional Networking for Career Growth",
    category: "Online Certification",
    viewUrl: "https://drive.google.com/file/d/1N--0Ls4fbyjTV6khnj3tPsZY8G63ZOwE/view",
    previewUrl: "https://drive.google.com/file/d/1N--0Ls4fbyjTV6khnj3tPsZY8G63ZOwE/preview",
  },

  // Folder 3: Workshop
  {
    id: "19SePcyS_Ex-mjHUoYpEnYr3H7lb_jdn0",
    rawName: "IIT Bombay Illuminate workshop.pdf",
    name: "IIT Bombay Illuminate Workshop",
    category: "Workshop",
    viewUrl: "https://drive.google.com/file/d/19SePcyS_Ex-mjHUoYpEnYr3H7lb_jdn0/view",
    previewUrl: "https://drive.google.com/file/d/19SePcyS_Ex-mjHUoYpEnYr3H7lb_jdn0/preview",
  },
  {
    id: "1vWpO3-WM6oinaFhpFGA8Hefotab1q7GI",
    rawName: "TEDxSRIT_Certificate_Aswin_A.pdf",
    name: "TEDxSRIT Certificate",
    category: "Workshop",
    viewUrl: "https://drive.google.com/file/d/1vWpO3-WM6oinaFhpFGA8Hefotab1q7GI/view",
    previewUrl: "https://drive.google.com/file/d/1vWpO3-WM6oinaFhpFGA8Hefotab1q7GI/preview",
  },
];

// Server-side extractor from Google Drive public folder page
export async function extractFilesFromDriveFolder(
  folderId: string,
  category: string,
): Promise<CertificateItem[]> {
  try {
    const timestamp = Date.now();
    const url = `https://drive.google.com/drive/folders/${folderId}?_t=${timestamp}`;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 7000);

    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
      },
    });
    clearTimeout(timeout);

    if (!res.ok) return [];

    const html = await res.text();
    const regex =
      /aria-label="([^"]+?)(?:\s+(?:PDF|Shared|Image|Document|\(\w+\)))*"\s+data-handled-by-drag-and-drop="true"\s+ssk='[^']*:([a-zA-Z0-9_-]{25,})-[^']*'/gi;

    let m: RegExpExecArray | null;
    const items: CertificateItem[] = [];
    const seen = new Set<string>();

    while ((m = regex.exec(html)) !== null) {
      const rawName = m[1]?.trim() || "";
      if (
        !rawName ||
        rawName.includes("Shared folder") ||
        (rawName.endsWith(".png") && rawName.includes("icon"))
      ) {
        continue;
      }

      const id = (m[2] || "").replace(/-[0-9]+$/, "");
      if (!id || seen.has(id)) continue;
      seen.add(id);

      items.push({
        id,
        rawName,
        name: formatCertName(rawName, category),
        category,
        viewUrl: `https://drive.google.com/file/d/${id}/view`,
        previewUrl: `https://drive.google.com/file/d/${id}/preview`,
      });
    }

    return items;
  } catch (err) {
    console.warn(`Error extracting from folder ${folderId}:`, err);
    return [];
  }
}

export async function fetchAllDriveCertificates(): Promise<CertificateItem[]> {
  const all: CertificateItem[] = [];

  for (const folder of CERTIFICATE_FOLDERS) {
    const folderItems = await extractFilesFromDriveFolder(folder.id, folder.category);
    if (folderItems.length > 0) {
      all.push(...folderItems);
    } else {
      // If folder fetch timed out, fall back to matching items from seed
      const seeded = fallbackCertificates.filter((c) => c.category === folder.category);
      all.push(...seeded);
    }
  }

  return all.length > 0 ? all : fallbackCertificates;
}

const LOCAL_STORAGE_KEY = "aswin_portfolio_certificates_cache";

export async function fetchCertificatesClient(): Promise<CertificateItem[]> {
  try {
    const res = await fetch(`/api/certificates?t=${Date.now()}`, {
      cache: "no-store",
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
      },
    });

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        if (typeof window !== "undefined") {
          try {
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
          } catch {
            // Ignore storage quotas
          }
        }
        return data as CertificateItem[];
      }
    }
  } catch {
    // Fall back to cache or seed
  }

  if (typeof window !== "undefined") {
    try {
      const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed as CertificateItem[];
        }
      }
    } catch {
      // Ignore cache parse error
    }
  }

  return fallbackCertificates;
}

export function useCertificates() {
  return useQuery({
    queryKey: ["certificates-live-sync"],
    queryFn: fetchCertificatesClient,
    placeholderData: fallbackCertificates,
    staleTime: 0, // Always fresh
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchInterval: 30000, // Poll every 30 seconds
  });
}
