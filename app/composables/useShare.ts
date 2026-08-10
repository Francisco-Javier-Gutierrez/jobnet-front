import { useFeedbackStore } from "./useAppFeedback";

export function useShare() {
  const feedbackStore = useFeedbackStore();

  /**
   * Dynamically gets the actual browser origin URL (host + protocol + port).
   * Works on both Client side (window.location.origin) and Server side (useRequestURL).
   * Avoids hardcoded localhost for production environments.
   */
  const getOrigin = (): string => {
    if (
      process.client &&
      typeof window !== "undefined" &&
      window.location?.origin
    ) {
      return window.location.origin;
    }
    try {
      const reqUrl = useRequestURL();
      if (reqUrl?.origin) return reqUrl.origin;
    } catch (e) {
      // Fallback if SSR request URL context is not available
    }
    return "";
  };

  /**
   * Copies text to the system clipboard.
   * Uses navigator.clipboard.writeText with fallback to document.execCommand('copy')
   * for non-HTTPS or legacy browser environments.
   */
  const copyToClipboard = async (text: string): Promise<boolean> => {
    if (!process.client) return false;

    // Primary: Modern Async Clipboard API
    if (navigator?.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch (err) {
        console.warn("navigator.clipboard failed, attempting fallback:", err);
      }
    }

    // Fallback: Temporary DOM textarea + document.execCommand('copy')
    try {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.position = "fixed";
      textarea.style.left = "-9999px";
      textarea.style.top = "-9999px";
      textarea.style.opacity = "0";
      textarea.setAttribute("readonly", "");
      document.body.appendChild(textarea);

      textarea.focus();
      textarea.select();

      const successful = document.execCommand("copy");
      document.body.removeChild(textarea);
      if (successful) return true;
    } catch (err) {
      console.error("Clipboard copy fallback failed:", err);
    }

    return false;
  };

  /**
   * Shares a generic URL and displays feedback notification.
   */
  const shareUrl = async (
    url: string,
    label = "Enlace copiado al portapapeles",
  ) => {
    const success = await copyToClipboard(url);
    if (success) {
      feedbackStore.showSuccess("Éxito", `${label}:\n${url}`);
    } else {
      feedbackStore.showError(
        "Error al copiar",
        `No se pudo copiar automáticamente. Puedes copiar la URL manualmente:\n${url}`,
      );
    }
  };

  /**
   * Shares a publication/post link using the dynamic browser origin.
   */
  const sharePost = async (post: any) => {
    const id = post?.uniqueId || post?.id;
    if (!id) return;
    const origin = getOrigin();
    const fullUrl = `${origin}/posts/${id}`;
    await shareUrl(fullUrl, "Enlace de la publicación copiado al portapapeles");
  };

  /**
   * Shares a vacancy/job link using the dynamic browser origin.
   */
  const shareJob = async (job: any) => {
    const id = job?.id || job?.uniqueId;
    if (!id) return;
    const origin = getOrigin();
    const fullUrl = `${origin}/jobs/${id}`;
    await shareUrl(fullUrl, "Enlace de la vacante copiado al portapapeles");
  };

  return {
    getOrigin,
    copyToClipboard,
    shareUrl,
    sharePost,
    shareJob,
  };
}
