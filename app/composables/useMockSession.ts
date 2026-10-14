export type MockRole = "CANDIDATO" | "EMPRESA" | "MODERATOR" | "ADMIN" | "GUEST";

export interface MockUserSession {
  id: string;
  name: string;
  email: string;
  tipoUsuario: string;
  role: string;
  avatarUrl?: string;
  nombreComercial?: string;
  companyId?: string;
}

const mockRoleState = ref<MockRole>("CANDIDATO");
const isMockEnabledState = ref(true);

const MOCK_ROLE_USERS: Record<Exclude<MockRole, "GUEST">, MockUserSession> = {
  CANDIDATO: {
    id: "candidate-francisco-gomez",
    name: "Francisco Gómez",
    email: "francisco.gomez@gmail.com",
    tipoUsuario: "CANDIDATO",
    role: "CANDIDATO",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80"
  },
  EMPRESA: {
    id: "org-techsolutions-01",
    companyId: "org-techsolutions-01",
    name: "TechSolutions México",
    nombreComercial: "TechSolutions México",
    email: "contacto@techsolutions.mx",
    tipoUsuario: "EMPRESA",
    role: "EMPRESA",
    avatarUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80"
  },
  MODERATOR: {
    id: "mod-official",
    name: "Moderador Oficial",
    email: "moderador@jobnet.com.mx",
    tipoUsuario: "MODERATOR",
    role: "MODERATOR",
    avatarUrl: "/logo.svg"
  },
  ADMIN: {
    id: "admin-official",
    name: "Administrador General",
    email: "admin@jobnet.com.mx",
    tipoUsuario: "ADMIN",
    role: "ADMIN",
    avatarUrl: "/logo.svg"
  }
};

export function useMockSession() {
  // Sync with localStorage on client
  if (import.meta.client) {
    const savedRole = localStorage.getItem("jobnet-mock-role") as MockRole | null;
    if (savedRole && (savedRole in MOCK_ROLE_USERS || savedRole === "GUEST")) {
      mockRoleState.value = savedRole;
    }
    const savedEnabled = localStorage.getItem("jobnet-mock-enabled");
    if (savedEnabled !== null) {
      isMockEnabledState.value = savedEnabled === "true";
    }
  }

  const currentMockUser = computed<MockUserSession | null>(() => {
    if (!isMockEnabledState.value || mockRoleState.value === "GUEST") {
      return null;
    }
    return MOCK_ROLE_USERS[mockRoleState.value] || null;
  });

  const setMockRole = (role: MockRole) => {
    mockRoleState.value = role;
    if (import.meta.client) {
      localStorage.setItem("jobnet-mock-role", role);
    }
  };

  const toggleMockEnabled = (enabled?: boolean) => {
    const val = enabled !== undefined ? enabled : !isMockEnabledState.value;
    isMockEnabledState.value = val;
    if (import.meta.client) {
      localStorage.setItem("jobnet-mock-enabled", String(val));
    }
  };

  return {
    mockRole: mockRoleState,
    isMockEnabled: isMockEnabledState,
    currentMockUser,
    setMockRole,
    toggleMockEnabled,
    availableRoles: ["CANDIDATO", "EMPRESA", "MODERATOR", "ADMIN", "GUEST"] as MockRole[]
  };
}
