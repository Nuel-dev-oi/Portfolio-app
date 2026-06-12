export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface ApiResponse<T = null> {
  success: boolean;
  message: string;
  data?: T;
}

export interface Project {
  titleKey: string;
  descriptionKey: string;
  stack: string[];
  github?: string;
  live?: string;
  inProgress?: boolean;
}

export interface ExperienceEntry {
  roleKey: string;
  company: string;
  companyUrl?: string;
  periodKey: string;
  descriptionKey: string;
  bulletKeys: string[];
  stack?: string[];
}

export interface SkillCategory {
  labelKey: string;
  skills: string[];
}
