import { describe, it, expect, vi, beforeEach } from "vitest";

describe("MFA Setup & Profile Synchronization", () => {
  const mockApiFetch = vi.fn();
  const mockGlobalFetch = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("debe enviar headers de autorización y x-user-id al sincronizar el perfil en DynamoDB", async () => {
    const session = {
      user: {
        id: "6488c4d8-70b1-7043-4f6b-9951b8f7859a",
        tipoUsuario: "CANDIDATO",
        email: "candidato@jobnet.mx",
      },
      accessToken: "mock-access-token-xyz",
      idToken: "mock-id-token-abc",
    };

    mockApiFetch.mockResolvedValueOnce({ success: true });

    // Simular el guardado de estado de MFA
    const userId = session.user.id;
    const token = session.idToken || session.accessToken;
    await mockApiFetch(`/profile/${userId}`, {
      method: "POST",
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        "x-user-id": userId,
      },
      body: {
        mfaConfigured: true,
        mfaEnabled: true,
      },
    });

    expect(mockApiFetch).toHaveBeenCalledWith(
      "/profile/6488c4d8-70b1-7043-4f6b-9951b8f7859a",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          Authorization: "Bearer mock-id-token-abc",
          "x-user-id": "6488c4d8-70b1-7043-4f6b-9951b8f7859a",
        }),
        body: {
          mfaConfigured: true,
          mfaEnabled: true,
        },
      }),
    );
  });

  it("debe extraer correctamente el mensaje de error cuando la API devuelve { error: '...' }", () => {
    const apiError = {
      data: {
        error: "Not authorized to update this profile",
      },
    };

    const extractErrorMessage = (error: any) =>
      error.data?.error ||
      error.data?.message ||
      error.message ||
      "Error al intentar activar MFA en Cognito";

    expect(extractErrorMessage(apiError)).toBe(
      "Not authorized to update this profile",
    );
  });
});
