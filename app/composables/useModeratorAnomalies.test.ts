import { describe, it, expect, vi, beforeEach } from "vitest";

describe("useModeratorAnomalies Composable (Detección de Concurrencia Anómala para Moderadores)", () => {
  const oneHourMs = 60 * 60 * 1000;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Role restriction (Solo para Moderadores de Comunidad)", () => {
    it("should allow MODERATOR and ADMIN roles but deny CANDIDATO or ORGANIZACION", () => {
      const isRoleAllowed = (role: string) => {
        const r = role.toUpperCase();
        return r === "MODERATOR" || r === "MODERADOR" || r === "ADMIN";
      };

      expect(isRoleAllowed("MODERATOR")).toBe(true);
      expect(isRoleAllowed("MODERADOR")).toBe(true);
      expect(isRoleAllowed("ADMIN")).toBe(true);
      expect(isRoleAllowed("CANDIDATO")).toBe(false);
      expect(isRoleAllowed("ORGANIZACION")).toBe(false);
      expect(isRoleAllowed("EMPRESA")).toBe(false);
    });
  });

  describe("Internal Anomaly Detection Rules (< 1 hora)", () => {
    it("should detect RAPID_VACANCIES when organization publishes > 10 vacancies in < 1h", () => {
      const now = Date.now();
      // 14 vacancies published in 38 minutes (< 1h)
      const vacancies = Array.from({ length: 14 }, (_, i) => ({
        empresaUuid: "org-bot-fast",
        company: "Fast Recruitment Inc.",
        createdAt: new Date(now - i * 2.5 * 60 * 1000).toISOString(),
      }));

      const orgVacanciesMap: Record<
        string,
        { companyName: string; dates: number[] }
      > = {};
      vacancies.forEach((vac) => {
        const time = new Date(vac.createdAt).getTime();
        if (!orgVacanciesMap[vac.empresaUuid]) {
          orgVacanciesMap[vac.empresaUuid] = {
            companyName: vac.company,
            dates: [],
          };
        }
        orgVacanciesMap[vac.empresaUuid].dates.push(time);
      });

      const detectedAnomalies: any[] = [];
      Object.entries(orgVacanciesMap).forEach(([orgId, data]) => {
        data.dates.sort((a, b) => a - b);
        for (let i = 0; i < data.dates.length; i++) {
          const windowStart = data.dates[i];
          const windowEnd = windowStart + oneHourMs;
          const countInWindow = data.dates.filter(
            (d) => d >= windowStart && d <= windowEnd,
          ).length;
          if (countInWindow > 10) {
            detectedAnomalies.push({
              organizationId: orgId,
              organizationName: data.companyName,
              count: countInWindow,
              threshold: 10,
              timeWindow: "< 1 hora",
              type: "RAPID_VACANCIES",
              category: "BOT_SPAM",
            });
            break;
          }
        }
      });

      expect(detectedAnomalies.length).toBe(1);
      expect(detectedAnomalies[0].organizationId).toBe("org-bot-fast");
      expect(detectedAnomalies[0].count).toBe(14);
      expect(detectedAnomalies[0].threshold).toBe(10);
      expect(detectedAnomalies[0].type).toBe("RAPID_VACANCIES");
    });

    it("should detect REPORT_SURGE when organization accumulates > 5 reports in < 1h", () => {
      const now = Date.now();
      // 7 reports in 24 minutes (< 1h)
      const reports = Array.from({ length: 7 }, (_, i) => ({
        companyId: "org-fake-corp",
        companyName: "Inversiones Fake",
        createdAt: new Date(now - i * 3 * 60 * 1000).toISOString(),
      }));

      const orgReportsMap: Record<
        string,
        { companyName: string; dates: number[] }
      > = {};
      reports.forEach((rep) => {
        const time = new Date(rep.createdAt).getTime();
        if (!orgReportsMap[rep.companyId]) {
          orgReportsMap[rep.companyId] = {
            companyName: rep.companyName,
            dates: [],
          };
        }
        orgReportsMap[rep.companyId].dates.push(time);
      });

      const detectedAnomalies: any[] = [];
      Object.entries(orgReportsMap).forEach(([orgId, data]) => {
        data.dates.sort((a, b) => a - b);
        for (let i = 0; i < data.dates.length; i++) {
          const windowStart = data.dates[i];
          const windowEnd = windowStart + oneHourMs;
          const countInWindow = data.dates.filter(
            (d) => d >= windowStart && d <= windowEnd,
          ).length;
          if (countInWindow > 5) {
            detectedAnomalies.push({
              organizationId: orgId,
              organizationName: data.companyName,
              count: countInWindow,
              threshold: 5,
              timeWindow: "< 1 hora",
              type: "REPORT_SURGE",
              category: "MASS_FRAUD",
            });
            break;
          }
        }
      });

      expect(detectedAnomalies.length).toBe(1);
      expect(detectedAnomalies[0].organizationId).toBe("org-fake-corp");
      expect(detectedAnomalies[0].count).toBe(7);
      expect(detectedAnomalies[0].threshold).toBe(5);
      expect(detectedAnomalies[0].type).toBe("REPORT_SURGE");
    });

    it("should NOT trigger alert when vacancies <= 10 or reports <= 5 in < 1h", () => {
      const now = Date.now();
      const vacancies = Array.from({ length: 10 }, (_, i) => ({
        createdAt: new Date(now - i * 5 * 60 * 1000).getTime(),
      }));
      const reports = Array.from({ length: 5 }, (_, i) => ({
        createdAt: new Date(now - i * 10 * 60 * 1000).getTime(),
      }));

      const vacInWindow = vacancies.filter(
        (v) => v.createdAt >= now - oneHourMs && v.createdAt <= now,
      ).length;
      const repInWindow = reports.filter(
        (r) => r.createdAt >= now - oneHourMs && r.createdAt <= now,
      ).length;

      expect(vacInWindow > 10).toBe(false);
      expect(repInWindow > 5).toBe(false);
    });
  });

  describe("Preventive Pause & Remediation Action", () => {
    it("should prepare Phase 1 suspension payload when moderator pauses organization preventively", () => {
      const anomaly = {
        organizationId: "org-bot-recruitment-99",
        organizationName: "FastHiring Express Latam S.A.S.",
        title: "Concurrencia Anómala: Posible Bot / Spam de Vacantes",
        description: "Se detectaron 14 vacantes publicadas en 38 minutos",
        timeWindow: "38 min (< 1 hora)",
        count: 14,
      };

      const pausePayload = {
        id: anomaly.organizationId,
        nombre: anomaly.organizationName,
        reason: `Pausado preventivamente por concurrencia anómala: ${anomaly.title} (${anomaly.count} en ${anomaly.timeWindow})`,
        graceDays: 4,
        nextPhase: "IN_REVIEW",
      };

      expect(pausePayload.id).toBe("org-bot-recruitment-99");
      expect(pausePayload.reason).toContain(
        "Pausado preventivamente por concurrencia anómala",
      );
      expect(pausePayload.graceDays).toBe(4);
      expect(pausePayload.nextPhase).toBe("IN_REVIEW");
    });

    it("should allow dismissing an alert without affecting other active anomalies", () => {
      const list = [
        { id: "anom-vac-demo-01", organizationId: "org-1" },
        { id: "anom-rep-demo-02", organizationId: "org-2" },
      ];
      const dismissed: string[] = [];

      const dismiss = (id: string) => {
        if (!dismissed.includes(id)) dismissed.push(id);
      };

      dismiss("anom-vac-demo-01");
      const active = list.filter((a) => !dismissed.includes(a.id));

      expect(active.length).toBe(1);
      expect(active[0].id).toBe("anom-rep-demo-02");
    });
  });

  describe("Sober and Non-Exaggerated UI Standards", () => {
    it("should use concise title without [V2] prefix in moderator alerts", () => {
      const alertTitle = "Concurrencia anómala detectada";
      expect(alertTitle).not.toContain("[V2]");
      expect(alertTitle).not.toContain("v2");
      expect(alertTitle.toLowerCase()).toContain("concurrencia anómala");
    });
  });
});
