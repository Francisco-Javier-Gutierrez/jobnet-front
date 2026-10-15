import { describe, it, expect, vi, beforeEach } from "vitest";
import { ref } from "vue";
import { useCvInteraction } from "./useCvInteraction";

const mockFetch = vi.fn();
(globalThis as any).$fetch = mockFetch;
(globalThis as any).ref = ref;

const mockSession = ref<any>({
  user: {
    name: "Laura Reclutadora",
    companyName: "Tech Innovations SA",
  },
});

(globalThis as any).useRuntimeConfig = () => ({
  public: {
    apiUrl: "https://api.jobnet.test",
  },
});

(globalThis as any).useAuth = () => ({
  data: mockSession,
});

describe("useCvInteraction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSession.value = {
      user: {
        name: "Laura Reclutadora",
        companyName: "Tech Innovations SA",
      },
    };
  });

  it("should return false if candidateId is empty", async () => {
    const { notifyCvInteraction } = useCvInteraction();
    const result = await notifyCvInteraction("");
    expect(result).toEqual({ success: false });
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("should dispatch VIEW interaction notification using session recruiter data", async () => {
    mockFetch.mockResolvedValue({ success: true, sentPush: true });
    const { notifyCvInteraction } = useCvInteraction();

    const result = await notifyCvInteraction("cand-123", {
      vacancyTitle: "Senior Frontend Engineer",
    });

    expect(result).toEqual({ success: true, sentPush: true });
    expect(mockFetch).toHaveBeenCalledWith(
      "/api/candidates/cand-123/cv-interaction",
      expect.objectContaining({
        method: "POST",
        body: expect.objectContaining({
          action: "VIEW",
          recruiterName: "Laura Reclutadora",
          companyName: "Tech Innovations SA",
          vacancyTitle: "Senior Frontend Engineer",
        }),
      }),
    );
    expect(mockFetch).toHaveBeenCalledWith(
      "https://api.jobnet.test/profile/cand-123/cv-interaction",
      expect.objectContaining({
        method: "POST",
        body: expect.objectContaining({
          action: "VIEW",
          recruiterName: "Laura Reclutadora",
          companyName: "Tech Innovations SA",
        }),
      }),
    );
  });

  it("should dispatch DOWNLOAD interaction notification with explicit options overriding session", async () => {
    mockFetch.mockResolvedValue({ success: true, sentPush: true });
    const { notifyCvInteraction } = useCvInteraction();

    const result = await notifyCvInteraction("cand-456", {
      action: "DOWNLOAD",
      recruiterName: "Carlos Reclutador",
      companyName: "Empresa Global",
      vacancyTitle: "Backend Lead",
    });

    expect(result).toEqual({ success: true, sentPush: true });
    expect(mockFetch).toHaveBeenCalledWith(
      "/api/candidates/cand-456/cv-interaction",
      expect.objectContaining({
        method: "POST",
        body: expect.objectContaining({
          action: "DOWNLOAD",
          recruiterName: "Carlos Reclutador",
          companyName: "Empresa Global",
          vacancyTitle: "Backend Lead",
        }),
      }),
    );
  });

  it("should handle error gracefully and return false", async () => {
    mockFetch.mockImplementation(() => {
      throw new Error("Network fatal error");
    });
    const { notifyCvInteraction } = useCvInteraction();

    const result = await notifyCvInteraction("cand-789");
    expect(result).toEqual({ success: false });
  });
});
