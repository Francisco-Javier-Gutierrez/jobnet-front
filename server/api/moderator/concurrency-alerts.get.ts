export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const authHeader = getHeader(event, "authorization");
  const userRoleHeader = (
    getHeader(event, "x-user-role") || "MODERATOR"
  ).toUpperCase();

  // 1. Role verification: ONLY MODERATOR or ADMIN allowed
  if (
    userRoleHeader !== "MODERATOR" &&
    userRoleHeader !== "MODERADOR" &&
    userRoleHeader !== "ADMIN"
  ) {
    throw createError({
      statusCode: 403,
      statusMessage:
        "Acceso denegado: Panel de alertas de concurrencia exclusivo para Moderadores de Comunidad.",
    });
  }

  // 2. Fetch from backend API
  try {
    const backendData = await $fetch<any>(
      `${config.public.apiUrl}/moderator/concurrency-alerts`,
      {
        method: "GET",
        headers: {
          ...(authHeader ? { Authorization: authHeader } : {}),
          "x-user-role": userRoleHeader,
        },
      },
    );

    if (backendData?.success && backendData?.anomalies) {
      return backendData;
    }
  } catch (err: any) {
    console.warn(
      "Could not reach backend for concurrency alerts:",
      err?.message,
    );
  }

  return {
    success: true,
    timestamp: new Date().toISOString(),
    anomalies: [],
  };
});
