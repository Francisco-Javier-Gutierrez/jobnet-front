import { describe, it, expect, vi, beforeEach } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import { useCommunityCvTemplates } from "./useCommunityCvTemplates";

vi.stubGlobal("useRuntimeConfig", () => ({
  public: {
    apiUrl: "https://api.test.jobnet.com",
  },
}));

vi.stubGlobal("useAuth", () => ({
  data: {
    value: {
      user: {
        id: "cand-777",
        name: "Test Candidate",
      },
    },
  },
}));

describe("useCommunityCvTemplates Composable", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  it("should initialize with seed templates containing valid languages", () => {
    const { filteredTemplates, communityTemplates } = useCommunityCvTemplates();
    expect(communityTemplates.value.length).toBeGreaterThan(0);
    expect(filteredTemplates.value.length).toBe(
      communityTemplates.value.length,
    );
  });

  it("should filter templates by language (es, en, bilingual)", () => {
    const { filteredTemplates, selectedLanguage } = useCommunityCvTemplates();

    // Filter English
    selectedLanguage.value = "en";
    expect(
      filteredTemplates.value.every(
        (t) => t.idioma === "en" || t.idioma === "bilingual",
      ),
    ).toBe(true);

    // Filter Spanish
    selectedLanguage.value = "es";
    expect(
      filteredTemplates.value.every(
        (t) => t.idioma === "es" || t.idioma === "bilingual",
      ),
    ).toBe(true);
  });

  it("should filter templates by search query matching title, role, or skills", () => {
    const { filteredTemplates, searchQuery, selectedLanguage } =
      useCommunityCvTemplates();
    selectedLanguage.value = "all";

    searchQuery.value = "React";
    expect(
      filteredTemplates.value.every(
        (t) =>
          t.titulo.toLowerCase().includes("react") ||
          t.rol.toLowerCase().includes("react") ||
          t.habilidades.some((s) => s.toLowerCase().includes("react")),
      ),
    ).toBe(true);
  });

  it("should filter templates by category and level", () => {
    const {
      filteredTemplates,
      selectedCategory,
      selectedLevel,
      selectedLanguage,
    } = useCommunityCvTemplates();
    selectedLanguage.value = "all";
    selectedCategory.value = "backend";
    selectedLevel.value = "mid";

    expect(
      filteredTemplates.value.every(
        (t) => t.categoria === "backend" && t.nivel === "mid",
      ),
    ).toBe(true);
  });

  it("should increment template uses count locally upon recordTemplateUse", async () => {
    vi.stubGlobal("$fetch", vi.fn().mockResolvedValue({ success: true }));

    const { communityTemplates, recordTemplateUse } = useCommunityCvTemplates();
    const firstTemplate = communityTemplates.value[0];
    const initialUses = firstTemplate.stats.usesCount;

    await recordTemplateUse(firstTemplate.id);
    expect(firstTemplate.stats.usesCount).toBe(initialUses + 1);
  });

  it("should correctly resolve Spanish and English content via resolveTemplateContent", async () => {
    const { resolveTemplateContent } = await import("~/types/cvCommunity");
    const { communityTemplates } = useCommunityCvTemplates();
    const javaTemplate = communityTemplates.value.find(
      (t) => t.id === "seed-backend-java-edomex",
    )!;

    expect(javaTemplate).toBeDefined();

    // Spanish resolution
    const esContent = resolveTemplateContent(javaTemplate, "es");
    expect(esContent.titulo).toContain("Backend Java & Spring Boot");
    expect(esContent.habilidades).toContain("Microservicios");
    expect(esContent.biografiaSugerida).toContain("Ingeniero de Software");

    // English resolution
    const enContent = resolveTemplateContent(javaTemplate, "en");
    expect(enContent.titulo).toBe("Backend Java & Spring Boot Engineer");
    expect(enContent.habilidades).toContain("Microservices Architecture");
    expect(enContent.biografiaSugerida).toContain(
      "Software Engineer specializing in microservices",
    );
  });

  it("should apply template to candidate profile in specified language", async () => {
    const fetchMock = vi.fn().mockResolvedValue({ success: true });
    vi.stubGlobal("$fetch", fetchMock);

    const { communityTemplates, applyTemplateToCandidateProfile } =
      useCommunityCvTemplates();
    const tpl = communityTemplates.value.find(
      (t) => t.id === "seed-backend-java-edomex",
    )!;

    // Apply in English
    const successEn = await applyTemplateToCandidateProfile(
      tpl,
      "cand-777",
      "en",
    );
    expect(successEn).toBe(true);
    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.test.jobnet.com/profile/cand-777",
      expect.objectContaining({
        method: "POST",
        body: expect.objectContaining({
          tituloProfesional: "Backend Software Engineer",
          habilidades: expect.arrayContaining(["Microservices Architecture"]),
        }),
      }),
    );
  });
});
