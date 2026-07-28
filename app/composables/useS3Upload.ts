import { ref } from "vue";

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
      const config = useRuntimeConfig();
      const apiBase =
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

      const { url, key } = await res.json();

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

      // Compute public URL
      const filePublicUrl = url.split("?")[0];
      return { url: filePublicUrl, key };
    } catch (err: any) {
      uploadError.value = err.message || "Error al subir archivo";
      return null;
    } finally {
      isUploading.value = false;
    }
  }

  return {
    isUploading,
    uploadError,
    uploadFile,
  };
}
