import { useState } from 'react';
import { TailoredResume, MatchInsights } from '../types';
import { CheckCircle2, ShieldCheck } from 'lucide-react';

interface DiffViewerProps {
  baseResumeText: string;
  tailoredResume: TailoredResume;
  insights?: MatchInsights;
}

export function DiffViewer({
  tailoredResume,
  insights,
}: DiffViewerProps) {
  const [highlightKeywords, setHighlightKeywords] = useState(true);

  const renderHighlightedText = (text: string) => {
    if (!highlightKeywords || !insights?.matched_keywords?.length) {
      return <span>{text}</span>;
    }

    const keywords = (insights.matched_keywords || []).filter((k) => k.length > 2);
    const verbs = (insights.action_verb_highlights || []).filter((v) => v.length > 3);

    const patternWords = [...keywords, ...verbs].map((w) =>
      w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    );

    if (patternWords.length === 0) return <span>{text}</span>;

    const regex = new RegExp(`\\b(${patternWords.join('|')})\\b`, 'gi');
    const parts = text.split(regex);

    return (
      <span>
        {parts.map((part, i) => {
          const isKw = keywords.some((k) => k.toLowerCase() === part.toLowerCase());
          const isVerb = verbs.some((v) => v.toLowerCase() === part.toLowerCase());

          if (isKw) {
            return (
              <span
                key={i}
                className="bg-emerald-50 text-emerald-800 font-semibold px-1.5 py-0.5 rounded border border-emerald-200 font-mono mx-0.5"
                title="Matched Job Keyword"
              >
                {part}
              </span>
            );
          } else if (isVerb) {
            return (
              <span
                key={i}
                className="bg-rose-50 text-rose-800 font-semibold px-1.5 py-0.5 rounded border border-rose-200 font-mono mx-0.5"
                title="Strong Action Word"
              >
                {part}
              </span>
            );
          }
          return <span key={i}>{part}</span>;
        })}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Controls Bar */}
      <div className="bg-white border border-zinc-200/90 rounded-3xl p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-extrabold text-zinc-950 flex items-center gap-2.5">
            <span>Before & After: Experience Refinements</span>
            <span className="text-[11px] font-mono text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              100% Real Experience
            </span>
          </h3>
          <p className="text-xs text-zinc-500 mt-1">
            See how your actual experience bullet points were reworded with stronger action words and job keywords.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-xs font-semibold text-zinc-700 cursor-pointer select-none bg-zinc-50 px-3.5 py-2 rounded-xl border border-zinc-200 shadow-2xs hover:bg-zinc-100 transition-colors">
            <input
              type="checkbox"
              checked={highlightKeywords}
              onChange={(e) => setHighlightKeywords(e.target.checked)}
              className="rounded border-zinc-300 text-rose-600 focus:ring-rose-500 w-4 h-4"
            />
            Highlight Keywords & Action Words
          </label>
        </div>
      </div>

      {/* Legend Strip */}
      {highlightKeywords && (
        <div className="flex flex-wrap items-center gap-4 text-xs bg-white border border-zinc-200/90 rounded-2xl px-5 py-3 font-mono shadow-xs">
          <span className="text-zinc-400 uppercase text-[11px] font-bold">Key Highlights:</span>
          <span className="inline-flex items-center gap-1.5 text-emerald-800 font-medium">
            <span className="w-2.5 h-2.5 rounded-xs bg-emerald-500" />
            Matched Job Keyword
          </span>
          <span className="inline-flex items-center gap-1.5 text-rose-800 font-medium">
            <span className="w-2.5 h-2.5 rounded-xs bg-rose-500" />
            Strong Action Word
          </span>
          <span className="text-zinc-300">|</span>
          <span className="text-zinc-500 italic">
            Your real company names, job titles, and dates are strictly kept.
          </span>
        </div>
      )}

      {/* Summary Box */}
      <div className="bg-white border border-zinc-200/90 rounded-3xl p-6 sm:p-8 shadow-xs">
        <div className="text-xs font-bold uppercase tracking-wider text-zinc-700 mb-2 font-mono">
          Tailored Professional Summary
        </div>
        <div className="text-xs sm:text-sm text-zinc-800 leading-relaxed bg-zinc-50 border border-zinc-200 rounded-2xl p-5 font-sans">
          {renderHighlightedText(tailoredResume.summary)}
        </div>
      </div>

      {/* Experiences Comparison */}
      <div className="space-y-5">
        <div className="flex items-center justify-between px-1">
          <h4 className="text-xs font-bold text-zinc-800 uppercase tracking-wider font-mono">
            Improved Experience Bullets (Your Exact Companies & Dates Kept)
          </h4>
          <span className="text-xs text-zinc-400 font-mono">
            {tailoredResume.experiences.length} Positions Tailored
          </span>
        </div>

        {tailoredResume.experiences.map((exp, idx) => (
          <div
            key={idx}
            className="bg-white border border-zinc-200/90 rounded-3xl overflow-hidden shadow-xs"
          >
            {/* Header */}
            <div className="bg-zinc-50/80 border-b border-zinc-200 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <div>
                <span className="font-bold text-zinc-950 text-sm">{exp.company}</span>
                <span className="text-zinc-300 mx-2">/</span>
                <span className="text-rose-600 font-bold text-sm">{exp.role}</span>
              </div>
              <div className="text-xs font-mono text-zinc-500">{exp.dates}</div>
            </div>

            {/* Bullets */}
            <div className="p-6 divide-y divide-zinc-100">
              {exp.bullet_points.map((bullet, bIdx) => (
                <div key={bIdx} className="py-3.5 first:pt-0 last:pb-0 flex items-start gap-3">
                  <div className="mt-2 w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
                  <div className="text-xs sm:text-sm text-zinc-800 leading-relaxed flex-1">
                    {renderHighlightedText(bullet)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Skills Matrix */}
      <div className="bg-white border border-zinc-200/90 rounded-3xl p-6 sm:p-8 shadow-xs">
        <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-700 mb-3 font-mono">
          Technical Skills & Keywords
        </h4>
        <div className="flex flex-wrap gap-2">
          {tailoredResume.skills.map((skill, sIdx) => {
            const isMatch = insights?.matched_keywords?.some(
              (kw) => kw.toLowerCase() === skill.toLowerCase()
            );
            return (
              <span
                key={sIdx}
                className={`text-xs px-3 py-1.5 rounded-xl font-medium border flex items-center gap-1.5 font-mono ${
                  isMatch
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200 font-bold'
                    : 'bg-zinc-50 text-zinc-700 border-zinc-200'
                }`}
              >
                {isMatch && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                {skill}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}
