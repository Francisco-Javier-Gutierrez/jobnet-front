export interface EducacionItem {
  institucion: string;
  titulo: string;
  campoEstudio?: string;
  anoInicio?: string | number;
  anoFin?: string | number;
  actualmente?: boolean;
  descripcion?: string;
}

export interface ExperienciaItem {
  empresa: string;
  puesto: string;
  anoInicio?: string | number;
  anoFin?: string | number;
  actualmente?: boolean;
  descripcion?: string;
}

export interface WebLinkItem {
  name?: string;
  nombre?: string;
  label?: string;
  url: string;
  icon?: string;
}

export interface AdditionalDoc {
  id?: string;
  name: string;
  nombre?: string;
  url: string;
  s3Key?: string;
  type: "pdf" | "image" | string;
  tipoDocumento?: "CERTIFICACION" | "DIPLOMA" | "CONSTANCIA" | "OTRO";
  meta?: string;
  fechaSubida?: string;
  tamano?: number;
  institucion?: string;
  esEnlaceExterno?: boolean;
}

export interface CandidateProfile {
  id?: string;
  userId?: string;
  nombre?: string;
  name?: string;
  email?: string;
  telefono?: string;
  phone?: string;
  celular?: string;
  fotoPerfil?: string;
  avatarUrl?: string;
  tituloProfesional?: string;
  titularProfesional?: string;
  titular?: string;
  bio?: string;
  descripcion?: string;
  resumen?: string;
  biografia?: string;
  ubicacion?: string | { city?: string; pais?: string; estado?: string };
  habilidades?: string[];
  skills?: string[];
  sectores?: string[];
  links?: Array<{ label?: string; nombre?: string; url: string }>;
  enlacesWeb?: Record<string, string>;
  cvUrl?: string;
  cvFileName?: string;
  documentosAdicionales?: AdditionalDoc[] | Record<string, any>;
  documentosProfesionales?: AdditionalDoc[] | Record<string, any>;
  educacion?: EducacionItem[];
  experiencia?: ExperienciaItem[];
  [key: string]: any;
}

export type ApplicantStage =
  | "ALL"
  | "PENDIENTE"
  | "EN_CONTACTO"
  | "SELECCIONADO"
  | "CONTRATADO"
  | "RECHAZADO";

export interface ApplicantCandidate {
  id: string;
  name: string;
  email: string;
  titularProfesional?: string;
  phone?: string;
  bio?: string;
  skills: string[];
  experience: ExperienciaItem[];
  education: EducacionItem[];
  job: string;
  jobId: string;
  status: ApplicantStage | string;
  coverLetter?: string;
  time?: string;
  cvUrl?: string | null;
}
