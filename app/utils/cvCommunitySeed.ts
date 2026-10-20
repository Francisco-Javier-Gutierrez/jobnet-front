import type { CommunityCvTemplate } from "~/types/cvCommunity";

export const CV_COMMUNITY_SEED: CommunityCvTemplate[] = [
  // 1. Regional EdoMéx: Backend Java Spring Boot
  {
    id: "seed-backend-java-edomex",
    titulo: "Ingeniero Backend Java & Spring Boot",
    rol: "Backend Engineer",
    categoria: "backend",
    nivel: "mid",
    idioma: "es",
    alcance: "SUR_EDOMEX",
    autorId: "jobnet-official",
    autorNombre: "JobNet Oficial",
    isOfficial: true,
    habilidades: [
      "Java 17+",
      "Spring Boot",
      "Hibernate / JPA",
      "PostgreSQL",
      "Docker",
      "Microservicios",
      "APIs RESTful",
      "JUnit / Mockito",
      "Metodologías Ágiles",
    ],
    biografiaSugerida:
      "Ingeniero de Software especializado en arquitectura de microservicios y desarrollo backend con Java y Spring Boot. Con experiencia en optimización de bases de datos relacionales, creación de APIs escalables y automatización de despliegues. Apasionado por el código limpio y la arquitectura orientada al dominio.",
    experienciaSugerida: [
      {
        cargo: "Ingeniero de Software Backend",
        empresa: "Empresa de Tecnología / Corredor Industrial Toluca-Lerma",
        periodo: "2022 - Presente",
        logros: [
          "Diseñé e implementé [X] microservicios críticos en Spring Boot con una disponibilidad del 99.9%.",
          "Optimicé consultas SQL complejas en PostgreSQL reduciendo los tiempos de respuesta de endpoints en un [35]%.",
          "Automaticé pruebas unitarias e integración con JUnit/Mockito alcanzando un 85% de cobertura de código.",
        ],
      },
    ],
    educacionSugerida: [
      {
        titulo: "Ingeniería en Sistemas Computacionales o Computación",
        institucion: "Instituto Tecnológico / Universidad Estatal (UAEMéx)",
        periodo: "2018 - 2022",
      },
    ],
    translations: {
      es: {
        titulo: "Ingeniero Backend Java & Spring Boot",
        rol: "Ingeniero de Software Backend",
        biografiaSugerida:
          "Ingeniero de Software especializado en arquitectura de microservicios y desarrollo backend con Java y Spring Boot. Con experiencia en optimización de bases de datos relacionales, creación de APIs escalables y automatización de despliegues. Apasionado por el código limpio y la arquitectura orientada al dominio.",
        habilidades: [
          "Java 17+",
          "Spring Boot",
          "Hibernate / JPA",
          "PostgreSQL",
          "Docker",
          "Microservicios",
          "APIs RESTful",
          "JUnit / Mockito",
          "Metodologías Ágiles",
        ],
        experienciaSugerida: [
          {
            cargo: "Ingeniero de Software Backend",
            empresa: "Empresa de Tecnología / Corredor Industrial Toluca-Lerma",
            periodo: "2022 - Presente",
            logros: [
              "Diseñé e implementé [X] microservicios críticos en Spring Boot con una disponibilidad del 99.9%.",
              "Optimicé consultas SQL complejas en PostgreSQL reduciendo los tiempos de respuesta de endpoints en un [35]%.",
              "Automaticé pruebas unitarias e integración con JUnit/Mockito alcanzando un 85% de cobertura de código.",
            ],
          },
        ],
        educacionSugerida: [
          {
            titulo: "Ingeniería en Sistemas Computacionales o Computación",
            institucion: "Instituto Tecnológico / Universidad Estatal (UAEMéx)",
            periodo: "2018 - 2022",
          },
        ],
      },
      en: {
        titulo: "Backend Java & Spring Boot Engineer",
        rol: "Backend Software Engineer",
        biografiaSugerida:
          "Software Engineer specializing in microservices architecture and backend development with Java and Spring Boot. Experienced in relational database optimization, scalable REST API design, and automated deployment pipelines. Passionate about clean code and domain-driven design.",
        habilidades: [
          "Java 17+",
          "Spring Boot",
          "Hibernate / JPA",
          "PostgreSQL",
          "Docker",
          "Microservices Architecture",
          "RESTful APIs",
          "Unit Testing (JUnit / Mockito)",
          "Agile / Scrum Methodologies",
        ],
        experienciaSugerida: [
          {
            cargo: "Backend Software Engineer",
            empresa: "Technology Firm / Industrial Corridor",
            periodo: "2022 - Present",
            logros: [
              "Architected and deployed [X] mission-critical Spring Boot microservices maintaining 99.9% uptime SLA.",
              "Optimized complex PostgreSQL queries, cutting API endpoint latency by [35]%.",
              "Automated unit and integration test suites with JUnit and Mockito, achieving 85% code test coverage.",
            ],
          },
        ],
        educacionSugerida: [
          {
            titulo: "B.S. in Computer Science or Software Engineering",
            institucion: "State University / College of Engineering",
            periodo: "2018 - 2022",
          },
        ],
      },
    },
    stats: { usesCount: 342, likesCount: 48 },
  },

  // 2. Regional EdoMéx: Logística y Gestión de Almacén
  {
    id: "seed-logistica-toluca",
    titulo: "Especialista en Logística & Gestión de Almacén",
    rol: "Coordinador de Logística",
    categoria: "logistica-operaciones",
    nivel: "mid",
    idioma: "es",
    alcance: "SUR_EDOMEX",
    autorId: "jobnet-official",
    autorNombre: "JobNet Oficial",
    isOfficial: true,
    habilidades: [
      "SAP ERP / WMS",
      "Gestión de Inventarios (FIFO/LIFO)",
      "Cadena de Suministro (Supply Chain)",
      "Normas STPS (006, 017)",
      "Control de Mermas",
      "Logística Inversa",
      "Excel Avanzado / Macros",
      "Liderazgo de Cuadrillas",
    ],
    biografiaSugerida:
      "Profesional en logística y cadena de suministro con sólida trayectoria en administración de almacenes de alto volumen y centros de distribución en la zona industrial Lerma-Toluca. Especialista en reducción de mermas, control cíclico de inventarios y cumplimiento riguroso de normativas de seguridad laboral.",
    experienciaSugerida: [
      {
        cargo: "Supervisor de Almacén y Distribución",
        empresa: "Centro de Distribución Logístico / Parque Industrial Toluca 2000",
        periodo: "2021 - Presente",
        logros: [
          "Supervisé operaciones diarias de inventario con más de [10,000] SKUs manteniendo un índice de exactitud del 99.2%.",
          "Reduje el tiempo de preparación de pedidos (picking/packing) en un [22]% implementando reordenamiento por rotación ABC.",
          "Coordiné un equipo de [15] operadores garantizando cero accidentes incapacitantes durante 24 meses consecutivos.",
        ],
      },
    ],
    educacionSugerida: [
      {
        titulo: "Licenciatura en Logística / Ingeniería Industrial",
        institucion: "Universidad Tecnológica del Valle de Toluca (UTVT)",
        periodo: "2017 - 2021",
      },
    ],
    translations: {
      es: {
        titulo: "Especialista en Logística & Gestión de Almacén",
        rol: "Coordinador de Logística y Almacén",
        biografiaSugerida:
          "Profesional en logística y cadena de suministro con sólida trayectoria en administración de almacenes de alto volumen y centros de distribución en la zona industrial Lerma-Toluca. Especialista en reducción de mermas, control cíclico de inventarios y cumplimiento riguroso de normativas de seguridad laboral.",
        habilidades: [
          "SAP ERP / WMS",
          "Gestión de Inventarios (FIFO/LIFO)",
          "Cadena de Suministro (Supply Chain)",
          "Normas STPS (006, 017)",
          "Control de Mermas",
          "Logística Inversa",
          "Excel Avanzado / Macros",
          "Liderazgo de Cuadrillas",
        ],
        experienciaSugerida: [
          {
            cargo: "Supervisor de Almacén y Distribución",
            empresa: "Centro de Distribución Logístico / Parque Industrial Toluca 2000",
            periodo: "2021 - Presente",
            logros: [
              "Supervisé operaciones diarias de inventario con más de [10,000] SKUs manteniendo un índice de exactitud del 99.2%.",
              "Reduje el tiempo de preparación de pedidos (picking/packing) en un [22]% implementando reordenamiento por rotación ABC.",
              "Coordiné un equipo de [15] operadores garantizando cero accidentes incapacitantes durante 24 meses consecutivos.",
            ],
          },
        ],
        educacionSugerida: [
          {
            titulo: "Licenciatura en Logística / Ingeniería Industrial",
            institucion: "Universidad Tecnológica del Valle de Toluca (UTVT)",
            periodo: "2017 - 2021",
          },
        ],
      },
      en: {
        titulo: "Logistics & Warehouse Operations Specialist",
        rol: "Warehouse & Logistics Coordinator",
        biografiaSugerida:
          "Supply chain and logistics specialist with extensive experience in high-volume warehouse operations and distribution centers. Proven track record in reducing shrinkage, executing cyclical inventory audits (FIFO/LIFO), and strictly enforcing occupational safety standards.",
        habilidades: [
          "SAP ERP / WMS",
          "Inventory Management (FIFO/LIFO)",
          "Supply Chain Operations",
          "Safety & Compliance Standards",
          "Loss Prevention / Shrinkage Control",
          "Reverse Logistics",
          "Advanced Excel & Data Analysis",
          "Team Leadership",
        ],
        experienciaSugerida: [
          {
            cargo: "Warehouse & Distribution Supervisor",
            empresa: "Logistics Distribution Center",
            periodo: "2021 - Present",
            logros: [
              "Supervised daily inventory operations across [10,000]+ SKUs, sustaining a 99.2% record accuracy rate.",
              "Reduced order fulfillment cycle times (picking/packing) by [22]% by implementing ABC velocity slotting.",
              "Led and mentored a [15]-operator warehouse crew with zero lost-time workplace incidents for 24 consecutive months.",
            ],
          },
        ],
        educacionSugerida: [
          {
            titulo: "B.S. in Logistics / Industrial Engineering",
            institucion: "Technological University",
            periodo: "2017 - 2021",
          },
        ],
      },
    },
    stats: { usesCount: 512, likesCount: 89 },
  },

  // 3. Regional EdoMéx: Desarrollador Junior / Trainee (Primer Empleo)
  {
    id: "seed-junior-primer-empleo-edomex",
    titulo: "Desarrollador Web Junior (Primer Empleo)",
    rol: "Junior Web Developer",
    categoria: "frontend",
    nivel: "junior",
    idioma: "es",
    alcance: "SUR_EDOMEX",
    autorId: "jobnet-official",
    autorNombre: "JobNet Oficial",
    isOfficial: true,
    habilidades: [
      "JavaScript (ES6+)",
      "HTML5 & CSS3",
      "Git & GitHub",
      "React / Vue.js",
      "Tailwind CSS",
      "Consumo de REST APIs",
      "Trabajo Colaborativo",
      "Resolución de Problemas",
    ],
    biografiaSugerida:
      "Recién egresado apasionado por el desarrollo de aplicaciones web interactivas y accesibles. Cuento con experiencia en proyectos académicos y plataformas freelance utilizando JavaScript moderno, React y Git. Busco incorporarme a un equipo dinámico donde aportar soluciones ágiles y continuar mi crecimiento profesional.",
    experienciaSugerida: [
      {
        cargo: "Desarrollador Web / Proyectos Académicos y Prácticas",
        empresa: "Facultad de Ingeniería / Proyectos de Vinculación Comunitaria",
        periodo: "2023 - 2024",
        logros: [
          "Desarrollé una plataforma web responsiva para gestión local consumiendo APIs REST con React y Tailwind.",
          "Implementé control de versiones con Git colaborando con [4] desarrolladores mediante pull requests y code reviews.",
          "Optimicé la interfaz para dispositivos móviles logrando un puntaje superior a 90 en Google Lighthouse.",
        ],
      },
    ],
    educacionSugerida: [
      {
        titulo: "Ingeniería en Computación o Informática",
        institucion: "Universidad o Instituto Tecnológico del Estado de México",
        periodo: "2020 - 2024",
      },
    ],
    translations: {
      es: {
        titulo: "Desarrollador Web Junior (Primer Empleo)",
        rol: "Desarrollador Web Junior",
        biografiaSugerida:
          "Recién egresado apasionado por el desarrollo de aplicaciones web interactivas y accesibles. Cuento con experiencia en proyectos académicos y plataformas freelance utilizando JavaScript moderno, React y Git. Busco incorporarme a un equipo dinámico donde aportar soluciones ágiles y continuar mi crecimiento profesional.",
        habilidades: [
          "JavaScript (ES6+)",
          "HTML5 & CSS3",
          "Git & GitHub",
          "React / Vue.js",
          "Tailwind CSS",
          "Consumo de REST APIs",
          "Trabajo Colaborativo",
          "Resolución de Problemas",
        ],
        experienciaSugerida: [
          {
            cargo: "Desarrollador Web / Proyectos Académicos y Prácticas",
            empresa: "Facultad de Ingeniería / Proyectos de Vinculación Comunitaria",
            periodo: "2023 - 2024",
            logros: [
              "Desarrollé una plataforma web responsiva para gestión local consumiendo APIs REST con React y Tailwind.",
              "Implementé control de versiones con Git colaborando con [4] desarrolladores mediante pull requests y code reviews.",
              "Optimicé la interfaz para dispositivos móviles logrando un puntaje superior a 90 en Google Lighthouse.",
            ],
          },
        ],
        educacionSugerida: [
          {
            titulo: "Ingeniería en Computación o Informática",
            institucion: "Universidad o Instituto Tecnológico del Estado de México",
            periodo: "2020 - 2024",
          },
        ],
      },
      en: {
        titulo: "Junior Web Developer (Entry-Level)",
        rol: "Junior Web Developer",
        biografiaSugerida:
          "Entry-level web developer passionate about crafting responsive, accessible user interfaces. Experienced with modern JavaScript, React, Git, and REST APIs through academic capstones and freelance projects. Eager to contribute clean code and collaborate within an agile engineering team.",
        habilidades: [
          "JavaScript (ES6+)",
          "HTML5 & CSS3",
          "Git & GitHub",
          "React / Vue.js",
          "Tailwind CSS",
          "RESTful API Integration",
          "Agile Collaboration",
          "Problem Solving",
        ],
        experienciaSugerida: [
          {
            cargo: "Web Developer / Academic Capstone & Internship",
            empresa: "University Engineering Projects / Community Platforms",
            periodo: "2023 - 2024",
            logros: [
              "Built a responsive web application consuming RESTful APIs using React and Tailwind CSS.",
              "Implemented Git version control workflows, collaborating with [4] team members via pull requests and code reviews.",
              "Optimized mobile frontend performance, achieving a 90+ score on Google Lighthouse audits.",
            ],
          },
        ],
        educacionSugerida: [
          {
            titulo: "B.S. in Computer Science or Software Engineering",
            institucion: "State University / College of Engineering",
            periodo: "2020 - 2024",
          },
        ],
      },
    },
    stats: { usesCount: 780, likesCount: 140 },
  },

  // 4. Regional EdoMéx: Ejecutivo de Ventas B2B & Cuentas Clave
  {
    id: "seed-ventas-b2b-edomex",
    titulo: "Ejecutivo de Ventas B2B & Prospección Comercial",
    rol: "Key Account Executive",
    categoria: "ventas-bizdev",
    nivel: "mid",
    idioma: "es",
    alcance: "SUR_EDOMEX",
    autorId: "jobnet-official",
    autorNombre: "JobNet Oficial",
    isOfficial: true,
    habilidades: [
      "Prospección B2B en Frío",
      "CRM (HubSpot / Salesforce)",
      "Cierre de Ventas y Negociación",
      "Venta Consultiva",
      "Gestión de Cuentas Clave (KAM)",
      "Elaboración de Licitaciones",
      "Comunicación Persuasiva",
      "Manejo de Objeciones",
    ],
    biografiaSugerida:
      "Especialista comercial con más de 3 años de experiencia en ventas corporativas B2B y captación de clientes institucionales en la región Toluca-Metepec y Valle de México. Enfocado en prospección estratégica, construcción de relaciones a largo plazo y superación consistente de cuotas de facturación.",
    experienciaSugerida: [
      {
        cargo: "Ejecutivo Comercial Senior B2B",
        empresa: "Empresa de Servicios Corporativos / Metepec",
        periodo: "2022 - Presente",
        logros: [
          "Superé la cuota anual de ventas en un [118]% generando más de $[X] millones de pesos en nueva cartera.",
          "Gestioné un pipeline comercial activo de más de [40] cuentas corporativas utilizando HubSpot CRM.",
          "Reduje el ciclo de venta promedio de 60 a [35] días mediante presentaciones comerciales adaptadas a la necesidad del cliente.",
        ],
      },
    ],
    educacionSugerida: [
      {
        titulo: "Licenciatura en Mercadotecnia / Administración",
        institucion: "Universidad del Valle de Toluca / UAEMéx",
        periodo: "2017 - 2021",
      },
    ],
    translations: {
      es: {
        titulo: "Ejecutivo de Ventas B2B & Prospección Comercial",
        rol: "Ejecutivo de Cuentas B2B (KAM)",
        biografiaSugerida:
          "Especialista comercial con más de 3 años de experiencia en ventas corporativas B2B y captación de clientes institucionales en la región Toluca-Metepec y Valle de México. Enfocado en prospección estratégica, construcción de relaciones a largo plazo y superación consistente de cuotas de facturación.",
        habilidades: [
          "Prospección B2B en Frío",
          "CRM (HubSpot / Salesforce)",
          "Cierre de Ventas y Negociación",
          "Venta Consultiva",
          "Gestión de Cuentas Clave (KAM)",
          "Elaboración de Licitaciones",
          "Comunicación Persuasiva",
          "Manejo de Objeciones",
        ],
        experienciaSugerida: [
          {
            cargo: "Ejecutivo Comercial Senior B2B",
            empresa: "Empresa de Servicios Corporativos / Metepec",
            periodo: "2022 - Presente",
            logros: [
              "Superé la cuota anual de ventas en un [118]% generando más de $[X] millones de pesos en nueva cartera.",
              "Gestioné un pipeline comercial activo de más de [40] cuentas corporativas utilizando HubSpot CRM.",
              "Reduje el ciclo de venta promedio de 60 a [35] días mediante presentaciones comerciales adaptadas a la necesidad del cliente.",
            ],
          },
        ],
        educacionSugerida: [
          {
            titulo: "Licenciatura en Mercadotecnia / Administración",
            institucion: "Universidad del Valle de Toluca / UAEMéx",
            periodo: "2017 - 2021",
          },
        ],
      },
      en: {
        titulo: "B2B Sales & Key Account Executive",
        rol: "Key Account Manager (KAM)",
        biografiaSugerida:
          "Results-driven B2B sales professional with 3+ years of experience in corporate account acquisition, enterprise client management, and consultative selling. Proven track record in exceeding revenue targets and establishing durable commercial partnerships.",
        habilidades: [
          "Outbound B2B Prospecting",
          "CRM (Salesforce / HubSpot)",
          "Contract Negotiation & Deal Closing",
          "Consultative Selling",
          "Key Account Management (KAM)",
          "RFP & Proposal Crafting",
          "Persuasive Presentation",
          "Pipeline Management",
        ],
        experienciaSugerida: [
          {
            cargo: "Senior B2B Commercial Executive",
            empresa: "Corporate Services Firm",
            periodo: "2022 - Present",
            logros: [
              "Exceeded annual sales quota by [118]%, adding over $[X] in newly generated contract value.",
              "Managed an active pipeline of [40]+ enterprise accounts utilizing HubSpot CRM.",
              "Shortened the average deal cycle from 60 to [35] days through customized consultative solution pitches.",
            ],
          },
        ],
        educacionSugerida: [
          {
            titulo: "B.A. in Marketing / Business Administration",
            institucion: "State University",
            periodo: "2017 - 2021",
          },
        ],
      },
    },
    stats: { usesCount: 290, likesCount: 35 },
  },

  // 5. Global / Remoto (Inglés): Senior Frontend Engineer (React/Next.js)
  {
    id: "seed-frontend-react-en",
    titulo: "Senior Frontend Engineer (React & TypeScript)",
    rol: "Frontend Engineer",
    categoria: "frontend",
    nivel: "senior",
    idioma: "en",
    alcance: "GLOBAL_REMOTO",
    autorId: "jobnet-official",
    autorNombre: "JobNet Oficial",
    isOfficial: true,
    habilidades: [
      "React 18+",
      "TypeScript",
      "Next.js (App Router)",
      "Tailwind CSS",
      "Zustand / Redux Toolkit",
      "Vitest / Jest & RTL",
      "Web Performance (Core Web Vitals)",
      "CI/CD GitHub Actions",
      "Agile / Scrum",
    ],
    biografiaSugerida:
      "Results-driven Senior Frontend Engineer with 5+ years of experience building high-traffic, resilient web applications using React, TypeScript, and Next.js. Dedicated to crafting pixel-perfect, accessible user interfaces and improving Core Web Vitals to deliver seamless user experiences at scale.",
    experienciaSugerida: [
      {
        cargo: "Senior Frontend Developer",
        empresa: "Fintech & Cloud Platform / Remote",
        periodo: "2022 - Present",
        logros: [
          "Architected modern component design systems in React and TypeScript, boosting cross-team velocity by [30]%.",
          "Optimized initial JavaScript bundle size by [45]% with code splitting and dynamic imports, improving LCP from 3.8s to 1.4s.",
          "Mentored [4] junior and mid-level engineers in test-driven development and modern state management patterns.",
        ],
      },
    ],
    educacionSugerida: [
      {
        titulo: "B.S. in Computer Science or Software Engineering",
        institucion: "State University / College of Engineering",
        periodo: "2016 - 2020",
      },
    ],
    translations: {
      es: {
        titulo: "Ingeniero Frontend Senior (React & TypeScript)",
        rol: "Ingeniero Frontend Senior",
        biografiaSugerida:
          "Ingeniero Frontend Senior con más de 5 años de experiencia construyendo aplicaciones web resilientes y de alto tráfico con React, TypeScript y Next.js. Dedicado a diseñar interfaces de usuario accesibles, sistemas de componentes y optimizar métricas Core Web Vitals a escala.",
        habilidades: [
          "React 18+",
          "TypeScript",
          "Next.js",
          "Tailwind CSS",
          "Zustand / Redux",
          "Vitest / Jest",
          "Rendimiento Web (Core Web Vitals)",
          "CI/CD GitHub Actions",
          "Metodologías Ágiles (Scrum)",
        ],
        experienciaSugerida: [
          {
            cargo: "Desarrollador Frontend Senior",
            empresa: "Plataforma Fintech & Cloud / Remoto",
            periodo: "2022 - Presente",
            logros: [
              "Diseñé e implementé sistemas de diseño en React y TypeScript, acelerando la velocidad de entrega en un [30]%.",
              "Reduje el tamaño del bundle inicial en un [45]% mediante code splitting, mejorando el LCP de 3.8s a 1.4s.",
              "Lideré y asesoré a [4] desarrolladores junior y mid en desarrollo guiado por pruebas (TDD) y buenas prácticas.",
            ],
          },
        ],
        educacionSugerida: [
          {
            titulo: "Ingeniería en Computación o Software",
            institucion: "Universidad Estatal / Facultad de Ingeniería",
            periodo: "2016 - 2020",
          },
        ],
      },
      en: {
        titulo: "Senior Frontend Engineer (React & TypeScript)",
        rol: "Senior Frontend Engineer",
        biografiaSugerida:
          "Results-driven Senior Frontend Engineer with 5+ years of experience building high-traffic, resilient web applications using React, TypeScript, and Next.js. Dedicated to crafting pixel-perfect, accessible user interfaces and improving Core Web Vitals to deliver seamless user experiences at scale.",
        habilidades: [
          "React 18+",
          "TypeScript",
          "Next.js (App Router)",
          "Tailwind CSS",
          "Zustand / Redux Toolkit",
          "Vitest / Jest & RTL",
          "Web Performance (Core Web Vitals)",
          "CI/CD GitHub Actions",
          "Agile / Scrum",
        ],
        experienciaSugerida: [
          {
            cargo: "Senior Frontend Developer",
            empresa: "Fintech & Cloud Platform / Remote",
            periodo: "2022 - Present",
            logros: [
              "Architected modern component design systems in React and TypeScript, boosting cross-team velocity by [30]%.",
              "Optimized initial JavaScript bundle size by [45]% with code splitting and dynamic imports, improving LCP from 3.8s to 1.4s.",
              "Mentored [4] junior and mid-level engineers in test-driven development and modern state management patterns.",
            ],
          },
        ],
        educacionSugerida: [
          {
            titulo: "B.S. in Computer Science or Software Engineering",
            institucion: "State University / College of Engineering",
            periodo: "2016 - 2020",
          },
        ],
      },
    },
    stats: { usesCount: 890, likesCount: 165 },
  },

  // 6. Global / Remoto (Inglés): DevOps & Cloud Infrastructure Engineer
  {
    id: "seed-devops-cloud-en",
    titulo: "DevOps & Cloud Engineer (AWS & Terraform)",
    rol: "Cloud DevOps Engineer",
    categoria: "devops-cloud",
    nivel: "senior",
    idioma: "en",
    alcance: "GLOBAL_REMOTO",
    autorId: "jobnet-official",
    autorNombre: "JobNet Oficial",
    isOfficial: true,
    habilidades: [
      "Amazon Web Services (AWS)",
      "Terraform / Infrastructure as Code",
      "Docker & Kubernetes (EKS)",
      "GitHub Actions & GitLab CI",
      "Monitoring (Datadog, CloudWatch)",
      "Linux Administration & Bash",
      "Security & Compliance (IAM)",
      "Serverless (Lambda)",
    ],
    biografiaSugerida:
      "Cloud & DevOps Engineer passionate about building scalable, secure, and automated cloud architectures on AWS with Terraform. Experienced in orchestrating containerized microservices, reducing cloud infrastructure spend, and setting up bulletproof CI/CD deployment pipelines.",
    experienciaSugerida: [
      {
        cargo: "Senior DevOps Engineer",
        empresa: "Global SaaS Provider / Remote",
        periodo: "2021 - Present",
        logros: [
          "Provisioned full multi-environment infrastructure on AWS with Terraform, cutting environment spin-up time from days to [15] minutes.",
          "Reduced monthly AWS infrastructure expenditure by [28]% through right-sizing, auto-scaling, and Spot instances.",
          "Implemented automated CI/CD pipelines deploying over [50] daily releases with zero downtime.",
        ],
      },
    ],
    educacionSugerida: [
      {
        titulo: "B.S. in Computer Systems / Information Technology",
        institucion: "Institute of Technology",
        periodo: "2015 - 2019",
      },
    ],
    translations: {
      es: {
        titulo: "Ingeniero DevOps & Cloud (AWS & Terraform)",
        rol: "Ingeniero Cloud DevOps",
        biografiaSugerida:
          "Ingeniero Cloud & DevOps apasionado por diseñar arquitecturas escalables, seguras y automatizadas en AWS mediante Terraform. Con experiencia orquestando microservicios contenerizados, optimizando costes de infraestructura en la nube y construyendo pipelines robustos de CI/CD.",
        habilidades: [
          "Amazon Web Services (AWS)",
          "Terraform (IaC)",
          "Docker & Kubernetes (EKS)",
          "GitHub Actions / GitLab CI",
          "Monitoreo (CloudWatch, Datadog)",
          "Administración Linux & Bash",
          "Seguridad Cloud (IAM)",
          "Serverless (AWS Lambda)",
        ],
        experienciaSugerida: [
          {
            cargo: "Ingeniero DevOps Senior",
            empresa: "Proveedor Global SaaS / Remoto",
            periodo: "2021 - Presente",
            logros: [
              "Aprovisioné infraestructura multientorno completa en AWS con Terraform, reduciendo el despliegue de días a [15] minutos.",
              "Reduje el gasto mensual de infraestructura en AWS en un [28]% mediante autoescalado y adopción de instancias Spot.",
              "Implementé pipelines de CI/CD automatizados gestionando más de [50] despliegues diarios sin tiempo de inactividad.",
            ],
          },
        ],
        educacionSugerida: [
          {
            titulo: "Ingeniería en Sistemas Computacionales o Tecnologías de Información",
            institucion: "Instituto Tecnológico / Universidad Estatal",
            periodo: "2015 - 2019",
          },
        ],
      },
      en: {
        titulo: "DevOps & Cloud Engineer (AWS & Terraform)",
        rol: "Cloud DevOps Engineer",
        biografiaSugerida:
          "Cloud & DevOps Engineer passionate about building scalable, secure, and automated cloud architectures on AWS with Terraform. Experienced in orchestrating containerized microservices, reducing cloud infrastructure spend, and setting up bulletproof CI/CD deployment pipelines.",
        habilidades: [
          "Amazon Web Services (AWS)",
          "Terraform / Infrastructure as Code",
          "Docker & Kubernetes (EKS)",
          "GitHub Actions & GitLab CI",
          "Monitoring (Datadog, CloudWatch)",
          "Linux Administration & Bash",
          "Security & Compliance (IAM)",
          "Serverless (Lambda)",
        ],
        experienciaSugerida: [
          {
            cargo: "Senior DevOps Engineer",
            empresa: "Global SaaS Provider / Remote",
            periodo: "2021 - Present",
            logros: [
              "Provisioned full multi-environment infrastructure on AWS with Terraform, cutting environment spin-up time from days to [15] minutes.",
              "Reduced monthly AWS infrastructure expenditure by [28]% through right-sizing, auto-scaling, and Spot instances.",
              "Implemented automated CI/CD pipelines deploying over [50] daily releases with zero downtime.",
            ],
          },
        ],
        educacionSugerida: [
          {
            titulo: "B.S. in Computer Systems / Information Technology",
            institucion: "Institute of Technology",
            periodo: "2015 - 2019",
          },
        ],
      },
    },
    stats: { usesCount: 620, likesCount: 95 },
  },

  // 7. Bilingüe: Data Analyst & Business Intelligence
  {
    id: "seed-data-analyst-bilingual",
    titulo: "Data Analyst & BI Specialist (Bilingual ES/EN)",
    rol: "Data Analyst",
    categoria: "data-ai",
    nivel: "mid",
    idioma: "bilingual",
    alcance: "GLOBAL_REMOTO",
    autorId: "jobnet-official",
    autorNombre: "JobNet Oficial",
    isOfficial: true,
    habilidades: [
      "SQL (PostgreSQL, BigQuery)",
      "Python (Pandas, NumPy)",
      "Power BI & Tableau",
      "ETL Data Pipelines",
      "Excel Avanzado / Power Query",
      "Data Storytelling",
      "KPI Dashboards",
      "Bilingual English/Spanish C1",
    ],
    biografiaSugerida:
      "Bilingual Data Analyst skilled in transforming raw business data into actionable strategic insights. Proficient in complex SQL querying, Python analytics, and interactive dashboard creation in Power BI and Tableau. Experienced in partnering with executive leadership to track and optimize company KPIs.",
    experienciaSugerida: [
      {
        cargo: "Business Intelligence & Data Analyst",
        empresa: "Consultoría de Negocios & Data Analytics / Híbrido",
        periodo: "2022 - Presente",
        logros: [
          "Construí más de [15] dashboards interactivos en Power BI consumidos diariamente por directores de operaciones y finanzas.",
          "Desarrollé scripts en Python para automatizar procesos de extracción ETL ahorrando [12] horas semanales de trabajo manual.",
          "Identifiqué patrones de retención de clientes que impulsaron la reactivación de cuentas en un [18]%.",
        ],
      },
    ],
    educacionSugerida: [
      {
        titulo: "Licenciatura en Actuaría, Economía o Ingeniería en Datos",
        institucion: "Universidad Autónoma / Instituto Tecnológico",
        periodo: "2018 - 2022",
      },
    ],
    translations: {
      es: {
        titulo: "Analista de Datos & Especialista en BI",
        rol: "Analista de Datos y Business Intelligence",
        biografiaSugerida:
          "Analista de Datos bilingüe especializado en transformar datos crudos en recomendaciones estratégicas cuantificables. Dominio de consultas complejas en SQL, modelado con Python y desarrollo de dashboards ejecutivos en Power BI y Tableau. Experiencia colaborando estrechamente con la dirección para optimizar KPIs operativos.",
        habilidades: [
          "SQL (PostgreSQL, BigQuery)",
          "Python (Pandas, NumPy)",
          "Power BI & Tableau",
          "Pipelines ETL de Datos",
          "Excel Avanzado / Power Query",
          "Storytelling con Datos",
          "Dashboards de KPIs",
          "Inglés Fluido C1",
        ],
        experienciaSugerida: [
          {
            cargo: "Analista de Business Intelligence y Datos",
            empresa: "Consultoría de Negocios & Analítica / Híbrido",
            periodo: "2022 - Presente",
            logros: [
              "Construí más de [15] dashboards interactivos en Power BI consumidos diariamente por directores de operaciones y finanzas.",
              "Desarrollé scripts en Python para automatizar procesos de extracción ETL ahorrando [12] horas semanales de trabajo manual.",
              "Identifiqué patrones de retención de clientes que impulsaron la reactivación de cuentas en un [18]%.",
            ],
          },
        ],
        educacionSugerida: [
          {
            titulo: "Licenciatura en Actuaría, Economía o Ingeniería de Datos",
            institucion: "Universidad Estatal / Instituto Tecnológico",
            periodo: "2018 - 2022",
          },
        ],
      },
      en: {
        titulo: "Data Analyst & BI Specialist",
        rol: "Data Analyst & Business Intelligence",
        biografiaSugerida:
          "Bilingual Data Analyst skilled in transforming raw business data into actionable strategic insights. Proficient in complex SQL querying, Python analytics, and interactive dashboard creation in Power BI and Tableau. Experienced in partnering with executive leadership to track and optimize company KPIs.",
        habilidades: [
          "SQL (PostgreSQL, BigQuery)",
          "Python (Pandas, NumPy)",
          "Power BI & Tableau",
          "ETL Data Pipelines",
          "Advanced Excel / Power Query",
          "Data Storytelling",
          "KPI Executive Dashboards",
          "Fluent English C1",
        ],
        experienciaSugerida: [
          {
            cargo: "Business Intelligence & Data Analyst",
            empresa: "Business Consulting & Analytics / Hybrid",
            periodo: "2022 - Present",
            logros: [
              "Built over [15] interactive Power BI dashboards consumed daily by VP of Operations and Finance directors.",
              "Developed Python scripts automating ETL extraction workflows, saving [12] weekly hours of manual reporting.",
              "Identified customer retention patterns that accelerated account reactivation rates by [18]%."
            ],
          },
        ],
        educacionSugerida: [
          {
            titulo: "B.S. in Actuarial Science, Economics, or Data Engineering",
            institucion: "Autonomous University / Institute of Technology",
            periodo: "2018 - 2022",
          },
        ],
      },
    },
    stats: { usesCount: 470, likesCount: 82 },
  },

  // 8. Bilingüe: Atención al Cliente Técnica & Customer Success
  {
    id: "seed-customer-success-bilingual",
    titulo: "Bilingual Technical Support & Customer Success Specialist",
    rol: "Customer Success Specialist",
    categoria: "administracion-finanzas",
    nivel: "junior",
    idioma: "bilingual",
    alcance: "SUR_EDOMEX",
    autorId: "jobnet-official",
    autorNombre: "JobNet Oficial",
    isOfficial: true,
    habilidades: [
      "Inglés Avanzado / Fluido C1",
      "Zendesk & Jira Service Desk",
      "Resolución de Tickets Técnicos",
      "Comunicación Asertiva y Empatía",
      "Manejo de Situaciones Críticas",
      "SLA Management",
      "CRM HubSpot",
      "Atención Multicanal (Chat/Voz/Email)",
    ],
    biografiaSugerida:
      "Especialista bilingüe en Soporte Técnico y Éxito del Cliente con alta vocación de servicio y resolución rápida de incidencias. Con experiencia en herramientas como Zendesk y Jira, gestionando cuentas tanto del mercado hispanohablante como de Estados Unidos y Europa con excelentes índices de satisfacción (CSAT).",
    experienciaSugerida: [
      {
        cargo: "Especialista de Soporte Técnico Bilingüe",
        empresa: "Centro de Contacto & Servicios Globales / Toluca-Metepec",
        periodo: "2022 - Presente",
        logros: [
          "Mantuve una calificación de satisfacción al cliente (CSAT) del [96]% atendiendo más de 40 interacciones diarias.",
          "Reduje el tiempo promedio de primera respuesta (FRT) en un [25]% mediante la elaboración de guías de resolución rápida.",
          "Capacité a [8] nuevos representantes bilingües en políticas de servicio y uso avanzado de herramientas de soporte.",
        ],
      },
    ],
    educacionSugerida: [
      {
        titulo: "Licenciatura en Lenguas, Comunicación o Relaciones Internacionales",
        institucion: "Facultad de Lenguas (UAEMéx) / Universidad Estatal",
        periodo: "2018 - 2022",
      },
    ],
    translations: {
      es: {
        titulo: "Especialista en Soporte Técnico & Customer Success",
        rol: "Especialista de Atención y Éxito del Cliente",
        biografiaSugerida:
          "Especialista bilingüe en Soporte Técnico y Éxito del Cliente con alta vocación de servicio y resolución rápida de incidencias. Con experiencia en herramientas como Zendesk y Jira, gestionando cuentas tanto del mercado hispanohablante como de Estados Unidos y Europa con excelentes índices de satisfacción (CSAT).",
        habilidades: [
          "Inglés Avanzado / Fluido C1",
          "Zendesk & Jira Service Desk",
          "Resolución de Tickets Técnicos",
          "Comunicación Asertiva y Empatía",
          "Manejo de Situaciones Críticas",
          "Gestión de Acuerdos de Nivel de Servicio (SLA)",
          "CRM HubSpot",
          "Atención Multicanal (Chat/Voz/Email)",
        ],
        experienciaSugerida: [
          {
            cargo: "Especialista de Soporte Técnico Bilingüe",
            empresa: "Centro de Contacto & Servicios Globales / Toluca-Metepec",
            periodo: "2022 - Presente",
            logros: [
              "Mantuve una calificación de satisfacción al cliente (CSAT) del [96]% atendiendo más de 40 interacciones diarias.",
              "Reduje el tiempo promedio de primera respuesta (FRT) en un [25]% mediante la elaboración de guías de resolución rápida.",
              "Capacité a [8] nuevos representantes bilingües en políticas de servicio y uso avanzado de herramientas de soporte.",
            ],
          },
        ],
        educacionSugerida: [
          {
            titulo: "Licenciatura en Lenguas, Comunicación o Relaciones Internacionales",
            institucion: "Facultad de Lenguas (UAEMéx) / Universidad Estatal",
            periodo: "2018 - 2022",
          },
        ],
      },
      en: {
        titulo: "Technical Support & Customer Success Specialist",
        rol: "Customer Success & Tech Support Specialist",
        biografiaSugerida:
          "Bilingual Customer Success and Technical Support Specialist dedicated to fast incident resolution and delivering outstanding customer experiences. Proven track record utilizing Zendesk and Jira, supporting both North American and Latin American markets with top-tier CSAT ratings.",
        habilidades: [
          "Fluent English C1 / Professional",
          "Zendesk & Jira Service Desk",
          "Technical Ticket Troubleshooting",
          "Assertive Communication & Empathy",
          "Escalation & Crisis Handling",
          "SLA Performance Tracking",
          "HubSpot CRM",
          "Omnichannel Support (Chat/Voice/Email)",
        ],
        experienciaSugerida: [
          {
            cargo: "Bilingual Technical Support Specialist",
            empresa: "Contact Center & Global Services",
            periodo: "2022 - Present",
            logros: [
              "Maintained a [96]% Customer Satisfaction (CSAT) score while managing 40+ daily technical client inquiries.",
              "Reduced average First Response Time (FRT) by [25]% by authoring standard troubleshooting playbooks.",
              "Onboarded and trained [8] new bilingual representatives on support workflows and ticketing best practices.",
            ],
          },
        ],
        educacionSugerida: [
          {
            titulo: "B.A. in Modern Languages, Communications, or International Business",
            institucion: "State University / College of Languages",
            periodo: "2018 - 2022",
          },
        ],
      },
    },
    stats: { usesCount: 390, likesCount: 52 },
  },
];
