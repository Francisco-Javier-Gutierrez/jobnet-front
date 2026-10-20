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
// 1. EMPRESAS Y ORGANIZACIONES REGISTRADAS (DATOS MOCK / DEMO)
// ============================================================================
export const MOCK_COMPANIES: CompanyProfile[] = [
  {
    id: "org-techsolutions-01",
    companyId: "org-techsolutions-01",
    userId: "user-empresa-techsolutions",
    nombre: "[MOCK] Acme Corporation S.A. de C.V.",
    nombreComercial: "[MOCK] Acme Corp",
    razonSocial: "[MOCK] Acme Corporation S.A. de C.V.",
    rfc: "XAXX010101000",
    email: "contacto@mock-acmeweb.test",
    telefono: "+52 (000) 123-4567",
    sitioWeb: "https://mock.acme-corp.test",
    descripcion: "[DEMO MOCK] Empresa ficticia de desarrollo de software y servicios cloud para testing y validación de plataforma JobNet.",
    biografia: "[MOCK DATA] Organización de demostración creada para validar el flujo completo de reclutamiento ATS, publicaciones y perfiles corporativos.",
    logoUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80",
    fotoPerfil: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80",
    bannerUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&auto=format&fit=crop&q=80",
    ubicacion: "Toluca, Edo. Méx. (Zona Mock/Demo)",
    sector: "Tecnología y Software [MOCK]",
    tamanoEmpresa: "51-200 empleados [MOCK]",
    organizacionVerificada: true,
    estatusVerificacion: "VERIFICADA",
    estatus: "ACTIVO",
    estadoCuenta: "ACTIVO",
    vacantesActivas: 3,
    documentosVerificacion: [
      {
        nombre: "Constancia_Situacion_Fiscal_SAT_Mock.pdf",
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
    nombre: "[MOCK] Globex Technologies S. de R.L.",
    nombreComercial: "[MOCK] Globex Tech",
    razonSocial: "[MOCK] Globex Technologies S. de R.L.",
    rfc: "MOCK200101XYZ",
    email: "talento@mock-globex.test",
    telefono: "+52 (000) 234-5678",
    sitioWeb: "https://mock.globex.test",
    descripcion: "[DEMO MOCK] Organización de prueba para validación de algoritmos de matching de candidatos y vacantes inteligentes.",
    biografia: "[MOCK DATA] Entidad simulada para pruebas de reclutamiento e inteligencia artificial aplicada en entorno de pruebas.",
    logoUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=150&auto=format&fit=crop&q=80",
    fotoPerfil: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=150&auto=format&fit=crop&q=80",
    bannerUrl: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1200&auto=format&fit=crop&q=80",
    ubicacion: "Metepec, Edo. Méx. (Entorno Pruebas)",
    sector: "Inteligencia Artificial y Cloud [MOCK]",
    tamanoEmpresa: "201-500 empleados [MOCK]",
    organizacionVerificada: true,
    estatusVerificacion: "VERIFICADA",
    estatus: "ACTIVO",
    estadoCuenta: "ACTIVO",
    vacantesActivas: 2,
    documentosVerificacion: [
      {
        nombre: "Constancia_SAT_Globex_Mock.pdf",
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
    nombre: "[MOCK] Initech Labs de México S.A.",
    nombreComercial: "[MOCK] Initech Labs",
    razonSocial: "[MOCK] Initech Labs de México S.A.",
    rfc: "TEST180820ABC",
    email: "rh@mock-initech.test",
    telefono: "+52 (000) 345-6789",
    sitioWeb: "https://mock.initech.test",
    descripcion: "[DEMO MOCK] Corporativo simulado de biotecnología aplicada y desarrollo biomédico para pruebas de sistema.",
    logoUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=150&auto=format&fit=crop&q=80",
    fotoPerfil: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=150&auto=format&fit=crop&q=80",
    ubicacion: "Lerma, Edo. Méx. (Zona Demo)",
    sector: "Biotecnología y Salud [MOCK]",
    tamanoEmpresa: "500+ empleados [MOCK]",
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
    nombre: "[MOCK] Umbrella Logistics Express S.A.",
    nombreComercial: "[MOCK] Umbrella Logistics",
    razonSocial: "[MOCK] Umbrella Logistics Express S.A.",
    rfc: "MOCK170510LOG",
    email: "empleos@mock-umbrella.test",
    telefono: "+52 (000) 456-7890",
    sitioWeb: "https://mock.umbrella-logistics.test",
    descripcion: "[DEMO MOCK] Operador logístico ficticio multimodal enfocado en automatización y trazabilidad para testing.",
    logoUrl: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=150&auto=format&fit=crop&q=80",
    fotoPerfil: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=150&auto=format&fit=crop&q=80",
    ubicacion: "Naucalpan, Edo. Méx. (Zona Mock)",
    sector: "Logística y Cadena de Suministro [MOCK]",
    tamanoEmpresa: "201-500 empleados [MOCK]",
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
    nombre: "[MOCK] Wayne Consultores TI S.A.S.",
    nombreComercial: "[MOCK] Wayne Ind.",
    razonSocial: "[MOCK] Wayne Consultores TI S.A.S.",
    rfc: "DEMO210908KL3",
    email: "verificacion@mock-wayne.test",
    telefono: "+52 (000) 567-8901",
    sitioWeb: "https://mock.wayne-ind.test",
    descripcion: "[DEMO MOCK] Organización simulada en proceso de validación KYC para verificar bandeja de moderación.",
    logoUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=150&auto=format&fit=crop&q=80",
    fotoPerfil: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=150&auto=format&fit=crop&q=80",
    ubicacion: "Metepec, Edo. Méx. (Pruebas)",
    sector: "Consultoría y Auditoría TI [MOCK]",
    tamanoEmpresa: "11-50 empleados [MOCK]",
    organizacionVerificada: false,
    estatusVerificacion: "PENDIENTE",
    estatus: "REVISION",
    estadoCuenta: "REVISION",
    vacantesActivas: 1,
    documentosVerificacion: [
      {
        nombre: "Constancia_SAT_Demo_Wayne_2026.pdf",
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
    nombre: "[MOCK] Cyberdyne Retail Cloud S.A.",
    nombreComercial: "[MOCK] Cyberdyne Tech",
    razonSocial: "[MOCK] Cyberdyne Retail Cloud S.A.",
    rfc: "MOCK220314HY7",
    email: "jobs@mock-cyberdyne.test",
    telefono: "+52 (000) 678-9012",
    sitioWeb: "https://mock.cyberdyne.test",
    descripcion: "[DEMO MOCK] Plataforma SaaS simulada para pruebas de pasarelas de pago y arquitectura en la nube.",
    logoUrl: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=150&auto=format&fit=crop&q=80",
    fotoPerfil: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=150&auto=format&fit=crop&q=80",
    ubicacion: "Tlalnepantla, Edo. Méx. (Mock Env)",
    sector: "E-Commerce & SaaS [MOCK]",
    tamanoEmpresa: "51-200 empleados [MOCK]",
    organizacionVerificada: true,
    estatusVerificacion: "VERIFICADA",
    estatus: "ACTIVO",
    estadoCuenta: "ACTIVO",
    vacantesActivas: 1
  }
];

// ============================================================================
// 2. CANDIDATOS Y PERFILES (DATOS MOCK / DEMO)
// ============================================================================
export const MOCK_CANDIDATE_DEMO: CandidateProfile = {
  id: "candidate-francisco-gomez",
  userId: "user-francisco-gomez",
  nombre: "[DEMO] Juan Pérez (Candidato Mock)",
  name: "[DEMO] Juan Pérez",
  email: "juan.perez.mock@jobnet-demo.test",
  telefono: "+52 (000) 987-6543",
  phone: "+52 (000) 987-6543",
  fotoPerfil: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
  avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
  titularProfesional: "[MOCK] Desarrollador Full Stack Senior (Vue 3 / TypeScript / Nuxt)",
  biografia: "[PERFIL DE PRUEBA] Especialista simulado en desarrollo web de alto rendimiento, microservicios y testing automatizado en la nube para JobNet.",
  bio: "[PERFIL DE PRUEBA] Perfil simulado para pruebas de plataforma JobNet. Experiencia ficticia en desarrollo web, arquitecturas modernas y validación de componentes.",
  descripcion: "[MOCK DATA] Especialista en desarrollo frontend y cloud nativo. Datos ficticios generados exclusivamente para testing y validación de interfaz de usuario.",
  ubicacion: "Toluca, Edo. Méx. (Zona Demo)",
  habilidades: [
    "Vue.js 3 [MOCK]", "Nuxt 3 [MOCK]", "TypeScript", "Tailwind CSS", "Node.js", 
    "AWS Cloud", "Pinia", "Docker [MOCK]", "Git & CI/CD"
  ],
  skills: [
    "Vue.js 3 [MOCK]", "Nuxt 3 [MOCK]", "TypeScript", "Tailwind CSS", "Node.js", 
    "AWS Cloud", "Pinia", "Docker [MOCK]", "Git & CI/CD"
  ],
  sectores: ["Tecnología [MOCK]", "Desarrollo Web [MOCK]", "Cloud Computing [MOCK]"],
  experiencia: [
    {
      empresa: "[MOCK] Acme Corp",
      puesto: "[MOCK] Líder Frontend (Pruebas)",
      anoInicio: "2023",
      anoFin: "Presente",
      actualmente: true,
      descripcion: "[DATOS DE PRUEBA] Liderazgo técnico de frontend simulado, optimizaciones de interfaz y componentes UI en Nuxt 3."
    },
    {
      empresa: "[MOCK] Consultora Ejemplo S.A.",
      puesto: "[MOCK] Desarrollador Web Jr.",
      anoInicio: "2020",
      anoFin: "2023",
      actualmente: false,
      descripcion: "[DATOS DE PRUEBA] Desarrollo de componentes web reutilizables y pruebas de integración."
    }
  ],
  educacion: [
    {
      institucion: "[DEMO] Universidad Tecnológica Simulada",
      titulo: "Licenciatura en Sistemas Computacionales (Mock)",
      campoEstudio: "Ingeniería de Software",
      anoInicio: "2016",
      anoFin: "2021",
      actualmente: false,
      descripcion: "[MOCK DATA] Titulación simulada con mención en desarrollo distribuido."
    }
  ],
  links: [
    { label: "GitHub [MOCK]", url: "https://github.com/mock-user-demo" },
    { label: "LinkedIn [MOCK]", url: "https://linkedin.com/in/mock-user-demo" },
    { label: "Portafolio [DEMO]", url: "https://mock-portfolio.test" }
  ],
  enlacesWeb: {
    github: "https://github.com/mock-user-demo",
    linkedin: "https://linkedin.com/in/mock-user-demo",
    portfolio: "https://mock-portfolio.test"
  },
  cvUrl: "/sample-cv-mock-demo.pdf",
  cvFileName: "CV_Mock_Juan_Perez_Demo.pdf"
};

export const MOCK_CANDIDATES: CandidateProfile[] = [
  MOCK_CANDIDATE_DEMO,
  {
    id: "candidate-mariana-dominguez",
    userId: "user-mariana-dominguez",
    nombre: "[DEMO] Jane Doe (Diseñadora UI/UX Mock)",
    name: "[DEMO] Jane Doe",
    email: "jane.doe.mock@jobnet-demo.test",
    telefono: "+52 (000) 876-5432",
    titularProfesional: "[MOCK] Diseñadora UI/UX & Sistemas de Diseño",
    bio: "[MOCK DATA] Diseñadora de interfaces y experiencia de usuario para prototipado y validación de componentes.",
    ubicacion: "Metepec, Edo. Méx. (Entorno Pruebas)",
    habilidades: ["Figma [MOCK]", "UI/UX", "Design Systems", "HTML/CSS", "Tailwind CSS"],
    skills: ["Figma [MOCK]", "UI/UX", "Design Systems", "HTML/CSS", "Tailwind CSS"],
    cvUrl: "/sample-cv-jane-doe-mock.pdf"
  },
  {
    id: "candidate-carlos-ramirez",
    userId: "user-carlos-ramirez",
    nombre: "[DEMO] Carlos Test (DevOps Cloud Mock)",
    name: "[DEMO] Carlos Test",
    email: "carlos.test.mock@jobnet-demo.test",
    telefono: "+52 (000) 765-4321",
    titularProfesional: "[MOCK] Especialista DevOps & AWS (Pruebas)",
    bio: "[MOCK DATA] Automatización de pipelines y configuración de infraestructura simulada.",
    ubicacion: "Toluca, Edo. Méx. (Zona Demo)",
    habilidades: ["AWS Cloud", "Docker [MOCK]", "Terraform [MOCK]", "CI/CD", "Linux"],
    skills: ["AWS Cloud", "Docker [MOCK]", "Terraform [MOCK]", "CI/CD", "Linux"],
    cvUrl: "/sample-cv-carlos-test-mock.pdf"
  },
  {
    id: "candidate-sofia-albarran",
    userId: "user-sofia-albarran",
    nombre: "[DEMO] Sofía Mock (Product Designer)",
    name: "[DEMO] Sofía Mock",
    email: "sofia.mock@jobnet-demo.test",
    telefono: "+52 (000) 654-3210",
    titularProfesional: "[MOCK] Diseñadora de Producto UI/UX",
    bio: "[MOCK DATA] Especialista en pruebas de usabilidad y wireframing técnico.",
    ubicacion: "Naucalpan, Edo. Méx. (Zona Mock)",
    habilidades: ["UI/UX [MOCK]", "Figma", "User Testing", "Prototipado"],
    skills: ["UI/UX [MOCK]", "Figma", "User Testing", "Prototipado"]
  }
];

// ============================================================================
// 3. VACANTES Y OFERTAS DE EMPLEO (DATOS MOCK / DEMO)
// ============================================================================
export const MOCK_VACANCIES: Job[] = [
  {
    id: "vac-frontend-sr-01",
    uniqueId: "vac-frontend-sr-01",
    title: "[VACANTE DEMO #01] Desarrollador Frontend Sr. (Vue 3 / Nuxt 3)",
    titulo: "[VACANTE DEMO #01] Desarrollador Frontend Sr. (Vue 3 / Nuxt 3)",
    company: "[MOCK] Acme Corp",
    empresaNombre: "[MOCK] Acme Corporation S.A. de C.V.",
    empresaUuid: "org-techsolutions-01",
    companyId: "org-techsolutions-01",
    companyLogo: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80",
    lat: 19.2826,
    lng: -99.6557,
    location: "Toluca, Edo. Méx. (Modalidad Demo Híbrida)",
    modalidad: "Híbrido [MOCK]",
    type: "Tiempo Completo [MOCK]",
    salario: 45000,
    salarioMinimo: 40000,
    salarioMaximo: 50000,
    salarioFormatted: "$40,000 - $50,000 MXN (Mock Data)",
    salary: "$40,000 - $50,000 MXN mensuales (Mock Data)",
    experienciaAnos: 4,
    sector: "Tecnología [MOCK]",
    sectores: ["Tecnología [MOCK]", "Desarrollo Web [MOCK]"],
    vacantesDisponibles: 2,
    estado: "ACTIVO",
    descripcion: `[DATOS DE PRUEBA / MOCK DATA] Esta oferta laboral es una simulación generada exclusivamente con fines de prueba y demostración del sistema JobNet. Todos los requisitos y beneficios son datos ficticios.

### Requisitos Mock de Ejemplo:
* Experiencia simulada en Vue 3 y Nuxt 3 Composition API.
* Dominio de TypeScript y Tailwind CSS para diseño responsivo.
* Integración de endpoints REST y WebSockets simulados.
* Buenas prácticas de componentes y testing con Playwright.

### Beneficios de Demostración:
* Prestaciones simuladas superiores a las de ley.
* Modalidad remota / híbrida en entorno de pruebas.
* Presupuesto de capacitación y certificación de testing.`,
    habilidadesRequeridas: ["Vue 3 [MOCK]", "Nuxt 3 [MOCK]", "TypeScript", "Tailwind CSS", "Pinia", "AWS Cloud"],
    aptitudes: "Proactividad mock, trabajo en equipo simulado y enfoque a calidad.",
    createdAt: "2026-10-12T14:30:00Z",
    likes: 42,
    likesCount: 42,
    commentsCount: 8,
    sharesCount: 15
  },
  {
    id: "vac-devops-aws-02",
    uniqueId: "vac-devops-aws-02",
    title: "[VACANTE DEMO #02] Especialista Cloud DevOps AWS (Mock Position)",
    titulo: "[VACANTE DEMO #02] Especialista Cloud DevOps AWS (Mock Position)",
    company: "[MOCK] Globex Tech",
    empresaNombre: "[MOCK] Globex Technologies S. de R.L.",
    empresaUuid: "org-innovatech-02",
    companyId: "org-innovatech-02",
    companyLogo: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=150&auto=format&fit=crop&q=80",
    lat: 19.2564,
    lng: -99.6047,
    location: "Metepec, Edo. Méx. (100% Remoto Mock)",
    modalidad: "Remoto [MOCK]",
    type: "Tiempo Completo [MOCK]",
    salario: 52000,
    salarioMinimo: 48000,
    salarioMaximo: 58000,
    salarioFormatted: "$48,000 - $58,000 MXN (Mock Data)",
    salary: "$48,000 - $58,000 MXN mensuales (Mock Data)",
    experienciaAnos: 5,
    sector: "Tecnología [MOCK]",
    sectores: ["Cloud [MOCK]", "DevOps [MOCK]"],
    vacantesDisponibles: 1,
    estado: "ACTIVO",
    descripcion: `[DATOS DE PRUEBA / MOCK DATA] Posición simulada de ingeniería de infraestructura en la nube para testing de vacantes remotas en JobNet.

### Responsabilidades Simuladas:
* Automatización de infraestructura con Terraform de prueba.
* Configuración de monitoreo y alertas simuladas.
* Despliegues continuos sobre contenedores en AWS.`,
    habilidadesRequeridas: ["AWS Cloud", "Terraform [MOCK]", "Docker [MOCK]", "Linux", "CI/CD"],
    createdAt: "2026-10-10T10:00:00Z",
    likes: 28,
    likesCount: 28,
    commentsCount: 3,
    sharesCount: 9
  },
  {
    id: "vac-ui-ux-designer-03",
    uniqueId: "vac-ui-ux-designer-03",
    title: "[VACANTE DEMO #03] Diseñador de Producto Digital (UI / UX Mock)",
    titulo: "[VACANTE DEMO #03] Diseñador de Producto Digital (UI / UX Mock)",
    company: "[MOCK] Acme Corp",
    empresaNombre: "[MOCK] Acme Corporation S.A. de C.V.",
    empresaUuid: "org-techsolutions-01",
    companyId: "org-techsolutions-01",
    companyLogo: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80",
    lat: 19.2826,
    lng: -99.6557,
    location: "Toluca, Edo. Méx. (Zona Mock)",
    modalidad: "Híbrido [MOCK]",
    type: "Tiempo Completo [MOCK]",
    salario: 35000,
    salarioMinimo: 32000,
    salarioMaximo: 40000,
    salarioFormatted: "$32,000 - $40,000 MXN (Mock Data)",
    salary: "$32,000 - $40,000 MXN mensuales (Mock Data)",
    experienciaAnos: 3,
    sector: "Diseño [MOCK]",
    sectores: ["Diseño UI/UX [MOCK]"],
    vacantesDisponibles: 1,
    estado: "ACTIVO",
    descripcion: `[DATOS DE PRUEBA / MOCK DATA] Oferta ficticia de diseño de interfaces web para validar el flujo de postulación y pruebas de usuario.`,
    habilidadesRequeridas: ["Figma [MOCK]", "UI/UX", "Design Systems", "Prototipado"],
    createdAt: "2026-10-09T18:15:00Z",
    likes: 19,
    likesCount: 19,
    commentsCount: 2,
    sharesCount: 4
  },
  {
    id: "vac-qa-automation-04",
    uniqueId: "vac-qa-automation-04",
    title: "[VACANTE DEMO #04] Analista QA Automation (Testing Mock)",
    titulo: "[VACANTE DEMO #04] Analista QA Automation (Testing Mock)",
    company: "[MOCK] Initech Labs",
    empresaNombre: "[MOCK] Initech Labs de México S.A.",
    empresaUuid: "org-biosalud-03",
    companyId: "org-biosalud-03",
    companyLogo: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=150&auto=format&fit=crop&q=80",
    lat: 19.2905,
    lng: -99.5115,
    location: "Lerma, Edo. Méx. (Parque Industrial Mock)",
    modalidad: "Presencial [MOCK]",
    type: "Tiempo Completo [MOCK]",
    salario: 34000,
    salarioMinimo: 30000,
    salarioMaximo: 38000,
    salarioFormatted: "$30,000 - $38,000 MXN (Mock Data)",
    salary: "$30,000 - $38,000 MXN mensuales (Mock Data)",
    experienciaAnos: 3,
    sector: "Calidad de Software [MOCK]",
    sectores: ["Calidad de Software [MOCK]", "Testing [MOCK]"],
    vacantesDisponibles: 1,
    estado: "ACTIVO",
    descripcion: `[DATOS DE PRUEBA / MOCK DATA] Oferta de prueba para evaluar suites de pruebas automáticas con Playwright.`,
    habilidadesRequeridas: ["Playwright [MOCK]", "TypeScript", "Jest", "CI/CD"],
    createdAt: "2026-10-11T09:20:00Z",
    likes: 14,
    likesCount: 14,
    commentsCount: 1,
    sharesCount: 3
  },
  {
    id: "vac-backend-go-05",
    uniqueId: "vac-backend-go-05",
    title: "[VACANTE DEMO #05] Desarrollador Backend Go (Vacante Simulación)",
    titulo: "[VACANTE DEMO #05] Desarrollador Backend Go (Vacante Simulación)",
    company: "[MOCK] Cyberdyne Tech",
    empresaNombre: "[MOCK] Cyberdyne Retail Cloud S.A.",
    empresaUuid: "org-nexgen-06",
    companyId: "org-nexgen-06",
    companyLogo: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=150&auto=format&fit=crop&q=80",
    lat: 19.4785,
    lng: -99.2396,
    location: "Tlalnepantla, Edo. Méx. (Mock Env)",
    modalidad: "Híbrido [MOCK]",
    type: "Tiempo Completo [MOCK]",
    salario: 58000,
    salarioMinimo: 52000,
    salarioMaximo: 65000,
    salarioFormatted: "$52,000 - $65,000 MXN (Mock Data)",
    salary: "$52,000 - $65,000 MXN mensuales (Mock Data)",
    experienciaAnos: 5,
    sector: "Comercio Electrónico [MOCK]",
    sectores: ["Backend [MOCK]", "Golang [MOCK]"],
    vacantesDisponibles: 2,
    estado: "ACTIVO",
    descripcion: `[DATOS DE PRUEBA / MOCK DATA] Vacante simulada para microservicios y arquitectura backend en alta concurrencia.`,
    habilidadesRequeridas: ["Golang [MOCK]", "PostgreSQL", "Redis", "Docker", "gRPC"],
    createdAt: "2026-10-13T11:00:00Z",
    likes: 31,
    likesCount: 31,
    commentsCount: 5,
    sharesCount: 11
  }
];

// ============================================================================
// 4. POSTULACIONES Y EVALUACIONES ATS (DATOS MOCK / DEMO)
// ============================================================================
export const MOCK_APPLICANTS: ApplicantCandidate[] = [
  {
    id: "candidate-francisco-gomez",
    name: "[DEMO] Juan Pérez (Candidato Mock)",
    email: "juan.perez.mock@jobnet-demo.test",
    titularProfesional: "[MOCK] Desarrollador Full Stack Senior (Vue 3 / TypeScript / Nuxt)",
    phone: "+52 (000) 987-6543",
    bio: "[PERFIL DE PRUEBA] Perfil simulado para pruebas de plataforma JobNet.",
    skills: ["Vue 3 [MOCK]", "Nuxt 3 [MOCK]", "TypeScript", "Tailwind CSS", "AWS Cloud"],
    experience: [
      {
        empresa: "[MOCK] Acme Corp",
        puesto: "[MOCK] Líder Frontend (Pruebas)",
        anoInicio: "2023",
        anoFin: "Presente",
        actualmente: true,
        descripcion: "Migración simulada a Nuxt 3 y optimizaciones de componentes."
      }
    ],
    education: [
      {
        institucion: "[DEMO] Universidad Tecnológica Simulada",
        titulo: "Ingeniería en Computación (Mock)",
        anoInicio: "2016",
        anoFin: "2021"
      }
    ],
    job: "[VACANTE DEMO #01] Desarrollador Frontend Sr. (Vue 3 / Nuxt 3)",
    jobId: "vac-frontend-sr-01",
    status: "EN_CONTACTO",
    matchScore: 95,
    coverLetter: "[CARTA DE PRESENTACIÓN MOCK] Estimado equipo de recursos humanos demo: Adjunto mi postulación de prueba para validar el flujo completo del tablero ATS y la trazabilidad de postulantes.",
    time: "12/10/2026",
    cvUrl: "/sample-cv-mock-demo.pdf"
  },
  {
    id: "candidate-carlos-ramirez",
    name: "[DEMO] Carlos Test (DevOps Cloud Mock)",
    email: "carlos.test.mock@jobnet-demo.test",
    titularProfesional: "[MOCK] Especialista DevOps & AWS (Pruebas)",
    phone: "+52 (000) 765-4321",
    bio: "[MOCK DATA] Especialista en infraestructura como código simulada.",
    skills: ["AWS Cloud", "Docker [MOCK]", "Terraform [MOCK]", "CI/CD"],
    job: "[VACANTE DEMO #02] Especialista Cloud DevOps AWS (Mock Position)",
    jobId: "vac-devops-aws-02",
    status: "SELECCIONADO",
    matchScore: 91,
    coverLetter: "[CARTA MOCK] Postulación simulada para validación de pipelines de candidatos seleccionados.",
    time: "10/10/2026",
    cvUrl: "/sample-cv-carlos-test-mock.pdf"
  },
  {
    id: "candidate-mariana-dominguez",
    name: "[DEMO] Jane Doe (Diseñadora UI/UX Mock)",
    email: "jane.doe.mock@jobnet-demo.test",
    titularProfesional: "[MOCK] Diseñadora UI/UX & Sistemas de Diseño",
    phone: "+52 (000) 876-5432",
    bio: "[MOCK DATA] Diseñadora de interfaces y experiencia de usuario.",
    skills: ["Figma [MOCK]", "UI/UX", "Design Systems", "HTML/CSS"],
    job: "[VACANTE DEMO #01] Desarrollador Frontend Sr. (Vue 3 / Nuxt 3)",
    jobId: "vac-frontend-sr-01",
    status: "PENDIENTE",
    matchScore: 84,
    coverLetter: "[CARTA MOCK] Postulación de prueba para el estado pendiente de evaluación.",
    time: "11/10/2026",
    cvUrl: "/sample-cv-jane-doe-mock.pdf"
  },
  {
    id: "candidate-sofia-albarran",
    name: "[DEMO] Sofía Mock (Product Designer)",
    email: "sofia.mock@jobnet-demo.test",
    titularProfesional: "[MOCK] Diseñadora de Producto UI/UX",
    phone: "+52 (000) 654-3210",
    bio: "[MOCK DATA] Especialista en wireframing técnico.",
    skills: ["UI/UX [MOCK]", "Figma", "Design Systems"],
    job: "[VACANTE DEMO #03] Diseñador de Producto Digital (UI / UX Mock)",
    jobId: "vac-ui-ux-designer-03",
    status: "CONTRATADO",
    matchScore: 97,
    coverLetter: "[CARTA MOCK] Caso de contratación exitosa simulada.",
    time: "08/10/2026"
  }
];

// ============================================================================
// 5. PUBLICACIONES DEL FEED (COMUNIDAD DEMO)
// ============================================================================
export const MOCK_POSTS: Post[] = [
  {
    id: "post-techsolutions-hiring",
    uniqueId: "post-techsolutions-hiring",
    title: "[PUBLICACIÓN DEMO] Convocatoria simulada de talento Frontend",
    content: "[DATOS DE PRUEBA] ¡Bienvenidos a la demostración de JobNet! Esta es una publicación simulada en el muro de la comunidad para verificar la interacción social, comentarios y vacantes vinculadas en el feed interactivo.",
    author: "[MOCK] Acme Corp",
    authorId: "org-techsolutions-01",
    authorAvatar: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80",
    fotoPerfil: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80",
    tipoAutor: "EMPRESA",
    createdAt: "2026-10-13T16:20:00Z",
    timeAgo: "Hace 2 horas (Mock)",
    likes: 38,
    likesCount: 38,
    commentsCount: 6,
    sharesCount: 12,
    hasJobLinked: true,
    jobId: "vac-frontend-sr-01",
    jobTitle: "[VACANTE DEMO #01] Desarrollador Frontend Sr. (Vue 3 / Nuxt 3)",
    jobSalary: "$40,000 - $50,000 MXN (Mock Data)",
    comments: [
      {
        commentId: "c-1",
        author: "[DEMO] Juan Pérez (Candidato Mock)",
        authorId: "candidate-francisco-gomez",
        content: "[COMENTARIO MOCK] Postulación simulada enviada correctamente para testing de flujo.",
        createdAt: "2026-10-13T16:45:00Z"
      },
      {
        commentId: "c-2",
        author: "[DEMO] Jane Doe (Diseñadora UI/UX Mock)",
        authorId: "candidate-mariana-dominguez",
        content: "[COMENTARIO MOCK] Validando visualización de respuestas en el muro social.",
        createdAt: "2026-10-13T17:10:00Z"
      }
    ]
  },
  {
    id: "post-community-tips",
    uniqueId: "post-community-tips",
    title: "[GUÍA DE PRUEBA] Consejos simulados para testing de candidatos",
    content: `[MOCK TIPS] Esta publicación ejemplifica cómo los administradores y la comunidad difunden guías de buenas prácticas y plantillas en el feed interactivo.

1. Validar perfiles con datos mock estructurados y auto-contenidos.
2. Comprobar reactividad de filtros, búsquedas y paginación.
3. Verificar renderizado en vista desktop completa con sidebar visible.
4. Exportar evidencias limpias sin componentes de depuración.`,
    author: "[SISTEMA DEMO] Soporte JobNet",
    authorId: "jobnet-official",
    authorAvatar: "/logotipo.svg",
    tipoAutor: "ADMIN",
    createdAt: "2026-10-12T11:00:00Z",
    timeAgo: "Ayer (Mock)",
    likes: 85,
    likesCount: 85,
    commentsCount: 14,
    sharesCount: 29
  }
];

// ============================================================================
// 6. CHATS Y MENSAJERÍA (DATOS MOCK / DEMO)
// ============================================================================
export const MOCK_CHATS: ChatConversation[] = [
  {
    id: "chat-techsolutions-francisco",
    jobId: "vac-frontend-sr-01",
    candidateId: "candidate-francisco-gomez",
    name: "[RECLUTADOR DEMO] Acme Corp - RH",
    avatar: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80",
    jobTitle: "[VACANTE DEMO #01] Desarrollador Frontend Sr.",
    status: "En línea (Demo)",
    lastMessage: "[MENSAJE MOCK] Hola Juan, revisamos tu perfil demo y confirmamos la cita técnica de prueba...",
    time: "10:45 AM",
    unreadCount: 1
  },
  {
    id: "chat-innovatech-carlos",
    jobId: "vac-devops-aws-02",
    candidateId: "candidate-carlos-ramirez",
    name: "[TALENTO MOCK] Globex Tech",
    avatar: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=150&auto=format&fit=crop&q=80",
    jobTitle: "[VACANTE DEMO #02] Especialista Cloud DevOps AWS",
    status: "Desconectado",
    lastMessage: "[MENSAJE MOCK] Agradecemos el envío de tus certificaciones simuladas.",
    time: "Ayer",
    unreadCount: 0
  }
];

export const MOCK_MESSAGES_TECHSOLUTIONS: ChatMessage[] = [
  {
    id: "m-1",
    senderId: "org-techsolutions-01",
    senderName: "[RECLUTADOR DEMO] Lic. Roberto (Mock RH)",
    senderAvatar: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80",
    text: "[MENSAJE MOCK] Hola Juan, buenos días. Revisamos tu perfil de prueba en Nuxt 3. Cumples ampliamente con los requerimientos demo de la vacante.",
    timestamp: "2026-10-13T10:30:00Z",
    read: true,
    status: "read"
  },
  {
    id: "m-2",
    senderId: "candidate-francisco-gomez",
    senderName: "[DEMO] Juan Pérez (Candidato Mock)",
    text: "[MENSAJE MOCK] Muchas gracias Roberto. Me interesa validar la interacción del chat en tiempo real y la trazabilidad de mensajes.",
    timestamp: "2026-10-13T10:35:00Z",
    read: true,
    status: "read"
  },
  {
    id: "m-3",
    senderId: "org-techsolutions-01",
    senderName: "[RECLUTADOR DEMO] Lic. Roberto (Mock RH)",
    text: "[MENSAJE MOCK] Excelente. ¿Tendrías disponibilidad para una videollamada de prueba este jueves a las 11:00 AM vía Google Meet simulado?",
    timestamp: "2026-10-13T10:45:00Z",
    read: false,
    status: "delivered"
  }
];

// ============================================================================
// 7. NOTIFICACIONES (DATOS MOCK / DEMO)
// ============================================================================
export const MOCK_NOTIFICATIONS = [
  {
    id: "notif-1",
    type: "APPLICATION_STAGE_CHANGED",
    title: "[NOTIFICACIÓN DEMO] Avance en tu postulación simulada",
    message: "[MOCK] Acme Corp actualizó tu postulación a: 'En Contacto / Entrevista de Prueba'.",
    link: "/candidate/my-applications",
    icon: "handshake",
    read: false,
    createdAt: "2026-10-13T10:46:00Z",
    timeAgo: "Hace 15 minutos (Mock)"
  },
  {
    id: "notif-2",
    type: "NEW_MESSAGE",
    title: "[MENSAJE MOCK] Nuevo mensaje del reclutador demo",
    message: "[MOCK] Lic. Roberto te ha enviado un mensaje simulado en el chat privado.",
    link: "/messages",
    icon: "chat",
    read: false,
    createdAt: "2026-10-13T10:45:00Z",
    timeAgo: "Hace 20 minutos (Mock)"
  },
  {
    id: "notif-3",
    type: "JOB_RECOMMENDED",
    title: "[ALERTA DEMO] Nueva vacante afín a tu perfil mock",
    message: "[MOCK] Globex Tech publicó '[VACANTE DEMO #02] DevOps AWS' con 95% de afinidad según tus skills.",
    link: "/jobs/vac-devops-aws-02",
    icon: "work",
    read: true,
    createdAt: "2026-10-10T11:00:00Z",
    timeAgo: "Hace 3 días (Mock)"
  }
];

// ============================================================================
// 8. INCIDENCIAS Y MODERACIÓN (DATOS MOCK / DEMO)
// ============================================================================
export const MOCK_INCIDENTS: Incident[] = [
  {
    id: "inc-001",
    targetType: "VACANTE",
    targetId: "vac-frontend-sr-01",
    targetTitle: "[INCIDENTE DEMO #001] Vacante de prueba reportada para auditoría",
    jobTitle: "[INCIDENTE DEMO #001] Vacante de prueba reportada para auditoría",
    jobId: "vac-frontend-sr-01",
    companyId: "org-scam-01",
    companyName: "[MOCK] FastHiring Express S.A.S.",
    candidateId: "cand-carlos-12",
    candidateName: "[DEMO] Carlos Test",
    reporterId: "user-candidato-report",
    reporterEmail: "candidato.alerta.mock@jobnet-test.mx",
    reporter: "candidato.alerta.mock@jobnet-test.mx",
    reason: "[DATOS DE PRUEBA] Simulación de reporte por solicitud de anticipo monetario para validar panel de incidentes.",
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
    targetTitle: "[INCIDENTE DEMO #002] Publicación en revisión por moderador",
    postId: "post-techsolutions-hiring",
    reporterId: "user-moderador-audit",
    reporterEmail: "moderador.demo@jobnet-mock.test",
    reporter: "moderador.demo@jobnet-mock.test",
    reason: "[DATOS DE PRUEBA] Simulación de detección automática de spam en el muro comunitario.",
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
    targetTitle: "[INCIDENTE DEMO #003] Reporte de discrepancia salarial simulada",
    jobTitle: "[INCIDENTE DEMO #003] Reporte de discrepancia salarial simulada",
    jobId: "vac-frontend-sr-01",
    companyId: "org-recruiter-99",
    companyName: "[MOCK] Tech Corp Latam",
    candidateId: "cand-maria-77",
    candidateName: "[DEMO] Jane Doe",
    reporterId: "cand-maria-77",
    reporterEmail: "jane.doe.mock@devmail.test",
    reporter: "jane.doe.mock@devmail.test",
    reason: "[DATOS DE PRUEBA] Reporte simulado de discrepancia entre salario ofertado y monto en entrevista para pruebas de dictamen.",
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
    targetTitle: "[INCIDENTE DEMO #004] Solicitud de moderación preventiva",
    jobTitle: "[INCIDENTE DEMO #004] Solicitud de moderación preventiva",
    jobId: "vac-ux-lead-02",
    companyId: "org-inapropiado-22",
    companyName: "[MOCK] Agencia Creativa",
    candidateId: "cand-ana-33",
    candidateName: "[DEMO] Ana Mock",
    reporterId: "cand-ana-33",
    reporterEmail: "ana.mock.demo@gmail.test",
    reporter: "ana.mock.demo@gmail.test",
    reason: "[DATOS DE PRUEBA] Caso simulado para verificar el panel de dictámenes de moderación y auditoría.",
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
// 9. VERIFICACIONES SAT KYC (DATOS MOCK / DEMO)
// ============================================================================
export const MOCK_VERIFICATIONS = [
  {
    id: "verif-ctm-01",
    companyId: "org-metropolitana-05",
    companyName: "[MOCK] Wayne Consultores TI S.A.S.",
    razonSocial: "[MOCK] Wayne Consultores TI S.A.S.",
    rfc: "DEMO210908KL3",
    representanteLegal: "[DEMO] Lic. Bruce W. (Representante Mock)",
    email: "verificacion@mock-wayne.test",
    telefono: "+52 (000) 567-8901",
    fechaSolicitud: "2026-10-12",
    status: "PENDIENTE",
    documentoPdf: {
      nombre: "Constancia_SAT_Demo_Wayne_2026.pdf",
      url: "/docs/sample-sat-constancia.pdf",
      tamano: "485 KB",
      validoSat: true
    }
  }
];

// ============================================================================
// 10. APELACIONES Y DISPUTAS (DATOS MOCK / DEMO)
// ============================================================================
export const MOCK_APPEALS: Appeal[] = [
  {
    id: "appeal-translog-01",
    companyId: "org-starlight-04",
    companyName: "[MOCK] Umbrella Logistics Express",
    incidentId: "inc-suspension-starlight",
    motivo: "[APELACIÓN DEMO #01] Disputa simulada por aclaración de vacante",
    descripcion: "[DATOS DE PRUEBA] Solicitud formal de apelación simulada para verificar el panel de resolución de disputas de moderadores en JobNet.",
    estado: "PENDIENTE",
    createdAt: "2026-10-11T12:00:00Z",
    evidenciaUrl: "/docs/centro_costos_autorizado.pdf",
    messages: [
      {
        id: "app-msg-1",
        senderId: "org-starlight-04",
        senderRole: "ORGANIZACION",
        text: "[MENSAJE MOCK] Estimados moderadores: Solicitamos la revisión de la suspensión temporal demo. Adjuntamos justificación de pruebas.",
        timestamp: "2026-10-11T12:05:00Z"
      },
      {
        id: "app-msg-2",
        senderId: "mod-official",
        senderRole: "MODERADOR",
        text: "[MENSAJE MOCK] Buen día. Estamos cotejando los datos simulados con la bitácora de auditoría. Se emitirá dictamen demo a la brevedad.",
        timestamp: "2026-10-11T14:30:00Z"
      }
    ]
  }
];

// ============================================================================
// 11. CATÁLOGO MAESTRO (DATOS MOCK / DEMO)
// ============================================================================
export const MOCK_CATALOG = {
  skills: [
    { id: "sk-vue", name: "Vue.js 3 [MOCK]", category: "Frontend", vacanciesCount: 8 },
    { id: "sk-nuxt", name: "Nuxt 3 [MOCK]", category: "Frontend", vacanciesCount: 6 },
    { id: "sk-ts", name: "TypeScript [MOCK]", category: "Lenguajes", vacanciesCount: 12 },
    { id: "sk-tailwind", name: "Tailwind CSS [MOCK]", category: "Frontend", vacanciesCount: 10 },
    { id: "sk-node", name: "Node.js [MOCK]", category: "Backend", vacanciesCount: 9 },
    { id: "sk-aws", name: "AWS Cloud [MOCK]", category: "DevOps & Cloud", vacanciesCount: 7 },
    { id: "sk-docker", name: "Docker [MOCK]", category: "DevOps & Cloud", vacanciesCount: 5 },
    { id: "sk-go", name: "Golang [MOCK]", category: "Backend", vacanciesCount: 3 },
    { id: "sk-figma", name: "Figma [MOCK]", category: "Diseño UI/UX", vacanciesCount: 4 }
  ],
  categories: [
    { id: "cat-dev", name: "Desarrollo de Software [MOCK]", vacanciesCount: 15 },
    { id: "cat-cloud", name: "Cloud & DevOps [MOCK]", vacanciesCount: 7 },
    { id: "cat-design", name: "Diseño UI/UX [MOCK]", vacanciesCount: 4 },
    { id: "cat-qa", name: "Calidad de Software [MOCK]", vacanciesCount: 3 },
    { id: "cat-logistics", name: "Logística y Operaciones [MOCK]", vacanciesCount: 2 }
  ],
  locations: [
    { id: "loc-toluca", name: "Toluca (Zona Demo)", state: "Estado de México", vacanciesCount: 6 },
    { id: "loc-metepec", name: "Metepec (Zona Pruebas)", state: "Estado de México", vacanciesCount: 4 },
    { id: "loc-lerma", name: "Lerma (Zona Mock)", state: "Estado de México", vacanciesCount: 2 },
    { id: "loc-naucalpan", name: "Naucalpan (Entorno Demo)", state: "Estado de México", vacanciesCount: 3 },
    { id: "loc-remoto", name: "Remoto Nacional (Mock)", state: "México", vacanciesCount: 8 }
  ]
};

export const MOCK_CATALOG_ITEMS = [
  { id: "sk-1", name: "Vue.js / Nuxt 3 [MOCK]", category: "Habilidad" as const, createdAt: "2026-09-01T10:00:00Z" },
  { id: "sk-2", name: "TypeScript [MOCK]", category: "Habilidad" as const, createdAt: "2026-09-01T10:00:00Z" },
  { id: "sk-3", name: "Tailwind CSS [MOCK]", category: "Habilidad" as const, createdAt: "2026-09-02T11:00:00Z" },
  { id: "sk-4", name: "Node.js & Express [MOCK]", category: "Habilidad" as const, createdAt: "2026-09-02T12:00:00Z" },
  { id: "sk-5", name: "AWS Cloud (Lambda, DynamoDB) [MOCK]", category: "Habilidad" as const, createdAt: "2026-09-03T10:00:00Z" },
  { id: "sk-6", name: "Docker & Kubernetes [MOCK]", category: "Habilidad" as const, createdAt: "2026-09-04T09:00:00Z" },
  { id: "sk-7", name: "Go (Golang) [MOCK]", category: "Habilidad" as const, createdAt: "2026-09-05T08:00:00Z" },
  { id: "sk-8", name: "Figma & UI Design [MOCK]", category: "Habilidad" as const, createdAt: "2026-09-05T14:00:00Z" },
  { id: "sk-9", name: "Playwright & QA Automation [MOCK]", category: "Habilidad" as const, createdAt: "2026-09-06T15:00:00Z" },
  { id: "sec-1", name: "Tecnología y Software [MOCK]", category: "Sector" as const, createdAt: "2026-09-01T10:00:00Z" },
  { id: "sec-2", name: "Cloud Computing y DevOps [MOCK]", category: "Sector" as const, createdAt: "2026-09-01T10:00:00Z" },
  { id: "sec-3", name: "Diseño Digital y UX/UI [MOCK]", category: "Sector" as const, createdAt: "2026-09-02T10:00:00Z" },
  { id: "sec-4", name: "Logística y Suministro [MOCK]", category: "Sector" as const, createdAt: "2026-09-02T10:00:00Z" },
  { id: "sec-5", name: "Consultoría y Servicios TI [MOCK]", category: "Sector" as const, createdAt: "2026-09-03T10:00:00Z" }
];
