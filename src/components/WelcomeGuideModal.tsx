import {
  FileText,
  ShieldCheck,
  Columns,
  Sparkles,
  ArrowRight,
  X,
} from 'lucide-react';

interface WelcomeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExploreSample?: () => void;
}

export function WelcomeGuideModal({
  isOpen,
  onClose,
  onExploreSample,
}: WelcomeGuideModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden">
        {/* Subtle top ambient glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-indigo-500/10 blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          title="Close guide"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="space-y-2 mb-6">
          <div className="flex items-center gap-2 text-xs font-mono text-indigo-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Welcome Guide</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            AI Resume Tailorer
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed max-w-xl">
            Tailor your resume to any job description with high-impact ATS keywords while strictly preserving your authentic companies, dates, and original document format.
          </p>
        </div>

        {/* Core Pillars Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          <div className="p-4 rounded-2xl bg-zinc-950/70 border border-zinc-800/80 space-y-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-950/60 border border-indigo-800/60 flex items-center justify-center text-indigo-400">
              <FileText className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-bold text-zinc-100">Exact Format Mirror</h3>
            <p className="text-[11px] text-zinc-400 leading-normal">
              Maintains your exact section sequence, font style, and header layout from your uploaded resume.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-950/70 border border-zinc-800/80 space-y-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-950/60 border border-emerald-800/60 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-bold text-zinc-100">100% Truthful Content</h3>
            <p className="text-[11px] text-zinc-400 leading-normal">
              Never hallucinates false credentials, made-up metrics, or fake employers. Only rewords your real experience.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-950/70 border border-zinc-800/80 space-y-2">
            <div className="w-8 h-8 rounded-xl bg-blue-950/60 border border-blue-800/60 flex items-center justify-center text-blue-400">
              <Columns className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-bold text-zinc-100">Side-by-Side Review</h3>
            <p className="text-[11px] text-zinc-400 leading-normal">
              Inspect your source document canvas and tailored output side-by-side, then export to Word, PDF, or text.
            </p>
          </div>
        </div>

        {/* 3 Step Quickstart Guide */}
        <div className="bg-zinc-950/50 border border-zinc-800/80 rounded-2xl p-4 sm:p-5 mb-6 space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-zinc-300">
            Where to Start
          </div>
          <div className="space-y-2.5 text-xs text-zinc-300">
            <div className="flex items-start gap-3">
              <span className="font-mono text-indigo-400 font-bold shrink-0 mt-0.5">01</span>
              <div>
                <strong className="text-white">Upload your resume:</strong> Drop a PDF, TXT file, or paste your resume text. The visual document viewer will display your document preview.
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="font-mono text-indigo-400 font-bold shrink-0 mt-0.5">02</span>
              <div>
                <strong className="text-white">Paste the job description:</strong> Provide the target job posting with its required qualifications and responsibilities.
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="font-mono text-indigo-400 font-bold shrink-0 mt-0.5">03</span>
              <div>
                <strong className="text-white">Tailor & Export:</strong> Click "Tailor Resume" to generate your tailored resume, review the diff, and download Word (.doc), PDF, or plain text.
              </div>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-zinc-800/80">
          {onExploreSample ? (
            <button
              type="button"
              onClick={() => {
                onExploreSample();
                onClose();
              }}
              className="w-full sm:w-auto px-4 py-2.5 text-xs font-medium text-zinc-300 bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 rounded-xl transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Explore with Sample Resume</span>
            </button>
          ) : (
            <span />
          )}

          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-all shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2"
          >
            <span>Get Started</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
