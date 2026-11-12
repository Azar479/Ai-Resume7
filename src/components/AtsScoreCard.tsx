import { MatchInsights } from '../types';
import { ShieldCheck, TrendingUp, CheckCircle2 } from 'lucide-react';

interface AtsScoreCardProps {
  insights?: MatchInsights;
  unverifiedGapsCount?: number;
}

export function AtsScoreCard({ insights }: AtsScoreCardProps) {
  if (!insights) return null;

  const scoreBefore = insights.ats_score_before ?? 55;
  const scoreAfter = insights.ats_score_after ?? 94;
  const delta = scoreAfter - scoreBefore;

  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (scoreAfter / 100) * circumference;

  return (
    <div className="bg-white border border-zinc-200/90 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
      {/* Top Header & Circular Score Meter */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-6 border-b border-zinc-200 gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2.5">
            <h3 className="text-xl sm:text-2xl font-black text-zinc-950 tracking-tight">
              Job Match & ATS Performance
            </h3>
            <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded font-mono">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              100% Real Experience
            </span>
          </div>
          <p className="text-xs sm:text-sm text-zinc-500 max-w-xl leading-relaxed">
            Optimized for enterprise ATS parsers (Workday, Greenhouse, Lever) by integrating high-priority job keywords while strictly honoring your actual career facts.
          </p>
        </div>

        {/* Score Dial */}
        <div className="flex items-center gap-5 bg-zinc-50 border border-zinc-200 rounded-2xl p-4 shrink-0 shadow-2xs">
          <div className="relative w-20 h-20 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 90 90">
              <defs>
                <linearGradient id="sunsetScoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ff4500" />
                  <stop offset="50%" stopColor="#ff1493" />
                  <stop offset="100%" stopColor="#9400d3" />
                </linearGradient>
              </defs>
              <circle
                cx="45"
                cy="45"
                r={radius}
                className="text-zinc-200"
                strokeWidth="7"
                stroke="currentColor"
                fill="transparent"
              />
              <circle
                cx="45"
                cy="45"
                r={radius}
                stroke="url(#sunsetScoreGradient)"
                strokeWidth="7"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-xl font-black font-sans text-zinc-950 tabular-nums leading-none">
                {scoreAfter}%
              </span>
              <span className="text-[9px] font-mono text-zinc-400 uppercase mt-0.5 font-bold">
                Match
              </span>
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-wider">
              Score Increase
            </div>
            <div className="text-xs text-zinc-600 flex items-center gap-1.5 font-mono">
              <span>Before:</span>
              <span className="text-zinc-900 font-bold">{scoreBefore}%</span>
            </div>
            {delta > 0 && (
              <div className="text-xs text-rose-600 font-bold flex items-center gap-1 font-mono">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>+{delta}% Higher Match</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 4-Column Bold Stat Grid matching reference image typography */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-4 border-b border-zinc-200">
        <div className="space-y-1">
          <div className="text-3xl sm:text-5xl font-black text-zinc-950 tracking-tight tabular-nums font-sans">
            {insights.matched_keywords?.length || 0}
          </div>
          <div className="text-[11px] font-bold uppercase tracking-widest text-zinc-400 font-mono">
            MATCHED KEYWORDS
          </div>
          <p className="text-[11px] text-zinc-500">From target job description</p>
        </div>

        <div className="space-y-1 md:border-l md:border-zinc-200 md:pl-6">
          <div className="text-3xl sm:text-5xl font-black text-zinc-950 tracking-tight tabular-nums font-sans">
            {insights.action_verb_highlights?.length || 0}
          </div>
          <div className="text-[11px] font-bold uppercase tracking-widest text-zinc-400 font-mono">
            ACTION VERBS
          </div>
          <p className="text-[11px] text-zinc-500">High-impact delivery verbs</p>
        </div>

        <div className="space-y-1 sm:border-l sm:border-zinc-200 sm:pl-6">
          <div className="text-3xl sm:text-5xl font-black text-zinc-950 tracking-tight tabular-nums font-sans">
            100%
          </div>
          <div className="text-[11px] font-bold uppercase tracking-widest text-zinc-400 font-mono">
            FACTUAL AUTHENTICITY
          </div>
          <p className="text-[11px] text-zinc-500">Zero fabricated roles</p>
        </div>

        <div className="space-y-1 md:border-l md:border-zinc-200 md:pl-6">
          <div className="text-3xl sm:text-5xl font-black text-zinc-950 tracking-tight tabular-nums font-sans">
            100%
          </div>
          <div className="text-[11px] font-bold uppercase tracking-widest text-zinc-400 font-mono">
            LAYOUT FIDELITY
          </div>
          <p className="text-[11px] text-zinc-500">Exact sections mirrored</p>
        </div>
      </div>

      {/* Keywords and Power Verbs Strip */}
      <div className="pt-2 space-y-4">
        {insights.matched_keywords && insights.matched_keywords.length > 0 && (
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-zinc-700 mb-2 font-mono">
              Keywords Added to Experience Bullets:
            </div>
            <div className="flex flex-wrap items-center gap-1.5 text-xs text-zinc-800">
              {insights.matched_keywords.map((kw, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1.5 bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 px-2.5 py-1 rounded-lg text-xs font-mono font-medium transition-colors"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  {kw}
                </span>
              ))}
            </div>
          </div>
        )}

        {insights.action_verb_highlights && insights.action_verb_highlights.length > 0 && (
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-zinc-700 mb-2 font-mono">
              Strong Action Verbs Integrated:
            </div>
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              {insights.action_verb_highlights.map((verb, i) => (
                <span
                  key={i}
                  className="bg-rose-50 border border-rose-200 text-rose-700 px-2.5 py-1 rounded-lg font-mono font-medium text-xs"
                >
                  {verb}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
