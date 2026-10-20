import type { CandidateProfile } from "~/types/candidate";
import type { CvData, CvOptions, CvTemplateId, CvColorTheme } from "~/types/cv";
import { useUploadStore } from "~/stores/upload";
import { useAppFeedback } from "~/composables/useAppFeedback";

export const CV_COLOR_THEMES: CvColorTheme[] = [
  {
    id: "indigo-jobnet",
    name: "JobNet Indigo",
    primary: "#4f46e5",
    secondary: "#1e1b4b",
    accent: "#818cf8",
    bgLight: "#f5f3ff",
    border: "#e0e7ff",
  },
  {
    id: "slate-tech",
    name: "Slate Modern",
    primary: "#0f172a",
    secondary: "#334155",
    accent: "#64748b",
    bgLight: "#f8fafc",
    border: "#e2e8f0",
  },
  {
    id: "navy-executive",
    name: "Azul Ejecutivo",
    primary: "#1e3a8a",
    secondary: "#172554",
    accent: "#3b82f6",
    bgLight: "#eff6ff",
    border: "#dbeafe",
  },
  {
    id: "emerald-pro",
    name: "Verde Esmeralda",
    primary: "#059669",
    secondary: "#064e3b",
    accent: "#10b981",
    bgLight: "#ecfdf5",
    border: "#d1fae5",
  },
  {
    id: "burgundy-elegant",
    name: "Burdeos Elegante",
    primary: "#881337",
    secondary: "#4c0519",
    accent: "#e11d48",
    bgLight: "#fff1f2",
    border: "#ffe4e6",
  },
  {
    id: "amber-warm",
    name: "Ámbar Cálido",
    primary: "#b45309",
    secondary: "#78350f",
    accent: "#f59e0b",
    bgLight: "#fffbeb",
    border: "#fef3c7",
  },
];

