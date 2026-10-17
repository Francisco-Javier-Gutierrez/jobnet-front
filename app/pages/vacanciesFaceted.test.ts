import { describe, it, expect } from "vitest";

describe("Vacancies & CV Faceted Counting", () => {
  const mockJobs = [
    { id: "1", title: "Dev React", company: "Tech SA", modalidad: "Remoto", sector: "Tecnología" },
    { id: "2", title: "Dev Java", company: "Fin SA", modalidad: "Presencial", sector: "Finanzas" },
    { id: "3", title: "Fullstack", company: "Innovate", modalidad: "Híbrido", sector: "Tecnología" },
    { id: "4", title: "DevOps", company: "CloudCorp", modalidad: "Remoto", sector: "Tecnología" },
    { id: "5", title: "Analista", company: "Data Inc", modalidad: "Presencial", sector: "Datos" },
  ];

  it("calculates modality facet counts correctly", () => {
    const total = mockJobs.length;
    const remoto = mockJobs.filter((j) => j.modalidad.toLowerCase() === "remoto").length;
    const hibrido = mockJobs.filter((j) => j.modalidad.toLowerCase() === "híbrido").length;
    const presencial = mockJobs.filter((j) => j.modalidad.toLowerCase() === "presencial").length;

    expect(total).toBe(5);
    expect(remoto).toBe(2);
    expect(hibrido).toBe(1);
    expect(presencial).toBe(2);
  });

  it("calculates sector facet counts correctly", () => {
    const techCount = mockJobs.filter((j) => j.sector === "Tecnología").length;
    const finCount = mockJobs.filter((j) => j.sector === "Finanzas").length;
    const dataCount = mockJobs.filter((j) => j.sector === "Datos").length;

    expect(techCount).toBe(3);
    expect(finCount).toBe(1);
    expect(dataCount).toBe(1);
  });

  it("calculates CV template language facets correctly", () => {
    const mockTemplates = [
      { id: "t1", idioma: "es" },
      { id: "t2", idioma: "en" },
      { id: "t3", idioma: "bilingual" },
      { id: "t4", idioma: "es" },
    ];

    const total = mockTemplates.length;
    const esCount = mockTemplates.filter((t) => t.idioma === "es" || t.idioma === "bilingual").length;
    const enCount = mockTemplates.filter((t) => t.idioma === "en" || t.idioma === "bilingual").length;
    const biCount = mockTemplates.filter((t) => t.idioma === "bilingual").length;

    expect(total).toBe(4);
    expect(esCount).toBe(3);
    expect(enCount).toBe(2);
    expect(biCount).toBe(1);
  });
});
