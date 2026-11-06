import type { EducacionItem, ExperienciaItem } from "~/types/candidate";
import type { CvData } from "~/types/cv";

export interface CvStarterPack {
  id: string;
  name: string;
  roleTitle: string;
  badge: string;
  icon: string;
  description: string;
  data: {
    title: string;
    bio: string;
    skills: string[];
    languages: string[];
    experience: ExperienciaItem[];
    education: EducacionItem[];
  };
}

export const CV_STARTER_PACKS: CvStarterPack[] = [
  {
    id: "junior-starter",
    name: "Sin Experiencia / Primer Empleo",
    roleTitle: "Recién Egresado(a) / Aspirante",
    badge: "Ideal Principiantes",
    icon: "school",
    description:
      "Estructurado para estudiantes y egresados; resalta proyectos formativos, habilidades blandas y entusiasmo de aprendizaje.",
    data: {
      title: "Profesional en Inicio de Carrera / Recién Egresado(a)",
      bio: "Profesional proactivo, disciplinado y con sólida base académica. Destaco por mi rapidez de aprendizaje, capacidad de adaptación a entornos dinámicos y compromiso con el trabajo en equipo. Motivado para aportar energía, pensamiento crítico y valor medible a la organización mientras desarrollo mi trayectoria profesional.",
      skills: [
        "Trabajo en Equipo",
        "Comunicación Asertiva",
        "Pensamiento Analítico",
        "Resolución de Problemas",
        "Adaptabilidad",
        "Gestión del Tiempo",
        "Google Workspace / Office",
        "Atención al Detalle",
      ],
      languages: ["Español (Nativo)", "Inglés (Básico - Intermedio)"],
      experience: [
        {
          puesto: "Servicio Social / Asistente de Proyectos",
          empresa: "Organización Comunitaria / Institución",
          periodo: "2024 - 2025",
          descripcion:
            "Coordiné la gestión y archivo de expedientes digitales, colaborando con un equipo multidisciplinario en la atención de más de 100 usuarios semanales y asegurando un índice de respuesta puntual del 98%.",
        },
        {
          puesto: "Líder de Proyecto Académico / Prácticas Integradoras",
          empresa: "Facultad / Proyecto Universitario",
          periodo: "2024",
          descripcion:
            "Diseñé e investigué una propuesta de mejora operativa como proyecto final de titulación, aplicando metodologías ágiles y presentando resultados favorables ante un sínodo evaluador.",
        },
      ],
      education: [
        {
          institucion: "Universidad / Instituto Tecnológico",
          titulo: "Licenciatura / Ingeniería / Bachillerato Técnico",
          periodo: "2020 - 2024",
          descripcion:
            "Egresado con promedio distinguido. Participación activa en talleres de liderazgo, emprendimiento y desarrollo integral.",
        },
      ],
    },
  },
  {
    id: "tech-software",
    name: "Tecnología & Desarrollo",
    roleTitle: "Software / Web Developer",
    badge: "Alta Demanda",
    icon: "terminal",
    description:
      "Stack tecnológico moderno, proyectos frontend/backend, control de versiones y metodologías ágiles.",
    data: {
      title: "Desarrollador(a) de Software / Web Developer",
      bio: "Desarrollador de software con pasión por crear aplicaciones web modernas, seguras y de alto rendimiento. Experiencia práctica en arquitecturas basadas en componentes, diseño de APIs RESTful, bases de datos relacionales y NoSQL, y flujos de integración continua (CI/CD) bajo metodologías ágiles (Scrum).",
      skills: [
        "JavaScript / TypeScript",
        "Vue.js / Nuxt",
        "Node.js",
        "REST APIs & WebSockets",
        "Git & GitHub",
        "PostgreSQL / DynamoDB",
        "HTML5 & Tailwind CSS",
        "Metodologías Ágiles (Scrum)",
        "Docker / Cloud Computing",
      ],
      languages: ["Español (Nativo)", "Inglés (Técnico Profesional B2)"],
      experience: [
        {
          puesto: "Desarrollador Web Full Stack",
          empresa: "Soluciones Digitales Tech",
          periodo: "2023 - Presente",
          descripcion:
            "Desarrollo e implementación de módulos web responsivos y endpoints REST seguros. Optimicé los tiempos de respuesta del cliente en un 35% implementando SSR y caché distribuido.",
        },
        {
          puesto: "Desarrollador Frontend Junior",
          empresa: "Agencia de Software Innova",
          periodo: "2022 - 2023",
          descripcion:
            "Construcción de interfaces de usuario interactivas con Vue y Tailwind CSS. Colaboré con el equipo de diseño para asegurar conformidad con los estándares de accesibilidad WCAG.",
        },
      ],
      education: [
        {
          institucion: "Instituto Tecnológico / Universidad",
          titulo: "Ingeniería en Sistemas Computacionales / Software",
          periodo: "2018 - 2022",
        },
      ],
    },
  },
  {
    id: "sales-customer",
    name: "Ventas & Atención al Cliente",
    roleTitle: "Ejecutivo(a) Comercial / Soporte",
    badge: "Comercial",
    icon: "support_agent",
    description:
      "Enfocado en superación de metas de ventas, negociación, fidelización y resolución empática de consultas.",
    data: {
      title: "Especialista en Ventas y Servicio al Cliente",
      bio: "Profesional enfocado en la satisfacción del cliente y el cumplimiento constante de metas comerciales. Destaco por mi facilidad de comunicación verbal y escrita, habilidad para detectar necesidades específicas de compra y capacidad para resolver objeciones mediante un trato cordial, empático y orientado a resultados.",
      skills: [
        "Cierre de Ventas Consultivas",
        "Atención y Servicio al Cliente",
        "Manejo de CRM (Salesforce / HubSpot)",
        "Fidelización y Retención",
        "Resolución de Quejas e Incidencias",
        "Negociación y Persuasión",
        "Control de Caja / Terminales POS",
        "Trabajo por Objetivos Mensuales",
      ],
      languages: ["Español (Nativo)", "Inglés (Atención Básica)"],
      experience: [
        {
          puesto: "Ejecutivo(a) de Ventas y Atención Personalizada",
          empresa: "Grupo Comercial & Retail",
          periodo: "2023 - Presente",
          descripcion:
            "Superé las metas mensuales de facturación en un promedio del 15%. Administré una cartera activa de más de 90 clientes, logrando un 94% de retención anual mediante seguimiento post-venta continuo.",
        },
        {
          puesto: "Asesor(a) de Servicio al Cliente",
          empresa: "Centro de Contacto y Soluciones",
          periodo: "2021 - 2023",
          descripcion:
            "Atención multicanal (telefónica, chat y correo) de solicitudes e incidencias operativas, manteniendo un tiempo promedio de resolución de primer contacto de menos de 8 minutos.",
        },
      ],
      education: [
        {
          institucion: "Universidad / Bachillerato Tecnológico",
          titulo: "Licenciatura en Mercadotecnia / Administración o Afín",
          periodo: "2019 - 2023",
        },
      ],
    },
  },
  {
    id: "admin-operations",
    name: "Administración & Operaciones",
    roleTitle: "Auxiliar / Asistente Administrativo(a)",
    badge: "Oficina y Finanzas",
    icon: "inventory_2",
    description:
      "Gestión documental, facturación, conciliaciones, control de inventario y reporte de métricas.",
    data: {
      title: "Asistente Administrativo(a) y de Gestión Operativa",
      bio: "Profesional administrativo riguroso y metódico con experiencia en gestión documental, facturación electrónica, control de inventarios y atención a proveedores. Habilidad comprobada para optimizar procesos internos, reducir márgenes de error y brindar soporte logístico integral a directivos y equipos de trabajo.",
      skills: [
        "Microsoft Excel Avanzado (Tablas Dinámicas / VLOOKUP)",
        "Facturación Electrónica SAT (CFDI)",
        "Control y Auditoría de Inventarios",
        "Gestión de Cuentas por Pagar / Cobrar",
        "Elaboración de Reportes Financieros",
        "Manejo de Sistemas ERP",
        "Archivo y Digitalización Documental",
        "Organización y Puntualidad",
      ],
      languages: ["Español (Nativo)"],
      experience: [
        {
          puesto: "Auxiliar Administrativo(a) y de Facturación",
          empresa: "Corporativo Logístico & Operaciones",
          periodo: "2022 - Presente",
          descripcion:
            "Elaboración y timbrado de facturas electrónicas, conciliación de cuentas bancarias y archivo digital de más de 400 documentos contables mensuales con cero discrepancias.",
        },
        {
          puesto: "Recepcionista y Asistente General",
          empresa: "Despacho de Servicios Profesionales",
          periodo: "2020 - 2022",
          descripcion:
            "Gestión de agenda ejecutiva, recepción de visitantes y coordinación de mensajería y suministros de oficina, reduciendo costos de consumibles en un 12%.",
        },
      ],
      education: [
        {
          institucion: "Centro de Estudios Universitarios",
          titulo: "Licenciatura en Administración / Contaduría o Técnico",
          periodo: "2018 - 2022",
        },
      ],
    },
  },
  {
    id: "marketing-creative",
    name: "Marketing Digital & Creatividad",
    roleTitle: "Content & Community Manager",
    badge: "Creativo",
    icon: "campaign",
    description:
      "Gestión de marcas en redes sociales, copywriting, diseño gráfico digital, métricas de engagement y pauta.",
    data: {
      title: "Especialista en Marketing Digital y Contenido",
      bio: "Especialista en marketing digital y creación de contenido con enfoque analítico y visual. Experiencia en la planificación de calendarios editoriales, gestión de pauta en Meta Ads, redacción persuasiva (copywriting) y monitoreo de KPIs de crecimiento para marcas comerciales y emprendimientos.",
      skills: [
        "Gestión de Redes Sociales (Meta, TikTok, LinkedIn)",
        "Creación de Contenido Multimedia",
        "Copywriting & Storytelling",
        "Meta Ads & Google Ads Básico",
        "Canva / Adobe Photoshop Básico",
        "Google Analytics 4",
        "Email Marketing & Newsletters",
        "Estrategias de Engagement",
      ],
      languages: ["Español (Nativo)", "Inglés (Intermedio B2)"],
      experience: [
        {
          puesto: "Coordinador(a) de Redes Sociales y Contenido",
          empresa: "Agencia Creativa de Marcas",
          periodo: "2023 - Presente",
          descripcion:
            "Planificación y ejecución de estrategias de contenido orgánico, logrando un crecimiento del 45% en seguidores y un aumento del 30% en interacciones en Instagram y TikTok.",
        },
      ],
      education: [
        {
          institucion: "Universidad de Comunicación y Diseño",
          titulo: "Licenciatura en Mercadotecnia / Diseño o Afín",
          periodo: "2019 - 2023",
        },
      ],
    },
  },
];

