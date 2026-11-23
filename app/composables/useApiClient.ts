import { useRuntimeConfig, useAuth } from "#imports";

/**
 * Extracts authentication and identity headers from the active Nuxt session.
 * Standardizes Authorization Bearer tokens, x-user-id, x-user-role, and x-user-email.
 */
export function getAuthHeaders(
  customHeaders?: Record<string, string>,
): Record<string, string> {
  const headers: Record<string, string> = {};

  let auth: any = null;
  try {
    auth = useAuth();
  } catch {
    // Graceful fallback when useAuth is not available (e.g. static tests or SSR edge cases)
  }

  const session = (auth?.data?.value ?? auth?.data) as any;

  if (session) {
    const token =
      session.idToken ||
      session.accessToken ||
      session.token ||
      session.user?.idToken ||
      session.user?.accessToken ||
      session.user?.token;

    const userId =
      session.user?.id ||
      session.user?.uuid ||
      session.user?.sub ||
      session.userId ||
      session.id ||
      "";

    const role =
      session.user?.tipoUsuario ||
      session.user?.role ||
      session.tipoUsuario ||
      session.role ||
      "";

    const email = session.user?.email || session.email || "";

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    if (userId) {
      headers["x-user-id"] = String(userId);
    }
    if (role) {
      headers["x-user-role"] = String(role);
    }
    if (email) {
      headers["x-user-email"] = String(email);
    }
  }

  if (customHeaders) {
    Object.assign(headers, customHeaders);
  }

  return headers;
}

/**
 * Resolves a target endpoint to a full API URL.
 * Preserves absolute URLs and internal Nitro routes (/api/...).
 * Prepends runtimeConfig.public.apiUrl for external backend paths (/profile, /jobs, etc.).
 */
export function resolveApiUrl(endpoint: string): string {
  if (!endpoint) return "";

  // Absolute URLs (http:// or https://)
  if (/^https?:\/\//i.test(endpoint)) {
    return endpoint;
  }

  // Internal Nitro server routes
  if (endpoint.startsWith("/api/") || endpoint.startsWith("/_nuxt/")) {
    return endpoint;
  }

  let baseUrl = "";
  try {
    const config = useRuntimeConfig();
    baseUrl =
      (config?.public?.apiUrl as string) ||
      (config?.public?.apiBase as string) ||
      "";
  } catch {
    baseUrl = "";
  }

  if (!baseUrl) {
    baseUrl = "https://olhoy8ebq7.execute-api.us-east-1.amazonaws.com";
  }

  const cleanBase = baseUrl.replace(/\/+$/, "");
  const cleanPath = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;

  return `${cleanBase}${cleanPath}`;
}

/**
 * Centralized API Fetch client.
 * Automatically injects authorization tokens and headers on every request.
 */
export async function apiFetch<T = any>(
  endpoint: string,
  options: any = {},
): Promise<T> {
  const url = resolveApiUrl(endpoint);
  const authHeaders = getAuthHeaders();

  const mergedHeaders: Record<string, string> = {
    ...authHeaders,
    ...(options.headers || {}),
  };

  const isFormData =
    typeof FormData !== "undefined" && options.body instanceof FormData;
  if (
    !isFormData &&
    options.body &&
    !mergedHeaders["Content-Type"] &&
    !mergedHeaders["content-type"]
  ) {
    mergedHeaders["Content-Type"] = "application/json";
  }

  return $fetch<T>(url, {
    ...options,
    headers: mergedHeaders,
  });
}

/**
 * Convenience methods for common HTTP verbs with automatic auth.
 */
export const apiClient = {
  get: <T = any>(endpoint: string, options?: any) =>
    apiFetch<T>(endpoint, { ...options, method: "GET" }),

  post: <T = any>(endpoint: string, body?: any, options?: any) =>
    apiFetch<T>(endpoint, { ...options, method: "POST", body }),

  put: <T = any>(endpoint: string, body?: any, options?: any) =>
    apiFetch<T>(endpoint, { ...options, method: "PUT", body }),

  patch: <T = any>(endpoint: string, body?: any, options?: any) =>
    apiFetch<T>(endpoint, { ...options, method: "PATCH", body }),

  delete: <T = any>(endpoint: string, options?: any) =>
    apiFetch<T>(endpoint, { ...options, method: "DELETE" }),
};

/**
 * Composable wrapper exposing the centralized API client.
 */
export function useApiClient() {
  const config = useRuntimeConfig();
  const apiUrl = (config.public?.apiUrl ||
    config.public?.apiBase ||
    "") as string;

  return {
    apiFetch,
    apiClient,
    getAuthHeaders,
    resolveApiUrl,
    apiUrl,
  };
}
