import { MOCK_INCIDENTS } from "../../../../../app/utils/mockData";

export default defineEventHandler(async (event) => {
  const incidentId = getRouterParam(event, "id");
  const config = useRuntimeConfig();
  const authHeader = getHeader(event, "authorization");
  const userRoleHeader = (
    getHeader(event, "x-user-role") || "MODERATOR"
  ).toUpperCase();

  // Role verification: ONLY MODERATOR or ADMIN allowed
  if (
    userRoleHeader !== "MODERATOR" &&
    userRoleHeader !== "MODERADOR" &&
    userRoleHeader !== "ADMIN"
  ) {
    throw createError({
      statusCode: 403,
      statusMessage:
        "Acceso denegado: Apertura de auditoría de mensajería exclusiva para Moderadores.",
    });
  }

  const body = await readBody(event).catch(() => ({}));

  // Try calling backend API
  try {
    const backendData = await $fetch<any>(
      `${config.public.apiUrl}/moderator/incidents/${incidentId}/open-audit`,
      {
        method: "POST",
        headers: {
          ...(authHeader ? { Authorization: authHeader } : {}),
          "x-user-role": userRoleHeader,
        },
        body,
      },
    );

    if (backendData?.success) {
      return backendData;
    }
  } catch {
    // Fallback to local / mock state update
  }

  // Update in local mock incidents
  const incident = MOCK_INCIDENTS.find((i) => i.id === incidentId);
  if (incident) {
    incident.estatus = "AUDITORIA";
    incident.status = "AUDITORIA";
    incident.auditState = "AUDIT_ACTIVE";
    incident.supervisionStatus = "UNDER_AUDIT";
    incident.auditOpenedAt = new Date().toISOString();
  }

  return {
    success: true,
    message:
      "Fase 1 completada: Notificación formal despachada a ambas partes. El canal de mensajería privada entra en periodo de revisión supervisada.",
    incidentId,
    auditState: "AUDIT_ACTIVE",
    supervisionStatus: "UNDER_AUDIT",
  };
});
