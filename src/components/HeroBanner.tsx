import React from 'react';
import { ShieldCheck, Sparkles, ArrowRight } from 'lucide-react';

interface HeroBannerProps {
  onGetStarted?: () => void;
  hasResumeLoaded?: boolean;
}

export function HeroBanner({ onGetStarted, hasResumeLoaded }: HeroBannerProps) {
  return (
    <section className="bg-white border border-zinc-200/90 rounded-3xl p-6 sm:p-10 shadow-xs overflow-hidden">
      {/* Top Split: Massive Typography + Gradient Artwork */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pb-8 border-b border-zinc-200">
        {/* Left Side: Bold Headline & Editorial Prose */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            <span className="text-[11px] font-bold uppercase tracking-widest text-zinc-400 font-mono">
              Editorial Precision & Format Mirroring
            </span>
          </div>

          <div className="flex items-baseline gap-4 flex-wrap">
            <h1 className="text-5xl sm:text-7xl font-black tracking-tight text-zinc-950 leading-none">
              96%<span className="text-rose-500 font-bold">+</span>
            </h1>
            <div className="space-y-0.5">
              <div className="text-sm sm:text-base font-bold text-zinc-900 tracking-tight">
                ATS Application Match Rate
              </div>
              <p className="text-xs sm:text-sm text-zinc-500 leading-relaxed max-w-md">
                Serving competitive roles by optimizing resume keywords while strictly maintaining your authentic company history and original document format.
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: The Luminous Sunset Gradient Artwork from Reference */}
        <div className="lg:col-span-5 flex justify-center lg:justify-end">
          <div className="relative w-full max-w-sm rounded-2xl overflow-hidden border border-zinc-200/80 shadow-md group">
            <img
              src="/public/assets/aistudio/image_96c858ad.png"
              alt="Luminous Sunset Gradient Theme Showcase"
              className="w-full h-auto object-cover transform group-hover:scale-102 transition-transform duration-500"
              referrerPolicy="no-referrer"
            />
            {/* Subtle light inner border */}
            <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-black/5 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Bottom Row: 3-Column Bold Stat Grid matching reference image */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8">
        <div className="space-y-1">
          <div className="text-3xl sm:text-4xl font-black text-zinc-950 tracking-tight tabular-nums font-sans">
            100%
          </div>
          <div className="text-[11px] font-bold uppercase tracking-widest text-zinc-400 font-mono">
            FACTUAL AUTHENTICITY
          </div>
          <p className="text-xs text-zinc-500">
            Zero fabricated roles, dates, or false credentials.
          </p>
        </div>

        <div className="space-y-1 sm:border-l sm:border-zinc-200 sm:pl-6">
          <div className="text-3xl sm:text-4xl font-black text-zinc-950 tracking-tight tabular-nums font-sans">
            0ms
          </div>
          <div className="text-[11px] font-bold uppercase tracking-widest text-zinc-400 font-mono">
            FORMAT DISTORTION
          </div>
          <p className="text-xs text-zinc-500">
            Mirrors your exact section order, font style, and headers.
          </p>
        </div>

        <div className="space-y-1 sm:border-l sm:border-zinc-200 sm:pl-6">
          <div className="text-3xl sm:text-4xl font-black text-zinc-950 tracking-tight tabular-nums font-sans">
            3-Way
          </div>
          <div className="text-[11px] font-bold uppercase tracking-widest text-zinc-400 font-mono">
            SIDE-BY-SIDE REVIEW
          </div>
          <p className="text-xs text-zinc-500">
            Compare source canvas & export to Word (.doc), PDF, or Text.
          </p>
        </div>
      </div>
    </section>
  );
}
