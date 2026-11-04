# AI Resume Tailorer & ATS Optimization Engine

A production-grade application that eliminates the manual friction of tailoring technical resumes to target Job Descriptions (JDs) while strictly enforcing factual bounds (zero hallucination). It combines Gemini-powered gap detection, an interactive verification wizard, dynamic ATS keyword reframing, and multi-format export capabilities.

## User Review & Critical Decisions

> [!IMPORTANT]
> The following product decisions were confirmed during the interactive interview:
> - **Gap Verification UX**: Full interactive wizard with quick yes/no/detail prompts and context input.
> - **Export Formats Supported**: Formatted PDF (print-ready ATS styling), Word (.docx format), Clean ATS Plain Text (.txt), and Strict Schema JSON payload.
> - **Preset Scenarios**: Preloaded realistic technical resume and job description presets for instant one-click testing and demonstration.

---

## 1. Overview & Core Concept

### What It Does
1. **Intake & Extraction**: Accepts a base resume (PDF file upload or text) and a target Job Description (text or URL paste).
2. **Phase 1 — Gap Analysis & Questions**: Extracts critical JD requirements, tools, frameworks, and qualifications absent from the resume, generating focused clarification questions adhering to the schema's `missing_keywords_and_questions` array.
3. **Interactive Verification Wizard**: Guides candidates through missing requirements so they can claim real experience (with specifics) or declare no experience, ensuring zero fabricated metrics or unverified roles.
4. **Phase 2 — Dynamic ATS Tailoring**: Reframes resume bullets using JD action verbs, industry terminology, and validated candidate inputs.
5. **ATS Analytics & Diff Comparison**: Displays a before/after semantic diff, keyword match rate, and verified facts log.
6. **Strict Schema JSON & Document Exports**: Delivers the exact required JSON payload along with print-ready PDF, Word document, and clean plain text.

---

## 2. User Experience & Visual Design

### Key User Flows
```
┌─────────────────────────┐     ┌─────────────────────────┐     ┌─────────────────────────┐
│   1. Intake & Presets   │ ──> │   2. Gap Verification   │ ──> │  3. ATS Tailoring Hub   │
│  Resume PDF/Text + JD   │     │   Interactive Wizard    │     │  Diff, Score & Exports  │
└─────────────────────────┘     └─────────────────────────┘     └─────────────────────────┘
```

- **Step 1: Intake & Setup**
  - Split-screen workspace: Left panel for Base Resume (file dropzone supporting PDF, TXT, MD or direct text editor); Right panel for Target Job Description.
  - Preset Selector Toolbar: One-click presets (e.g. "Senior Full-Stack to Staff Platform Engineer", "Frontend Engineer to React Architect", "Backend Go/Cloud Engineer to Distributed Systems Lead").
  - "Run ATS Gap Analysis" primary action.

- **Step 2: Gap Verification Wizard**
  - Focused wizard step walking through each generated question in `missing_keywords_and_questions`.
  - For each item: Displays why the JD prioritizes this skill, with 3 quick-action choices:
    - *Yes, I have experience*: Opens an inline detail box ("Describe where, how, or which project").
    - *No experience*: Safely excludes it from the resume (no hallucinations).
    - *Familiar / Self-directed learning*: Frames it under foundational knowledge without claiming professional production ownership.
  - Progress tracker showing verified gaps and remaining items.

- **Step 3: Optimization Results & Review**
  - **ATS Match Score & Keyword Matrix**: Real-time match percentage, exact JD keywords incorporated, and gap resolution status.
  - **Interactive Bullet Diff**: Side-by-side comparison of original bullet points vs. ATS-rewritten bullet points with highlighted keywords and action verbs.
  - **Full Document Editor & Preview**: Clean, ATS-compliant single-column layout preview with live editing for summary, experience bullets, and skills.
  - **Raw JSON Inspector**: Formatted JSON conforming to the exact required schema, with single-click copy and download.
  - **Export Suite**: Formatted PDF, Word document (.docx), Plain Text (.txt), and JSON payload.

### Visual Identity & Theme
- **Aesthetic Direction**: Utilitarian, precision technical workspace (Linear / GitHub / Raycast inspired).
- **Color Palette & Mood**:
  - Dominant Canvas: Crisp neutral white (`#FFFFFF`) / Dark slate (`#090D16`)
  - Structural Surfaces: Soft stone neutral (`#F8FAFC` / `#111827`), hairline dividers (`#E2E8F0` / `#1F2937`)
  - Accent Budget: Deep Indigo / Slate Blue (`#4F46E5` / `#6366F1`) for primary actions; Emerald (`#10B981`) for verified ATS matches; Amber (`#F59E0B`) for flagged gaps
- **Typography & Hierarchy**:
  - Display & Headings: `Plus Jakarta Sans`
  - Body Prose & UI: `Plus Jakarta Sans` / `DM Sans`
  - Code & Schema JSON / Tabular Metrics: `JetBrains Mono` / `tabular-nums`