/**
 * Intelligent filler for profiles that have sparse or missing information.
 * It fills only the empty gaps so the CV looks rich, balanced, and professional,
 * without overwriting the candidate's existing real data.
 */
export function smartAutoFillGaps(
  currentData: CvData,
  preferredCategory: string = "junior-starter",
): {
  enrichedData: CvData;
  filledFields: string[];
} {
  const pack =
    CV_STARTER_PACKS.find((p) => p.id === preferredCategory) ||
    CV_STARTER_PACKS[0];
  const filledFields: string[] = [];

  const copy: CvData = {
    ...currentData,
    skills: [...(currentData.skills || [])],
    languages: [...(currentData.languages || [])],
    experience: [...(currentData.experience || [])],
    education: [...(currentData.education || [])],
    links: [...(currentData.links || [])],
  };

  // 1. Título Profesional
  if (!copy.title || copy.title === "Profesional" || copy.title.trim() === "") {
    copy.title = pack.data.title;
    filledFields.push("Título profesional");
  }

  // 2. Resumen Profesional / Biografía
  if (!copy.bio || copy.bio.trim().length < 25) {
    copy.bio = pack.data.bio;
    filledFields.push("Resumen profesional enriquecido");
  }

  // 3. Habilidades
  if (!copy.skills || copy.skills.length < 3) {
    const existing = new Set(copy.skills.map((s) => s.toLowerCase()));
    const toAdd = pack.data.skills.filter(
      (s) => !existing.has(s.toLowerCase()),
    );
    copy.skills = [...copy.skills, ...toAdd.slice(0, 6)];
    filledFields.push("Habilidades clave");
  }

  // 4. Idiomas
  if (!copy.languages || copy.languages.length === 0) {
    copy.languages = [...pack.data.languages];
    filledFields.push("Idiomas sugeridos");
  }

  // 5. Experiencia
  if (!copy.experience || copy.experience.length === 0) {
    copy.experience = [...pack.data.experience];
    filledFields.push("Experiencias / Proyectos formativos");
  }

  // 6. Educación
  if (!copy.education || copy.education.length === 0) {
    copy.education = [...pack.data.education];
    filledFields.push("Estructura de educación académica");
  }

  return {
    enrichedData: copy,
    filledFields,
  };
}

