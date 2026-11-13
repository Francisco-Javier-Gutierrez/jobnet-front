import { getAuthHeaders } from "./useApiClient";

export interface CvInteractionOptions {
  action?: "VIEW" | "DOWNLOAD" | "OPEN";
  recruiterName?: string;
  companyName?: string;
  vacancyTitle?: string;
}

export function useCvInteraction() {
  const config =
    typeof useRuntimeConfig === "function"
      ? useRuntimeConfig()
      : { public: { apiUrl: "" } };
  const auth = typeof useAuth === "function" ? useAuth() : { data: ref(null) };
  const session = auth.data;

  const notifyCvInteraction = async (
    candidateId: string,
    options: CvInteractionOptions = {},
  ): Promise<{ success: boolean; sentPush?: boolean; notifId?: string }> => {
    if (!candidateId) return { success: false };

    const action = options.action || "VIEW";
    const recruiterUser = (session.value?.user as any) || {};
    const recruiterName =
      options.recruiterName || recruiterUser.name || recruiterUser.nombre || "";
    const companyName =
      options.companyName ||
      recruiterUser.companyName ||
      recruiterUser.nombreComercial ||
      recruiterUser.empresa ||
      "Organización Reclutadora";
    const vacancyTitle = options.vacancyTitle || "Vacante seleccionada";

    const payload = {
      action,
      recruiterName,
      companyName,
      vacancyTitle,
      timestamp: new Date().toISOString(),
    };

    const authHeaders = getAuthHeaders();

    try {
      // 1. Invocar endpoint local Nitro con cabeceras de autorización
      await $fetch(`/api/candidates/${candidateId}/cv-interaction`, {
        method: "POST",
        body: payload,
        headers: authHeaders,
      }).catch(() => null);

      // 2. Invocar backend en AWS Lambda / DynamoDB con cabeceras de autorización
      if (config.public?.apiUrl) {
        await $fetch(
          `${config.public.apiUrl}/profile/${candidateId}/cv-interaction`,
          {
            method: "POST",
            body: payload,
            headers: authHeaders,
          },
        ).catch(() => null);
      }

      return { success: true, sentPush: true };
    } catch (e) {
      console.warn(
        "[useCvInteraction] Error dispatching interaction notification:",
        e,
      );
      return { success: false };
    }
  };

  return {
    notifyCvInteraction,
  };
}
