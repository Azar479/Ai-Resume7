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
  ShieldCheck,
  Eye,
  Code2,
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
  // If resume is loaded or uploaded, show 'document' image view by default
  const [activeResumeTab, setActiveResumeTab] = useState<'document' | 'text' | 'upload'>('document');
  const [dragOver, setDragOver] = useState(false);
  const [isExtractingPdf, setIsExtractingPdf] = useState(false);
  const [extractStatusMsg, setExtractStatusMsg] = useState<string | null>(null);

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

            // Call backend PDF parser to extract text, candidate name, and contact
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

          // Extract candidate name from first non-empty line
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
      {/* Sample Presets Strip */}
      <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 shadow-xl backdrop-blur-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-zinc-800/80 gap-2">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-300">
              Sample Resumes & Job Posts
            </span>
            <span className="text-xs text-zinc-500 font-mono">/ Instant Testing</span>
          </div>
          <div className="flex items-center gap-2">
            {isSampleData && (
              <button
                type="button"
                onClick={onClearSampleData}
                className="text-[11px] font-mono text-amber-400 hover:text-amber-300 bg-amber-950/60 border border-amber-800/80 px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Clear Sample · Use My Own Resume</span>
              </button>
            )}
            <span className="text-[11px] text-zinc-500 font-mono hidden md:inline">
              Pick a sample or upload your own resume below
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
          {PRESET_SCENARIOS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => {
                onSelectPreset(preset);
                setActiveResumeTab('document');
              }}
              className="text-left p-3.5 rounded-xl border border-zinc-800 hover:border-indigo-500/60 bg-zinc-950/60 hover:bg-zinc-900/90 transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="text-xs font-bold text-zinc-200 group-hover:text-white transition-colors">
                  {preset.label}
                </div>
                <div className="text-[11px] text-zinc-400 mt-1 line-clamp-1 font-mono">
                  Role: {preset.role}
                </div>
              </div>
              <div className="text-[10px] text-indigo-400 font-semibold mt-3 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                Load Sample <ArrowRight className="w-3 h-3" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Candidate Profile Strip */}
      <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 shadow-xl backdrop-blur-md">
        <div className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3 flex items-center gap-2">
          <User className="w-3.5 h-3.5 text-zinc-500" />
          <span>Your Contact Details</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1">
              Your Full Name
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
              Email, Phone, Location & Links
            </label>
            <input
              type="text"
              value={candidateContact}
              onChange={(e) => setCandidateContact(e.target.value)}
              placeholder="e.g. alex@example.com · (415) 555-0199 · San Francisco, CA · linkedin.com/in/alex"
              className="w-full text-xs font-sans p-2.5 bg-zinc-950 border border-zinc-800 rounded-xl focus:outline-hidden focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-zinc-100 placeholder:text-zinc-600 transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Main Split: Resume vs Job Description */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Panel: Base Resume */}
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 shadow-xl backdrop-blur-md flex flex-col min-h-[560px]">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80 mb-3">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-400" />
              <h3 className="text-sm font-bold text-white">Your Uploaded Resume</h3>
            </div>

            {/* Segmented Control */}
            <div className="flex items-center gap-1 p-1 bg-zinc-950 rounded-xl border border-zinc-800">
              <button
                type="button"
                onClick={() => setActiveResumeTab('document')}
                className={`px-3 py-1 text-xs font-medium rounded-lg flex items-center gap-1.5 transition-colors ${
                  activeResumeTab === 'document'
                    ? 'bg-zinc-800 text-white shadow-xs'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
                title="View document image / rendered canvas"
              >
                <Eye className="w-3.5 h-3.5 text-indigo-400" />
                <span>Document Image</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveResumeTab('text')}
                className={`px-3 py-1 text-xs font-medium rounded-lg flex items-center gap-1.5 transition-colors ${
                  activeResumeTab === 'text'
                    ? 'bg-zinc-800 text-white shadow-xs'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
                title="View or edit extracted raw text"
              >
                <Code2 className="w-3.5 h-3.5 text-zinc-400" />
                <span>Raw Text</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveResumeTab('upload')}
                className={`px-3 py-1 text-xs font-medium rounded-lg flex items-center gap-1.5 transition-colors ${
                  activeResumeTab === 'upload'
                    ? 'bg-zinc-800 text-white shadow-xs'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
                title="Upload different resume file"
              >
                <UploadCloud className="w-3.5 h-3.5 text-zinc-400" />
                <span>Upload</span>
              </button>
            </div>
          </div>

          {/* Tab 1: Rendered Document Image View */}
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
                <div className="flex-1 flex flex-col items-center justify-center p-8 border-2 border-dashed border-zinc-800 rounded-xl bg-zinc-950/40 text-center space-y-3">
                  <UploadCloud className="w-10 h-10 text-zinc-500" />
                  <div className="text-xs font-semibold text-zinc-300">
                    No resume uploaded yet
                  </div>
                  <p className="text-[11px] text-zinc-500 font-mono max-w-sm">
                    Upload your PDF or select a sample preset to preview the rendered document image.
                  </p>
                  <button
                    type="button"
                    onClick={() => setActiveResumeTab('upload')}
                    className="px-4 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-xl hover:bg-indigo-500 transition-colors"
                  >
                    Upload Resume PDF
                  </button>
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
                placeholder="Paste your current resume here with your work experience, dates, and bullet points..."
                rows={16}
                className="w-full flex-1 text-xs font-mono p-3 bg-zinc-950 border border-zinc-800 rounded-xl focus:outline-hidden focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-zinc-200 leading-relaxed placeholder:text-zinc-600 resize-y min-h-[360px]"
              />
              <div className="flex items-center justify-between text-[11px] text-zinc-500 font-mono">
                <span>{resumeText.length.toLocaleString()} characters</span>
                {pdfFileName && (
                  <span className="text-indigo-400">Attached: {pdfFileName}</span>
                )}
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
                className={`border-2 border-dashed rounded-xl p-8 text-center flex flex-col items-center justify-center flex-1 transition-all min-h-[360px] ${
                  dragOver
                    ? 'border-indigo-500 bg-indigo-950/20'
                    : 'border-zinc-800 bg-zinc-950/40 hover:bg-zinc-950/70'
                }`}
              >
                {isExtractingPdf ? (
                  <div className="flex flex-col items-center py-4">
                    <div className="w-8 h-8 border-3 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mb-3" />
                    <div className="text-xs font-semibold text-zinc-200">
                      Reading PDF & Rendering Document Preview...
                    </div>
                    <div className="text-[11px] text-zinc-400 font-mono mt-1">
                      Extracting your real layout, companies, dates, and bullet points
                    </div>
                  </div>
                ) : (
                  <>
                    <UploadCloud className="w-10 h-10 text-zinc-500 mb-2" />
                    <div className="text-xs font-semibold text-zinc-300">
                      Drop your Resume PDF, TXT, or Word file
                    </div>
                    <div className="text-[11px] text-zinc-500 mt-1 font-mono">
                      Your exact format, sections, and styling will be mirrored
                    </div>

                    <label className="mt-4 inline-block px-4 py-2 bg-indigo-600 hover:bg-indigo-500 border border-indigo-500 rounded-xl text-xs font-semibold text-white cursor-pointer shadow-lg transition-colors">
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
                <div className="bg-emerald-950/40 border border-emerald-800/80 rounded-xl p-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                    <div>
                      <div className="text-xs font-semibold text-emerald-200">{extractStatusMsg}</div>
                      <div className="text-[10px] text-emerald-400/80 font-mono">
                        Document image preview ready
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveResumeTab('document')}
                    className="text-xs text-indigo-400 hover:text-indigo-300 font-medium underline font-mono"
                  >
                    View Document Image
                  </button>
                </div>
              )}

              {pdfFileName && !extractStatusMsg && (
                <div className="bg-zinc-950 border border-indigo-900/60 rounded-xl p-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                    <div>
                      <div className="text-xs font-semibold text-zinc-200">{pdfFileName}</div>
                      <div className="text-[10px] text-zinc-500 font-mono">
                        {resumePdfBase64 ? 'PDF Document Loaded' : 'Text File Attached'}
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
        </div>

        {/* Right Panel: Target Job Description */}
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 shadow-xl backdrop-blur-md flex flex-col min-h-[560px]">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80 mb-3">
            <div className="flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-indigo-400" />
              <h3 className="text-sm font-bold text-white">Target Job Description</h3>
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
              placeholder="Paste the job description, required skills, and responsibilities here..."
              rows={16}
              className="w-full flex-1 text-xs font-sans p-3 bg-zinc-950 border border-zinc-800 rounded-xl focus:outline-hidden focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-zinc-200 leading-relaxed placeholder:text-zinc-600 resize-y min-h-[360px]"
            />
            <div className="flex items-center justify-between text-[11px] text-zinc-500 font-mono">
              <span>{jobDescription.length.toLocaleString()} characters</span>
              <span>
                {jobDescription ? `${jobDescription.split(/\s+/).filter(Boolean).length} words` : '0 words'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Primary Action Dock - Direct 1-Click Tailoring with Exact Format Preservation */}
      <div className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-6 shadow-2xl backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="text-sm font-bold text-white flex items-center gap-2 flex-wrap">
            <span>Tailor Resume to Job Requirements</span>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/70 px-2 py-0.5 rounded flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              100% Honest Experience
            </span>
            <span className="text-[10px] font-mono text-indigo-400 bg-indigo-950/60 border border-indigo-800/70 px-2 py-0.5 rounded">
              Mirrors Exact Format & Layout
            </span>
          </div>
          <div className="text-xs text-zinc-400 mt-1 max-w-xl">
            Rewords your bullet points with strong action verbs and target JD keywords while strictly preserving your exact companies, roles, dates, and original section sequence.
          </div>
        </div>

        <button
          type="button"
          onClick={onTailorResume}
          disabled={isLoading || (!resumeText && !resumePdfBase64) || !jobDescription}
          className="w-full sm:w-auto px-7 py-3.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 disabled:bg-zinc-800 disabled:text-zinc-500 disabled:cursor-not-allowed rounded-xl transition-all shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 shrink-0"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Tailoring Resume & Mirroring Format...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Tailor Resume (Preserve Exact Format)</span>
              <kbd className="font-mono text-[10px] text-indigo-200 bg-indigo-700/60 px-1.5 py-0.5 rounded ml-1">
                ↵
              </kbd>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
