import type {
  Job,
  Post,
  CandidateProfile,
  CompanyProfile,
  AdminOrganization,
  Incident,
  Appeal,
  ApplicantCandidate,
  ChatConversation,
  ChatMessage
} from "~/types";

// ============================================================================
// 1. EMPRESAS Y ORGANIZACIONES REGISTRADAS
// ============================================================================
export const MOCK_COMPANIES: CompanyProfile[] = [
  {
    id: "org-techsolutions-01",
    companyId: "org-techsolutions-01",
    userId: "user-empresa-techsolutions",
    nombre: "TechSolutions México S.A. de C.V.",
    nombreComercial: "TechSolutions México",
    razonSocial: "TechSolutions México S.A. de C.V.",
    rfc: "TSM190412KL1",
    email: "contacto@techsolutions.mx",
    telefono: "+52 722 456 7890",
    sitioWeb: "https://techsolutions.mx",
    descripcion: "Empresa líder especializada en arquitectura cloud, microservicios y soluciones digitales de alto impacto para el sector empresarial y financiero.",
    biografia: "Fundada en 2019 en Toluca, TechSolutions ha desarrollado plataformas críticas para más de 40 corporativos en México y Latinoamérica.",
    logoUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80",
    fotoPerfil: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80",
    bannerUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&auto=format&fit=crop&q=80",
    ubicacion: "Toluca, Estado de México, México",
    sector: "Tecnología y Software",
    tamanoEmpresa: "51-200 empleados",
    organizacionVerificada: true,
    estatusVerificacion: "VERIFICADA",
    estatus: "ACTIVO",
    estadoCuenta: "ACTIVO",
    vacantesActivas: 3,
    documentosVerificacion: [
      {
        nombre: "Constancia_Situacion_Fiscal_SAT_TSM.pdf",
        url: "/docs/sample-sat-constancia.pdf",
        tipo: "SAT_RFC",
        fecha: "2026-01-15"
      }
    ]
  },
  {
    id: "org-innovatech-02",
    companyId: "org-innovatech-02",
    userId: "user-empresa-innovatech",
    nombre: "Innovatech Global Solutions S. de R.L.",
    nombreComercial: "Innovatech Global",
    razonSocial: "Innovatech Global Solutions S. de R.L.",
    rfc: "IGS200115MN8",
    email: "talento@innovatech.com",
    telefono: "+52 33 1234 5678",
    sitioWeb: "https://innovatech.com",
    descripcion: "Pioneros en inteligencia artificial aplicada, visión computacional y modelos predictivos para logística y comercio electrónico.",
    biografia: "Equipo multidisciplinario distribuido en Guadalajara, Metepec y Ciudad de México.",
    logoUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=150&auto=format&fit=crop&q=80",
    fotoPerfil: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=150&auto=format&fit=crop&q=80",
    bannerUrl: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1200&auto=format&fit=crop&q=80",
    ubicacion: "Metepec, Estado de México, México",
    sector: "Inteligencia Artificial y Fintech",
    tamanoEmpresa: "201-500 empleados",
    organizacionVerificada: true,
    estatusVerificacion: "VERIFICADA",
    estatus: "ACTIVO",
    estadoCuenta: "ACTIVO",
    vacantesActivas: 2,
    documentosVerificacion: [
      {
        nombre: "Constancia_SAT_Innovatech.pdf",
        url: "/docs/sample-sat-constancia.pdf",
        tipo: "SAT_RFC",
        fecha: "2026-02-10"
      }
    ]
  },
  {
    id: "org-biosalud-03",
    companyId: "org-biosalud-03",
    userId: "user-empresa-biosalud",
    nombre: "BioSalud Farmacéutica de México S.A.",
    nombreComercial: "BioSalud México",
    razonSocial: "BioSalud Farmacéutica de México S.A.",
    rfc: "BFM180820PR3",
    email: "rh@biosalud.com.mx",
    telefono: "+52 442 889 0011",
    sitioWeb: "https://biosalud.com.mx",
    descripcion: "Corporativo de biotecnología aplicada, ensayos clínicos y software biomédico con estrictos estándares de calidad internacional.",
    logoUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=150&auto=format&fit=crop&q=80",
    fotoPerfil: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=150&auto=format&fit=crop&q=80",
    ubicacion: "Querétaro, QRO / Naucalpan, Edo. Méx.",
    sector: "Salud y Biotecnología",
    tamanoEmpresa: "500+ empleados",
    organizacionVerificada: true,
    estatusVerificacion: "VERIFICADA",
    estatus: "ACTIVO",
    estadoCuenta: "ACTIVO",
    vacantesActivas: 2
  },
  {
    id: "org-starlight-04",
    companyId: "org-starlight-04",
    userId: "user-empresa-starlight",
    nombre: "Starlight Logistics Express S.A. de C.V.",
    nombreComercial: "Starlight Logistics",
    razonSocial: "Starlight Logistics Express S.A. de C.V.",
    rfc: "SLE170510TR2",
    email: "empleos@starlightlogistics.com",
    telefono: "+52 55 9988 7766",
    sitioWeb: "https://starlightlogistics.com",
    descripcion: "Operador logístico internacional multimodal enfocado en automatización de almacenes, seguimiento satelital e IoT.",
    logoUrl: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=150&auto=format&fit=crop&q=80",
    fotoPerfil: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=150&auto=format&fit=crop&q=80",
    ubicacion: "Lerma, Estado de México, México",
    sector: "Logística y Cadena de Suministro",
    tamanoEmpresa: "201-500 empleados",
    organizacionVerificada: true,
    estatusVerificacion: "VERIFICADA",
    estatus: "ACTIVO",
    estadoCuenta: "ACTIVO",
    vacantesActivas: 1
  },
  {
    id: "org-metropolitana-05",
    companyId: "org-metropolitana-05",
    userId: "user-empresa-metropolitana",
    nombre: "Consultoría & Tecnología Metropolitana S.A.S.",
    nombreComercial: "Consultoría Metropolitana",
    razonSocial: "Consultoría & Tecnología Metropolitana S.A.S.",
    rfc: "CTM210908KL3",
    email: "administracion@ctmconsultoria.com.mx",
    telefono: "+52 722 334 1122",
    sitioWeb: "https://ctmconsultoria.com.mx",
    descripcion: "Consultoría especializada en digitalización para PYMES del Valle de Toluca, migración cloud e infraestructura de redes seguras.",
    logoUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=150&auto=format&fit=crop&q=80",
    fotoPerfil: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=150&auto=format&fit=crop&q=80",
    ubicacion: "Metepec, Estado de México, México",
    sector: "Consultoría y Servicios TI",
    tamanoEmpresa: "11-50 empleados",
    organizacionVerificada: false,
    estatusVerificacion: "PENDIENTE",
    estatus: "REVISION",
    estadoCuenta: "REVISION",
    vacantesActivas: 1,
    documentosVerificacion: [
      {
        nombre: "Constancia_Situacion_Fiscal_SAT_CTM_2026.pdf",
        url: "/docs/sample-sat-constancia.pdf",
        tipo: "SAT_RFC",
        fecha: "2026-10-12"
      }
    ]
  },
  {
    id: "org-nexgen-06",
    companyId: "org-nexgen-06",
    userId: "user-empresa-nexgen",
    nombre: "NexGen Retail Cloud S.A.P.I. de C.V.",
    nombreComercial: "NexGen Retail",
    razonSocial: "NexGen Retail Cloud S.A.P.I. de C.V.",
    rfc: "NRC220314HY7",
    email: "jobs@nexgenretail.io",
    telefono: "+52 55 4433 2211",
    sitioWeb: "https://nexgenretail.io",
    descripcion: "Plataforma SaaS omnicanal de e-commerce y pasarelas de pago para retail con más de 1 millón de transacciones diarias.",
    logoUrl: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=150&auto=format&fit=crop&q=80",
    fotoPerfil: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=150&auto=format&fit=crop&q=80",
    ubicacion: "Naucalpan de Juárez, Estado de México",
    sector: "E-Commerce y Retail Tech",
    tamanoEmpresa: "51-200 empleados",
    organizacionVerificada: true,
    estatusVerificacion: "VERIFICADA",
    estatus: "ACTIVO",
    estadoCuenta: "ACTIVO",
    vacantesActivas: 1
  }
];

