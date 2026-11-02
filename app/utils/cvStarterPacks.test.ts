import { describe, it, expect } from "vitest";
import {
  CV_STARTER_PACKS,
  smartAutoFillGaps,
  calculateCvAtsScore,
  ACTION_VERBS,
} from "./cvStarterPacks";
import type { CvData } from "~/types/cv";

describe("cvStarterPacks & Rellenador Inteligente de CV", () => {
  describe("1. Starter Packs Catálogo", () => {
    it("debe contener al menos 5 starter kits preconfigurados para distintas industrias", () => {
      expect(CV_STARTER_PACKS.length).toBeGreaterThanOrEqual(5);

      const juniorPack = CV_STARTER_PACKS.find(
        (p) => p.id === "junior-starter",
      );
      expect(juniorPack).toBeDefined();
      expect(juniorPack?.data.title).toContain("Egresado");
      expect(juniorPack?.data.skills.length).toBeGreaterThanOrEqual(5);
      expect(juniorPack?.data.experience.length).toBeGreaterThanOrEqual(1);

      const techPack = CV_STARTER_PACKS.find((p) => p.id === "tech-software");
      expect(techPack).toBeDefined();
      expect(techPack?.data.skills).toContain("JavaScript / TypeScript");
    });
  });

  describe("2. smartAutoFillGaps (Rellenador para Perfiles Vacíos)", () => {
    it("debe autocompletar todas las secciones vacías en un CV sin datos previos", () => {
      const emptyCv: CvData = {
        name: "Juan Pérez",
        title: "",
        email: "juan@ejemplo.com",
        location: "México",
        bio: "",
        skills: [],
        languages: [],
        experience: [],
        education: [],
        links: [],
      };

      const result = smartAutoFillGaps(emptyCv, "junior-starter");

      expect(result.filledFields).toContain("Título profesional");
      expect(result.filledFields).toContain("Resumen profesional enriquecido");
      expect(result.filledFields).toContain("Habilidades clave");
      expect(result.filledFields).toContain(
        "Experiencias / Proyectos formativos",
      );
      expect(result.filledFields).toContain(
        "Estructura de educación académica",
      );

      expect(result.enrichedData.title).toBe(
        "Profesional en Inicio de Carrera / Recién Egresado(a)",
      );
      expect(result.enrichedData.skills.length).toBeGreaterThanOrEqual(6);
      expect(result.enrichedData.experience.length).toBeGreaterThanOrEqual(1);
      expect(result.enrichedData.name).toBe("Juan Pérez"); // Mantiene el nombre real
      expect(result.enrichedData.email).toBe("juan@ejemplo.com"); // Mantiene el email real
    });

    it("no debe sobreescribir campos existentes si ya cuentan con información válida", () => {
      const partiallyFilledCv: CvData = {
        name: "María López",
        title: "Arquitecta de Software Senior",
        email: "maria@tech.mx",
        location: "CDMX, México",
        bio: "Especialista con más de 8 años diseñando microservicios y nubes híbridas.",
        skills: ["Java", "Spring Boot", "AWS"],
        languages: ["Español", "Inglés C1"],
        experience: [
          {
            puesto: "Lead Architect",
            empresa: "Global Cloud",
            periodo: "2020 - 2024",
            descripcion:
              "Diseño de plataformas bancarias de alta disponibilidad.",
          },
        ],
        education: [],
        links: [],
      };

      const result = smartAutoFillGaps(partiallyFilledCv, "tech-software");

      // No debe sobreescribir el título ni la biografía
      expect(result.enrichedData.title).toBe("Arquitecta de Software Senior");
      expect(result.enrichedData.bio).toBe(
        "Especialista con más de 8 años diseñando microservicios y nubes híbridas.",
      );
      // Mantiene sus habilidades previas e integra sugerencias para complementar
      expect(result.enrichedData.skills).toContain("Java");
      expect(result.enrichedData.skills).toContain("Spring Boot");
      // Debe rellenar la educación faltante
      expect(result.filledFields).toContain(
        "Estructura de educación académica",
      );
      expect(result.enrichedData.education.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe("3. calculateCvAtsScore (Medidor de Fuerza ATS)", () => {
    it("debe calificar con puntaje alto a un CV con contenido completo", () => {
      const completeCv: CvData = {
        name: "Carlos Mendoza",
        title: "Ingeniero de Software Frontend",
        email: "carlos@gmail.com",
        phone: "+52 55 1234 5678",
        location: "Guadalajara, México",
        bio: "Desarrollador con amplia experiencia en construcción de interfaces de usuario escalables con Vue 3, Nuxt y buenas prácticas.",
        skills: ["Vue.js", "TypeScript", "Tailwind CSS", "Git"],
        languages: ["Español", "Inglés"],
        experience: [
          {
            puesto: "Frontend Engineer",
            empresa: "Tech Co",
            periodo: "2022 - Presente",
            descripcion:
              "Lideré el rediseño de la plataforma web optimizando tiempos de carga y métricas Core Web Vitals en un 30%.",
          },
        ],
        education: [
          {
            institucion: "Universidad de Guadalajara",
            titulo: "Ingeniería en Computación",
            periodo: "2018 - 2022",
          },
        ],
        links: [],
      };

      const ats = calculateCvAtsScore(completeCv, { anonymousMode: false });
      expect(ats.score).toBeGreaterThanOrEqual(80);
      expect(ats.status).toBe("Excelente");
      expect(ats.checklist.every((c) => c.passed)).toBe(true);
    });

    it("debe calificar 'Por Mejorar' a un CV vacío o con datos insuficientes", () => {
      const sparseCv: CvData = {
        name: "Usuario",
        title: "Profesional",
        email: "user@test.com",
        location: "",
        bio: "",
        skills: [],
        languages: [],
        experience: [],
        education: [],
        links: [],
      };

      const ats = calculateCvAtsScore(sparseCv, { anonymousMode: false });
      expect(ats.score).toBeLessThan(50);
      expect(ats.status).toBe("Por Mejorar");
      expect(
        ats.checklist.filter((c) => !c.passed).length,
      ).toBeGreaterThanOrEqual(4);
    });

    it("no debe penalizar el modo anónimo en la evaluación ATS", () => {
      const anonCv: CvData = {
        name: "Candidato #F4A2B1",
        title: "Especialista en Ventas",
        email: "",
        phone: "",
        location: "México",
        bio: "Profesional enfocado en el cumplimiento de metas y satisfacción con amplia trayectoria en negociación comercial.",
        skills: ["Ventas", "Negociación", "CRM", "Atención"],
        languages: ["Español"],
        experience: [
          {
            puesto: "Ejecutivo",
            empresa: "Retail Corp",
            periodo: "2023",
            descripcion:
              "Gestión de cartera de clientes y cumplimiento de cuotas comerciales.",
          },
        ],
        education: [
          {
            institucion: "Universidad",
            titulo: "Licenciatura",
          },
        ],
        links: [],
      };

      const ats = calculateCvAtsScore(anonCv, { anonymousMode: true });
      const contactCheck = ats.checklist.find((c) =>
        c.label.includes("Modo Anónimo"),
      );
      expect(contactCheck?.passed).toBe(true);
    });
  });

  describe("4. ACTION_VERBS Catálogo", () => {
    it("debe incluir verbos clasificados para redacción de impacto", () => {
      expect(ACTION_VERBS.length).toBeGreaterThanOrEqual(4);
      const liderazgo = ACTION_VERBS.find((a) =>
        a.category.includes("Liderazgo"),
      );
      expect(liderazgo?.verbs).toContain("Lideré");
      expect(liderazgo?.verbs).toContain("Coordiné");
    });
  });
});
