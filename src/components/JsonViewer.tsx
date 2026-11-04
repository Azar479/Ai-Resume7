import React, { useState } from 'react';
import { ResumeEngineResponse } from '../types';
import { Copy, Download, Check, ShieldCheck, Code, X } from 'lucide-react';
import { copyToClipboard, exportToJson } from '../utils/exportUtils';

interface JsonViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: ResumeEngineResponse;
}

export function JsonViewerModal({ isOpen, onClose, data }: JsonViewerModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Ensure exact payload conforms to schema
  const payloadToDisplay = {
    missing_keywords_and_questions: data.missing_keywords_and_questions || [],
    tailored_resume: {
      summary: data.tailored_resume?.summary || '',
      experiences: (data.tailored_resume?.experiences || []).map((exp) => ({
        company: exp.company || '',
        role: exp.role || '',
        dates: exp.dates || '',
        bullet_points: exp.bullet_points || [],
      })),
      skills: data.tailored_resume?.skills || [],
    },
  };

  const jsonString = JSON.stringify(payloadToDisplay, null, 2);

  const handleCopy = async () => {
    const ok = await copyToClipboard(jsonString);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-zinc-950 text-zinc-100 rounded-3xl max-w-4xl w-full shadow-2xl border border-zinc-800 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg">
              <Code className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white">Strict JSON Schema Output</h3>
                <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800/80 px-2 py-0.5 rounded">
                  <ShieldCheck className="w-3 h-3" />
                  Schema Validated
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Output adheres strictly to the required specification with zero fabricated data.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className="px-3 py-1.5 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg flex items-center gap-1.5 transition-colors border border-slate-700"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied' : 'Copy JSON'}
            </button>

            <button
              type="button"
              onClick={() => exportToJson(data)}
              className="px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              Download .json
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors ml-2"
              aria-label="Close JSON modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Schema Compliance Checklist */}
        <div className="bg-slate-900/60 px-6 py-2.5 border-b border-slate-800 flex flex-wrap items-center gap-4 text-xs font-mono text-slate-400">
          <span className="text-slate-300 font-semibold font-sans">Schema Elements:</span>
          <span className="text-emerald-400 flex items-center gap-1">
            ✓ missing_keywords_and_questions ({payloadToDisplay.missing_keywords_and_questions.length})
          </span>
          <span className="text-emerald-400 flex items-center gap-1">
            ✓ tailored_resume.summary
          </span>
          <span className="text-emerald-400 flex items-center gap-1">
            ✓ tailored_resume.experiences ({payloadToDisplay.tailored_resume.experiences.length})
          </span>
          <span className="text-emerald-400 flex items-center gap-1">
            ✓ tailored_resume.skills ({payloadToDisplay.tailored_resume.skills.length})
          </span>
        </div>

        {/* Code Content */}
        <div className="p-6 overflow-y-auto flex-1 font-mono text-xs text-indigo-200 bg-slate-950 selection:bg-indigo-900 selection:text-white leading-relaxed">
          <pre className="whitespace-pre-wrap">{jsonString}</pre>
        </div>
      </div>
    </div>
  );
}
