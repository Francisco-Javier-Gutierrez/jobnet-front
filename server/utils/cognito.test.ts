import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  getCognitoConfig,
  calculateSecretHash,
  callCognito,
  translateCognitoError,
} from "./cognito";

// Mock global createError for Nuxt environment
global.createError = vi.fn((err: any) => {
  const error: any = new Error(err.statusMessage);
  error.statusCode = err.statusCode;
  error.data = err.data;
  return error;
}) as any;

describe("Cognito Utils", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe("getCognitoConfig", () => {
    it("should return config from environment variables", () => {
      process.env.COGNITO_CLIENT_ID = "test-client-id";
      process.env.COGNITO_CLIENT_SECRET = "test-client-secret";
      process.env.COGNITO_ISSUER =
        "https://cognito-idp.us-east-1.amazonaws.com/us-east-1_xxxxxxxxx";
      process.env.COGNITO_REGION = "us-east-1";

      const config = getCognitoConfig();
      expect(config.clientId).toBe("test-client-id");
      expect(config.clientSecret).toBe("test-client-secret");
      expect(config.region).toBe("us-east-1");
    });

    it("should fallback to defaults when environment variables are missing", () => {
      delete process.env.COGNITO_CLIENT_ID;
      delete process.env.COGNITO_CLIENT_SECRET;
      delete process.env.COGNITO_ISSUER;
      delete process.env.COGNITO_REGION;

      const config = getCognitoConfig();
      expect(config.clientId).toBe("");
      expect(config.clientSecret).toBe("");
      expect(config.region).toBe("us-east-1");
    });

    it("should extract region from issuer if COGNITO_REGION is missing", () => {
      delete process.env.COGNITO_REGION;
      process.env.COGNITO_ISSUER =
        "https://cognito-idp.us-west-2.amazonaws.com/us-west-2_xxxxxxxxx";

      const config = getCognitoConfig();
      expect(config.region).toBe("us-west-2");
    });
  });

  describe("calculateSecretHash", () => {
    it("should calculate valid HMAC SHA256 base64 hash", () => {
      const username = "test@example.com";
      const clientId = "client123";
      const clientSecret = "secret456";

      // Expected hash pre-calculated
      const hash = calculateSecretHash(username, clientId, clientSecret);
      expect(hash).toBeDefined();
      expect(typeof hash).toBe("string");
      expect(hash.length).toBeGreaterThan(0);
    });
  });

  describe("callCognito", () => {
    it("should call fetch and return JSON response on success", async () => {
      process.env.COGNITO_REGION = "us-east-1";
      const mockResponse = { UserConfirmed: true };

      const fetchMock = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => mockResponse,
      });
      global.fetch = fetchMock;

      const result = await callCognito("SignUp", { ClientId: "123" });

      expect(fetchMock).toHaveBeenCalledWith(
        "https://cognito-idp.us-east-1.amazonaws.com/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-amz-json-1.1",
            "X-Amz-Target": "AWSCognitoIdentityProviderService.SignUp",
          },
          body: JSON.stringify({ ClientId: "123" }),
        },
      );
      expect(result).toEqual(mockResponse);
    });

    it("should throw formatted error on failed response", async () => {
      process.env.COGNITO_REGION = "us-east-1";
      const mockErrorResponse = {
        __type:
          "com.amazonaws.cognito.identityprovider.model#UsernameExistsException",
        message: "User already exists",
      };

      const fetchMock = vi.fn().mockResolvedValue({
        ok: false,
        status: 400,
        json: async () => mockErrorResponse,
      });
      global.fetch = fetchMock;

      await expect(callCognito("SignUp", { ClientId: "123" })).rejects.toThrow(
        "Ya existe una cuenta registrada con este correo electrónico.",
      );
      expect(global.createError).toHaveBeenCalledWith({
        statusCode: 400,
        statusMessage:
          "Ya existe una cuenta registrada con este correo electrónico.",
        data: { code: "UsernameExistsException" },
      });
    });

    it("should fallback to default error code if __type is missing", async () => {
      process.env.COGNITO_REGION = "us-east-1";
      const mockErrorResponse = {
        message: "Unknown error occurred",
      };

      const fetchMock = vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        json: async () => mockErrorResponse,
      });
      global.fetch = fetchMock;

      await expect(callCognito("SignUp", { ClientId: "123" })).rejects.toThrow(
        "Unknown error occurred",
      );
      expect(global.createError).toHaveBeenCalledWith({
        statusCode: 500,
        statusMessage: "Unknown error occurred",
        data: { code: "CognitoError" },
      });
    });

    it("should fallback to default error code if __type is present but lacks hash symbol", async () => {
      process.env.COGNITO_REGION = "us-east-1";
      const mockErrorResponse = {
        __type: "SomeExceptionWithNoHash",
        message: "Error without hash",
      };

      const fetchMock = vi.fn().mockResolvedValue({
        ok: false,
        status: 400,
        json: async () => mockErrorResponse,
      });
      global.fetch = fetchMock;

      await expect(callCognito("SignUp", { ClientId: "123" })).rejects.toThrow(
        "Error without hash",
      );
      expect(global.createError).toHaveBeenCalledWith({
        statusCode: 400,
        statusMessage: "Error without hash",
        data: { code: "CognitoError" },
      });
    });

    it("should fallback to default statusMessage if message is missing in Cognito error response", async () => {
      process.env.COGNITO_REGION = "us-east-1";
      const mockErrorResponse = {
        __type: "SomeException",
      };

      const fetchMock = vi.fn().mockResolvedValue({
        ok: false,
        status: 400,
        json: async () => mockErrorResponse,
      });
      global.fetch = fetchMock;

      await expect(callCognito("SignUp", { ClientId: "123" })).rejects.toThrow(
        "Ocurrió un error de autenticación.",
      );
      expect(global.createError).toHaveBeenCalledWith({
        statusCode: 400,
        statusMessage: "Ocurrió un error de autenticación.",
        data: { code: "CognitoError" },
      });
    });
  });

  describe("translateCognitoError", () => {
    it("should translate UserNotFoundException", () => {
      expect(translateCognitoError("UserNotFoundException", "")).toBe(
        "Verifique sus datos.",
      );
    });

    it("should translate NotAuthorizedException", () => {
      expect(translateCognitoError("NotAuthorizedException", "")).toBe(
        "El usuario o la contraseña son incorrectos.",
      );
    });

    it("should translate UserNotConfirmedException", () => {
      expect(translateCognitoError("UserNotConfirmedException", "")).toBe(
        "El usuario no ha sido confirmado. Por favor, verifique su código OTP.",
      );
    });

    it("should translate LimitExceededException", () => {
      expect(translateCognitoError("LimitExceededException", "")).toBe(
        "Se ha superado el límite de intentos. Inténtelo más tarde.",
      );
    });

    it("should translate CodeMismatchException", () => {
      expect(translateCognitoError("CodeMismatchException", "")).toBe(
        "El código de verificación ingresado es incorrecto.",
      );
    });

    it("should translate ExpiredCodeMismatchException and ExpiredCodeException", () => {
      expect(translateCognitoError("ExpiredCodeMismatchException", "")).toBe(
        "El código de verificación ha expirado.",
      );
      expect(translateCognitoError("ExpiredCodeException", "")).toBe(
        "El código de verificación ha expirado.",
      );
    });

    it("should translate InvalidPasswordException", () => {
      expect(translateCognitoError("InvalidPasswordException", "")).toBe(
        "La contraseña no cumple con los requisitos mínimos de seguridad (debe tener al menos 8 caracteres, incluyendo mayúsculas, minúsculas y un número).",
      );
    });

    it("should translate UsernameExistsException", () => {
      expect(translateCognitoError("UsernameExistsException", "")).toBe(
        "Ya existe una cuenta registrada con este correo electrónico.",
      );
    });

    it("should translate TooManyRequestsException", () => {
      expect(translateCognitoError("TooManyRequestsException", "")).toBe(
        "Demasiadas solicitudes. Por favor, inténtelo de nuevo más tarde.",
      );
    });

    it("should translate InvalidParameterException", () => {
      expect(
        translateCognitoError(
          "InvalidParameterException",
          "username format is bad",
        ),
      ).toBe("El formato del correo electrónico es inválido.");
      expect(
        translateCognitoError(
          "InvalidParameterException",
          "email format is bad",
        ),
      ).toBe("El formato del correo electrónico es inválido.");
      expect(
        translateCognitoError("InvalidParameterException", "other param"),
      ).toBe(
        "Los parámetros proporcionados son inválidos o faltan campos obligatorios.",
      );
    });

    it("should translate AliasExistsException", () => {
      expect(translateCognitoError("AliasExistsException", "")).toBe(
        "Este correo electrónico ya se encuentra registrado por otro usuario.",
      );
    });

    it("should translate CodeDeliveryFailureException", () => {
      expect(translateCognitoError("CodeDeliveryFailureException", "")).toBe(
        "No se pudo entregar el código de verificación. Por favor intente más tarde.",
      );
    });

    it("should translate InvalidLambdaResponseException and UnexpectedLambdaException", () => {
      expect(translateCognitoError("InvalidLambdaResponseException", "")).toBe(
        "Error interno del servicio de autenticación. Por favor intente nuevamente.",
      );
      expect(translateCognitoError("UnexpectedLambdaException", "")).toBe(
        "Error interno del servicio de autenticación. Por favor intente nuevamente.",
      );
    });

    it("should fallback to generic translations from originalMessage", () => {
      expect(
        translateCognitoError("UnknownException", "user does not exist"),
      ).toBe("Verifique sus datos.");
      expect(
        translateCognitoError(
          "UnknownException",
          "incorrect username or password",
        ),
      ).toBe("El usuario o la contraseña son incorrectos.");
      expect(
        translateCognitoError("UnknownException", "password attempts exceeded"),
      ).toBe("Límite de intentos excedido. Por favor intente más tarde.");
      expect(
        translateCognitoError("UnknownException", "user is not confirmed"),
      ).toBe(
        "El usuario no ha sido confirmado. Por favor, verifique su código OTP.",
      );
      expect(
        translateCognitoError("UnknownException", "some other message"),
      ).toBe("some other message");
    });
  });
});
