import type {
  CommunityCvTemplate,
  CommunityTemplateExperience,
  CommunityTemplateEducation,
  LanguageCode,
  RoleCategory,
  ExperienceLevel,
  ScopeCode,
} from "~/types/cvCommunity";

export interface SanitizeInputProfile {
  id?: string;
  nombre?: string;
  tituloProfesional?: string;
  biografia?: string;
  habilidades?: string[];
  idiomas?: string[];
  experiencia?: Array<{
    puesto?: string;
    cargo?: string;
    empresa?: string;
    periodo?: string;
    descripcion?: string;
    logros?: string[];
  }>;
  educacion?: Array<{
    titulo?: string;
    carrera?: string;
    institucion?: string;
    periodo?: string;
  }>;
}

export interface SanitizeOptions {
  titulo?: string;
  rol?: string;
  categoria?: RoleCategory;
  nivel?: ExperienceLevel;
  idioma?: LanguageCode;
  alcance?: ScopeCode;
  autorNombre?: string;
  autorId?: string;
}

/**
 * Replaces sensitive company names, personal names, phone numbers,
 * and emails with generic industry placeholders.
 */
export function sanitizeText(text?: string): string {
  if (!text) return "";

  let cleaned = text
    // Replace emails
    .replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, "[correo@ejemplo.com]")
    // Replace phone numbers (Mexican and international formats)
    .replace(/(?:\+?\d{1,3}[-.\s]?)?\(?\d{2,4}\)?[-.\s]?\d{3,4}[-.\s]?\d{3,4}/g, "[+52 722 XXX XXXX]")
    // Replace RFC / CURP patterns
    .replace(/[A-Z]{4}\d{6}[A-Z0-9]{3}/gi, "[RFC-GENERICO]")
    .replace(/[A-Z]{4}\d{6}[HM][A-Z]{5}[A-Z0-9]{2}/gi, "[CURP-GENERICA]")
    // Replace URLs
    .replace(/https?:\/\/[^\s]+/g, "https://ejemplo.com");

  return cleaned.trim();
}

/**
 * Infers a generic company placeholder based on job title or role context
 */
export function sanitizeCompanyName(rawCompany?: string, jobTitle?: string): string {
  const title = (jobTitle || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  if (
    title.includes("react") ||
    title.includes("frontend") ||
    title.includes("software") ||
    title.includes("backend") ||
    title.includes("fullstack")
  ) {
    return "Empresa de Tecnología & Software / Fintech";
  }
  if (
    title.includes("logistica") ||
    title.includes("almacen") ||
    title.includes("supply")
  ) {
    return "Centro de Distribución / Parque Industrial (Toluca-Lerma)";
  }
  if (
    title.includes("venta") ||
    title.includes("comercial") ||
    title.includes("account")
  ) {
    return "Empresa Comercial B2B / Servicios Corporativos";
  }
  if (
    title.includes("data") ||
    title.includes("analyst") ||
    title.includes("analit") ||
    title.includes("bi")
  ) {
    return "Compañía de Analítica & Consultoría Digital";
  }
  if (
    title.includes("diseno") ||
    /\b(ux|ui)\b/.test(title)
  ) {
    return "Agencia Creativa / Producto Digital";
  }

  return "Empresa del Sector Privado";
}

/**
 * Converts a candidate's profile into an anonymous, clean community template
 */
export function sanitizeProfileToCommunityTemplate(
  profile: SanitizeInputProfile,
  options: SanitizeOptions = {},
): CommunityCvTemplate {
  const roleName = options.rol || profile.tituloProfesional || "Profesional Especialista";
  const category = options.categoria || "frontend";
  const level = options.nivel || "mid";
  const language = options.idioma || "es";
  const scope = options.alcance || (language === "en" ? "GLOBAL_REMOTO" : "SUR_EDOMEX");

  // Clean and prepare experiences
  const sanitizedExperience: CommunityTemplateExperience[] = (profile.experiencia || []).map((exp) => {
    const cargo = exp.puesto || exp.cargo || "Especialista";
    const empresa = sanitizeCompanyName(exp.empresa, cargo);
    const periodo = exp.periodo || "2023 - Presente";

    let logros: string[] = [];
    if (Array.isArray(exp.logros) && exp.logros.length > 0) {
      logros = exp.logros.map((l) => sanitizeText(l));
    } else if (exp.descripcion) {
      // Split description sentences into bullets
      logros = exp.descripcion
        .split(/[.\n]/)
        .map((s) => s.trim())
        .filter((s) => s.length > 15)
        .map((s) => sanitizeText(s));
    }

    if (logros.length === 0) {
      logros = [
        "Implementé metodologías ágiles mejorando los tiempos de entrega en un [X]%.",
        "Colaboré con equipos interdisciplinarios para alcanzar los objetivos del área con alta eficiencia.",
      ];
    }

    return { cargo, empresa, periodo, logros };
  });

  // Clean and prepare education
  const sanitizedEducation: CommunityTemplateEducation[] = (profile.educacion || []).map((edu) => ({
    titulo: edu.titulo || edu.carrera || "Licenciatura / Ingeniería",
    institucion: "Universidad / Instituto Tecnológico",
    periodo: edu.periodo || "2018 - 2022",
  }));

  // Clean bio
  const cleanBio = sanitizeText(profile.biografia) ||
    `Profesional con experiencia en ${profile.habilidades?.slice(0, 4).join(", ") || "soluciones estratégicas"}. Enfocado en metodologías modernas, trabajo colaborativo y entrega de resultados de alto impacto.`;

  return {
    id: `template-${Date.now()}`,
    titulo: options.titulo || `Plantilla para ${roleName}`,
    rol: roleName,
    categoria: category,
    nivel: level,
    idioma: language,
    alcance: scope,
    autorId: options.autorId || profile.id || "candidato-comunidad",
    autorNombre: options.autorNombre || "Candidato de JobNet",
    isOfficial: false,
    habilidades: profile.habilidades && profile.habilidades.length > 0
      ? [...profile.habilidades]
      : ["Resolución de Problemas", "Trabajo en Equipo", "Comunicación Asertiva"],
    biografiaSugerida: cleanBio,
    experienciaSugerida: sanitizedExperience.length > 0 ? sanitizedExperience : [
      {
        cargo: roleName,
        empresa: sanitizeCompanyName(undefined, roleName),
        periodo: "2023 - Presente",
        logros: [
          "Optimicé los flujos operativos incrementando la eficiencia del equipo en un [X]%.",
          "Gestioné proyectos clave cumpliendo los estándares de calidad y tiempos acordados.",
        ],
      },
    ],
    educacionSugerida: sanitizedEducation.length > 0 ? sanitizedEducation : [
      {
        titulo: "Grado Académico Profesional",
        institucion: "Institución de Educación Superior",
        periodo: "2019 - 2023",
      },
    ],
    stats: {
      usesCount: 0,
      likesCount: 0,
    },
  };
}
