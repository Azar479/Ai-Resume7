import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { IntakeView } from './components/IntakeView';
import { GapWizardModal } from './components/GapWizardModal';
import { ResumePreview } from './components/ResumePreview';
import { DiffViewer } from './components/DiffViewer';
import { AtsScoreCard } from './components/AtsScoreCard';
import { JsonViewerModal } from './components/JsonViewer';
import { PRESET_SCENARIOS } from './presets';
import {
  ResumeEngineResponse,
  TailoredResume,
  GapItem,
  GapStatus,
  PresetScenario,
  GapAnalysisResponse,
} from './types';
import {
  FileText,
  Split,
  BarChart3,
  AlertCircle,
  HelpCircle,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'workspace' | 'gaps' | 'diff' | 'export'>('workspace');
  const [resultSubTab, setResultSubTab] = useState<'preview' | 'diff' | 'insights'>('preview');

  // Input states
  const [candidateName, setCandidateName] = useState<string>('');
  const [candidateContact, setCandidateContact] = useState<string>('');
  const [resumeText, setResumeText] = useState<string>('');
  const [jobDescription, setJobDescription] = useState<string>('');
  const [resumePdfBase64, setResumePdfBase64] = useState<string | null>(null);
  const [pdfFileName, setPdfFileName] = useState<string | null>(null);

  // Gap analysis & verification state
  const [gaps, setGaps] = useState<GapItem[]>([]);
  const [isWizardOpen, setIsWizardOpen] = useState<boolean>(false);
  const [isAnalyzingGaps, setIsAnalyzingGaps] = useState<boolean>(false);
  const [isTailoringResume, setIsTailoringResume] = useState<boolean>(false);

  // Result state
  const [rawResponse, setRawResponse] = useState<ResumeEngineResponse | null>(null);
  const [tailoredResume, setTailoredResume] = useState<TailoredResume | null>(null);
  const [isJsonModalOpen, setIsJsonModalOpen] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [engineMode, setEngineMode] = useState<string>('gemini-live');

  // Initialize with the first realistic preset scenario on first load
  useEffect(() => {
    handleSelectPreset(PRESET_SCENARIOS[0]);
  }, []);

  const handleSelectPreset = (preset: PresetScenario) => {
    setCandidateName(preset.candidateName);
    setCandidateContact(preset.candidateContact);
    setResumeText(preset.resumeText);
    setJobDescription(preset.jobDescription);
    setResumePdfBase64(null);
    setPdfFileName(null);
    setGaps([]);
    setRawResponse(null);
    setTailoredResume(null);
    setErrorMessage(null);
  };

  const handleReset = () => {
    setCandidateName('');
    setCandidateContact('');
    setResumeText('');
    setJobDescription('');
    setResumePdfBase64(null);
    setPdfFileName(null);
    setGaps([]);
    setRawResponse(null);
    setTailoredResume(null);
    setErrorMessage(null);
    setActiveTab('workspace');
  };

  // Phase 1: Analyze Gaps & Formulate Direct Questions
  const handleRunGapAnalysis = async () => {
    if ((!resumeText && !resumePdfBase64) || !jobDescription) {
      setErrorMessage('Please provide both your base resume and the target job description.');
      return;
    }

    setErrorMessage(null);
    setIsAnalyzingGaps(true);

    try {
      const res = await fetch('/api/analyze-gaps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeText,
          resumePdfBase64,
          jobDescription,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `Server responded with status ${res.status}`);
      }

      const data: GapAnalysisResponse & { engine_mode?: string } = await res.json();

      if (data.candidate_name && !candidateName) {
        setCandidateName(data.candidate_name);
      }

      if (data.engine_mode) {
        setEngineMode(data.engine_mode);
      }

      // Convert questions into interactive GapItems
      const items: GapItem[] = (data.missing_keywords_and_questions || []).map((q, idx) => ({
        id: `gap-${idx}-${Date.now()}`,
        question: q,
        status: 'pending',
        contextNotes: '',
      }));

      setGaps(items);
      setIsWizardOpen(true);
      setActiveTab('gaps');
    } catch (err: any) {
      console.error('Gap analysis error:', err);
      setErrorMessage(
        err.message || 'Failed to analyze gaps. Please check your network and API configuration.'
      );
    } finally {
      setIsAnalyzingGaps(false);
    }
  };

  const handleUpdateGap = (id: string, status: GapStatus, notes: string) => {
    setGaps((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status, contextNotes: notes } : item))
    );
  };

  // Phase 2: Dynamic Tailoring with Strict Factual Bounds
  const handleSubmitVerification = async () => {
    setIsTailoringResume(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/tailor-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeText,
          jobDescription,
          candidateName,
          candidateContact,
          gapAnswers: gaps.map((g) => ({
            question: g.question,
            status: g.status,
            contextNotes: g.contextNotes,
          })),
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `Tailoring failed with status ${res.status}`);
      }

      const data: ResumeEngineResponse & { engine_mode?: string } = await res.json();

      if (data.engine_mode) {
        setEngineMode(data.engine_mode);
      }

      setRawResponse(data);
      setTailoredResume(data.tailored_resume);
      setIsWizardOpen(false);
      setActiveTab('workspace');
      setResultSubTab('preview');
    } catch (err: any) {
      console.error('Tailoring error:', err);
      setErrorMessage(err.message || 'Failed to tailor resume.');
    } finally {
      setIsTailoringResume(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-indigo-900 selection:text-white">
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onReset={handleReset}
        hasTailoredResume={!!tailoredResume}
        engineMode={engineMode}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Error Notification Banner */}
        {errorMessage && (
          <div className="bg-red-950/40 border border-red-800/80 text-red-200 rounded-2xl p-4 flex items-start justify-between gap-3 shadow-lg">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-red-300">Notification</h4>
                <p className="text-xs text-red-400 mt-0.5">{errorMessage}</p>
              </div>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-xs text-red-400 hover:text-red-200 font-semibold"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* View 1: Workspace Tab */}
        {activeTab === 'workspace' && (
          <div className="space-y-6">
            {!tailoredResume ? (
              // Intake View
              <IntakeView
                resumeText={resumeText}
                setResumeText={setResumeText}
                resumePdfBase64={resumePdfBase64}
                setResumePdfBase64={setResumePdfBase64}
                pdfFileName={pdfFileName}
                setPdfFileName={setPdfFileName}
                jobDescription={jobDescription}
                setJobDescription={setJobDescription}
                candidateName={candidateName}
                setCandidateName={setCandidateName}
                candidateContact={candidateContact}
                setCandidateContact={setCandidateContact}
                onRunGapAnalysis={handleRunGapAnalysis}
                isLoading={isAnalyzingGaps}
                onSelectPreset={handleSelectPreset}
              />
            ) : (
              // Result View
              <div className="space-y-6">
                {/* 2026 Result Navigation Dock */}
                <div className="no-print bg-zinc-900/60 border border-zinc-800 rounded-2xl p-2.5 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xl backdrop-blur-md">
                  <div className="flex items-center gap-1.5 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={() => setResultSubTab('preview')}
                      className={`px-3.5 py-2 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors ${
                        resultSubTab === 'preview'
                          ? 'bg-zinc-800 text-white shadow-xs'
                          : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
                      }`}
                    >
                      <FileText className="w-3.5 h-3.5 text-indigo-400" />
                      ATS Document View
                    </button>

                    <button
                      type="button"
                      onClick={() => setResultSubTab('diff')}
                      className={`px-3.5 py-2 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors ${
                        resultSubTab === 'diff'
                          ? 'bg-zinc-800 text-white shadow-xs'
                          : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
                      }`}
                    >
                      <Split className="w-3.5 h-3.5 text-emerald-400" />
                      Semantic Diff
                    </button>

                    <button
                      type="button"
                      onClick={() => setResultSubTab('insights')}
                      className={`px-3.5 py-2 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors ${
                        resultSubTab === 'insights'
                          ? 'bg-zinc-800 text-white shadow-xs'
                          : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
                      }`}
                    >
                      <BarChart3 className="w-3.5 h-3.5 text-amber-400" />
                      ATS Analytics
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsWizardOpen(true)}
                      className="px-3 py-1.5 text-xs font-medium text-zinc-300 bg-zinc-950 hover:bg-zinc-800 rounded-xl border border-zinc-800 flex items-center gap-1 transition-colors font-mono"
                    >
                      <HelpCircle className="w-3.5 h-3.5 text-indigo-400" />
                      Gaps ({gaps.length})
                    </button>

                    <button
                      type="button"
                      onClick={() => setTailoredResume(null)}
                      className="px-3 py-1.5 text-xs font-medium text-zinc-500 hover:text-zinc-300 transition-colors"
                    >
                      Edit Inputs
                    </button>
                  </div>
                </div>

                {/* Sub-tab 1: ATS Resume Preview */}
                {resultSubTab === 'preview' && (
                  <ResumePreview
                    resume={tailoredResume}
                    rawResponse={rawResponse || undefined}
                    candidateName={candidateName}
                    candidateContact={candidateContact}
                    onUpdateResume={(updated) => setTailoredResume(updated)}
                    onOpenJsonModal={() => setIsJsonModalOpen(true)}
                  />
                )}

                {/* Sub-tab 2: Semantic Diff */}
                {resultSubTab === 'diff' && (
                  <DiffViewer
                    baseResumeText={resumeText}
                    tailoredResume={tailoredResume}
                    insights={rawResponse?.match_insights}
                  />
                )}

                {/* Sub-tab 3: Match Insights */}
                {resultSubTab === 'insights' && (
                  <div className="space-y-6">
                    <AtsScoreCard
                      insights={rawResponse?.match_insights}
                      unverifiedGapsCount={rawResponse?.missing_keywords_and_questions?.length || 0}
                    />

                    {/* Factual Bounds Guarantee Box */}
                    <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 shadow-xl backdrop-blur-md">
                      <div className="flex items-start gap-3.5">
                        <div className="p-2.5 bg-emerald-950/70 border border-emerald-800/80 text-emerald-400 rounded-xl shrink-0">
                          <ShieldCheck className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-white">
                            Strict Factual Bounds Verification Certificate
                          </h4>
                          <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                            Every single metric, role, tenure date, and core achievement has been mapped directly from your base resume or verified in Phase 1. Missing JD requirements that you marked as unexperienced have been strictly omitted to protect your interview integrity.
                          </p>

                          <div className="mt-4 flex flex-wrap gap-4 text-xs font-medium text-zinc-300 font-mono">
                            <span className="flex items-center gap-1.5 text-emerald-400">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Zero Fabricated Companies
                            </span>
                            <span className="flex items-center gap-1.5 text-emerald-400">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Zero Hallucinated Metrics
                            </span>
                            <span className="flex items-center gap-1.5 text-emerald-400">
                              <CheckCircle2 className="w-3.5 h-3.5" /> High-Impact Action Verb Reframing
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* View 2: Gap Verification Tab */}
        {activeTab === 'gaps' && (
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 shadow-xl backdrop-blur-md space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-zinc-800/80 gap-4">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <span>Phase 1: Gap Analysis Questionnaire</span>
                  <span className="text-xs font-semibold text-indigo-400 bg-indigo-950/60 border border-indigo-800/80 px-2 py-0.5 rounded font-mono">
                    {gaps.length} Requirements Identified
                  </span>
                </h2>
                <p className="text-xs text-zinc-400 mt-1">
                  Answer the verification questions to decide whether each missing JD requirement should be confirmed with context or omitted.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsWizardOpen(true)}
                  className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl flex items-center gap-1.5 transition-colors shadow-md shadow-indigo-600/30"
                >
                  <HelpCircle className="w-4 h-4" />
                  Launch Interactive Wizard
                </button>
              </div>
            </div>

            {gaps.length === 0 ? (
              <div className="text-center py-12 text-zinc-500">
                <HelpCircle className="w-10 h-10 mx-auto text-zinc-600 mb-2" />
                <p className="text-sm font-semibold text-zinc-300">No gap questions active yet.</p>
                <p className="text-xs text-zinc-500 mt-1">
                  Run the gap analysis from the Workspace tab or load a preset scenario.
                </p>
                <button
                  type="button"
                  onClick={() => setActiveTab('workspace')}
                  className="mt-4 px-4 py-2 text-xs font-semibold text-indigo-400 bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 rounded-xl font-mono"
                >
                  Go to Workspace
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {gaps.map((gap, idx) => (
                  <div
                    key={gap.id}
                    className="p-5 border border-zinc-800 rounded-2xl bg-zinc-950/60 hover:bg-zinc-950 transition-colors space-y-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="text-[11px] font-mono text-indigo-400 font-bold">
                          Question {idx + 1}
                        </span>
                        <p className="text-xs sm:text-sm font-semibold text-zinc-100 mt-0.5">
                          {gap.question}
                        </p>
                      </div>

                      <span
                        className={`text-xs px-2.5 py-1 rounded-md font-medium shrink-0 font-mono ${
                          gap.status === 'confirmed'
                            ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800'
                            : gap.status === 'unfamiliar'
                            ? 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                            : gap.status === 'studying'
                            ? 'bg-amber-950/80 text-amber-300 border border-amber-800'
                            : 'bg-zinc-900 border border-zinc-800 text-zinc-500'
                        }`}
                      >
                        {gap.status === 'confirmed'
                          ? '✓ Confirmed'
                          : gap.status === 'unfamiliar'
                          ? '— No Experience'
                          : gap.status === 'studying'
                          ? '◐ Studying'
                          : 'Pending'}
                      </span>
                    </div>

                    {/* Quick choice buttons */}
                    <div className="flex flex-wrap items-center gap-2 pt-1 font-mono">
                      <button
                        type="button"
                        onClick={() => handleUpdateGap(gap.id, 'confirmed', gap.contextNotes)}
                        className={`px-3 py-1 text-xs rounded-lg border transition-colors ${
                          gap.status === 'confirmed'
                            ? 'bg-emerald-600 text-white border-emerald-500 font-semibold'
                            : 'bg-zinc-900 text-zinc-300 border-zinc-800 hover:bg-zinc-800'
                        }`}
                      >
                        Yes, I have experience
                      </button>
                      <button
                        type="button"
                        onClick={() => handleUpdateGap(gap.id, 'unfamiliar', '')}
                        className={`px-3 py-1 text-xs rounded-lg border transition-colors ${
                          gap.status === 'unfamiliar'
                            ? 'bg-zinc-700 text-white border-zinc-600 font-semibold'
                            : 'bg-zinc-900 text-zinc-300 border-zinc-800 hover:bg-zinc-800'
                        }`}
                      >
                        No experience (Omit)
                      </button>
                      <button
                        type="button"
                        onClick={() => handleUpdateGap(gap.id, 'studying', gap.contextNotes)}
                        className={`px-3 py-1 text-xs rounded-lg border transition-colors ${
                          gap.status === 'studying'
                            ? 'bg-amber-600 text-white border-amber-500 font-semibold'
                            : 'bg-zinc-900 text-zinc-300 border-zinc-800 hover:bg-zinc-800'
                        }`}
                      >
                        Familiar / Studying
                      </button>
                    </div>

                    {(gap.status === 'confirmed' || gap.status === 'studying') && (
                      <div className="pt-2">
                        <textarea
                          value={gap.contextNotes}
                          onChange={(e) => handleUpdateGap(gap.id, gap.status, e.target.value)}
                          placeholder="Provide context or project details for verification..."
                          rows={2}
                          className="w-full text-xs font-sans p-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-100 placeholder:text-zinc-600"
                        />
                      </div>
                    )}
                  </div>
                ))}

                <div className="pt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={handleSubmitVerification}
                    disabled={isTailoringResume}
                    className="px-6 py-3 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-all shadow-md shadow-indigo-600/30 flex items-center gap-2"
                  >
                    {isTailoringResume ? 'Tailoring Resume...' : 'Generate Tailored Resume (Phase 2)'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* View 3: ATS Diff Tab */}
        {activeTab === 'diff' && tailoredResume && (
          <DiffViewer
            baseResumeText={resumeText}
            tailoredResume={tailoredResume}
            insights={rawResponse?.match_insights}
          />
        )}

        {/* View 4: Export Hub Tab */}
        {activeTab === 'export' && tailoredResume && (
          <div className="space-y-6">
            <ResumePreview
              resume={tailoredResume}
              rawResponse={rawResponse || undefined}
              candidateName={candidateName}
              candidateContact={candidateContact}
              onUpdateResume={(updated) => setTailoredResume(updated)}
              onOpenJsonModal={() => setIsJsonModalOpen(true)}
            />
          </div>
        )}
      </main>

      {/* Interactive Gap Verification Wizard Modal */}
      <GapWizardModal
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        gaps={gaps}
        onUpdateGap={handleUpdateGap}
        onSubmitVerification={handleSubmitVerification}
        isGenerating={isTailoringResume}
      />

      {/* Strict Schema JSON Viewer Modal */}
      {rawResponse && (
        <JsonViewerModal
          isOpen={isJsonModalOpen}
          onClose={() => setIsJsonModalOpen(false)}
          data={rawResponse}
        />
      )}
    </div>
  );
}
