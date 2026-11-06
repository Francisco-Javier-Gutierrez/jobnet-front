import { describe, it, expect } from "vitest";
import {
  sanitizeText,
  sanitizeCompanyName,
  sanitizeProfileToCommunityTemplate,
} from "./cvSanitizer";
import { CV_COMMUNITY_SEED } from "./cvCommunitySeed";

describe("CV Sanitizer & Community Seed Utilities", () => {
  describe("sanitizeText", () => {
    it("should remove sensitive personal information (emails, phones, RFC, URLs)", () => {
      const input =
        "Contáctame a juan.perez@empresa-privada.com o al celular 722 123 4567. Mi RFC es PEVJ900101XYZ y mi web es https://miportfolio-privado.com/secreto";
      const cleaned = sanitizeText(input);

      expect(cleaned).not.toContain("juan.perez@empresa-privada.com");
      expect(cleaned).not.toContain("722 123 4567");
      expect(cleaned).not.toContain("PEVJ900101XYZ");
      expect(cleaned).not.toContain("miportfolio-privado.com");
      expect(cleaned).toContain("[correo@ejemplo.com]");
      expect(cleaned).toContain("[+52 722 XXX XXXX]");
      expect(cleaned).toContain("[RFC-GENERICO]");
      expect(cleaned).toContain("https://ejemplo.com");
    });
  });

  describe("sanitizeCompanyName", () => {
    it("should map tech roles to generic tech/software placeholder", () => {
      expect(
        sanitizeCompanyName("Google", "Senior React Frontend Developer"),
      ).toContain("Tecnología & Software");
    });

    it("should map logistics roles to industrial park placeholder", () => {
      expect(
        sanitizeCompanyName("DHL", "Supervisor de Logística y Almacén"),
      ).toContain("Toluca-Lerma");
    });

    it("should fallback gracefully for unspecified roles", () => {
      expect(sanitizeCompanyName("Mi Pyme", "Auxiliar General")).toBe(
        "Empresa del Sector Privado",
      );
    });
  });

  describe("sanitizeProfileToCommunityTemplate", () => {
    it("should create an anonymous template without exposing private profile fields", () => {
      const candidateProfile = {
        id: "cand-12345",
        nombre: "Roberto Carlos González",
        tituloProfesional: "Frontend React Developer",
        biografia:
          "Desarrollador con 4 años de experiencia en Fintech. Tel: 722 999 8888.",
        habilidades: ["React", "TypeScript", "Tailwind CSS"],
        experiencia: [
          {
            cargo: "Frontend Lead",
            empresa: "Banco Azteca S.A.",
            periodo: "2021 - 2024",
            logros: [
              "Incrementé la conversión en un 25% optimizando el funnel de onboarding.",
            ],
          },
        ],
      };

      const template = sanitizeProfileToCommunityTemplate(candidateProfile, {
        idioma: "es",
        categoria: "frontend",
        autorNombre: "Carlos G.",
      });

      expect(template.autorNombre).toBe("Carlos G.");
      expect(template.rol).toBe("Frontend React Developer");
      expect(template.idioma).toBe("es");
      expect(template.alcance).toBe("SUR_EDOMEX");
      expect(template.habilidades).toEqual([
        "React",
        "TypeScript",
        "Tailwind CSS",
      ]);
      // Ensure company was sanitized
      expect(template.experienciaSugerida[0].empresa).not.toContain(
        "Banco Azteca",
      );
      expect(template.experienciaSugerida[0].empresa).toContain(
        "Tecnología & Software",
      );
      // Ensure private phone was stripped from bio
      expect(template.biografiaSugerida).not.toContain("722 999 8888");
      expect(template.biografiaSugerida).toContain("[+52 722 XXX XXXX]");
    });
  });

  describe("CV_COMMUNITY_SEED", () => {
    it("should contain templates with valid languages: es, en, and bilingual", () => {
      expect(CV_COMMUNITY_SEED.length).toBeGreaterThanOrEqual(8);

      const languages = new Set(CV_COMMUNITY_SEED.map((t) => t.idioma));
      expect(languages.has("es")).toBe(true);
      expect(languages.has("en")).toBe(true);
      expect(languages.has("bilingual")).toBe(true);

      const edomexTemplates = CV_COMMUNITY_SEED.filter(
        (t) => t.alcance === "SUR_EDOMEX",
      );
      expect(edomexTemplates.length).toBeGreaterThan(0);
    });
  });
});
