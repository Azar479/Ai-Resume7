import React, { useState } from 'react';
import { TailoredResume, ResumeEngineResponse } from '../types';
import {
  Printer,
  FileText,
  Download,
  Code,
  Edit3,
  Check,
  Plus,
  Trash2,
  Copy,
  Maximize2,
  Eye,
} from 'lucide-react';
import {
  exportToPlainText,
  exportToWordDoc,
  triggerPrint,
  copyToClipboard,
} from '../utils/exportUtils';

interface ResumePreviewProps {
  resume: TailoredResume;
  rawResponse?: ResumeEngineResponse;
  candidateName: string;
  candidateContact: string;
  onUpdateResume: (updated: TailoredResume) => void;
  onOpenJsonModal: () => void;
}

export function ResumePreview({
  resume,
  rawResponse,
  candidateName,
  candidateContact,
  onUpdateResume,
  onOpenJsonModal,
}: ResumePreviewProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState<'standard' | 'focused'>('standard');

  const handleSummaryChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onUpdateResume({
      ...resume,
      summary: e.target.value,
    });
  };

  const handleBulletChange = (expIdx: number, bIdx: number, val: string) => {
    const newExps = [...resume.experiences];
    const newBullets = [...newExps[expIdx].bullet_points];
    newBullets[bIdx] = val;
    newExps[expIdx] = { ...newExps[expIdx], bullet_points: newBullets };
    onUpdateResume({ ...resume, experiences: newExps });
  };

  const handleAddBullet = (expIdx: number) => {
    const newExps = [...resume.experiences];
    const newBullets = [
      ...newExps[expIdx].bullet_points,
      'Architected high-impact workflow delivering measurable latency reduction and system reliability...',
    ];
    newExps[expIdx] = { ...newExps[expIdx], bullet_points: newBullets };
    onUpdateResume({ ...resume, experiences: newExps });
  };

  const handleDeleteBullet = (expIdx: number, bIdx: number) => {
    const newExps = [...resume.experiences];
    const newBullets = newExps[expIdx].bullet_points.filter((_, i) => i !== bIdx);
    newExps[expIdx] = { ...newExps[expIdx], bullet_points: newBullets };
    onUpdateResume({ ...resume, experiences: newExps });
  };

  const handleSkillsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const skillsArray = e.target.value
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    onUpdateResume({ ...resume, skills: skillsArray });
  };

  const handleCopyText = async () => {
    const text =
      `${candidateName.toUpperCase()}\n${candidateContact}\n\nSUMMARY:\n${resume.summary}\n\nEXPERIENCE:\n` +
      resume.experiences
        .map(
          (e) =>
            `${e.company} | ${e.role} (${e.dates})\n` +
            e.bullet_points.map((b) => `• ${b}`).join('\n')
        )
        .join('\n\n') +
      `\n\nSKILLS:\n${resume.skills.join(', ')}`;
    const ok = await copyToClipboard(text);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      {/* 2026 Floating Action Toolbar */}
      <div className="no-print bg-zinc-900/80 backdrop-blur-md border border-zinc-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsEditing(!isEditing)}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-all ${
              isEditing
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200'
            }`}
          >
            {isEditing ? <Check className="w-3.5 h-3.5" /> : <Edit3 className="w-3.5 h-3.5" />}
            <span>{isEditing ? 'Save Changes' : 'Edit Content'}</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode(viewMode === 'standard' ? 'focused' : 'standard')}
            className="px-3 py-1.5 text-xs font-medium text-zinc-400 hover:text-zinc-200 bg-zinc-950 rounded-lg border border-zinc-800 hidden sm:flex items-center gap-1.5 font-mono"
            title="Toggle Focused View"
          >
            <Maximize2 className="w-3 h-3" />
            <span>{viewMode === 'standard' ? 'Focus View' : 'Standard View'}</span>
          </button>

          <span className="text-xs text-zinc-600">/</span>
          <span className="text-xs text-zinc-400 font-mono hidden md:inline">
            Single-Column ATS Compliance Verified
          </span>
        </div>

        {/* 2026 Export Dock */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={triggerPrint}
            className="px-3 py-1.5 text-xs font-semibold text-zinc-200 bg-zinc-950 border border-zinc-800 hover:bg-zinc-800 rounded-xl flex items-center gap-1.5 transition-colors shadow-xs"
            title="Print or Save as PDF"
          >
            <Printer className="w-3.5 h-3.5 text-indigo-400" />
            PDF / Print
          </button>

          <button
            type="button"
            onClick={() => exportToWordDoc(resume, candidateName, candidateContact)}
            className="px-3 py-1.5 text-xs font-semibold text-zinc-200 bg-zinc-950 border border-zinc-800 hover:bg-zinc-800 rounded-xl flex items-center gap-1.5 transition-colors shadow-xs"
            title="Download Word Document"
          >
            <FileText className="w-3.5 h-3.5 text-blue-400" />
            Word (.doc)
          </button>

          <button
            type="button"
            onClick={() => exportToPlainText(resume, candidateName, candidateContact)}
            className="px-3 py-1.5 text-xs font-semibold text-zinc-200 bg-zinc-950 border border-zinc-800 hover:bg-zinc-800 rounded-xl flex items-center gap-1.5 transition-colors shadow-xs"
            title="Download Plain Text"
          >
            <Download className="w-3.5 h-3.5 text-zinc-400" />
            Plain Text (.txt)
          </button>

          <button
            type="button"
            onClick={onOpenJsonModal}
            className="px-3 py-1.5 text-xs font-semibold text-indigo-300 bg-indigo-950/60 border border-indigo-800/80 hover:bg-indigo-900/80 rounded-xl flex items-center gap-1.5 transition-colors shadow-xs font-mono"
            title="View Structured Schema JSON"
          >
            <Code className="w-3.5 h-3.5" />
            Schema JSON
          </button>

          <button
            type="button"
            onClick={handleCopyText}
            className="px-3 py-1.5 text-xs font-semibold text-zinc-200 bg-zinc-950 border border-zinc-800 hover:bg-zinc-800 rounded-xl flex items-center gap-1.5 transition-colors shadow-xs"
            title="Copy plain text"
          >
            <Copy className="w-3.5 h-3.5" />
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      </div>

      {/* 2026 Studio Desk Drafting Canvas */}
      <div className={`desk-canvas rounded-2xl p-6 sm:p-12 border border-zinc-800 flex justify-center transition-all ${
        viewMode === 'focused' ? 'p-1 sm:p-4' : ''
      }`}>
        {/* Paper Document Canvas */}
        <div className="print-resume-sheet bg-white text-slate-900 rounded-xl shadow-2xl p-8 sm:p-14 max-w-4xl w-full border border-slate-200/90 transition-all font-sans">
          {/* Candidate Document Header */}
          <div className="border-b border-slate-300 pb-5 mb-6 text-center">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-950 uppercase">
              {candidateName || 'Candidate Name'}
            </h1>
            {candidateContact && (
              <div className="text-xs text-slate-600 mt-2 tracking-wide font-sans leading-relaxed">
                {candidateContact}
              </div>
            )}
          </div>

          {/* Section: Professional Summary */}
          <div className="mb-6">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-950 border-b border-slate-300 pb-1 mb-2.5">
              Professional Summary
            </div>
            {isEditing ? (
              <textarea
                value={resume.summary}
                onChange={handleSummaryChange}
                rows={4}
                className="w-full text-xs sm:text-sm font-sans p-3 bg-slate-50 border border-indigo-400 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500 text-slate-900"
              />
            ) : (
              <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-sans text-justify">
                {resume.summary}
              </p>
            )}
          </div>

          {/* Section: Experience */}
          <div className="mb-6">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-950 border-b border-slate-300 pb-1 mb-3">
              Professional Experience
            </div>

            <div className="space-y-5">
              {resume.experiences.map((exp, expIdx) => (
                <div key={expIdx} className="space-y-1.5">
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between text-xs sm:text-sm">
                    <div className="font-bold text-slate-950">
                      {exp.company}{' '}
                      <span className="font-normal text-slate-600 italic">
                        — {exp.role}
                      </span>
                    </div>
                    <div className="text-xs font-mono text-slate-500 shrink-0">
                      {exp.dates}
                    </div>
                  </div>

                  <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-slate-800 leading-relaxed font-sans">
                    {exp.bullet_points.map((bullet, bIdx) => (
                      <li key={bIdx} className="group">
                        {isEditing ? (
                          <div className="flex items-start gap-2 my-1">
                            <textarea
                              value={bullet}
                              onChange={(e) => handleBulletChange(expIdx, bIdx, e.target.value)}
                              rows={2}
                              className="flex-1 text-xs font-sans p-2 bg-slate-50 border border-indigo-300 rounded text-slate-900"
                            />
                            <button
                              type="button"
                              onClick={() => handleDeleteBullet(expIdx, bIdx)}
                              className="text-red-500 hover:text-red-700 p-1 mt-1"
                              title="Delete bullet"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <span>{bullet}</span>
                        )}
                      </li>
                    ))}
                  </ul>

                  {isEditing && (
                    <button
                      type="button"
                      onClick={() => handleAddBullet(expIdx)}
                      className="text-[11px] text-indigo-600 font-semibold hover:text-indigo-800 flex items-center gap-1 mt-2"
                    >
                      <Plus className="w-3 h-3" /> Add Bullet Point
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Section: Technical Skills */}
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-950 border-b border-slate-300 pb-1 mb-2.5">
              Technical Skills & Competencies
            </div>
            {isEditing ? (
              <div className="space-y-1">
                <input
                  type="text"
                  value={resume.skills.join(', ')}
                  onChange={handleSkillsChange}
                  className="w-full text-xs font-sans p-2.5 bg-slate-50 border border-indigo-300 rounded-lg text-slate-900"
                  placeholder="Comma separated skills..."
                />
                <span className="text-[11px] text-slate-500">Separate skills with commas</span>
              </div>
            ) : (
              <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-sans">
                {resume.skills.map((skill, idx) => (
                  <span key={idx}>
                    <strong className="font-semibold text-slate-950">{skill}</strong>
                    {idx < resume.skills.length - 1 && (
                      <span className="text-slate-400 mx-2">·</span>
                    )}
                  </span>
                ))}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
