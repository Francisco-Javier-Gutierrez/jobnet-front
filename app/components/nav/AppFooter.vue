<template>
  <nav
    class="md:hidden fixed bottom-0 left-0 right-0 bg-surface/95 dark:bg-slate-900/95 backdrop-blur-lg border-t border-outline-variant/60 dark:border-slate-800 z-50 transition-transform duration-300 ease-in-out transition-colors duration-200 select-none"
    :class="isVisible ? 'translate-y-0' : 'translate-y-full'"
    aria-label="Navegación inferior móvil"
  >
    <div
      class="flex items-center justify-around h-16 px-2 max-w-lg mx-auto relative"
    >
      <template v-for="(item, index) in footerItems" :key="item.to">
        <!-- Central Floating Plus Action Button -->
        <a
          v-if="index === 2"
          href="#"
          @click.prevent="handleFooterClick(item)"
          class="flex items-center justify-center -mt-6 w-14 h-14 rounded-full bg-primary dark:bg-indigo-600 text-white shadow-lg shadow-primary/30 hover:scale-105 active:scale-95 transition-transform duration-200 z-10"
          :aria-label="item.label"
        >
          <span class="material-symbols-outlined text-3xl font-bold">add</span>
        </a>

        <!-- Standard Bottom Bar Icon Link -->
        <a
          v-else
          href="#"
          @click.prevent="handleFooterClick(item)"
          class="flex flex-col items-center justify-center flex-1 h-full py-1 transition-all duration-200 relative group"
          :class="[
            isActive(item.to)
              ? 'text-primary dark:text-indigo-400 font-bold'
              : 'text-on-surface-variant dark:text-slate-400 hover:text-on-surface',
          ]"
        >
          <!-- Active Top Indicator Pill -->
          <span
            v-if="isActive(item.to)"
            class="absolute top-0 w-8 h-1 bg-primary dark:bg-indigo-400 rounded-full animate-fade-in shadow-sm"
          ></span>

          <div
            :class="[
              isActive(item.to)
                ? 'bg-primary/10 dark:bg-indigo-950/60 px-3 py-1 rounded-full'
                : 'px-2 py-1',
            ]"
            class="flex flex-col items-center justify-center transition-all duration-200"
          >
            <span
              class="material-symbols-outlined text-[22px] transition-transform duration-150"
              :class="{ 'font-fill-1 scale-105': isActive(item.to) }"
              >{{ item.icon }}</span
            >
            <span
              class="text-[10px] tracking-tight leading-tight mt-0.5 truncate max-w-[64px] text-center"
            >
              {{ item.shortLabel || item.label }}
            </span>
          </div>
        </a>
      </template>
    </div>
  </nav>
</template>

<script setup lang="ts">
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

const userRole = computed<string>(() => {
  if (status.value !== "authenticated") return "guest";
  const user = data.value?.user as any;
  const tipo = (user?.tipoUsuario || user?.role || "").toUpperCase();
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
          icon: "add_circle",
          label: "Crear Nuevo",
          shortLabel: "Crear",
          protected: true,
        },
        {
          to: "/mod/appeals",
          icon: "gavel",
          label: "Canales Apelaci├│n",
          shortLabel: "Apelaciones",
          protected: true,
        },
        {
          to: "/notifications",
          icon: "notifications",
          label: "Notificaciones",
          shortLabel: "Notif.",
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
          icon: "add_circle",
          label: "Crear Nuevo",
          shortLabel: "Crear",
          protected: true,
        },
        {
          to: "/mod/verifications",
          icon: "verified",
          label: "Verificaciones",
          shortLabel: "Verif.",
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
          icon: "add_circle",
          label: "Crear Nuevo",
          shortLabel: "Crear",
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
          icon: "add_circle",
          label: "Crear Publicación",
          shortLabel: "Crear",
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
          shortLabel: "Notif.",
          protected: true,
        },
      ];
  }
});
</script>

<style scoped>
.font-fill-1 {
  font-variation-settings:
    "FILL" 1,
    "wght" 600,
    "GRAD" 0,
    "opsz" 24;
}
</style>
