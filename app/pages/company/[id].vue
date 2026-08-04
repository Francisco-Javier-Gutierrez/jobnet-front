<template>
  <!-- Loading State -->
  <main
    v-if="loading"
    class="w-full max-w-container-max mx-auto md:px-gutter md:py-8 px-margin-mobile pb-16 animate-pulse"
  >
    <!-- Header / Banner Section Skeleton -->
    <section
      class="relative bg-surface-variant/40 dark:bg-slate-800/50 h-40 md:h-52 rounded-2xl mb-24 md:mb-28"
    >
      <!-- Corporate Logo Overlap Skeleton -->
      <div
        class="absolute -bottom-20 md:-bottom-24 left-1/2 -translate-x-1/2 w-48 h-48 md:w-60 md:h-60 bg-surface dark:bg-slate-900 rounded-3xl border-4 border-surface dark:border-slate-800 flex items-center justify-center p-3 md:p-3.5 z-20"
      >
        <div
          class="w-full h-full bg-surface-variant/50 dark:bg-slate-800 rounded-2xl"
        ></div>
      </div>
    </section>

    <!-- Central Identity Card Skeleton -->
    <section
      class="px-margin-mobile flex flex-col items-center text-center mt-2 mb-8 space-y-4"
    >
      <div
        class="h-10 w-64 md:w-96 bg-surface-variant/50 dark:bg-slate-800 rounded-xl mb-2"
      ></div>
      <div
        class="h-7 w-40 bg-surface-variant/40 dark:bg-slate-800/80 rounded-full mb-1"
      ></div>
      <div
        class="h-5 w-48 bg-surface-variant/30 dark:bg-slate-800/60 rounded-md mb-2"
      ></div>

      <!-- Action Buttons Skeleton -->
      <div
        class="flex flex-col sm:flex-row justify-center gap-4 w-full max-w-md mt-2"
      >
        <div
          class="h-10 w-full bg-surface-variant/40 dark:bg-slate-800/70 rounded-lg"
        ></div>
        <div
          class="h-10 w-full bg-surface-variant/40 dark:bg-slate-800/70 rounded-lg"
        ></div>
        <div
          class="h-10 w-full bg-surface-variant/40 dark:bg-slate-800/70 rounded-lg"
        ></div>
      </div>
    </section>

    <!-- About Us Skeleton -->
    <section class="px-margin-mobile mb-10 space-y-6">
      <div
        class="bg-surface-container-lowest dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-outline-variant/30 space-y-6"
      >
        <div>
          <div
            class="h-8 w-48 bg-surface-variant/50 dark:bg-slate-800 rounded-lg mb-4"
          ></div>
          <div class="space-y-3">
            <div
              class="h-4 w-full bg-surface-variant/40 dark:bg-slate-800/70 rounded"
            ></div>
            <div
              class="h-4 w-11/12 bg-surface-variant/40 dark:bg-slate-800/70 rounded"
            ></div>
            <div
              class="h-4 w-4/5 bg-surface-variant/40 dark:bg-slate-800/70 rounded"
            ></div>
          </div>
        </div>

        <!-- Mision/Vision Grid Skeleton -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div
            class="h-32 bg-surface-variant/30 dark:bg-slate-800/50 rounded-xl"
          ></div>
          <div
            class="h-32 bg-surface-variant/30 dark:bg-slate-800/50 rounded-xl"
          ></div>
        </div>
      </div>
    </section>

    <!-- Tabs and Content Skeleton -->
    <section
      class="px-margin-mobile mb-8 bg-surface-container-lowest dark:bg-slate-900 p-6 rounded-2xl border border-outline-variant/30 shadow-sm space-y-6"
    >
      <!-- Tabs Skeleton -->
      <div
        class="flex items-center gap-3 border-b border-outline-variant/20 pb-4 overflow-x-auto hide-scrollbar"
      >
        <div
          class="h-10 w-40 bg-surface-variant/50 dark:bg-slate-800 rounded-xl flex-shrink-0"
        ></div>
        <div
          class="h-10 w-36 bg-surface-variant/30 dark:bg-slate-800/60 rounded-xl flex-shrink-0"
        ></div>
        <div
          class="h-10 w-36 bg-surface-variant/30 dark:bg-slate-800/60 rounded-xl flex-shrink-0"
        ></div>
      </div>

      <!-- Job Cards Skeleton -->
      <div class="flex flex-col gap-4">
        <div
          v-for="i in 3"
          :key="i"
          class="h-44 bg-surface-variant/20 dark:bg-slate-800/30 rounded-xl border border-surface-variant/30 p-5 flex flex-col justify-between"
        >
          <div>
            <div
              class="h-6 w-3/4 bg-surface-variant/40 dark:bg-slate-800/60 rounded-md mb-4"
            ></div>
            <div class="flex gap-2">
              <div
                class="h-6 w-24 bg-surface-variant/30 dark:bg-slate-800/50 rounded-full"
              ></div>
              <div
                class="h-6 w-32 bg-surface-variant/30 dark:bg-slate-800/50 rounded-full"
              ></div>
            </div>
          </div>
          <div
            class="flex justify-between items-center border-t border-surface-variant/30 pt-4 mt-4"
          >
            <div
              class="h-5 w-28 bg-surface-variant/40 dark:bg-slate-800/60 rounded-md"
            ></div>
            <div
              class="h-9 w-32 bg-surface-variant/50 dark:bg-slate-800/80 rounded-lg"
            ></div>
          </div>
        </div>
      </div>
    </section>
  </main>

  <!-- Real Content -->
  <main
    v-else
    class="w-full max-w-container-max mx-auto md:px-gutter md:py-8 px-margin-mobile pb-16"
  >
    <!-- Header / Banner Section with Proportional Height -->
    <section
      class="relative bg-gradient-to-r from-indigo-700 via-indigo-600 to-indigo-800 h-40 md:h-52 rounded-2xl shadow-md mb-24 md:mb-28"
    >
      <!-- Subtle Decorative Overlay -->
      <div
        class="absolute inset-0 opacity-15 bg-[radial-gradient(circle_at_1px_1px,theme(colors.white)_1px,transparent_0)] bg-[size:20px_20px] rounded-2xl"
      ></div>

      <!-- Corporate Logo Overlap -->
      <div
        class="absolute -bottom-20 md:-bottom-24 left-1/2 -translate-x-1/2 w-48 h-48 md:w-60 md:h-60 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border-4 border-surface dark:border-slate-800 flex items-center justify-center p-3 md:p-3.5 z-20 group transition-transform duration-300 hover:scale-105"
      >
        <img
          alt="Logotipo Corporativo"
          class="w-full h-full object-contain rounded-2xl"
          :src="company.logo"
        />
      </div>
    </section>

    <!-- Central Identity Card -->
    <section
      class="px-margin-mobile flex flex-col items-center text-center mt-2 mb-8"
    >
      <h1
        class="font-headline-lg-mobile text-headline-lg-mobile text-on-surface mt-2 mb-2 flex items-center gap-2"
      >
        {{ company.name }}
      </h1>
      <div
        v-if="company.verified"
        class="flex items-center gap-1 bg-surface-container-high text-primary px-3 py-1 rounded-full mb-4"
      >
        <span class="material-symbols-outlined text-[16px] text-secondary"
          >verified</span
        >
        <span
          class="font-label-sm text-label-sm font-semibold text-on-surface-variant dark:text-slate-300"
          >Empresa Verificada</span
        >
      </div>
      <p
        class="font-body-md text-body-md text-on-surface-variant dark:text-slate-300 mb-6 max-w-lg"
      >
        {{ company.sector }}
      </p>
      <div
        class="flex flex-col sm:flex-row justify-center gap-4 w-full max-w-md"
      >
        <a
          class="flex items-center gap-2 font-label-md text-label-md text-primary bg-surface-container hover:bg-surface-container-high transition-colors px-4 py-2 rounded-lg w-full justify-center"
          :href="company.website"
          target="_blank"
          rel="noopener"
        >
          <span class="material-symbols-outlined text-[20px]">language</span>
          {{ company.websiteDisplay }}
        </a>
        <div
          class="flex items-center gap-2 font-label-md text-label-md text-on-surface-variant dark:text-slate-300 border border-outline-variant px-4 py-2 rounded-lg w-full justify-center"
        >
          <span class="material-symbols-outlined text-[20px]">location_on</span>
          {{ company.location }}
        </div>
        <button
          v-if="!isOwner"
          @click="showReportCompanyModal = true"
          class="flex items-center gap-2 font-label-md text-label-md text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/60 bg-rose-50/50 dark:bg-rose-950/30 hover:bg-rose-100 dark:hover:bg-rose-900/50 transition-colors px-4 py-2 rounded-lg w-full justify-center font-bold"
          title="Reportar esta empresa"
        >
          <span class="material-symbols-outlined text-[20px]">flag</span>
          Reportar empresa
        </button>
      </div>

      <!-- Owner Management Actions -->
      <div
        v-if="isOwner"
        class="mt-6 flex flex-col sm:flex-row gap-4 w-full max-w-md"
      >
        <NuxtLink
          to="/company/edit"
          class="flex-1 bg-primary hover:bg-tertiary-container text-white font-label-md text-label-md px-4 py-2.5 rounded-lg transition-colors active:scale-95 duration-100 flex items-center justify-center gap-2 shadow-sm"
        >
          <span class="material-symbols-outlined text-[20px]">edit</span>
          Editar Perfil
        </NuxtLink>
        <NuxtLink
          to="/create-vacancy"
          class="flex-1 border border-primary text-primary hover:bg-surface-container font-label-md text-label-md px-4 py-2.5 rounded-lg transition-colors active:scale-95 duration-100 flex items-center justify-center gap-2"
        >
          <span class="material-symbols-outlined text-[20px]">add</span>
          Nueva Vacante
        </NuxtLink>
      </div>
    </section>

    <!-- RF-34: About Us, Misión, Visión & Beneficios Section -->
    <section class="px-margin-mobile mb-10 space-y-6">
      <div
        class="bg-surface-container-lowest dark:bg-slate-900 dark:border-slate-800 p-6 rounded-2xl shadow-sm border border-outline-variant/50 space-y-6"
      >
        <div>
          <h2
            class="font-headline-sm text-headline-sm text-on-surface mb-3 flex items-center gap-2 border-b border-outline-variant/30 pb-2"
          >
            <span class="material-symbols-outlined text-primary">domain</span>
            Acerca de nosotros
          </h2>
          <p
            class="font-body-md text-body-md text-on-surface-variant dark:text-slate-300 leading-relaxed"
          >
            {{ company.about }}
          </p>
        </div>

        <!-- Misión y Visión Grid -->
        <div
          v-if="company.mision || company.vision"
          class="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <div
            v-if="company.mision"
            class="bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 p-4 rounded-xl space-y-2"
          >
            <h3
              class="font-bold text-xs text-indigo-700 dark:text-indigo-300 flex items-center gap-1.5 uppercase tracking-wider"
            >
              <span class="material-symbols-outlined text-base text-indigo-600"
                >flag</span
              >
              Misión Corporativa
            </h3>
            <p
              class="text-xs text-on-surface-variant dark:text-slate-300 leading-relaxed"
            >
              {{ company.mision }}
            </p>
          </div>

          <div
            v-if="company.vision"
            class="bg-purple-50/50 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900/50 p-4 rounded-xl space-y-2"
          >
            <h3
              class="font-bold text-xs text-purple-700 dark:text-purple-300 flex items-center gap-1.5 uppercase tracking-wider"
            >
              <span class="material-symbols-outlined text-base text-purple-600"
                >visibility</span
              >
              Visión Corporativa
            </h3>
            <p
              class="text-xs text-on-surface-variant dark:text-slate-300 leading-relaxed"
            >
              {{ company.vision }}
            </p>
          </div>
        </div>

        <!-- Beneficios y Cultura Laboral -->
        <div
          v-if="company.beneficios"
          class="bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/50 p-4 rounded-xl space-y-2"
        >
          <h3
            class="font-bold text-xs text-emerald-700 dark:text-emerald-300 flex items-center gap-1.5 uppercase tracking-wider"
          >
            <span class="material-symbols-outlined text-base text-emerald-600"
              >card_giftcard</span
            >
            Beneficios y Cultura Laboral
          </h3>
          <p
            class="text-xs text-on-surface-variant dark:text-slate-300 leading-relaxed whitespace-pre-line"
          >
            {{ company.beneficios }}
          </p>
        </div>
      </div>

      <!-- Documentos Corporativos Relevantes (ISO, NOMs, Certificados) -->
      <div
        v-if="company.documents && company.documents.length > 0"
        class="bg-surface-container-lowest dark:bg-slate-900 dark:border-slate-800 p-6 rounded-2xl shadow-sm border border-outline-variant/50 space-y-4"
      >
        <h2
          class="font-headline-sm text-headline-sm text-on-surface flex items-center gap-2 border-b border-outline-variant/30 pb-2"
        >
          <span
            class="material-symbols-outlined text-rose-600 dark:text-rose-400"
            >verified</span
          >
          Documentos Corporativos Relevantes
        </h2>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div
            v-for="doc in company.documents"
            :key="doc.id || doc.url"
            class="bg-surface-container-low/40 dark:bg-slate-800/40 border border-outline-variant/50 dark:border-slate-800 p-4 rounded-xl flex items-center justify-between gap-3 shadow-sm"
          >
            <div class="flex items-center gap-3 min-w-0">
              <div
                class="w-10 h-10 rounded-xl bg-indigo-600/10 text-indigo-600 flex items-center justify-center flex-shrink-0"
              >
                <span class="material-symbols-outlined text-xl"
                  >workspace_premium</span
                >
              </div>
              <div class="min-w-0">
                <span
                  class="text-[10px] font-bold uppercase tracking-wider bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 px-2 py-0.5 rounded-md border border-indigo-200 dark:border-indigo-800"
                >
                  {{ doc.tipo || "Certificación" }}
                </span>
                <p class="text-xs font-bold text-on-background truncate mt-1">
                  {{ doc.nombre || "Documento.pdf" }}
                </p>
              </div>
            </div>

            <div class="flex items-center gap-2">
              <button
                type="button"
                @click="previewCompanyDoc(doc)"
                class="px-2.5 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-indigo-500 text-indigo-600 dark:text-indigo-400 font-bold text-xs rounded-lg transition flex items-center gap-1 shadow-sm active:scale-95"
              >
                <span class="material-symbols-outlined text-sm"
                  >visibility</span
                >
                Ver
              </button>
              <a
                :href="doc.url"
                download
                target="_blank"
                class="px-2.5 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-emerald-500 text-emerald-600 dark:text-emerald-400 font-bold text-xs rounded-lg transition flex items-center gap-1 shadow-sm active:scale-95"
              >
                <span class="material-symbols-outlined text-sm">download</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Tabs Section: [Vacantes abiertas] / [Publicaciones] / [Guardados] -->
    <section
      class="px-margin-mobile mb-8 bg-surface-container-lowest dark:bg-slate-900 dark:border-slate-800 p-6 rounded-2xl border border-outline-variant/60 shadow-sm space-y-6"
    >
      <div
        class="flex items-center gap-3 border-b border-outline-variant/30 pb-4 overflow-x-auto"
      >
        <button
          type="button"
          @click="companyTab = 'vacancies'"
          :class="[
            companyTab === 'vacancies'
              ? 'bg-primary text-white shadow-sm font-bold'
              : 'bg-surface-container text-on-surface-variant dark:text-slate-300 hover:text-primary hover:bg-surface-container-high',
          ]"
          class="px-5 py-2.5 rounded-xl text-xs transition flex items-center gap-2 active:scale-95 flex-shrink-0"
        >
          <span class="material-symbols-outlined text-base">work_history</span>
          <span>Vacantes abiertas ({{ company.vacancies.length }})</span>
        </button>

        <button
          type="button"
          @click="companyTab = 'posts'"
          :class="[
            companyTab === 'posts'
              ? 'bg-primary text-white shadow-sm font-bold'
              : 'bg-surface-container text-on-surface-variant dark:text-slate-300 hover:text-primary hover:bg-surface-container-high',
          ]"
          class="px-5 py-2.5 rounded-xl text-xs transition flex items-center gap-2 active:scale-95 flex-shrink-0"
        >
          <span class="material-symbols-outlined text-base">article</span>
          <span>Publicaciones ({{ companyPosts.length }})</span>
        </button>

        <button
          type="button"
          @click="companyTab = 'bookmarks'"
          :class="[
            companyTab === 'bookmarks'
              ? 'bg-primary text-white shadow-sm font-bold'
              : 'bg-surface-container text-on-surface-variant dark:text-slate-300 hover:text-primary hover:bg-surface-container-high',
          ]"
          class="px-5 py-2.5 rounded-xl text-xs transition flex items-center gap-2 active:scale-95 flex-shrink-0"
        >
          <span class="material-symbols-outlined text-base">bookmark</span>
          <span>Guardados ({{ companyBookmarkedPosts.length }})</span>
        </button>
      </div>

      <!-- Tab 1: Vacantes Abiertas -->
      <div v-if="companyTab === 'vacancies'" class="space-y-4">
        <div
          v-if="company.vacancies.length === 0"
          class="py-8 text-center text-xs text-on-surface-variant dark:text-slate-300 italic"
        >
          No hay vacantes abiertas registradas actualmente.
        </div>
        <div v-else class="flex flex-col gap-4">
          <article
            v-for="job in company.vacancies"
            :key="job.id"
            class="bg-surface-container-lowest dark:bg-slate-900 dark:border-slate-800 p-5 rounded-xl shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.05)] border border-surface-variant hover:shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1)] transition-shadow duration-300"
          >
            <div class="flex justify-between items-start mb-3">
              <h3
                class="font-headline-sm text-headline-sm text-on-surface leading-tight"
              >
                {{ job.title }}
              </h3>
              <button
                class="text-outline hover:text-primary transition-colors active:scale-95 p-1 rounded-full hover:bg-surface-container"
                aria-label="Guardar vacante"
              >
                <span class="material-symbols-outlined">bookmark_border</span>
              </button>
            </div>
            <div class="flex flex-wrap gap-2 mb-4">
              <span
                class="inline-flex items-center gap-1 font-label-sm text-label-sm bg-surface-container text-on-surface-variant dark:text-slate-300 px-2.5 py-1 rounded-full"
              >
                <span class="material-symbols-outlined text-[14px]"
                  >home_work</span
                >
                {{ job.type }}
              </span>
              <span
                class="inline-flex items-center gap-1 font-label-sm text-label-sm bg-surface-container text-on-surface-variant dark:text-slate-300 px-2.5 py-1 rounded-full"
              >
                <span class="material-symbols-outlined text-[14px]"
                  >schedule</span
                >
                {{ job.schedule }}
              </span>
            </div>
            <div
              class="flex items-center justify-between mt-auto pt-4 border-t border-surface-variant"
            >
              <div
                class="font-label-md text-label-md text-secondary flex items-center gap-1"
              >
                <span class="material-symbols-outlined text-[18px]"
                  >payments</span
                >
                {{ job.salary }}
              </div>
              <NuxtLink
                to="/jobs"
                class="bg-primary hover:bg-tertiary-container text-white font-label-md text-label-md px-4 py-2 rounded-lg transition-colors active:scale-95 duration-100 flex items-center gap-2 shadow-sm"
              >
                Ver vacante
                <span class="material-symbols-outlined text-[18px]"
                  >arrow_forward</span
                >
              </NuxtLink>
            </div>
          </article>
        </div>
      </div>

      <!-- Tab 2: Publicaciones -->
      <div v-if="companyTab === 'posts'" class="space-y-4">
        <div
          v-if="loadingCompanyPosts"
          class="py-8 text-center text-xs text-on-surface-variant dark:text-slate-300 animate-pulse"
        >
          Cargando publicaciones...
        </div>
        <div
          v-else-if="companyPosts.length === 0"
          class="py-8 text-center text-xs text-on-surface-variant dark:text-slate-300 italic"
        >
          No hay publicaciones de la organización para mostrar.
        </div>
        <div v-else class="grid grid-cols-1 gap-4">
          <PostCard
            v-for="post in companyPosts"
            :key="post.uniqueId"
            :post="post"
            :current-user-id="authData?.user?.id || ''"
            @navigate="(id) => $router.push(`/posts/${id}`)"
            @like="toggleLike"
            @bookmark="toggleBookmark"
          />
        </div>
      </div>

      <!-- Tab 3: Guardados -->
      <div v-if="companyTab === 'bookmarks'" class="space-y-4">
        <div
          v-if="loadingCompanyPosts"
          class="py-8 text-center text-xs text-on-surface-variant dark:text-slate-300 animate-pulse"
        >
          Cargando publicaciones guardadas...
        </div>
        <div
          v-else-if="companyBookmarkedPosts.length === 0"
          class="py-8 text-center text-xs text-on-surface-variant dark:text-slate-300 italic"
        >
          No tienes publicaciones guardadas.
        </div>
        <div v-else class="grid grid-cols-1 gap-4">
          <PostCard
            v-for="post in companyBookmarkedPosts"
            :key="post.uniqueId"
            :post="post"
            :current-user-id="authData?.user?.id || ''"
            @navigate="(id) => $router.push(`/posts/${id}`)"
            @like="toggleLike"
            @bookmark="toggleBookmark"
          />
        </div>
      </div>
    </section>

    <!-- Standardized Corporate Document Viewer -->
    <AppDocumentViewer
      v-model="isPdfModalOpen"
      :url="activePreviewUrl"
      :title="activePreviewName"
    />

    <!-- Report Company Modal -->
    <ReportModal
      :is-open="showReportCompanyModal"
      target-type="EMPRESA"
      :target-id="companyId"
      :target-title="company.name"
      @close="showReportCompanyModal = false"
    />
  </main>
