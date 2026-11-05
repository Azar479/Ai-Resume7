interface HeaderProps {
  activeTab: 'workspace' | 'gaps' | 'diff' | 'export';
  setActiveTab: (tab: 'workspace' | 'gaps' | 'diff' | 'export') => void;
  onReset: () => void;
  hasTailoredResume: boolean;
  engineMode?: string;
}

export function Header({
  activeTab,
  setActiveTab,
  onReset,
  hasTailoredResume,
  engineMode,
}: HeaderProps) {
  return (
    <header className="no-print bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800/80 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single-element brand wordmark */}
        <div className="flex items-center gap-2.5 shrink-0">
          <span className="text-base font-bold tracking-tight text-white whitespace-nowrap">
            AI Resume Tailorer
          </span>
          <span className="text-xs text-zinc-500 font-mono hidden sm:inline">
            / 100% Truthful ATS Match
          </span>
          {engineMode && (
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400 hidden lg:inline">
              {engineMode === 'gemini-live' ? '⚡ Gemini 3.8 AI' : '🛡 Smart Engine'}
            </span>
          )}
        </div>

        {/* Zone 2: 4 single-line nav links with simple, friendly labels */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-zinc-400">
          <button
            type="button"
            onClick={() => setActiveTab('workspace')}
            className={`whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'workspace'
                ? 'text-white font-semibold'
                : 'hover:text-zinc-200'
            }`}
          >
            <span className="font-mono text-[10px] text-zinc-500">01</span>
            Resume & Job
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('gaps')}
            className={`whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'gaps'
                ? 'text-white font-semibold'
                : 'hover:text-zinc-200'
            }`}
          >
            <span className="font-mono text-[10px] text-zinc-500">02</span>
            Skills Check
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('diff')}
            disabled={!hasTailoredResume}
            className={`whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              !hasTailoredResume
                ? 'text-zinc-600 cursor-not-allowed'
                : activeTab === 'diff'
                ? 'text-white font-semibold'
                : 'hover:text-zinc-200'
            }`}
          >
            <span className="font-mono text-[10px] text-zinc-500">03</span>
            Before & After
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('export')}
            disabled={!hasTailoredResume}
            className={`whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              !hasTailoredResume
                ? 'text-zinc-600 cursor-not-allowed'
                : activeTab === 'export'
                ? 'text-white font-semibold'
                : 'hover:text-zinc-200'
            }`}
          >
            <span className="font-mono text-[10px] text-zinc-500">04</span>
            Download & Print
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onReset}
            className="px-3 py-1.5 text-xs font-medium text-zinc-300 bg-zinc-900 hover:bg-zinc-800 hover:text-white border border-zinc-800 rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
          >
            <span>Reset</span>
            <kbd className="font-mono text-[10px] text-zinc-500 bg-zinc-950 px-1 rounded border border-zinc-800">
              R
            </kbd>
          </button>
        </div>
      </div>
    </header>
  );
}
