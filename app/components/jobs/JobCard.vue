<template>
  <div
    @click="handleClick"
    :class="[
      'select-none transition-colors duration-200',
      isDetail
        ? 'bg-surface-container-lowest dark:bg-slate-900 border border-outline-variant/60 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm space-y-4'
        : 'bg-surface-container-lowest dark:bg-slate-900 border border-outline-variant/60 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm cursor-pointer hover:shadow-md transition-shadow',
    ]"
  >
    <!-- HEADER: Company info & Vacancy status -->
    <div class="flex items-center gap-3 p-4 prevent-job-nav">
      <!-- Company Avatar / Logo -->
      <div
        @click.stop="navigateToCompany"
        class="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-primary-container text-white flex items-center justify-center text-sm font-bold shadow-sm flex-shrink-0 cursor-pointer hover:opacity-85 transition active:scale-95 overflow-hidden"
        title="Ver organización"
      >
        <img
          v-if="job.companyLogo || job.empresaLogo"
          :src="job.companyLogo || job.empresaLogo"
          :alt="companyName"
          class="w-full h-full object-cover"
        />
        <span v-else>
          {{ companyName ? companyName.charAt(0).toUpperCase() : "V" }}
        </span>
      </div>

      <div class="flex-grow min-w-0">
        <div class="flex items-center gap-2 flex-wrap">
          <h3
            @click.stop="handleClick"
            class="text-sm font-extrabold text-on-background dark:text-slate-100 truncate cursor-pointer hover:underline hover:text-primary dark:hover:text-indigo-400 transition select-text"
            :title="job.title"
          >
            {{ job.title || "Vacante sin título" }}
          </h3>
          <span
            v-if="job.estado === 'EVALUACION'"
            class="px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20"
          >
            Bajo Evaluación
          </span>
        </div>

        <div
          class="flex items-center gap-1.5 text-[11px] text-on-surface-variant dark:text-slate-400 truncate"
        >
          <span
            @click.stop="navigateToCompany"
            class="font-bold text-primary dark:text-indigo-400 hover:underline cursor-pointer select-text"
          >
            {{ companyName }}
          </span>
          <span
            class="material-symbols-outlined text-[13px] text-secondary fill-1"
            title="Verificada"
            >verified</span
          >
          <span>·</span>
          <span class="select-text">{{ formattedTime }}</span>
        </div>
      </div>

      <!-- 3-Dots Menu (...) for reporting job -->
      <div class="relative ml-auto flex-shrink-0">
        <button
          @click.stop="showMenu = !showMenu"
          class="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          title="Opciones"
        >
          <span class="material-symbols-outlined text-[20px]">more_vert</span>
        </button>
        <div
          v-if="showMenu"
          @click.stop
          class="absolute right-0 top-8 z-30 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl p-1 text-xs animate-fade-in"
        >
          <button
            @click.stop="openReportModal"
            class="w-full text-left px-3 py-2 rounded-lg text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 font-semibold flex items-center gap-2 transition"
          >
            <span class="material-symbols-outlined text-base">flag</span>
            Reportar vacante
          </button>
        </div>
      </div>
    </div>

    <!-- SPECIFICATIONS BADGES -->
    <div class="px-4 pb-2 flex flex-wrap gap-1.5 text-xs">
      <span
        v-if="job.modalidad || job.type"
        class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-primary/10 text-primary dark:text-indigo-300 border border-primary/20"
      >
        <span class="material-symbols-outlined text-[14px]">laptop</span>
        {{ job.modalidad || job.type }}
      </span>
      <span
        v-if="salaryDisplay"
        class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20"
      >
        <span class="material-symbols-outlined text-[14px]">payments</span>
        {{ salaryDisplay }}
      </span>
      <span
        v-if="job.sector || job.location"
        class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-secondary/10 text-secondary border border-secondary/20"
      >
        <span class="material-symbols-outlined text-[14px]">domain</span>
        {{ job.sector || job.location }}
      </span>
      <span
        v-if="(job.vacantesDisponibles || 1) > 1"
        class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-extrabold bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20"
      >
        <span class="material-symbols-outlined text-[14px] text-amber-500"
          >local_fire_department</span
        >
        {{ job.vacantesDisponibles }} plazas
      </span>
    </div>

    <!-- VACANCY DESCRIPTION SNIPPET -->
    <div class="px-4 py-2 flex flex-col gap-2">
      <p
        class="text-xs sm:text-sm text-on-surface-variant dark:text-slate-300 leading-relaxed text-left select-text line-clamp-3"
      >
        {{ job.descripcion || job.description || "Sin descripción detallada." }}
      </p>
    </div>

    <!-- BOTTOM ACTIONS BAR -->
    <AppInteractionBar
      :item-id="job.id || job.uniqueId"
      storage-prefix="shared-jobs"
      :current-user-id="currentUserId"
      :is-liked="isLiked"
      :is-bookmarked="effectiveIsBookmarked"
      :likes-count="likesCount"
      :comments-count="commentsCount"
      :shares-count="sharesCount"
      :bookmarks-count="bookmarksCount"
      container-class="prevent-job-nav"
      like-title="Me gusta esta vacante"
      comment-title="Ver comentarios y detalles en la vacante"
      share-title="Compartir enlace de vacante"
      bookmark-title="Guardar vacante"
      @like="emit('like', props.job)"
      @comment="forceNavigate"
      @share="emit('share', props.job)"
      @bookmark="emit('bookmark', props.job)"
    />

    <!-- Report Modal for Vacancy -->
    <ReportModal
      :is-open="showReportModal"
      target-type="VACANTE"
      :target-id="job.id || job.uniqueId"
      :target-title="job.title || 'Vacante'"
      @close="showReportModal = false"
    />
  </div>
