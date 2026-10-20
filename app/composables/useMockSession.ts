import { ref, computed } from "vue";

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
  candidateId?: string;
}

const mockRoleState = ref<MockRole>("CANDIDATO");
const isMockEnabledState = ref(true);

export const MOCK_ROLE_USERS: Record<Exclude<MockRole, "GUEST">, MockUserSession> = {
  CANDIDATO: {
    id: "candidate-francisco-gomez",
    candidateId: "candidate-francisco-gomez",
    name: "[DEMO] Juan Pérez (Candidato Mock)",
    email: "juan.perez.mock@jobnet-demo.test",
    tipoUsuario: "CANDIDATO",
    role: "CANDIDATO",
    avatarUrl:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
  },
  EMPRESA: {
    id: "org-techsolutions-01",
    companyId: "org-techsolutions-01",
    name: "[MOCK] Acme Corp",
    nombreComercial: "[MOCK] Acme Corp",
    email: "contacto@mock-acmeweb.test",
    tipoUsuario: "EMPRESA",
    role: "EMPRESA",
    avatarUrl:
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80",
  },
  MODERATOR: {
    id: "mod-official",
    name: "[DEMO] Moderador de Pruebas",
    email: "moderador.demo@jobnet-mock.test",
    tipoUsuario: "MODERATOR",
    role: "MODERATOR",
    avatarUrl: "/logo.svg",
  },
  ADMIN: {
    id: "admin-official",
    name: "[DEMO] Administrador General (Mock)",
    email: "admin.demo@jobnet-mock.test",
    tipoUsuario: "ADMIN",
    role: "ADMIN",
    avatarUrl: "/logo.svg",
  },
};

export function useMockSession() {
  const cookieRole = useCookie<MockRole>("jobnet-mock-role", {
    default: () => "CANDIDATO",
  });
  const cookieEnabled = useCookie<boolean>("jobnet-mock-enabled", {
    default: () => true,
  });

  if (
    cookieRole.value &&
    (cookieRole.value in MOCK_ROLE_USERS || cookieRole.value === "GUEST")
  ) {
    mockRoleState.value = cookieRole.value;
  }
  if (cookieEnabled.value !== undefined) {
    isMockEnabledState.value = Boolean(cookieEnabled.value);
  }

  // Sync with localStorage on client
  if (import.meta.client) {
    const savedRole = localStorage.getItem("jobnet-mock-role") as MockRole | null;
    if (savedRole && (savedRole in MOCK_ROLE_USERS || savedRole === "GUEST")) {
      mockRoleState.value = savedRole;
      cookieRole.value = savedRole;
    }
    const savedEnabled = localStorage.getItem("jobnet-mock-enabled");
    if (savedEnabled !== null) {
      const b = savedEnabled === "true";
      isMockEnabledState.value = b;
      cookieEnabled.value = b;
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
    cookieRole.value = role;
    if (import.meta.client) {
      localStorage.setItem("jobnet-mock-role", role);
    }
  };

  const toggleMockEnabled = (enabled?: boolean) => {
    const val = enabled !== undefined ? enabled : !isMockEnabledState.value;
    isMockEnabledState.value = val;
    cookieEnabled.value = val;
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
    availableRoles: [
      "CANDIDATO",
      "EMPRESA",
      "MODERATOR",
      "ADMIN",
      "GUEST",
    ] as MockRole[],
  };
}
