export interface ExperienceItem {
  company: string;
  role: string;
  dates: string;
  bullet_points: string[];
}

export interface EducationItem {
  institution: string;
  degree: string;
  dates: string;
  details?: string[];
}

export interface ProjectItem {
  title: string;
  technologies?: string;
  dates?: string;
  bullet_points: string[];
}

export interface CustomSectionItem {
  heading: string;
  subheading?: string;
  dates?: string;
  bullet_points?: string[];
  content?: string;
}

export type SectionType =
  | 'summary'
  | 'experience'
  | 'skills'
  | 'education'
  | 'projects'
  | 'certifications'
  | 'awards'
  | 'custom';

export interface SkillCategoryItem {
  category: string;
  items: string[];
}

export interface DocumentSection {
  id: string;
  title: string;
  type: SectionType;
  content?: string;
  experiences?: ExperienceItem[];
  education?: EducationItem[];
  projects?: ProjectItem[];
  skills?: string[];
  skill_categories?: SkillCategoryItem[];
  items?: CustomSectionItem[];
}

export interface DocumentBlueprint {
  header_alignment: 'center' | 'left';
  has_divider_line: boolean;
  date_alignment: 'right' | 'inline';
  bullet_character: string;
  font_style: 'sans' | 'serif' | 'mono';
  section_order: string[];
  sections: DocumentSection[];
}

export interface TailoredResume {
  summary: string;
  experiences: ExperienceItem[];
  skills: string[];
  education?: EducationItem[];
  projects?: ProjectItem[];
  blueprint?: DocumentBlueprint;
  sections?: DocumentSection[];
  full_tailored_text?: string;
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
  candidate_name?: string;
  candidate_contact?: string;
  blueprint?: DocumentBlueprint;
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