/**
 * Action Verbs and High-Impact Phrasing suggestions for CV bullets
 */
export const ACTION_VERBS = [
  {
    category: "Liderazgo & Gestión",
    verbs: [
      "Coordiné",
      "Lideré",
      "Gestioné",
      "Supervisé",
      "Capacité",
      "Planifiqué",
    ],
  },
  {
    category: "Logros & Crecimiento",
    verbs: ["Incrementé", "Optimicé", "Reduje", "Alcancé", "Superé", "Generé"],
  },
  {
    category: "Creación & Desarrollo",
    verbs: [
      "Diseñé",
      "Desarrollé",
      "Implementé",
      "Automatice",
      "Construí",
      "Estructuré",
    ],
  },
  {
    category: "Operación & Soporte",
    verbs: ["Administré", "Resolví", "Atendí", "Concilié", "Elaboré", "Auditó"],
  },
];

/**
 * ATS Quality Evaluation Checker
 */
export function calculateCvAtsScore(
  cv: CvData,
  options: { anonymousMode?: boolean },
): {
  score: number;
  status: "Excelente" | "Bueno" | "Por Mejorar";
  badgeColor: string;
  checklist: Array<{ label: string; passed: boolean; tip: string }>;
} {
  const isAnon = Boolean(options.anonymousMode);
  const checklist = [
    {
      label: "Título profesional específico",
      passed: Boolean(
        cv.title && cv.title !== "Profesional" && cv.title.trim().length > 3,
      ),
      tip: "Indica tu rol exacto (ej. Desarrollador Frontend o Ejecutivo de Ventas).",
    },
    {
      label: "Resumen profesional con impacto (mínimo 20 palabras)",
      passed: Boolean(cv.bio && cv.bio.trim().split(/\s+/).length >= 18),
      tip: "Explica brevemente quién eres, tus fortalezas principales y qué valor aportas.",
    },
    {
      label: "Al menos 4 habilidades clave",
      passed: Boolean(cv.skills && cv.skills.length >= 4),
      tip: "Los filtros ATS buscan palabras clave exactas de la vacante.",
    },
    {
      label: "Experiencia laboral o proyectos formativos descritos",
      passed: Boolean(
        cv.experience &&
        cv.experience.length > 0 &&
        cv.experience.some((e) => e.descripcion && e.descripcion.length > 20),
      ),
      tip: "Incluye logros cuantificables y responsabilidades principales.",
    },
    {
      label: "Formación académica o grado educativo",
      passed: Boolean(
        cv.education &&
        cv.education.length > 0 &&
        cv.education.some((ed) => ed.institucion && ed.titulo),
      ),
      tip: "Registra tu último nivel de estudios o certificaciones relevantes.",
    },
    {
      label: isAnon
        ? "Modo Anónimo Imparcial activo"
        : "Datos de contacto completos",
      passed: isAnon ? true : Boolean(cv.email && (cv.phone || cv.location)),
      tip: isAnon
        ? "Cumple con el estándar de postulación a ciegas sin sesgos."
        : "Verifica tu correo electrónico y teléfono de contacto.",
    },
  ];

  const passedCount = checklist.filter((item) => item.passed).length;
  const score = Math.round((passedCount / checklist.length) * 100);

  let status: "Excelente" | "Bueno" | "Por Mejorar" = "Por Mejorar";
  let badgeColor = "bg-rose-500/10 text-rose-600 border-rose-500/20";

  if (score >= 80) {
    status = "Excelente";
    badgeColor = "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
  } else if (score >= 50) {
    status = "Bueno";
    badgeColor = "bg-amber-500/10 text-amber-600 border-amber-500/20";
  }

  return {
    score,
    status,
    badgeColor,
    checklist,
  };
}
