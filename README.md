# AI Resume Tailorer & ATS Optimization Engine

[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)](https://www.typescriptlang.org/)
[![React 19](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![Express](https://img.shields.io/badge/Express-4.x-000000?logo=express)](https://expressjs.com/)
[![Gemini 3.8 Flash](https://img.shields.io/badge/Google_GenAI-Gemini_3.8_Flash-8E75B2?logo=google)](https://ai.google.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> Transform base resumes and target job descriptions into ATS-optimized, precisely structured resumes while keeping every word **100% honest with no made-up experience**.

---

## Overview

Applying for technical roles requires tailoring your resume to every job description to pass Applicant Tracking Systems (Workday, Greenhouse, Lever, Taleo). However, typical AI tools often make things up—inventing fake numbers, dates, or technical skills that fail background checks and technical interviews.

**AI Resume Tailorer & ATS Optimization Engine** eliminates this manual friction while keeping your real experience 100% truthful through a clear **two-step workflow**:

1. **Step 1 — Check for Missing Skills**: Compares your resume against the job description, spots missing requirements, and asks you directly before changing anything.
2. **Step 2 — ATS Keyword Optimization & Bullet Refinement**: Reframes your existing bullet points using strong action words and exact job keywords, leaving out unconfirmed skills so your resume stays completely genuine.

---

## Key Features

- **100% Real Experience (No Made-Up Information)**: Never invents metrics, companies, dates, or unverified skills. Missing job requirements are checked with you first and strictly left off unless you confirm them.
- **Interactive Verification Wizard**: Keyboard-driven interview (`[Y]` Have Experience, `[N]` No Experience, `[F]` Familiar/Studying) with verified project context injection.
- **2026 Developer Studio UI**: Designed with modern obsidian/zinc surfaces, architectural drafting desk canvas, and zero-pill typographic discipline.
- **Semantic Diff Inspector**: High-precision token diff highlighting matched JD keywords (emerald) and power action verbs (indigo).
- **Radial ATS Parser Radar**: Real-time score meter showing before/after match delta (`+40% Optimized`), keyword coverage, and truthfulness certificate.
- **Multi-Format Export Hub**:
  - **Printable PDF**: Single-column ATS format with 0.75-inch margins and standard system typography.
  - **Microsoft Word (.doc)**: Word/Google Docs/LibreOffice compatible layout.
  - **ATS Plain Text (.txt)**: Clean ASCII/UTF-8 format for legacy enterprise application portals.
  - **Strict Schema JSON**: Conforms exactly to the specified JSON schema payload.
- **Dual-Engine Resilience**: Live server-side Gemini 3.8 Flash with a deterministic fallback engine guaranteeing 100% uptime with sub-4.5s response times.
- **Preloaded Technical Presets**: 1-click engineering benchmarks (Senior Full-Stack → Staff Platform & AI, Senior Frontend → Lead Architect, Backend → Distributed Systems Lead).

---

## Two-Phase Engine Workflow

```
┌─────────────────────────────────┐
│     1. Intake & Preset Setup    │
│  Upload Resume PDF/Text + JD    │
└────────────────┬────────────────┘
                 │
                 ▼
┌─────────────────────────────────┐
│ 2. Phase 1: Gap Questionnaire   │
│  Detects missing JD skills &    │
│  prompts candidate verification │
└────────────────┬────────────────┘
                 │ Candidate-confirmed context
                 ▼
┌─────────────────────────────────┐
│ 3. Phase 2: Dynamic Tailoring   │
│  Reframes bullets & power verbs │
│  Enforces strict factual bounds │
└────────────────┬────────────────┘
                 │
                 ▼
┌─────────────────────────────────┐
│ 4. Verification & Export Hub    │
│  Diff Viewer · ATS Score Radar  │
│  PDF · Word · PlainText · JSON  │
└─────────────────────────────────┘
```

---

## Required JSON Schema Specification

The backend engine outputs structured JSON adhering to this schema:

```json
{
  "type": "object",
  "properties": {
    "missing_keywords_and_questions": {
      "type": "array",
      "items": { "type": "string" },
      "description": "List of critical missing JD requirements phrased as questions for user verification."
    },
    "tailored_resume": {
      "type": "object",
      "properties": {
        "summary": { "type": "string", "description": "A concise, tailored professional summary aligned with the JD." },
        "experiences": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "company": { "type": "string" },
              "role": { "type": "string" },
              "dates": { "type": "string" },
              "bullet_points": {
                "type": "array",
                "items": { "type": "string" },
                "description": "Dynamically rewritten bullet points optimized for ATS keywords without fabricating data."
              }
            },
            "required": ["company", "role", "dates", "bullet_points"]
          }
        },
        "skills": {
          "type": "array",
          "items": { "type": "string" },
          "description": "Categorized or prioritized list of skills matching the JD."
        }
      },
      "required": ["summary", "experiences", "skills"]
    }
  },
  "required": ["missing_keywords_and_questions", "tailored_resume"]
}
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend Framework** | [React 19](https://react.dev/) + [Vite 8](https://vitejs.dev/) |
| **Styling & Design** | [Tailwind CSS v4](https://tailwindcss.com/) (Obsidian 2026 theme) |
| **Typography** | `Plus Jakarta Sans` (Display/Prose) + `JetBrains Mono` (Diff tokens & metrics) |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Backend Server** | [Express 4](https://expressjs.com/) on [Node.js](https://nodejs.org/) via `tsx` |
| **AI Orchestration** | [`@google/genai` TypeScript SDK](https://github.com/google-gemini/deprecations) (`gemini-3.8-flash`) |
| **Multimodal Ingestion** | Base64 PDF parsing & raw text normalization |

---

## Getting Started

### Prerequisites

- **Node.js**: v20.0.0 or higher
- **npm**: v10.0.0 or higher
- **Gemini API Key** *(Optional)*: Obtainable from [Google AI Studio](https://aistudio.google.com/). The app features an intelligent fallback engine that functions even without an active key.

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/ai-resume-tailorer.git
   cd ai-resume-tailorer
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables**:
   Create a `.env` file in the root directory (or copy from `.env.example`):
   ```bash
   cp .env.example .env
   ```
   Add your Gemini API key:
   ```env
   GEMINI_API_KEY="your-gemini-api-key-here"
   PORT=3000
   ```

4. **Start the development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Production Build

To compile and launch the production build:

```bash
# 1. Compile client assets to dist/
npm run build

# 2. Start the full-stack Express production server
npm start
```

---

## Project Structure

```
├── server.ts                  # Express full-stack backend with @google/genai & fallback engine
├── src/
│   ├── App.tsx                # Main view router & workflow state orchestration
│   ├── main.tsx               # Client React DOM entry point
│   ├── index.css              # Tailwind v4 styles, desk drafting grid, and print media rules
│   ├── types.ts               # Strict resume JSON schema and gap questionnaire types
│   ├── presets.ts             # Realistic engineering benchmark profiles
│   ├── components/
│   │   ├── Header.tsx         # Top Bar Contract header with engine status badge
│   │   ├── IntakeView.tsx     # PDF/Text uploader, target JD editor, and preset selector
│   │   ├── GapWizardModal.tsx # Keyboard-driven candidate verification interview modal
│   │   ├── ResumePreview.tsx  # Studio desk canvas, inline editor, and export triggers
│   │   ├── DiffViewer.tsx     # Semantic diff highlighting JD keywords & action verbs
│   │   ├── AtsScoreCard.tsx   # Radial ATS match radar and truthfulness metrics
│   │   └── JsonViewer.tsx     # Schema validation inspector and JSON exporter
│   └── utils/
│       └── exportUtils.ts     # Word (.doc), Plain Text (.txt), JSON, and Print triggers
├── package.json
└── tsconfig.json
```

---

## License

This project is licensed under the [MIT License](LICENSE).
