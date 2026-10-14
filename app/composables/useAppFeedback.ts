import { defineStore } from "pinia";

export type FeedbackType = "success" | "error" | "warning" | "info";

export interface FeedbackOptions {
  type?: FeedbackType;
  title: string;
  message: string;
  confirmText?: string;
  autoCloseTimeout?: number | null; // in ms (e.g. 3000 for 3s, or 0 / null for NEVER auto-close)
  onConfirm?: () => void;
  onClose?: () => void;
}

export interface FeedbackState {
  show: boolean;
  type: FeedbackType;
  title: string;
  message: string;
  confirmText: string;
  autoCloseTimeout: number | null;
  onConfirm?: () => void;
  onClose?: () => void;
}

export const useFeedbackStore = defineStore("app-feedback", {
  state: (): FeedbackState => ({
    show: false,
    type: "info",
    title: "",
    message: "",
    confirmText: "Aceptar",
    autoCloseTimeout: 3500,
    onConfirm: undefined,
    onClose: undefined,
  }),
  actions: {
    showFeedback(options: FeedbackOptions) {
      this.type = options.type || "info";
      this.title = options.title;
      this.message = options.message;
      this.confirmText = options.confirmText || "Aceptar";
      this.autoCloseTimeout =
        options.autoCloseTimeout !== undefined
          ? options.autoCloseTimeout
          : 3500;
      this.onConfirm = options.onConfirm;
      this.onClose = options.onClose;
      this.show = true;
    },

    showSuccess(
      title: string,
      message: string,
      autoCloseTimeout: number | null = 3500,
    ) {
      this.showFeedback({ type: "success", title, message, autoCloseTimeout });
    },

    showError(
      title: string,
      message: string,
      autoCloseTimeout: number | null = null,
    ) {
      this.showFeedback({ type: "error", title, message, autoCloseTimeout });
    },

    showWarning(
      title: string,
      message: string,
      autoCloseTimeout: number | null = 4500,
    ) {
      this.showFeedback({ type: "warning", title, message, autoCloseTimeout });
    },

    showInfo(
      title: string,
      message: string,
      autoCloseTimeout: number | null = 3500,
    ) {
      this.showFeedback({ type: "info", title, message, autoCloseTimeout });
    },

    closeFeedback() {
      if (this.onClose) {
        this.onClose();
      }
      this.show = false;
    },

    confirmFeedback() {
      if (this.onConfirm) {
        this.onConfirm();
      }
      this.closeFeedback();
    },
  },
});

export function useAppFeedback() {
  const store = useFeedbackStore();

  // Expose store state as a single computed object to maintain backwards compatibility
  const feedbackState = computed(() => ({
    show: store.show,
    type: store.type,
    title: store.title,
    message: store.message,
    confirmText: store.confirmText,
    autoCloseTimeout: store.autoCloseTimeout,
    onConfirm: store.onConfirm,
    onClose: store.onClose,
  }));

  return {
    feedbackState,
    showFeedback: store.showFeedback,
    showSuccess: store.showSuccess,
    showError: store.showError,
    showWarning: store.showWarning,
    showInfo: store.showInfo,
    closeFeedback: store.closeFeedback,
    confirmFeedback: store.confirmFeedback,
  };
}
