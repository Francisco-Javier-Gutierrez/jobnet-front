<template>
  <nav
    v-if="!isJobDetailPage"
    class="md:hidden fixed bottom-0 left-0 right-0 bg-surface/95 dark:bg-slate-900/95 backdrop-blur-xl border-t border-outline-variant/60 dark:border-slate-800 z-50 transition-transform duration-300 ease-in-out transition-colors duration-200 select-none pb-[env(safe-area-inset-bottom,0px)]"
    :class="isVisible ? 'translate-y-0' : 'translate-y-full'"
    aria-label="Navegación inferior móvil"
  >
    <div class="flex items-center justify-between h-16 max-w-md mx-auto px-2 relative">
      <template v-for="(item, index) in footerItems" :key="item.to">
        <!-- Central Primary Quick Action Button (Index 2) -->
        <div v-if="index === 2" class="flex-1 flex items-center justify-center -mt-5">
          <button
            type="button"
            @click.prevent="handleFooterClick(item)"
            class="w-12 h-12 rounded-full bg-gradient-to-tr from-primary to-indigo-600 text-white shadow-lg shadow-primary/30 ring-4 ring-surface dark:ring-slate-900 flex items-center justify-center hover:scale-105 active:scale-95 transition-transform duration-150 cursor-pointer"
            :aria-label="item.label"
            :title="item.label"
          >
            <span class="material-symbols-outlined text-[26px] font-bold">add</span>
          </button>
        </div>

        <!-- Standard Bottom Bar Icon Link -->
        <a
          v-else
          href="#"
          @click.prevent="handleFooterClick(item)"
          class="flex flex-col items-center justify-center flex-1 h-full py-1 transition-all duration-150 relative group cursor-pointer"
          :class="[
            isActive(item.to)
              ? 'text-primary dark:text-indigo-400 font-bold'
              : 'text-on-surface-variant dark:text-slate-400 hover:text-on-surface',
          ]"
        >
          <!-- Active Dot Indicator -->
          <span
            v-if="isActive(item.to)"
            class="absolute top-1.5 w-1 h-1 bg-primary dark:bg-indigo-400 rounded-full animate-fade-in"
          ></span>

          <div class="flex flex-col items-center justify-center gap-0.5">
            <span
              class="material-symbols-outlined text-[22px] transition-transform duration-150"
              :class="{ 'font-fill-1 scale-105 text-primary dark:text-indigo-400': isActive(item.to) }"
            >
              {{ item.icon }}
            </span>
            <span class="text-[10px] tracking-tight leading-none text-center truncate max-w-[60px]">
              {{ item.shortLabel || item.label }}
            </span>
          </div>
        </a>
      </template>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuth } from "#imports";
import { useProtectedAction } from "~/composables/useProtectedAction";

interface FooterItem {
  to: string;
  icon: string;
  label: string;
  shortLabel?: string;
  protected?: boolean;
}

const props = defineProps<{
  isVisible?: boolean;
}>();

const route = useRoute();
const router = useRouter();
const { status, data } = useAuth();
const { openProtectedModal } = useProtectedAction();

const isJobDetailPage = computed(() => /^\/jobs\/[^\/]+$/.test(route.path));

const userRole = computed<string>(() => {
  if (status.value !== "authenticated") return "guest";
  const user = data.value?.user;
  const tipo = (user?.tipoUsuario || "").toUpperCase();
  if (tipo === "ORGANIZACION" || tipo === "EMPRESA") return "organization";
  if (tipo === "ADMIN") return "admin";
  if (tipo === "MODERATOR" || tipo === "MODERADOR") return "moderator";
  return "candidate";
});

const isActive = (path: string): boolean => {
  if (path === "/") return route.path === "/";
  return route.path.startsWith(path);
};

const handleFooterClick = (item: FooterItem) => {
  if (status.value !== "authenticated" && item.protected) {
    openProtectedModal();
    return;
  }
  router.push(item.to);
};

const footerItems = computed<FooterItem[]>(() => {
  switch (userRole.value) {
    case "admin":
      return [
        {
          to: "/",
          icon: "home",
          label: "Inicio",
          shortLabel: "Inicio",
          protected: false,
        },
        {
          to: "/admin/organizations",
          icon: "account_balance",
          label: "Organizaciones",
          shortLabel: "Orgs",
          protected: true,
        },
        {
          to: "/create",
          icon: "add",
          label: "Crear Nuevo",
          shortLabel: "Crear",
          protected: true,
        },
        {
          to: "/mod/appeals",
          icon: "gavel",
          label: "Canales Apelación",
          shortLabel: "Apelaciones",
          protected: true,
        },
        {
          to: "/notifications",
          icon: "notifications",
          label: "Notificaciones",
          shortLabel: "Notif",
          protected: true,
        },
      ];

    case "moderator":
      return [
        {
          to: "/",
          icon: "home",
          label: "Inicio",
          shortLabel: "Inicio",
          protected: false,
        },
        {
          to: "/mod/incidents",
          icon: "report_problem",
          label: "Incidencias",
          shortLabel: "Incidencias",
          protected: true,
        },
        {
          to: "/create",
          icon: "add",
          label: "Crear Nuevo",
          shortLabel: "Crear",
          protected: true,
        },
        {
          to: "/mod/verifications",
          icon: "verified",
          label: "Verificaciones",
          shortLabel: "Verif",
          protected: true,
        },
        {
          to: "/mod/support",
          icon: "contact_support",
          label: "Soporte Directo",
          shortLabel: "Soporte",
          protected: true,
        },
      ];

    case "organization":
      return [
        {
          to: "/",
          icon: "home",
          label: "Inicio",
          shortLabel: "Inicio",
          protected: false,
        },
        {
          to: "/my-vacancies",
          icon: "work",
          label: "Mis Vacantes",
          shortLabel: "Vacantes",
          protected: true,
        },
        {
          to: "/create",
          icon: "add",
          label: "Publicar Oferta",
          shortLabel: "Publicar",
          protected: true,
        },
        {
          to: "/applicants",
          icon: "dashboard_customize",
          label: "Tablero ATS",
          shortLabel: "ATS",
          protected: true,
        },
        {
          to: "/messages",
          icon: "forum",
          label: "Mensajes",
          shortLabel: "Mensajes",
          protected: true,
        },
      ];

    default: // CANDIDATO or GUEST
      return [
        {
          to: "/",
          icon: "home",
          label: "Inicio",
          shortLabel: "Inicio",
          protected: false,
        },
        {
          to: "/vacancies",
          icon: "work",
          label: "Explorar Vacantes",
          shortLabel: "Vacantes",
          protected: false,
        },
        {
          to: "/create",
          icon: "add",
          label: "Crear Publicación",
          shortLabel: "Publicar",
          protected: true,
        },
        {
          to: "/messages",
          icon: "forum",
          label: "Mensajes",
          shortLabel: "Mensajes",
          protected: true,
        },
        {
          to: "/notifications",
          icon: "notifications",
          label: "Notificaciones",
          shortLabel: "Notif",
          protected: true,
        },
      ];
  }
});
</script>

<style scoped>
.font-fill-1 {
  font-variation-settings: "FILL" 1;
}
</style>
