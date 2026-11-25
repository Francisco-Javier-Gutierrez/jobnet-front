<template>
  <AppModal
    :model-value="isOpen"
    @update:model-value="close"
    :title="`Reportar ${targetLabel}`"
    icon="flag"
    icon-bg-class="bg-rose-500/10 text-rose-600 dark:text-rose-400"
    max-width="md"
  >
    <!-- Target Info -->
    <div
      v-if="targetTitle"
      class="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-xs"
    >
      <span
        class="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-0.5"
      >
        Elemento a reportar
      </span>
      <p class="font-semibold text-slate-800 dark:text-slate-200 truncate">
        {{ targetTitle }}
      </p>
    </div>

    <!-- Success Message -->
    <div
      v-if="submittedSuccess"
      class="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 p-4 rounded-xl text-center space-y-2 text-xs"
    >
      <span
        class="material-symbols-outlined text-3xl text-emerald-600 dark:text-emerald-400"
        >check_circle</span
      >
      <p class="font-bold text-sm">Reporte enviado con éxito</p>
      <p>
        Un equipo de moderadores revisará el contenido reportado a la brevedad.
      </p>
    </div>

    <!-- Form -->
    <form
      v-else
      id="report-form"
      @submit.prevent="submitReport"
      class="space-y-4 text-xs"
    >
      <AppSelect
        v-model="reason"
        label="Motivo principal del reporte"
        :options="reasonOptions"
        placeholder="Seleccionar motivo..."
      />

      <div>
        <label class="font-bold text-slate-700 dark:text-slate-300 block mb-1">
          Detalles o Comentarios Adicionales
        </label>
        <textarea
          v-model="comments"
          rows="3"
          placeholder="Explica brevemente la razón de este reporte para apoyar a la revisión..."
          class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 outline-none focus:border-rose-600 text-slate-800 dark:text-slate-200 resize-none"
          required
        ></textarea>
      </div>
    </form>

    <template #footer v-if="!submittedSuccess">
      <button
        type="button"
        @click="close"
        class="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 font-bold text-xs text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition cursor-pointer"
      >
        Cancelar
      </button>
      <button
        type="submit"
        form="report-form"
        :disabled="!comments.trim() || isSubmitting"
        class="bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white text-xs px-5 py-2.5 rounded-xl font-bold transition flex items-center gap-1.5 shadow cursor-pointer"
      >
        <span
          v-if="isSubmitting"
          class="w-5 h-5 border-2 border-current/20 border-t-current rounded-full animate-spin"
          aria-hidden="true"
        ></span>
        <span>{{ isSubmitting ? "Enviando..." : "Enviar Reporte" }}</span>
      </button>
    </template>
  </AppModal>
</template>

<script setup lang="ts">
const props = defineProps<{
  isOpen: boolean;
  targetType: "POST" | "VACANTE" | "ORGANIZACION" | "CHAT";
  targetId: string;
  targetTitle?: string;
  jobId?: string;
  jobTitle?: string;
  candidateId?: string;
  candidateName?: string;
  companyId?: string;
  companyName?: string;
}>();

const emit = defineEmits<{
  (e: "close"): void;
  (e: "submitted"): void;
}>();

const config = useRuntimeConfig();
const { data: authSession } = useAuth();

const comments = ref("");

const defaultReasons = [
  "Contenido Inapropiado / Ofensivo",
  "Fraude, Estafa o Publicación Falsa",
  "Spam o Publicidad No Deseada",
  "Suplantación de Identidad",
  "Discriminación o Acoso",
  "Discrepancia Salarial / Oferta Engañosa",
  "Otro",
];

const chatReasons = [
  "Fraude o Solicitud de Pagos Indebidos",
  "Discrepancia Salarial o Condiciones Engañosas",
  "Acoso u Hostigamiento",
  "Discriminación o Lenguaje Ofensivo",
  "Spam o Enlaces No Autorizados",
  "Otro",
];

const reasonOptions = computed(() => {
  return props.targetType === "CHAT" ? chatReasons : defaultReasons;
});

const reason = ref(
  props.targetType === "CHAT" ? chatReasons[0] : defaultReasons[0],
);

watch(
  () => props.targetType,
  (newType) => {
    reason.value = newType === "CHAT" ? chatReasons[0] : defaultReasons[0];
  },
);

const isSubmitting = ref(false);
const submittedSuccess = ref(false);

const targetLabel = computed(() => {
  switch (props.targetType) {
    case "POST":
      return "Publicación";
    case "VACANTE":
      return "Vacante";
    case "ORGANIZACION":
      return "Organización";
    case "CHAT":
      return "Conversación";
    default:
      return "Contenido";
  }
});

const close = () => {
  submittedSuccess.value = false;
  comments.value = "";
  emit("close");
};

const submitReport = async () => {
  if (!comments.value.trim() || isSubmitting.value) return;
  isSubmitting.value = true;

  try {
    const reporter =
      authSession.value?.user?.email ||
      authSession.value?.user?.id ||
      "Usuario Registrado";

    const token =
      (authSession.value as any)?.idToken ||
      (authSession.value as any)?.accessToken ||
      (authSession.value as any)?.token ||
      "";
    const headers: Record<string, string> = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const rUpper = reason.value.toUpperCase();
    const isSerious =
      rUpper.includes("FRAUDE") ||
      rUpper.includes("SALARIO") ||
      rUpper.includes("DISCREPANCIA") ||
      rUpper.includes("ACOSO") ||
      rUpper.includes("DISCRIMINACION");
    const severity =
      isSerious || props.targetType === "CHAT" ? "alta" : "media";

    await $fetch(`${config.public.apiUrl}/moderator/incidents`, {
      method: "POST",
      headers,
      body: {
        targetType: props.targetType,
        targetId: props.targetId,
        targetTitle: props.targetTitle || "",
        postId: props.targetType === "POST" ? props.targetId : undefined,
        postTitle: props.targetType === "POST" ? props.targetTitle : undefined,
        jobId:
          props.targetType === "VACANTE"
            ? props.targetId
            : props.jobId || undefined,
        jobTitle:
          props.targetType === "VACANTE"
            ? props.targetTitle
            : props.jobTitle || undefined,
        candidateId: props.candidateId || undefined,
        candidateName: props.candidateName || undefined,
        companyId:
          props.targetType === "ORGANIZACION"
            ? props.targetId
            : props.companyId || undefined,
        companyName:
          props.targetType === "ORGANIZACION"
            ? props.targetTitle
            : props.companyName || undefined,
        reporter,
        reason: `${reason.value}: ${comments.value.trim()}`,
        severity,
        infraccion: reason.value,
      },
    });

    submittedSuccess.value = true;
    setTimeout(() => {
      close();
      emit("submitted");
    }, 1800);
  } catch (e: unknown) {
    console.error("Error submitting report:", e);
    const { showError } = useAppFeedback();
    showError(
      "Error al Enviar Reporte",
      "Hubo un problema al registrar el reporte. Por favor intenta de nuevo.",
    );
  } finally {
    isSubmitting.value = false;
  }
};
</script>
