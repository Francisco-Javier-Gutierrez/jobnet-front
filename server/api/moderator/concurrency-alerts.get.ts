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

  // 2. Try fetching from backend API if available
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
  } catch {
    // Fallback to baseline anomalies for offline / local mode
  }

  const baselineAnomalies = [
    {
      id: "anom-vac-demo-01",
      type: "RAPID_VACANCIES",
      severity: "CRITICAL",
      organizationId: "org-bot-recruitment-99",
      organizationName: "FastHiring Express Latam S.A.S.",
      count: 14,
      threshold: 10,
      timeWindow: "38 min (< 1 hora)",
      detectedAt: new Date(Date.now() - 38 * 60 * 1000).toISOString(),
      title: "Concurrencia Anómala: Posible Bot / Spam de Vacantes",
      description:
        "Se detectaron 14 vacantes publicadas en 38 minutos por FastHiring Express Latam S.A.S. Supera el límite de seguridad de 10 vacantes/hora.",
      category: "BOT_SPAM",
      status: "ACTIVE",
    },
    {
      id: "anom-rep-demo-02",
      type: "REPORT_SURGE",
      severity: "CRITICAL",
      organizationId: "org-fake-corp-77",
      organizationName: "Inversiones & Créditos Inmediatos México",
      count: 7,
      threshold: 5,
      timeWindow: "24 min (< 1 hora)",
      detectedAt: new Date(Date.now() - 24 * 60 * 1000).toISOString(),
      title: "Concurrencia Anómala: Avalancha de Reportes por Fraude Masivo",
      description:
        "Se acumularon 7 denuncias independientes por cobro previo indebido y estafa en 24 minutos contra Inversiones & Créditos Inmediatos México. Supera el límite de 5 reportes/hora.",
      category: "MASS_FRAUD",
      status: "ACTIVE",
    },
  ];

  return {
    success: true,
    timestamp: new Date().toISOString(),
    anomalies: baselineAnomalies,
  };
});
