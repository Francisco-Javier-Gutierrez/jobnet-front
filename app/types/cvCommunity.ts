export type ExperienceLevel = "trainee" | "junior" | "mid" | "senior" | "lead";

export type RoleCategory =
  | "frontend"
  | "backend"
  | "fullstack"
  | "mobile"
  | "data-ai"
  | "devops-cloud"
  | "design-ux"
  | "qa-testing"
  | "ventas-bizdev"
  | "logistica-operaciones"
  | "administracion-finanzas";

export type LanguageCode = "es" | "en" | "bilingual";

export type ScopeCode = "SUR_EDOMEX" | "NACIONAL" | "GLOBAL_REMOTO";

export interface CommunityTemplateExperience {
  cargo: string;
  empresa: string; // Generic / Sanitized placeholder
  periodo: string;
  logros: string[]; // STAR bullets with [X] metrics
}

export interface CommunityTemplateEducation {
  titulo: string;
  institucion: string;
  periodo: string;
}

export interface CommunityTemplateContent {
  titulo: string;
  rol: string;
  biografiaSugerida: string;
  habilidades: string[];
  experienciaSugerida: CommunityTemplateExperience[];
  educacionSugerida: CommunityTemplateEducation[];
}

export interface CommunityCvTemplate {
  id: string;
  templateId?: string;
  titulo: string;
  rol: string;
  categoria: RoleCategory;
  nivel: ExperienceLevel;
  idioma: LanguageCode;
  alcance: ScopeCode;
  autorId: string;
  autorNombre: string;
  isOfficial?: boolean;
  habilidades: string[];
  biografiaSugerida: string;
  experienciaSugerida: CommunityTemplateExperience[];
  educacionSugerida: CommunityTemplateEducation[];
  translations?: {
    es?: CommunityTemplateContent;
    en?: CommunityTemplateContent;
  };
  stats: {
    usesCount: number;
    likesCount?: number;
  };
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Resolves template fields in the specified language ('es' or 'en').
 * If a dedicated translation is available in `translations[lang]`, it returns that translation.
 * Otherwise, falls back to the top-level template content.
 */
export function resolveTemplateContent(
  template: CommunityCvTemplate,
  lang: "es" | "en",
): CommunityTemplateContent {
  if (template.translations && template.translations[lang]) {
    const t = template.translations[lang]!;
    return {
      titulo: t.titulo || template.titulo,
      rol: t.rol || template.rol,
      biografiaSugerida: t.biografiaSugerida || template.biografiaSugerida,
      habilidades:
        t.habilidades && t.habilidades.length > 0
          ? t.habilidades
          : template.habilidades,
      experienciaSugerida:
        t.experienciaSugerida && t.experienciaSugerida.length > 0
          ? t.experienciaSugerida
          : template.experienciaSugerida,
      educacionSugerida:
        t.educacionSugerida && t.educacionSugerida.length > 0
          ? t.educacionSugerida
          : template.educacionSugerida,
    };
  }

  return {
    titulo: template.titulo,
    rol: template.rol,
    biografiaSugerida: template.biografiaSugerida,
    habilidades: template.habilidades,
    experienciaSugerida: template.experienciaSugerida,
    educacionSugerida: template.educacionSugerida,
  };
}
