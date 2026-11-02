<template>
  <main
    class="flex-grow pt-4 pb-36 px-4 md:px-8 flex flex-col gap-6 max-w-3xl mx-auto w-full bg-background dark:bg-slate-950 dark:text-slate-100 transition-colors duration-200"
  >
    <!-- Header Section -->
    <div
      class="flex items-center gap-4 mt-4 p-4 bg-surface-container-lowest dark:bg-slate-900 border border-outline-variant/60 rounded-2xl shadow-sm"
    >
      <div class="min-w-0 flex-grow">
        <h1
          class="text-xl font-bold text-on-background dark:text-slate-100 truncate flex items-center gap-2"
        >
          <span class="material-symbols-outlined text-emerald-600 text-3xl"
            >verified_user</span
          >
          Verificación de Organización
        </h1>
        <p class="text-xs text-on-surface-variant dark:text-slate-300 mt-1">
          Las organizaciones con correo de dominio corporativo se verifican
          automáticamente al registrarse. Cuentas con correo de dominio público
          pueden certificar su identidad subiendo su constancia fiscal.
        </p>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex flex-col items-center justify-center p-12">
      <div
        class="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin"
      ></div>
      <p class="mt-4 text-sm text-on-surface-variant font-medium">
        Cargando estado de verificación...
      </p>
    </div>

    <!-- Verification Component -->
    <CompanyVerificationTab
      v-else
      v-model:taxId="taxId"
      v-model:documentoVerificacion="documentoVerificacion"
      :estatusVerificacion="estatusVerificacion"
      :is-verified="organizacionVerificada"
      :companyId="companyId"
      :submittingVerification="submittingVerification"
      @verify="handleVerificationRequest"
    />
  </main>
</template>

<script setup lang="ts">
import { useAppFeedback } from "~/composables/useAppFeedback";

useSeoMeta({
  title: "Verificación de Identidad - JobNet",
  description:
    "Solicita la verificación de identidad corporativa de tu organización.",
});

definePageMeta({
  middleware: "auth",
});

const config = useRuntimeConfig();
const { data: sessionData, status } = useAuth();
const { showSuccess, showError, showWarning } = useAppFeedback();

const companyId = ref("");
const taxId = ref("");
const documentoVerificacion = ref("");
const estatusVerificacion = ref("");
const organizacionVerificada = ref(false);

const loading = ref(true);
const submittingVerification = ref(false);

const fetchVerificationStatus = async () => {
  if (status.value !== "authenticated" || !sessionData.value?.user?.id) {
    return;
  }
  companyId.value = sessionData.value.user.id;
  loading.value = true;
  try {
    const profile = await $fetch<any>(
      `${config.public.apiUrl}/profile/${companyId.value}`,
    );
    if (profile) {
      taxId.value = profile.taxId || "";
      documentoVerificacion.value = profile.documentoVerificacion || "";
      estatusVerificacion.value = profile.estatusVerificacion || "";
      organizacionVerificada.value = profile.organizacionVerificada || false;
    }
  } catch (error) {
    console.error("Error fetching verification status:", error);
  } finally {
    loading.value = false;
  }
};

const handleVerificationRequest = async () => {
  if (!taxId.value || !documentoVerificacion.value || !companyId.value) {
    showWarning(
      "Datos Incompletos",
      "Ingresa tu RFC y el Documento de Verificación.",
      4000,
    );
    return;
  }
  submittingVerification.value = true;
  try {
    await $fetch(`${config.public.apiUrl}/profile/${companyId.value}`, {
      method: "POST",
      body: {
        taxId: taxId.value,
        documentoVerificacion: documentoVerificacion.value,
        estatusVerificacion: "En revisión",
        organizacionVerificada: false,
      },
    });
    estatusVerificacion.value = "En revisión";
    showSuccess(
      "Solicitud Enviada",
      "Tu solicitud de verificación fue enviada al equipo de moderación.",
      3500,
    );
  } catch (error: any) {
    console.error("Error requesting verification:", error);
    showError(
      "Error en Solicitud",
      error?.data?.error || "Ocurrió un error al solicitar la verificación.",
      null,
    );
  } finally {
    submittingVerification.value = false;
  }
};

onMounted(async () => {
  await fetchVerificationStatus();
});
</script>
