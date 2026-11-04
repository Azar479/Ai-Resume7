export interface ExperienceItem {
  company: string;
  role: string;
  dates: string;
  bullet_points: string[];
}

export interface TailoredResume {
  summary: string;
  experiences: ExperienceItem[];
  skills: string[];
}

export interface MatchInsights {
  ats_score_before?: number;
  ats_score_after?: number;
  matched_keywords?: string[];
  verified_user_additions?: string[];
  omitted_gaps?: string[];
  action_verb_highlights?: string[];
}

export interface ResumeEngineResponse {
  missing_keywords_and_questions: string[];
  tailored_resume: TailoredResume;
  match_insights?: MatchInsights;
}

export interface GapAnalysisResponse {
  missing_keywords_and_questions: string[];
  identified_jd_keywords?: string[];
  candidate_name?: string;
  current_title?: string;
  extracted_resume_text?: string;
  base_skills_found?: string[];
}

export type GapStatus = 'pending' | 'confirmed' | 'unfamiliar' | 'studying';

export interface GapItem {
  id: string;
  question: string;
  status: GapStatus;
  contextNotes: string;
}

export interface PresetScenario {
  id: string;
  label: string;
  role: string;
  candidateName: string;
  candidateContact: string;
  resumeText: string;
  jobDescription: string;
}
