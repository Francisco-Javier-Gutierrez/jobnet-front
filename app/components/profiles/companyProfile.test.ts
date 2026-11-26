import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import CompanyLists from "./CompanyLists.vue";
import CompanyAboutSection from "./CompanyAboutSection.vue";
import CompanyVerificationSection from "./CompanyVerificationSection.vue";
import type { CompanyProfile, Post, Job } from "~/types";

describe("Visualización Detallada de Perfil de Organización", () => {
  const MOCK_COMPANY: CompanyProfile = {
    id: "org-123",
    companyId: "org-123",
    name: "TechSolutions Inc.",
    nombre: "TechSolutions Inc.",
    nombreComercial: "TechSolutions Inc.",
    razonSocial: "TechSolutions S.A. de C.V.",
    rfc: "TSI210315AB1",
    sector: "Desarrollo de Software y Cloud Computing",
    tamanoEmpresa: "250 - 500 colaboradores",
    location: "Toluca, Estado de México",
    email: "contacto@techsolutions.mx",
    telefono: "+52 722 123 4567",
    website: "https://techsolutions.mx",
    websiteDisplay: "techsolutions.mx",
    about:
      "Líderes en soluciones de ingeniería en la nube e inteligencia artificial para empresas de alta escala.",
    mision:
      "Democratizar la infraestructura cloud con altos estándares de seguridad y eficiencia operativa.",
    vision:
      "Consolidarnos como el referente tecnológico institucional más confiable del país.",
    beneficios:
      "• Seguro de Gastos Médicos Mayores\n• Modalidad remota y flexible\n• Fondo de ahorro y vales",
    verified: true,
    organizacionVerificada: true,
    estatusVerificacion: "VERIFICADA",
    metodoVerificacion: "DOMINIO_CORPORATIVO",
    documents: [
      {
        id: "doc-1",
        nombre: "Certificación ISO 27001.pdf",
        tipo: "Seguridad y Calidad",
        url: "https://example.com/docs/iso-27001.pdf",
      },
    ],
    documentosVerificacion: [
      {
        nombre: "Constancia de Situación Fiscal SAT.pdf",
        tipo: "Validación Fiscal",
        url: "https://example.com/docs/csf.pdf",
        fecha: "2026-03-15",
      },
    ],
    vacancies: [
      {
        id: "vac-1",
        title: "Ingeniero Cloud AWS Senior",
        type: "Remoto",
        schedule: "Tiempo Completo",
        salary: "$65k MXN",
      },
      {
        id: "vac-2",
        title: "Desarrollador Full Stack Vue/Node",
        type: "Híbrido",
        schedule: "Tiempo Completo",
        salary: "$48k MXN",
      },
    ] as Job[],
  };

  const MOCK_POSTS: Post[] = [
    {
      uniqueId: "post-1",
      author: "TechSolutions Inc.",
      role: "Organización",
      authorUuid: "org-123",
      content:
        "Orgullosos de abrir 5 nuevas vacantes para nuestro equipo de ciberseguridad.",
      createdAt: "2026-10-14T10:00:00Z",
      sharesCount: 3,
      likesList: ["user-1"],
      bookmarksList: [],
      comments: [],
    },
  ];

  const MOCK_BOOKMARKS: Post[] = [
    {
      uniqueId: "post-bm-1",
      author: "Líder de Industria",
      role: "Reclutador",
      authorUuid: "author-2",
      content: "Tendencias salariales en el sector tech para 2026.",
      createdAt: "2026-10-13T12:00:00Z",
      sharesCount: 1,
      likesList: [],
      bookmarksList: ["org-123"],
      comments: [],
    },
  ];

  const MOCK_WEB_LINKS = [
    {
      name: "LinkedIn",
      url: "https://linkedin.com/company/techsolutions",
      icon: "work",
    },
    { name: "Portal Web", url: "https://techsolutions.mx", icon: "link" },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("1. Estructura de Pestañas Independientes en Perfil Institucional", () => {
    it("debe desplegar los 4 controles de pestañas independientes para visitantes públicos", () => {
      const wrapper = mount(CompanyLists, {
        props: {
          companyTab: "ficha",
          company: MOCK_COMPANY,
          companyPosts: MOCK_POSTS,
          companyBookmarkedPosts: [],
          loadingCompanyPosts: false,
          currentUserId: "visitor-1",
          isOwner: false,
          webLinks: MOCK_WEB_LINKS,
        },
        global: {
          stubs: {
            JobCard: true,
            PostCard: true,
          },
        },
      });

      const tabFicha = wrapper.find("#tab-ficha");
      const tabVacancies = wrapper.find("#tab-vacancies");
      const tabPosts = wrapper.find("#tab-posts");
      const tabVerification = wrapper.find("#tab-verification");
      const tabBookmarks = wrapper.find("#tab-bookmarks");

      expect(tabFicha.exists()).toBe(true);
      expect(tabFicha.text()).toContain("Ficha Corporativa");

      expect(tabVacancies.exists()).toBe(true);
      expect(tabVacancies.text()).toContain("Vacantes vigentes (2)");

      expect(tabPosts.exists()).toBe(true);
      expect(tabPosts.text()).toContain("Publicaciones (1)");

      expect(tabVerification.exists()).toBe(true);
      expect(tabVerification.text()).toContain("Distintivo de Verificación");

      // Guardados solo debe ser accesible para la propia organización (isOwner: true)
      expect(tabBookmarks.exists()).toBe(false);
    });

    it("debe mostrar la pestaña de guardados confidencial cuando la organización es propietaria", () => {
      const wrapper = mount(CompanyLists, {
        props: {
          companyTab: "bookmarks",
          company: MOCK_COMPANY,
          companyPosts: MOCK_POSTS,
          companyBookmarkedPosts: MOCK_BOOKMARKS,
          loadingCompanyPosts: false,
          currentUserId: "org-123",
          isOwner: true,
          webLinks: MOCK_WEB_LINKS,
        },
        global: {
          stubs: {
            JobCard: true,
            PostCard: true,
          },
        },
      });

      const tabBookmarks = wrapper.find("#tab-bookmarks");
      expect(tabBookmarks.exists()).toBe(true);
      expect(tabBookmarks.text()).toContain("Guardados (1)");
    });

    it("debe emitir update:companyTab al hacer clic en cualquiera de las pestañas", async () => {
      const wrapper = mount(CompanyLists, {
        props: {
          companyTab: "ficha",
          company: MOCK_COMPANY,
          companyPosts: MOCK_POSTS,
          companyBookmarkedPosts: [],
          loadingCompanyPosts: false,
          currentUserId: "visitor-1",
          isOwner: false,
          webLinks: MOCK_WEB_LINKS,
        },
        global: {
          stubs: {
            JobCard: true,
            PostCard: true,
          },
        },
      });

      await wrapper.find("#tab-vacancies").trigger("click");
      expect(wrapper.emitted("update:companyTab")?.[0]).toEqual(["vacancies"]);

      await wrapper.find("#tab-verification").trigger("click");
      expect(wrapper.emitted("update:companyTab")?.[1]).toEqual([
        "verification",
      ]);

      await wrapper.find("#tab-posts").trigger("click");
      expect(wrapper.emitted("update:companyTab")?.[2]).toEqual(["posts"]);

      await wrapper.find("#tab-ficha").trigger("click");
      expect(wrapper.emitted("update:companyTab")?.[3]).toEqual(["ficha"]);
    });
  });

  describe("2. Pestaña 1: Ficha Corporativa", () => {
    it("debe renderizar los datos legales, fiscales y de contacto institucionales", () => {
      const wrapper = mount(CompanyAboutSection, {
        props: {
          company: MOCK_COMPANY,
          webLinks: MOCK_WEB_LINKS,
        },
      });

      const text = wrapper.text();
      expect(text).toContain("Ficha Institucional y Legal");
      expect(text).toContain("TechSolutions S.A. de C.V."); // Razón Social
      expect(text).toContain("TechSolutions Inc."); // Nombre Comercial
      expect(text).toContain("TSI210315AB1"); // RFC
      expect(text).toContain("Desarrollo de Software y Cloud Computing"); // Sector
      expect(text).toContain("250 - 500 colaboradores"); // Tamaño
      expect(text).toContain("Toluca, Estado de México"); // Ubicación
      expect(text).toContain("contacto@techsolutions.mx"); // Email
      expect(text).toContain("+52 722 123 4567"); // Teléfono
      expect(text).toContain("techsolutions.mx"); // Web
    });

    it("debe renderizar la misión, visión, beneficios y cultura laboral", () => {
      const wrapper = mount(CompanyAboutSection, {
        props: {
          company: MOCK_COMPANY,
          webLinks: MOCK_WEB_LINKS,
        },
      });

      const text = wrapper.text();
      expect(text).toContain("Misión Corporativa");
      expect(text).toContain("Democratizar la infraestructura cloud");
      expect(text).toContain("Visión Corporativa");
      expect(text).toContain("Consolidarnos como el referente tecnológico");
      expect(text).toContain("Beneficios y Cultura Laboral");
      expect(text).toContain("Seguro de Gastos Médicos Mayores");
    });

    it("debe listar los documentos corporativos y emitir previewDoc al solicitar previsualización", async () => {
      const wrapper = mount(CompanyAboutSection, {
        props: {
          company: MOCK_COMPANY,
          webLinks: MOCK_WEB_LINKS,
        },
      });

      expect(wrapper.text()).toContain("Certificación ISO 27001.pdf");
      const previewButton = wrapper.find("button");
      await previewButton.trigger("click");

      expect(wrapper.emitted("previewDoc")).toBeTruthy();
      expect(wrapper.emitted("previewDoc")?.[0][0]).toEqual(
        MOCK_COMPANY.documents[0],
      );
    });
  });

  describe("3. Pestaña 2: Listado de Vacantes Vigentes", () => {
    it("debe renderizar el listado de vacantes vigentes activas", () => {
      const wrapper = mount(CompanyLists, {
        props: {
          companyTab: "vacancies",
          company: MOCK_COMPANY,
          companyPosts: MOCK_POSTS,
          companyBookmarkedPosts: [],
          loadingCompanyPosts: false,
          currentUserId: "visitor-1",
          isOwner: false,
          webLinks: MOCK_WEB_LINKS,
        },
        global: {
          stubs: {
            JobCard: {
              props: ["job"],
              template: `<div class="job-card-mock">{{ job.title }} - {{ job.salary }}</div>`,
            },
            PostCard: true,
          },
        },
      });

      const cards = wrapper.findAll(".job-card-mock");
      expect(cards).toHaveLength(2);
      expect(cards[0].text()).toContain("Ingeniero Cloud AWS Senior");
      expect(cards[1].text()).toContain("Desarrollador Full Stack Vue/Node");
    });

    it("debe ocultar vacantes para visitantes públicos si la organización se encuentra suspendida", () => {
      const suspendedCompany = {
        ...MOCK_COMPANY,
        estatus: "SUSPENDIDA",
        bloqueada: true,
      };

      const wrapper = mount(CompanyLists, {
        props: {
          companyTab: "vacancies",
          company: suspendedCompany,
          companyPosts: MOCK_POSTS,
          companyBookmarkedPosts: [],
          loadingCompanyPosts: false,
          currentUserId: "visitor-1",
          isOwner: false,
          webLinks: MOCK_WEB_LINKS,
        },
        global: {
          stubs: {
            JobCard: true,
            PostCard: true,
          },
        },
      });

      expect(wrapper.text()).toContain("Vacantes temporalmente ocultas");
      expect(wrapper.findAllComponents({ name: "JobCard" })).toHaveLength(0);
    });

    it("debe mostrar aviso de estado vacío cuando no existan vacantes registradas", () => {
      const emptyCompany = {
        ...MOCK_COMPANY,
        vacancies: [],
      };

      const wrapper = mount(CompanyLists, {
        props: {
          companyTab: "vacancies",
          company: emptyCompany,
          companyPosts: MOCK_POSTS,
          companyBookmarkedPosts: [],
          loadingCompanyPosts: false,
          currentUserId: "visitor-1",
          isOwner: false,
          webLinks: MOCK_WEB_LINKS,
        },
        global: {
          stubs: {
            JobCard: true,
            PostCard: true,
          },
        },
      });

      expect(wrapper.text()).toContain(
        "No hay vacantes abiertas registradas actualmente",
      );
    });
  });

  describe("4. Pestaña 3: Publicaciones en la Comunidad", () => {
    it("debe renderizar el feed de artículos institucionales", () => {
      const wrapper = mount(CompanyLists, {
        props: {
          companyTab: "posts",
          company: MOCK_COMPANY,
          companyPosts: MOCK_POSTS,
          companyBookmarkedPosts: [],
          loadingCompanyPosts: false,
          currentUserId: "visitor-1",
          isOwner: false,
          webLinks: MOCK_WEB_LINKS,
        },
        global: {
          stubs: {
            JobCard: true,
            PostCard: {
              props: ["post"],
              template: `<div class="post-card-mock">{{ post.content }}</div>`,
            },
          },
        },
      });

      const posts = wrapper.findAll(".post-card-mock");
      expect(posts).toHaveLength(1);
      expect(posts[0].text()).toContain(
        "Orgullosos de abrir 5 nuevas vacantes",
      );
    });

    it("debe mostrar estado de carga y estado vacío de publicaciones", () => {
      const loadingWrapper = mount(CompanyLists, {
        props: {
          companyTab: "posts",
          company: MOCK_COMPANY,
          companyPosts: [],
          loadingCompanyPosts: true,
          companyBookmarkedPosts: [],
          currentUserId: "visitor-1",
        },
        global: {
          stubs: {
            JobCard: true,
            PostCard: true,
            AppSkeletonLoader: {
              props: ["label"],
              template: '<div role="status">{{ label }}</div>',
            },
          },
        },
      });
      expect(loadingWrapper.text()).toContain("Cargando publicaciones...");

      const emptyWrapper = mount(CompanyLists, {
        props: {
          companyTab: "posts",
          company: MOCK_COMPANY,
          companyPosts: [],
          loadingCompanyPosts: false,
          companyBookmarkedPosts: [],
          currentUserId: "visitor-1",
        },
        global: { stubs: { JobCard: true, PostCard: true } },
      });
      expect(emptyWrapper.text()).toContain(
        "No hay publicaciones de la organización para mostrar",
      );
    });
  });

  describe("5. Pestaña 4: Estatus Oficial de su Distintivo de Verificación Empresarial", () => {
    it("debe exhibir el distintivo oficial de Organización Verificada con respaldo institucional", () => {
      const wrapper = mount(CompanyVerificationSection, {
        props: {
          company: MOCK_COMPANY,
        },
      });

      const text = wrapper.text();
      expect(text).toContain("Organización Verificada");
      expect(text).toContain(
        "Distintivo Oficial de Verificación Institucional",
      );
      expect(text).toContain("Acreditación Oficial");
      expect(text).toContain("JobNet Plataforma");
      expect(text).toContain(
        "ha acreditado formalmente su existencia jurídica",
      );
    });

    it("debe desplegar los métodos de validación institucional (Dominio Corporativo y SAT)", () => {
      const wrapper = mount(CompanyVerificationSection, {
        props: {
          company: MOCK_COMPANY,
        },
      });

      const text = wrapper.text();
      expect(text).toContain("Dominio Corporativo Privado (RN-3)");
      expect(text).toContain("Cotejo Fiscal Documental (SAT)");
      expect(text).toContain("TSI210315AB1");
      expect(text).toContain("techsolutions.mx");
    });

    it("debe detallar los 4 pilares de garantías de confianza para candidatos", () => {
      const wrapper = mount(CompanyVerificationSection, {
        props: {
          company: MOCK_COMPANY,
        },
      });

      const text = wrapper.text();
      expect(text).toContain("Autenticidad Jurídica");
      expect(text).toContain("Ofertas Legítimas");
      expect(text).toContain("Canal Directo Seguro");
      expect(text).toContain("Privacidad del CV");
    });

    it("debe desplegar los documentos probatorios de verificación con botón para previsualizarlos", async () => {
      const wrapper = mount(CompanyVerificationSection, {
        props: {
          company: MOCK_COMPANY,
        },
      });

      expect(wrapper.text()).toContain(
        "Documentación Probatoria de Verificación",
      );
      expect(wrapper.text()).toContain(
        "Constancia de Situación Fiscal SAT.pdf",
      );

      const previewBtn = wrapper.find("button");
      await previewBtn.trigger("click");

      expect(wrapper.emitted("previewDoc")).toBeTruthy();
      expect(wrapper.emitted("previewDoc")?.[0][0]).toEqual(
        MOCK_COMPANY.documentosVerificacion[0],
      );
    });

    it("debe mostrar el estatus correspondiente cuando una empresa se encuentra en trámite o no verificada", () => {
      const unverifiedCompany: CompanyProfile = {
        id: "org-unverified",
        name: "Nueva Empresa S.A.",
        verified: false,
        organizacionVerificada: false,
        estatusVerificacion: "PENDIENTE",
        metodoVerificacion: undefined,
      };

      const wrapper = mount(CompanyVerificationSection, {
        props: {
          company: unverifiedCompany,
        },
      });

      expect(wrapper.text()).toContain("Sin Verificación Oficial");
      expect(wrapper.text()).toContain("Estatus de Registro No Verificado");
      expect(wrapper.text()).toContain(
        "aún no ha completado el procedimiento probatorio",
      );
    });
  });
});
