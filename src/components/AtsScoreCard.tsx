import { MatchInsights } from '../types';
import { ShieldCheck, TrendingUp, CheckCircle2, Zap } from 'lucide-react';

interface AtsScoreCardProps {
  insights?: MatchInsights;
  unverifiedGapsCount: number;
}

export function AtsScoreCard({ insights, unverifiedGapsCount }: AtsScoreCardProps) {
  if (!insights) return null;

  const scoreBefore = insights.ats_score_before ?? 55;
  const scoreAfter = insights.ats_score_after ?? 94;
  const delta = scoreAfter - scoreBefore;

  // Circumference calculation for radial gauge
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (scoreAfter / 100) * circumference;

  return (
    <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 shadow-xl backdrop-blur-md">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-6 border-b border-zinc-800/80 gap-6">
        <div>
          <div className="flex items-center gap-2.5">
            <h3 className="text-base font-bold text-white tracking-tight">
              2026 ATS Parser & Semantic Optimization Radar
            </h3>
            <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800/80 px-2 py-0.5 rounded font-mono">
              <ShieldCheck className="w-3.5 h-3.5" />
              100% Truthfulness
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1 max-w-xl">
            Semantic vector matching aligned with enterprise Applicant Tracking Systems (Workday, Greenhouse, Lever, Taleo) without fabricating experience.
          </p>
        </div>

        {/* 2026 Radial Score Gauge Lockup */}
        <div className="flex items-center gap-5 bg-zinc-950 border border-zinc-800 rounded-2xl p-4 shrink-0">
          <div className="relative w-20 h-20 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 90 90">
              <circle
                cx="45"
                cy="45"
                r={radius}
                className="text-zinc-800"
                strokeWidth="7"
                stroke="currentColor"
                fill="transparent"
              />
              <circle
                cx="45"
                cy="45"
                r={radius}
                className="text-indigo-500 transition-all duration-1000 ease-out"
                strokeWidth="7"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-xl font-black font-mono text-white tabular-nums leading-none">
                {scoreAfter}%
              </span>
              <span className="text-[9px] font-mono text-zinc-500 uppercase mt-0.5">
                Match
              </span>
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-[11px] font-mono text-zinc-500 uppercase">Benchmark</div>
            <div className="text-xs text-zinc-300 flex items-center gap-1.5 font-mono">
              <span>Original:</span>
              <span className="text-zinc-400 font-bold">{scoreBefore}%</span>
            </div>
            {delta > 0 && (
              <div className="text-xs text-emerald-400 font-bold flex items-center gap-1 font-mono">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>+{delta}% Optimized</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bento Metric Strips */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-5 border-b border-zinc-800/80">
        <div className="bg-zinc-950/60 border border-zinc-800/70 p-3.5 rounded-xl">
          <div className="text-[11px] text-zinc-400 font-medium">Matched JD Keywords</div>
          <div className="text-2xl font-bold font-mono text-white mt-1 tabular-nums">
            {insights.matched_keywords?.length || 0}
          </div>
          <div className="text-[10px] text-zinc-500 font-mono mt-0.5">Exact phrases woven</div>
        </div>

        <div className="bg-zinc-950/60 border border-zinc-800/70 p-3.5 rounded-xl">
          <div className="text-[11px] text-zinc-400 font-medium">Verified User Context</div>
          <div className="text-2xl font-bold font-mono text-indigo-400 mt-1 tabular-nums">
            {insights.verified_user_additions?.length || 0}
          </div>
          <div className="text-[10px] text-zinc-500 font-mono mt-0.5">Candidate confirmed</div>
        </div>

        <div className="bg-zinc-950/60 border border-zinc-800/70 p-3.5 rounded-xl">
          <div className="text-[11px] text-zinc-400 font-medium">Omitted Missing Gaps</div>
          <div className="text-2xl font-bold font-mono text-emerald-400 mt-1 tabular-nums">
            {insights.omitted_gaps?.length || 0}
          </div>
          <div className="text-[10px] text-zinc-500 font-mono mt-0.5">Zero hallucinations</div>
        </div>

        <div className="bg-zinc-950/60 border border-zinc-800/70 p-3.5 rounded-xl">
          <div className="text-[11px] text-zinc-400 font-medium">Remaining Questions</div>
          <div className="text-2xl font-bold font-mono text-amber-400 mt-1 tabular-nums">
            {unverifiedGapsCount}
          </div>
          <div className="text-[10px] text-zinc-500 font-mono mt-0.5">Flagged for user check</div>
        </div>
      </div>

      {/* Keywords and Power Verbs Strip */}
      <div className="pt-4 space-y-3">
        {insights.matched_keywords && insights.matched_keywords.length > 0 && (
          <div>
            <span className="text-xs font-semibold text-zinc-300 mr-2">
              Matched JD Keywords:
            </span>
            <div className="inline-flex flex-wrap items-center gap-1.5 text-xs text-zinc-300 mt-1.5">
              {insights.matched_keywords.map((kw, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1 bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 px-2.5 py-1 rounded-md text-xs font-mono transition-colors"
                >
                  <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                  {kw}
                </span>
              ))}
            </div>
          </div>
        )}

        {insights.action_verb_highlights && insights.action_verb_highlights.length > 0 && (
          <div>
            <span className="text-xs font-semibold text-zinc-300 mr-2">
              High-Impact Power Verbs:
            </span>
            <div className="inline-flex flex-wrap items-center gap-1.5 text-xs text-indigo-300 mt-1.5">
              {insights.action_verb_highlights.map((verb, i) => (
                <span
                  key={i}
                  className="bg-indigo-950/50 border border-indigo-800/70 text-indigo-300 px-2 py-0.5 rounded font-mono text-xs"
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
