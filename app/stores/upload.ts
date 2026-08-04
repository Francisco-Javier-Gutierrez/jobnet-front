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
      userId?: string,
    ): Promise<{ url: string; success: boolean; error?: string }> {
      const config = useRuntimeConfig();
      this.uploading = true;
      this.uploadProgress = "Validando archivo...";
      this.uploadError = "";

      // 1. Double extension check
      const parts = file.name.toLowerCase().split(".");
      const dangerousExtensions = [
        "exe",
        "bat",
        "cmd",
        "sh",
        "js",
        "vbs",
        "scr",
        "msi",
        "jar",
        "com",
        "pif",
        "wsf",
        "dll",
        "sys",
      ];
      const knownExtensions = [
        "pdf",
        "png",
        "jpg",
        "jpeg",
        "doc",
        "docx",
        "xls",
        "xlsx",
        "txt",
        "zip",
        "rar",
        "exe",
        "bat",
        "cmd",
        "sh",
        "js",
        "vbs",
      ];

      if (parts.length > 1) {
        const finalExt = parts[parts.length - 1];
        if (dangerousExtensions.includes(finalExt)) {
          this.uploadError = "Extensión de archivo peligrosa no permitida.";
          this.uploading = false;
          return { url: "", success: false, error: this.uploadError };
        }

        if (parts.length > 2) {
          for (let i = 1; i < parts.length - 1; i++) {
            if (knownExtensions.includes(parts[i])) {
              this.uploadError =
                "Validación de doble extensión fallida. Nombre de archivo sospechoso (ej. cv.pdf.exe).";
              this.uploading = false;
              return { url: "", success: false, error: this.uploadError };
            }
          }
        }
      }

      // 2. Size limit check: 10MB for PDF, 5MB for Images/Others
      const isPdf =
        file.type === "application/pdf" ||
        file.type === "application/x-pdf" ||
        file.name.toLowerCase().endsWith(".pdf");

      const maxAllowedSize = isPdf ? 10 * 1024 * 1024 : 5 * 1024 * 1024;
      const limitMb = isPdf ? 10 : 5;

      if (file.size > maxAllowedSize) {
        const sizeMb = (file.size / (1024 * 1024)).toFixed(2);
        const fileTypeLabel = isPdf ? "documento PDF" : "archivo de imagen";
        this.uploadError = `El ${fileTypeLabel} "${file.name}" (${sizeMb} MB) supera el límite máximo permitido de ${limitMb}MB.`;
        const { showError } = useAppFeedback();
        showError("Límite de Tamaño Excedido", this.uploadError, null);
        this.uploading = false;
        return { url: "", success: false, error: this.uploadError };
      }

      try {
        this.uploadProgress = "Obteniendo URL de carga segura...";
        // 3. Get presigned upload URL from backend, sending size param
        const response = await $fetch<{ url: string }>(
          `${config.public.apiUrl}/upload-url`,
          {
            params: {
              filename: file.name,
              contentType: file.type,
              folder,
              userId: userId || "anonymous",
              size: file.size,
            },
          },
        );

        if (!response?.url) {
          throw new Error("No se obtuvo una URL de carga del servidor.");
        }

        // 4. Upload file directly to S3 using presigned URL with progress tracking
        this.uploadProgress = "Iniciando carga...";
        await new Promise<void>((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.open("PUT", response.url);
          xhr.setRequestHeader("Content-Type", file.type);

          xhr.upload.onprogress = (e) => {
            if (e.lengthComputable) {
              const percent = Math.round((e.loaded / e.total) * 100);
              this.uploadProgress = `Subiendo archivo... ${percent}%`;
            }
          };

          xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
              resolve();
            } else {
              reject(
                new Error(`Carga fallida con código de estado ${xhr.status}`),
              );
            }
          };

          xhr.onerror = () => {
            reject(new Error("Error de red durante la carga del archivo."));
          };

          xhr.send(file);
        });

        // 5. Construct the public S3 Website URL for error document fallback support
        const rawUrl = response.url.split("?")[0];
        const publicUrl = rawUrl.replace(
          /https:\/\/([^.]+)\.s3(\.[^.]+)?\.amazonaws\.com\//,
          "http://$1.s3-website-us-east-1.amazonaws.com/",
        );

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
