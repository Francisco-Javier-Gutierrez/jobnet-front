<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in"
      @click.self="close"
    >
      <div
        class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 text-slate-800 dark:text-slate-100 transition-colors"
      >
        <!-- Modal Header -->
        <div
          class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3"
        >
          <div class="flex items-center gap-2 text-rose-600 dark:text-rose-400">
            <span class="material-symbols-outlined text-xl">flag</span>
            <h3 class="text-base font-bold">Reportar {{ targetLabel }}</h3>
          </div>
          <button
            @click="close"
            class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg transition"
          >
            <span class="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

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
            Un equipo de moderadores revisará el contenido reportado a la
            brevedad.
          </p>
        </div>

        <!-- Form -->
        <form v-else @submit.prevent="submitReport" class="space-y-4 text-xs">
          <AppSelect
            v-model="reason"
            label="Motivo principal del reporte"
            :options="reasonOptions"
            placeholder="Seleccionar motivo..."
          />

          <div>
            <label
              class="font-bold text-slate-700 dark:text-slate-300 block mb-1"
            >
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

          <!-- Buttons -->
          <div
            class="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800"
          >
            <button
              type="button"
              @click="close"
              class="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              :disabled="!comments.trim() || isSubmitting"
              class="bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white px-5 py-2.5 rounded-xl font-bold transition flex items-center gap-1.5 shadow"
            >
              <span
                v-if="isSubmitting"
                class="material-symbols-outlined text-sm animate-spin"
                >progress_activity</span
              >
              <span>{{ isSubmitting ? "Enviando..." : "Enviar Reporte" }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
const props = defineProps<{
  isOpen: boolean;
  targetType: "POST" | "VACANTE" | "ORGANIZACION" | "EMPRESA";
  targetId: string;
  targetTitle?: string;
}>();

const emit = defineEmits(["close", "submitted"]);

const config = useRuntimeConfig();
const { data: authSession } = useAuth();

const reason = ref("Contenido Inapropiado / Ofensivo");
const comments = ref("");
const reasonOptions = [
  "Contenido Inapropiado / Ofensivo",
  "Fraude, Estafa o Publicación Falsa",
  "Spam o Publicidad No Deseada",
  "Suplantación de Identidad",
  "Discriminación o Acoso",
  "Otro",
];
const isSubmitting = ref(false);
const submittedSuccess = ref(false);

const targetLabel = computed(() => {
  switch (props.targetType) {
    case "POST":
      return "Publicación";
    case "VACANTE":
      return "Vacante";
    case "ORGANIZACION":
    case "EMPRESA":
      return "Organización";
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
      (authSession.value?.user as any)?.email ||
      (authSession.value?.user as any)?.id ||
      "Usuario Registrado";

    await $fetch(`${config.public.apiUrl}/moderator/incidents`, {
      method: "POST",
      body: {
        targetType: props.targetType,
        targetId: props.targetId,
        targetTitle: props.targetTitle || "",
        postId: props.targetType === "POST" ? props.targetId : undefined,
        postTitle: props.targetType === "POST" ? props.targetTitle : undefined,
        jobId: props.targetType === "VACANTE" ? props.targetId : undefined,
        jobTitle:
          props.targetType === "VACANTE" ? props.targetTitle : undefined,
        companyId:
          props.targetType === "ORGANIZACION" || props.targetType === "EMPRESA"
            ? props.targetId
            : undefined,
        companyName:
          props.targetType === "ORGANIZACION" || props.targetType === "EMPRESA"
            ? props.targetTitle
            : undefined,
        reporter,
        reason: `${reason.value}: ${comments.value.trim()}`,
        severity: "media",
        infraccion: reason.value,
      },
    });

    submittedSuccess.value = true;
    setTimeout(() => {
      close();
      emit("submitted");
    }, 1800);
  } catch (e: any) {
    console.error("Error submitting report:", e);
    alert("Hubo un error al enviar el reporte. Por favor intenta de nuevo.");
  } finally {
    isSubmitting.value = false;
  }
};
</script>
