import { useState } from 'react';
import { TailoredResume, MatchInsights } from '../types';
import { CheckCircle2, ShieldCheck, Sparkles, SlidersHorizontal } from 'lucide-react';

interface DiffViewerProps {
  baseResumeText: string;
  tailoredResume: TailoredResume;
  insights?: MatchInsights;
}

export function DiffViewer({
  baseResumeText,
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
                className="bg-emerald-950/80 text-emerald-300 font-semibold px-1.5 py-0.5 rounded border border-emerald-700/60 font-mono mx-0.5"
                title="Matched Target JD Keyword"
              >
                {part}
              </span>
            );
          } else if (isVerb) {
            return (
              <span
                key={i}
                className="bg-indigo-950/80 text-indigo-300 font-semibold px-1.5 py-0.5 rounded border border-indigo-700/60 font-mono mx-0.5"
                title="High-Impact ATS Action Verb"
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
      {/* 2026 Controls Bar */}
      <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 shadow-xl backdrop-blur-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <span>2026 Semantic Diff & Action Verb Reframing</span>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/80 px-2 py-0.5 rounded">
              Truth Verified
            </span>
          </h3>
          <p className="text-xs text-zinc-400 mt-1">
            Visual inspection of dynamically injected JD keywords and high-impact action verbs.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-xs font-medium text-zinc-300 cursor-pointer select-none bg-zinc-950 px-3 py-1.5 rounded-xl border border-zinc-800">
            <input
              type="checkbox"
              checked={highlightKeywords}
              onChange={(e) => setHighlightKeywords(e.target.checked)}
              className="rounded border-zinc-700 text-indigo-600 focus:ring-indigo-500 w-4 h-4"
            />
            Highlight Keywords & Action Verbs
          </label>
        </div>
      </div>

      {/* High-Precision Legend Strip */}
      {highlightKeywords && (
        <div className="flex flex-wrap items-center gap-4 text-xs bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 font-mono">
          <span className="text-zinc-500 uppercase text-[11px]">Diff Tokens:</span>
          <span className="inline-flex items-center gap-1.5 text-emerald-300">
            <span className="w-2.5 h-2.5 rounded-xs bg-emerald-500" />
            Matched Target JD Keyword
          </span>
          <span className="inline-flex items-center gap-1.5 text-indigo-300">
            <span className="w-2.5 h-2.5 rounded-xs bg-indigo-500" />
            ATS Action Verb Reframing
          </span>
          <span className="text-zinc-700">|</span>
          <span className="text-zinc-400 italic">
            Zero hallucinated metrics or unverified roles.
          </span>
        </div>
      )}

      {/* Summary Diff Box */}
      <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 shadow-xl backdrop-blur-md">
        <div className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2 font-mono">
          Tailored Executive Summary
        </div>
        <div className="text-xs sm:text-sm text-zinc-200 leading-relaxed bg-zinc-950 border border-zinc-800/80 rounded-xl p-4 font-sans">
          {renderHighlightedText(tailoredResume.summary)}
        </div>
      </div>

      {/* Experiences Comparison */}
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-zinc-300 uppercase tracking-wider font-mono">
            Optimized Experience Bullets
          </h4>
          <span className="text-xs text-zinc-500 font-mono">
            {tailoredResume.experiences.length} Positions Reframed
          </span>
        </div>

        {tailoredResume.experiences.map((exp, idx) => (
          <div
            key={idx}
            className="bg-zinc-900/60 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl backdrop-blur-md"
          >
            {/* Header */}
            <div className="bg-zinc-950 border-b border-zinc-800 px-6 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <div>
                <span className="font-bold text-white text-sm">{exp.company}</span>
                <span className="text-zinc-600 mx-2">/</span>
                <span className="text-indigo-400 font-medium text-sm">{exp.role}</span>
              </div>
              <div className="text-xs font-mono text-zinc-500">{exp.dates}</div>
            </div>

            {/* Bullets */}
            <div className="p-6 divide-y divide-zinc-800/60">
              {exp.bullet_points.map((bullet, bIdx) => (
                <div key={bIdx} className="py-3.5 first:pt-0 last:pb-0 flex items-start gap-3">
                  <div className="mt-2 w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0" />
                  <div className="text-xs sm:text-sm text-zinc-200 leading-relaxed flex-1">
                    {renderHighlightedText(bullet)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Skills Matrix */}
      <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 shadow-xl backdrop-blur-md">
        <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3 font-mono">
          Categorized & Prioritized Technical Skills
        </h4>
        <div className="flex flex-wrap gap-2">
          {tailoredResume.skills.map((skill, sIdx) => {
            const isMatch = insights?.matched_keywords?.some(
              (kw) => kw.toLowerCase() === skill.toLowerCase()
            );
            return (
              <span
                key={sIdx}
                className={`text-xs px-3 py-1.5 rounded-lg font-medium border flex items-center gap-1.5 font-mono ${
                  isMatch
                    ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800/80'
                    : 'bg-zinc-950 text-zinc-300 border-zinc-800'
                }`}
              >
                {isMatch && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                {skill}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}
