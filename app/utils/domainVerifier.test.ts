import { describe, it, expect } from "vitest";
import {
  extractEmailDomain,
  isPublicEmailDomain,
  isCorporateEmailDomain,
  PUBLIC_EMAIL_DOMAINS,
  isBlockedFraudDomain,
  BLOCKED_FRAUD_DOMAINS,
  isValidRfc,
  getRfcType,
} from "./domainVerifier";

describe("Domain Verifier - Verificación Automatizada de Organizaciones", () => {
  describe("extractEmailDomain", () => {
    it("should extract domain from normal email address", () => {
      expect(extractEmailDomain("reclutador@techsolutions.mx")).toBe(
        "techsolutions.mx",
      );
      expect(extractEmailDomain("admin@innovatech.com")).toBe("innovatech.com");
      expect(extractEmailDomain("TALENTO@EMPRESA.COM.MX")).toBe(
        "empresa.com.mx",
      );
    });

    it("should return empty string if email is missing or invalid", () => {
      expect(extractEmailDomain("")).toBe("");
      expect(extractEmailDomain("sin-arroba")).toBe("");
      expect(extractEmailDomain(null as any)).toBe("");
    });
  });

  describe("isPublicEmailDomain", () => {
    it("should return true for public free email providers", () => {
      expect(isPublicEmailDomain("gmail.com")).toBe(true);
      expect(isPublicEmailDomain("reclutador@gmail.com")).toBe(true);
      expect(isPublicEmailDomain("contacto@hotmail.com")).toBe(true);
      expect(isPublicEmailDomain("empresa@outlook.com")).toBe(true);
      expect(isPublicEmailDomain("rrhh@yahoo.com")).toBe(true);
      expect(isPublicEmailDomain("info@icloud.com")).toBe(true);
      expect(isPublicEmailDomain("contacto@proton.me")).toBe(true);
      expect(isPublicEmailDomain("empresa@live.com")).toBe(true);
      expect(isPublicEmailDomain("rrhh@zoho.com")).toBe(true);
    });

    it("should return false for private corporate email domains", () => {
      expect(isPublicEmailDomain("techsolutions.mx")).toBe(false);
      expect(isPublicEmailDomain("contacto@techsolutions.mx")).toBe(false);
      expect(isPublicEmailDomain("talento@innovatech.com")).toBe(false);
      expect(isPublicEmailDomain("rrhh@bancoazteca.com.mx")).toBe(false);
      expect(isPublicEmailDomain("admin@universidad.edu.mx")).toBe(false);
    });

    it("should return true for empty domain to prevent false positives", () => {
      expect(isPublicEmailDomain("")).toBe(true);
    });
  });

  describe("isCorporateEmailDomain", () => {
    it("should return true for private corporate domains", () => {
      expect(isCorporateEmailDomain("reclutador@techsolutions.mx")).toBe(true);
      expect(isCorporateEmailDomain("talento@innovatech.com")).toBe(true);
      expect(isCorporateEmailDomain("contacto@grupo-modelo.com.mx")).toBe(true);
      expect(isCorporateEmailDomain("novasolutions.mx")).toBe(true);
    });

    it("should return false for public email providers", () => {
      expect(isCorporateEmailDomain("reclutador@gmail.com")).toBe(false);
      expect(isCorporateEmailDomain("empresa@hotmail.com")).toBe(false);
      expect(isCorporateEmailDomain("talento@outlook.com")).toBe(false);
      expect(isCorporateEmailDomain("contacto@yahoo.com")).toBe(false);
      expect(isCorporateEmailDomain("gmail.com")).toBe(false);
    });

    it("should return false for invalid or malformed domains", () => {
      expect(isCorporateEmailDomain("invalid-no-dot")).toBe(false);
      expect(isCorporateEmailDomain("user@nodot")).toBe(false);
      expect(isCorporateEmailDomain("")).toBe(false);
    });
  });

  describe("Automatic Approval Logic Verification", () => {
    it("should automatically approve and verify an organization with a corporate domain", () => {
      const corporateEmail = "contacto@techsolutions.mx";
      const isCorporate = isCorporateEmailDomain(corporateEmail);

      expect(isCorporate).toBe(true);

      const verificationStatus = isCorporate ? "VERIFICADA" : "PENDIENTE";
      const isVerified = isCorporate;

      expect(verificationStatus).toBe("VERIFICADA");
      expect(isVerified).toBe(true);
    });

    it("should NOT automatically approve an organization with a public email domain (requires manual review)", () => {
      const publicEmail = "reclutador.pyme@gmail.com";
      const isCorporate = isCorporateEmailDomain(publicEmail);

      expect(isCorporate).toBe(false);

      const verificationStatus = isCorporate ? "VERIFICADA" : "PENDIENTE";
      const isVerified = isCorporate;

      expect(verificationStatus).toBe("PENDIENTE");
      expect(isVerified).toBe(false);
    });
  });

  describe("PUBLIC_EMAIL_DOMAINS Registry", () => {
    it("should have all standard public providers registered", () => {
      expect(PUBLIC_EMAIL_DOMAINS.has("gmail.com")).toBe(true);
      expect(PUBLIC_EMAIL_DOMAINS.has("hotmail.com")).toBe(true);
      expect(PUBLIC_EMAIL_DOMAINS.has("outlook.com")).toBe(true);
      expect(PUBLIC_EMAIL_DOMAINS.has("yahoo.com")).toBe(true);
      expect(PUBLIC_EMAIL_DOMAINS.has("proton.me")).toBe(true);
    });
  });

  describe("BLOCKED_FRAUD_DOMAINS & isBlockedFraudDomain (RN-3)", () => {
    it("should detect domains on the fraud blacklist", () => {
      expect(isBlockedFraudDomain("recruiter@fraudcorp.com")).toBe(true);
      expect(isBlockedFraudDomain("contacto@estafaslaborales.com")).toBe(true);
      expect(isBlockedFraudDomain("fake-hiring.net")).toBe(true);
      expect(isBlockedFraudDomain("scam-recruiters.org")).toBe(true);
      expect(isBlockedFraudDomain("phishing-jobs.xyz")).toBe(true);
    });

    it("should return false for legitimate domains", () => {
      expect(isBlockedFraudDomain("recruiter@google.com")).toBe(false);
      expect(isBlockedFraudDomain("contacto@techsolutions.mx")).toBe(false);
      expect(isBlockedFraudDomain("talento@gmail.com")).toBe(false);
    });

    it("should return false for empty or invalid values", () => {
      expect(isBlockedFraudDomain("")).toBe(false);
      expect(isBlockedFraudDomain(null as any)).toBe(false);
    });

    it("should have known fraud domains registered in the Set", () => {
      expect(BLOCKED_FRAUD_DOMAINS.has("fraudcorp.com")).toBe(true);
      expect(BLOCKED_FRAUD_DOMAINS.has("estafaslaborales.com")).toBe(true);
      expect(BLOCKED_FRAUD_DOMAINS.has("fake-hiring.net")).toBe(true);
    });
  });

  describe("RFC Syntax Fiscal Validation (isValidRfc & getRfcType)", () => {
    it("should validate valid RFC for Persona Moral (12 characters)", () => {
      // 3 letters + 6 digits + 3 alnum homoclave
      expect(isValidRfc("ITE980512AB3")).toBe(true);
      expect(isValidRfc("TDA9510204N9")).toBe(true);
      expect(isValidRfc("BME0101019X8")).toBe(true);
      expect(getRfcType("ITE980512AB3")).toBe("MORAL");
      expect(getRfcType("TDA9510204N9")).toBe("MORAL");
    });

    it("should validate valid RFC for Persona Física (13 characters)", () => {
      // 4 letters + 6 digits + 3 alnum homoclave
      expect(isValidRfc("PEGA8801019H2")).toBe(true);
      expect(isValidRfc("GARM850315AA0")).toBe(true);
      expect(isValidRfc("ROAJ901231123")).toBe(true);
      expect(getRfcType("PEGA8801019H2")).toBe("FISICA");
      expect(getRfcType("GARM850315AA0")).toBe("FISICA");
    });

    it("should reject invalid RFC syntaxes", () => {
      expect(isValidRfc("")).toBe(false);
      expect(isValidRfc("12345")).toBe(false);
      expect(isValidRfc("INVALIDRFC123456")).toBe(false);
      expect(isValidRfc("ABCD123456")).toBe(false); // only 10 chars, missing homoclave
      expect(isValidRfc("ABC123456")).toBe(false); // 9 chars
      expect(isValidRfc("ABCD1234567890")).toBe(false); // 14 chars
      expect(isValidRfc("???8801019H2")).toBe(false); // invalid chars
      expect(getRfcType("INVALID")).toBe("INVALIDO");
      expect(getRfcType("")).toBe("INVALIDO");
    });

    it("should handle lowercase input gracefully after trimming/uppercasing", () => {
      expect(isValidRfc("ite980512ab3")).toBe(true);
      expect(isValidRfc("  pega8801019h2  ")).toBe(true);
    });
  });
});