</template>

<script setup lang="ts">
const showReportCompanyModal = ref(false);

const route = useRoute();
const router = useRouter();
const companyId = route.params.id as string;
const { data } = useAuth();
const config = useRuntimeConfig();

const isOwner = computed(() => data.value?.user?.id === route.params.id);

// Fetch profile dynamically from deployed backend API
const { data: profileData, pending: profilePending } = useLazyAsyncData(
  `company-profile-${companyId}`,
  () =>
    $fetch(`${config.public.apiUrl}/profile/${companyId}`)
      .then((res) => (typeof res === "string" ? JSON.parse(res) : res))
      .catch(() => null),
);

// Fetch vacancies dynamically from deployed backend API
const { data: vacanciesData, pending: vacanciesPending } = useLazyAsyncData(
  `company-vacancies-${companyId}`,
  () =>
    $fetch(`${config.public.apiUrl}/profile/${companyId}/vacancies`)
      .then((res) => (typeof res === "string" ? JSON.parse(res) : res))
      .catch(() => ({ data: [] })),
);

// Fetch posts dynamically from deployed backend API
const { data: postsData, pending: postsPending } = useLazyAsyncData(
  `company-posts-${companyId}`,
  () =>
    $fetch(`${config.public.apiUrl}/profile/${companyId}/posts`)
      .then((res) => (typeof res === "string" ? JSON.parse(res) : res))
      .catch(() => ({ data: [] })),
);