// ============================================================================
// 2. CANDIDATOS Y PERFILES
// ============================================================================
export const MOCK_CANDIDATE_DEMO: CandidateProfile = {
  id: "candidate-francisco-gomez",
  userId: "user-francisco-gomez",
  nombre: "Francisco Javier Gómez Hernández",
  name: "Francisco Gómez",
  email: "francisco.gomez@gmail.com",
  telefono: "+52 722 456 7890",
  phone: "+52 722 456 7890",
  fotoPerfil: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
  avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
  titularProfesional: "Ingeniero Full Stack Senior (Vue 3, Nuxt, TypeScript & AWS)",
  bio: "Desarrollador de software con más de 5 años de trayectoria diseñando aplicaciones web de alto rendimiento, microservicios serverless en AWS y arquitecturas frontend escalables con Tailwind CSS y Vue 3.",
  descripcion: "Especialista en desarrollo frontend y cloud nativo. Apasionado por la experiencia de usuario (UX), el código limpio y la integración continua.",
  ubicacion: "Toluca, Estado de México, México",
  habilidades: [
    "Vue.js 3", "Nuxt 3", "TypeScript", "Tailwind CSS", "Node.js", 
    "AWS Lambda", "DynamoDB", "Pinia", "Git & CI/CD", "Docker"
  ],
  skills: [
    "Vue.js 3", "Nuxt 3", "TypeScript", "Tailwind CSS", "Node.js", 
    "AWS Lambda", "DynamoDB", "Pinia", "Git & CI/CD", "Docker"
  ],
  sectores: ["Tecnología", "Desarrollo de Software", "Cloud Computing"],
  experiencia: [
    {
      empresa: "Soluciones Cloud México",
      puesto: "Lead Frontend Engineer",
      anoInicio: "2023",
      anoFin: "Presente",
      actualmente: true,
      descripcion: "Liderazgo de equipo frontend en la migración a Nuxt 3 y Tailwind CSS, reduciendo tiempos de carga en un 42% y mejorando la tasa de conversión en un 18%."
    },
    {
      empresa: "Digital Dynamics Toluca",
      puesto: "Full Stack Developer",
      anoInicio: "2021",
      anoFin: "2023",
      actualmente: false,
      descripcion: "Desarrollo de módulos de facturación electrónica y portales de autogestión de usuarios utilizando Vue 2/3, Express.js y bases de datos relacionales y NoSQL."
    },
    {
      empresa: "Innovación Tecnológica UAEM",
      puesto: "Desarrollador Web Junior",
      anoInicio: "2019",
      anoFin: "2021",
      actualmente: false,
      descripcion: "Diseño y mantenimiento de sistemas escolares universitarios y APIs RESTful."
    }
  ],
  educacion: [
    {
      institucion: "Universidad Autónoma del Estado de México (UAEMéx)",
      titulo: "Licenciatura en Ingeniería en Computación",
      campoEstudio: "Ciencias de la Computación",
      anoInicio: "2016",
      anoFin: "2021",
      actualmente: false,
      descripcion: "Graduado con mención por proyecto de desarrollo de software distribuido."
    }
  ],
  links: [
    { label: "GitHub", url: "https://github.com/francisco-gomez" },
    { label: "LinkedIn", url: "https://linkedin.com/in/francisco-gomez-dev" },
    { label: "Portafolio Web", url: "https://franciscogomez.dev" }
  ],
  enlacesWeb: {
    github: "https://github.com/francisco-gomez",
    linkedin: "https://linkedin.com/in/francisco-gomez-dev",
    portfolio: "https://franciscogomez.dev"
  },
  cvUrl: "/sample-cv-francisco-gomez.pdf",
  cvFileName: "CV_Francisco_Gomez_FullStack_2026.pdf"
};

