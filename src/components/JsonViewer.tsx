import { useState } from 'react';
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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-zinc-950/40 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white text-zinc-900 rounded-3xl max-w-4xl w-full shadow-2xl border border-zinc-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-zinc-50 border-b border-zinc-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-rose-50 text-rose-600 rounded-xl border border-rose-200">
              <Code className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-zinc-950">Structured Resume JSON</h3>
                <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded font-mono">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  Verified Schema
                </span>
              </div>
              <p className="text-xs text-zinc-500 mt-0.5">
                Machine-readable structured payload containing your authentic career facts.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className="px-3 py-1.5 text-xs font-bold text-zinc-700 bg-white hover:bg-zinc-100 rounded-xl flex items-center gap-1.5 transition-colors border border-zinc-200 shadow-2xs"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-zinc-500" />}
              {copied ? 'Copied' : 'Copy JSON'}
            </button>

            <button
              type="button"
              onClick={() => exportToJson(data)}
              className="px-3.5 py-1.5 text-xs font-bold text-white bg-gradient-to-r from-orange-500 via-rose-500 to-fuchsia-600 hover:from-orange-600 hover:via-rose-600 hover:to-fuchsia-700 rounded-xl flex items-center gap-1.5 transition-all shadow-md shadow-rose-500/20"
            >
              <Download className="w-3.5 h-3.5" />
              Download .json
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-zinc-400 hover:text-zinc-900 rounded-lg transition-colors ml-2"
              aria-label="Close JSON modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Schema Status Checklist */}
        <div className="bg-zinc-100/60 px-6 py-2.5 border-b border-zinc-200 flex flex-wrap items-center gap-4 text-xs font-mono text-zinc-600">
          <span className="text-zinc-900 font-bold font-sans">Schema Elements:</span>
          <span className="text-emerald-700 font-semibold flex items-center gap-1">
            ✓ missing_keywords ({payloadToDisplay.missing_keywords_and_questions.length})
          </span>
          <span className="text-emerald-700 font-semibold flex items-center gap-1">
            ✓ tailored_resume.summary
          </span>
          <span className="text-emerald-700 font-semibold flex items-center gap-1">
            ✓ experiences ({payloadToDisplay.tailored_resume.experiences.length})
          </span>
          <span className="text-emerald-700 font-semibold flex items-center gap-1">
            ✓ skills ({payloadToDisplay.tailored_resume.skills.length})
          </span>
        </div>

        {/* Code Content */}
        <div className="p-6 overflow-y-auto flex-1 font-mono text-xs text-zinc-100 bg-zinc-950 selection:bg-rose-900 selection:text-white leading-relaxed">
          <pre className="whitespace-pre-wrap">{jsonString}</pre>
        </div>
      </div>
    </div>
  );
}
