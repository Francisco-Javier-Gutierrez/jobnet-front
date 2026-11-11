import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  getAuthHeaders,
  resolveApiUrl,
  apiFetch,
  apiClient,
  useApiClient,
} from "./useApiClient";

describe("useApiClient Composable", () => {
  const originalFetch = (globalThis as any).$fetch;
  const originalUseAuth = (globalThis as any).useAuth;
  const originalUseRuntimeConfig = (globalThis as any).useRuntimeConfig;

  let mockFetch: any;
  let mockSessionData: any;

  beforeEach(() => {
    mockFetch = vi.fn().mockResolvedValue({ success: true });
    (globalThis as any).$fetch = mockFetch;

    mockSessionData = {
      idToken: "mock-id-token-12345",
      user: {
        id: "usr-candidate-99",
        email: "candidato@jobnet.com",
        tipoUsuario: "CANDIDATO",
      },
    };

    (globalThis as any).useAuth = vi.fn(() => ({
      data: {
        value: mockSessionData,
      },
    }));

    (globalThis as any).useRuntimeConfig = vi.fn(() => ({
      public: {
        apiUrl: "https://api.test.jobnet.internal",
      },
    }));
  });

  afterEach(() => {
    (globalThis as any).$fetch = originalFetch;
    (globalThis as any).useAuth = originalUseAuth;
    (globalThis as any).useRuntimeConfig = originalUseRuntimeConfig;
    vi.restoreAllMocks();
  });

  describe("getAuthHeaders", () => {
    it("should extract token, userId, role, and email from session", () => {
      const headers = getAuthHeaders();

      expect(headers["Authorization"]).toBe("Bearer mock-id-token-12345");
      expect(headers["x-user-id"]).toBe("usr-candidate-99");
      expect(headers["x-user-role"]).toBe("CANDIDATO");
      expect(headers["x-user-email"]).toBe("candidato@jobnet.com");
    });

    it("should handle session where properties are flat", () => {
      (globalThis as any).useAuth = vi.fn(() => ({
        data: {
          value: {
            accessToken: "token-flat",
            userId: "u-flat",
            role: "ORGANIZACION",
            email: "org@jobnet.com",
          },
        },
      }));

      const headers = getAuthHeaders();
      expect(headers["Authorization"]).toBe("Bearer token-flat");
      expect(headers["x-user-id"]).toBe("u-flat");
      expect(headers["x-user-role"]).toBe("ORGANIZACION");
      expect(headers["x-user-email"]).toBe("org@jobnet.com");
    });

    it("should return empty headers if unauthenticated or useAuth fails", () => {
      (globalThis as any).useAuth = vi.fn(() => ({
        data: { value: null },
      }));

      const headers = getAuthHeaders();
      expect(headers).toEqual({});
    });

    it("should handle when useAuth is not defined or throws", () => {
      delete (globalThis as any).useAuth;
      expect(getAuthHeaders()).toEqual({});

      (globalThis as any).useAuth = "not a function";
      expect(getAuthHeaders()).toEqual({});

      (globalThis as any).useAuth = () => {
        throw new Error("Context error");
      };
      expect(getAuthHeaders()).toEqual({});
    });

    it("should merge custom headers with priority", () => {
      const headers = getAuthHeaders({
        "x-custom": "hello",
        "x-user-role": "OVERRIDDEN_ROLE",
      });

      expect(headers["x-custom"]).toBe("hello");
      expect(headers["x-user-role"]).toBe("OVERRIDDEN_ROLE");
      expect(headers["x-user-id"]).toBe("usr-candidate-99");
    });
  });

  describe("resolveApiUrl", () => {
    it("should return empty string if endpoint is empty", () => {
      expect(resolveApiUrl("")).toBe("");
    });

    it("should return absolute URLs as-is", () => {
      expect(resolveApiUrl("https://other-domain.com/endpoint")).toBe(
        "https://other-domain.com/endpoint",
      );
      expect(resolveApiUrl("http://localhost:3000/test")).toBe(
        "http://localhost:3000/test",
      );
    });

    it("should return internal /api/ routes untouched", () => {
      expect(resolveApiUrl("/api/posts")).toBe("/api/posts");
      expect(resolveApiUrl("/api/auth/register")).toBe("/api/auth/register");
    });

    it("should prepend config.public.apiUrl to relative paths", () => {
      expect(resolveApiUrl("/profile/user-123")).toBe(
        "https://api.test.jobnet.internal/profile/user-123",
      );
      expect(resolveApiUrl("jobs/filter")).toBe(
        "https://api.test.jobnet.internal/jobs/filter",
      );
    });

    it("should support apiBase if apiUrl is not set", () => {
      (globalThis as any).useRuntimeConfig = vi.fn(() => ({
        public: {
          apiBase: "https://apibase.jobnet.internal",
        },
      }));

      expect(resolveApiUrl("/profile/user-456")).toBe(
        "https://apibase.jobnet.internal/profile/user-456",
      );
    });

    it("should fallback to default AWS url if neither apiUrl nor apiBase is set", () => {
      (globalThis as any).useRuntimeConfig = vi.fn(() => ({
        public: {},
      }));

      expect(resolveApiUrl("/jobs")).toBe(
        "https://olhoy8ebq7.execute-api.us-east-1.amazonaws.com/jobs",
      );
    });

    it("should use fallback if useRuntimeConfig is not available", () => {
      (globalThis as any).useRuntimeConfig = vi.fn(() => {
        throw new Error("No config context");
      });

      const url = resolveApiUrl("/profile/u1");
      expect(url).toBe(
        "https://olhoy8ebq7.execute-api.us-east-1.amazonaws.com/profile/u1",
      );
    });
  });

  describe("apiFetch", () => {
    it("should inject auth headers and send request via $fetch", async () => {
      await apiFetch("/profile/usr-candidate-99", {
        method: "POST",
        body: { name: "Test User" },
      });

      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.test.jobnet.internal/profile/usr-candidate-99",
        expect.objectContaining({
          method: "POST",
          headers: expect.objectContaining({
            Authorization: "Bearer mock-id-token-12345",
            "x-user-id": "usr-candidate-99",
            "x-user-role": "CANDIDATO",
            "x-user-email": "candidato@jobnet.com",
            "Content-Type": "application/json",
          }),
          body: { name: "Test User" },
        }),
      );
    });

    it("should respect explicit Content-Type header if already set", async () => {
      await apiFetch("/upload", {
        method: "POST",
        headers: { "Content-Type": "multipart/form-data" },
        body: "raw-data",
      });

      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.test.jobnet.internal/upload",
        expect.objectContaining({
          headers: expect.objectContaining({
            "Content-Type": "multipart/form-data",
          }),
        }),
      );
    });

    it("should not set Content-Type header if body is FormData", async () => {
      class MockFormData {}
      (globalThis as any).FormData = MockFormData;
      const formData = new MockFormData();

      await apiFetch("/upload-form", {
        method: "POST",
        body: formData,
      });

      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.test.jobnet.internal/upload-form",
        expect.objectContaining({
          body: formData,
        }),
      );
      const callHeaders =
        mockFetch.mock.calls[mockFetch.mock.calls.length - 1][1].headers;
      expect(callHeaders["Content-Type"]).toBeUndefined();
    });
  });

  describe("apiClient HTTP verb helpers", () => {
    it("apiClient.get should call GET", async () => {
      await apiClient.get("/profile/me");
      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.test.jobnet.internal/profile/me",
        expect.objectContaining({ method: "GET" }),
      );
    });

    it("apiClient.post should call POST with body", async () => {
      await apiClient.post("/jobs", { title: "Dev" });
      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.test.jobnet.internal/jobs",
        expect.objectContaining({
          method: "POST",
          body: { title: "Dev" },
        }),
      );
    });

    it("apiClient.put should call PUT with body", async () => {
      await apiClient.put("/jobs/1", { title: "Senior Dev" });
      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.test.jobnet.internal/jobs/1",
        expect.objectContaining({
          method: "PUT",
          body: { title: "Senior Dev" },
        }),
      );
    });

    it("apiClient.patch should call PATCH with body", async () => {
      await apiClient.patch("/jobs/1", { status: "CLOSED" });
      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.test.jobnet.internal/jobs/1",
        expect.objectContaining({
          method: "PATCH",
          body: { status: "CLOSED" },
        }),
      );
    });

    it("apiClient.delete should call DELETE", async () => {
      await apiClient.delete("/jobs/1");
      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.test.jobnet.internal/jobs/1",
        expect.objectContaining({ method: "DELETE" }),
      );
    });
  });

  describe("useApiClient composable wrapper", () => {
    it("should return apiFetch, apiClient, getAuthHeaders, resolveApiUrl, and apiUrl", () => {
      const client = useApiClient();
      expect(client.apiFetch).toBeDefined();
      expect(client.apiClient).toBeDefined();
      expect(client.getAuthHeaders).toBeDefined();
      expect(client.resolveApiUrl).toBeDefined();
      expect(client.apiUrl).toBe("https://api.test.jobnet.internal");
    });

    it("should support fallback in useApiClient when apiUrl is missing", () => {
      (globalThis as any).useRuntimeConfig = vi.fn(() => ({
        public: {
          apiBase: "https://fallback.internal",
        },
      }));
      const client = useApiClient();
      expect(client.apiUrl).toBe("https://fallback.internal");

      (globalThis as any).useRuntimeConfig = vi.fn(() => ({
        public: {},
      }));
      const clientEmpty = useApiClient();
      expect(clientEmpty.apiUrl).toBe("");
    });
  });
});
