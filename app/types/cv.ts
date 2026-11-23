import type { EducacionItem, ExperienciaItem, WebLinkItem } from "./candidate";

export type CvTemplateId =
  | "minimal-tech"
  | "executive"
  | "creative"
  | "harvard-classic"
  | "compact-ats"
  | "modern-split"
  | "standard";

export interface CvColorTheme {
  id: string;
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  bgLight: string;
  border: string;
}

export interface CvData {
  name: string;
  title: string;
  email: string;
  phone?: string;
  location: string;
  bio: string;
  photoUrl?: string;
  skills: string[];
  languages?: string[];
  education: EducacionItem[];
  experience: ExperienciaItem[];
  links: WebLinkItem[];
}

export interface CvOptions {
  templateId: CvTemplateId;
  colorTheme: string;
  primaryColor?: string;
  anonymousMode: boolean;
  anonymousId?: string;
  showPhoto: boolean;
  showBio: boolean;
  showPhone: boolean;
  showEmail: boolean;
  showLocation: boolean;
  showLinks: boolean;
  showSkills: boolean;
  showLanguages: boolean;
  showEducation: boolean;
  showExperience: boolean;
  fontSize: "sm" | "base" | "lg";
}
