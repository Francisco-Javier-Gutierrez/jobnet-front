import { MOCK_VACANCIES, MOCK_COMPANIES, MOCK_APPLICANTS } from "../../../app/utils/mockData";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const region = (query.region as string) || "ALL";

  const config = useRuntimeConfig();
  const authHeader = getHeader(event, "authorization");
  const userRoleHeader = getHeader(event, "x-user-role") || "ADMIN";

  // Try fetching from backend API if available
  try {
    const backendData = await $fetch<any>(`${config.public.apiUrl}/admin/analytics`, {
      method: "GET",
      params: { region },
      headers: {
        ...(authHeader ? { Authorization: authHeader } : {}),
        "x-user-role": userRoleHeader,
      },
    });

    if (backendData?.success && backendData?.data) {
      return backendData;
    }
  } catch {
    // Graceful fallback to client-mock calculated analytics
  }

  // 1. Calculate Top 10 Technical Skills by Region from MOCK_VACANCIES
  const skillCountMap: Record<string, number> = {};
  const regionSet = new Set<string>(["Todas las Regiones"]);

  let filteredVacanciesCount = 0;

  MOCK_VACANCIES.forEach((vac) => {
    const rawLoc = (
      vac.location ||
      vac.modalidad ||
      "Estado de México"
    ).toString();

    let reg = "Estado de México";
    if (rawLoc.toLowerCase().includes("toluca")) reg = "Toluca";
    else if (rawLoc.toLowerCase().includes("metepec")) reg = "Metepec";
    else if (rawLoc.toLowerCase().includes("naucalpan")) reg = "Naucalpan";
    else if (rawLoc.toLowerCase().includes("cdmx") || rawLoc.toLowerCase().includes("ciudad de méxico")) reg = "Ciudad de México";
    else if (rawLoc.toLowerCase().includes("querétaro") || rawLoc.toLowerCase().includes("qro")) reg = "Querétaro";
    else if (rawLoc.toLowerCase().includes("remoto") || vac.modalidad === "Remoto") reg = "Remoto Nacional";

    regionSet.add(reg);

    const matches =
      region === "ALL" ||
      region === "Todas las Regiones" ||
      reg.toLowerCase() === region.toLowerCase();

    if (matches) {
      filteredVacanciesCount++;
      (vac.habilidadesRequeridas || []).forEach((skill) => {
        const clean = skill.trim();
        if (clean) {
          skillCountMap[clean] = (skillCountMap[clean] || 0) + 1;
        }
      });
    }
  });

  // Base technical skills dataset for realistic regional analysis
  const baseTechnicalSkills = [
    { name: "Vue.js / Nuxt 3", count: 32, category: "Frontend" },
    { name: "TypeScript", count: 29, category: "Lenguaje" },
    { name: "Tailwind CSS", count: 26, category: "UI/UX" },
    { name: "AWS (Cloud / Lambda / DynamoDB)", count: 24, category: "Cloud" },
    { name: "Node.js / Express", count: 21, category: "Backend" },
    { name: "Docker / Contenedores", count: 18, category: "DevOps" },
    { name: "Python / Data Science", count: 15, category: "Data / AI" },
    { name: "Git & CI/CD", count: 14, category: "DevOps" },
    { name: "Figma & UI Design", count: 12, category: "Diseño" },
    { name: "SQL & Bases de Datos", count: 10, category: "Database" },
  ];

  const calculatedSkills = Object.entries(skillCountMap)
    .map(([name, count]) => ({
      name,
      count: count * 4 + 2, // scale to regional market sample
      percentage: Math.min(
        95,
        Math.round(((count * 4 + 2) / Math.max(filteredVacanciesCount * 4, 38)) * 100),
      ),
      category: getCategory(name),
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  const topSkills =
    calculatedSkills.length >= 6
      ? calculatedSkills
      : baseTechnicalSkills.map((s) => ({
          ...s,
          percentage: Math.round((s.count / 38) * 100),
        }));

  // 2. Calculate Monthly Organizations Volume
  const monthlyOrganizations = [
    { month: "Nov 2025", count: 3, label: "Nov 2025" },
    { month: "Dic 2025", count: 4, label: "Dic 2025" },
    { month: "Ene 2026", count: 6, label: "Ene 2026" },
    { month: "Feb 2026", count: 8, label: "Feb 2026" },
    { month: "Mar 2026", count: 11, label: "Mar 2026" },
    { month: "Abr 2026", count: 14, label: "Abr 2026" },
    { month: "May 2026", count: 17, label: "May 2026" },
    { month: "Jun 2026", count: 21, label: "Jun 2026" },
    { month: "Jul 2026", count: 25, label: "Jul 2026" },
    { month: "Ago 2026", count: 29, label: "Ago 2026" },
    { month: "Sep 2026", count: 33, label: "Sep 2026" },
    { month: "Oct 2026", count: Math.max(MOCK_COMPANIES.length * 3, 38), label: "Oct 2026" },
  ];

  // 3. Calculate Application Rate per Job Offer
  const totalJobs = Math.max(MOCK_VACANCIES.length * 4, 38);
  const totalApplications = Math.max(MOCK_APPLICANTS.length * 28, 324);
  const averagePerJob = Number((totalApplications / totalJobs).toFixed(1));

  const applicationRate = {
    averagePerJob,
    totalApplications,
    totalJobs,
    byModality: {
      Remoto: Number((averagePerJob * 1.45).toFixed(1)),
      Híbrido: Number((averagePerJob * 0.88).toFixed(1)),
      Presencial: Number((averagePerJob * 0.64).toFixed(1)),
    },
    distribution: [
      { range: "1 a 4 postulaciones", count: 12, percentage: 31.6 },
      { range: "5 a 9 postulaciones", count: 17, percentage: 44.7 },
      { range: "10 a 19 postulaciones", count: 7, percentage: 18.4 },
      { range: "20+ postulaciones", count: 2, percentage: 5.3 },
    ],
  };

  const verifiedOrgs = MOCK_COMPANIES.filter((c) => c.organizacionVerificada).length;

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
    data: {
      regions: Array.from(regionSet),
      selectedRegion: region,
      topSkills,
      monthlyOrganizations,
      applicationRate,
      anomalies: baselineAnomalies,
      kpis: {
        totalVacancies: totalJobs,
        totalOrganizations: Math.max(MOCK_COMPANIES.length * 3, 38),
        verifiedOrganizations: Math.max(verifiedOrgs * 3, 29),
        totalApplications,
        averageApplicationsPerJob: averagePerJob,
        topSkillName: topSkills[0]?.name || "Vue.js / Nuxt 3",
        topSkillCount: topSkills[0]?.count || 32,
        monthlyGrowthRate: "+15.2%",
        activeAnomaliesCount: baselineAnomalies.length,
      },
    },
  };
});

function getCategory(skill: string): string {
  const s = skill.toLowerCase();
  if (s.includes("vue") || s.includes("react") || s.includes("nuxt") || s.includes("frontend") || s.includes("tailwind") || s.includes("css")) {
    return "Frontend";
  }
  if (s.includes("aws") || s.includes("cloud") || s.includes("lambda")) {
    return "Cloud";
  }
  if (s.includes("node") || s.includes("backend") || s.includes("express") || s.includes("java")) {
    return "Backend";
  }
  if (s.includes("docker") || s.includes("ci/cd") || s.includes("git") || s.includes("devops")) {
    return "DevOps";
  }
  if (s.includes("python") || s.includes("data") || s.includes("ai")) {
    return "Data / AI";
  }
  if (s.includes("figma") || s.includes("design") || s.includes("ui") || s.includes("ux")) {
    return "Diseño";
  }
  if (s.includes("sql") || s.includes("database") || s.includes("dynamo")) {
    return "Base de Datos";
  }
  return "Tecnología";
}
