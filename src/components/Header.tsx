interface HeaderProps {
  activeTab: 'workspace' | 'diff' | 'export';
  setActiveTab: (tab: 'workspace' | 'diff' | 'export') => void;
  onReset: () => void;
  onOpenWelcome: () => void;
  hasTailoredResume: boolean;
}

export function Header({
  activeTab,
  setActiveTab,
  onReset,
  onOpenWelcome,
  hasTailoredResume,
}: HeaderProps) {
  return (
    <header className="no-print bg-white/90 backdrop-blur-md border-b border-zinc-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Brand wordmark */}
        <div className="flex items-center gap-2.5 shrink-0">
          <span className="text-base font-extrabold tracking-tight text-zinc-950 whitespace-nowrap">
            AI Resume Tailorer
          </span>
          <span className="text-xs text-zinc-400 font-mono hidden sm:inline">
            / Exact Format Mirror
          </span>
        </div>

        {/* Clean nav steps */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-zinc-500">
          <button
            type="button"
            onClick={() => setActiveTab('workspace')}
            className={`whitespace-nowrap transition-colors flex items-center gap-1.5 py-1 ${
              activeTab === 'workspace' && !hasTailoredResume
                ? 'text-zinc-950 font-bold'
                : 'hover:text-zinc-900'
            }`}
          >
            <span className="font-mono text-[10px] text-zinc-400">01</span>
            Resume & Job
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('workspace')}
            disabled={!hasTailoredResume}
            className={`whitespace-nowrap transition-colors flex items-center gap-1.5 py-1 ${
              !hasTailoredResume
                ? 'text-zinc-300 cursor-not-allowed'
                : activeTab === 'workspace'
                ? 'text-zinc-950 font-bold'
                : 'hover:text-zinc-900'
            }`}
          >
            <span className="font-mono text-[10px] text-zinc-400">02</span>
            Tailored Resume
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('diff')}
            disabled={!hasTailoredResume}
            className={`whitespace-nowrap transition-colors flex items-center gap-1.5 py-1 ${
              !hasTailoredResume
                ? 'text-zinc-300 cursor-not-allowed'
                : activeTab === 'diff'
                ? 'text-zinc-950 font-bold'
                : 'hover:text-zinc-900'
            }`}
          >
            <span className="font-mono text-[10px] text-zinc-400">03</span>
            Before & After
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('export')}
            disabled={!hasTailoredResume}
            className={`whitespace-nowrap transition-colors flex items-center gap-1.5 py-1 ${
              !hasTailoredResume
                ? 'text-zinc-300 cursor-not-allowed'
                : activeTab === 'export'
                ? 'text-zinc-950 font-bold'
                : 'hover:text-zinc-900'
            }`}
          >
            <span className="font-mono text-[10px] text-zinc-400">04</span>
            Download & Print
          </button>
        </nav>

        {/* Primary action */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onOpenWelcome}
            className="px-3 py-1.5 text-xs font-semibold text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100 rounded-lg transition-colors whitespace-nowrap shrink-0"
            title="Learn how this app works"
          >
            How it Works
          </button>

          <button
            type="button"
            onClick={onReset}
            className="px-3 py-1.5 text-xs font-semibold text-zinc-700 bg-zinc-100 hover:bg-zinc-200 hover:text-zinc-950 border border-zinc-200 rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
          >
            <span>Reset</span>
            <kbd className="font-mono text-[10px] text-zinc-500 bg-white px-1 rounded border border-zinc-200">
              R
            </kbd>
          </button>
        </div>
      </div>
    </header>
  );
}
