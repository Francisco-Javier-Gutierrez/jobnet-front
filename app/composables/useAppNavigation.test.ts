import { describe, it, expect, vi, beforeEach } from "vitest";
import { reactive, ref } from "vue";
import { useAppNavigation } from "./useAppNavigation";

const mockRoute = reactive({
  path: "/",
});

const mockRouter = {
  push: vi.fn(),
};

const mockAuthStatus = ref<"authenticated" | "unauthenticated">(
  "authenticated",
);
const mockAuthData = ref<any>({
  user: {
    id: "user-1",
    name: "Admin User",
    email: "admin@jobnet.com",
    tipoUsuario: "ADMIN",
  },
});

vi.mock("vue-router", () => ({
  useRoute: () => mockRoute,
  useRouter: () => mockRouter,
}));

const mockSignOut = vi.fn();

vi.stubGlobal("useAuth", () => ({
  status: mockAuthStatus,
  data: mockAuthData,
  signOut: mockSignOut,
}));

vi.mock("~/composables/useProtectedAction", () => ({
  useProtectedAction: () => ({
    openProtectedModal: vi.fn(),
  }),
}));

vi.mock("~/composables/useProfileState", () => ({
  useProfileState: () => ({
    profilePic: ref(""),
    hasFetched: ref(true),
    fetchProfilePic: vi.fn(),
  }),
}));

describe("useAppNavigation", () => {
  beforeEach(() => {
    mockRoute.path = "/";
    mockSignOut.mockReset();
    mockSignOut.mockResolvedValue(undefined);
  });

  describe("isActive route matching", () => {
    it("should highlight exact home route '/' only when on '/'", () => {
      const { isActive } = useAppNavigation();
      mockRoute.path = "/";
      expect(isActive("/")).toBe(true);

      mockRoute.path = "/admin";
      expect(isActive("/")).toBe(false);

      mockRoute.path = "/vacancies";
      expect(isActive("/")).toBe(false);
    });

    it("should highlight /admin only when exactly on /admin, not on subroutes like /admin/analytics", () => {
      const { isActive } = useAppNavigation();

      mockRoute.path = "/admin";
      expect(isActive("/admin")).toBe(true);
      expect(isActive("/admin/analytics")).toBe(false);

      // When visiting /admin/analytics, /admin must NOT be active
      mockRoute.path = "/admin/analytics";
      expect(isActive("/admin")).toBe(false);
      expect(isActive("/admin/analytics")).toBe(true);

      // When visiting other admin subroutes
      mockRoute.path = "/admin/organizations";
      expect(isActive("/admin")).toBe(false);
      expect(isActive("/admin/organizations")).toBe(true);

      mockRoute.path = "/admin/catalog";
      expect(isActive("/admin")).toBe(false);
      expect(isActive("/admin/catalog")).toBe(true);

      mockRoute.path = "/admin/fraud";
      expect(isActive("/admin")).toBe(false);
      expect(isActive("/admin/fraud")).toBe(true);
    });

    it("should handle trailing slashes correctly", () => {
      const { isActive } = useAppNavigation();

      mockRoute.path = "/admin/";
      expect(isActive("/admin")).toBe(true);

      mockRoute.path = "/admin/analytics/";
      expect(isActive("/admin/analytics")).toBe(true);
      expect(isActive("/admin")).toBe(false);
    });

    it("should not match routes with common string prefixes without slash delimiter", () => {
      const { isActive } = useAppNavigation();

      mockRoute.path = "/create-vacancy";
      expect(isActive("/create")).toBe(false);
    });

    it("should keep /vacancies active when viewing job details (/jobs/:id)", () => {
      const { isActive } = useAppNavigation();

      mockRoute.path = "/jobs/123";
      expect(isActive("/vacancies")).toBe(true);
    });

    it("should keep /companies active when viewing company details (/company/:id)", () => {
      const { isActive } = useAppNavigation();

      mockRoute.path = "/company/456";
      expect(isActive("/companies")).toBe(true);
    });
  });

  describe("navSections for admin", () => {
    it("should include /admin/fraud under Moderación & Auditoría", () => {
      const { navSections } = useAppNavigation();
      const modSection = navSections.value.find(
        (s) => s.title === "Moderación & Auditoría",
      );
      expect(modSection).toBeDefined();

      const fraudItem = modSection?.items.find((i) => i.to === "/admin/fraud");
      expect(fraudItem).toBeDefined();
      expect(fraudItem?.label).toBe("Reportes de Fraude");
    });
  });

  describe("primaryAction per role", () => {
    it("should show 'Crear Nuevo recurso' for organization role", () => {
      mockAuthData.value = {
        user: {
          id: "org-1",
          name: "Acme Corp",
          tipoUsuario: "ORGANIZACION",
        },
      };
      const { primaryAction } = useAppNavigation();
      expect(primaryAction.value?.label).toBe("Crear Nuevo recurso");
      expect(primaryAction.value?.to).toBe("/create");
    });

    it("should show 'Crear Publicación' for candidate role", () => {
      mockAuthData.value = {
        user: {
          id: "cand-1",
          name: "Dev Candidate",
          tipoUsuario: "CANDIDATO",
        },
      };
      const { primaryAction } = useAppNavigation();
      expect(primaryAction.value?.label).toBe("Crear Publicación");
    });
  });

  describe("onSignOut loading guard", () => {
    it("sets isSigningOut while signOut is pending and prevents duplicate calls", async () => {
      let resolveSignOut!: () => void;
      mockSignOut.mockImplementation(
        () =>
          new Promise<void>((resolve) => {
            resolveSignOut = resolve;
          }),
      );

      const { isSigningOut, onSignOut } = useAppNavigation();
      expect(isSigningOut.value).toBe(false);

      const firstPromise = onSignOut();
      expect(isSigningOut.value).toBe(true);
      expect(mockSignOut).toHaveBeenCalledTimes(1);
      expect(mockSignOut).toHaveBeenCalledWith({ callbackUrl: "/login" });

      // Concurrent trigger while still signing out must be ignored
      await onSignOut();
      expect(mockSignOut).toHaveBeenCalledTimes(1);

      resolveSignOut();
      await firstPromise;
      expect(isSigningOut.value).toBe(false);
    });

    it("resets isSigningOut even if signOut rejects", async () => {
      mockSignOut.mockRejectedValueOnce(new Error("Network error"));
      const { isSigningOut, onSignOut } = useAppNavigation();

      await expect(onSignOut()).rejects.toThrow("Network error");
      expect(isSigningOut.value).toBe(false);
    });
  });
});