// Fetch bookmarks dynamically from deployed backend API
const { data: bookmarksData, pending: bookmarksPending } = useLazyAsyncData(
  `company-bookmarks-${companyId}`,
  () =>
    $fetch(`${config.public.apiUrl}/profile/${companyId}/bookmarks`)
      .then((res) => (typeof res === "string" ? JSON.parse(res) : res))
      .catch(() => ({ data: [] })),
);

const loading = computed(() => profilePending.value || vacanciesPending.value);

const isPdfModalOpen = ref(false);
const activePreviewUrl = ref("");
const activePreviewName = ref("");

const previewCompanyDoc = (doc: any) => {
  activePreviewUrl.value = doc.url;
  activePreviewName.value = doc.nombre || doc.tipo;
  isPdfModalOpen.value = true;
};

const company = ref({
  id: companyId,
  name: "TechSolutions Inc.",
  logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuDSzjpaT0Ede7QLy3zl1zft4f4V9csQyhGIsAyNHyyg4lmk54ha7yMkfDw5hbVoBOME8PTGFax9iKrHHZjAmqwMRA4i1UpqhgebzJGIkwq1DS6PKK1G5jxCNSxxPjHi_ezhM-ik2qaFtqa9JYp6ruPrCozHQM4UvsZpk2HUAg07aFTdAk58De2NTtSjHaO49ddhrtHPFA-trQm7WZbFMHwS-NZ7jyJ7ZrGaZD9yxWogET6EbwJ_H8Tk0g",
  verified: true,
  sector: "Desarrollo de Software y Tecnología",
  website: "https://techsolutions.com",
  websiteDisplay: "techsolutions.com",
  location: "Ciudad de México, CDMX",
  about:
    "Somos una empresa líder en innovación tecnológica, dedicada a construir soluciones de software escalables que transforman industrias.",
  mision: "",
  vision: "",
  beneficios: "",
  documents: [] as any[],
  vacancies: [] as any[],
});

