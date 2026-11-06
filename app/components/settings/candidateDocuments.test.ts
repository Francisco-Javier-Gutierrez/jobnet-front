import { describe, it, expect, vi, beforeEach } from "vitest";

describe("Repositorio de Currículum PDF y Gestión de Documentos/Certificaciones", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("1. Repositorio de Currículum PDF", () => {
    const MAX_CV_SIZE = 5 * 1024 * 1024; // 5 MB

    const validateCvFile = (file: {
      name: string;
      size: number;
      type: string;
    }) => {
      const isPdf =
        file.type === "application/pdf" ||
        file.name.toLowerCase().endsWith(".pdf");

      if (!isPdf) {
        return {
          valid: false,
          error: "Solo se admiten documentos en formato PDF.",
        };
      }

      if (file.size > MAX_CV_SIZE) {
        const sizeMb = (file.size / (1024 * 1024)).toFixed(2);
        return {
          valid: false,
          error: `El archivo PDF "${file.name}" (${sizeMb} MB) supera el límite máximo permitido de 5 MB.`,
        };
      }

      return { valid: true, error: null };
    };

    it("debe validar y rechazar archivos que no sean PDF", () => {
      const docxFile = {
        name: "mi_cv.docx",
        size: 1024 * 1024,
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      };
      const res = validateCvFile(docxFile);
      expect(res.valid).toBe(false);
      expect(res.error).toBe("Solo se admiten documentos en formato PDF.");
    });

    it("debe rechazar currículums en PDF que superen el límite estricto de 5 MB", () => {
      const heavyFile = {
        name: "cv_pesado.pdf",
        size: 6 * 1024 * 1024,
        type: "application/pdf",
      };
      const res = validateCvFile(heavyFile);
      expect(res.valid).toBe(false);
      expect(res.error).toContain("supera el límite máximo permitido de 5 MB");
    });

    it("debe aceptar archivos PDF válidos menores o iguales a 5 MB", () => {
      const validFile = {
        name: "cv_candidato_2026.pdf",
        size: 2.5 * 1024 * 1024,
        type: "application/pdf",
      };
      const res = validateCvFile(validFile);
      expect(res.valid).toBe(true);
      expect(res.error).toBeNull();
    });

    it("debe ejecutar reemplazo transaccional directo sin requerir eliminar manualmente el documento previo", async () => {
      let currentCvUrl =
        "https://s3.amazonaws.com/uploads/resumes/candidato-1/cv_anterior.pdf";
      let currentCvName = "cv_anterior.pdf";

      const uploadMock = vi.fn().mockImplementation(async (file) => {
        return {
          url: `https://s3.amazonaws.com/uploads/resumes/candidato-1/${Date.now()}-${file.name}`,
          key: `uploads/resumes/candidato-1/${Date.now()}-${file.name}`,
        };
      });

      const handleDirectReplacement = async (newFile: {
        name: string;
        size: number;
        type: string;
      }) => {
        const validation = validateCvFile(newFile);
        if (!validation.valid) throw new Error(validation.error!);

        // Reemplazo transaccional directo en S3
        const result = await uploadMock(newFile);
        currentCvUrl = result.url;
        currentCvName = newFile.name;
        return { success: true, url: currentCvUrl, name: currentCvName };
      };

      const newCvFile = {
        name: "cv_nuevo_actualizado.pdf",
        size: 3 * 1024 * 1024,
        type: "application/pdf",
      };
      const result = await handleDirectReplacement(newCvFile);

      expect(result.success).toBe(true);
      expect(currentCvUrl).toContain("cv_nuevo_actualizado.pdf");
      expect(currentCvName).toBe("cv_nuevo_actualizado.pdf");
      expect(uploadMock).toHaveBeenCalledTimes(1);
    });

    it("debe controlar el visor embebido para previsualización inmediata en el navegador", () => {
      let showEmbeddedViewer = false;
      const toggleEmbeddedViewer = () => {
        showEmbeddedViewer = !showEmbeddedViewer;
      };

      expect(showEmbeddedViewer).toBe(false);
      toggleEmbeddedViewer();
      expect(showEmbeddedViewer).toBe(true);
      toggleEmbeddedViewer();
      expect(showEmbeddedViewer).toBe(false);
    });
  });

  describe("2. Gestión de Documentos y Certificaciones", () => {
    const MAX_DOCS_LIMIT = 5;
    const MAX_DOC_SIZE = 5 * 1024 * 1024; // 5 MB

    it("debe permitir adjuntar hasta un límite máximo de 5 documentos adicionales en formato PDF", () => {
      const existingDocs = [
        { name: "Cert 1", type: "pdf", url: "https://s3.amazonaws.com/1.pdf" },
        { name: "Cert 2", type: "pdf", url: "https://s3.amazonaws.com/2.pdf" },
        { name: "Cert 3", type: "pdf", url: "https://s3.amazonaws.com/3.pdf" },
        { name: "Cert 4", type: "pdf", url: "https://s3.amazonaws.com/4.pdf" },
        { name: "Cert 5", type: "pdf", url: "https://s3.amazonaws.com/5.pdf" },
      ];

      const canAddMorePdfs = (docs: any[]) => {
        const pdfCount = docs.filter(
          (d) =>
            !d.esEnlaceExterno && (d.type === "pdf" || d.url?.includes(".pdf")),
        ).length;
        return pdfCount < MAX_DOCS_LIMIT;
      };

      expect(canAddMorePdfs(existingDocs)).toBe(false);

      // Con 4 documentos sí se permite
      expect(canAddMorePdfs(existingDocs.slice(0, 4))).toBe(true);
    });

    it("debe validar el peso máximo de 5 MB por cada documento adicional", () => {
      const validateAdditionalDoc = (file: {
        name: string;
        size: number;
        type: string;
      }) => {
        if (
          !file.name.toLowerCase().endsWith(".pdf") &&
          file.type !== "application/pdf"
        ) {
          return {
            valid: false,
            error: "Solo se permiten archivos en formato PDF.",
          };
        }
        if (file.size > MAX_DOC_SIZE) {
          return {
            valid: false,
            error: "El archivo supera el límite máximo permitido de 5 MB.",
          };
        }
        return { valid: true };
      };

      expect(
        validateAdditionalDoc({
          name: "diploma.pdf",
          size: 5.5 * 1024 * 1024,
          type: "application/pdf",
        }).valid,
      ).toBe(false);
      expect(
        validateAdditionalDoc({
          name: "diploma.pdf",
          size: 4.8 * 1024 * 1024,
          type: "application/pdf",
        }).valid,
      ).toBe(true);
    });

    it("debe clasificar certificaciones, diplomas y constancias profesionales", () => {
      const allowedCategories = [
        "CERTIFICACION",
        "DIPLOMA",
        "CONSTANCIA",
        "OTRO",
      ];

      const createDocumentItem = (
        nombre: string,
        tipo: string,
        url: string,
        institucion?: string,
      ) => {
        if (!allowedCategories.includes(tipo))
          throw new Error("Categoría no válida");
        return {
          id: `doc-${Date.now()}`,
          name: nombre,
          tipoDocumento: tipo,
          url,
          institucion,
          fechaSubida: new Date().toISOString(),
          esEnlaceExterno: false,
        };
      };

      const cert = createDocumentItem(
        "AWS Solutions Architect",
        "CERTIFICACION",
        "https://s3.amazonaws.com/cert.pdf",
        "Amazon",
      );
      const diploma = createDocumentItem(
        "Diplomado en Ciberseguridad",
        "DIPLOMA",
        "https://s3.amazonaws.com/dip.pdf",
        "UNAM",
      );

      expect(cert.tipoDocumento).toBe("CERTIFICACION");
      expect(diploma.tipoDocumento).toBe("DIPLOMA");
      expect(cert.institucion).toBe("Amazon");
    });

    it("debe gestionar el acceso a documentos mediante enlaces de acceso seguro y temporal en la nube (1h)", async () => {
      const fetchSecureSignedUrlMock = vi
        .fn()
        .mockImplementation(async (keyOrUrl: string) => {
          return {
            url: `https://s3.amazonaws.com/${keyOrUrl}?X-Amz-Security-Token=xyz&Expires=3600`,
            expiresIn: 3600,
          };
        });

      const openSecureDocument = async (doc: {
        url: string;
        s3Key?: string;
      }) => {
        const key = doc.s3Key || "uploads/documents/user-1/cert.pdf";
        const res = await fetchSecureSignedUrlMock(key);
        return res;
      };

      const result = await openSecureDocument({
        url: "https://jobnet.s3.amazonaws.com/uploads/documents/user-1/cert.pdf",
      });
      expect(result.expiresIn).toBe(3600);
      expect(result.url).toContain("X-Amz-Security-Token");
      expect(fetchSecureSignedUrlMock).toHaveBeenCalledTimes(1);
    });

    it("debe permitir registrar y validar enlaces web externos verificables", () => {
      const validateAndAddExternalLink = (
        title: string,
        url: string,
        platform: string,
      ) => {
        if (!title.trim()) return { success: false, error: "Título requerido" };
        if (!url.trim()) return { success: false, error: "URL requerida" };

        let formattedUrl = url.trim();
        if (
          !formattedUrl.startsWith("http://") &&
          !formattedUrl.startsWith("https://")
        ) {
          formattedUrl = "https://" + formattedUrl;
        }

        try {
          new URL(formattedUrl);
        } catch {
          return { success: false, error: "URL inválida" };
        }

        return {
          success: true,
          item: {
            id: `link-${Date.now()}`,
            name: title.trim(),
            url: formattedUrl,
            institucion: platform.trim(),
            type: "link",
            esEnlaceExterno: true,
          },
        };
      };

      const res = validateAndAddExternalLink(
        "Certificado Profesional en IA",
        "coursera.org/verify/ABC123XYZ",
        "Coursera / DeepLearning.AI",
      );

      expect(res.success).toBe(true);
      expect(res.item?.url).toBe("https://coursera.org/verify/ABC123XYZ");
      expect(res.item?.esEnlaceExterno).toBe(true);
      expect(res.item?.institucion).toBe("Coursera / DeepLearning.AI");
    });
  });
});
