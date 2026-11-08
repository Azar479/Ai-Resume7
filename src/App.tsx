import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { IntakeView } from './components/IntakeView';
import { ResumePreview } from './components/ResumePreview';
import { DiffViewer } from './components/DiffViewer';
import { AtsScoreCard } from './components/AtsScoreCard';
import { JsonViewerModal } from './components/JsonViewer';
import { PRESET_SCENARIOS } from './presets';
import {
  ResumeEngineResponse,
  TailoredResume,
  PresetScenario,
} from './types';
import {
  FileText,
  Split,
  BarChart3,
  AlertCircle,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'workspace' | 'diff' | 'export'>('workspace');
  const [resultSubTab, setResultSubTab] = useState<'preview' | 'diff' | 'insights'>('preview');

  // Input states
  const [candidateName, setCandidateName] = useState<string>('');
  const [candidateContact, setCandidateContact] = useState<string>('');
  const [resumeText, setResumeText] = useState<string>('');
  const [jobDescription, setJobDescription] = useState<string>('');
  const [resumePdfBase64, setResumePdfBase64] = useState<string | null>(null);
  const [pdfFileName, setPdfFileName] = useState<string | null>(null);

  // Tailoring loading state
  const [isTailoringResume, setIsTailoringResume] = useState<boolean>(false);

  // Result state
  const [rawResponse, setRawResponse] = useState<ResumeEngineResponse | null>(null);
  const [tailoredResume, setTailoredResume] = useState<TailoredResume | null>(null);
  const [isJsonModalOpen, setIsJsonModalOpen] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [engineMode, setEngineMode] = useState<string>('gemini-live');
  const [isSampleData, setIsSampleData] = useState<boolean>(true);

  // Initialize with the first preset scenario on load
  useEffect(() => {
    handleSelectPreset(PRESET_SCENARIOS[0]);
  }, []);

  const handleSelectPreset = (preset: PresetScenario) => {
    setIsSampleData(true);
    setCandidateName(preset.candidateName);
    setCandidateContact(preset.candidateContact);
    setResumeText(preset.resumeText);
    setJobDescription(preset.jobDescription);
    setResumePdfBase64(null);
    setPdfFileName(null);
    setRawResponse(null);
    setTailoredResume(null);
    setErrorMessage(null);
  };

  const handleClearSampleData = () => {
    setIsSampleData(false);
    setCandidateName('');
    setCandidateContact('');
    setResumeText('');
    setJobDescription('');
    setResumePdfBase64(null);
    setPdfFileName(null);
    setRawResponse(null);
    setTailoredResume(null);
    setErrorMessage(null);
  };

  const handleReset = () => {
    handleClearSampleData();
    setActiveTab('workspace');
    setResultSubTab('preview');
  };

  // Direct 1-Click Tailoring with Exact Format Mirroring
  const handleTailorResume = async () => {
    if ((!resumeText && !resumePdfBase64) || !jobDescription) {
      setErrorMessage('Please provide both your resume and the target job description.');
      return;
    }

    setIsTailoringResume(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/tailor-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeText,
          resumePdfBase64,
          jobDescription,
          candidateName,
          candidateContact,
          gapAnswers: [],
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
      if (data.candidate_name) {
        setCandidateName(data.candidate_name);
      }
      if (data.candidate_contact) {
        setCandidateContact(data.candidate_contact);
      }

      setRawResponse(data);
      setTailoredResume(data.tailored_resume);
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
                setResumeText={(t) => {
                  setResumeText(t);
                  setIsSampleData(false);
                }}
                resumePdfBase64={resumePdfBase64}
                setResumePdfBase64={setResumePdfBase64}
                pdfFileName={pdfFileName}
                setPdfFileName={setPdfFileName}
                jobDescription={jobDescription}
                setJobDescription={setJobDescription}
                candidateName={candidateName}
                setCandidateName={(n) => {
                  setCandidateName(n);
                  setIsSampleData(false);
                }}
                candidateContact={candidateContact}
                setCandidateContact={setCandidateContact}
                onTailorResume={handleTailorResume}
                isLoading={isTailoringResume}
                onSelectPreset={handleSelectPreset}
                isSampleData={isSampleData}
                onClearSampleData={handleClearSampleData}
                onFileExtracted={() => setIsSampleData(false)}
              />
            ) : (
              // Result View
              <div className="space-y-6">
                {/* Result Navigation Dock */}
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
                      Tailored Resume
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
                      Before & After
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
                      Match Breakdown
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setTailoredResume(null)}
                      className="px-3.5 py-1.5 text-xs font-medium text-zinc-300 bg-zinc-950 hover:bg-zinc-800 rounded-xl border border-zinc-800 transition-colors"
                    >
                      Edit Inputs / Upload Another
                    </button>
                  </div>
                </div>

                {/* Sub-tab 1: ATS Resume Preview with Format Mirroring & Side-by-Side */}
                {resultSubTab === 'preview' && (
                  <ResumePreview
                    resume={tailoredResume}
                    rawResponse={rawResponse || undefined}
                    candidateName={candidateName}
                    candidateContact={candidateContact}
                    pdfBase64={resumePdfBase64}
                    fileName={pdfFileName}
                    originalResumeText={resumeText}
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
                            Exact Format & 100% Real Experience Guarantee
                          </h4>
                          <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                            Your exact company names, roles, dates, and section sequence are preserved directly from your original resume. Bullet points have been tailored with strong action verbs and target JD keywords to maximize ATS score.
                          </p>

                          <div className="mt-4 flex flex-wrap gap-4 text-xs font-medium text-zinc-300 font-mono">
                            <span className="flex items-center gap-1.5 text-emerald-400">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Exact Sections & Ordering Kept
                            </span>
                            <span className="flex items-center gap-1.5 text-emerald-400">
                              <CheckCircle2 className="w-3.5 h-3.5" /> 100% Real Companies & Dates
                            </span>
                            <span className="flex items-center gap-1.5 text-emerald-400">
                              <CheckCircle2 className="w-3.5 h-3.5" /> High-Impact Action Words
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

        {/* View 2: ATS Diff Tab */}
        {activeTab === 'diff' && tailoredResume && (
          <DiffViewer
            baseResumeText={resumeText}
            tailoredResume={tailoredResume}
            insights={rawResponse?.match_insights}
          />
        )}

        {/* View 3: Export Hub Tab */}
        {activeTab === 'export' && tailoredResume && (
          <div className="space-y-6">
            <ResumePreview
              resume={tailoredResume}
              rawResponse={rawResponse || undefined}
              candidateName={candidateName}
              candidateContact={candidateContact}
              pdfBase64={resumePdfBase64}
              fileName={pdfFileName}
              originalResumeText={resumeText}
              onUpdateResume={(updated) => setTailoredResume(updated)}
              onOpenJsonModal={() => setIsJsonModalOpen(true)}
            />
          </div>
        )}
      </main>

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
