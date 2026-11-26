import { createError } from "h3";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const region = (query.region as string) || "ALL";

  const config = useRuntimeConfig();
  const authHeader = getHeader(event, "authorization");
  const userRoleHeader = getHeader(event, "x-user-role");

  // In production only forward the role alongside a bearer token. Local dev
  // keeps the header fallback so the dashboard can run without Cognito.
  const forwardUserRole =
    userRoleHeader && (authHeader || process.env.NODE_ENV !== "production")
      ? userRoleHeader
      : undefined;

  try {
    const backendData = await $fetch<any>(
      `${config.public.apiUrl}/admin/analytics`,
      {
        method: "GET",
        params: { region },
        headers: {
          ...(authHeader ? { Authorization: authHeader } : {}),
          ...(forwardUserRole ? { "x-user-role": forwardUserRole } : {}),
        },
      },
    );

    if (backendData?.success && backendData?.data) {
      return backendData;
    }

    throw new Error("El backend devolvió una respuesta inválida.");
  } catch (err: any) {
    console.warn(
      "Failed to fetch admin analytics from backend API:",
      err?.message,
    );

    throw createError({
      statusCode: 502,
      statusMessage: "No se pudieron consultar las métricas del backend.",
      data: {
        detail: err?.data?.error || err?.message || String(err),
      },
    });
  }
});
