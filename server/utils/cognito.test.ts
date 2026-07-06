import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { getCognitoConfig, calculateSecretHash, callCognito } from "./cognito";

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
        "User already exists",
      );
      expect(global.createError).toHaveBeenCalledWith({
        statusCode: 400,
        statusMessage: "User already exists",
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
        "Error executing Cognito operation",
      );
      expect(global.createError).toHaveBeenCalledWith({
        statusCode: 400,
        statusMessage: "Error executing Cognito operation",
        data: { code: "CognitoError" },
      });
    });
  });
});
