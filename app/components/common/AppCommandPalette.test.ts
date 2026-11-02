import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import { ref } from "vue";
import AppCommandPalette from "./AppCommandPalette.vue";

const mockIsOpen = ref(true);
const mockCloseCommandPalette = vi.fn();
const mockOpenCommandPalette = vi.fn();
const mockPush = vi.fn();
const mockSignOut = vi.fn();
const mockToggleTheme = vi.fn();
const mockIsDark = ref(false);

const mockAuthStatus = ref<"authenticated" | "unauthenticated" | "loading">(
  "unauthenticated",
);
const mockAuthData = ref<any>(null);

vi.stubGlobal("useAuth", () => ({
  status: mockAuthStatus,
  data: mockAuthData,
  signOut: mockSignOut,
}));

vi.mock("~/composables/useCommandPalette", () => ({
  useCommandPalette: () => ({
    isOpen: mockIsOpen,
    closeCommandPalette: mockCloseCommandPalette,
    openCommandPalette: mockOpenCommandPalette,
  }),
}));

vi.mock("vue-router", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

vi.mock("~/composables/useTheme", () => ({
  useTheme: () => ({
    isDark: mockIsDark,
    toggleTheme: mockToggleTheme,
  }),
}));

vi.mock("~/stores/jobs", () => ({
  useJobsStore: () => ({
    jobs: [],
    fetchJobs: vi.fn(),
  }),
}));

vi.mock("~/composables/useCommunityCvTemplates", () => ({
  useCommunityCvTemplates: () => ({
    filteredTemplates: ref([]),
    fetchTemplates: vi.fn(),
  }),
}));

describe("AppCommandPalette.vue Role-Based Filtering", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockIsOpen.value = true;
    mockIsDark.value = false;
  });

  it("filters command palette correctly for GUEST role", () => {
    mockAuthStatus.value = "unauthenticated";
    mockAuthData.value = null;

    const wrapper = mount(AppCommandPalette);
    const renderedText = wrapper.text();

    // Universal items should be present
    expect(renderedText).toContain("Cambiar a Modo Oscuro");
    expect(renderedText).toContain("Mapa Interactivo de Empleos");
    expect(renderedText).toContain("Directorio de Organizaciones");

    // Guest actions should be present
    expect(renderedText).toContain("Iniciar Sesión");
    expect(renderedText).toContain("Registrarse como Candidato");
    expect(renderedText).toContain("Registrar Organización o Empresa");
    expect(renderedText).toContain("Explorar Vacantes");

    // Company, candidate private, and admin actions MUST NOT be present
    expect(renderedText).not.toContain("Publicar Oferta de Empleo");
    expect(renderedText).not.toContain("Tablero ATS");
    expect(renderedText).not.toContain("Mis Vacantes Activas");
    expect(renderedText).not.toContain("Vacantes Guardadas");
    expect(renderedText).not.toContain("Ver Mis Postulaciones");
    expect(renderedText).not.toContain("Métricas y Analítica Global");
  });

  it("filters command palette correctly for CANDIDATE role", () => {
    mockAuthStatus.value = "authenticated";
    mockAuthData.value = {
      user: {
        id: "cand-123",
        name: "Juan Candidato",
        tipoUsuario: "CANDIDATO",
      },
    };

    const wrapper = mount(AppCommandPalette);
    const renderedText = wrapper.text();

    // Candidate quick actions and navigation
    expect(renderedText).toContain("Ver Mis Postulaciones");
    expect(renderedText).toContain("Comunidad de Plantillas de CV");
    expect(renderedText).toContain("Vacantes Guardadas");
    expect(renderedText).toContain("Mi Perfil Profesional");
    expect(renderedText).toContain("Mensajes y Chat");
    expect(renderedText).toContain("Cerrar Sesión");

    // Universal items
    expect(renderedText).toContain("Explorar Vacantes");
    expect(renderedText).toContain("Mapa Interactivo de Empleos");

    // Company or Admin actions MUST NOT appear for Candidate
    expect(renderedText).not.toContain("Publicar Oferta de Empleo");
    expect(renderedText).not.toContain("Tablero ATS de Postulantes");
    expect(renderedText).not.toContain("Mis Vacantes Activas");
    expect(renderedText).not.toContain("Estatus de Verificación");
    expect(renderedText).not.toContain("Métricas y Analítica Global");
  });

  it("filters command palette correctly for ORGANIZATION / EMPRESA role", () => {
    mockAuthStatus.value = "authenticated";
    mockAuthData.value = {
      user: {
        id: "org-456",
        name: "Tech Solutions",
        tipoUsuario: "ORGANIZACION",
      },
    };

    const wrapper = mount(AppCommandPalette);
    const renderedText = wrapper.text();

    // Organization specific quick actions and navigation
    expect(renderedText).toContain("Publicar Oferta de Empleo");
    expect(renderedText).toContain("Tablero ATS de Postulantes");
    expect(renderedText).toContain("Mis Vacantes Activas");
    expect(renderedText).toContain("Estatus de Verificación");
    expect(renderedText).toContain("Perfil de la Organización");
    expect(renderedText).toContain("Soporte y Apelaciones");
    expect(renderedText).toContain("Cerrar Sesión");

    // Universal items
    expect(renderedText).toContain("Mapa Interactivo de Empleos");
    expect(renderedText).toContain("Directorio de Organizaciones");

    // Blocked routes for company MUST NOT appear
    expect(renderedText).not.toContain("Explorar Vacantes");
    expect(renderedText).not.toContain("Comunidad de Plantillas de CV");
    expect(renderedText).not.toContain("Ver Mis Postulaciones");
    expect(renderedText).not.toContain("Métricas y Analítica Global");
  });

  it("filters command palette correctly for ADMIN role", () => {
    mockAuthStatus.value = "authenticated";
    mockAuthData.value = {
      user: {
        id: "admin-789",
        name: "Super Admin",
        tipoUsuario: "ADMIN",
      },
    };

    const wrapper = mount(AppCommandPalette);
    const renderedText = wrapper.text();

    // Admin specific quick actions and navigation
    expect(renderedText).toContain("Panel Principal y Monitoreo");
    expect(renderedText).toContain("Métricas y Analítica Global");
    expect(renderedText).toContain("Gestión de Organizaciones");
    expect(renderedText).toContain("Catálogo Maestro");
    expect(renderedText).toContain("Auditoría de Seguridad y Fraude");
    expect(renderedText).toContain("Campañas de Notificaciones Push");

    // Company publication or candidate CV templates MUST NOT appear for Admin
    expect(renderedText).not.toContain("Publicar Oferta de Empleo");
    expect(renderedText).not.toContain("Comunidad de Plantillas de CV");
    expect(renderedText).not.toContain("Ver Mis Postulaciones");
  });
});
