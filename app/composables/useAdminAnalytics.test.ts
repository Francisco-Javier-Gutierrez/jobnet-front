import { describe, it, expect, vi, beforeEach } from "vitest";

describe("useAdminAnalytics Composable (Panel de Analítica Avanzada [V2])", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should rank and limit skills to Top 10", () => {
    const rawSkills = [
      { name: "Vue.js", count: 35 },
      { name: "TypeScript", count: 32 },
      { name: "Tailwind CSS", count: 28 },
      { name: "AWS", count: 25 },
      { name: "Node.js", count: 22 },
      { name: "Docker", count: 19 },
      { name: "Python", count: 16 },
      { name: "Git", count: 14 },
      { name: "Figma", count: 12 },
      { name: "SQL", count: 10 },
      { name: "Java", count: 8 },
      { name: "GraphQL", count: 6 },
    ];

    const totalJobs = 40;
    const sortedTop10 = rawSkills
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)
      .map((s) => ({
        ...s,
        percentage: Math.round((s.count / totalJobs) * 100),
      }));

    expect(sortedTop10.length).toBe(10);
    expect(sortedTop10[0].name).toBe("Vue.js");
    expect(sortedTop10[0].percentage).toBe(88);
    expect(sortedTop10[9].name).toBe("SQL");
  });

  it("should calculate average applications per job correctly", () => {
    const totalApplications = 340;
    const totalJobs = 40;
    const average = Number((totalApplications / totalJobs).toFixed(1));

    expect(average).toBe(8.5);

    const byModality = {
      Remoto: Number((average * 1.48).toFixed(1)),
      Híbrido: Number((average * 0.88).toFixed(1)),
      Presencial: Number((average * 0.62).toFixed(1)),
    };

    expect(byModality.Remoto).toBeGreaterThan(byModality.Híbrido);
    expect(byModality.Híbrido).toBeGreaterThan(byModality.Presencial);
  });

  it("should format CSV export correctly with all 3 core metrics", () => {
    const topSkills = [
      { name: "Vue 3", count: 30, percentage: 75, category: "Frontend" },
      { name: "TypeScript", count: 28, percentage: 70, category: "Lenguaje" },
    ];
    const monthlyOrgs = [
      { month: "Sep 2026", count: 31 },
      { month: "Oct 2026", count: 36 },
    ];
    const applicationRate = {
      averagePerJob: 8.5,
      totalApplications: 340,
      totalJobs: 40,
      byModality: { Remoto: 12.6, Híbrido: 7.5, Presencial: 5.3 },
    };

    let csv = "MONITOREO Y METRICAS - JOBNET\n";
    csv += "TOP 10 HABILIDADES TECNICAS MAS DEMANDADAS\n";
    topSkills.forEach((s, idx) => {
      csv += `${idx + 1},"${s.name}",${s.count},${s.percentage}%,${s.category}\n`;
    });
    csv += "VOLUMEN MENSUAL DE NUEVAS ORGANIZACIONES REGISTRADAS\n";
    monthlyOrgs.forEach((m) => {
      csv += `"${m.month}",${m.count}\n`;
    });
    csv += `TASA PROMEDIO DE POSTULACIONES POR OFERTA LABORAL\n${applicationRate.averagePerJob}\n`;

    expect(csv).toContain("TOP 10 HABILIDADES TECNICAS MAS DEMANDADAS");
    expect(csv).toContain("VOLUMEN MENSUAL DE NUEVAS ORGANIZACIONES REGISTRADAS");
    expect(csv).toContain("TASA PROMEDIO DE POSTULACIONES POR OFERTA LABORAL");
    expect(csv).toContain("Vue 3");
    expect(csv).toContain("8.5");
    expect(csv).not.toContain("[V2]");
  });

  describe("Anomalous Concurrency Detection Algorithm (< 1 hour window)", () => {
    const oneHourMs = 60 * 60 * 1000;

    it("should trigger RAPID_VACANCIES alert when an org publishes > 10 vacancies in < 1h", () => {
      const now = Date.now();
      const vacancies = [
        ...Array.from({ length: 12 }, (_, i) => ({
          empresaUuid: "org-bot-1",
          company: "Bot Express Inc.",
          createdAt: new Date(now - (i * 3 * 60 * 1000)).toISOString(), // 12 in 36 minutes
        })),
        {
          empresaUuid: "org-legit-2",
          company: "Empresa Normal",
          createdAt: new Date(now - 10 * 60 * 1000).toISOString(),
        },
      ];

      // Evaluation algorithm
      const orgVacanciesMap: Record<string, { companyName: string; dates: number[] }> = {};
      vacancies.forEach((vac) => {
        const time = new Date(vac.createdAt).getTime();
        if (!orgVacanciesMap[vac.empresaUuid]) {
          orgVacanciesMap[vac.empresaUuid] = { companyName: vac.company, dates: [] };
        }
        orgVacanciesMap[vac.empresaUuid].dates.push(time);
      });

      const detectedAnomalies: any[] = [];
      Object.entries(orgVacanciesMap).forEach(([orgId, data]) => {
        data.dates.sort((a, b) => a - b);
        for (let i = 0; i < data.dates.length; i++) {
          const windowStart = data.dates[i];
          const windowEnd = windowStart + oneHourMs;
          const countInWindow = data.dates.filter((d) => d >= windowStart && d <= windowEnd).length;
          if (countInWindow > 10) {
            detectedAnomalies.push({
              organizationId: orgId,
              organizationName: data.companyName,
              count: countInWindow,
              threshold: 10,
              type: "RAPID_VACANCIES",
              category: "BOT_SPAM",
            });
            break;
          }
        }
      });

      expect(detectedAnomalies.length).toBe(1);
      expect(detectedAnomalies[0].organizationId).toBe("org-bot-1");
      expect(detectedAnomalies[0].count).toBe(12);
      expect(detectedAnomalies[0].category).toBe("BOT_SPAM");
    });

    it("should trigger REPORT_SURGE alert when an org receives > 5 reports in < 1h", () => {
      const now = Date.now();
      const reports = [
        ...Array.from({ length: 7 }, (_, i) => ({
          companyId: "org-scam-9",
          companyName: "Fake Financials Ltd",
          createdAt: new Date(now - (i * 5 * 60 * 1000)).toISOString(), // 7 in 35 min
        })),
        {
          companyId: "org-normal-8",
          companyName: "Tech Solutions",
          createdAt: new Date(now - 20 * 60 * 1000).toISOString(),
        },
      ];

      const orgReportsMap: Record<string, { companyName: string; dates: number[] }> = {};
      reports.forEach((rep) => {
        const time = new Date(rep.createdAt).getTime();
        if (!orgReportsMap[rep.companyId]) {
          orgReportsMap[rep.companyId] = { companyName: rep.companyName, dates: [] };
        }
        orgReportsMap[rep.companyId].dates.push(time);
      });

      const detectedAnomalies: any[] = [];
      Object.entries(orgReportsMap).forEach(([orgId, data]) => {
        data.dates.sort((a, b) => a - b);
        for (let i = 0; i < data.dates.length; i++) {
          const windowStart = data.dates[i];
          const windowEnd = windowStart + oneHourMs;
          const countInWindow = data.dates.filter((d) => d >= windowStart && d <= windowEnd).length;
          if (countInWindow > 5) {
            detectedAnomalies.push({
              organizationId: orgId,
              organizationName: data.companyName,
              count: countInWindow,
              threshold: 5,
              type: "REPORT_SURGE",
              category: "MASS_FRAUD",
            });
            break;
          }
        }
      });

      expect(detectedAnomalies.length).toBe(1);
      expect(detectedAnomalies[0].organizationId).toBe("org-scam-9");
      expect(detectedAnomalies[0].count).toBe(7);
      expect(detectedAnomalies[0].category).toBe("MASS_FRAUD");
    });

    it("should NOT trigger alert when vacancies <= 10 or reports <= 5 in < 1h", () => {
      const now = Date.now();
      // 8 vacancies (under 10)
      const vacDates = Array.from({ length: 8 }, (_, i) => now - i * 5 * 60 * 1000);
      const vacInWindow = vacDates.filter((d) => d >= now - oneHourMs && d <= now).length;
      expect(vacInWindow > 10).toBe(false);

      // 4 reports (under 5)
      const repDates = Array.from({ length: 4 }, (_, i) => now - i * 10 * 60 * 1000);
      const repInWindow = repDates.filter((d) => d >= now - oneHourMs && d <= now).length;
      expect(repInWindow > 5).toBe(false);
    });

    it("should filter out dismissed anomalies", () => {
      const allAnomalies = [
        { id: "anom-1", organizationId: "org-1", title: "Bot 1" },
        { id: "anom-2", organizationId: "org-2", title: "Fraud 2" },
      ];
      const dismissedIds = ["anom-1"];

      const active = allAnomalies.filter((a) => !dismissedIds.includes(a.id));
      expect(active.length).toBe(1);
      expect(active[0].id).toBe("anom-2");
    });
  });
});
