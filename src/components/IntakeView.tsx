import React, { useState } from 'react';
import { PRESET_SCENARIOS } from '../presets';
import { PresetScenario } from '../types';
import {
  UploadCloud,
  FileText,
  Briefcase,
  Sparkles,
  User,
  CheckCircle,
  RotateCcw,
  Layers,
  ArrowRight,
} from 'lucide-react';

interface IntakeViewProps {
  resumeText: string;
  setResumeText: (text: string) => void;
  resumePdfBase64: string | null;
  setResumePdfBase64: (b64: string | null) => void;
  pdfFileName: string | null;
  setPdfFileName: (name: string | null) => void;
  jobDescription: string;
  setJobDescription: (text: string) => void;
  candidateName: string;
  setCandidateName: (name: string) => void;
  candidateContact: string;
  setCandidateContact: (contact: string) => void;
  onRunGapAnalysis: () => void;
  isLoading: boolean;
  onSelectPreset: (preset: PresetScenario) => void;
}

export function IntakeView({
  resumeText,
  setResumeText,
  resumePdfBase64,
  setResumePdfBase64,
  pdfFileName,
  setPdfFileName,
  jobDescription,
  setJobDescription,
  candidateName,
  setCandidateName,
  candidateContact,
  setCandidateContact,
  onRunGapAnalysis,
  isLoading,
  onSelectPreset,
}: IntakeViewProps) {
  const [activeResumeTab, setActiveResumeTab] = useState<'text' | 'file'>('text');
  const [dragOver, setDragOver] = useState(false);

  const handleFileUpload = (file: File) => {
    if (!file) return;

    if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setResumePdfBase64(result);
        setPdfFileName(file.name);
        if (!resumeText) {
          setResumeText(`[PDF Document: ${file.name} attached for multimodal ATS parsing]`);
        }
      };
      reader.readAsDataURL(file);
    } else {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        setResumeText(text);
        setPdfFileName(file.name);
      };
      reader.readAsText(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  const clearFile = () => {
    setResumePdfBase64(null);
    setPdfFileName(null);
    if (resumeText.startsWith('[PDF Document:')) {
      setResumeText('');
    }
  };

  return (
    <div className="space-y-6">
      {/* 2026 Presets Bento Strip */}
      <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 shadow-xl backdrop-blur-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-zinc-800/80 gap-2">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-300">
              Benchmark Testing Presets
            </span>
            <span className="text-xs text-zinc-500 font-mono">/ 2026 Target Roles</span>
          </div>
          <span className="text-[11px] text-zinc-500 font-mono">
            Click to load full candidate profile & target requirements
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
          {PRESET_SCENARIOS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => onSelectPreset(preset)}
              className="text-left p-3.5 rounded-xl border border-zinc-800 hover:border-indigo-500/60 bg-zinc-950/60 hover:bg-zinc-900/90 transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="text-xs font-bold text-zinc-200 group-hover:text-white transition-colors">
                  {preset.label}
                </div>
                <div className="text-[11px] text-zinc-400 mt-1 line-clamp-1 font-mono">
                  Target: {preset.role}
                </div>
              </div>
              <div className="text-[10px] text-indigo-400 font-semibold mt-3 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                Load Preset <ArrowRight className="w-3 h-3" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Candidate Profile Strip */}
      <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 shadow-xl backdrop-blur-md">
        <div className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3 flex items-center gap-2">
          <User className="w-3.5 h-3.5 text-zinc-500" />
          <span>Candidate Information</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1">
              Full Name
            </label>
            <input
              type="text"
              value={candidateName}
              onChange={(e) => setCandidateName(e.target.value)}
              placeholder="e.g. Alex Rivera"
              className="w-full text-xs font-sans p-2.5 bg-zinc-950 border border-zinc-800 rounded-xl focus:outline-hidden focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-zinc-100 placeholder:text-zinc-600 transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1">
              Contact & Links
            </label>
            <input
              type="text"
              value={candidateContact}
              onChange={(e) => setCandidateContact(e.target.value)}
              placeholder="e.g. alex@example.com · (415) 555-0199 · San Francisco, CA · github.com/username"
              className="w-full text-xs font-sans p-2.5 bg-zinc-950 border border-zinc-800 rounded-xl focus:outline-hidden focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-zinc-100 placeholder:text-zinc-600 transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Main Split: Resume vs Job Description */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Panel: Base Resume */}
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 shadow-xl backdrop-blur-md flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80 mb-3">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-400" />
              <h3 className="text-sm font-bold text-white">Base Resume</h3>
            </div>

            {/* Segmented Control */}
            <div className="flex items-center gap-1 p-1 bg-zinc-950 rounded-xl border border-zinc-800">
              <button
                type="button"
                onClick={() => setActiveResumeTab('text')}
                className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
                  activeResumeTab === 'text'
                    ? 'bg-zinc-800 text-white shadow-xs'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Text
              </button>
              <button
                type="button"
                onClick={() => setActiveResumeTab('file')}
                className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
                  activeResumeTab === 'file'
                    ? 'bg-zinc-800 text-white shadow-xs'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Upload PDF
              </button>
            </div>
          </div>

          {activeResumeTab === 'file' && (
            <div className="space-y-4 flex-1 flex flex-col">
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-xl p-8 text-center flex flex-col items-center justify-center flex-1 transition-all ${
                  dragOver
                    ? 'border-indigo-500 bg-indigo-950/20'
                    : 'border-zinc-800 bg-zinc-950/40 hover:bg-zinc-950/70'
                }`}
              >
                <UploadCloud className="w-10 h-10 text-zinc-500 mb-2" />
                <div className="text-xs font-semibold text-zinc-300">
                  Drop Resume PDF, TXT, or MD
                </div>
                <div className="text-[11px] text-zinc-500 mt-1 font-mono">
                  Multimodal PDF ingestion supported
                </div>

                <label className="mt-4 inline-block px-3.5 py-1.5 bg-zinc-800 border border-zinc-700 rounded-lg text-xs font-medium text-zinc-200 hover:bg-zinc-700 cursor-pointer shadow-xs transition-colors">
                  Select File
                  <input
                    type="file"
                    accept=".pdf,.txt,.md"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>

              {pdfFileName && (
                <div className="bg-zinc-950 border border-indigo-900/60 rounded-xl p-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                    <div>
                      <div className="text-xs font-semibold text-zinc-200">{pdfFileName}</div>
                      <div className="text-[10px] text-zinc-500 font-mono">
                        {resumePdfBase64 ? 'PDF Document Ready' : 'Text File Attached'}
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={clearFile}
                    className="text-xs text-red-400 hover:text-red-300 font-medium"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>
          )}

          {activeResumeTab === 'text' && (
            <div className="space-y-2 flex-1 flex flex-col">
              <textarea
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="Paste your source resume here (summary, experience bullets, dates, and skills)..."
                rows={16}
                className="w-full flex-1 text-xs font-mono p-3 bg-zinc-950 border border-zinc-800 rounded-xl focus:outline-hidden focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-zinc-200 leading-relaxed placeholder:text-zinc-600 resize-y min-h-[300px]"
              />
              <div className="flex items-center justify-between text-[11px] text-zinc-500 font-mono">
                <span>{resumeText.length.toLocaleString()} chars</span>
                {pdfFileName && (
                  <span className="text-indigo-400">Attached: {pdfFileName}</span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Panel: Target Job Description */}
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 shadow-xl backdrop-blur-md flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80 mb-3">
            <div className="flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-indigo-400" />
              <h3 className="text-sm font-bold text-white">Target Job Description (JD)</h3>
            </div>
            {jobDescription && (
              <button
                type="button"
                onClick={() => setJobDescription('')}
                className="text-[11px] text-zinc-500 hover:text-zinc-300 flex items-center gap-1 font-mono"
              >
                <RotateCcw className="w-3 h-3" /> Clear
              </button>
            )}
          </div>

          <div className="space-y-2 flex-1 flex flex-col">
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste target job description requirements, technical qualifications, and team responsibilities..."
              rows={16}
              className="w-full flex-1 text-xs font-sans p-3 bg-zinc-950 border border-zinc-800 rounded-xl focus:outline-hidden focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-zinc-200 leading-relaxed placeholder:text-zinc-600 resize-y min-h-[300px]"
            />
            <div className="flex items-center justify-between text-[11px] text-zinc-500 font-mono">
              <span>{jobDescription.length.toLocaleString()} chars</span>
              <span>
                {jobDescription ? `${jobDescription.split(/\s+/).filter(Boolean).length} words` : '0 words'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2026 Primary Action Dock */}
      <div className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-6 shadow-2xl backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="text-sm font-bold text-white flex items-center gap-2">
            <span>Phase 1: ATS Gap Analysis & Interview</span>
            <span className="text-[10px] font-mono text-indigo-400 bg-indigo-950/60 border border-indigo-800/70 px-2 py-0.5 rounded">
              Zero Hallucination
            </span>
          </div>
          <div className="text-xs text-zinc-400 mt-1">
            Detect missing requirements and trigger interactive candidate verification before tailoring.
          </div>
        </div>

        <button
          type="button"
          onClick={onRunGapAnalysis}
          disabled={isLoading || (!resumeText && !resumePdfBase64) || !jobDescription}
          className="w-full sm:w-auto px-6 py-3 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 disabled:bg-zinc-800 disabled:text-zinc-500 disabled:cursor-not-allowed rounded-xl transition-all shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Analyzing Gaps & Requirements...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Run ATS Gap Analysis</span>
              <kbd className="font-mono text-[10px] text-indigo-200 bg-indigo-700/60 px-1 rounded ml-1">
                ↵
              </kbd>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