export const MOCK_CANDIDATES: CandidateProfile[] = [
  MOCK_CANDIDATE_DEMO,
  {
    id: "candidate-mariana-dominguez",
    userId: "user-mariana-dominguez",
    nombre: "Mariana Domínguez",
    name: "Mariana Domínguez",
    email: "mariana.dominguez@gmail.com",
    telefono: "+52 55 1234 9876",
    titularProfesional: "Desarrolladora Frontend Vue & UI Specialist",
    bio: "Enfocada en diseño de interfaces accesibles, componentes reutilizables y sistemas de diseño con Figma y Tailwind.",
    ubicacion: "Metepec, Estado de México",
    habilidades: ["Vue.js", "JavaScript", "HTML/CSS", "Figma", "Tailwind CSS"],
    skills: ["Vue.js", "JavaScript", "HTML/CSS", "Figma", "Tailwind CSS"],
    cvUrl: "/sample-cv-mariana.pdf"
  },
  {
    id: "candidate-carlos-ramirez",
    userId: "user-carlos-ramirez",
    nombre: "Carlos Ramírez Soto",
    name: "Carlos Ramírez Soto",
    email: "carlos.ramirez@gmail.com",
    telefono: "+52 722 456 7890",
    titularProfesional: "Especialista DevOps & Cloud AWS",
    bio: "Más de 6 años automatizando despliegues CI/CD con Terraform, Serverless Framework y Docker en AWS.",
    ubicacion: "Toluca, Estado de México",
    habilidades: ["AWS", "Docker", "Terraform", "CI/CD", "Node.js", "Linux"],
    skills: ["AWS", "Docker", "Terraform", "CI/CD", "Node.js", "Linux"],
    cvUrl: "/sample-cv-carlos.pdf"
  },
  {
    id: "candidate-sofia-albarran",
    userId: "user-sofia-albarran",
    nombre: "Sofía Albarrán Morales",
    name: "Sofía Albarrán Morales",
    email: "sofia.albarran@design.mx",
    telefono: "+52 55 6789 0123",
    titularProfesional: "Diseñadora de Producto Senior (UI/UX)",
    bio: "Especialista en investigación de usuarios, wireframes de alta fidelidad, prototipado y pruebas de usabilidad.",
    ubicacion: "Naucalpan, Estado de México",
    habilidades: ["UI/UX Design", "Figma", "Design Systems", "User Research", "Prototyping"],
    skills: ["UI/UX Design", "Figma", "Design Systems", "User Research", "Prototyping"]
  }
];

