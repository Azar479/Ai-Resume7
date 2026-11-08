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
  Columns,
  Sparkles,
  Layers,
} from 'lucide-react';
import {
  exportToPlainText,
  exportToWordDoc,
  triggerPrint,
  copyToClipboard,
} from '../utils/exportUtils';
import { DocumentViewer } from './DocumentViewer';

interface ResumePreviewProps {
  resume: TailoredResume;
  rawResponse?: ResumeEngineResponse;
  candidateName: string;
  candidateContact: string;
  pdfBase64?: string | null;
  fileName?: string | null;
  originalResumeText?: string;
  onUpdateResume: (updated: TailoredResume) => void;
  onOpenJsonModal: () => void;
}

export function ResumePreview({
  resume,
  rawResponse: _rawResponse,
  candidateName,
  candidateContact,
  pdfBase64,
  fileName,
  originalResumeText,
  onUpdateResume,
  onOpenJsonModal,
}: ResumePreviewProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState<'standard' | 'side-by-side' | 'focused'>('standard');
  const [layoutStyle, setLayoutStyle] = useState<'document' | 'text'>('document');

  const blueprint = resume.blueprint;
  const rawSections = blueprint?.sections || resume.sections || [];
  const sections = rawSections.filter(
    (s) => s.title.toLowerCase() !== candidateName.toLowerCase()
  );

  // Header styling based on blueprint
  const headerAlignment = blueprint?.header_alignment === 'left' ? 'text-left' : 'text-center';
  const fontClass =
    blueprint?.font_style === 'serif'
      ? 'font-serif'
      : blueprint?.font_style === 'mono'
      ? 'font-mono'
      : 'font-sans';

  const handleSummaryChange = (val: string) => {
    const updatedSections = sections?.map((s) => (s.type === 'summary' ? { ...s, content: val } : s));
    onUpdateResume({
      ...resume,
      summary: val,
      sections: updatedSections,
      blueprint: blueprint ? { ...blueprint, sections: updatedSections || [] } : undefined,
    });
  };

  const handleBulletChange = (expIdx: number, bIdx: number, val: string) => {
    const newExps = [...resume.experiences];
    const newBullets = [...newExps[expIdx].bullet_points];
    newBullets[bIdx] = val;
    newExps[expIdx] = { ...newExps[expIdx], bullet_points: newBullets };

    const updatedSections = sections?.map((s) =>
      s.type === 'experience' ? { ...s, experiences: newExps } : s
    );

    onUpdateResume({
      ...resume,
      experiences: newExps,
      sections: updatedSections,
      blueprint: blueprint ? { ...blueprint, sections: updatedSections || [] } : undefined,
    });
  };

  const handleAddBullet = (expIdx: number) => {
    const newExps = [...resume.experiences];
    const newBullets = [
      ...newExps[expIdx].bullet_points,
      'Architected high-impact workflow delivering measurable latency reduction and system reliability...',
    ];
    newExps[expIdx] = { ...newExps[expIdx], bullet_points: newBullets };

    const updatedSections = sections?.map((s) =>
      s.type === 'experience' ? { ...s, experiences: newExps } : s
    );

    onUpdateResume({
      ...resume,
      experiences: newExps,
      sections: updatedSections,
      blueprint: blueprint ? { ...blueprint, sections: updatedSections || [] } : undefined,
    });
  };

  const handleDeleteBullet = (expIdx: number, bIdx: number) => {
    const newExps = [...resume.experiences];
    const newBullets = newExps[expIdx].bullet_points.filter((_, i) => i !== bIdx);
    newExps[expIdx] = { ...newExps[expIdx], bullet_points: newBullets };

    const updatedSections = sections?.map((s) =>
      s.type === 'experience' ? { ...s, experiences: newExps } : s
    );

    onUpdateResume({
      ...resume,
      experiences: newExps,
      sections: updatedSections,
      blueprint: blueprint ? { ...blueprint, sections: updatedSections || [] } : undefined,
    });
  };

  const handleSkillsChange = (val: string) => {
    const skillsArray = val
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const updatedSections = sections?.map((s) =>
      s.type === 'skills' ? { ...s, skills: skillsArray } : s
    );

    onUpdateResume({
      ...resume,
      skills: skillsArray,
      sections: updatedSections,
      blueprint: blueprint ? { ...blueprint, sections: updatedSections || [] } : undefined,
    });
  };

  const handleCopyText = async () => {
    const textToCopy =
      resume.full_tailored_text && resume.full_tailored_text.length > 50
        ? resume.full_tailored_text
        : `${candidateName.toUpperCase()}\n${candidateContact}\n\nSUMMARY:\n${resume.summary}\n\nEXPERIENCE:\n` +
          resume.experiences
            .map(
              (e) =>
                `${e.company} | ${e.role} (${e.dates})\n` +
                e.bullet_points.map((b) => `• ${b}`).join('\n')
            )
            .join('\n\n') +
          `\n\nSKILLS:\n${resume.skills.join(', ')}`;

    const ok = await copyToClipboard(textToCopy);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Render an individual section card
  const renderSection = (sec: any, secIdx: number) => {
    const headingText = sec.title || 'SECTION';

    if (sec.type === 'summary') {
      const summaryText = sec.content || resume.summary;
      return (
        <div key={sec.id || secIdx} className="mb-6">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-950 border-b border-slate-300 pb-1 mb-2.5">
            {headingText}
          </div>
          {isEditing ? (
            <textarea
              value={summaryText}
              onChange={(e) => handleSummaryChange(e.target.value)}
              rows={4}
              className="w-full text-xs sm:text-sm font-sans p-3 bg-slate-50 border border-indigo-400 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500 text-slate-900 leading-relaxed"
            />
          ) : (
            <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-sans text-justify">
              {summaryText}
            </p>
          )}
        </div>
      );
    }

    if (sec.type === 'skills') {
      const skillsList = sec.skills || resume.skills || [];
      const categories = sec.skill_categories;

      return (
        <div key={sec.id || secIdx} className="mb-6">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-950 border-b border-slate-300 pb-1 mb-2.5">
            {headingText}
          </div>
          {isEditing ? (
            <div className="space-y-1">
              <input
                type="text"
                value={skillsList.join(', ')}
                onChange={(e) => handleSkillsChange(e.target.value)}
                className="w-full text-xs font-sans p-2.5 bg-slate-50 border border-indigo-300 rounded-lg text-slate-900"
                placeholder="Comma separated skills..."
              />
              <span className="text-[11px] text-slate-500">Separate skills with commas</span>
            </div>
          ) : categories && categories.length > 0 ? (
            <div className="space-y-1.5 text-xs sm:text-sm text-slate-800 leading-relaxed font-sans">
              {categories.map((cat: any, cIdx: number) => (
                <div key={cIdx} className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2">
                  <span className="font-bold text-slate-950 shrink-0">{cat.category}:</span>
                  <span className="text-slate-800">{cat.items.join(', ')}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-sans">
              {skillsList.map((skill: string, idx: number) => (
                <span key={idx}>
                  <strong className="font-semibold text-slate-950">{skill}</strong>
                  {idx < skillsList.length - 1 && (
                    <span className="text-slate-400 mx-2">·</span>
                  )}
                </span>
              ))}
            </p>
          )}
        </div>
      );
    }

    if (sec.type === 'experience') {
      const exps = sec.experiences || resume.experiences;
      return (
        <div key={sec.id || secIdx} className="mb-6">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-950 border-b border-slate-300 pb-1 mb-3">
            {headingText}
          </div>

          <div className="space-y-5">
            {exps.map((exp: any, expIdx: number) => (
              <div key={expIdx} className="space-y-1.5">
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between text-xs sm:text-sm gap-1">
                  <div className="font-bold text-slate-950">
                    {exp.company}{' '}
                    {exp.role && (
                      <span className="font-normal text-slate-700 italic ml-1">
                        — {exp.role}
                      </span>
                    )}
                  </div>
                  {exp.dates && (
                    <div className="text-xs font-mono text-slate-600 shrink-0 sm:text-right">
                      {exp.dates}
                    </div>
                  )}
                </div>

                <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-slate-800 leading-relaxed font-sans">
                  {exp.bullet_points.map((bullet: string, bIdx: number) => (
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
      );
    }

    if (sec.type === 'projects') {
      const projs = sec.projects || resume.projects || [];
      return (
        <div key={sec.id || secIdx} className="mb-6">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-950 border-b border-slate-300 pb-1 mb-3">
            {headingText}
          </div>
          <div className="space-y-4">
            {projs.map((p: any, pIdx: number) => (
              <div key={pIdx} className="space-y-1.5">
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between text-xs sm:text-sm gap-1">
                  <div className="font-bold text-slate-950">
                    {p.title}{' '}
                    {p.technologies && (
                      <span className="font-normal text-slate-600 text-xs italic ml-1">
                        ({p.technologies})
                      </span>
                    )}
                  </div>
                  {p.dates && (
                    <div className="text-xs font-mono text-slate-600 shrink-0 sm:text-right">
                      {p.dates}
                    </div>
                  )}
                </div>
                {p.bullet_points && p.bullet_points.length > 0 && (
                  <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm text-slate-800 leading-relaxed font-sans">
                    {p.bullet_points.map((b: string, bIdx: number) => (
                      <li key={bIdx}>{b}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (sec.type === 'education') {
      const edus = sec.education || resume.education || [];
      return (
        <div key={sec.id || secIdx} className="mb-6">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-950 border-b border-slate-300 pb-1 mb-3">
            {headingText}
          </div>
          <div className="space-y-3">
            {edus.map((edu: any, eIdx: number) => (
              <div key={eIdx} className="text-xs sm:text-sm">
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                  <div className="font-bold text-slate-950">{edu.institution}</div>
                  {edu.dates && (
                    <div className="text-xs font-mono text-slate-600 shrink-0 sm:text-right">
                      {edu.dates}
                    </div>
                  )}
                </div>
                <div className="text-slate-700 italic">{edu.degree}</div>
                {edu.details && edu.details.length > 0 && (
                  <ul className="list-disc pl-5 mt-1 space-y-0.5 text-xs text-slate-600">
                    {edu.details.map((d: string, dIdx: number) => (
                      <li key={dIdx}>{d}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      );
    }

    // Default for certifications, awards, or custom sections
    const items = sec.items || [];
    return (
      <div key={sec.id || secIdx} className="mb-6">
        <div className="text-xs font-bold uppercase tracking-wider text-slate-950 border-b border-slate-300 pb-1 mb-2.5">
          {headingText}
        </div>
        {items.length > 0 ? (
          <div className="space-y-2">
            {items.map((item: any, itIdx: number) => (
              <div key={itIdx} className="text-xs sm:text-sm">
                <div className="flex justify-between font-semibold text-slate-950 gap-1">
                  <span>{item.heading}</span>
                  {item.dates && <span className="font-mono text-slate-600">{item.dates}</span>}
                </div>
                {item.content && <p className="text-slate-700 mt-0.5">{item.content}</p>}
                {item.bullet_points && item.bullet_points.length > 0 && (
                  <ul className="list-disc pl-5 mt-1 space-y-0.5 text-xs text-slate-700">
                    {item.bullet_points.map((b: string, bIdx: number) => (
                      <li key={bIdx}>{b}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs sm:text-sm text-slate-800 leading-relaxed">{sec.content}</p>
        )}
      </div>
    );
  };

  const PaperSheet = (
    <div className={`print-resume-sheet bg-white text-slate-900 rounded-xl shadow-2xl p-8 sm:p-14 max-w-4xl w-full border border-slate-200/90 transition-all ${fontClass}`}>
      {/* If Text Mode is toggled, show editable text. Otherwise show styled resume document! */}
      {layoutStyle === 'text' ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200 text-xs font-mono text-slate-500">
            <span>Plain Text / Markdown Representation</span>
            <span>Formatted for ATS inputs</span>
          </div>
          {isEditing ? (
            <textarea
              value={resume.full_tailored_text || ''}
              onChange={(e) => onUpdateResume({ ...resume, full_tailored_text: e.target.value })}
              rows={28}
              className="w-full text-xs font-mono p-4 bg-slate-50 border border-indigo-400 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500 text-slate-900 leading-relaxed"
            />
          ) : (
            <div className="text-xs text-slate-900 font-mono whitespace-pre-wrap leading-relaxed bg-slate-50 p-6 rounded-lg border border-slate-200">
              {resume.full_tailored_text || 'No text representation available.'}
            </div>
          )}
        </div>
      ) : (
        <div>
          {/* Candidate Document Header */}
          <div
            className={`border-b border-slate-300 pb-5 mb-6 ${headerAlignment}`}
          >
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-950 uppercase">
              {candidateName || 'Candidate Name'}
            </h1>
            {candidateContact && (
              <div className="text-xs text-slate-600 mt-2 tracking-wide font-sans leading-relaxed">
                {candidateContact}
              </div>
            )}
          </div>

          {/* Dynamic Sections rendered in exact sequence */}
          {sections && sections.length > 0 ? (
            sections.map((sec, idx) => renderSection(sec, idx))
          ) : (
            <>
              {renderSection({ type: 'summary', title: 'Professional Summary' }, 0)}
              {renderSection({ type: 'experience', title: 'Professional Experience' }, 1)}
              {renderSection({ type: 'skills', title: 'Technical Skills & Competencies' }, 2)}
            </>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* 2026 Floating Action Toolbar */}
      <div className="no-print bg-zinc-900/80 backdrop-blur-md border border-zinc-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          {/* Format Presentation Switcher */}
          <div className="flex items-center gap-1 p-1 bg-zinc-950 rounded-xl border border-zinc-800">
            <button
              type="button"
              onClick={() => setLayoutStyle('document')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors ${
                layoutStyle === 'document'
                  ? 'bg-zinc-800 text-white shadow-xs'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
              title="Rendered in exact format, layout, and section sequence of your uploaded resume"
            >
              <FileText className="w-3.5 h-3.5 text-indigo-400" />
              <span>Document Preview</span>
            </button>

            <button
              type="button"
              onClick={() => setLayoutStyle('text')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg flex items-center gap-1.5 transition-colors ${
                layoutStyle === 'text'
                  ? 'bg-zinc-800 text-white shadow-xs'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
              title="View or copy raw plain-text format"
            >
              <Layers className="w-3.5 h-3.5 text-zinc-400" />
              <span>Raw Text</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => setIsEditing(!isEditing)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-all ${
              isEditing
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200'
            }`}
          >
            {isEditing ? <Check className="w-3.5 h-3.5" /> : <Edit3 className="w-3.5 h-3.5" />}
            <span>{isEditing ? 'Save Changes' : 'Edit Content'}</span>
          </button>

          {/* Side-by-Side Comparison Toggle */}
          <button
            type="button"
            onClick={() => setViewMode(viewMode === 'side-by-side' ? 'standard' : 'side-by-side')}
            className={`px-3 py-1.5 text-xs font-medium rounded-xl border transition-colors flex items-center gap-1.5 ${
              viewMode === 'side-by-side'
                ? 'bg-indigo-950/80 text-indigo-300 border-indigo-700/80 shadow-xs'
                : 'bg-zinc-950 text-zinc-400 hover:text-zinc-200 border-zinc-800'
            }`}
            title="Compare uploaded resume image side-by-side with tailored resume"
          >
            <Columns className="w-3.5 h-3.5" />
            <span>Side-by-Side View</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode(viewMode === 'focused' ? 'standard' : 'focused')}
            className="px-3 py-1.5 text-xs font-medium text-zinc-400 hover:text-zinc-200 bg-zinc-950 rounded-lg border border-zinc-800 hidden sm:flex items-center gap-1.5 font-mono"
            title="Toggle Focused View"
          >
            <Maximize2 className="w-3 h-3" />
            <span>{viewMode === 'focused' ? 'Standard' : 'Focus'}</span>
          </button>

          <span className="text-xs text-emerald-400 font-mono hidden xl:flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            Exact Uploaded Resume Format
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

      {/* Render Canvas: Side-by-Side Mode vs Standard Desk View */}
      {viewMode === 'side-by-side' ? (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Left: Original Uploaded Document Preview */}
          <div className="flex flex-col space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-zinc-400 px-1">
              <span className="font-bold text-zinc-200">Original Uploaded Document</span>
              <span className="text-zinc-500">Source Format</span>
            </div>
            <div className="h-[750px] overflow-hidden rounded-2xl">
              <DocumentViewer
                pdfBase64={pdfBase64 || null}
                fileName={fileName || 'Original Resume'}
                resumeText={originalResumeText || ''}
                candidateName={candidateName}
                candidateContact={candidateContact}
                blueprint={blueprint}
              />
            </div>
          </div>

          {/* Right: Tailored Resume Document */}
          <div className="flex flex-col space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-zinc-400 px-1">
              <span className="font-bold text-indigo-300">Tailored Resume (Exact Mirror)</span>
              <span className="text-emerald-400">ATS Optimized</span>
            </div>
            <div className="h-[750px] overflow-auto desk-canvas rounded-2xl p-4 sm:p-6 border border-zinc-800 flex justify-center">
              {PaperSheet}
            </div>
          </div>
        </div>
      ) : (
        <div
          className={`desk-canvas rounded-2xl p-6 sm:p-12 border border-zinc-800 flex justify-center transition-all ${
            viewMode === 'focused' ? 'p-1 sm:p-4' : ''
          }`}
        >
          {PaperSheet}
        </div>
      )}
    </div>
  );
}