// If profile exists in DynamoDB, apply real details reactively
watch(
  [profileData, vacanciesData],
  () => {
    if (profileData.value) {
      const p = profileData.value as any;
      company.value.name =
        p.nombre || p.nombreComercial || p.name || "Sin Nombre";
      company.value.logo =
        p.fotoPerfil ||
        "https://lh3.googleusercontent.com/aida-public/AB6AXuDSzjpaT0Ede7QLy3zl1zft4f4V9csQyhGIsAyNHyyg4lmk54ha7yMkfDw5hbVoBOME8PTGFax9iKrHHZjAmqwMRA4i1UpqhgebzJGIkwq1DS6PKK1G5jxCNSxxPjHi_ezhM-ik2qaFtqa9JYp6ruPrCozHQM4UvsZpk2HUAg07aFTdAk58De2NTtSjHaO49ddhrtHPFA-trQm7WZbFMHwS-NZ7jyJ7ZrGaZD9yxWogET6EbwJ_H8Tk0g";
      company.value.sector = p.sector || "Sector no especificado";
      company.value.about =
        p.biografia || p.descripcion || "Sin descripción corporativa.";
      company.value.mision = p.mision || "";
      company.value.vision = p.vision || "";
      company.value.beneficios = p.beneficios || p.culturaLaboral || "";
      company.value.documents = Array.isArray(p.documentosCorporativos)
        ? p.documentosCorporativos
        : [];
      company.value.location =
        typeof p.ubicacion === "string"
          ? p.ubicacion
          : p.ubicacion?.name ||
            p.ubicacion?.city ||
            p.ubicacion?.pais ||
            "Ubicación no especificada";
      company.value.verified =
        p.organizacionVerificada !== undefined
          ? p.organizacionVerificada
          : false;
      company.value.website = p.enlacesWeb?.website || p.website || "";
      company.value.websiteDisplay =
        company.value.website
          .replace("https://", "")
          .replace("http://", "")
          .split("/")[0] || "Sitio web";

      // Map vacancies from new endpoint
      const rawJobs = (vacanciesData.value?.data || []) as any[];
      company.value.vacancies = rawJobs.map((j) => ({
        id: j.id || j.uniqueId,
        title: j.title || j.titulo || "Vacante",
        type: j.type || j.modalidad || "Presencial",
        schedule: j.schedule || "Tiempo Completo",
        salary:
          typeof j.salario === "number"
            ? `$${(j.salario / 1000).toFixed(0)}k MXN`
            : j.salario || "No especificado",
      }));
    }
  },
  { immediate: true },
);

