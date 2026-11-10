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

vi.stubGlobal("useAuth", () => ({
  status: mockAuthStatus,
  data: mockAuthData,
  signOut: vi.fn(),
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
});