// ============================================================================
// 3. VACANTES Y OFERTAS DE EMPLEO
// ============================================================================
export const MOCK_VACANCIES: Job[] = [
  {
    id: "vac-frontend-sr-01",
    uniqueId: "vac-frontend-sr-01",
    title: "Ingeniero Frontend Senior (Vue 3 / Nuxt / Tailwind)",
    titulo: "Ingeniero Frontend Senior (Vue 3 / Nuxt / Tailwind)",
    company: "TechSolutions México",
    empresaNombre: "TechSolutions México S.A. de C.V.",
    empresaUuid: "org-techsolutions-01",
    companyId: "org-techsolutions-01",
    companyLogo: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80",
    lat: 19.2826,
    lng: -99.6557, // Toluca
    location: "Toluca, Estado de México (Modalidad Híbrida)",
    modalidad: "Híbrido",
    type: "Tiempo Completo",
    salario: 45000,
    salarioMinimo: 38000,
    salarioMaximo: 48000,
    salarioFormatted: "$38,000 - $48,000 MXN",
    salary: "$38,000 - $48,000 MXN mensuales",
    experienciaAnos: 4,
    sector: "Tecnología",
    sectores: ["Tecnología", "Desarrollo Web"],
    vacantesDisponibles: 2,
    estado: "ACTIVO",
    descripcion: `TechSolutions México busca un **Ingeniero Frontend Senior** para liderar la arquitectura cliente de nuestra suite cloud.

### Requisitos Principales:
* Experiencia mínima de 4 años en desarrollo frontend moderno con Vue 3 (Composition API) y Nuxt 3.
* Dominio avanzado de TypeScript, Tailwind CSS y gestión de estado con Pinia.
* Experiencia integrando APIs REST y WebSockets para datos en tiempo real.
* Conocimiento de buenas prácticas de testing (Vitest / Playwright).

### Prestaciones y Beneficios:
* Salario competitivo en nómina 100%.
* Fondo de ahorro (13%) y vales de despensa mensuales ($3,500 MXN).
* Seguro de Gastos Médicos Mayores (SGMM) familiar.
* 20 días de vacaciones desde el primer año.
* Presupuesto anual de $25,000 MXN para certificaciones y cursos.`,
    habilidadesRequeridas: ["Vue 3", "Nuxt 3", "TypeScript", "Tailwind CSS", "Pinia", "AWS"],
    aptitudes: "Liderazgo técnico, proactividad, trabajo en equipo y enfoque a calidad.",
    createdAt: "2026-10-12T14:30:00Z",
    likes: 42,
    likesCount: 42,
    commentsCount: 8,
    sharesCount: 15
  },
  {
    id: "vac-devops-aws-02",
    uniqueId: "vac-devops-aws-02",
    title: "Especialista Cloud AWS & DevOps Platform",
    titulo: "Especialista Cloud AWS & DevOps Platform",
    company: "Innovatech Global",
    empresaNombre: "Innovatech Global Solutions S. de R.L.",
    empresaUuid: "org-innovatech-02",
    companyId: "org-innovatech-02",
    companyLogo: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=150&auto=format&fit=crop&q=80",
    lat: 19.2564,
    lng: -99.6047, // Metepec
    location: "Metepec, Estado de México (100% Remoto Nacional)",
    modalidad: "Remoto",
    type: "Tiempo Completo",
    salario: 52000,
    salarioMinimo: 45000,
    salarioMaximo: 58000,
    salarioFormatted: "$45,000 - $58,000 MXN",
    salary: "$45,000 - $58,000 MXN mensuales",
    experienciaAnos: 5,
    sector: "Tecnología",
    sectores: ["Cloud", "DevOps"],
    vacantesDisponibles: 1,
    estado: "ACTIVO",
    descripcion: `Buscamos un Ingeniero DevOps para implementar pipelines de CI/CD automatizados y optimizar nuestra infraestructura Serverless en Amazon Web Services (AWS).

### Responsabilidades:
* Automatización de infraestructura con Terraform y CloudFormation.
* Configuración de monitoreo con CloudWatch, Datadog y trazabilidad distribuida.
* Gestión de clusters Kubernetes (EKS) y arquitecturas basadas en eventos (EventBridge, SQS).`,
    habilidadesRequeridas: ["AWS", "Terraform", "Docker", "Kubernetes", "CI/CD", "Linux"],
    createdAt: "2026-10-10T10:00:00Z",
    likes: 28,
    likesCount: 28,
    commentsCount: 3,
    sharesCount: 9
  },
  {
    id: "vac-ui-ux-designer-03",
    uniqueId: "vac-ui-ux-designer-03",
    title: "Diseñador de Producto Digital (UI / UX)",
    titulo: "Diseñador de Producto Digital (UI / UX)",
    company: "TechSolutions México",
    empresaNombre: "TechSolutions México S.A. de C.V.",
    empresaUuid: "org-techsolutions-01",
    companyId: "org-techsolutions-01",
    companyLogo: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80",
    lat: 19.2826,
    lng: -99.6557,
    location: "Toluca, Estado de México",
    modalidad: "Híbrido",
    type: "Tiempo Completo",
    salario: 34000,
    salarioMinimo: 30000,
    salarioMaximo: 38000,
    salarioFormatted: "$30,000 - $38,000 MXN",
    salary: "$30,000 - $38,000 MXN mensuales",
    experienciaAnos: 3,
    sector: "Diseño y Creatividad",
    sectores: ["Diseño", "UI/UX"],
    vacantesDisponibles: 1,
    estado: "ACTIVO",
    descripcion: `Diseño y optimización de flujos de interacción de usuarios para plataformas web y móviles empresariales.

### Requisitos:
* Portafolio comprobable con casos de estudio y métricas de éxito.
* Dominio absoluto de Figma, diseño con auto-layout y variables.
* Capacidad de colaborar cercanamente con ingenieros frontend.`,
    habilidadesRequeridas: ["Figma", "UI/UX", "Design Systems", "Prototipado", "User Testing"],
    createdAt: "2026-10-09T18:15:00Z",
    likes: 19,
    likesCount: 19,
    commentsCount: 2,
    sharesCount: 4
  },
  {
    id: "vac-qa-automation-04",
    uniqueId: "vac-qa-automation-04",
    title: "Analista QA Automation (Playwright & TypeScript)",
    titulo: "Analista QA Automation (Playwright & TypeScript)",
    company: "Starlight Logistics",
    empresaNombre: "Starlight Logistics Express S.A. de C.V.",
    empresaUuid: "org-starlight-04",
    companyId: "org-starlight-04",
    companyLogo: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=150&auto=format&fit=crop&q=80",
    lat: 19.2905,
    lng: -99.5115, // Lerma
    location: "Parque Industrial Lerma, Estado de México",
    modalidad: "Presencial",
    type: "Tiempo Completo",
    salario: 32000,
    salarioMinimo: 28000,
    salarioMaximo: 35000,
    salarioFormatted: "$28,000 - $35,000 MXN",
    salary: "$28,000 - $35,000 MXN mensuales",
    experienciaAnos: 3,
    sector: "Logística y TI",
    sectores: ["Calidad de Software", "Testing"],
    vacantesDisponibles: 1,
    estado: "ACTIVO",
    descripcion: `Responsable de crear y mantener suites de pruebas end-to-end automatizadas para nuestra plataforma de seguimiento logístico.`,
    habilidadesRequeridas: ["Playwright", "TypeScript", "Jest", "CI/CD", "API Testing"],
    createdAt: "2026-10-11T09:20:00Z",
    likes: 14,
    likesCount: 14,
    commentsCount: 1,
    sharesCount: 3
  },
  {
    id: "vac-backend-go-05",
    uniqueId: "vac-backend-go-05",
    title: "Desarrollador Backend Senior (Go / Microservicios)",
    titulo: "Desarrollador Backend Senior (Go / Microservicios)",
    company: "NexGen Retail",
    empresaNombre: "NexGen Retail Cloud S.A.P.I. de C.V.",
    empresaUuid: "org-nexgen-06",
    companyId: "org-nexgen-06",
    companyLogo: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=150&auto=format&fit=crop&q=80",
    lat: 19.4785,
    lng: -99.2396, // Naucalpan
    location: "Naucalpan de Juárez, Estado de México",
    modalidad: "Híbrido",
    type: "Tiempo Completo",
    salario: 60000,
    salarioMinimo: 50000,
    salarioMaximo: 65000,
    salarioFormatted: "$50,000 - $65,000 MXN",
    salary: "$50,000 - $65,000 MXN mensuales",
    experienciaAnos: 5,
    sector: "Comercio Electrónico",
    sectores: ["Backend", "Golang"],
    vacantesDisponibles: 2,
    estado: "ACTIVO",
    descripcion: `Desarrollo de servicios de procesamiento transaccional de pagos y sincronización de inventario en tiempo real con Golang y gRPC.`,
    habilidadesRequeridas: ["Golang", "gRPC", "PostgreSQL", "Redis", "Kafka", "Docker"],
    createdAt: "2026-10-13T11:00:00Z",
    likes: 31,
    likesCount: 31,
    commentsCount: 5,
    sharesCount: 11
  }
];