const { data: authData } = useAuth();
const companyTab = ref<"vacancies" | "posts" | "bookmarks">("vacancies");
const loadingCompanyPosts = computed(
  () => postsPending.value || bookmarksPending.value,
);

const allCompanyPosts = ref<any[]>([]);
const allCompanyBookmarkedPosts = ref<any[]>([]);

watch(
  postsData,
  (val: any) => {
    if (val?.data) {
      allCompanyPosts.value = val.data;
    }
  },
  { immediate: true },
);

watch(
  bookmarksData,
  (val: any) => {
    if (val?.data) {
      allCompanyBookmarkedPosts.value = val.data;
    }
  },
  { immediate: true },
);

const companyPosts = computed(() => allCompanyPosts.value);
const companyBookmarkedPosts = computed(() => allCompanyBookmarkedPosts.value);

const toggleLike = async (postId: string) => {
  const currentUserId = (authData.value?.user as any)?.id;
  if (!currentUserId) return;

  try {
    const res = await $fetch<any>(`/api/posts/${postId}/like`, {
      method: "POST",
      body: { userId: currentUserId },
    });

    const targetPost = allCompanyPosts.value.find((p) => p.uniqueId === postId);
    const targetBookmark = allCompanyBookmarkedPosts.value.find(
      (p) => p.uniqueId === postId,
    );
    [targetPost, targetBookmark].forEach((target) => {
      if (target) {
        if (res?.likesList) {
          target.likesList = res.likesList;
        } else {
          if (!target.likesList) target.likesList = [];
          const idx = target.likesList.indexOf(currentUserId);
          if (idx !== -1) target.likesList.splice(idx, 1);
          else target.likesList.push(currentUserId);
        }
      }
    });
  } catch (e) {
    console.error("Error toggling like:", e);
  }
};

const toggleBookmark = async (postId: string) => {
  const currentUserId = (authData.value?.user as any)?.id;
  if (!currentUserId) return;

  try {
    const res = await $fetch<any>(`/api/posts/${postId}/bookmark`, {
      method: "POST",
      body: { userId: currentUserId },
    });

    const targetPost = allCompanyPosts.value.find((p) => p.uniqueId === postId);
    const targetBookmark = allCompanyBookmarkedPosts.value.find(
      (p) => p.uniqueId === postId,
    );
    [targetPost, targetBookmark].forEach((target) => {
      if (target) {
        if (res?.bookmarksList) {
          target.bookmarksList = res.bookmarksList;
        } else {
          if (!target.bookmarksList) target.bookmarksList = [];
          const idx = target.bookmarksList.indexOf(currentUserId);
          if (idx !== -1) target.bookmarksList.splice(idx, 1);
          else target.bookmarksList.push(currentUserId);
        }
      }
    });
  } catch (e) {
    console.error("Error toggling bookmark:", e);
  }
};

useSeoMeta({
  title: `${company.value.name} - Perfil de Empresa`,
  description: `Detalle y ofertas de ${company.value.name} en JobNet`,
});

const goBack = () => {
  router.back();
};
</script>
