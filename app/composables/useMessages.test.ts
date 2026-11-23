import { describe, it, expect, vi, beforeEach } from "vitest";
import { ref } from "vue";
import { setActivePinia, createPinia } from "pinia";
import { useMessages } from "./useMessages";

const mockFetch = vi.fn();
(globalThis as any).$fetch = mockFetch;

(globalThis as any).useRoute = () => ({
  query: {},
});

(globalThis as any).useRuntimeConfig = () => ({
  public: {
    apiUrl: "https://api.jobnet.test",
    wsUrl: "wss://ws.jobnet.test",
  },
});

const mockSession = ref<any>({
  user: { id: "org-1", tipoUsuario: "ORGANIZACION" },
});

(globalThis as any).useAuth = () => ({
  data: mockSession,
  status: ref("authenticated"),
});

describe("useMessages composable", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
    mockFetch.mockReset();
    mockSession.value = {
      user: { id: "org-1", tipoUsuario: "ORGANIZACION" },
    };
    if (typeof URL.createObjectURL !== "function") {
      URL.createObjectURL = vi.fn(() => "blob:mock-url");
    }
    if (typeof URL.revokeObjectURL !== "function") {
      URL.revokeObjectURL = vi.fn();
    }
  });

  it("should format timestamps correctly", () => {
    const { formatTime } = useMessages();
    expect(formatTime("")).toBe("");
    expect(formatTime("invalid-date")).toBe("");
    const valid = formatTime("2026-11-06T15:30:00.000Z");
    expect(typeof valid).toBe("string");
    expect(valid.length).toBeGreaterThan(0);
  });

  it("should validate and identify image extensions accurately", () => {
    const { isImageUrl } = useMessages();
    expect(isImageUrl("https://s3/pic.jpg")).toBe(true);
    expect(isImageUrl("https://s3/pic.png?token=123")).toBe(true);
    expect(isImageUrl("https://s3/cv.pdf")).toBe(false);
    expect(isImageUrl("")).toBe(false);
  });

  it("should handle staged file selection and cancellation cleanly", () => {
    const { stagedFile, handleFileUpload, cancelStagedFile } = useMessages();

    // Create a mock image file
    const file = new File(["fake content"], "comprobante.png", {
      type: "image/png",
    });

    const mockEvent = {
      target: {
        files: [file],
      },
    } as any;

    // Provide URL.createObjectURL mock
    (globalThis as any).URL.createObjectURL = vi.fn(
      () => "blob:http://localhost/blob-123",
    );
    (globalThis as any).URL.revokeObjectURL = vi.fn();

    handleFileUpload(mockEvent);

    expect(stagedFile.value).not.toBeNull();
    expect(stagedFile.value?.name).toBe("comprobante.png");
    expect(stagedFile.value?.isImage).toBe(true);
    expect(stagedFile.value?.previewUrl).toBe("blob:http://localhost/blob-123");

    cancelStagedFile();
    expect(stagedFile.value).toBeNull();
    expect(globalThis.URL.revokeObjectURL).toHaveBeenCalledWith(
      "blob:http://localhost/blob-123",
    );
  });

  it("should reject files exceeding 5MB size limit", () => {
    const { stagedFile, handleFileUpload } = useMessages();
    const largeFile = new File(
      [new Uint8Array(6 * 1024 * 1024)],
      "huge_cv.pdf",
      {
        type: "application/pdf",
      },
    );

    const mockEvent = {
      target: {
        files: [largeFile],
      },
    } as any;

    handleFileUpload(mockEvent);
    expect(stagedFile.value).toBeNull();
  });
});