</template>

<script setup lang="ts">
import type { Job } from "~/types";

const props = withDefaults(
  defineProps<{
    job: Job;
    currentUserId?: string;
    isBookmarked?: boolean;
    isLiked?: boolean;
    isDetail?: boolean;
  }>(),
  {
    isDetail: false,
    isBookmarked: undefined,
    isLiked: undefined,
  },
);

const emit = defineEmits<{
  (e: "like", job: Job): void;
  (e: "bookmark", job: Job): void;
  (e: "share", job: Job): void;
  (e: "navigate", id?: string): void;
}>();

const showMenu = ref(false);
const showReportModal = ref(false);

const { status } = useAuth();
const { openProtectedModal } = useProtectedAction();
const router = useRouter();
const {
  getUserIdentifiers,
  isItemLiked: checkItemLiked,
  isItemBookmarked: checkItemBookmarked,
  getItemLikesCount,
  getItemBookmarksCount,
  getItemCommentsCount,
} = useContentInteractions();

const companyName = computed(() => {
  return (
    props.job?.company ||
    props.job?.empresaNombre ||
    props.job?.organización ||
    "Organización Reclutadora"
  );
});

const formattedTime = computed(() => {
  if (!props.job?.createdAt) return "Reciente";
  try {
    const d = new Date(props.job.createdAt);
    if (isNaN(d.getTime())) return "Reciente";
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    if (diffHours < 1) return "Hace un momento";
    if (diffHours < 24) return `Hace ${diffHours} h`;
    const diffDays = Math.floor(diffHours / 24);
    return `Hace ${diffDays} d`;
  } catch (e) {
    return "Reciente";
  }
});

const salaryDisplay = computed(() => {
  if (props.job?.salarioConfidencial || props.job?.isSalaryConfidential) {
    return "Salario confidencial";
  }
  if (props.job?.salarioFormatted) return props.job.salarioFormatted;
  if (props.job?.salary) return props.job.salary;
  if (props.job?.salario)
    return `$${props.job.salario.toLocaleString("es-MX")}`;
  if (props.job?.salarioMinimo && props.job?.salarioMaximo) {
    return `$${props.job.salarioMinimo.toLocaleString()} - $${props.job.salarioMaximo.toLocaleString()}`;
  }
  return null;
});

// Likes count & state
const isLiked = computed(() => {
  if (props.isLiked !== undefined) return props.isLiked;
  return checkItemLiked(props.job, getUserIdentifiers(props.currentUserId));
});

const likesCount = computed(() => getItemLikesCount(props.job));

// Bookmarks state
const effectiveIsBookmarked = computed(() => {
  if (props.isBookmarked !== undefined) return props.isBookmarked;
  return checkItemBookmarked(
    props.job,
    getUserIdentifiers(props.currentUserId),
  );
});

// Comments count
const commentsCount = computed(() => getItemCommentsCount(props.job));

const sharesCount = computed(() => {
  return props.job?.sharesCount || 0;
});

const bookmarksCount = computed(() => getItemBookmarksCount(props.job));

// Click handlers
const handleClick = (e: MouseEvent) => {
  if (props.isDetail) return;
  const target = e.target as HTMLElement;
  if (
    target.closest(".prevent-job-nav") ||
    target.closest("button") ||
    target.closest("a")
  ) {
    return;
  }
  forceNavigate();
};

const forceNavigate = () => {
  if (props.isDetail) return;
  const targetId = props.job.id || props.job.uniqueId;
  emit("navigate", targetId);
  if (targetId) {
    router.push(`/jobs/${targetId}`);
  }
};

const navigateToCompany = () => {
  const companyId =
    props.job.empresaUuid || props.job.empresaId || props.job.companyId;
  if (companyId) {
    router.push(`/company/${companyId}`);
  }
};

const openReportModal = () => {
  showMenu.value = false;
  if (status.value !== "authenticated") {
    openProtectedModal();
    return;
  }
  showReportModal.value = true;
};
</script>
