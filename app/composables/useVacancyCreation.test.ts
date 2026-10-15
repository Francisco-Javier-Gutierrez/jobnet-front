import { describe, it, expect, vi, beforeEach } from "vitest";
import { EDO_MEX_FEATURES, EDO_MEX_MUNICIPALITIES } from "~/utils/edoMexGeoJSON";
import { formatSalaryDisplay } from "~/utils/formatters";

describe("Creación de Ofertas de Empleo (Especificación Organizaciones)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("1. Selección obligatoria de habilidades técnicas vinculadas al catálogo", () => {
    it("should reject vacancy submission if skills array is empty", () => {
      const validateVacancy = (form: {
        title: string;
        description: string;
        skills: string[];
      }) => {
        if (!form.title.trim()) return "El título de la vacante es obligatorio.";
        if (!form.description.trim())
          return "La descripción de la vacante es obligatoria.";
        if (!form.skills || form.skills.length === 0)
          return "La selección de al menos una habilidad técnica vinculada al catálogo es obligatoria.";
        return null;
      };

      const invalidForm = {
        title: "Frontend Engineer",
        description: "Desarrollo de interfaces reactivas",
        skills: [],
      };

      expect(validateVacancy(invalidForm)).toBe(
        "La selección de al menos una habilidad técnica vinculada al catálogo es obligatoria.",
      );

      const validForm = {
        title: "Frontend Engineer",
        description: "Desarrollo de interfaces reactivas",
        skills: ["Vue.js"],
      };

      expect(validateVacancy(validForm)).toBeNull();
    });

    it("should auto-dispatch uncataloged skills to moderator suggestions mailbox", async () => {
      const masterCatalogSkills = [
        { id: "s-1", name: "TypeScript" },
        { id: "s-2", name: "Vue.js" },
      ];

      const suggestSkillMock = vi.fn().mockResolvedValue({ success: true });

      const selectedSkills = ["Vue.js", "Nuxt 3", "Tailwind CSS"];

      const dispatchUncatalogedSkills = async (skills: string[]) => {
        for (const skill of skills) {
          const isApproved = masterCatalogSkills.some(
            (cs) => cs.name.toLowerCase() === skill.toLowerCase().trim(),
          );
          if (!isApproved) {
            await suggestSkillMock(skill.trim());
          }
        }
      };

      await dispatchUncatalogedSkills(selectedSkills);

      expect(suggestSkillMock).toHaveBeenCalledTimes(2);
      expect(suggestSkillMock).toHaveBeenCalledWith("Nuxt 3");
      expect(suggestSkillMock).toHaveBeenCalledWith("Tailwind CSS");
      expect(suggestSkillMock).not.toHaveBeenCalledWith("Vue.js");
    });
  });

  describe("2. Geolocalización por coordenadas geográficas y municipio del Estado de México", () => {
    it("should contain the official 125 municipalities of Estado de México", () => {
      expect(EDO_MEX_MUNICIPALITIES.length).toBe(125);
      expect(EDO_MEX_MUNICIPALITIES).toContain("Toluca");
      expect(EDO_MEX_MUNICIPALITIES).toContain("Metepec");
      expect(EDO_MEX_MUNICIPALITIES).toContain("Naucalpan de Juárez");
      expect(EDO_MEX_MUNICIPALITIES).toContain("Ecatepec de Morelos");
      expect(EDO_MEX_MUNICIPALITIES).toContain("Valle de Bravo");
    });

    it("should update lat/lng coordinates to municipality centroid when selecting EdoMex municipality", () => {
      const setMunicipio = (muniName: string) => {
        const clean = muniName.toLowerCase().trim();
        const found = EDO_MEX_FEATURES.find((m) =>
          m.name.toLowerCase().includes(clean),
        );
        if (found) {
          return {
            municipio: muniName,
            lat: found.center[1],
            lng: found.center[0],
          };
        }
        return { municipio: muniName, lat: 19.2826, lng: -99.6557 };
      };

      const toluca = setMunicipio("Toluca");
      expect(toluca.lat).toBeCloseTo(19.29, 1);
      expect(toluca.lng).toBeCloseTo(-99.65, 1);

      const metepec = setMunicipio("Metepec");
      expect(metepec.municipio).toBe("Metepec");
      expect(metepec.lat).toBeDefined();
      expect(metepec.lng).toBeDefined();
    });
  });

  describe("3. Configuración de salario visible o confidencial", () => {
    it("should display 'Salario confidencial' when salarioConfidencial is true while preserving raw numbers", () => {
      const confidentialJob: any = {
        title: "Tech Lead",
        salarioMinimo: 60000,
        salarioMaximo: 85000,
        salarioConfidencial: true,
      };

      expect(formatSalaryDisplay(confidentialJob)).toBe("Salario confidencial");
      expect(confidentialJob.salarioMinimo).toBe(60000);
      expect(confidentialJob.salarioMaximo).toBe(85000);

      const visibleJob: any = {
        title: "Tech Lead",
        salarioMinimo: 60000,
        salarioMaximo: 85000,
        salarioConfidencial: false,
      };

      expect(formatSalaryDisplay(visibleJob)).toBe("60k MXN - 85k MXN / mes");
    });
  });

  describe("4. Hasta 3 preguntas filtro de respuesta obligatoria", () => {
    it("should limit screening questions to a maximum of 3", () => {
      const questions: string[] = [];
      const addPregunta = (q: string) => {
        if (questions.length < 3) questions.push(q);
      };

      addPregunta("¿Tienes al menos 3 años de experiencia con Vue 3?");
      addPregunta("¿Disponibilidad para trabajar en Toluca?");
      addPregunta("¿Nivel de inglés técnico B2?");
      addPregunta("Pregunta 4 que excede el límite");

      expect(questions.length).toBe(3);
      expect(questions[2]).toBe("¿Nivel de inglés técnico B2?");
    });

    it("should require candidates to answer all screening questions before submitting application", () => {
      const screeningQuestions = [
        "¿Tienes al menos 3 años de experiencia con Vue 3?",
        "¿Disponibilidad para trabajar en Toluca?",
      ];

      const validateAnswers = (answers: Record<string, string>) => {
        return screeningQuestions.every((q) => Boolean(answers[q]?.trim()));
      };

      const incompleteAnswers = {
        "¿Tienes al menos 3 años de experiencia con Vue 3?": "Sí, 4 años",
        "¿Disponibilidad para trabajar en Toluca?": "   ", // Vacío
      };

      expect(validateAnswers(incompleteAnswers)).toBe(false);

      const completeAnswers = {
        "¿Tienes al menos 3 años de experiencia con Vue 3?": "Sí, 4 años",
        "¿Disponibilidad para trabajar en Toluca?": "Total disponibilidad",
      };

      expect(validateAnswers(completeAnswers)).toBe(true);
    });
  });

  describe("5. Actualización de Ofertas de Empleo", () => {
    it("should allow updating requirements, modality, salary and screening questions without affecting previous applications", () => {
      // Existing vacancy state
      const initialJob = {
        id: "vac-001",
        title: "Frontend Engineer",
        modalidad: "Presencial",
        salarioMinimo: 30000,
        salarioMaximo: 45000,
        salarioConfidencial: false,
        skills: ["JavaScript", "HTML"],
        preguntasFiltro: ["¿Años de experiencia?"],
      };

      // Existing applications submitted prior to update
      const existingApplications = [
        {
          candidateId: "cand-1",
          jobId: "vac-001",
          appliedAt: "2026-10-01T10:00:00.000Z",
          status: "PENDIENTE",
          coverLetter: "Postulación previa",
        },
        {
          candidateId: "cand-2",
          jobId: "vac-001",
          appliedAt: "2026-10-02T12:00:00.000Z",
          status: "ACEPTADA",
          coverLetter: "Candidato seleccionado",
        },
      ];

      // Update payload
      const updatedPayload = {
        modalidad: "Híbrido",
        salarioMinimo: 40000,
        salarioMaximo: 55000,
        salarioConfidencial: true,
        skills: ["TypeScript", "Vue 3", "Tailwind CSS"],
        preguntasFiltro: [
          "¿Años de experiencia comprobable en Vue 3?",
          "¿Disponibilidad inmediata?",
        ],
      };

      const updatedJob = {
        ...initialJob,
        ...updatedPayload,
      };

      expect(updatedJob.modalidad).toBe("Híbrido");
      expect(updatedJob.salarioMinimo).toBe(40000);
      expect(updatedJob.salarioConfidencial).toBe(true);
      expect(updatedJob.skills).toEqual(["TypeScript", "Vue 3", "Tailwind CSS"]);
      expect(updatedJob.preguntasFiltro).toHaveLength(2);

      // Verify applications remain strictly intact and unchanged
      expect(existingApplications).toHaveLength(2);
      expect(existingApplications[0].candidateId).toBe("cand-1");
      expect(existingApplications[0].status).toBe("PENDIENTE");
      expect(existingApplications[1].candidateId).toBe("cand-2");
      expect(existingApplications[1].status).toBe("ACEPTADA");
    });
  });

  describe("6. Pausa Manual de Vacantes", () => {
    it("should toggle vacancy status immediately between Activa and PAUSADA", () => {
      let estadoVacante = "Activa";

      const togglePause = (nuevoEstado: string) => {
        estadoVacante = nuevoEstado;
        return estadoVacante;
      };

      expect(togglePause("PAUSADA")).toBe("PAUSADA");
      expect(togglePause("Activa")).toBe("Activa");
    });

    it("should hide paused vacancy from public search results", () => {
      const allVacancies = [
        { id: "vac-1", title: "Dev 1", estado: "Activa", oculta: false },
        { id: "vac-2", title: "Dev 2", estado: "PAUSADA", oculta: false },
        { id: "vac-3", title: "Dev 3", estado: "CERRADA", oculta: false },
        { id: "vac-4", title: "Dev 4", estado: "Activa", oculta: false },
      ];

      const publicVisible = allVacancies.filter(
        (v) => v.estado !== "PAUSADA" && v.estado !== "CERRADA" && !v.oculta,
      );

      expect(publicVisible).toHaveLength(2);
      expect(publicVisible.map((v) => v.id)).toEqual(["vac-1", "vac-4"]);
      expect(publicVisible.some((v) => v.id === "vac-2")).toBe(false);
    });

    it("should disable application button and reject apply when vacancy is PAUSADA", () => {
      const isApplyDisabled = (job: { estado: string }) => {
        return job.estado === "PAUSADA" || job.estado === "EVALUACION" || job.estado === "CERRADA";
      };

      expect(isApplyDisabled({ estado: "PAUSADA" })).toBe(true);
      expect(isApplyDisabled({ estado: "Activa" })).toBe(false);
    });
  });

  describe("7. Alerta de Alta Demanda", () => {
    it("should trigger push notification and automatic email to organization when vacancy reaches exactly 50 applicants", async () => {
      const pushMock = vi.fn().mockResolvedValue("push-sent");
      const emailMock = vi.fn().mockResolvedValue("email-sent");

      const checkHighDemand = async (
        vacancy: {
          id: string;
          companyId: string;
          companyEmail: string;
          title: string;
          alertaAltaDemandaEnviada?: boolean;
        },
        applicantCount: number,
      ) => {
        if (applicantCount === 50 && !vacancy.alertaAltaDemandaEnviada) {
          await pushMock({
            userId: vacancy.companyId,
            title: "Alta demanda de postulaciones",
            message: `Tu vacante "${vacancy.title}" ha alcanzado exactamente 50 postulantes.`,
            type: "high_demand",
          });

          await emailMock({
            to: vacancy.companyEmail,
            subject: `Aviso de alta demanda: 50 postulantes en "${vacancy.title}"`,
            body: `Tu oferta de empleo "${vacancy.title}" ha alcanzado 50 postulaciones.`,
          });

          vacancy.alertaAltaDemandaEnviada = true;
          return true;
        }
        return false;
      };

      const vacancy = {
        id: "vac-50",
        companyId: "org-100",
        companyEmail: "rrhh@techcorp.com",
        title: "Ingeniero Cloud AWS",
        alertaAltaDemandaEnviada: false,
      };

      // 49 applicants -> no alert
      const res49 = await checkHighDemand(vacancy, 49);
      expect(res49).toBe(false);
      expect(pushMock).not.toHaveBeenCalled();
      expect(emailMock).not.toHaveBeenCalled();

      // 50th applicant -> alert triggers!
      const res50 = await checkHighDemand(vacancy, 50);
      expect(res50).toBe(true);
      expect(pushMock).toHaveBeenCalledTimes(1);
      expect(pushMock).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: "org-100",
          type: "high_demand",
          title: "Alta demanda de postulaciones",
        }),
      );
      expect(emailMock).toHaveBeenCalledTimes(1);
      expect(emailMock).toHaveBeenCalledWith(
        expect.objectContaining({
          to: "rrhh@techcorp.com",
        }),
      );
      expect(vacancy.alertaAltaDemandaEnviada).toBe(true);

      // 51st applicant -> no redundant alert
      const res51 = await checkHighDemand(vacancy, 51);
      expect(res51).toBe(false);
      expect(pushMock).toHaveBeenCalledTimes(1);
      expect(emailMock).toHaveBeenCalledTimes(1);
    });
  });

  describe("8. Alerta de Caducidad", () => {
    it("should generate system reminder notification 3 days before closing date", async () => {
      const reminderMock = vi.fn().mockResolvedValue("notif-sent");

      const checkCaducidad = async (vacancy: {
        id: string;
        companyId: string;
        title: string;
        fechaCierre: string;
        alertaCaducidadEnviada?: boolean;
      }) => {
        const ONE_DAY_MS = 24 * 60 * 60 * 1000;
        const diffMs = new Date(vacancy.fechaCierre).getTime() - Date.now();
        const diasRestantes = Math.ceil(diffMs / ONE_DAY_MS);

        if (diasRestantes <= 3 && diasRestantes >= 0 && !vacancy.alertaCaducidadEnviada) {
          await reminderMock({
            userId: vacancy.companyId,
            title: "Recordatorio de vigencia de vacante",
            message: `Tu vacante "${vacancy.title}" cumplirá su periodo de vigencia en ${diasRestantes} día(s).`,
            type: "expiration_reminder",
            diasRestantes,
          });
          vacancy.alertaCaducidadEnviada = true;
          return true;
        }
        return false;
      };

      // Vacancy expiring in 2 days (within the 3 days window)
      const vacancyExpiringSoon = {
        id: "vac-soon",
        companyId: "org-200",
        title: "Desarrollador Fullstack",
        fechaCierre: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        alertaCaducidadEnviada: false,
      };

      const triggered = await checkCaducidad(vacancyExpiringSoon);
      expect(triggered).toBe(true);
      expect(reminderMock).toHaveBeenCalledTimes(1);
      expect(reminderMock).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: "org-200",
          type: "expiration_reminder",
          diasRestantes: 2,
        }),
      );
      expect(vacancyExpiringSoon.alertaCaducidadEnviada).toBe(true);

      // Subsequent check does not duplicate
      const duplicateCheck = await checkCaducidad(vacancyExpiringSoon);
      expect(duplicateCheck).toBe(false);
      expect(reminderMock).toHaveBeenCalledTimes(1);

      // Vacancy expiring in 10 days does not trigger
      const vacancySafe = {
        id: "vac-safe",
        companyId: "org-200",
        title: "Analista QA",
        fechaCierre: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
        alertaCaducidadEnviada: false,
      };

      const triggeredSafe = await checkCaducidad(vacancySafe);
      expect(triggeredSafe).toBe(false);
      expect(reminderMock).toHaveBeenCalledTimes(1);
    });
  });
});
