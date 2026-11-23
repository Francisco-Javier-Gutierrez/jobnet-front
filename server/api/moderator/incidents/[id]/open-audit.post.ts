export default defineEventHandler(async (event) => {
  const incidentId = getRouterParam(event, "id");
  const config = useRuntimeConfig();
  const authHeader = getHeader(event, "authorization");
  const userRoleHeader = (
    getHeader(event, "x-user-role") || "MODERATOR"
  ).toUpperCase();

  const userIdHeader = getHeader(event, "x-user-id");
  const userNameHeader = getHeader(event, "x-user-name");
  const userEmailHeader = getHeader(event, "x-user-email");

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

  try {
    const backendData = await $fetch<any>(
      `${config.public.apiUrl}/moderator/incidents/${incidentId}/open-audit`,
      {
        method: "POST",
        headers: {
          ...(authHeader ? { Authorization: authHeader } : {}),
          "x-user-role": userRoleHeader,
          ...(userIdHeader ? { "x-user-id": userIdHeader } : {}),
          ...(userNameHeader ? { "x-user-name": userNameHeader } : {}),
          ...(userEmailHeader ? { "x-user-email": userEmailHeader } : {}),
        },
        body,
      },
    );

    return backendData;
  } catch (error: any) {
    throw createError({
      statusCode: error?.statusCode || 500,
      statusMessage:
        error?.message || "Error al abrir la auditoría de mensajería.",
    });
  }
});