// ============================================================================
// 4. POSTULACIONES Y EVALUACIONES ATS
// ============================================================================
export const MOCK_APPLICANTS: ApplicantCandidate[] = [
  {
    id: "candidate-francisco-gomez",
    name: "Francisco Javier Gómez Hernández",
    email: "francisco.gomez@gmail.com",
    titularProfesional: "Ingeniero Full Stack Senior (Vue 3 / Nuxt / TypeScript)",
    phone: "+52 722 456 7890",
    bio: "Más de 5 años diseñando SPAs de alto impacto con Vue y Nuxt. Gran experiencia en arquitecturas serverless sobre AWS.",
    skills: ["Vue 3", "Nuxt 3", "TypeScript", "Tailwind CSS", "AWS Lambda", "DynamoDB"],
    experience: [
      {
        empresa: "Soluciones Cloud México",
        puesto: "Lead Frontend Engineer",
        anoInicio: "2023",
        anoFin: "Presente",
        actualmente: true,
        descripcion: "Migración a Nuxt 3 y reducción de tiempos de carga."
      }
    ],
    education: [
      {
        institucion: "Universidad Autónoma del Estado de México (UAEMéx)",
        titulo: "Ingeniería en Computación",
        anoInicio: "2016",
        anoFin: "2021"
      }
    ],
    job: "Ingeniero Frontend Senior (Vue 3 / Nuxt / Tailwind)",
    jobId: "vac-frontend-sr-01",
    status: "EN_CONTACTO",
    matchScore: 94,
    coverLetter: "Estimado equipo de TechSolutions: Cuento con más de 5 años desarrollando aplicaciones empresariales de gran escala con Vue 3 y Nuxt. Mi experiencia liderando la arquitectura de componentes y optimizaciones de rendimiento me permitirá aportar valor inmediato a su plataforma cloud.",
    time: "12/10/2026",
    cvUrl: "/sample-cv-francisco-gomez.pdf"
  },
  {
    id: "candidate-carlos-ramirez",
    name: "Carlos Ramírez Soto",
    email: "carlos.ramirez@gmail.com",
    titularProfesional: "DevOps & Cloud Architect",
    phone: "+52 722 456 7890",
    bio: "Especialista en infraestructura como código y automatización continua.",
    skills: ["AWS", "Docker", "Terraform", "CI/CD", "Linux"],
    job: "Especialista Cloud AWS & DevOps Platform",
    jobId: "vac-devops-aws-02",
    status: "SELECCIONADO",
    matchScore: 91,
    coverLetter: "Hola, me interesa participar en la expansión de su infraestructura en la nube. Cuento con 4 certificaciones oficiales de AWS y amplia experiencia con Terraform.",
    time: "10/10/2026",
    cvUrl: "/sample-cv-carlos.pdf"
  },
  {
    id: "candidate-mariana-dominguez",
    name: "Mariana Domínguez",
    email: "mariana.dominguez@gmail.com",
    titularProfesional: "Frontend Developer & UI Specialist",
    phone: "+52 55 1234 9876",
    bio: "Diseñadora y desarrolladora de interfaces atractivas y accesibles.",
    skills: ["Vue.js", "JavaScript", "HTML/CSS", "Figma", "Tailwind CSS"],
    job: "Ingeniero Frontend Senior (Vue 3 / Nuxt / Tailwind)",
    jobId: "vac-frontend-sr-01",
    status: "PENDIENTE",
    matchScore: 82,
    coverLetter: "Hola equipo, me apasiona el ecosistema Vue y el diseño con Tailwind. Me encantaría formar parte de su equipo y contribuir a las nuevas funcionalidades.",
    time: "11/10/2026",
    cvUrl: "/sample-cv-mariana.pdf"
  },
  {
    id: "candidate-sofia-albarran",
    name: "Sofía Albarrán Morales",
    email: "sofia.albarran@design.mx",
    titularProfesional: "Product Designer UI/UX",
    phone: "+52 55 6789 0123",
    bio: "Enfocada en diseño centrado en el usuario y sistemas de diseño escalables.",
    skills: ["UI/UX Design", "Figma", "Design Systems", "User Research"],
    job: "Diseñador de Producto Digital (UI / UX)",
    jobId: "vac-ui-ux-designer-03",
    status: "CONTRATADO",
    matchScore: 96,
    coverLetter: "Comparto mi portafolio con casos de estudio en fintech y SaaS B2B.",
    time: "08/10/2026"
  }
];

