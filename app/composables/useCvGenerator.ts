import type { CandidateProfile } from "~/types/candidate";
import type { CvData, CvOptions, CvTemplateId, CvColorTheme } from "~/types/cv";
import { useUploadStore } from "~/stores/upload";
import { useAppFeedback } from "~/composables/useAppFeedback";
import { apiFetch } from "~/composables/useApiClient";

export const QUICK_STAR_VERBS = [
  "Lideré",
  "Coordiné",
  "Diseñé",
  "Desarrollé",
  "Optimicé",
  "Implementé",
  "Gestioné",
  "Automaticé",
] as const;

/**
 * Returns the responsive base root font-size (px) for CV Letter pages so
 * proportional `em` child classes scale smoothly across Compacto/Estándar/Amplio.
 */
export function getCvBaseFontSize(
  fontSize?: CvOptions["fontSize"],
  compact = false,
): string {
  if (compact) {
    if (fontSize === "sm") return "9.5px";
    if (fontSize === "lg") return "12.5px";
    return "11px";
  }
  if (fontSize === "sm") return "10.5px";
  if (fontSize === "lg") return "13.5px";
  return "12px";
}

function normalizeVerbToken(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

/**
 * Accent- and case-insensitive check whether a STAR action verb already exists
 * in an experience description.
 */
export function hasActionVerb(
  description: string | undefined,
  verb: string,
): boolean {
  const normalizedVerb = normalizeVerbToken(verb).trim();
  if (!description || !normalizedVerb) return false;
  const normalizedDesc = normalizeVerbToken(description);
  const escaped = normalizedVerb.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`(^|[^a-z0-9])${escaped}(?=$|[^a-z0-9])`).test(
    normalizedDesc,
  );
}

/**
 * Appends a STAR action verb bullet only if it is not already present.
 */
export function appendActionVerb(
  description: string | undefined,
  verb: string,
): { text: string; inserted: boolean } {
  const trimmedVerb = verb.trim();
  if (!trimmedVerb || hasActionVerb(description, trimmedVerb)) {
    return { text: description || "", inserted: false };
  }
  const clean = (description || "").trimEnd();
  return {
    text: clean ? `${clean}\n• ${trimmedVerb} ` : `• ${trimmedVerb} `,
    inserted: true,
  };
}

/**
 * Waits for web fonts and embedded images inside the target element to finish
 * loading before rasterizing to PDF so line wrapping matches the HTML preview.
 */
export async function waitForElementAssets(root: HTMLElement): Promise<void> {
  const tasks: Promise<unknown>[] = [];

  if (typeof document !== "undefined" && document.fonts?.ready) {
    tasks.push(document.fonts.ready);
  }

  const images = Array.from(root.querySelectorAll?.("img") ?? []);
  for (const img of images) {
    if (!img.complete) {
      tasks.push(
        new Promise<void>((resolve) => {
          const done = () => resolve();
          img.addEventListener("load", done, { once: true });
          img.addEventListener("error", done, { once: true });
        }),
      );
    }
  }

  if (tasks.length > 0) {
    await Promise.all(tasks);
  }
}

export const PRINT_ROOT_ID = "cv-native-print-root";
const LETTER_WIDTH_MM = 215.9;
const LETTER_HEIGHT_MM = 279.4;
const TRANSPARENT_PIXEL_PLACEHOLDER =
  "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

/**
 * Resolves the actual `.cv-letter-page` root inside a wrapper element.
 */
export function resolveCvPrintTarget(element: HTMLElement): HTMLElement {
  return element.matches && element.matches(".cv-letter-page")
    ? element
    : (element.querySelector &&
        (element.querySelector(".cv-letter-page") as HTMLElement)) ||
        element;
}

/**
 * Removes any mounted native print container and restores page state.
 */
export function cleanupNativePrintRoot(previousTitle?: string): void {
  if (typeof document === "undefined") return;
  document.body?.classList?.remove("cv-printing");
  const existing = document.getElementById(PRINT_ROOT_ID);
  if (existing?.parentNode) {
    existing.parentNode.removeChild(existing);
  }
  if (typeof previousTitle === "string") {
    document.title = previousTitle;
  }
}

/**
 * Normalizes cloned DOM attributes before capture or print so zoom transforms
 * and modal shadows never alter layout inside the Carta output.
 */
export function sanitizePdfCloneNode(cloned: Node): void {
  if (cloned instanceof HTMLElement) {
    cloned.style.margin = "0";
    cloned.style.boxShadow = "none";
    cloned.style.transform = "none";
  }
}

/**
 * Slices a rasterized high-DPI canvas cleanly onto US Letter jsPDF pages.
 */
