import { describe, it, expect, vi, beforeEach } from "vitest";
import { ref } from "vue";
import { setActivePinia, createPinia } from "pinia";
import { useMessages } from "./useMessages";

const { mockGetSecureViewUrl } = vi.hoisted(() => ({
  mockGetSecureViewUrl: vi.fn(),
}));

vi.mock("~/composables/useS3Upload", () => ({
  useS3Upload: () => ({
    uploadFile: vi.fn(),
    uploadError: ref(null),
    getSecureViewUrl: mockGetSecureViewUrl,
  }),
}));

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
    mockGetSecureViewUrl.mockReset();
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

  it("tracks attachment download loading state and resets after completion or error", async () => {
    const fileUrl = "https://s3.test/docs/cv.pdf";
    let resolveUrl!: (val: string) => void;
    mockGetSecureViewUrl.mockImplementationOnce(
      () =>
        new Promise<string>((resolve) => {
          resolveUrl = resolve;
        }),
    );

    const clickSpy = vi.fn();
    const createElSpy = vi
      .spyOn(document, "createElement")
      .mockImplementation((tagName: string) => {
        if (tagName === "a") {
          return {
            href: "",
            download: "",
            target: "",
            click: clickSpy,
          } as unknown as HTMLAnchorElement;
        }
        return document.createElement(tagName);
      });
    const appendSpy = vi
      .spyOn(document.body, "appendChild")
      .mockImplementation((node) => node);
    const removeSpy = vi
      .spyOn(document.body, "removeChild")
      .mockImplementation((node) => node);
    const openSpy = vi.spyOn(window, "open").mockImplementation(() => null);

    try {
      const { downloadAttachment, isDownloadingAttachment } = useMessages();
      expect(isDownloadingAttachment(null)).toBe(false);
      expect(isDownloadingAttachment(fileUrl)).toBe(false);

      const downloadPromise = downloadAttachment(fileUrl, "cv.pdf");
      expect(isDownloadingAttachment(fileUrl)).toBe(true);

      resolveUrl("https://s3.test/signed/cv.pdf");
      await downloadPromise;

      expect(isDownloadingAttachment(fileUrl)).toBe(false);
      expect(clickSpy).toHaveBeenCalledTimes(1);

      mockGetSecureViewUrl.mockRejectedValueOnce(new Error("S3 error"));
      await downloadAttachment(fileUrl, "cv.pdf");
      expect(openSpy).toHaveBeenCalledWith(fileUrl, "_blank");
      expect(isDownloadingAttachment(fileUrl)).toBe(false);
    } finally {
      createElSpy.mockRestore();
      appendSpy.mockRestore();
      removeSpy.mockRestore();
      openSpy.mockRestore();
    }
  });
});