// ============================================================================
// 5. PUBLICACIONES DEL FEED (COMUNIDAD)
// ============================================================================
export const MOCK_POSTS: Post[] = [
  {
    id: "post-techsolutions-hiring",
    uniqueId: "post-techsolutions-hiring",
    title: "¡Buscamos talento Frontend en Toluca y Metepec!",
    content: "¡Nueva vacante abierta en TechSolutions México! Buscamos un **Ingeniero Frontend Senior (Vue 3 / Nuxt / Tailwind)** para sumarse a nuestro equipo en modalidad híbrida o remota nacional. Ofrecemos prestaciones superiores y excelente ambiente de trabajo. ¡Postúlate hoy mismo!",
    author: "TechSolutions México",
    authorId: "org-techsolutions-01",
    authorAvatar: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80",
    fotoPerfil: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80",
    tipoAutor: "EMPRESA",
    createdAt: "2026-10-13T16:20:00Z",
    timeAgo: "Hace 2 horas",
    likes: 38,
    likesCount: 38,
    commentsCount: 6,
    sharesCount: 12,
    hasJobLinked: true,
    jobId: "vac-frontend-sr-01",
    jobTitle: "Ingeniero Frontend Senior (Vue 3 / Nuxt / Tailwind)",
    jobSalary: "$38,000 - $48,000 MXN mensuales",
    comments: [
      {
        commentId: "c-1",
        author: "Francisco Gómez",
        authorId: "candidate-francisco-gomez",
        content: "¡Excelente oportunidad! Acabo de enviar mi postulación y CV adjunto. Saludos.",
        createdAt: "2026-10-13T16:45:00Z"
      },
      {
        commentId: "c-2",
        author: "Mariana Domínguez",
        authorId: "candidate-mariana-dominguez",
        content: "¿La modalidad remota está disponible para otros estados de la República?",
        createdAt: "2026-10-13T17:10:00Z"
      }
    ]
  },
  {
    id: "post-community-tips",
    uniqueId: "post-community-tips",
    title: "5 Consejos para optimizar tu perfil técnico en JobNet",
    content: `¿Sabías que un perfil con certificaciones verificadas y portafolio interactivo tiene un **85% más de contacto** por parte de reclutadores?

1. Mantén tus habilidades técnicas acotadas a tu especialidad principal.
2. Agrega enlaces a repositorios reales en GitHub con código limpio.
3. Redacta logros cuantitativos en tus puestos previos (ej. "reducción de latencia en 30%").
4. Genera tu CV con nuestra herramienta integrada para pasar filtros ATS.`,
    author: "Comunidad JobNet",
    authorId: "jobnet-official",
    authorAvatar: "/logotipo.svg",
    tipoAutor: "ADMIN",
    createdAt: "2026-10-12T11:00:00Z",
    timeAgo: "Ayer",
    likes: 85,
    likesCount: 85,
    commentsCount: 14,
    sharesCount: 29
  }
];

// ============================================================================
// 6. CHATS Y MENSAJERÍA
// ============================================================================
export const MOCK_CHATS: ChatConversation[] = [
  {
    id: "chat-techsolutions-francisco",
    jobId: "vac-frontend-sr-01",
    candidateId: "candidate-francisco-gomez",
    name: "TechSolutions México (Reclutamiento)",
    avatar: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80",
    jobTitle: "Ingeniero Frontend Senior (Vue 3)",
    status: "En línea",
    lastMessage: "Hola Francisco, revisamos tu perfil y carta. Nos gustaría agendar una entrevista técnica...",
    time: "10:45 AM",
    unreadCount: 1
  },
  {
    id: "chat-innovatech-carlos",
    jobId: "vac-devops-aws-02",
    candidateId: "candidate-carlos-ramirez",
    name: "Innovatech Global Talent",
    avatar: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=150&auto=format&fit=crop&q=80",
    jobTitle: "Especialista Cloud AWS & DevOps",
    status: "Desconectado",
    lastMessage: "Muchas gracias por compartir tus certificaciones de AWS. En breve te contactamos.",
    time: "Ayer",
    unreadCount: 0
  }
];

export const MOCK_MESSAGES_TECHSOLUTIONS: ChatMessage[] = [
  {
    id: "m-1",
    senderId: "org-techsolutions-01",
    senderName: "Lic. Roberto Gómez (Reclutador)",
    senderAvatar: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80",
    text: "Hola Francisco, buenos días. Revisamos tu perfil y experiencia en Nuxt 3. Cumples ampliamente con los requerimientos de la vacante.",
    timestamp: "2026-10-13T10:30:00Z",
    read: true,
    status: "read"
  },
  {
    id: "m-2",
    senderId: "candidate-francisco-gomez",
    senderName: "Francisco Gómez",
    text: "Muchas gracias Roberto. Me interesa mucho la propuesta y los retos de arquitectura cloud que tienen.",
    timestamp: "2026-10-13T10:35:00Z",
    read: true,
    status: "read"
  },
  {
    id: "m-3",
    senderId: "org-techsolutions-01",
    senderName: "Lic. Roberto Gómez (Reclutador)",
    text: "Excelente. ¿Tendrías disponibilidad para una videollamada técnica este jueves a las 11:00 AM vía Google Meet?",
    timestamp: "2026-10-13T10:45:00Z",
    read: false,
    status: "delivered"
  }
];

// ============================================================================
// 7. NOTIFICACIONES
// ============================================================================
export const MOCK_NOTIFICATIONS = [
  {
    id: "notif-1",
    type: "APPLICATION_STAGE_CHANGED",
    title: "¡Avance en tu postulación!",
    message: "TechSolutions México actualizó tu postulación a: 'En Contacto / Entrevista'.",
    link: "/candidate/my-applications",
    icon: "handshake",
    read: false,
    createdAt: "2026-10-13T10:46:00Z",
    timeAgo: "Hace 15 minutos"
  },
  {
    id: "notif-2",
    type: "NEW_MESSAGE",
    title: "Nuevo mensaje de reclutador",
    message: "Lic. Roberto Gómez te ha enviado una invitación a entrevista por el chat privado.",
    link: "/messages",
    icon: "chat",
    read: false,
    createdAt: "2026-10-13T10:45:00Z",
    timeAgo: "Hace 20 minutos"
  },
  {
    id: "notif-3",
    type: "JOB_RECOMMENDED",
    title: "Nueva vacante afín a tu perfil",
    message: "Innovatech Global publicó 'Especialista Cloud AWS' con 91% de afinidad según tus skills.",
    link: "/jobs/vac-devops-aws-02",
    icon: "work",
    read: true,
    createdAt: "2026-10-10T11:00:00Z",
    timeAgo: "Hace 3 días"
  }
];

