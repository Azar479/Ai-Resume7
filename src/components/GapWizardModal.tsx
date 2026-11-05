import React, { useState, useEffect } from 'react';
import { GapItem, GapStatus } from '../types';
import {
  HelpCircle,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  ShieldAlert,
  X,
  CheckCircle2,
} from 'lucide-react';

interface GapWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  gaps: GapItem[];
  onUpdateGap: (id: string, status: GapStatus, notes: string) => void;
  onSubmitVerification: () => void;
  isGenerating: boolean;
}

export function GapWizardModal({
  isOpen,
  onClose,
  gaps,
  onUpdateGap,
  onSubmitVerification,
  isGenerating,
}: GapWizardModalProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Keyboard navigation support
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLInputElement) {
        return;
      }

      if (e.key === 'y' || e.key === 'Y' || e.key === '1') {
        handleSelectStatus('confirmed');
      } else if (e.key === 'n' || e.key === 'N' || e.key === '2') {
        handleSelectStatus('unfamiliar');
      } else if (e.key === 'f' || e.key === 'F' || e.key === '3') {
        handleSelectStatus('studying');
      } else if (e.key === 'ArrowRight') {
        setCurrentIndex((prev) => Math.min(gaps.length - 1, prev + 1));
      } else if (e.key === 'ArrowLeft') {
        setCurrentIndex((prev) => Math.max(0, prev - 1));
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex, gaps]);

  if (!isOpen || gaps.length === 0) return null;

  const currentGap = gaps[currentIndex];
  const total = gaps.length;
  const answeredCount = gaps.filter((g) => g.status !== 'pending').length;
  const progressPercent = Math.round((answeredCount / total) * 100);

  const handleSelectStatus = (status: GapStatus) => {
    onUpdateGap(currentGap.id, status, currentGap.contextNotes);
  };

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onUpdateGap(currentGap.id, currentGap.status, e.target.value);
  };

  const handleMarkAllRemainingNo = () => {
    gaps.forEach((g) => {
      if (g.status === 'pending') {
        onUpdateGap(g.id, 'unfamiliar', '');
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-zinc-950 text-zinc-100 rounded-3xl max-w-2xl w-full shadow-2xl border border-zinc-800 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Wizard Header */}
        <div className="px-6 py-4 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/70 border border-emerald-800/80 px-2 py-0.5 rounded">
                Quick Skill Check
              </span>
              <span className="text-xs text-zinc-500 font-mono">· 100% Real Experience</span>
            </div>
            <h2 className="text-base font-bold text-white mt-1">
              Review Skills Needed for This Job
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white rounded-lg transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar & Jump Bar */}
        <div className="bg-zinc-900/60 border-b border-zinc-800 px-6 py-3">
          <div className="flex items-center justify-between text-xs text-zinc-400 mb-2 font-mono">
            <span>
              Skill {currentIndex + 1} of {total}
            </span>
            <span className="tabular-nums text-zinc-300">
              {answeredCount}/{total} answered ({progressPercent}%)
            </span>
          </div>
          <div className="w-full bg-zinc-800 h-1 rounded-full overflow-hidden">
            <div
              className="bg-indigo-500 h-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Quick jump navigation dots */}
          <div className="flex items-center gap-1.5 mt-3 overflow-x-auto py-1">
            {gaps.map((gap, idx) => (
              <button
                key={gap.id}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                className={`h-6 px-2 text-[11px] font-mono rounded-md flex items-center gap-1 shrink-0 transition-colors ${
                  idx === currentIndex
                    ? 'bg-indigo-600 text-white font-bold ring-2 ring-indigo-400/40'
                    : gap.status === 'confirmed'
                    ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800'
                    : gap.status === 'unfamiliar'
                    ? 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                    : gap.status === 'studying'
                    ? 'bg-amber-950/80 text-amber-300 border border-amber-800'
                    : 'bg-zinc-900 border border-zinc-800 text-zinc-500'
                }`}
                title={`Jump to Skill ${idx + 1}`}
              >
                Q{idx + 1}
                {gap.status === 'confirmed' && '✓'}
                {gap.status === 'unfamiliar' && '—'}
                {gap.status === 'studying' && '◐'}
              </button>
            ))}
          </div>
        </div>

        {/* Question Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 shadow-inner">
            <div className="flex items-start gap-3.5">
              <div className="p-2.5 bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 rounded-xl shrink-0 mt-0.5">
                <HelpCircle className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold text-indigo-400 uppercase tracking-wider">
                  Required Skill in Job Post
                </span>
                <p className="text-base font-semibold text-white mt-1 leading-snug">
                  {currentGap.question}
                </p>
                <p className="text-xs text-zinc-500 mt-2">
                  This skill is highlighted in the job description. Let us know if you have used it so we only include your honest experience.
                </p>
              </div>
            </div>
          </div>

          {/* Verification Choice Prompt Buttons */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-mono uppercase tracking-wider text-zinc-400">
              <span>Choose Your Answer:</span>
              <span className="text-[10px] text-zinc-500">Press: [Y] Yes · [N] No · [F] Learning</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Option 1: Yes */}
              <button
                type="button"
                onClick={() => handleSelectStatus('confirmed')}
                className={`p-4 text-left rounded-2xl border transition-all flex flex-col justify-between ${
                  currentGap.status === 'confirmed'
                    ? 'border-emerald-500 bg-emerald-950/40 ring-1 ring-emerald-500/50'
                    : 'border-zinc-800 bg-zinc-900/60 hover:border-zinc-700 hover:bg-zinc-900'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-emerald-400">Yes, I Have Used This</span>
                  <kbd className="font-mono text-[10px] text-zinc-500 bg-zinc-950 px-1.5 py-0.5 rounded border border-zinc-800">
                    Y
                  </kbd>
                </div>
                <span className="text-[11px] text-zinc-400 leading-tight">
                  Real experience on a job or personal project.
                </span>
              </button>

              {/* Option 2: No */}
              <button
                type="button"
                onClick={() => handleSelectStatus('unfamiliar')}
                className={`p-4 text-left rounded-2xl border transition-all flex flex-col justify-between ${
                  currentGap.status === 'unfamiliar'
                    ? 'border-zinc-500 bg-zinc-800/80 ring-1 ring-zinc-400/30'
                    : 'border-zinc-800 bg-zinc-900/60 hover:border-zinc-700 hover:bg-zinc-900'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-zinc-300">No Experience</span>
                  <kbd className="font-mono text-[10px] text-zinc-500 bg-zinc-950 px-1.5 py-0.5 rounded border border-zinc-800">
                    N
                  </kbd>
                </div>
                <span className="text-[11px] text-zinc-400 leading-tight">
                  Leave this off my resume to stay 100% honest.
                </span>
              </button>

              {/* Option 3: Familiar */}
              <button
                type="button"
                onClick={() => handleSelectStatus('studying')}
                className={`p-4 text-left rounded-2xl border transition-all flex flex-col justify-between ${
                  currentGap.status === 'studying'
                    ? 'border-amber-500 bg-amber-950/40 ring-1 ring-amber-500/50'
                    : 'border-zinc-800 bg-zinc-900/60 hover:border-zinc-700 hover:bg-zinc-900'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-amber-400">Familiar / Learning</span>
                  <kbd className="font-mono text-[10px] text-zinc-500 bg-zinc-950 px-1.5 py-0.5 rounded border border-zinc-800">
                    F
                  </kbd>
                </div>
                <span className="text-[11px] text-zinc-400 leading-tight">
                  Studying or foundational knowledge, not production.
                </span>
              </button>
            </div>
          </div>

          {/* Context Notes Box */}
          {currentGap.status === 'confirmed' && (
            <div className="space-y-1.5 bg-emerald-950/20 border border-emerald-800/60 rounded-2xl p-4 transition-all">
              <label className="text-xs font-bold text-emerald-300 block">
                How or where did you use it?
              </label>
              <p className="text-[11px] text-emerald-400/80">
                A short detail helps weave it naturally into your real work (e.g. &ldquo;Used Kubernetes and Helm for deploying microservices&rdquo;).
              </p>
              <textarea
                value={currentGap.contextNotes}
                onChange={handleNotesChange}
                placeholder="Where, when, or in which project did you use this skill?"
                rows={3}
                className="w-full text-xs font-sans p-3 bg-zinc-950 border border-emerald-700/60 rounded-xl focus:outline-hidden focus:ring-1 focus:ring-emerald-500 text-zinc-100 placeholder:text-zinc-600"
              />
            </div>
          )}

          {currentGap.status === 'studying' && (
            <div className="space-y-1.5 bg-amber-950/20 border border-amber-800/60 rounded-2xl p-4 transition-all">
              <label className="text-xs font-bold text-amber-300 block">
                Describe what you know:
              </label>
              <textarea
                value={currentGap.contextNotes}
                onChange={handleNotesChange}
                placeholder="e.g. Completed a course, built a tutorial demo, or studying for a test..."
                rows={2}
                className="w-full text-xs font-sans p-3 bg-zinc-950 border border-amber-700/60 rounded-xl focus:outline-hidden focus:ring-1 focus:ring-amber-500 text-zinc-100 placeholder:text-zinc-600"
              />
            </div>
          )}

          {currentGap.status === 'unfamiliar' && (
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-xs text-zinc-400 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-zinc-500 shrink-0" />
              <span>
                <strong>Kept Honest:</strong> This skill will NOT be added to your resume bullets or technical skills list.
              </span>
            </div>
          )}
        </div>

        {/* Wizard Footer */}
        <div className="px-6 py-4 bg-zinc-900 border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentIndex === 0}
              className="px-3 py-2 text-xs font-medium text-zinc-300 bg-zinc-950 border border-zinc-800 rounded-xl hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Previous
            </button>

            <button
              type="button"
              onClick={() => setCurrentIndex((prev) => Math.min(total - 1, prev + 1))}
              disabled={currentIndex === total - 1}
              className="px-3 py-2 text-xs font-medium text-zinc-300 bg-zinc-950 border border-zinc-800 rounded-xl hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 transition-colors"
            >
              Next
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            {answeredCount < total && (
              <button
                type="button"
                onClick={handleMarkAllRemainingNo}
                className="text-[11px] text-zinc-500 hover:text-zinc-300 underline ml-2 whitespace-nowrap font-mono"
                title="Mark all remaining questions as No Experience"
              >
                Mark rest as No
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-2 text-xs font-medium text-zinc-400 hover:text-white transition-colors"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={onSubmitVerification}
              disabled={isGenerating}
              className="px-5 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-all shadow-md shadow-indigo-600/30 flex items-center gap-1.5 disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating Tailored Resume...
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  Create Tailored Resume
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
