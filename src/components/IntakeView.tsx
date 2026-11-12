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
  ArrowRight,
  Eye,
  Code2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { DocumentViewer } from './DocumentViewer';

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
  onTailorResume: () => void;
  isLoading: boolean;
  onSelectPreset: (preset: PresetScenario) => void;
  isSampleData?: boolean;
  onClearSampleData?: () => void;
  onFileExtracted?: () => void;
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
  onTailorResume,
  isLoading,
  onSelectPreset,
  isSampleData = false,
  onClearSampleData,
  onFileExtracted,
}: IntakeViewProps) {
  const [activeResumeTab, setActiveResumeTab] = useState<'document' | 'text' | 'upload'>('document');
  const [dragOver, setDragOver] = useState(false);
  const [isExtractingPdf, setIsExtractingPdf] = useState(false);
  const [extractStatusMsg, setExtractStatusMsg] = useState<string | null>(null);
  const [showPresets, setShowPresets] = useState(false);
  const [showContactDetails, setShowContactDetails] = useState(false);

  const handleFileUpload = async (file: File) => {
    if (!file) return;
    setIsExtractingPdf(true);
    setExtractStatusMsg(`Reading ${file.name}...`);

    try {
      if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
        const reader = new FileReader();
        reader.onload = async (e) => {
          try {
            const result = e.target?.result as string;
            setResumePdfBase64(result);
            setPdfFileName(file.name);

            const res = await fetch('/api/extract-pdf', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                pdfBase64: result,
                fileName: file.name,
              }),
            });

            if (res.ok) {
              const data = await res.json();
              if (data.text && data.text.length > 20) {
                setResumeText(data.text);
              } else {
                setResumeText(`[PDF Document: ${file.name} uploaded]\n(Text parsed from PDF is ready for tailoring)`);
              }
              if (data.candidateName) {
                setCandidateName(data.candidateName);
              }
              if (data.candidateContact) {
                setCandidateContact(data.candidateContact);
              }
              setExtractStatusMsg(`Loaded ${data.candidateName || file.name}`);
              onFileExtracted?.();
              setActiveResumeTab('document');
            } else {
              setResumeText(`[PDF Document: ${file.name} uploaded]`);
              onFileExtracted?.();
              setActiveResumeTab('document');
            }
          } catch (err) {
            console.error('Error extracting PDF:', err);
            setResumeText(`[PDF Document: ${file.name} uploaded]`);
            onFileExtracted?.();
            setActiveResumeTab('document');
          } finally {
            setIsExtractingPdf(false);
          }
        };
        reader.readAsDataURL(file);
      } else {
        const reader = new FileReader();
        reader.onload = (e) => {
          const text = (e.target?.result as string) || '';
          setResumeText(text);
          setPdfFileName(file.name);
          setResumePdfBase64(null);

          const firstLine = text.split('\n').map((l) => l.trim()).filter(Boolean)[0];
          if (firstLine && firstLine.length < 50 && !firstLine.includes(':')) {
            setCandidateName(firstLine);
          }
          onFileExtracted?.();
          setActiveResumeTab('document');
          setIsExtractingPdf(false);
          setExtractStatusMsg(`Loaded ${file.name}`);
        };
        reader.readAsText(file);
      }
    } catch (err) {
      console.error('File read error:', err);
      setIsExtractingPdf(false);
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
    setExtractStatusMsg(null);
    if (resumeText.startsWith('[PDF Document:')) {
      setResumeText('');
    }
    setActiveResumeTab('upload');
  };

  const hasResumeLoaded = !!(resumeText || resumePdfBase64);

  return (
    <div className="space-y-6">
      {/* Quiet Top Utility: Sample Resumes Dropdown & Reset */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-1 text-xs">
        <div className="flex items-center gap-2">
          {isSampleData ? (
            <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-900 px-3 py-1 rounded-xl">
              <span>Using sample scenario</span>
              <button
                type="button"
                onClick={onClearSampleData}
                className="font-bold underline hover:text-amber-950 flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" /> Clear
              </button>
            </div>
          ) : (
            <span className="text-zinc-500 font-medium">
              Start by uploading your resume or pasting text below
            </span>
          )}
        </div>

        {/* Collapsible Sample Scenarios Toggle */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowPresets(!showPresets)}
            className="text-zinc-600 hover:text-zinc-950 font-semibold px-3 py-1.5 rounded-xl border border-zinc-200 hover:border-zinc-300 bg-white transition-colors flex items-center gap-1.5 shadow-2xs"
          >
            <span>Need inspiration? Try a sample scenario</span>
            {showPresets ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {showPresets && (
            <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white border border-zinc-200 rounded-2xl p-3 shadow-xl z-30 space-y-2 animate-fade-in">
              <div className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider font-mono px-1">
                Select a Career Scenario
              </div>
              <div className="space-y-1.5">
                {PRESET_SCENARIOS.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => {
                      onSelectPreset(preset);
                      setActiveResumeTab('document');
                      setShowPresets(false);
                    }}
                    className="w-full text-left p-3 rounded-xl border border-zinc-100 hover:border-rose-300 hover:bg-rose-50/40 transition-all group"
                  >
                    <div className="text-xs font-bold text-zinc-900 group-hover:text-rose-600">
                      {preset.label}
                    </div>
                    <div className="text-[11px] text-zinc-500 mt-0.5 line-clamp-1 font-mono">
                      Role: {preset.role}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main 2-Column Split: Exactly 2 Focused Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        {/* Left Panel: Your Resume */}
        <div className="bg-white border border-zinc-200/90 rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col min-h-[580px]">
          {/* Header Row */}
          <div className="flex items-center justify-between pb-3 border-b border-zinc-100 mb-3">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-rose-500" />
              <h2 className="text-sm font-bold text-zinc-950">1. Your Resume</h2>
            </div>

            {/* Segmented Mode Control */}
            <div className="flex items-center gap-1 p-1 bg-zinc-100 rounded-xl border border-zinc-200">
              <button
                type="button"
                onClick={() => setActiveResumeTab('document')}
                className={`px-3 py-1 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors ${
                  activeResumeTab === 'document'
                    ? 'bg-white text-zinc-950 shadow-xs'
                    : 'text-zinc-600 hover:text-zinc-950'
                }`}
                title="View document image / rendered canvas"
              >
                <Eye className="w-3.5 h-3.5 text-rose-500" />
                <span>Document</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveResumeTab('text')}
                className={`px-3 py-1 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors ${
                  activeResumeTab === 'text'
                    ? 'bg-white text-zinc-950 shadow-xs'
                    : 'text-zinc-600 hover:text-zinc-950'
                }`}
                title="View or edit extracted raw text"
              >
                <Code2 className="w-3.5 h-3.5 text-zinc-400" />
                <span>Text</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveResumeTab('upload')}
                className={`px-3 py-1 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors ${
                  activeResumeTab === 'upload'
                    ? 'bg-white text-zinc-950 shadow-xs'
                    : 'text-zinc-600 hover:text-zinc-950'
                }`}
                title="Upload different resume file"
              >
                <UploadCloud className="w-3.5 h-3.5 text-zinc-400" />
                <span>Upload</span>
              </button>
            </div>
          </div>

          {/* Optional Compact Contact Bar Toggle */}
          <div className="mb-3">
            <button
              type="button"
              onClick={() => setShowContactDetails(!showContactDetails)}
              className="text-[11px] text-zinc-500 hover:text-zinc-900 font-medium flex items-center gap-1 transition-colors"
            >
              <User className="w-3 h-3 text-zinc-400" />
              <span>
                {candidateName ? `${candidateName}` : 'Add name & contact details (optional)'}
              </span>
              {showContactDetails ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>

            {showContactDetails && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2 pt-2 border-t border-zinc-100">
                <input
                  type="text"
                  value={candidateName}
                  onChange={(e) => setCandidateName(e.target.value)}
                  placeholder="Your Full Name"
                  className="text-xs p-2 bg-zinc-50 border border-zinc-200 rounded-lg text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus:border-rose-500 focus:outline-hidden"
                />
                <input
                  type="text"
                  value={candidateContact}
                  onChange={(e) => setCandidateContact(e.target.value)}
                  placeholder="Email · Phone · Location · LinkedIn"
                  className="text-xs p-2 bg-zinc-50 border border-zinc-200 rounded-lg text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus:border-rose-500 focus:outline-hidden"
                />
              </div>
            )}
          </div>

          {/* Tab 1: Rendered Document View */}
          {activeResumeTab === 'document' && (
            <div className="flex-1 flex flex-col">
              {hasResumeLoaded ? (
                <div className="flex-1 min-h-[460px]">
                  <DocumentViewer
                    pdfBase64={resumePdfBase64}
                    fileName={pdfFileName}
                    resumeText={resumeText}
                    candidateName={candidateName}
                    candidateContact={candidateContact}
                    onClearDocument={clearFile}
                  />
                </div>
              ) : (
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragOver(true);
                  }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  className={`flex-1 flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-2xl text-center space-y-4 transition-all min-h-[440px] ${
                    dragOver
                      ? 'border-rose-500 bg-rose-50/50'
                      : 'border-zinc-200 bg-zinc-50/50 hover:bg-zinc-50'
                  }`}
                >
                  <div className="w-14 h-14 rounded-2xl bg-white border border-zinc-200 shadow-xs flex items-center justify-center text-zinc-400">
                    <UploadCloud className="w-7 h-7 text-rose-500" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-zinc-950">
                      Drop your resume here
                    </div>
                    <p className="text-xs text-zinc-500 mt-1 max-w-xs">
                      Supports PDF, TXT, or Word files. Your exact layout and formatting will be rendered on canvas.
                    </p>
                  </div>

                  <label className="px-5 py-2.5 bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-bold rounded-xl cursor-pointer shadow-xs transition-colors flex items-center gap-2">
                    <span>Browse File</span>
                    <input
                      type="file"
                      accept=".pdf,.txt,.md"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                </div>
              )}
            </div>
          )}

          {/* Tab 2: Raw Text View */}
          {activeResumeTab === 'text' && (
            <div className="space-y-2 flex-1 flex flex-col">
              <textarea
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="Paste your current resume text here..."
                rows={16}
                className="w-full flex-1 text-xs font-mono p-3.5 bg-zinc-50 border border-zinc-200 rounded-2xl focus:outline-hidden focus:ring-1 focus:ring-rose-500 focus:border-rose-500 focus:bg-white text-zinc-900 leading-relaxed placeholder:text-zinc-400 resize-y min-h-[380px]"
              />
              <div className="flex items-center justify-between text-[11px] text-zinc-400 font-mono">
                <span>{resumeText.length.toLocaleString()} characters</span>
                {pdfFileName && <span className="text-rose-600 font-semibold">{pdfFileName}</span>}
              </div>
            </div>
          )}

          {/* Tab 3: Upload Dropzone */}
          {activeResumeTab === 'upload' && (
            <div className="space-y-4 flex-1 flex flex-col">
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-2xl p-8 text-center flex flex-col items-center justify-center flex-1 transition-all min-h-[380px] ${
                  dragOver
                    ? 'border-rose-500 bg-rose-50/50'
                    : 'border-zinc-200 bg-zinc-50/40 hover:bg-zinc-50'
                }`}
              >
                {isExtractingPdf ? (
                  <div className="flex flex-col items-center py-4">
                    <div className="w-8 h-8 border-3 border-rose-500/30 border-t-rose-500 rounded-full animate-spin mb-3" />
                    <div className="text-xs font-bold text-zinc-900">
                      Reading PDF & Rendering Document Preview...
                    </div>
                  </div>
                ) : (
                  <>
                    <UploadCloud className="w-10 h-10 text-zinc-400 mb-2" />
                    <div className="text-sm font-bold text-zinc-950">
                      Drop new resume file here
                    </div>
                    <label className="mt-4 px-4 py-2 bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-bold rounded-xl cursor-pointer shadow-xs transition-colors">
                      Choose File
                      <input
                        type="file"
                        accept=".pdf,.txt,.md"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  </>
                )}
              </div>

              {extractStatusMsg && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="font-semibold text-emerald-900">{extractStatusMsg}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveResumeTab('document')}
                    className="text-rose-600 font-bold underline"
                  >
                    View Document
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Panel: Target Job Description */}
        <div className="bg-white border border-zinc-200/90 rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col min-h-[580px]">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-100 mb-3">
            <div className="flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-rose-500" />
              <h2 className="text-sm font-bold text-zinc-950">2. Target Job Description</h2>
            </div>
            {jobDescription && (
              <button
                type="button"
                onClick={() => setJobDescription('')}
                className="text-[11px] text-zinc-400 hover:text-zinc-600 flex items-center gap-1 font-mono"
              >
                <RotateCcw className="w-3 h-3" /> Clear
              </button>
            )}
          </div>

          <div className="space-y-2 flex-1 flex flex-col">
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the target job description here (title, requirements, key skills, responsibilities)..."
              rows={16}
              className="w-full flex-1 text-xs font-sans p-3.5 bg-zinc-50 border border-zinc-200 rounded-2xl focus:outline-hidden focus:ring-1 focus:ring-rose-500 focus:border-rose-500 focus:bg-white text-zinc-900 leading-relaxed placeholder:text-zinc-400 resize-y min-h-[380px]"
            />
            <div className="flex items-center justify-between text-[11px] text-zinc-400 font-mono">
              <span>{jobDescription.length.toLocaleString()} characters</span>
              <span>
                {jobDescription ? `${jobDescription.split(/\s+/).filter(Boolean).length} words` : '0 words'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Single Focused Action Area - Centered Radiant CTA */}
      <div className="flex flex-col items-center justify-center pt-2 pb-6 space-y-3">
        <button
          type="button"
          onClick={onTailorResume}
          disabled={isLoading || (!resumeText && !resumePdfBase64) || !jobDescription}
          className="w-full sm:w-auto px-10 py-4 text-sm font-extrabold text-white bg-gradient-to-r from-orange-500 via-rose-500 to-fuchsia-600 hover:from-orange-600 hover:via-rose-600 hover:to-fuchsia-700 disabled:opacity-40 disabled:cursor-not-allowed rounded-2xl transition-all shadow-lg shadow-rose-500/25 hover:shadow-rose-500/40 transform hover:-translate-y-0.5 flex items-center justify-center gap-3 cursor-pointer"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Tailoring Resume & Mirroring Format...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-amber-200" />
              <span>Tailor Resume</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>

        <p className="text-xs text-zinc-500 text-center font-medium">
          Mirrors your exact resume format · 100% authentic career experience
        </p>
      </div>
    </div>
  );
}
