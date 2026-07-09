<template>
  <div class="bg-background min-h-screen flex flex-col font-sans">
    <!-- Main Container -->
    <main class="flex-grow max-w-lg mx-auto w-full px-4 py-8" role="main">
      <!-- Feed Container -->
      <div class="flex flex-col gap-6">
        <!-- Feed Card -->
        <div
          v-for="item in feedItems"
          :key="item.uniqueId"
          class="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200"
        >
          <!-- HEADER: User/Company info -->
          <div class="flex items-center gap-3 p-4">
            <div
              class="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-secondary-container flex items-center justify-center text-white text-sm font-bold shadow-sm flex-shrink-0"
            >
              {{ item.author.charAt(0).toUpperCase() }}
            </div>
            <div class="flex-grow min-w-0">
              <div class="flex items-center gap-2">
                <h3 class="text-sm font-bold text-on-background truncate">
                  {{ item.author }}
                </h3>
                <span
                  v-if="item.type === 'vacancy'"
                  class="text-[9px] font-extrabold bg-primary/10 text-primary px-2 py-0.5 rounded-full uppercase tracking-wider flex-shrink-0"
                >
                  Vacante
                </span>
              </div>
              <p class="text-[11px] text-on-surface-variant/80 truncate">
                {{ item.role }} · {{ item.timeAgo }}
              </p>
            </div>
            <button
              class="text-on-surface-variant hover:text-primary transition p-1"
              aria-label="Opciones de publicación"
            >
              <span class="material-symbols-outlined text-[20px]"
                >more_horiz</span
              >
            </button>
          </div>

          <!-- POST IMAGE/MEDIA CONTAINER -->
          <div
            v-if="item.type === 'post' && item.media"
            class="aspect-video w-full bg-slate-100 relative overflow-hidden border-y border-outline-variant/20"
          >
            <img
              :src="item.media"
              :alt="item.title || 'Imagen del post'"
              class="w-full h-full object-cover"
            />
          </div>

          <!-- POST/VACANCY CONTENT BODY -->
          <div class="p-4 flex flex-col gap-3">
            <p class="text-sm text-on-surface-variant leading-relaxed">
              {{ item.content }}
            </p>

            <!-- VACANTE EMBEDDED CARD (if it's a vacancy) -->
            <div
              v-if="item.type === 'vacancy'"
              class="bg-[#F1F5F9] rounded-xl border border-outline-variant/40 p-4 flex flex-col gap-3"
            >
              <div>
                <h4 class="text-base font-bold text-on-background">
                  {{ item.jobTitle }}
                </h4>
                <p class="text-xs text-on-surface-variant font-semibold mt-0.5">
                  {{ item.author }}
                </p>
              </div>

              <div class="flex flex-wrap gap-2 text-xs">
                <span
                  class="bg-primary/10 text-primary px-2.5 py-0.5 rounded-full font-bold"
                >
                  {{ item.jobType || "Tiempo Completo" }}
                </span>
                <span
                  class="bg-secondary/15 text-secondary px-2.5 py-0.5 rounded-full font-bold"
                >
                  {{ item.salary || "$25,000 - $35,000 MXN" }}
                </span>
              </div>

              <div
                class="flex items-center justify-between border-t border-outline-variant/30 pt-3 text-xs text-on-surface-variant"
              >
                <span class="flex items-center gap-1">
                  <span class="material-symbols-outlined text-sm"
                    >location_on</span
                  >
                  Lat: {{ item.lat }}, Lng: {{ item.lng }}
                </span>
                <NuxtLink
                  :to="`/map?lat=${item.lat}&lng=${item.lng}`"
                  class="text-primary hover:underline font-bold flex items-center gap-0.5"
                  aria-label="Ver vacante en el mapa"
                >
                  <span class="material-symbols-outlined text-sm">map</span>
                  Ver en mapa
                </NuxtLink>
              </div>
            </div>
          </div>

          <!-- BOTTOM ACTIONS BAR -->
          <div
            class="px-4 py-2 flex items-center gap-1 border-t border-outline-variant/30"
          >
            <button
              @click="toggleLike(item)"
              class="flex items-center gap-1.5 text-on-surface-variant transition py-1.5 px-2.5 rounded-lg hover:bg-surface-container-low"
              :class="item.liked ? 'text-rose-600' : 'hover:text-rose-600'"
              :aria-label="item.liked ? 'Quitar like' : 'Dar like'"
            >
              <span
                class="material-symbols-outlined text-[20px]"
                :class="{ 'font-fill-1': item.liked }"
              >
                {{ item.liked ? "favorite" : "favorite_border" }}
              </span>
              <span class="text-xs font-semibold">{{ item.likes }}</span>
            </button>
            <button
              @click="focusCommentInput(item.uniqueId)"
              class="flex items-center gap-1.5 text-on-surface-variant hover:text-primary transition py-1.5 px-2.5 rounded-lg hover:bg-surface-container-low"
              aria-label="Escribir comentario"
            >
              <span class="material-symbols-outlined text-[20px]"
                >chat_bubble_outline</span
              >
              <span class="text-xs font-semibold">{{
                item.comments.length
              }}</span>
            </button>
            <button
              @click="sharePost(item)"
              class="flex items-center gap-1.5 text-on-surface-variant hover:text-secondary transition py-1.5 px-2.5 rounded-lg hover:bg-surface-container-low"
              aria-label="Compartir publicación"
            >
              <span class="material-symbols-outlined text-[20px]">share</span>
            </button>
            <button
              @click="toggleBookmark(item)"
              class="ml-auto text-on-surface-variant transition py-1.5 px-2.5 rounded-lg hover:bg-surface-container-low"
              :class="
                item.bookmarked ? 'text-amber-500' : 'hover:text-amber-500'
              "
              :aria-label="item.bookmarked ? 'Quitar marcador' : 'Guardar'"
            >
              <span
                class="material-symbols-outlined text-[20px]"
                :class="{ 'font-fill-1': item.bookmarked }"
              >
                {{ item.bookmarked ? "bookmark" : "bookmark_border" }}
              </span>
            </button>
          </div>

          <!-- LIKES AND RECENT COMMENTS -->
          <div
            class="px-4 pb-3 flex flex-col gap-1 text-xs border-t border-outline-variant/10 pt-2 bg-surface-container-lowest"
          >
            <p v-if="item.likes > 0" class="font-bold text-on-background">
              Les gusta a {{ item.likes }} personas
            </p>

            <div
              v-if="item.comments.length > 0"
              class="flex flex-col gap-1 mt-1"
            >
              <div v-for="c in item.comments" :key="c.id" class="text-xs">
                <span class="font-bold text-on-background mr-1.5"
                  >{{ c.user }}:</span
                >
                <span class="text-on-surface-variant">{{ c.text }}</span>
              </div>
            </div>
          </div>

          <!-- COMMENT INPUT -->
          <form
            @submit.prevent="addComment(item)"
            class="flex border-t border-outline-variant/30 px-3 py-2 bg-surface-container-lowest"
          >
            <input
              :id="`comment-input-${item.uniqueId}`"
              v-model="item.newCommentText"
              type="text"
              placeholder="Agrega un comentario..."
              class="flex-grow bg-transparent text-xs text-on-background outline-none py-1 placeholder-on-surface-variant/50"
              aria-label="Escribe tu comentario"
            />
            <button
              type="submit"
              :disabled="!item.newCommentText.trim()"
              class="text-primary disabled:text-primary/40 text-xs font-bold px-2 hover:underline transition"
            >
              Publicar
            </button>
          </form>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import { useJobsStore } from "../stores/jobs";

useSeoMeta({
  title: "JobNet - Feed de Empleos y Comunidad",
  description:
    "El feed profesional inteligente para explorar vacantes, conectar con empresas e interactuar con desarrolladores.",
});

const router = useRouter();
const jobsStore = useJobsStore();
const { data: session, status } = useAuth();

// Featured companies for story showcase bar
const featuredCompanies = [
  { name: "Francisco Tech" },
  { name: "Apex Solutions" },
  { name: "Global Devs" },
  { name: "Stitch Corp" },
  { name: "JobNet HQ" },
  { name: "Quantum Labs" },
  { name: "Cyber Agency" },
];

// Curated static posts to interleave with jobs
const staticPosts = [
  {
    type: "post",
    author: "Alejandro Silva",
    role: "Senior Frontend Engineer",
    timeAgo: "Hace 1 hora",
    content:
      "¡Increíble la nueva actualización de JobNet! La posibilidad de interactuar con publicaciones del sector y ver vacantes geolocalizadas todo en un feed unificado simplifica muchísimo la búsqueda de empleo.",
    media:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80",
    likes: 42,
    liked: false,
    bookmarked: false,
    comments: [
      {
        id: 1,
        user: "Sofia Dev",
        text: "Totalmente de acuerdo, la UI está genial.",
      },
      { id: 2, user: "Juan Tech", text: "¡La geolocalización es un golazo!" },
    ],
  },
  {
    type: "post",
    author: "Stitch Design Lab",
    role: "Equipo de Producto",
    timeAgo: "Hace 4 horas",
    content:
      "Diseñando los nuevos componentes visuales de JobNet basados en retroalimentación táctil y micro-animaciones interactivas. El modo claro se ve impecable y reduce el cansancio visual. ¿Qué opinan?",
    media:
      "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=600&auto=format&fit=crop&q=80",
    likes: 128,
    liked: false,
    bookmarked: false,
    comments: [
      {
        id: 1,
        user: "Carlos Gomez",
        text: "Excelente paleta de colores corporativos.",
      },
    ],
  },
];

// Unified reactive feed items
const feedItems = ref<any[]>([]);

// Mix jobs and posts together
const buildFeed = () => {
  const items: any[] = [];

  // 1. Add static posts
  staticPosts.forEach((post, i) => {
    items.push({
      ...post,
      uniqueId: `post-${i}`,
      newCommentText: "",
    });
  });

  // 2. Interleave vacancies loaded from backend
  if (jobsStore.jobs && jobsStore.jobs.length > 0) {
    jobsStore.jobs.forEach((job, idx) => {
      items.push({
        uniqueId: `job-${job.id || idx}`,
        type: "vacancy",
        author: job.company || "Empresa Destacada",
        role: "Oferta de Empleo",
        timeAgo: "Publicado recientemente",
        content: `Estamos buscando un/a profesional para el puesto de ${job.title}. Te invitamos a postularte y unirte a nuestro equipo de trabajo en constante crecimiento.`,
        jobTitle: job.title,
        jobType: "Tiempo Completo",
        salary: "$35,000 - $45,000 MXN",
        lat: job.lat || 19.4326,
        lng: job.lng || -99.1332,
        likes: 18,
        liked: false,
        bookmarked: false,
        comments: [],
        newCommentText: "",
      });
    });
  }

  // 3. Shuffle or organize: alternate posts and vacancies
  const sorted: any[] = [];
  const postsOnly = items.filter((x) => x.type === "post");
  const jobsOnly = items.filter((x) => x.type === "vacancy");
  const maxLen = Math.max(postsOnly.length, jobsOnly.length);

  for (let i = 0; i < maxLen; i++) {
    if (i < postsOnly.length) sorted.push(postsOnly[i]);
    if (i < jobsOnly.length) sorted.push(jobsOnly[i]);
  }

  feedItems.value = sorted;
};

// Toggle likes
const toggleLike = (item: any) => {
  item.liked = !item.liked;
  if (item.liked) {
    item.likes++;
  } else {
    item.likes--;
  }
};

// Toggle bookmarks
const toggleBookmark = (item: any) => {
  item.bookmarked = !item.bookmarked;
};

// Focus comment input
const focusCommentInput = (id: string) => {
  const el = document.getElementById(`comment-input-${id}`);
  if (el) el.focus();
};

// Add comment
const addComment = (item: any) => {
  if (!item.newCommentText.trim()) return;
  item.comments.push({
    id: Date.now(),
    user: "Tú",
    text: item.newCommentText.trim(),
  });
  item.newCommentText = "";
};

// Share post
const sharePost = (item: any) => {
  alert(
    `Enlace copiado al portapapeles: http://localhost:3000/feed/${item.uniqueId}`,
  );
};

onMounted(async () => {
  // Fetch actual backend jobs
  await jobsStore.fetchJobs();
  buildFeed();

  // Redirect if logged in
  if (status.value === "authenticated") {
    const tipo = (session.value?.user as any)?.tipoUsuario;
    if (tipo?.toUpperCase() === "EMPRESA") {
      router.push("/dashboard");
    } else if (
      tipo?.toUpperCase() === "CANDIDATO" ||
      tipo?.toUpperCase() === "CANDIDATE"
    ) {
      router.push("/feed");
    }
  }
});

// Rebuild feed if jobs store changes
watch(
  () => jobsStore.jobs,
  () => {
    buildFeed();
  },
  { deep: true },
);
</script>

<style scoped>
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.font-fill-1 {
  font-variation-settings: "FILL" 1;
}
</style>
