import { ref } from "vue";

export interface AsyncActionOptions<T> {
  successTitle?: string;
  successMessage?: string | ((result: T) => string);
  errorTitle?: string;
  errorMessage?: string | ((error: any) => string);
  showSuccessFeedback?: boolean;
  showErrorFeedback?: boolean;
  onSuccess?: (result: T) => void;
  onError?: (error: any) => void;
}

export function useAsyncAction<T = any>() {
  const isLoading = ref(false);
  const error = ref<any>(null);
  const data = ref<T | null>(null);

  async function execute(
    asyncFn: () => Promise<T>,
    options: AsyncActionOptions<T> = {},
  ): Promise<T | null> {
    const {
      successTitle = "Éxito",
      successMessage,
      errorTitle = "Error",
      errorMessage,
      showSuccessFeedback = true,
      showErrorFeedback = true,
      onSuccess,
      onError,
    } = options;

    const { showSuccess, showError } = useAppFeedback();

    isLoading.value = true;
    error.value = null;

    try {
      const res = await asyncFn();
      data.value = res as any;

      if (showSuccessFeedback && (successMessage || successTitle)) {
        const msg =
          typeof successMessage === "function"
            ? successMessage(res)
            : successMessage || "Operación realizada correctamente";
        showSuccess(successTitle, msg);
      }

      if (onSuccess) {
        onSuccess(res);
      }

      return res;
    } catch (err: any) {
      error.value = err;
      console.error("Async Action Error:", err);

      if (showErrorFeedback) {
        const msg =
          typeof errorMessage === "function"
            ? errorMessage(err)
            : errorMessage ||
              err.message ||
              "Ocurrió un error al procesar la solicitud";
        showError(errorTitle, msg);
      }

      if (onError) {
        onError(err);
      }

      return null;
    } finally {
      isLoading.value = false;
    }
  }

  return {
    isLoading,
    error,
    data,
    execute,
  };
}
