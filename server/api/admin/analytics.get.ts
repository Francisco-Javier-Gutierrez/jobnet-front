export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const region = (query.region as string) || "ALL";

  const config = useRuntimeConfig();
  const authHeader = getHeader(event, "authorization");
  const userRoleHeader = getHeader(event, "x-user-role") || "ADMIN";

  // Try fetching from backend API
  try {
    const backendData = await $fetch<any>(
      `${config.public.apiUrl}/admin/analytics`,
      {
        method: "GET",
        params: { region },
        headers: {
          ...(authHeader ? { Authorization: authHeader } : {}),
          "x-user-role": userRoleHeader,
        },
      },
    );

    if (backendData?.success && backendData?.data) {
      return backendData;
    }
  } catch (err: any) {
    console.warn(
      "Failed to fetch admin analytics from backend API:",
      err?.message,
    );
  }

  // Real empty analytics fallback
  return {
    success: true,
    timestamp: new Date().toISOString(),
    data: {
      regions: ["Todas las Regiones"],
      selectedRegion: region,
      topSkills: [],
      monthlyOrganizations: [],
      applicationRate: {
        averagePerJob: 0,
        totalApplications: 0,
        totalJobs: 0,
        byModality: {
          Remoto: 0,
          Híbrido: 0,
          Presencial: 0,
        },
        distribution: [],
      },
      anomalies: [],
      kpis: {
        totalVacancies: 0,
        totalOrganizations: 0,
        verifiedOrganizations: 0,
        totalApplications: 0,
        averageApplicationsPerJob: 0,
        topSkillName: "N/A",
        topSkillCount: 0,
        monthlyGrowthRate: "0%",
        activeAnomaliesCount: 0,
      },
    },
  };
});
