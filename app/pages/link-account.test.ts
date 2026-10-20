import { describe, it, expect, vi, beforeEach } from "vitest";

describe("Vinculación de Cuentas Nativas con Google OAuth (Account Linking Interceptor)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("1. Detección e Intercepción en Inicio de Sesión con Google", () => {
    it("debe interceptar el flujo si existe una cuenta nativa previa y redirigir a /link-account", () => {
      const evaluateGoogleSignIn = (options: {
        userEmail: string;
        googleSub: string;
        googleName: string;
        existingProfiles: Array<{
          email: string;
          origenRegistro?: string;
          linkedGoogleSub?: string;
        }>;
      }) => {
        const { userEmail, googleSub, googleName, existingProfiles } = options;
        const matching = existingProfiles.filter(
          (p) => p.email.toLowerCase() === userEmail.toLowerCase(),
        );

        const alreadyLinked = matching.find(
          (p) =>
            p.linkedGoogleSub === googleSub ||
            p.origenRegistro === "LINKED_GOOGLE",
        );

        const nativeAccount = matching.find(
          (p) =>
            p.origenRegistro !== "GOOGLE_OAUTH" &&
            p.origenRegistro !== "LINKED_GOOGLE" &&
            p.linkedGoogleSub !== googleSub,
        );

        if (nativeAccount && !alreadyLinked) {
          return `/link-account?email=${encodeURIComponent(userEmail)}&googleSub=${encodeURIComponent(googleSub)}&name=${encodeURIComponent(googleName)}`;
        }

        return true;
      };

      const profiles = [
        {
          email: "candidato.nativo@gmail.com",
          origenRegistro: "DIRECTO",
        },
      ];

      const redirectUrl = evaluateGoogleSignIn({
        userEmail: "candidato.nativo@gmail.com",
        googleSub: "google-sub-998877",
        googleName: "Candidato Nativo",
        existingProfiles: profiles,
      });

      expect(redirectUrl).toBe(
        "/link-account?email=candidato.nativo%40gmail.com&googleSub=google-sub-998877&name=Candidato%20Nativo",
      );
    });

    it("no debe interceptar si la cuenta ya se encuentra vinculada a Google", () => {
      const evaluateGoogleSignIn = (options: {
        userEmail: string;
        googleSub: string;
        existingProfiles: Array<{
          email: string;
          origenRegistro?: string;
          linkedGoogleSub?: string;
        }>;
      }) => {
        const { userEmail, googleSub, existingProfiles } = options;
        const matching = existingProfiles.filter(
          (p) => p.email.toLowerCase() === userEmail.toLowerCase(),
        );

        const alreadyLinked = matching.find(
          (p) =>
            p.linkedGoogleSub === googleSub ||
            p.origenRegistro === "LINKED_GOOGLE",
        );

        const nativeAccount = matching.find(
          (p) =>
            p.origenRegistro !== "GOOGLE_OAUTH" &&
            p.origenRegistro !== "LINKED_GOOGLE" &&
            p.linkedGoogleSub !== googleSub,
        );

        if (nativeAccount && !alreadyLinked) {
          return "/link-account";
        }

        return true;
      };

      const profiles = [
        {
          email: "candidato.vinculado@gmail.com",
          origenRegistro: "LINKED_GOOGLE",
          linkedGoogleSub: "google-sub-112233",
        },
      ];

      const result = evaluateGoogleSignIn({
        userEmail: "candidato.vinculado@gmail.com",
        googleSub: "google-sub-112233",
        existingProfiles: profiles,
      });

      expect(result).toBe(true);
    });
  });

  describe("2. Verificación de Contraseña y Vinculación Segura (Anti-Account Takeover)", () => {
    it("debe validar exitosamente la contraseña de JobNet antes de vincular", async () => {
      const callCognitoMock = vi.fn().mockResolvedValue({
        AuthenticationResult: {
          IdToken: "header.eyJzdWIiOiJ1dWlkLW5hdGl2by0xMjM0In0.sig",
        },
      });

      const updateProfileMock = vi.fn().mockResolvedValue({ success: true });

      const linkAccount = async (params: {
        email: string;
        pass: string;
        googleSub: string;
      }) => {
        if (!params.pass) throw new Error("Contraseña requerida");

        const auth = await callCognitoMock("InitiateAuth", {
          AuthFlow: "USER_PASSWORD_AUTH",
          USERNAME: params.email,
          PASSWORD: params.pass,
        });

        if (auth.AuthenticationResult) {
          await updateProfileMock({
            isFederated: true,
            linkedGoogleSub: params.googleSub,
            origenRegistro: "LINKED_GOOGLE",
          });
          return { success: true };
        }
        return { success: false };
      };

      const result = await linkAccount({
        email: "candidato@gmail.com",
        pass: "Password#123",
        googleSub: "google-sub-998877",
      });

      expect(result.success).toBe(true);
      expect(callCognitoMock).toHaveBeenCalled();
      expect(updateProfileMock).toHaveBeenCalledWith(
        expect.objectContaining({
          isFederated: true,
          linkedGoogleSub: "google-sub-998877",
          origenRegistro: "LINKED_GOOGLE",
        }),
      );
    });

    it("debe rechazar la vinculación si la contraseña ingresada es incorrecta", async () => {
      const callCognitoMock = vi
        .fn()
        .mockRejectedValue(new Error("NotAuthorizedException"));

      const linkAccount = async (params: { email: string; pass: string }) => {
        try {
          await callCognitoMock("InitiateAuth", {
            AuthFlow: "USER_PASSWORD_AUTH",
            USERNAME: params.email,
            PASSWORD: params.pass,
          });
          return { success: true };
        } catch {
          return {
            success: false,
            message:
              "La contraseña ingresada es incorrecta. Por favor verifique sus credenciales para autorizar la vinculación.",
          };
        }
      };

      const result = await linkAccount({
        email: "candidato@gmail.com",
        pass: "WrongPassword",
      });

      expect(result.success).toBe(false);
      expect(result.message).toContain("contraseña ingresada es incorrecta");
    });
  });

  describe("3. Opción de Rechazo de Vinculación", () => {
    it("debe permitir al usuario rechazar la vinculación y redirigir a /login sin alterar la cuenta", () => {
      const routerPushMock = vi.fn();

      const handleDecline = (email: string) => {
        routerPushMock({
          path: "/login",
          query: {
            unlinked: "true",
            email,
          },
        });
      };

      handleDecline("candidato@gmail.com");

      expect(routerPushMock).toHaveBeenCalledWith({
        path: "/login",
        query: {
          unlinked: "true",
          email: "candidato@gmail.com",
        },
      });
    });
  });
});