- **Zero-Pill & Anti-Slop Discipline**:
  - Clean unboxed text metadata with typographic separators (`·`, `/`).
  - No decorative pulsing dots, no fake telemetry tickers, no hallucinated cockpit meters.
  - Strict single-elevation card depth.

---

## 3. Key Product Decisions & Trade-Offs

- **Server-Side Gemini Execution**:
  - *Chosen Approach*: Handle all `@google/genai` calls server-side in `server.ts` using `gemini-3.8-flash` with structured JSON schema (`responseSchema` and `Type.OBJECT`).
  - *Why*: Secure API key handling, consistent server-enforced JSON validation, and support for large multimodal resume PDF ingestion.
- **Strict Factual Invariant Enforcement**:
  - *Chosen Approach*: The system prompt explicitly instructs Gemini that unconfirmed skills must stay in `missing_keywords_and_questions` and *never* migrate into the `tailored_resume` object unless accompanied by user verification context.
  - *Why*: Preserves candidate integrity and prevents interview failure due to AI hallucinated metrics.
- **Client-Side PDF Ingestion & Multimodal Support**:
  - *Chosen Approach*: Extract text via client/server PDF parsing, and also allow direct base64 transmission to Gemini for visual/formatting retention.
- **Multi-Format Export Pipeline**:
  - *Chosen Approach*: Built-in PDF print stylesheet with standard 0.75-inch margins and ATS-parseable fonts, HTML-to-Word .docx export with clean semantic formatting, and formatted .txt download.

---

## 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│                          React Frontend UI                             │
│  ┌───────────────────────┐  ┌─────────────────────┐  ┌──────────────┐  │
│  │ Intake & File Drop    │  │ Gap Wizard Dialog   │  │ Diff Viewer  │  │
│  └───────────────────────┘  └─────────────────────┘  └──────────────┘  │
│  ┌───────────────────────┐  ┌─────────────────────┐  ┌──────────────┐  │
│  │ Resume Live Preview   │  │ Schema JSON Viewer  │  │ Export Suite │  │
│  └───────────────────────┘  └─────────────────────┘  └──────────────┘  │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ HTTP / JSON
┌───────────────────────────────────▼────────────────────────────────────┐
│                       Express Backend (server.ts)                      │
│  ┌─────────────────────────┐          ┌─────────────────────────────┐  │
│  │ POST /api/analyze-gaps  │          │ POST /api/tailor-resume     │  │
│  └───────────┬─────────────┘          └──────────────┬──────────────┘  │
│              │                                       │                 │
│              ▼                                       ▼                 │
│      GoogleGenAI Client (gemini-3.8-flash + responseSchema)            │
└────────────────────────────────────────────────────────────────────────┘
```

### Data Schema Invariant
The engine strictly conforms to the requested schema:
```json
{
  "missing_keywords_and_questions": [
    "The JD requires experience with Kubernetes. Have you used Kubernetes in any of your listed projects?"
  ],
  "tailored_resume": {
    "summary": "Tailored executive summary...",
    "experiences": [
      {
        "company": "Company Name",
        "role": "Role Title",
        "dates": "Date Range",
        "bullet_points": ["Rewritten action-oriented bullet point with JD keywords..."]
      }
    ],
    "skills": ["Skill 1", "Skill 2"]
  }
}
```

### Step-by-Step Implementation Sequence
1. **Server Setup (`server.ts`)**:
   - Express server on port 3000 hosting Vite in dev / serving dist in production.
   - `/api/analyze-gaps` endpoint invoking `gemini-3.8-flash` with structured schema to identify missing requirements as clarifying questions.
   - `/api/tailor-resume` endpoint taking base resume + JD + verified answers to rewrite bullets and summary without hallucinations.
2. **Metadata & HTML Setup**:
   - Update `metadata.json` with descriptive application title and `MAJOR_CAPABILITY_SERVER_SIDE_GEMINI_API`.
   - Update `index.html` with title and Google Fonts (`Plus Jakarta Sans` and `JetBrains Mono`).
3. **Core Application Components (`src/`)**:
   - `types.ts`: TypeScript interfaces for the input, question state, gap responses, and tailored resume schema.
   - `presets.ts`: Realistic technical resumes and job descriptions for instant testing.
   - `components/Header.tsx`: Clean top navigation conforming to the Top Bar Contract.
   - `components/IntakeView.tsx`: Resume uploader (PDF/Text) + JD input + preset cards.
   - `components/GapWizardModal.tsx`: Step-by-step interactive questionnaire for missing keywords.
   - `components/DiffViewer.tsx`: Original vs. tailored bullet comparison with highlighted keywords.
   - `components/ResumePreview.tsx`: ATS-compliant formatted resume view with in-place edits and print optimization.
   - `components/JsonViewer.tsx`: Syntax-highlighted strict JSON viewer with download & copy.
   - `utils/exportUtils.ts`: Word .docx generator, plain text builder, and browser print trigger.
4. **Verification & Build**:
   - Run compilation and verify complete error-free execution.
