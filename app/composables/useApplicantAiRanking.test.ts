import { describe, it, expect, vi, beforeEach } from "vitest";

const mockApiFetch = vi.fn();
vi.mock("~/composables/useApiClient", () => ({
  apiFetch: (...args: any[]) => mockApiFetch(...args),
}));

const mockShowSuccess = vi.fn();
const mockShowError = vi.fn();
const mockShowInfo = vi.fn();
vi.mock("~/composables/useAppFeedback", () => ({
  useAppFeedback: () => ({
    showSuccess: mockShowSuccess,
    showError: mockShowError,
    showInfo: mockShowInfo,
  }),
}));

import { useApplicantAiRanking } from "./useApplicantAiRanking";

describe("useApplicantAiRanking Composable", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    const { rankingResult, userCooldown } = useApplicantAiRanking();
    rankingResult.value = null;
    userCooldown.value = {
      isBlocked: false,
      remainingSeconds: 0,
      remainingMs: 0,
    };
  });

  it("should initialize with default states", () => {
    const { isAiModalOpen, isEvaluating, currentJobId, rankingResult, errorMessage, isCooldownActive } =
      useApplicantAiRanking();

    expect(isAiModalOpen.value).toBe(false);
    expect(isEvaluating.value).toBe(false);
    expect(rankingResult.value).toBe(null);
    expect(errorMessage.value).toBe(null);
    expect(isCooldownActive.value).toBe(false);
  });

  it("should detect cooldown active when userCooldown record is present in DynamoDB", () => {
    const { userCooldown, isCooldownActive, cooldownRemainingText } = useApplicantAiRanking();

    userCooldown.value = {
      isBlocked: true,
      remainingSeconds: 7200,
      remainingMs: 7200000,
      expiresAt: new Date(Date.now() + 7200 * 1000).toISOString(),
    };

    expect(isCooldownActive.value).toBe(true);
    expect(cooldownRemainingText.value).toMatch(/1h 59m|2h/);
  });

  it("should not be on cooldown when userCooldown isBlocked is false", () => {
    const { userCooldown, isCooldownActive, cooldownRemainingText } = useApplicantAiRanking();

    userCooldown.value = {
      isBlocked: false,
      remainingSeconds: 0,
      remainingMs: 0,
    };

    expect(isCooldownActive.value).toBe(false);
    expect(cooldownRemainingText.value).toBe("");
  });

  it("should open ranking modal and load cached ranking with userCooldown", async () => {
    const mockCachedRanking = {
      jobId: "job-100",
      jobTitle: "Senior TypeScript Engineer",
      totalEvaluated: 2,
      evaluatedAt: new Date().toISOString(),
      ranking: [
        {
          candidateId: "cand-1",
          name: "Alice Dev",
          titularProfesional: "Senior Fullstack",
          matchPercentage: 94,
          tier: "TOP_MATCH",
          tierLabel: "Top Match",
          strengths: ["TypeScript", "AWS"],
          gaps: [],
          justification: "Excelente alineación con requisitos.",
        },
      ],
      summary: "Evaluación completada con candidatos destacados.",
      userCooldown: {
        isBlocked: false,
        remainingSeconds: 0,
        remainingMs: 0,
      },
    };

    mockApiFetch.mockResolvedValueOnce(mockCachedRanking);

    const { openRankingModal, isAiModalOpen, currentJobId, rankingResult, isCooldownActive } =
      useApplicantAiRanking();

    await openRankingModal("job-100");

    expect(isAiModalOpen.value).toBe(true);
    expect(currentJobId.value).toBe("job-100");
    expect(mockApiFetch).toHaveBeenCalledWith("/jobs/job-100/ai-ranking");
    expect(rankingResult.value).toEqual(mockCachedRanking);
    expect(isCooldownActive.value).toBe(false);
  });

  it("should fallback to /ai/cooldown if cached ranking is 404", async () => {
    mockApiFetch.mockRejectedValueOnce(new Error("Not found")); // /jobs/job-empty/ai-ranking
    mockApiFetch.mockResolvedValueOnce({
      isBlocked: true,
      remainingSeconds: 3600,
      expiresAt: new Date(Date.now() + 3600 * 1000).toISOString(),
    }); // /ai/cooldown

    const { openRankingModal, rankingResult, isAiModalOpen, isCooldownActive } =
      useApplicantAiRanking();

    await openRankingModal("job-empty");

    expect(isAiModalOpen.value).toBe(true);
    expect(rankingResult.value).toBe(null);
    expect(isCooldownActive.value).toBe(true);
  });

  it("should close ranking modal properly", () => {
    const { closeRankingModal, isAiModalOpen } = useApplicantAiRanking();
    isAiModalOpen.value = true;

    closeRankingModal();
    expect(isAiModalOpen.value).toBe(false);
  });

  it("should block generateRanking and showInfo if isCooldownActive is true", async () => {
    const { userCooldown, generateRanking, currentJobId } = useApplicantAiRanking();
    currentJobId.value = "job-cooldown";
    userCooldown.value = {
      isBlocked: true,
      remainingSeconds: 7200,
      remainingMs: 7200000,
      expiresAt: new Date(Date.now() + 7200 * 1000).toISOString(),
    };

    await generateRanking();

    expect(mockApiFetch).not.toHaveBeenCalled();
    expect(mockShowInfo).toHaveBeenCalledWith(
      expect.stringContaining("Tiempo de espera"),
      expect.stringContaining("Esta vacante ya fue evaluada recientemente"),
    );
  });

  it("should trigger generateRanking and save result on success when not in cooldown", async () => {
    const mockGeneratedRanking = {
      jobId: "job-200",
      jobTitle: "Cloud Architect",
      totalEvaluated: 1,
      evaluatedAt: new Date().toISOString(),
      ranking: [
        {
          candidateId: "cand-2",
          name: "Carlos Cloud",
          titularProfesional: "AWS Solutions Architect",
          matchPercentage: 88,
          tier: "FUERTE_CANDIDATO",
          tierLabel: "Fuerte Candidato",
          strengths: ["Terraform", "Serverless"],
          gaps: ["Kubernetes"],
          justification: "Muy buen dominio de cloud nativo.",
        },
      ],
      summary: "Perfil prometedor para liderar arquitectura.",
    };

    mockApiFetch.mockResolvedValueOnce(mockGeneratedRanking);

    const { generateRanking, isEvaluating, rankingResult, currentJobId, isCooldownActive } =
      useApplicantAiRanking();
    currentJobId.value = "job-200";
    rankingResult.value = null;

    await generateRanking();

    expect(mockApiFetch).toHaveBeenCalledWith("/jobs/job-200/ai-ranking", {
      method: "POST",
    });
    expect(rankingResult.value).toEqual(mockGeneratedRanking);
    expect(isEvaluating.value).toBe(false);
    expect(isCooldownActive.value).toBe(true);
    expect(mockShowSuccess).toHaveBeenCalledWith(
      "Comparativa Generada",
      expect.stringContaining("Inteligencia Artificial"),
    );
  });

  it("should handle 429 cooldown response from backend gracefully", async () => {
    mockApiFetch.mockRejectedValueOnce({
      statusCode: 429,
      data: {
        cooldown: true,
        error: "Tienes un registro de enfriamiento activo en DynamoDB.",
        remainingSeconds: 3600,
        expiresAt: new Date(Date.now() + 3600 * 1000).toISOString(),
      },
    });

    const { generateRanking, isEvaluating, errorMessage, currentJobId, isCooldownActive } =
      useApplicantAiRanking();
    currentJobId.value = "job-429";

    await generateRanking();

    expect(isEvaluating.value).toBe(false);
    expect(errorMessage.value).toContain("DynamoDB");
    expect(isCooldownActive.value).toBe(true);
    expect(mockShowInfo).toHaveBeenCalledWith(
      expect.stringContaining("24 horas"),
      expect.stringContaining("DynamoDB"),
    );
  });

  it("should handle general error during generateRanking gracefully", async () => {
    mockApiFetch.mockRejectedValueOnce({
      statusCode: 500,
      data: { error: "Error interno del servidor." },
    });

    const { generateRanking, isEvaluating, errorMessage, currentJobId } =
      useApplicantAiRanking();
    currentJobId.value = "job-300";

    await generateRanking();

    expect(isEvaluating.value).toBe(false);
    expect(errorMessage.value).toBe("Error interno del servidor.");
    expect(mockShowError).toHaveBeenCalledWith(
      "Error de Análisis IA",
      "Error interno del servidor.",
    );
  });
});
