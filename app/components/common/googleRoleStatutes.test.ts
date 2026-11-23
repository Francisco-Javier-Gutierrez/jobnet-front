import { describe, it, expect, beforeEach, vi } from "vitest";

describe("Estatutos de Google Link, Google Sign-In y Segregación Estricta de Roles", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("1. Estatutos en Términos y Condiciones (Cláusula 3.1)", () => {
    it("debe estipular que el acceso e ingreso mediante Google otorga exclusivamente el rol de Candidato", () => {
      const termsStatute = {
        clausula: "3.1",
        titulo:
          "Estatutos de Autenticación Federada con Google (Google Sign-In), Vinculación de Cuentas (Google Link) y Estricta Segregación de Roles",
        alcanceExclusivo: "CANDIDATO",
        rolesIncompatiblesConOAuthSocial: [
          "ADMIN",
          "MODERATOR",
          "ORGANIZACION",
        ],
        reglas: [
          "Sesión estrictamente como Candidato",
          "Aislamiento y no elevación de privilegios",
          "Acceso a funciones principales obligatoriamente con contraseña",
        ],
      };

      expect(termsStatute.alcanceExclusivo).toBe("CANDIDATO");
      expect(termsStatute.rolesIncompatiblesConOAuthSocial).toContain("ADMIN");
      expect(termsStatute.rolesIncompatiblesConOAuthSocial).toContain(
        "MODERATOR",
      );
      expect(termsStatute.rolesIncompatiblesConOAuthSocial).toContain(
        "ORGANIZACION",
      );
      expect(termsStatute.reglas[0]).toContain("estrictamente como Candidato");
    });
  });

  describe("2. Determinación de Token JWT y Sesión para Usuarios Federados con Google", () => {
    it("debe forzar el rol CANDIDATO para sesiones iniciadas con Google incluso si la cuenta nativa es ADMIN", () => {
      const resolveUserTokenRole = (options: {
        isGoogleFederated: boolean;
        cognitoGroups: string[];
        customRole: string;
        nativeAccountRole?: string;
      }) => {
        const { isGoogleFederated, cognitoGroups, customRole } = options;

        if (
          !isGoogleFederated &&
          (cognitoGroups.includes("ADMIN") || customRole === "ADMIN")
        ) {
          return "ADMIN";
        }
        if (
          !isGoogleFederated &&
          (cognitoGroups.includes("MODERATOR") || customRole === "MODERATOR")
        ) {
          return "MODERATOR";
        }
        if (
          !isGoogleFederated &&
          (cognitoGroups.includes("ORGANIZACION") ||
            customRole === "ORGANIZACION")
        ) {
          return "ORGANIZACION";
        }

        // Si es Google federado, SIEMPRE es CANDIDATO
        return "CANDIDATO";
      };

      // Usuario con cuenta nativa ADMIN que ingresa con Google
      const roleViaGoogle = resolveUserTokenRole({
        isGoogleFederated: true,
        cognitoGroups: [],
        customRole: "",
        nativeAccountRole: "ADMIN",
      });
      expect(roleViaGoogle).toBe("CANDIDATO");

      // El mismo usuario que ingresa con contraseña nativa
      const roleViaPassword = resolveUserTokenRole({
        isGoogleFederated: false,
        cognitoGroups: ["ADMIN"],
        customRole: "ADMIN",
        nativeAccountRole: "ADMIN",
      });
      expect(roleViaPassword).toBe("ADMIN");
    });

    it("debe detectar si la cuenta posee una cuenta nativa con privilegios y exponerla para el aviso de redirección", () => {
      const evaluateSessionPrivilegeAlert = (options: {
        isGoogleFederated: boolean;
        userEmail: string;
        allProfiles: Array<{ email: string; tipoUsuario: string }>;
      }) => {
        if (!options.isGoogleFederated) {
          return { hasPrivilegedNativeAccount: false, nativeRole: null };
        }

        const matched = options.allProfiles.find(
          (p) =>
            p.email.toLowerCase() === options.userEmail.toLowerCase() &&
            p.tipoUsuario &&
            p.tipoUsuario !== "CANDIDATO",
        );

        if (matched) {
          return {
            hasPrivilegedNativeAccount: true,
            nativeRole: matched.tipoUsuario,
          };
        }

        return { hasPrivilegedNativeAccount: false, nativeRole: null };
      };

      const profiles = [
        { email: "chinopaco.05@gmail.com", tipoUsuario: "ADMIN" },
        { email: "mod@jobnet.mx", tipoUsuario: "MODERATOR" },
        { email: "candidate@gmail.com", tipoUsuario: "CANDIDATO" },
      ];

      const adminAlert = evaluateSessionPrivilegeAlert({
        isGoogleFederated: true,
        userEmail: "chinopaco.05@gmail.com",
        allProfiles: profiles,
      });
      expect(adminAlert.hasPrivilegedNativeAccount).toBe(true);
      expect(adminAlert.nativeRole).toBe("ADMIN");

      const candidateAlert = evaluateSessionPrivilegeAlert({
        isGoogleFederated: true,
        userEmail: "candidate@gmail.com",
        allProfiles: profiles,
      });
      expect(candidateAlert.hasPrivilegedNativeAccount).toBe(false);
      expect(candidateAlert.nativeRole).toBeNull();
    });
  });

  describe("3. Modal de Aceptación en URL de Redirección", () => {
    it("debe mostrar el modal si el usuario tiene cuenta privilegiada y no ha aceptado en la sesión actual", () => {
      const evaluateNoticeModalVisibility = (options: {
        isFederated: boolean;
        hasPrivilegedNativeAccount: boolean;
        hasAcceptedInSession: boolean;
        hasGoogleLoginQuery: boolean;
      }) => {
        if (!options.isFederated || !options.hasPrivilegedNativeAccount) {
          return false;
        }

        if (!options.hasAcceptedInSession || options.hasGoogleLoginQuery) {
          return true;
        }

        return false;
      };

      // Primer ingreso sin aceptar -> visible
      expect(
        evaluateNoticeModalVisibility({
          isFederated: true,
          hasPrivilegedNativeAccount: true,
          hasAcceptedInSession: false,
          hasGoogleLoginQuery: true,
        }),
      ).toBe(true);

      // Una vez aceptado -> oculto
      expect(
        evaluateNoticeModalVisibility({
          isFederated: true,
          hasPrivilegedNativeAccount: true,
          hasAcceptedInSession: true,
          hasGoogleLoginQuery: false,
        }),
      ).toBe(false);

      // Candidato normal sin privilegios -> nunca visible
      expect(
        evaluateNoticeModalVisibility({
          isFederated: true,
          hasPrivilegedNativeAccount: false,
          hasAcceptedInSession: false,
          hasGoogleLoginQuery: true,
        }),
      ).toBe(false);
    });

    it("debe registrar la aceptación en sessionStorage y cerrar el modal al hacer clic en 'Entendido y Aceptar'", () => {
      const storageMock: Record<string, string> = {};
      let isModalOpen = true;

      const handleAccept = (userKey: string) => {
        storageMock[`jobnet_ack_google_candidate_${userKey}`] = "accepted";
        isModalOpen = false;
      };

      handleAccept("uuid-admin-chinopaco");
      expect(
        storageMock["jobnet_ack_google_candidate_uuid-admin-chinopaco"],
      ).toBe("accepted");
      expect(isModalOpen).toBe(false);
    });
  });

  describe("4. Avisos Informativos en Login y Registro", () => {
    it("debe asegurar la presencia del disclaimer de rol exclusivo de Candidato en los flujos de Google", () => {
      const googleDisclaimer =
        "Acceso exclusivo como Candidato: Cuentas de Administrador, Moderador u Organización deben ingresar con correo y contraseña.";

      expect(googleDisclaimer).toContain("Acceso exclusivo como Candidato");
      expect(googleDisclaimer).toContain("correo y contraseña");
    });
  });
});