// ============================================================================
// 8. INCIDENCIAS Y MODERACIÓN
// ============================================================================
export const MOCK_INCIDENTS: Incident[] = [
  {
    id: "inc-001",
    targetType: "VACANTE",
    targetId: "vac-frontend-sr-01",
    targetTitle: "Capturista de Datos desde Casa ($15,000 Semanales)",
    jobTitle: "Capturista de Datos desde Casa ($15,000 Semanales)",
    jobId: "vac-frontend-sr-01",
    companyId: "org-scam-01",
    companyName: "FastHiring Express S.A.S.",
    candidateId: "cand-carlos-12",
    candidateName: "Carlos Gómez",
    reporterId: "user-candidato-report",
    reporterEmail: "candidato.alerta@gmail.com",
    reporter: "candidato.alerta@gmail.com",
    reason: "La empresa solicita en el canal privado un depósito previo de $1,850 MXN por seguro de equipo de cómputo. Presunta estafa laboral.",
    infraccion: "FRAUDE",
    severity: "ALTA",
    severidad: "ALTA",
    status: "PENDIENTE",
    estatus: "PENDIENTE",
    auditState: "NOT_AUDITED",
    createdAt: "2026-10-13T09:15:00Z",
    fechaCreacion: "2026-10-13T09:15:00Z"
  },
  {
    id: "inc-002",
    targetType: "POST",
    targetId: "post-spam-01",
    targetTitle: "Venta de diplomas y certificados express",
    postId: "post-techsolutions-hiring",
    reporterId: "user-moderador-audit",
    reporterEmail: "alguienn340@gmail.com",
    reporter: "alguienn340@gmail.com",
    reason: "Publicación comercial de servicios ilegales en el muro comunitario.",
    infraccion: "SPAM",
    severity: "MEDIA",
    severidad: "MEDIA",
    status: "INVESTIGANDO",
    estatus: "INVESTIGANDO",
    createdAt: "2026-10-12T18:00:00Z",
    fechaCreacion: "2026-10-12T18:00:00Z"
  },
  {
    id: "inc-003",
    targetType: "VACANTE",
    targetId: "vac-frontend-sr-01",
    targetTitle: "Frontend Senior (Vue 3 / TypeScript)",
    jobTitle: "Frontend Senior (Vue 3 / TypeScript)",
    jobId: "vac-frontend-sr-01",
    companyId: "org-recruiter-99",
    companyName: "Tech Corp Latam",
    candidateId: "cand-maria-77",
    candidateName: "María Fernández",
    reporterId: "cand-maria-77",
    reporterEmail: "maria.fernandez@devmail.com",
    reporter: "maria.fernandez@devmail.com",
    reason: "Discrepancia salarial flagrante: La oferta anunciaba $45,000 MXN mensuales y en la mensajería privada el reclutador exigió aceptar $18,000 brutos sin prestaciones.",
    infraccion: "DISCREPANCIA_SALARIAL",
    severity: "CRITICA",
    severidad: "CRITICA",
    status: "PENDIENTE",
    estatus: "PENDIENTE",
    auditState: "NOT_AUDITED",
    createdAt: "2026-10-13T10:35:00Z",
    fechaCreacion: "2026-10-13T10:35:00Z"
  },
  {
    id: "inc-004",
    targetType: "VACANTE",
    targetId: "vac-ux-lead-02",
    targetTitle: "Diseñadora UI/UX Lead",
    jobTitle: "Diseñadora UI/UX Lead",
    jobId: "vac-ux-lead-02",
    companyId: "org-inapropiado-22",
    companyName: "Agencia Creativa Vanguardia",
    candidateId: "cand-ana-33",
    candidateName: "Ana Sofía R.",
    reporterId: "cand-ana-33",
    reporterEmail: "ana.sofia.ux@gmail.com",
    reporter: "ana.sofia.ux@gmail.com",
    reason: "Acoso en postulación: Durante el proceso de entrevista en el chat, el reclutador solicitó fotografías personales y realizó comentarios inapropiados fuera de lugar.",
    infraccion: "ACOSO",
    severity: "CRITICA",
    severidad: "CRITICA",
    status: "PENDIENTE",
    estatus: "PENDIENTE",
    auditState: "NOT_AUDITED",
    createdAt: "2026-10-13T11:20:00Z",
    fechaCreacion: "2026-10-13T11:20:00Z"
  }
];

// ============================================================================
// 9. VERIFICACIONES SAT KYC (MODERADOR)
// ============================================================================
export const MOCK_VERIFICATIONS = [
  {
    id: "verif-ctm-01",
    companyId: "org-metropolitana-05",
    companyName: "Consultoría & Tecnología Metropolitana S.A.S.",
    razonSocial: "Consultoría & Tecnología Metropolitana S.A.S.",
    rfc: "CTM210908KL3",
    representanteLegal: "Mtro. Fernando Vega Salinas",
    email: "administracion@ctmconsultoria.com.mx",
    telefono: "+52 722 334 1122",
    fechaSolicitud: "2026-10-12",
    status: "PENDIENTE",
    documentoPdf: {
      nombre: "Constancia_Situacion_Fiscal_SAT_CTM_2026.pdf",
      url: "/docs/sample-sat-constancia.pdf",
      tamano: "485 KB",
      validoSat: true
    }
  }
];

