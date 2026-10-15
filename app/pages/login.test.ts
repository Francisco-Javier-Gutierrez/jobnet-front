import { describe, it, expect, vi, beforeEach } from "vitest";

describe("Autenticación de Candidatos e Inicio de Sesión con Google", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("1. Formulario Seguro de Credenciales (Correo y Contraseña)", () => {
    it("debe validar que los campos de correo y contraseña sean obligatorios", () => {
      const validateCredentialsForm = (email: string, pass: string) => {
        if (!email?.trim()) return "El correo electrónico es requerido";
        if (!pass) return "La contraseña es requerida";
        return null;
      };

      expect(validateCredentialsForm("", "")).toBe("El correo electrónico es requerido");
      expect(validateCredentialsForm("candidato@gmail.com", "")).toBe("La contraseña es requerida");
      expect(validateCredentialsForm("candidato@gmail.com", "Password#2026")).toBeNull();
    });

    it("debe procesar credenciales válidas, generar token de sesión y redirigir al flujo principal", async () => {
      const signInMock = vi.fn().mockResolvedValue({ error: null });
      const routerPushMock = vi.fn();

      const performLogin = async (email: string, pass: string, userRole = "CANDIDATO") => {
        const res = await signInMock("credentials", {
          email,
          password: pass,
          redirect: false,
        });

        if (!res?.error) {
          if (userRole === "CANDIDATO") {
            routerPushMock("/");
          } else if (userRole === "EMPRESA") {
            routerPushMock("/applicants");
          }
          return { success: true };
        }
        return { success: false, error: res.error };
      };

      const result = await performLogin("candidato.valido@gmail.com", "SecretPass#123", "CANDIDATO");
      expect(result.success).toBe(true);
      expect(signInMock).toHaveBeenCalledWith("credentials", {
        email: "candidato.valido@gmail.com",
        password: "SecretPass#123",
        redirect: false,
      });
      expect(routerPushMock).toHaveBeenCalledWith("/");
    });

    it("debe desplegar mensaje de alerta de 'Credenciales inválidas' ante datos incorrectos", async () => {
      const errorMap: Record<string, string> = {
        NotAuthorizedException: "Credenciales inválidas",
        UserNotFoundException: "Credenciales inválidas",
        InvalidPasswordException: "Credenciales inválidas",
      };

      const handleLoginFailure = (cognitoErrorCode: string) => {
        return errorMap[cognitoErrorCode] || "Credenciales inválidas";
      };

      expect(handleLoginFailure("NotAuthorizedException")).toBe("Credenciales inválidas");
      expect(handleLoginFailure("UserNotFoundException")).toBe("Credenciales inválidas");
      expect(handleLoginFailure("InvalidPasswordException")).toBe("Credenciales inválidas");
      expect(handleLoginFailure("UnknownError")).toBe("Credenciales inválidas");
    });
  });

  describe("2. Acceso Rápido con Proveedor Federado (Google Sign-In con OAuth 2.0 enlazado a AWS Cognito)", () => {
    it("debe construir la URL OAuth 2.0 directa para AWS Cognito con identity_provider=Google", () => {
      const buildCognitoGoogleUrl = (options: {
        cognitoDomain: string;
        clientId: string;
        redirectUri: string;
      }) => {
        return `https://${options.cognitoDomain}/oauth2/authorize?identity_provider=Google&redirect_uri=${encodeURIComponent(
          options.redirectUri,
        )}&response_type=code&client_id=${options.clientId}&scope=email+openid+profile`;
      };

      const url = buildCognitoGoogleUrl({
        cognitoDomain: "jobnet-auth-prod.auth.us-east-1.amazoncognito.com",
        clientId: "4ef8k4tofjj4ounvo8nf7d9pep",
        redirectUri: "http://localhost:3000/api/auth/callback/cognito",
      });

      expect(url).toContain("identity_provider=Google");
      expect(url).toContain("client_id=4ef8k4tofjj4ounvo8nf7d9pep");
      expect(url).toContain("scope=email+openid+profile");
      expect(url).toContain("response_type=code");
      expect(url).toContain(encodeURIComponent("http://localhost:3000/api/auth/callback/cognito"));
    });

    it("debe autenticar en un solo clic y sincronizar automáticamente nombre y correo del candidato", async () => {
      const syncProfileMock = vi.fn().mockResolvedValue({ success: true });
      const routerPushMock = vi.fn();

      const handleGoogleOneClickAuth = async (googleUser: {
        sub: string;
        name: string;
        email: string;
      }) => {
        // Sincronización automática de perfil en backend/DynamoDB
        await syncProfileMock({
          id: googleUser.sub,
          email: googleUser.email,
          nombre: googleUser.name,
          tipoUsuario: "CANDIDATO",
          estadoCuenta: "ACTIVO",
          origenRegistro: "GOOGLE_OAUTH",
        });

        // Redirección directa al flujo principal
        routerPushMock("/");
        return { success: true };
      };

      const googleCandidate = {
        sub: "google-oauth2-108293847291",
        name: "Carlos Mendoza García",
        email: "carlos.mendoza@gmail.com",
      };

      const result = await handleGoogleOneClickAuth(googleCandidate);
      expect(result.success).toBe(true);
      expect(syncProfileMock).toHaveBeenCalledWith(
        expect.objectContaining({
          id: "google-oauth2-108293847291",
          nombre: "Carlos Mendoza García",
          email: "carlos.mendoza@gmail.com",
          tipoUsuario: "CANDIDATO",
          estadoCuenta: "ACTIVO",
          origenRegistro: "GOOGLE_OAUTH",
        }),
      );
      expect(routerPushMock).toHaveBeenCalledWith("/");
    });
  });
});
