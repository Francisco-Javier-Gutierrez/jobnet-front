<template>
  <div class="max-w-xl mx-auto px-4 py-8 w-full bg-background min-h-screen">
    <!-- Header -->
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-on-background">Notificaciones</h1>
        <p class="text-xs text-on-surface-variant">
          Mantente al tanto de tus ofertas, comentarios y comunidad.
        </p>
      </div>
      <button
        v-if="notifications.length > 0 && !loading"
        @click="markAllAsRead"
        class="text-xs text-primary font-bold hover:underline"
      >
        Marcar todas como leídas
      </button>
    </div>

    <!-- Skeletons loading state -->
    <div v-if="loading" class="space-y-4 animate-pulse">
      <div
        v-for="i in 4"
        :key="i"
        class="p-4 bg-surface-container-lowest border border-outline-variant/60 rounded-2xl flex gap-3 h-20 items-center"
      >
        <div class="w-10 h-10 rounded-full bg-outline/20"></div>
        <div class="flex-grow space-y-2">
          <div class="h-3.5 w-2/3 bg-outline/20 rounded"></div>
          <div class="h-2.5 w-1/3 bg-outline/10 rounded"></div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-else-if="notifications.length === 0"
      class="flex flex-col items-center justify-center py-20 text-center bg-surface-container-lowest border border-outline-variant/60 rounded-2xl shadow-sm px-6"
    >
      <div
        class="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4"
      >
        <span class="material-symbols-outlined text-[32px]"
          >notifications_off</span
        >
      </div>
      <h2 class="text-base font-bold text-on-background mb-1">
        Sin notificaciones
      </h2>
      <p class="text-xs text-on-surface-variant max-w-xs">
        Te avisaremos cuando recibas ofertas, respuestas a tus preguntas o
        interacciones con tus publicaciones.
      </p>
    </div>

    <!-- List of Notifications -->
    <div v-else class="space-y-3">
      <div
        v-for="notif in notifications"
        :key="notif.id"
        :class="[
          'p-4 rounded-2xl border transition duration-200 flex gap-3 items-start',
          notif.unread
            ? 'bg-primary/5 border-primary/20 shadow-sm'
            : 'bg-surface-container-lowest border-outline-variant/40',
        ]"
      >
        <!-- Icon / Avatar -->
        <div
          class="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
          :class="getIconBgClass(notif.type)"
        >
          <span
            class="material-symbols-outlined text-lg"
            :class="getIconTextClass(notif.type)"
          >
            {{ getIconName(notif.type) }}
          </span>
        </div>

        <!-- Content -->
        <div class="flex-grow min-w-0 text-left">
          <div class="flex items-start justify-between gap-2">
            <h4 class="text-xs font-bold text-on-background">
              {{ notif.title }}
            </h4>
            <span
              class="text-[9px] text-on-surface-variant font-mono flex-shrink-0"
              >{{ notif.time }}</span
            >
          </div>
          <p class="text-xs text-on-surface-variant mt-0.5 leading-relaxed">
            {{ notif.message }}
          </p>
          <div v-if="notif.unread" class="mt-2">
            <button
              @click="markAsRead(notif.id)"
              class="text-[10px] text-primary font-extrabold hover:underline"
            >
              Marcar como leída
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";

useSeoMeta({
  title: "Notificaciones - JobNet",
  description:
    "Bandeja de notificaciones y alertas profesionales de la comunidad de JobNet",
});

interface NotificationItem {
  id: string;
  type: "like" | "comment" | "application" | "system";
  title: string;
  message: string;
  time: string;
  unread: boolean;
}

const loading = ref(true);
const notifications = ref<NotificationItem[]>([]);

const getIconName = (type: NotificationItem["type"]) => {
  switch (type) {
    case "like":
      return "favorite";
    case "comment":
      return "forum";
    case "application":
      return "work";
    default:
      return "info";
  }
};

const getIconBgClass = (type: NotificationItem["type"]) => {
  switch (type) {
    case "like":
      return "bg-rose-50 border border-rose-100";
    case "comment":
      return "bg-emerald-50 border border-emerald-100";
    case "application":
      return "bg-blue-50 border border-blue-100";
    default:
      return "bg-slate-50 border border-slate-100";
  }
};

const getIconTextClass = (type: NotificationItem["type"]) => {
  switch (type) {
    case "like":
      return "text-rose-600";
    case "comment":
      return "text-emerald-600";
    case "application":
      return "text-blue-600";
    default:
      return "text-slate-600";
  }
};

const loadNotifications = () => {
  if (process.client) {
    const saved = localStorage.getItem("jobnet-notifications");
    if (saved) {
      notifications.value = JSON.parse(saved);
    } else {
      // Seed default premium notifications
      notifications.value = [
        {
          id: "notif-1",
          type: "application",
          title: "Tu CV fue visualizado",
          message:
            "Un reclutador de Apex Solutions visualizó tu postulación para la vacante de Senior Frontend Engineer.",
          time: "Hace 10m",
          unread: true,
        },
        {
          id: "notif-2",
          type: "comment",
          title: "Respuesta en tu pregunta",
          message:
            "Tech Solutions Team respondió a tu comentario sobre la vacante: 'Hola Sofía, sí, ofrecemos apoyo...'",
          time: "Hace 2h",
          unread: true,
        },
        {
          id: "notif-3",
          type: "like",
          title: "Interacción con tu publicación",
          message:
            "A Alejandro Silva y 4 personas más les gustó tu publicación del muro de comunidad.",
          time: "Ayer",
          unread: false,
        },
        {
          id: "notif-4",
          type: "system",
          title: "¡Bienvenido a JobNet!",
          message:
            "Configura tu perfil profesional para recibir sugerencias de vacantes acordes a tus habilidades.",
          time: "Hace 3d",
          unread: false,
        },
      ];
      saveNotifications();
    }
  }
};

const saveNotifications = () => {
  if (process.client) {
    localStorage.setItem(
      "jobnet-notifications",
      JSON.stringify(notifications.value),
    );
  }
};

const markAsRead = (id: string) => {
  const notif = notifications.value.find((n) => n.id === id);
  if (notif) {
    notif.unread = false;
    saveNotifications();
  }
};

const markAllAsRead = () => {
  notifications.value.forEach((n) => {
    n.unread = false;
  });
  saveNotifications();
};

onMounted(() => {
  loadNotifications();
  setTimeout(() => {
    loading.value = false;
  }, 400);
});
</script>
