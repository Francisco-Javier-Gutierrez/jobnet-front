export const useRoute = (...args: any[]) =>
  (globalThis as any).useRoute
    ? (globalThis as any).useRoute(...args)
    : { query: {}, params: {} };

export const useRouter = (...args: any[]) =>
  (globalThis as any).useRouter
    ? (globalThis as any).useRouter(...args)
    : { push: () => {}, replace: () => {} };

export const useRuntimeConfig = (...args: any[]) =>
  (globalThis as any).useRuntimeConfig
    ? (globalThis as any).useRuntimeConfig(...args)
    : {
        public: {
          apiUrl: "https://api.jobnet.test",
          wsUrl: "wss://ws.jobnet.test",
        },
      };

export const useAuth = (...args: any[]) =>
  (globalThis as any).useAuth
    ? (globalThis as any).useAuth(...args)
    : { data: { value: null }, status: { value: "unauthenticated" } };

export const useFetch = (...args: any[]) =>
  (globalThis as any).useFetch
    ? (globalThis as any).useFetch(...args)
    : Promise.resolve({ data: { value: null } });

export const useLazyAsyncData = (...args: any[]) =>
  (globalThis as any).useLazyAsyncData
    ? (globalThis as any).useLazyAsyncData(...args)
    : Promise.resolve({ data: { value: null } });

export const navigateTo = (...args: any[]) =>
  (globalThis as any).navigateTo
    ? (globalThis as any).navigateTo(...args)
    : Promise.resolve();

export const useSeoMeta = (...args: any[]) =>
  (globalThis as any).useSeoMeta ? (globalThis as any).useSeoMeta(...args) : {};

export const useShare = (...args: any[]) =>
  (globalThis as any).useShare ? (globalThis as any).useShare(...args) : {};

export const useAppFeedback = (...args: any[]) =>
  (globalThis as any).useAppFeedback
    ? (globalThis as any).useAppFeedback(...args)
    : { showError: () => {}, showSuccess: () => {}, showInfo: () => {} };

export const apiFetch = (...args: any[]) =>
  (globalThis as any).apiFetch
    ? (globalThis as any).apiFetch(...args)
    : (globalThis as any).$fetch
      ? (globalThis as any).$fetch(...args)
      : Promise.resolve({});

export const useApiClient = () => ({
  apiFetch,
  apiClient: {
    get: apiFetch,
    post: apiFetch,
    put: apiFetch,
    patch: apiFetch,
    delete: apiFetch,
  },
  getAuthHeaders: () => ({}),
  resolveApiUrl: (url: string) => url,
  apiUrl: "https://api.jobnet.test",
});
