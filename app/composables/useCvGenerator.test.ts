import { describe, it, expect, vi, beforeEach } from "vitest";
import { ref } from "vue";
import { useCvGenerator, CV_COLOR_THEMES } from "./useCvGenerator";

// Setup global mocks for Nuxt auto-imports
const mockShowSuccess = vi.fn();
const mockShowError = vi.fn();
const mockUploadFile = vi.fn();
const mockFetch = vi.fn();

vi.mock("~/stores/upload", () => ({
  useUploadStore: () => ({
    uploadFile: mockUploadFile,
  }),
}));

vi.mock("~/composables/useAppFeedback", () => ({
  useAppFeedback: () => ({
    showSuccess: mockShowSuccess,
    showError: mockShowError,
  }),
}));

// Mock html2pdf.js
const mockSetProperties = vi.fn();
const mockPdfInstance = {
  setProperties: mockSetProperties,
};

const mockWorker: any = {
  set: vi.fn().mockReturnThis(),
  from: vi.fn().mockReturnThis(),
  toPdf: vi.fn().mockReturnThis(),
  get: vi.fn().mockReturnThis(),
  then: vi.fn().mockImplementation((cb: any) => {
    cb(mockPdfInstance);
    return mockWorker;
  }),
  output: vi
    .fn()
    .mockResolvedValue(new Blob(["mock-pdf"], { type: "application/pdf" })),
};

vi.mock("html2pdf.js", () => ({
  default: () => mockWorker,
}));

// Nuxt globals
(globalThis as any).ref = ref;
(globalThis as any).useRuntimeConfig = () => ({
  public: { apiUrl: "https://api.jobnet.test" },
});
(globalThis as any).$fetch = mockFetch;