export function useCvGenerator() {
  const uploadStore = useUploadStore();
  const { showSuccess, showError, showInfo } = useAppFeedback();
  const config = useRuntimeConfig();

  const isGenerating = ref(false);
  const isSavingToProfile = ref(false);
  const statusMessage = ref("");

  /**
   * Normalizes CandidateProfile data into structured CvData for templates.
   * If anonymousMode is true (RF-123), personal identifiers (photo, full name,
   * external links, phone, email, and specific address) are deliberately omitted.
   */
  function normalizeProfileToCvData(
    profile: CandidateProfile,
    fallbackUser?: {
      name?: string;
      email?: string;
      image?: string;
      id?: string;
    },
    anonymousOptions?: { anonymousMode?: boolean; anonymousId?: string },
  ): CvData {
    const isAnonymous = Boolean(anonymousOptions?.anonymousMode);

    // Location formatter
    let locationStr = "";
    if (typeof profile.ubicacion === "string") {
      locationStr = profile.ubicacion;
    } else if (profile.ubicacion) {
      locationStr = [profile.ubicacion.city, profile.ubicacion.pais]
        .filter(Boolean)
        .join(", ");
    }

    // In anonymous mode, keep only Country / general region, avoid specific addresses
    if (isAnonymous) {
      if (typeof profile.ubicacion === "object" && profile.ubicacion?.pais) {
        locationStr = profile.ubicacion.pais;
      } else if (typeof profile.ubicacion === "string" && profile.ubicacion) {
        const parts = profile.ubicacion.split(",").map((s) => s.trim());
        locationStr = parts[parts.length - 1] || "México";
      } else {
        locationStr = "México";
      }
    }

    // Links formatter (omitted in anonymous mode)
    const linksList: Array<{ label: string; url: string }> = [];
    if (!isAnonymous) {
      if (Array.isArray(profile.links)) {
        profile.links.forEach((l) => {
          if (l && l.url) {
            linksList.push({
              label: l.label || l.nombre || l.name || "Enlace",
              url: l.url,
            });
          }
        });
      } else if (profile.enlacesWeb && typeof profile.enlacesWeb === "object") {
        Object.entries(profile.enlacesWeb).forEach(([key, url]) => {
          if (url && typeof url === "string") {
            linksList.push({ label: key, url });
          }
        });
      }
    }

    // Name formatting
    let displayName =
      profile.nombre ||
      profile.nombreCompleto ||
      profile.name ||
      fallbackUser?.name ||
      "Tu Nombre Completo";

    if (isAnonymous) {
      const rawId =
        anonymousOptions?.anonymousId ||
        profile.id ||
        fallbackUser?.id ||
        "ANON";
      const shortId =
        rawId.length > 6 ? rawId.slice(-6).toUpperCase() : rawId.toUpperCase();
      displayName = `Candidato #${shortId}`;
    }

    return {
      name: displayName,
      title:
        profile.tituloProfesional ||
        profile.titular ||
        profile.sector ||
        profile.puestoDeseado ||
        "Profesional",
      email: isAnonymous
        ? ""
        : profile.email ||
          profile.correo ||
          fallbackUser?.email ||
          "tu.correo@ejemplo.com",
      phone: isAnonymous
        ? ""
        : profile.telefono || profile.telefonoContacto || "",
      location: locationStr || "México",
      bio:
        profile.biografia ||
        profile.bio ||
        profile.descripcion ||
        profile.resumenProfesional ||
        "",
      photoUrl: isAnonymous
        ? ""
        : profile.fotoPerfil ||
          profile.avatarUrl ||
          profile.avatar ||
          fallbackUser?.image ||
          "",
      skills: Array.isArray(profile.habilidades)
        ? profile.habilidades
        : Array.isArray(profile.skills)
          ? profile.skills
          : [],
      languages: Array.isArray(profile.idiomas) ? profile.idiomas : [],
      education: Array.isArray(profile.educacion)
        ? profile.educacion.map((edu: any) => ({
            titulo:
              edu.titulo ||
              edu.degree ||
              edu.carrera ||
              edu.nombre ||
              "Título / Grado",
            institucion:
              edu.institucion ||
              edu.institution ||
              edu.universidad ||
              edu.escuela ||
              "Institución",
            periodo:
              edu.periodo ||
              edu.dates ||
              (edu.anoInicio
                ? `${edu.anoInicio} - ${edu.actualmente ? "Presente" : edu.anoFin || "Graduado"}`
                : ""),
            descripcion: edu.descripcion || edu.description || edu.campoEstudio || "",
          }))
        : [],
      experience: Array.isArray(profile.experiencia)
        ? profile.experiencia.map((exp: any) => ({
            puesto:
              exp.puesto ||
              exp.cargo ||
              exp.role ||
              exp.title ||
              exp.posicion ||
              "Puesto / Cargo",
            empresa: exp.empresa || exp.company || "Empresa",
            periodo:
              exp.periodo ||
              exp.dates ||
              (exp.anoInicio
                ? `${exp.anoInicio} - ${exp.actualmente ? "Presente" : exp.anoFin || "Presente"}`
                : ""),
            descripcion:
              exp.descripcion ||
              exp.description ||
              (Array.isArray(exp.logros) && exp.logros.length > 0
                ? exp.logros.map((l: string) => `• ${l}`).join("\n")
                : ""),
          }))
        : [],
      links: linksList,
    };
  }

  /**
   * Generates a PDF Blob from an HTML element using standard Carta (Letter) dimensions
   */
  async function generatePdfBlob(
    element: HTMLElement,
    filename: string = "Curriculum_Vitae.pdf",
    pdfMeta?: { title?: string; author?: string; subject?: string },
  ): Promise<Blob> {
    if (typeof window === "undefined" || (import.meta as any).server) {
      throw new Error("PDF generation is only supported in browser client.");
    }

    isGenerating.value = true;
    statusMessage.value = "Generando PDF en formato Carta...";

    try {
      // Dynamic import to avoid SSR errors
      const html2pdfModule = await import("html2pdf.js");
      const html2pdf = html2pdfModule.default || html2pdfModule;

      const opt = {
        margin: [0, 0, 0, 0],
        filename,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          letterRendering: true,
          logging: false,
          scrollY: 0,
          scrollX: 0,
        },
        jsPDF: {
          unit: "mm",
          format: "letter", // 215.9mm x 279.4mm (8.5in x 11in)
          orientation: "portrait",
        },
        pagebreak: { mode: ["avoid-all", "css", "legacy"] },
      };

      let worker = html2pdf().set(opt).from(element).toPdf();

      if (pdfMeta) {
        worker = worker.get("pdf").then((pdf: any) => {
          if (pdf && typeof pdf.setProperties === "function") {
            pdf.setProperties({
              title: pdfMeta.title || "Curriculum Vitae",
              author: pdfMeta.author || "JobNet Platform",
              subject: pdfMeta.subject || "CV Profesional",
              creator: "JobNet Dynamic CV Builder",
            });
          }
        });
      }

      const pdfBlob: Blob = await worker.output("blob");

      return pdfBlob;
    } finally {
      isGenerating.value = false;
      statusMessage.value = "";
    }
  }

  /**
   * Direct download of PDF in client
   */
  async function downloadPdf(
    element: HTMLElement,
    candidateName: string = "Candidato",
    isAnonymous: boolean = false,
  ): Promise<void> {
    const cleanName = isAnonymous
      ? "Anonimo"
      : candidateName.replace(/\s+/g, "_");
    const filename = `CV_${cleanName}_Carta.pdf`;
    const blob = await generatePdfBlob(element, filename, {
      title: isAnonymous ? "CV Anónimo - JobNet" : `CV ${candidateName}`,
      author: isAnonymous ? "JobNet Impartial Recruitment" : candidateName,
      subject: isAnonymous ? "Postulación Imparcial" : "Perfil Profesional",
    });

    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
      if (link.parentNode) {
        link.parentNode.removeChild(link);
      } else {
        link.remove();
      }
      URL.revokeObjectURL(blobUrl);
    }, 150);

    showSuccess(
      isAnonymous ? "CV Anónimo Descargado" : "CV Descargado",
      isAnonymous
        ? "Tu CV en Modo Anónimo se ha descargado exitosamente para postulaciones imparciales."
        : "Tu CV en tamaño Carta se ha descargado exitosamente.",
      3500,
    );
  }

  /**
   * Uploads generated PDF directly to S3 and updates user's candidate profile
   */
  async function uploadCvToProfile(
    element: HTMLElement,
    userId: string,
    candidateName: string = "Candidato",
    isAnonymous: boolean = false,
  ): Promise<{ success: boolean; url?: string; error?: string }> {
    isSavingToProfile.value = true;
    statusMessage.value = "Generando documento...";

    try {
      const cleanName = isAnonymous
        ? "Anonimo"
        : candidateName.replace(/\s+/g, "_");
      const filename = `CV_${cleanName}.pdf`;
      const blob = await generatePdfBlob(element, filename, {
        title: isAnonymous ? "CV Anónimo - JobNet" : `CV ${candidateName}`,
        author: isAnonymous ? "JobNet Impartial Recruitment" : candidateName,
        subject: isAnonymous ? "Postulación Imparcial" : "Perfil Profesional",
      });

      const file = new File([blob], filename, { type: "application/pdf" });

      statusMessage.value = isAnonymous
        ? "Subiendo CV anónimo a tu perfil seguro..."
        : "Subiendo CV a tu perfil seguro...";
      const uploadRes = await uploadStore.uploadFile(file, "resumes", userId);

      if (uploadRes.success && uploadRes.url) {
        statusMessage.value = "Actualizando perfil...";
        await $fetch(`${config.public.apiUrl}/profile/${userId}`, {
          method: "POST",
          body: {
            cvUrl: uploadRes.url,
            cvName: filename,
            curriculumVitae: uploadRes.url,
          },
        });

        showSuccess(
          isAnonymous ? "CV Anónimo Guardado" : "CV Guardado",
          isAnonymous
            ? "Tu CV en Modo Anónimo se ha guardado en tu perfil para postulaciones imparciales."
            : "Tu nuevo CV generado se ha establecido como tu currículum principal.",
          3500,
        );
        return { success: true, url: uploadRes.url };
      } else {
        const err = uploadRes.error || "No se pudo subir el archivo PDF.";
        showError("Error al Guardar CV", err);
        return { success: false, error: err };
      }
    } catch (e: any) {
      const err = e.message || "Error al actualizar CV en el perfil.";
      showError("Error", err);
      return { success: false, error: err };
    } finally {
      isSavingToProfile.value = false;
      statusMessage.value = "";
    }
  }

  return {
    isGenerating,
    isSavingToProfile,
    statusMessage,
    normalizeProfileToCvData,
    generatePdfBlob,
    downloadPdf,
    uploadCvToProfile,
  };
}
