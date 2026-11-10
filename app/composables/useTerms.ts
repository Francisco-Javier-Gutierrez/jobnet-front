import { ref } from "vue";
import { useRuntimeConfig, useAuth } from "#imports";

export interface TermsVersionData {
  version: string;
  title: string;
  summary: string;
  effectiveDate: string;
  updatedAt?: string;
  updatedBy?: string;
  changelog?: string[] | string;
}

export function useTerms() {
  const config = useRuntimeConfig();
  const apiUrl = config.public.apiUrl;
  let auth: any = null;
  try {
    auth = useAuth();
  } catch {
    // In test environment useAuth might not be defined
  }

  const getAuthHeaders = (): Record<string, string> => {
    const session = auth?.data?.value as any;
    const token = session?.idToken || session?.accessToken;
    const role = session?.user?.tipoUsuario || session?.tipoUsuario || "ADMIN";
    const headers: Record<string, string> = {
      "x-user-role": role,
    };
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    return headers;
  };

  const currentTerms = ref<TermsVersionData>({
    version: "1.0.0",
    title: "Términos y Condiciones de Uso",
    summary:
      "Términos y condiciones oficiales de la plataforma de empleo y red profesional JobNet.",
    effectiveDate: "13 de agosto de 2026",
  });

  const history = ref<TermsVersionData[]>([]);
  const loading = ref(false);
  const updating = ref(false);
  const error = ref<string | null>(null);

  const fetchCurrentTerms = async () => {
    loading.value = true;
    error.value = null;
    try {
      const res: any = await $fetch(`${apiUrl}/terms/version`, {
        method: "GET",
      });
      if (res && res.version) {
        currentTerms.value = {
          version: res.version,
          title: res.title || "Términos y Condiciones de Uso",
          summary: res.summary || "",
          effectiveDate: res.effectiveDate || "13 de agosto de 2026",
          updatedAt: res.updatedAt,
          updatedBy: res.updatedBy,
          changelog: res.changelog,
        };
      }
    } catch (err: any) {
      console.warn(
        "No se pudo cargar la versión de términos desde la API, usando versión base:",
        err,
      );
      // Fallback base local
    } finally {
      loading.value = false;
    }
  };

  const fetchTermsHistory = async () => {
    loading.value = true;
    error.value = null;
    try {
      const res: any = await $fetch(`${apiUrl}/admin/terms/history`, {
        method: "GET",
        headers: getAuthHeaders(),
      });
      if (res && Array.isArray(res.history)) {
        history.value = res.history;
      }
    } catch (err: any) {
      console.error("Error al consultar histórico de términos:", err);
      error.value =
        err?.data?.error || err?.message || "Error al obtener histórico";
    } finally {
      loading.value = false;
    }
  };

  const updateTermsAndBroadcast = async (payload: {
    version: string;
    title?: string;
    summary: string;
    effectiveDate: string;
    notifyUsers?: boolean;
    changelog?: string[] | string;
  }) => {
    updating.value = true;
    error.value = null;
    try {
      const res: any = await $fetch(`${apiUrl}/admin/terms/update`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: payload,
      });

      // Refrescar versión actual local
      await fetchCurrentTerms();
      return res;
    } catch (err: any) {
      console.error("Error al actualizar términos:", err);
      const msg =
        err?.data?.error || err?.message || "Error al actualizar términos";
      error.value = msg;
      throw new Error(msg);
    } finally {
      updating.value = false;
    }
  };

  return {
    currentTerms,
    history,
    loading,
    updating,
    error,
    fetchCurrentTerms,
    fetchTermsHistory,
    updateTermsAndBroadcast,
  };
}
