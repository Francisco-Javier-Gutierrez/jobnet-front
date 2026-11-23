import { describe, it, expect, vi, beforeEach } from "vitest";
import { useTerms } from "./useTerms";

// Mock Nuxt imports
const mockFetch = vi.fn();
(globalThis as any).$fetch = mockFetch;

vi.mock("#imports", () => ({
  useRuntimeConfig: () => ({
    public: {
      apiUrl: "https://api.test.jobnet.com",
    },
  }),
}));

describe("useTerms Composable", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should initialize with default terms values", () => {
    const { currentTerms, loading, updating, error } = useTerms();
    expect(currentTerms.value.version).toBe("1.0.0");
    expect(currentTerms.value.effectiveDate).toBe("13 de agosto de 2026");
    expect(loading.value).toBe(false);
    expect(updating.value).toBe(false);
    expect(error.value).toBeNull();
  });

  it("should fetch and update current terms successfully", async () => {
    mockFetch.mockResolvedValueOnce({
      version: "1.2.0",
      title: "Términos Modificados",
      summary: "Actualizaciones de privacidad y resolución de conflictos.",
      effectiveDate: "2026-11-09",
    });

    const { currentTerms, fetchCurrentTerms } = useTerms();
    await fetchCurrentTerms();

    expect(mockFetch).toHaveBeenCalledWith(
      "https://api.test.jobnet.com/terms/version",
      expect.objectContaining({ method: "GET" }),
    );
    expect(currentTerms.value.version).toBe("1.2.0");
    expect(currentTerms.value.summary).toContain("privacidad");
  });

  it("should retain fallback when fetchCurrentTerms encounters error", async () => {
    mockFetch.mockRejectedValueOnce(new Error("Network offline"));

    const { currentTerms, fetchCurrentTerms } = useTerms();
    await fetchCurrentTerms();

    expect(currentTerms.value.version).toBe("1.0.0");
  });

  it("should fetch terms history successfully", async () => {
    mockFetch.mockResolvedValueOnce({
      history: [
        { version: "1.1.0", effectiveDate: "2026-11-09" },
        { version: "1.0.0", effectiveDate: "2026-08-13" },
      ],
    });

    const { history, fetchTermsHistory } = useTerms();
    await fetchTermsHistory();

    expect(mockFetch).toHaveBeenCalledWith(
      "https://api.test.jobnet.com/admin/terms/history",
      expect.objectContaining({ method: "GET" }),
    );
    expect(history.value.length).toBe(2);
    expect(history.value[0].version).toBe("1.1.0");
  });

  it("should update terms and trigger push / in-app notification broadcast", async () => {
    mockFetch.mockResolvedValueOnce({
      success: true,
      version: "1.3.0",
      notifiedCount: 15,
    }); // update response
    mockFetch.mockResolvedValueOnce({
      version: "1.3.0",
      title: "Términos y Condiciones",
      summary: "Nueva versión aprobada",
      effectiveDate: "2026-11-10",
    }); // refresh current

    const { updateTermsAndBroadcast, currentTerms } = useTerms();
    const result = await updateTermsAndBroadcast({
      version: "1.3.0",
      summary: "Nueva versión aprobada",
      effectiveDate: "2026-11-10",
      notifyUsers: true,
    });

    expect(result.success).toBe(true);
    expect(result.notifiedCount).toBe(15);
    expect(currentTerms.value.version).toBe("1.3.0");
  });

  it("should handle error during updateTermsAndBroadcast", async () => {
    mockFetch.mockRejectedValueOnce({
      data: { error: "Acceso denegado: Se requiere rol ADMIN" },
    });

    const { updateTermsAndBroadcast, error } = useTerms();
    await expect(
      updateTermsAndBroadcast({
        version: "2.0.0",
        summary: "Fallo",
        effectiveDate: "2026-11-09",
      }),
    ).rejects.toThrow("Acceso denegado: Se requiere rol ADMIN");

    expect(error.value).toBe("Acceso denegado: Se requiere rol ADMIN");
  });
});
