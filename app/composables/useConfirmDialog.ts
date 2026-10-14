export type ConfirmVariant = "danger" | "warning" | "info" | "success";

export interface ConfirmDialogOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  icon?: string;
  variant?: ConfirmVariant;
  onConfirm?: () => Promise<void> | void;
}

export function useConfirmDialog() {
  const isOpen = ref(false);
  const isConfirming = ref(false);
  const title = ref("");
  const message = ref("");
  const confirmText = ref("Confirmar");
  const cancelText = ref("Cancelar");
  const icon = ref("help");
  const variant = ref<ConfirmVariant>("warning");
  let pendingOnConfirm: (() => Promise<void> | void) | null = null;

  function openConfirm(options: ConfirmDialogOptions) {
    title.value = options.title;
    message.value = options.message;
    confirmText.value = options.confirmText || "Confirmar";
    cancelText.value = options.cancelText || "Cancelar";
    variant.value = options.variant || "warning";

    if (options.icon) {
      icon.value = options.icon;
    } else {
      switch (variant.value) {
        case "danger":
          icon.value = "delete";
          break;
        case "warning":
          icon.value = "warning";
          break;
        case "success":
          icon.value = "check_circle";
          break;
        default:
          icon.value = "info";
      }
    }

    pendingOnConfirm = options.onConfirm || null;
    isOpen.value = true;
  }

  function closeConfirm() {
    if (isConfirming.value) return;
    isOpen.value = false;
    pendingOnConfirm = null;
  }

  async function handleConfirm() {
    if (!pendingOnConfirm) {
      isOpen.value = false;
      return;
    }

    isConfirming.value = true;
    try {
      await pendingOnConfirm();
      isOpen.value = false;
    } catch (e) {
      console.error("Error executing confirm action:", e);
    } finally {
      isConfirming.value = false;
      pendingOnConfirm = null;
    }
  }

  return {
    isOpen,
    isConfirming,
    title,
    message,
    confirmText,
    cancelText,
    icon,
    variant,
    openConfirm,
    closeConfirm,
    handleConfirm,
  };
}