describe("useCvGenerator & RF-123 Anonymous Mode", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockWorker.set.mockReturnThis();
    mockWorker.from.mockReturnThis();
    mockWorker.toPdf.mockReturnThis();
  });

  describe("CV_COLOR_THEMES", () => {
    it("should export valid preconfigured color themes", () => {
      expect(CV_COLOR_THEMES.length).toBeGreaterThanOrEqual(6);
      const harvardOrIndigo = CV_COLOR_THEMES.find(
        (t) => t.id === "indigo-jobnet",
      );
      expect(harvardOrIndigo).toBeDefined();
      expect(harvardOrIndigo?.primary).toBe("#4f46e5");
    });
  });

  describe("normalizeProfileToCvData", () => {
    const { normalizeProfileToCvData } = useCvGenerator();

    it("should correctly normalize a complete profile in standard mode", () => {
      const mockProfile: any = {
        nombre: "Ana Gómez",
        tituloProfesional: "Senior Frontend Engineer",
        email: "ana@ejemplo.com",
        telefono: "+52 55 1234 5678",
        ubicacion: "Guadalajara, Jalisco, México",
        biografia: "Desarrolladora apasionada por Vue y Nuxt.",
        fotoPerfil: "https://jobnet.test/photo.jpg",
        habilidades: ["Vue.js", "TypeScript", "Tailwind CSS"],
        idiomas: ["Español", "Inglés"],
        educacion: [
          {
            institucion: "ITESM",
            titulo: "Ingeniería en Software",
            periodo: "2018-2022",
          },
        ],
        experiencia: [
          {
            empresa: "Tech Corp",
            puesto: "Lead Dev",
            periodo: "2022-Presente",
          },
        ],
        links: [{ label: "GitHub", url: "https://github.com/anagomez" }],
      };

      const result = normalizeProfileToCvData(mockProfile);

      expect(result.name).toBe("Ana Gómez");
      expect(result.title).toBe("Senior Frontend Engineer");
      expect(result.email).toBe("ana@ejemplo.com");
      expect(result.phone).toBe("+52 55 1234 5678");
      expect(result.location).toBe("Guadalajara, Jalisco, México");
      expect(result.bio).toBe("Desarrolladora apasionada por Vue y Nuxt.");
      expect(result.photoUrl).toBe("https://jobnet.test/photo.jpg");
      expect(result.skills).toEqual(["Vue.js", "TypeScript", "Tailwind CSS"]);
      expect(result.links).toHaveLength(1);
      expect(result.links[0].label).toBe("GitHub");
    });

    it("should handle location as an object and enlacesWeb as an object in standard mode", () => {
      const mockProfile: any = {
        name: "Carlos Ruiz",
        titular: "Backend Architect",
        correo: "carlos@test.com",
        telefonoContacto: "555-9876",
        ubicacion: { city: "Monterrey", pais: "México" },
        descripcion: "Arquitecto de microservicios.",
        avatarUrl: "https://jobnet.test/carlos.jpg",
        skills: ["Node.js", "DynamoDB"],
        enlacesWeb: {
          Portfolio: "https://carlos.dev",
        },
      };

      const result = normalizeProfileToCvData(mockProfile);

      expect(result.name).toBe("Carlos Ruiz");
      expect(result.title).toBe("Backend Architect");
      expect(result.location).toBe("Monterrey, México");
      expect(result.links).toEqual([
        { label: "Portfolio", url: "https://carlos.dev" },
      ]);
    });

    it("should fallback to fallbackUser or defaults when fields are missing", () => {
      const emptyProfile: any = {};
      const fallbackUser = {
        name: "User Fallback",
        email: "fallback@jobnet.test",
        image: "https://jobnet.test/avatar.png",
      };

      const result = normalizeProfileToCvData(emptyProfile, fallbackUser);

      expect(result.name).toBe("User Fallback");
      expect(result.email).toBe("fallback@jobnet.test");
      expect(result.photoUrl).toBe("https://jobnet.test/avatar.png");
      expect(result.title).toBe("Profesional");
      expect(result.location).toBe("México");
    });

    describe("RF-123 Modo Anónimo", () => {
      it("should deliberately omit photo, real name, email, phone, and links", () => {
        const fullProfile: any = {
          id: "usr-987654321",
          nombre: "Laura Méndez",
          tituloProfesional: "Especialista en Ciberseguridad",
          email: "laura.mendez@empresa.com",
          telefono: "55 9999 8888",
          ubicacion: "Colonia Roma, Ciudad de México, México",
          biografia: "Experta en ethical hacking.",
          fotoPerfil: "https://jobnet.test/laura.jpg",
          habilidades: ["CISSP", "Penetration Testing"],
          links: [
            { label: "LinkedIn", url: "https://linkedin.com/in/laura-mendez" },
          ],
        };

        const result = normalizeProfileToCvData(fullProfile, undefined, {
          anonymousMode: true,
          anonymousId: "usr-987654321",
        });

        // RF-123 Verifications
        expect(result.name).toBe("Candidato #654321"); // Masked with short ID
        expect(result.photoUrl).toBe(""); // Photo omitted
        expect(result.email).toBe(""); // Email omitted to prevent identification
        expect(result.phone).toBe(""); // Phone omitted
        expect(result.links).toEqual([]); // External links omitted
        expect(result.location).toBe("México"); // Sanitized to general country/region

        // Skills, bio, and title must remain intact for unbiased evaluation
        expect(result.title).toBe("Especialista en Ciberseguridad");
        expect(result.bio).toBe("Experta en ethical hacking.");
        expect(result.skills).toEqual(["CISSP", "Penetration Testing"]);
      });

      it("should sanitize object location to country in anonymous mode", () => {
        const profile: any = {
          id: "usr-12",
          ubicacion: { city: "Zapopan", pais: "México" },
        };

        const result = normalizeProfileToCvData(profile, undefined, {
          anonymousMode: true,
        });

        expect(result.name).toBe("Candidato #USR-12");
        expect(result.location).toBe("México");
      });

      it("should fallback to ANON when no ID is provided in anonymous mode", () => {
        const profile: any = {};

        const result = normalizeProfileToCvData(profile, undefined, {
          anonymousMode: true,
        });

        expect(result.name).toBe("Candidato #ANON");
      });
    });
  });

  describe("generatePdfBlob & metadata sanitization", () => {
    const { generatePdfBlob } = useCvGenerator();

    it("should generate a blob and set sanitized PDF properties when metadata is provided", async () => {
      const dummyElement = document.createElement("div");
      const blob = await generatePdfBlob(dummyElement, "CV_Anonimo.pdf", {
        title: "Curriculum Vitae Anónimo",
        author: "JobNet Anonymous System",
        subject: "Postulación Imparcial",
      });

      expect(blob).toBeInstanceOf(Blob);
      expect(mockSetProperties).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "Curriculum Vitae Anónimo",
          author: "JobNet Anonymous System",
          subject: "Postulación Imparcial",
          creator: "JobNet Dynamic CV Builder",
        }),
      );
    });
    it("should throw error when called on server without window", async () => {
      const originalWindow = (globalThis as any).window;
      // @ts-ignore
      delete (globalThis as any).window;
      const dummy = document.createElement("div");
      await expect(generatePdfBlob(dummy)).rejects.toThrow(
        "PDF generation is only supported in browser client.",
      );
      (globalThis as any).window = originalWindow;
    });

    it("should generate blob with defaults and without pdfMeta", async () => {
      const dummy = document.createElement("div");
      const blob = await generatePdfBlob(dummy);
      expect(blob).toBeInstanceOf(Blob);
    });

    it("should handle pdf instance without setProperties gracefully", async () => {
      mockWorker.then.mockImplementationOnce((cb: any) => {
        cb({}); // no setProperties
        return mockWorker;
      });
      const dummy = document.createElement("div");
      const blob = await generatePdfBlob(dummy, "test.pdf", { title: "Test" });
      expect(blob).toBeInstanceOf(Blob);
    });

    it("should fallback to default metadata strings when empty strings are passed in pdfMeta", async () => {
      const dummy = document.createElement("div");
      await generatePdfBlob(dummy, "test.pdf", {
        title: "",
        author: "",
        subject: "",
      });
      expect(mockSetProperties).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "Curriculum Vitae",
          author: "JobNet Platform",
          subject: "CV Profesional",
          creator: "JobNet Dynamic CV Builder",
        }),
      );
    });

    it("should handle null pdf instance gracefully", async () => {
      mockWorker.then.mockImplementationOnce((cb: any) => {
        cb(null);
        return mockWorker;
      });
      const dummy = document.createElement("div");
      const blob = await generatePdfBlob(dummy, "test.pdf", { title: "Test" });
      expect(blob).toBeInstanceOf(Blob);
    });
  });

  describe("downloadPdf", () => {
    const { downloadPdf } = useCvGenerator();

    it("should work with default arguments", async () => {
      const dummyElement = document.createElement("div");
      await downloadPdf(dummyElement);
      expect(mockShowSuccess).toHaveBeenCalledWith(
        "CV Descargado",
        expect.any(String),
        expect.any(Number),
      );
    });

    it("should download standard PDF with candidate name in filename", async () => {
      const dummyElement = document.createElement("div");
      await downloadPdf(dummyElement, "María López", false);

      expect(mockShowSuccess).toHaveBeenCalledWith(
        "CV Descargado",
        expect.stringContaining("tamaño Carta"),
        expect.any(Number),
      );
    });

    it("should download anonymous PDF with sanitized filename and impartial feedback (RF-123)", async () => {
      const dummyElement = document.createElement("div");
      await downloadPdf(dummyElement, "María López", true);

      expect(mockShowSuccess).toHaveBeenCalledWith(
        "CV Anónimo Descargado",
        expect.stringContaining("Modo Anónimo"),
        expect.any(Number),
      );
    });
  });

  describe("uploadCvToProfile", () => {
    const { uploadCvToProfile } = useCvGenerator();

    it("should successfully upload anonymous CV with default name", async () => {
      mockUploadFile.mockResolvedValue({
        success: true,
        url: "https://s3.aws.com/resumes/CV_Anonimo.pdf",
      });
      mockFetch.mockResolvedValue({ ok: true });

      const dummyElement = document.createElement("div");
      const res = await uploadCvToProfile(
        dummyElement,
        "user-123",
        undefined,
        true,
      );

      expect(res.success).toBe(true);
      expect(mockShowSuccess).toHaveBeenCalledWith(
        "CV Anónimo Guardado",
        expect.stringContaining("Modo Anónimo"),
        expect.any(Number),
      );
    });

    it("should successfully upload anonymous CV and update profile (RF-123)", async () => {
      mockUploadFile.mockResolvedValue({
        success: true,
        url: "https://s3.aws.com/resumes/CV_Anonimo.pdf",
      });
      mockFetch.mockResolvedValue({ ok: true });

      const dummyElement = document.createElement("div");
      const res = await uploadCvToProfile(
        dummyElement,
        "user-123",
        "María López",
        true,
      );

      expect(res.success).toBe(true);
      expect(res.url).toBe("https://s3.aws.com/resumes/CV_Anonimo.pdf");
      expect(mockShowSuccess).toHaveBeenCalledWith(
        "CV Anónimo Guardado",
        expect.stringContaining("Modo Anónimo"),
        expect.any(Number),
      );
    });

    it("should successfully upload standard CV and update profile", async () => {
      mockUploadFile.mockResolvedValue({
        success: true,
        url: "https://s3.aws.com/resumes/CV_Standard.pdf",
      });
      mockFetch.mockResolvedValue({ ok: true });

      const dummyElement = document.createElement("div");
      const res = await uploadCvToProfile(
        dummyElement,
        "user-123",
        "María López",
        false,
      );

      expect(res.success).toBe(true);
      expect(mockShowSuccess).toHaveBeenCalledWith(
        "CV Guardado",
        expect.stringContaining("currículum principal"),
        expect.any(Number),
      );
    });

    it("should handle S3 upload failure with default error message", async () => {
      mockUploadFile.mockResolvedValue({
        success: false,
      });

      const dummyElement = document.createElement("div");
      const res = await uploadCvToProfile(
        dummyElement,
        "user-123",
        "María López",
        false,
      );

      expect(res.success).toBe(false);
      expect(res.error).toBe("No se pudo subir el archivo PDF.");
      expect(mockShowError).toHaveBeenCalledWith(
        "Error al Guardar CV",
        "No se pudo subir el archivo PDF.",
      );
    });

    it("should handle unexpected exception without message", async () => {
      mockUploadFile.mockResolvedValue({
        success: true,
        url: "https://s3.aws.com/resumes/CV.pdf",
      });
      mockFetch.mockRejectedValue({});

      const dummyElement = document.createElement("div");
      const res = await uploadCvToProfile(
        dummyElement,
        "user-123",
        "María López",
        false,
      );

      expect(res.success).toBe(false);
      expect(res.error).toBe("Error al actualizar CV en el perfil.");
      expect(mockShowError).toHaveBeenCalledWith(
        "Error",
        "Error al actualizar CV en el perfil.",
      );
    });
  });

  describe("additional edge case branches", () => {
    const { normalizeProfileToCvData } = useCvGenerator();

    it("should cover links labels, titular, sector, biografia fallbacks", () => {
      const p1: any = {
        links: [
          null,
          { url: "" },
          { nombre: "Mi Web", url: "https://web.com" },
          { name: "Portfolio", url: "https://port.com" },
          { url: "https://onlyurl.com" },
        ],
        sector: "Tecnología",
        bio: "Bio texto",
        avatar: "https://img.com/avatar.jpg",
      };
      const res1 = normalizeProfileToCvData(p1);
      expect(res1.links).toHaveLength(3);
      expect(res1.title).toBe("Tecnología");
      expect(res1.bio).toBe("Bio texto");
      expect(res1.photoUrl).toBe("https://img.com/avatar.jpg");

      const p2: any = {
        puestoDeseado: "Frontend",
        resumenProfesional: "Resumen texto",
        enlacesWeb: {
          Valid: "https://valid.com",
          Invalid: 12345,
        },
      };
      const res2 = normalizeProfileToCvData(p2);
      expect(res2.title).toBe("Frontend");
      expect(res2.bio).toBe("Resumen texto");
      expect(res2.links).toEqual([
        { label: "Valid", url: "https://valid.com" },
      ]);

      // Anonymous location without pais in object
      const p3: any = {
        ubicacion: { city: "Colima" },
      };
      const res3 = normalizeProfileToCvData(p3, undefined, {
        anonymousMode: true,
      });
      expect(res3.location).toBe("México");

      // Anonymous location as string without comma
      const p4: any = {
        ubicacion: "Argentina",
      };
      const res4 = normalizeProfileToCvData(p4, undefined, {
        anonymousMode: true,
      });
      expect(res4.location).toBe("Argentina");

      // Anonymous location as string with empty comma split
      const p5: any = {
        ubicacion: " , ",
      };
      const res5 = normalizeProfileToCvData(p5, undefined, {
        anonymousMode: true,
      });
      expect(res5.location).toBe("México");

      // Anonymous location with falsy string
      const p6: any = {
        ubicacion: "",
      };
      const res6 = normalizeProfileToCvData(p6, undefined, {
        anonymousMode: true,
      });
      expect(res6.location).toBe("México");
    });
  });

  describe("Generación Dinámica de CV Multiformato: Plantillas y Paletas", () => {
    it("should provide exactly the 6 standardized color palettes", () => {
      expect(CV_COLOR_THEMES).toHaveLength(6);
      const paletteNames = CV_COLOR_THEMES.map((p) => p.name);
      expect(paletteNames).toEqual([
        "JobNet Indigo",
        "Slate Modern",
        "Azul Ejecutivo",
        "Verde Esmeralda",
        "Burdeos Elegante",
        "Ámbar Cálido",
      ]);
    });

    it("should mask candidate identity under alphanumeric identifier in anonymous mode", () => {
      const { normalizeProfileToCvData } = useCvGenerator();
      const profile: any = {
        id: "usr-a1b2c3d4",
        nombre: "Alejandro Morales",
        email: "alejandro@test.com",
        telefono: "+52 55 1111 2222",
        biografia: "Desarrollador Full Stack con 5 años de experiencia.",
        fotoPerfil: "https://jobnet.test/alex.png",
        skills: ["Node.js", "Vue.js", "PostgreSQL"],
      };

      const anonData = normalizeProfileToCvData(profile, undefined, {
        anonymousMode: true,
        anonymousId: "usr-a1b2c3d4",
      });

      // Debe enmascarar bajo identificador alfanumérico
      expect(anonData.name).toBe("Candidato #B2C3D4");
      // Debe omitir datos personales que puedan generar sesgos
      expect(anonData.photoUrl).toBe("");
      expect(anonData.email).toBe("");
      expect(anonData.phone).toBe("");
      // Debe conservar biografía técnica y habilidades
      expect(anonData.bio).toBe(
        "Desarrollador Full Stack con 5 años de experiencia.",
      );
      expect(anonData.skills).toEqual(["Node.js", "Vue.js", "PostgreSQL"]);
    });
  });
});
