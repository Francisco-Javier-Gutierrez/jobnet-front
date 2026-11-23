import { useRuntimeConfig } from "#imports";
import { useAppFeedback } from "~/composables/useAppFeedback";
import { apiFetch } from "~/composables/useApiClient";

export function useOrgActions(refreshData: () => Promise<void>) {
  const config = useRuntimeConfig();
  const { showError } = useAppFeedback();
  const successMsg = ref("");

  const isSanctionModalOpen = ref(false);
  const selectedOrg = ref<any | null>(null);
  const suspensionReasonInput = ref("Infracción de términos de servicio");
  const graceDaysInput = ref(4);

  const sanctionSteps = [
    { number: 1, label: "Activa" },
    { number: 2, label: "En Revisión (Apelando)" },
    { number: 3, label: "Dictamen Final" },
  ];

  const toggleVerification = async (org: any) => {
    try {
      const nextStatus = !org.organizacionVerificada;
      org.organizacionVerificada = nextStatus;
      await apiFetch(`/profile/${org.id}`, {
        method: "POST",
        body: { organizacionVerificada: nextStatus },
      });
      successMsg.value = `Estatus de verificación actualizado con éxito para ${org.nombre}.`;
      setTimeout(() => (successMsg.value = ""), 4000);
      await refreshData();
    } catch (e) {
      console.error("Error setting verification status:", e);
    }
  };

  const openSanctionModal = (org: any) => {
    selectedOrg.value = org;
    isSanctionModalOpen.value = true;
    suspensionReasonInput.value = "Infracción de términos de servicio";
    graceDaysInput.value = 4;
  };

  const getOrgStatusKey = (
    org: any | null,
  ): "ACTIVO" | "REVISION" | "SUSPENDIDA" => {
    if (!org) return "ACTIVO";
    const statusStr = [org.suspensionStatus, org.estatus, org.estadoCuenta]
      .filter(Boolean)
      .join(" ")
      .toUpperCase();

    if (
      statusStr.includes("REVISI") ||
      statusStr.includes("REVISION") ||
      statusStr.includes("IN_REVIEW")
    ) {
      return "REVISION";
    }
    if (statusStr.includes("SUSPEND") || statusStr.includes("BLOQUEAD")) {
      return "SUSPENDIDA";
    }
    return "ACTIVO";
  };

  const applySanction = async (
    actionType: "INITIATE" | "CANCEL" | "CONFIRM",
    reason?: string,
  ) => {
    if (!selectedOrg.value) return;
    const org = selectedOrg.value;
    const orgId = org.id || org.companyId;
    const orgName = org.nombre || org.name || "la organización";

    try {
      if (actionType === "INITIATE") {
        await apiFetch(
          `/moderator/organizations/${orgId}/initiate-suspension`,
          {
            method: "POST",
            body: {
              reason:
                suspensionReasonInput.value ||
                reason ||
                "Infracción de términos de servicio",
              graceDays: graceDaysInput.value || 4,
            },
          },
        );
        successMsg.value = `Fase 1 completada: Notificación enviada a ${orgName}. Cuenta en revisión (${graceDaysInput.value || 4} días de gracia).`;
      } else if (actionType === "CANCEL") {
        await apiFetch(
          `/moderator/organizations/${orgId}/cancel-suspension`,
          {
            method: "POST",
            body: {
              notes:
                "Apelación evaluada favorablemente. Suspensión revocada por el Administrador.",
            },
          },
        );
        successMsg.value = `Apelación aprobada. Cuenta de ${orgName} restablecida.`;
      } else if (actionType === "CONFIRM") {
        await apiFetch(
          `/moderator/organizations/${orgId}/confirm-suspension`,
          {
            method: "POST",
            body: {
              reason:
                reason ||
                "Dictamen desfavorable tras proceso de evaluación/apelación",
            },
          },
        );
        successMsg.value = `Dictamen desfavorable emitido. Cuenta de ${orgName} suspendida.`;
      }

      isSanctionModalOpen.value = false;
      setTimeout(() => (successMsg.value = ""), 5000);
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("incident-sync", {
            detail: { orgId, actionType },
          }),
        );
      }
      await refreshData();
    } catch (e: any) {
      console.error("Error applying sanction status:", e);
      showError("Error", `Error al procesar la acción: ${e.message || e}`);
    }
  };

  return {
    successMsg,
    isSanctionModalOpen,
    selectedOrg,
    suspensionReasonInput,
    graceDaysInput,
    sanctionSteps,
    getOrgStatusKey,
    toggleVerification,
    openSanctionModal,
    applySanction,
  };
}
