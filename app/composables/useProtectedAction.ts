export const useProtectedAction = () => {
  const isModalOpen = useState<boolean>(
    "protected_action_modal_open",
    () => false,
  );
  const modalMessage = useState<string>(
    "protected_action_modal_message",
    () =>
      "Para realizar esta acción necesitas contar con una cuenta en JobNet.",
  );

  const openProtectedModal = (customMessage?: string) => {
    if (customMessage) {
      modalMessage.value = customMessage;
    } else {
      modalMessage.value =
        "Para realizar esta acción necesitas contar con una cuenta en JobNet.";
    }
    isModalOpen.value = true;
  };

  const closeProtectedModal = () => {
    isModalOpen.value = false;
  };

  return {
    isModalOpen,
    modalMessage,
    openProtectedModal,
    closeProtectedModal,
  };
};
