export interface UploadOptions {
  folder?: string;
  userId?: string;
  contentType?: string;
}

export function useS3Upload() {
  const isUploading = ref(false);
  const uploadError = ref<string | null>(null);

  async function uploadFile(
    file: File,
    options: UploadOptions = {},
  ): Promise<{ url: string; key: string } | null> {
    isUploading.value = true;
    uploadError.value = null;

    try {
      // Strict 5MB limit
      const isPdf =
        file.type === "application/pdf" ||
        file.type === "application/x-pdf" ||
        file.name.toLowerCase().endsWith(".pdf");

      const maxAllowedSize = 5 * 1024 * 1024;
      const limitMb = 5;

      if (file.size > maxAllowedSize) {
        const { showError } = useAppFeedback();
        const sizeMb = (file.size / (1024 * 1024)).toFixed(2);
        const fileTypeLabel = isPdf ? "documento PDF" : "archivo";
        const msg = `El ${fileTypeLabel} "${file.name}" (${sizeMb} MB) supera el límite máximo permitido de ${limitMb}MB.`;
        showError("Límite de Tamaño Excedido", msg, null);
        throw new Error(msg);
      }

      const config = useRuntimeConfig();
      const apiBase =
        config.public.apiUrl ||
        config.public.apiBase ||
        "https://olhoy8ebq7.execute-api.us-east-1.amazonaws.com";

      const folder = options.folder || "general";
      const userId = options.userId || "user";
      const size = file.size;
      const filename = file.name;
      const contentType =
        options.contentType || file.type || "application/octet-stream";

      const presignUrl = `${apiBase}/upload-url?folder=${encodeURIComponent(folder)}&filename=${encodeURIComponent(
        filename,
      )}&userId=${encodeURIComponent(userId)}&size=${size}&contentType=${encodeURIComponent(contentType)}`;

      const res = await fetch(presignUrl);
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "No se pudo obtener la URL de subida");
      }

      const { url, key, publicUrl } = await res.json();

      // Perform S3 upload
      const uploadRes = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": contentType,
        },
        body: file,
      });

      if (!uploadRes.ok) {
        throw new Error("Fallo al subir el archivo a S3");
      }

      // Use the standard S3 HTTPS REST endpoint
      const filePublicUrl = publicUrl || url.split("?")[0];
      return { url: filePublicUrl, key };
    } catch (err: any) {
      uploadError.value = err.message || "Error al subir archivo";
      return null;
    } finally {
      isUploading.value = false;
    }
  }

  async function getSecureViewUrl(keyOrUrl: string): Promise<string> {
    if (!keyOrUrl) return "";
    if (keyOrUrl.startsWith("data:") || keyOrUrl.startsWith("blob:")) {
      return keyOrUrl;
    }
    try {
      const config = useRuntimeConfig();
      const apiBase =
        config.public.apiUrl ||
        config.public.apiBase ||
        "https://olhoy8ebq7.execute-api.us-east-1.amazonaws.com";
      const res = await fetch(`${apiBase}/view-url?url=${encodeURIComponent(keyOrUrl)}`);
      if (res.ok) {
        const data = await res.json();
        return data.url || keyOrUrl;
      }
    } catch (e) {
      console.warn("Error fetching signed view URL:", e);
    }
    return keyOrUrl;
  }

  return {
    isUploading,
    uploadError,
    uploadFile,
    getSecureViewUrl,
  };
}
