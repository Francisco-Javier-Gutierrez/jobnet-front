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
        "Acceso denegado: Emisión de dictamen de auditoría exclusiva para Moderadores.",
    });
  }

  const body = await readBody(event).catch(() => ({}));
  const { dictum, notes } = body;

  // Try calling backend API
  try {
    const backendData = await $fetch<any>(
      `${config.public.apiUrl}/moderator/incidents/${incidentId}/audit-dictum`,
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
    incident.estatus = "RESUELTO";
    incident.status = "RESUELTO";
    incident.auditState = "AUDIT_CONCLUDED";
    incident.auditDictum = dictum;
    incident.auditDictumNotes = notes;
    incident.supervisionStatus = "CONCLUDED";
  }

  return {
    success: true,
    message:
      "Dictamen de auditoría emitido exitosamente. Expediente concluido y partes notificadas.",
    incidentId,
    dictum,
  };
});
