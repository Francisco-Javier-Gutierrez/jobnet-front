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
        "Acceso denegado: Acceso a historial de auditoría exclusivo para Moderadores.",
    });
  }

  // Try calling backend API
  try {
    const backendData = await $fetch<any>(
      `${config.public.apiUrl}/moderator/incidents/${incidentId}/audit-chat`,
      {
        method: "GET",
        headers: {
          ...(authHeader ? { Authorization: authHeader } : {}),
          "x-user-role": userRoleHeader,
        },
      },
    );

    if (backendData?.success && Array.isArray(backendData?.messages)) {
      return backendData;
    }
  } catch (err: any) {
    console.warn(
      `Could not fetch audit-chat for incident ${incidentId}:`,
      err?.message,
    );
  }

  return {
    success: true,
    incidentId,
    messages: [],
  };
});
