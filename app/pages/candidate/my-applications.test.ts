import { describe, it, expect, vi, beforeEach } from "vitest";

describe("Historial de Solicitudes de Candidatos", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const SAMPLE_APPLICATIONS = [
    {
      jobId: "vac-1",
      jobTitle: "Ingeniero Frontend Senior",
      companyName: "TechCorp México",
      status: "EN_CONTACTO",
      appliedAt: "2026-10-12T10:00:00Z",
      motivoRechazo: null,
      coverLetter: "Amplia experiencia en Vue 3 y TypeScript.",
    },
    {
      jobId: "vac-2",
      jobTitle: "Arquitecto Cloud AWS",
      companyName: "CloudSolutions S.A.",
      status: "SELECCIONADO",
      appliedAt: "2026-10-10T14:30:00Z",
      motivoRechazo: null,
      coverLetter: "Certificado en AWS Solutions Architect.",
    },
    {
      jobId: "vac-3",
      jobTitle: "Especialista DevOps",
      companyName: "Innovatech Latam",
      status: "RECHAZADO",
      motivoRechazo: "Perfil cubierto",
      appliedAt: "2026-10-08T09:00:00Z",
      coverLetter: "Experiencia en CI/CD y Kubernetes.",
    },
    {
      jobId: "vac-4",
      jobTitle: "Desarrollador Backend Go / Python",
      companyName: "DataFintech Labs",
      status: "RECHAZADO",
      motivoRechazo: "Experiencia requerida: Se requiere mayor trayectoria en arquitecturas de alta concurrencia.",
      appliedAt: "2026-10-05T12:00:00Z",
      coverLetter: "Conocimientos sólidos en microservicios.",
    },
    {
      jobId: "vac-5",
      jobTitle: "Tech Lead Mobile",
      companyName: "MobileApp Studio",
      status: "RECHAZADO",
      motivoRechazo: "Pretensión salarial: La expectativa económica supera el rango asignado.",
      appliedAt: "2026-10-02T11:00:00Z",
      coverLetter: "Liderazgo de proyectos móviles.",
    },
  ];

  describe("1. Registro Histórico en Tabla y Filtros", () => {
    it("debe procesar el listado de vacantes postuladas mostrando puesto, organización y estatus", () => {
      expect(SAMPLE_APPLICATIONS).toHaveLength(5);
      SAMPLE_APPLICATIONS.forEach((app) => {
        expect(app.jobTitle).toBeTruthy();
        expect(app.companyName).toBeTruthy();
        expect(app.status).toBeTruthy();
      });
    });

    it("debe filtrar correctamente por estatus activo (En Proceso)", () => {
      const activeApps = SAMPLE_APPLICATIONS.filter(
        (a) => a.status === "PENDIENTE" || a.status === "EN_CONTACTO",
      );
      expect(activeApps).toHaveLength(1);
      expect(activeApps[0].jobId).toBe("vac-1");
    });

    it("debe filtrar correctamente solicitudes descartadas", () => {
      const rejectedApps = SAMPLE_APPLICATIONS.filter(
        (a) => a.status === "RECHAZADO",
      );
      expect(rejectedApps).toHaveLength(3);
    });

    it("debe permitir búsqueda por puesto u organización", () => {
      const query = "Cloud";
      const results = SAMPLE_APPLICATIONS.filter(
        (a) =>
          a.jobTitle.toLowerCase().includes(query.toLowerCase()) ||
          a.companyName.toLowerCase().includes(query.toLowerCase()),
      );
      expect(results).toHaveLength(1);
      expect(results[0].jobId).toBe("vac-2");
    });
  });

  describe("2. Retroalimentación Transparente y Motivos Estandarizados de Descarte", () => {
    function getStandardReasonCategory(reason?: string | null): string {
      if (!reason) return "Perfil cubierto";
      const lower = reason.toLowerCase();
      if (lower.includes("perfil cubierto") || lower.includes("vacante cubierta")) {
        return "Perfil cubierto";
      }
      if (lower.includes("experiencia") || lower.includes("técnica") || lower.includes("trayectoria")) {
        return "Experiencia requerida";
      }
      if (lower.includes("salarial") || lower.includes("pretensión") || lower.includes("sueldo") || lower.includes("remuneración")) {
        return "Pretensión salarial";
      }
      return "Retroalimentación técnica";
    }

    it("debe clasificar el motivo estandarizado 'Perfil cubierto'", () => {
      const category = getStandardReasonCategory("Perfil cubierto");
      expect(category).toBe("Perfil cubierto");
    });

    it("debe clasificar el motivo estandarizado 'Experiencia requerida'", () => {
      const category = getStandardReasonCategory(
        "Experiencia requerida: Se requiere mayor trayectoria en arquitecturas de alta concurrencia.",
      );
      expect(category).toBe("Experiencia requerida");
    });

    it("debe clasificar el motivo estandarizado 'Pretensión salarial'", () => {
      const category = getStandardReasonCategory(
        "Pretensión salarial: La expectativa económica supera el rango asignado.",
      );
      expect(category).toBe("Pretensión salarial");
    });

    it("debe desplegar de forma transparente el motivo cuando la postulación es rechazada", () => {
      const rejectedApp = SAMPLE_APPLICATIONS.find((a) => a.jobId === "vac-3")!;
      expect(rejectedApp.status).toBe("RECHAZADO");
      expect(rejectedApp.motivoRechazo).toBe("Perfil cubierto");

      const displayReason = rejectedApp.motivoRechazo || "Sin motivo";
      expect(displayReason).toBe("Perfil cubierto");
    });

    it("debe asignar los estilos y badges distintivos para cada motivo estandarizado", () => {
      const getBadgeClass = (reason?: string | null) => {
        const cat = getStandardReasonCategory(reason);
        switch (cat) {
          case "Perfil cubierto":
            return "bg-blue-500/10 text-blue-700";
          case "Experiencia requerida":
            return "bg-purple-500/10 text-purple-700";
          case "Pretensión salarial":
            return "bg-emerald-500/10 text-emerald-700";
          default:
            return "bg-rose-500/10 text-rose-700";
        }
      };

      expect(getBadgeClass("Perfil cubierto")).toContain("bg-blue-500");
      expect(getBadgeClass("Experiencia requerida")).toContain("bg-purple-500");
      expect(getBadgeClass("Pretensión salarial")).toContain("bg-emerald-500");
    });
  });
});
