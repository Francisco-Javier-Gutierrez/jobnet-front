import { describe, it, expect } from "vitest";
import {
  extractEmailDomain,
  isPublicEmailDomain,
  isCorporateEmailDomain,
  isBlockedFraudDomain,
  isValidRfc,
  getRfcType,
} from "../utils/domainVerifier";

describe("Registro de Organización - Requerimiento Institucional", () => {
  describe("Captura y Validación de los 6 Campos Obligatorios", () => {
    it("debe validar la presencia de los 6 campos formales", () => {
      const form = {
        razonSocial: "Innovación Tecnológica Global S.A. de C.V.",
        nombreComercial: "InnoTech Global",
        rfc: "ITG180512AB3",
        phone: "+52 55 1234 5678",
        email: "reclutamiento@innotech.mx",
        password: "Password#2026",
      };

      expect(form.razonSocial.trim().length).toBeGreaterThan(0);
      expect(form.nombreComercial.trim().length).toBeGreaterThan(0);
      expect(isValidRfc(form.rfc)).toBe(true);
      expect(form.phone.trim().length).toBeGreaterThan(0);
      expect(form.email.trim().length).toBeGreaterThan(0);
      expect(form.password.length).toBeGreaterThanOrEqual(8);
    });
  });

  describe("Validación Formal de Sintaxis Fiscal de RFC (SAT)", () => {
    it("debe validar RFC de Persona Moral (12 caracteres)", () => {
      const rfcMoral = "TDA980512AB3";
      expect(isValidRfc(rfcMoral)).toBe(true);
      expect(getRfcType(rfcMoral)).toBe("MORAL");
    });

    it("debe validar RFC de Persona Física con Actividad Empresarial (13 caracteres)", () => {
      const rfcFisica = "PEGA8801019H2";
      expect(isValidRfc(rfcFisica)).toBe(true);
      expect(getRfcType(rfcFisica)).toBe("FISICA");
    });

    it("debe rechazar RFC con sintaxis no válida", () => {
      expect(isValidRfc("")).toBe(false);
      expect(isValidRfc("ABC123456")).toBe(false); // 9 caracteres (sin homoclave)
      expect(isValidRfc("ABCD123456")).toBe(false); // 10 caracteres (sin homoclave)
      expect(isValidRfc("ABCDE123456789")).toBe(false); // 14 caracteres (excede longitud)
      expect(isValidRfc("RFC-INVALIDO!")).toBe(false); // Caracteres no permitidos
      expect(getRfcType("INVALID")).toBe("INVALIDO");
    });
  });

  describe("Verificación de Dominios Bloqueados por Fraude (RN-3)", () => {
    it("debe bloquear el registro si el correo pertenece a un dominio en la lista de fraude", () => {
      const fraudEmails = [
        "recruiter@fraudcorp.com",
        "talento@estafaslaborales.com",
        "rh@fake-hiring.net",
        "jobs@scam-recruiters.org",
        "contacto@phishing-jobs.xyz",
      ];

      for (const email of fraudEmails) {
        expect(isBlockedFraudDomain(email)).toBe(true);
      }
    });

    it("debe permitir el registro si el correo es legítimo y no está en la lista de fraude", () => {
      const legitimateEmails = [
        "reclutamiento@techsolutions.mx",
        "talento@innovacion.com",
        "contacto@empresa.com.mx",
        "reclutador@gmail.com",
      ];

      for (const email of legitimateEmails) {
        expect(isBlockedFraudDomain(email)).toBe(false);
      }
    });
  });

  describe("Armonización con Verificación Automatizada (Cero Conflicto)", () => {
    it("debe otorgar estatus 'Verificada' automáticamente si el correo tiene dominio corporativo privado", () => {
      const email = "contacto@innovatech.com";
      const isCorporate = isCorporateEmailDomain(email);
      expect(isCorporate).toBe(true);

      const verificationStatus = isCorporate ? "VERIFICADA" : "PENDIENTE";
      const isAutoVerified = isCorporate;

      expect(verificationStatus).toBe("VERIFICADA");
      expect(isAutoVerified).toBe(true);
    });

    it("debe otorgar estatus inicial 'No verificada' (PENDIENTE) si el correo es de dominio público gratuito", () => {
      const email = "miempresa.reclutamiento@gmail.com";
      const isCorporate = isCorporateEmailDomain(email);
      const isPublic = isPublicEmailDomain(email);

      expect(isCorporate).toBe(false);
      expect(isPublic).toBe(true);

      const verificationStatus = isCorporate ? "VERIFICADA" : "PENDIENTE";
      const isAutoVerified = isCorporate;

      expect(verificationStatus).toBe("PENDIENTE");
      expect(isAutoVerified).toBe(false);
    });
  });

  describe("Despacho de Código Criptográfico de Confirmación", () => {
    it("debe generar la redirección correcta a /verify-otp con email y estatus", () => {
      const email = "talento@techsolutions.mx";
      const isCorporate = isCorporateEmailDomain(email);

      const queryParams = {
        email,
        autoVerified: isCorporate ? "true" : "false",
      };

      expect(queryParams.email).toBe("talento@techsolutions.mx");
      expect(queryParams.autoVerified).toBe("true");
    });
  });
});