// ============================================================================
// 10. APELACIONES Y DISPUTAS (MODERADOR)
// ============================================================================
export const MOCK_APPEALS: Appeal[] = [
  {
    id: "appeal-translog-01",
    companyId: "org-starlight-04",
    companyName: "Starlight Logistics Express",
    incidentId: "inc-suspension-starlight",
    motivo: "Suspensión temporal por reporte erróneo de duplicidad de vacante",
    descripcion: "Nuestra vacante de Analista QA fue reportada erróneamente como duplicada, sin embargo se trata de dos posiciones distintas para dos plantas (Toluca y Lerma). Adjuntamos los códigos de centro de costos autorizados.",
    estado: "PENDIENTE",
    createdAt: "2026-10-11T12:00:00Z",
    evidenciaUrl: "/docs/centro_costos_autorizado.pdf",
    messages: [
      {
        id: "app-msg-1",
        senderId: "org-starlight-04",
        senderRole: "ORGANIZACION",
        text: "Estimados moderadores: Solicitamos la revisión de la suspensión temporal. Hemos adjuntado la justificación de ambos puestos.",
        timestamp: "2026-10-11T12:05:00Z"
      },
      {
        id: "app-msg-2",
        senderId: "mod-official",
        senderRole: "MODERADOR",
        text: "Buen día. Estamos cotejando la información proporcionada con el departamento de auditoría corporativa. Le notificaremos en un lapso de 24 horas.",
        timestamp: "2026-10-11T14:30:00Z"
      }
    ]
  }
];

// ============================================================================
// 11. CATÁLOGO MAESTRO (ADMIN)
// ============================================================================
export const MOCK_CATALOG = {
  skills: [
    { id: "sk-vue", name: "Vue.js", category: "Frontend", vacanciesCount: 8 },
    { id: "sk-nuxt", name: "Nuxt 3", category: "Frontend", vacanciesCount: 6 },
    { id: "sk-ts", name: "TypeScript", category: "Lenguajes", vacanciesCount: 12 },
    { id: "sk-tailwind", name: "Tailwind CSS", category: "Frontend", vacanciesCount: 10 },
    { id: "sk-node", name: "Node.js", category: "Backend", vacanciesCount: 9 },
    { id: "sk-aws", name: "AWS Cloud", category: "DevOps & Cloud", vacanciesCount: 7 },
    { id: "sk-docker", name: "Docker", category: "DevOps & Cloud", vacanciesCount: 5 },
    { id: "sk-go", name: "Golang", category: "Backend", vacanciesCount: 3 },
    { id: "sk-figma", name: "Figma", category: "Diseño UI/UX", vacanciesCount: 4 }
  ],
  categories: [
    { id: "cat-dev", name: "Desarrollo de Software", vacanciesCount: 15 },
    { id: "cat-cloud", name: "Cloud & DevOps", vacanciesCount: 7 },
    { id: "cat-design", name: "Diseño UI/UX", vacanciesCount: 4 },
    { id: "cat-qa", name: "Calidad de Software (QA)", vacanciesCount: 3 },
    { id: "cat-logistics", name: "Logística y Operaciones", vacanciesCount: 2 }
  ],
  locations: [
    { id: "loc-toluca", name: "Toluca", state: "Estado de México", vacanciesCount: 6 },
    { id: "loc-metepec", name: "Metepec", state: "Estado de México", vacanciesCount: 4 },
    { id: "loc-lerma", name: "Lerma", state: "Estado de México", vacanciesCount: 2 },
    { id: "loc-naucalpan", name: "Naucalpan de Juárez", state: "Estado de México", vacanciesCount: 3 },
    { id: "loc-remoto", name: "Remoto Nacional", state: "México", vacanciesCount: 8 }
  ]
};

export const MOCK_CATALOG_ITEMS = [
  { id: "sk-1", name: "Vue.js / Nuxt 3", category: "Habilidad" as const, createdAt: "2026-09-01T10:00:00Z" },
  { id: "sk-2", name: "TypeScript", category: "Habilidad" as const, createdAt: "2026-09-01T10:00:00Z" },
  { id: "sk-3", name: "Tailwind CSS", category: "Habilidad" as const, createdAt: "2026-09-02T11:00:00Z" },
  { id: "sk-4", name: "Node.js & Express", category: "Habilidad" as const, createdAt: "2026-09-02T12:00:00Z" },
  { id: "sk-5", name: "AWS Cloud (Lambda, DynamoDB)", category: "Habilidad" as const, createdAt: "2026-09-03T10:00:00Z" },
  { id: "sk-6", name: "Docker & Kubernetes", category: "Habilidad" as const, createdAt: "2026-09-04T09:00:00Z" },
  { id: "sk-7", name: "Go (Golang)", category: "Habilidad" as const, createdAt: "2026-09-05T08:00:00Z" },
  { id: "sk-8", name: "Figma & UI Design", category: "Habilidad" as const, createdAt: "2026-09-05T14:00:00Z" },
  { id: "sk-9", name: "Playwright & QA Automation", category: "Habilidad" as const, createdAt: "2026-09-06T15:00:00Z" },
  { id: "sec-1", name: "Tecnología y Desarrollo de Software", category: "Sector" as const, createdAt: "2026-09-01T10:00:00Z" },
  { id: "sec-2", name: "Cloud Computing y DevOps", category: "Sector" as const, createdAt: "2026-09-01T10:00:00Z" },
  { id: "sec-3", name: "Diseño Digital y UX/UI", category: "Sector" as const, createdAt: "2026-09-02T10:00:00Z" },
  { id: "sec-4", name: "Logística y Cadena de Suministro", category: "Sector" as const, createdAt: "2026-09-02T10:00:00Z" },
  { id: "sec-5", name: "Consultoría y Servicios TI", category: "Sector" as const, createdAt: "2026-09-03T10:00:00Z" },
  { id: "sec-6", name: "Energía y Sostenibilidad", category: "Sector" as const, createdAt: "2026-09-04T10:00:00Z" }
];

