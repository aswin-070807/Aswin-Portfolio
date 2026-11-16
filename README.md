<div align="center">

# 🕵️‍♂️ Aswin A — Creative Portfolio

<p align="center">
  <strong>An immersive, detective dossier–themed personal portfolio showcasing full-stack engineering, AI solutions, and hackathon-winning projects.</strong>
</p>

[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![TanStack Router](https://img.shields.io/badge/TanStack_Router-Start-FF4154?style=for-the-badge&logo=react-router&logoColor=white)](https://tanstack.com/router)
[![Vite](https://img.shields.io/badge/Vite-Bundler-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](LICENSE)

<br />

[Explore Features](#-key-features) •
[Architecture](#-project-architecture) •
[Quickstart](#-getting-started) •
[Environment Variables](#-environment-variables) •
[Connect](#-get-in-touch)

</div>

---

## 📌 Overview

This repository houses the personal portfolio of **Aswin A**, a Computer Science & Engineering scholar, software developer, and 3× National Hackathon Finalist. 

Engineered with a cohesive **investigative case-file motif**, the site transforms traditional portfolio sections into an interactive evidentiary experience—from pinned hero sheets and open passport dossiers to evidence locker projects and a secure tip-line dispatch console.

---

## ✨ Key Features

### 🛂 Interactive Passport Bio & Verified Profiles
- **Passport Identity Booklet**: Styled as an open, authentic travel passport featuring official watermarks, security patterns, and gold emblem details.
- **Luggage Tag Profiles**: Tactile, tilted luggage tag links to verified coding profiles on **LeetCode**, **CodeChef**, and **LinkedIn**.
- **Visa Entry Stamps**: Dynamic animated rubber stamps certifying technical competencies and achievements.

### 🗂️ Case Conclusion & Findings
- **Typed Index Cards**: Redesigned findings section mimicking vintage case-closed index cards stamped with authenticated verdicts.
- **Dynamic Accent Typography**: Signature handwritten notes and typewriter-styled evidentiary summaries.

### 📁 Evidence Locker (Projects)
- **Classified Case Files**: Interactive folder tabs highlighting flagship products:
  - **Smart Study AI**: AI-driven comprehension platform empowering students to understand complex academic material.
  - **Caliper AI**: Precision competency and skill-gap identification engine built for statistical cadres.
  - **Being Myself: Anthology**: Published literary contribution alongside 60 distinguished authors.

### ⚡ Direct Drive Resume Retrieval
- **Google Drive API v3 Integration**: Automatically queries and fetches the newest PDF resume directly from a shared Google Drive folder.
- **In-Memory Caching**: Prefetches the PDF blob into memory on initial load, enabling instant, zero-latency downloads without navigating away from the page.

### 📟 Tip-Line Dispatch (Contact Form)
- **Functional FormSubmit AJAX Integration**: Dispatches inquiries directly to `aswinacse787@gmail.com` with zero external dependencies.
- **Honeypot Spam Protection**: Silent spam-trap defense using hidden verification fields.
- **Telemetry Console**: Interactive audio-feed frequency bars, live status badges, and single-click clipboard copy for email and phone.

### 🔦 Atmospheric Fog & Haptic Micro-Interactions
- Custom cursor flashlight/fog reveal effect reacting smoothly to pointer movement.
- Full responsive design adhering strictly to smooth 60fps transitions and accessible standards.

---

## 🛠️ Tech Stack

| Domain | Technologies |
| :--- | :--- |
| **Frontend Core** | React 19, TypeScript, TanStack Start, TanStack Router |
| **Styling & UI** | Tailwind CSS, shadcn/ui, Radix UI primitives, Lucide Icons |
| **Motion & FX** | Framer Motion, Canvas API, Custom CSS Hardware-Accelerated Transforms |
| **Data & APIs** | Google Drive API v3 (REST), FormSubmit AJAX, TanStack Query |
| **Build & Tooling** | Vite, Nitro, TypeScript Compiler, ESLint, Prettier |

---

## 🏗️ Project Architecture

```plaintext
aswin-portfolio/
├── public/                 # Static assets, favicon, robots.txt, photos
│   └── assets/             # Brand imagery and portraits
├── src/
│   ├── components/
│   │   ├── portfolio/      # Core thematic dossier sections
│   │   │   ├── AboutDossier.tsx            # Passport booklet & verified tags
│   │   │   ├── CaseConclusionFindings.tsx  # Typed finding index cards
│   │   │   ├── Contact.tsx                 # Tip-line transmission console
│   │   │   ├── CursorFog.tsx               # Interactive cursor fog reveal
│   │   │   ├── EducationAcademicForm.tsx   # Academic profile form
│   │   │   ├── ExperienceServiceRecord.tsx # Field record & service badge
│   │   │   ├── Hero.tsx                    # Case file cover & introduction
│   │   │   ├── ProjectsEvidenceLocker.tsx  # Interactive evidence files
│   │   │   ├── ResumeButton.tsx            # Fast direct-download action
│   │   │   └── ToolkitSurveillance.tsx     # Technical skills inventory
│   │   └── ui/             # Reusable shadcn/ui primitives
│   ├── data/               # Type-safe portfolio datasets and fallbacks
│   ├── hooks/              # Custom React hooks (device, state, audio)
│   ├── lib/                # Core helpers, Drive API integration, utilities
│   ├── routes/             # TanStack file-based routing (__root, index)
│   └── styles.css          # Design system variables, themes, keyframes
├── vite.config.ts          # Bundler configuration
└── package.json            # Dependencies and npm scripts
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed on your local machine:
- **Node.js** (v18.0.0 or higher)
- **npm** or **bun** / **pnpm**

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/aswin-070807/Aswin-Portfolio.git
   cd Aswin-Portfolio
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Copy the example environment template and add your credentials:
   ```bash
   cp .env.example .env
   ```

4. **Start the local development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:8080](http://localhost:8080) (or the displayed port) in your browser.

---

## 🔐 Environment Variables

Create a `.env` file in the root directory to enable cloud integrations:

| Variable | Required | Description |
| :--- | :---: | :--- |
| `VITE_DRIVE_API_KEY` | Optional | Google Drive API v3 key used to automatically fetch and download the latest resume PDF. |

> *Note: If no API key is provided, the application gracefully falls back to the bundled local resume asset without interrupting the user experience.*

---

## 🚢 Building for Production

To create an optimized production build:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

---

## 📬 Get in Touch

Feel free to connect or reach out for collaborations, hackathons, or opportunities:

- **Portfolio**: [aswin-portfolio](https://github.com/aswin-070807/Aswin-Portfolio)
- **LinkedIn**: [linkedin.com/in/aswin-a-709091293](https://www.linkedin.com/in/aswin-a-709091293)
- **GitHub**: [@aswin-070807](https://github.com/aswin-070807)
- **LeetCode**: [leetcode.com/u/Aswin787](https://leetcode.com/u/Aswin787)
- **CodeChef**: [codechef.com/users/aswina_srit](https://www.codechef.com/users/aswina_srit)
- **Email**: [aswinacse787@gmail.com](mailto:aswinacse787@gmail.com)

---

<div align="center">
  <sub>Designed & Developed with precision by <strong>Aswin A</strong> • &copy; 2026 All Rights Reserved</sub>
</div>