export function buildLetterPdfFromCanvas(
  jsPDFCtor: new (options?: any) => any,
  canvas: HTMLCanvasElement,
  pdfMeta?: { title?: string; author?: string; subject?: string },
): Blob {
  const pdf = new jsPDFCtor({
    unit: "mm",
    format: "letter", // 215.9mm x 279.4mm (8.5in x 11in)
    orientation: "portrait",
    compress: true,
  });

  if (pdfMeta && pdf && typeof pdf.setProperties === "function") {
    pdf.setProperties({
      title: pdfMeta.title || "Curriculum Vitae",
      author: pdfMeta.author || "JobNet Platform",
      subject: pdfMeta.subject || "CV Profesional",
      creator: "JobNet Dynamic CV Builder",
    });
  }

  const pageWidth = pdf.internal?.pageSize?.getWidth?.() || LETTER_WIDTH_MM;
  const pageHeight = pdf.internal?.pageSize?.getHeight?.() || LETTER_HEIGHT_MM;
  const safeCanvasWidth = Math.max(1, canvas.width || 1);
  const pxPerMm = safeCanvasWidth / pageWidth;
  const rawPxPageHeight = Math.max(1, Math.floor(pageHeight * pxPerMm));
  // Absorb tiny subpixel CSS rounding slivers (< 6px at 2x) onto page 1
  const pxPageHeight =
    canvas.height > rawPxPageHeight && canvas.height - rawPxPageHeight <= 6
      ? canvas.height
      : rawPxPageHeight;
  const totalPages = Math.max(1, Math.ceil(canvas.height / pxPageHeight));

  for (let page = 0; page < totalPages; page++) {
    if (page > 0) pdf.addPage();

    const sliceTop = page * pxPageHeight;
    const sliceHeight = Math.max(
      1,
      Math.min(pxPageHeight, canvas.height - sliceTop),
    );
    const pageCanvas = document.createElement("canvas");
    pageCanvas.width = safeCanvasWidth;
    pageCanvas.height = sliceHeight;

    const ctx = pageCanvas.getContext("2d");
    if (ctx) {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
      ctx.drawImage(
        canvas,
        0,
        sliceTop,
        safeCanvasWidth,
        sliceHeight,
        0,
        0,
        safeCanvasWidth,
        sliceHeight,
      );
    }

    const sliceHeightMm = (sliceHeight * pageWidth) / safeCanvasWidth;
    const imgData = pageCanvas.toDataURL("image/jpeg", 0.98);
    pdf.addImage(imgData, "JPEG", 0, 0, pageWidth, sliceHeightMm);
  }

  return pdf.output("blob");
}

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
        profile.titularProfesional ||
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
            descripcion:
              edu.descripcion || edu.description || edu.campoEstudio || "",
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
   * Generates a PDF Blob from an HTML element using SVG foreignObject capture
   * (modern-screenshot) + US Letter jsPDF pagination (Option A).
   */
  async function generatePdfBlob(
    element: HTMLElement,
    _filename: string = "Curriculum_Vitae.pdf",
    pdfMeta?: { title?: string; author?: string; subject?: string },
  ): Promise<Blob> {
    if (typeof window === "undefined" || (import.meta as any).server) {
      throw new Error("PDF generation is only supported in browser client.");
    }

    isGenerating.value = true;
    statusMessage.value = "Generando PDF en formato Carta...";

    try {
      const [{ domToCanvas }, { jsPDF }] = await Promise.all([
        import("modern-screenshot"),
        import("jspdf"),
      ]);

      const printTarget = resolveCvPrintTarget(element);
      await waitForElementAssets(printTarget);

      const width =
        printTarget.offsetWidth && printTarget.offsetWidth > 0
          ? Math.round(printTarget.offsetWidth)
          : 816;
      const height =
        printTarget.scrollHeight && printTarget.scrollHeight > 0
          ? Math.round(printTarget.scrollHeight)
          : printTarget.offsetHeight && printTarget.offsetHeight > 0
            ? Math.round(printTarget.offsetHeight)
            : 1054;

      const canvas = await domToCanvas(printTarget, {
        width,
        height,
        scale: 2,
        backgroundColor: "#ffffff",
        font: { preferredFormat: "woff2" },
        fetch: {
          requestInit: { mode: "cors" },
          placeholderImage: TRANSPARENT_PIXEL_PLACEHOLDER,
        },
        style: {
          margin: "0",
          boxShadow: "none",
          transform: "none",
        },
        onCloneNode: sanitizePdfCloneNode,
      });

      return buildLetterPdfFromCanvas(jsPDF, canvas, pdfMeta);
    } finally {
      isGenerating.value = false;
      statusMessage.value = "";
    }
  }

  /**
   * Direct vector Carta print / "Save as PDF" via native browser engine (Option B)
   */
  async function downloadPdf(
    element: HTMLElement,
    candidateName: string = "Candidato",
    isAnonymous: boolean = false,
  ): Promise<void> {
    if (typeof window === "undefined" || (import.meta as any).server) {
      throw new Error("PDF generation is only supported in browser client.");
    }

    const cleanName = isAnonymous
      ? "Anonimo"
      : candidateName.replace(/\s+/g, "_");
    const filename = `CV_${cleanName}_Carta`;

    isGenerating.value = true;
    statusMessage.value = "Preparando vista de impresión Carta...";

    const previousTitle = document.title;
    let printRootAttached = false;

    const handleAfterPrint = () => {
      cleanupNativePrintRoot(previousTitle);
      window.removeEventListener("afterprint", handleAfterPrint);
    };

    try {
      const printTarget = resolveCvPrintTarget(element);
      await waitForElementAssets(printTarget);

      cleanupNativePrintRoot();

      const printRoot = document.createElement("div");
      printRoot.id = PRINT_ROOT_ID;
      printRoot.setAttribute("aria-hidden", "true");

      const clonedPage = printTarget.cloneNode(true) as HTMLElement;
      sanitizePdfCloneNode(clonedPage);
      printRoot.appendChild(clonedPage);

      document.body.appendChild(printRoot);
      document.body.classList.add("cv-printing");
      document.title = filename;
      printRootAttached = true;

      window.addEventListener("afterprint", handleAfterPrint, { once: true });
      window.print();
    } finally {
      isGenerating.value = false;
      statusMessage.value = "";
      if (!printRootAttached) {
        window.removeEventListener("afterprint", handleAfterPrint);
      }
    }

    showSuccess(
      isAnonymous ? "CV Anónimo Descargado" : "CV Descargado",
      isAnonymous
        ? "Tu CV en Modo Anónimo está listo para guardar como PDF vectorial (tamaño Carta)."
        : "Selecciona «Guardar como PDF» en la ventana de impresión para exportarlo 1:1 en tamaño Carta.",
      4000,
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
        await apiFetch(`/profile/${userId}`, {
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
