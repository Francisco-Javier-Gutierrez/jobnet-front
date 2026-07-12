import { defineStore } from "pinia";

export const useUploadStore = defineStore("upload", {
  state: () => ({
    uploading: false,
    uploadProgress: "" as string,
    uploadError: "" as string,
  }),
  actions: {
    /**
     * Uploads a file to S3 via the backend presigned URL endpoint.
     * @param file - The File object to upload
     * @param folder - The S3 folder/prefix (e.g. "cv", "verification", "logos")
     * @returns The public S3 URL of the uploaded file
     */
    async uploadFile(
      file: File,
      folder: string,
    ): Promise<{ url: string; success: boolean; error?: string }> {
      const config = useRuntimeConfig();
      this.uploading = true;
      this.uploadProgress = "Obteniendo URL de carga...";
      this.uploadError = "";

      try {
        // 1. Get presigned upload URL from backend
        const response = await $fetch<{ url: string }>(
          `${config.public.apiUrl}/upload-url`,
          {
            params: {
              filename: file.name,
              contentType: file.type,
              folder,
            },
          },
        );

        if (!response?.url) {
          throw new Error("No se obtuvo una URL de carga del servidor.");
        }

        // 2. Upload file directly to S3 using presigned URL
        this.uploadProgress = "Subiendo archivo...";
        await fetch(response.url, {
          method: "PUT",
          body: file,
          headers: {
            "Content-Type": file.type,
          },
        });

        // 3. Construct the public S3 URL (strip query params from presigned URL)
        const publicUrl = response.url.split("?")[0];

        this.uploadProgress = "";
        return { url: publicUrl, success: true };
      } catch (error: any) {
        console.error("Error uploading file to S3:", error);
        const errorMsg =
          error.data?.error || error.message || "Error al subir el archivo.";
        this.uploadError = errorMsg;
        return { url: "", success: false, error: errorMsg };
      } finally {
        this.uploading = false;
      }
    },

    clearError() {
      this.uploadError = "";
    },
  },
});
