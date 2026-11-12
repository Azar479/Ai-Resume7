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
      {/* Sample Presets Strip */}
      <div className="bg-white border border-zinc-200/90 rounded-3xl p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-zinc-100 gap-2">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-rose-500" />
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-900">
              Sample Career Scenarios
            </span>
          </div>
          <div className="flex items-center gap-2">
            {isSampleData && (
              <button
                type="button"
                onClick={onClearSampleData}
                className="text-[11px] font-mono text-amber-700 hover:text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Clear Sample · Use My Own Resume</span>
              </button>
            )}
            <span className="text-[11px] text-zinc-400 font-mono hidden md:inline">
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
              className="text-left p-4 rounded-2xl border border-zinc-200/80 hover:border-rose-400/80 bg-zinc-50/50 hover:bg-white transition-all group flex flex-col justify-between shadow-2xs hover:shadow-sm"
            >
              <div>
                <div className="text-xs font-bold text-zinc-900 group-hover:text-rose-600 transition-colors">
                  {preset.label}
                </div>
                <div className="text-[11px] text-zinc-500 mt-1 line-clamp-1 font-mono">
                  Role: {preset.role}
                </div>
              </div>
              <div className="text-[11px] text-rose-600 font-bold mt-3 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                Load Sample <ArrowRight className="w-3 h-3" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Candidate Profile Strip */}
      <div className="bg-white border border-zinc-200/90 rounded-3xl p-5 sm:p-6 shadow-xs">
        <div className="text-xs font-bold uppercase tracking-wider text-zinc-800 mb-3 flex items-center gap-2">
          <User className="w-3.5 h-3.5 text-zinc-500" />
          <span>Your Contact Details</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-zinc-700 mb-1">
              Your Full Name
            </label>
            <input
              type="text"
              value={candidateName}
              onChange={(e) => setCandidateName(e.target.value)}
              placeholder="e.g. Alex Rivera"
              className="w-full text-xs font-sans p-2.5 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-hidden focus:ring-1 focus:ring-rose-500 focus:border-rose-500 focus:bg-white text-zinc-900 placeholder:text-zinc-400 transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-700 mb-1">
              Email, Phone, Location & Links
            </label>
            <input
              type="text"
              value={candidateContact}
              onChange={(e) => setCandidateContact(e.target.value)}
              placeholder="e.g. alex@example.com · (415) 555-0199 · San Francisco, CA · linkedin.com/in/alex"
              className="w-full text-xs font-sans p-2.5 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-hidden focus:ring-1 focus:ring-rose-500 focus:border-rose-500 focus:bg-white text-zinc-900 placeholder:text-zinc-400 transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Main Split: Resume vs Job Description */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Panel: Base Resume */}
        <div className="bg-white border border-zinc-200/90 rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col min-h-[560px]">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-100 mb-3">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-rose-500" />
              <h3 className="text-sm font-bold text-zinc-900">Your Uploaded Resume</h3>
            </div>

            {/* Segmented Control */}
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
                <span>Document Image</span>
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
                <Code2 className="w-3.5 h-3.5 text-zinc-500" />
                <span>Raw Text</span>
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
                <UploadCloud className="w-3.5 h-3.5 text-zinc-500" />
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
                <div className="flex-1 flex flex-col items-center justify-center p-8 border-2 border-dashed border-zinc-200 rounded-2xl bg-zinc-50/50 text-center space-y-3">
                  <UploadCloud className="w-10 h-10 text-zinc-400" />
                  <div className="text-xs font-bold text-zinc-900">
                    No resume uploaded yet
                  </div>
                  <p className="text-[11px] text-zinc-500 font-mono max-w-sm">
                    Upload your PDF or select a sample preset to preview the rendered document image.
                  </p>
                  <button
                    type="button"
                    onClick={() => setActiveResumeTab('upload')}
                    className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold rounded-xl transition-colors shadow-xs"
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
                className="w-full flex-1 text-xs font-mono p-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-hidden focus:ring-1 focus:ring-rose-500 focus:border-rose-500 focus:bg-white text-zinc-900 leading-relaxed placeholder:text-zinc-400 resize-y min-h-[360px]"
              />
              <div className="flex items-center justify-between text-[11px] text-zinc-500 font-mono">
                <span>{resumeText.length.toLocaleString()} characters</span>
                {pdfFileName && (
                  <span className="text-rose-600 font-semibold">Attached: {pdfFileName}</span>
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
                className={`border-2 border-dashed rounded-2xl p-8 text-center flex flex-col items-center justify-center flex-1 transition-all min-h-[360px] ${
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
                    <div className="text-[11px] text-zinc-500 font-mono mt-1">
                      Extracting your real layout, companies, dates, and bullet points
                    </div>
                  </div>
                ) : (
                  <>
                    <UploadCloud className="w-10 h-10 text-zinc-400 mb-2" />
                    <div className="text-xs font-bold text-zinc-900">
                      Drop your Resume PDF, TXT, or Word file
                    </div>
                    <div className="text-[11px] text-zinc-500 mt-1 font-mono">
                      Your exact format, sections, and styling will be mirrored
                    </div>

                    <label className="mt-4 inline-block px-4 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-900 rounded-xl text-xs font-semibold text-white cursor-pointer shadow-xs transition-colors">
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
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    <div>
                      <div className="text-xs font-semibold text-emerald-900">{extractStatusMsg}</div>
                      <div className="text-[10px] text-emerald-700 font-mono">
                        Document image preview ready
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveResumeTab('document')}
                    className="text-xs text-rose-600 hover:text-rose-700 font-semibold underline font-mono"
                  >
                    View Document Image
                  </button>
                </div>
              )}

              {pdfFileName && !extractStatusMsg && (
                <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    <div>
                      <div className="text-xs font-semibold text-zinc-900">{pdfFileName}</div>
                      <div className="text-[10px] text-zinc-500 font-mono">
                        {resumePdfBase64 ? 'PDF Document Loaded' : 'Text File Attached'}
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={clearFile}
                    className="text-xs text-red-600 hover:text-red-700 font-medium"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Panel: Target Job Description */}
        <div className="bg-white border border-zinc-200/90 rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col min-h-[560px]">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-100 mb-3">
            <div className="flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-rose-500" />
              <h3 className="text-sm font-bold text-zinc-900">Target Job Description</h3>
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
              placeholder="Paste the job description, required skills, and responsibilities here..."
              rows={16}
              className="w-full flex-1 text-xs font-sans p-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-hidden focus:ring-1 focus:ring-rose-500 focus:border-rose-500 focus:bg-white text-zinc-900 leading-relaxed placeholder:text-zinc-400 resize-y min-h-[360px]"
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

      {/* Primary Action Dock - Glowing Sunset to Magenta Gradient CTA Button */}
      <div className="bg-white border border-zinc-200/90 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <div className="text-base font-extrabold text-zinc-950 flex items-center gap-2.5 flex-wrap">
            <span>Tailor Resume to Job Requirements</span>
            <span className="text-[11px] font-mono text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              100% Real Experience
            </span>
            <span className="text-[11px] font-mono text-rose-800 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-md">
              Mirrors Exact Layout
            </span>
          </div>
          <div className="text-xs text-zinc-600 mt-1 max-w-xl leading-relaxed">
            Rewords bullet points with strong action verbs and target JD keywords while strictly preserving your authentic companies, dates, and original document sequence.
          </div>
        </div>

        <button
          type="button"
          onClick={onTailorResume}
          disabled={isLoading || (!resumeText && !resumePdfBase64) || !jobDescription}
          className="w-full sm:w-auto px-8 py-4 text-xs font-extrabold text-white bg-gradient-to-r from-orange-500 via-rose-500 to-fuchsia-600 hover:from-orange-600 hover:via-rose-600 hover:to-fuchsia-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-2xl transition-all shadow-lg shadow-rose-500/25 hover:shadow-rose-500/40 transform hover:-translate-y-0.5 flex items-center justify-center gap-2.5 shrink-0"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Tailoring Resume & Mirroring Format...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-amber-200" />
              <span>Tailor Resume (Preserve Exact Format)</span>
              <kbd className="font-mono text-[10px] text-white/90 bg-white/20 px-1.5 py-0.5 rounded ml-1">
                ↵
              </kbd>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
