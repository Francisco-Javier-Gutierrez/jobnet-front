<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-[99900] flex items-start justify-center pt-14 sm:pt-20 px-4 bg-slate-950/60 backdrop-blur-md"
    @click.self="closeCommandPalette"
    data-modal-active="true"
  >
    <div
      class="w-full max-w-2xl bg-surface-container-lowest dark:bg-slate-900 border border-outline-variant/60 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh] transition-all duration-200"
      role="dialog"
      aria-modal="true"
      aria-label="Paleta de Comandos"
    >
      <!-- Top Search Header -->
      <div
        class="p-3.5 border-b border-outline-variant/50 dark:border-slate-800 flex items-center gap-3 bg-surface-container-low/40 dark:bg-slate-900/60"
      >
        <span
          class="material-symbols-outlined text-primary text-2xl flex-shrink-0 animate-pulse"
        >
          search
        </span>
        <input
          ref="searchInputRef"
          v-model="searchQuery"
          type="text"
          :placeholder="searchPlaceholder"
          class="flex-1 bg-transparent text-sm sm:text-base text-on-surface dark:text-slate-100 placeholder-on-surface-variant/60 dark:placeholder-slate-500 outline-none font-medium"
          @keydown.down.prevent="navigateDown"
          @keydown.up.prevent="navigateUp"
          @keydown.enter.prevent="executeActiveItem"
          @keydown.esc.prevent="closeCommandPalette"
        />
        <div class="flex items-center gap-1.5 flex-shrink-0">
          <button
            v-if="searchQuery"
            type="button"
            @click="searchQuery = ''"
            class="text-on-surface-variant dark:text-slate-400 hover:text-on-surface p-1 rounded-md transition"
            title="Limpiar búsqueda"
          >
            <span class="material-symbols-outlined text-base">close</span>
          </button>
          <kbd
            class="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono font-bold bg-surface-container dark:bg-slate-800 border border-outline-variant/60 dark:border-slate-700 text-on-surface-variant dark:text-slate-400 rounded-md shadow-2xs"
          >
            ESC
          </kbd>
        </div>
      </div>

      <!-- Results Body -->
      <div
        ref="resultsContainerRef"
        class="flex-1 overflow-y-auto p-2 space-y-4 min-h-[160px] max-h-[55vh]"
      >
        <!-- Empty Results -->
        <div
          v-if="filteredItems.length === 0"
          class="py-12 text-center space-y-2"
        >
          <span
            class="material-symbols-outlined text-4xl text-on-surface-variant/60 dark:text-slate-500"
            >search_off</span
          >
          <p class="text-sm font-bold text-on-surface dark:text-slate-200">
            No se encontraron resultados
          </p>
          <p
            class="text-xs text-on-surface-variant dark:text-slate-400 max-w-sm mx-auto"
          >
            {{ emptyStateTip }}
          </p>
        </div>

        <!-- Grouped List -->
        <div v-for="group in groupedItems" :key="group.title" class="space-y-1">
          <div
            class="px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-on-surface-variant/70 dark:text-slate-400 flex items-center justify-between"
          >
            <span>{{ group.title }}</span>
            <span class="text-[10px] font-mono opacity-80">{{
              group.items.length
            }}</span>
          </div>

          <button
            v-for="item in group.items"
            :key="item.id"
            type="button"
            :data-item-index="item.flatIndex"
            @click="executeItem(item)"
            @mouseenter="activeIndex = item.flatIndex"
            class="w-full text-left px-3 py-2.5 rounded-xl transition flex items-center justify-between gap-3 text-xs cursor-pointer group"
            :class="[
              activeIndex === item.flatIndex
                ? 'bg-primary/10 text-primary dark:bg-indigo-950/70 dark:text-indigo-300 font-semibold shadow-xs ring-1 ring-primary/20'
                : 'text-on-surface dark:text-slate-200 hover:bg-surface-container/60 dark:hover:bg-slate-800/60',
            ]"
          >
            <div class="flex items-center gap-3 min-w-0">
              <span
                class="material-symbols-outlined text-[20px] flex-shrink-0 transition-transform group-hover:scale-110"
                :class="
                  activeIndex === item.flatIndex
                    ? 'text-primary dark:text-indigo-400'
                    : 'text-on-surface-variant dark:text-slate-400'
                "
              >
                {{ item.icon }}
              </span>
              <div class="min-w-0">
                <p class="truncate font-semibold">{{ item.title }}</p>
                <p
                  v-if="item.subtitle"
                  class="text-[10px] text-on-surface-variant dark:text-slate-400 truncate font-normal"
                >
                  {{ item.subtitle }}
                </p>
              </div>
            </div>

            <div class="flex items-center gap-2 flex-shrink-0">
              <span
                v-if="item.badge"
                class="text-[9px] font-bold px-2 py-0.5 rounded-full border transition"
                :class="getBadgeClasses(item.badgeVariant)"
              >
                {{ item.badge }}
              </span>
              <span
                v-if="activeIndex === item.flatIndex"
                class="material-symbols-outlined text-[16px] text-primary dark:text-indigo-400 opacity-90"
              >
                keyboard_return
              </span>
            </div>
          </button>
        </div>
      </div>

      <!-- Bottom Keyboard Navigation Tips -->
      <div
        class="p-2.5 px-4 bg-surface-container-low/50 dark:bg-slate-900/80 border-t border-outline-variant/40 dark:border-slate-800 flex items-center justify-between text-[11px] text-on-surface-variant dark:text-slate-400"
      >
        <div class="flex items-center gap-4 flex-wrap">
          <span class="flex items-center gap-1">
            <kbd
              class="px-1.5 py-0.5 font-mono text-[9px] bg-surface dark:bg-slate-800 border border-outline-variant/60 dark:border-slate-700 rounded shadow-2xs"
              >↑</kbd
            >
            <kbd
              class="px-1.5 py-0.5 font-mono text-[9px] bg-surface dark:bg-slate-800 border border-outline-variant/60 dark:border-slate-700 rounded shadow-2xs"
              >↓</kbd
            >
            Navegar
          </span>
          <span class="flex items-center gap-1">
            <kbd
              class="px-1.5 py-0.5 font-mono text-[9px] bg-surface dark:bg-slate-800 border border-outline-variant/60 dark:border-slate-700 rounded shadow-2xs"
              >↵</kbd
            >
            Ejecutar
          </span>
          <span class="flex items-center gap-1">
            <kbd
              class="px-1.5 py-0.5 font-mono text-[9px] bg-surface dark:bg-slate-800 border border-outline-variant/60 dark:border-slate-700 rounded shadow-2xs"
              >Esc</kbd
            >
            Cerrar
          </span>
        </div>
        <div
          class="hidden sm:flex items-center gap-1 text-[10px] font-semibold text-primary dark:text-indigo-400"
        >
          <span>{{ roleLabel }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { useCommandPalette } from "~/composables/useCommandPalette";
import { useTheme } from "~/composables/useTheme";
import { useJobsStore } from "~/stores/jobs";

interface CommandItem {
  id: string;
  title: string;
  subtitle?: string;
  icon: string;
  group: "Acciones Rápidas" | "Navegación" | "Vacantes";
  badge?: string;
  badgeVariant?: "primary" | "secondary" | "accent" | "neutral";
  keywords?: string[];
  action: () => void;
  flatIndex?: number;
}

const { isOpen, closeCommandPalette } = useCommandPalette();
const router = useRouter();
const { toggleTheme, isDark } = useTheme();
const { status, data: session, signOut } = useAuth();
const jobsStore = useJobsStore();

const searchQuery = ref("");
const activeIndex = ref(0);
const searchInputRef = ref<HTMLInputElement | null>(null);
const resultsContainerRef = ref<HTMLElement | null>(null);

const userRole = computed<
  "guest" | "candidate" | "organization" | "admin" | "moderator"
>(() => {
  if (status.value !== "authenticated") return "guest";
  const user = session.value?.user as any;
  const tipo = (user?.tipoUsuario || user?.role || "").toUpperCase();
  if (tipo === "ORGANIZACION") return "organization";
  if (tipo === "ADMIN") return "admin";
  if (tipo === "MODERATOR" || tipo === "MODERADOR") return "moderator";
  return "candidate";
});

const roleLabel = computed(() => {
  switch (userRole.value) {
    case "organization":
      return "Organización";
    case "admin":
      return "Administrador";
    case "moderator":
      return "Moderación";
    case "candidate":
      return "Candidato";
    default:
      return "Visitante";
  }
});

const searchPlaceholder = computed(() => {
  switch (userRole.value) {
    case "organization":
      return "Escribe un comando, publicar vacante, ATS, perfil o ajustes...";
    case "admin":
      return "Escribe un comando, analítica, catálogo, auditoría u organizaciones...";
    case "moderator":
      return "Escribe un comando, incidencias, apelaciones o verificaciones...";
    default:
      return "Escribe un comando o busca vacantes, plantillas y páginas...";
  }
});

const emptyStateTip = computed(() => {
  switch (userRole.value) {
    case "organization":
      return "Prueba buscando con términos como 'publicar', 'ats', 'vacantes', 'verificación' o 'tema'.";
    case "admin":
    case "moderator":
      return "Prueba buscando con términos como 'analítica', 'incidencias', 'organizaciones' o 'tema'.";
    default:
      return "Prueba buscando con términos como 'vacantes', 'cv', 'remoto', 'perfil' o 'tema'.";
  }
});

const userName = computed(() => {
  return session.value?.user?.name || session.value?.user?.email || "Usuario";
});

// Standard static commands and navigation links tailored strictly by role
const staticItems = computed<CommandItem[]>(() => {
  const role = userRole.value;
  const quickActions: CommandItem[] = [];
  const navigationItems: CommandItem[] = [];

  // ==========================================
  // 1. UNIVERSALES (Para todos los usuarios y roles)
  // ==========================================
  // Acción rápida universal: Tema Claro / Oscuro
  quickActions.push({
    id: "action-toggle-theme",
    title: isDark.value ? "Cambiar a Modo Claro" : "Cambiar a Modo Oscuro",
    subtitle: "Alternar la apariencia visual entre claro y oscuro",
    icon: isDark.value ? "light_mode" : "dark_mode",
    group: "Acciones Rápidas",
    badge: "Tema",
    badgeVariant: "accent",
    keywords: [
      "tema",
      "oscuro",
      "claro",
      "dark",
      "light",
      "modo",
      "color",
      "apariencia",
    ],
    action: () => toggleTheme(),
  });

  // ==========================================
  // 2. ACCIONES RÁPIDAS Y NAVEGACIÓN SEGÚN EL ROL
  // ==========================================
  if (role === "guest") {
    // Guest Quick Actions
    quickActions.push(
      {
        id: "action-login",
        title: "Iniciar Sesión",
        subtitle: "Acceder a tu cuenta con correo o proveedor",
        icon: "login",
        group: "Acciones Rápidas",
        badge: "Cuenta",
        badgeVariant: "primary",
        keywords: [
          "login",
          "entrar",
          "ingresar",
          "iniciar",
          "sesion",
          "cuenta",
        ],
        action: () => router.push("/login"),
      },
      {
        id: "action-register",
        title: "Registrarse como Candidato",
        subtitle: "Crear perfil profesional para postularte a vacantes",
        icon: "person_add",
        group: "Acciones Rápidas",
        badge: "Registro",
        badgeVariant: "secondary",
        keywords: [
          "registro",
          "registrarme",
          "cuenta",
          "nuevo",
          "candidato",
          "postulante",
        ],
        action: () => router.push("/register"),
      },
      {
        id: "action-register-company",
        title: "Registrar Organización",
        subtitle: "Publicar ofertas laborales y captar talento",
        icon: "domain_add",
        group: "Acciones Rápidas",
        badge: "Organizaciones",
        badgeVariant: "neutral",
        keywords: [
          "empresa",
          "organizacion",
          "corporativo",
          "reclutador",
          "registro empresa",
        ],
        action: () => router.push("/register-company"),
      },
    );

    // Guest Navigation
    navigationItems.push({
      id: "nav-vacancies",
      title: "Explorar Vacantes",
      subtitle: "Buscar empleos, filtrar por modalidad y salario",
      icon: "work",
      group: "Navegación",
      badge: "Empleos",
      badgeVariant: "neutral",
      keywords: [
        "vacantes",
        "empleos",
        "trabajo",
        "jobs",
        "remoto",
        "hibrido",
        "ofertas",
      ],
      action: () => router.push("/vacancies"),
    });
  } else if (role === "candidate") {
    // Candidate Quick Actions
    quickActions.push(
      {
        id: "action-my-applications",
        title: "Ver Mis Postulaciones",
        subtitle: "Consultar el estado y seguimiento de tus candidaturas",
        icon: "assignment_turned_in",
        group: "Acciones Rápidas",
        badge: "Postulaciones",
        badgeVariant: "primary",
        keywords: [
          "postulaciones",
          "candidaturas",
          "mis aplicaciones",
          "seguimiento",
          "estado",
        ],
        action: () => router.push("/candidate/my-applications"),
      },
      {
        id: "action-cv-builder",
        title: "Generar y Administrar CV",
        subtitle: "Crea y descarga tu currículum profesional en formato Carta",
        icon: "picture_as_pdf",
        group: "Acciones Rápidas",
        badge: "CV",
        badgeVariant: "primary",
        keywords: [
          "cv",
          "curriculum",
          "hoja de vida",
          "builder",
          "pdf",
          "descargar",
          "carta",
        ],
        action: () => router.push("/candidate/profile"),
      },
      {
        id: "action-saved",
        title: "Vacantes Guardadas",
        subtitle: "Tus ofertas y publicaciones en marcadores",
        icon: "bookmark",
        group: "Acciones Rápidas",
        badge: "Guardados",
        badgeVariant: "neutral",
        keywords: [
          "guardados",
          "favoritos",
          "bookmarks",
          "marcadores",
          "guardar",
        ],
        action: () => router.push("/saved"),
      },
    );

    // Candidate Navigation
    navigationItems.push(
      {
        id: "nav-vacancies",
        title: "Explorar Vacantes",
        subtitle: "Buscar empleos, filtrar por modalidad y salario",
        icon: "work",
        group: "Navegación",
        badge: "Empleos",
        badgeVariant: "neutral",
        keywords: [
          "vacantes",
          "empleos",
          "trabajo",
          "jobs",
          "remoto",
          "hibrido",
          "ofertas",
        ],
        action: () => router.push("/vacancies"),
      },
      {
        id: "nav-profile",
        title: "Mi Perfil Profesional",
        subtitle: "Gestionar tu experiencia, habilidades y CV",
        icon: "account_circle",
        group: "Navegación",
        badge: "Perfil",
        badgeVariant: "neutral",
        keywords: [
          "perfil",
          "cuenta",
          "usuario",
          "cv",
          "habilidades",
          "experiencia",
        ],
        action: () => router.push("/profile"),
      },
      {
        id: "nav-messages",
        title: "Mensajes y Chat",
        subtitle: "Bandeja de mensajes directos con empresas",
        icon: "chat",
        group: "Navegación",
        badge: "Chat",
        badgeVariant: "neutral",
        keywords: ["mensajes", "chat", "inbox", "conversaciones", "contacto"],
        action: () => router.push("/messages"),
      },
      {
        id: "nav-notifications",
        title: "Notificaciones",
        subtitle: "Alertas y actualizaciones de tus postulaciones",
        icon: "notifications",
        group: "Navegación",
        badge: "Alertas",
        badgeVariant: "neutral",
        keywords: ["notificaciones", "avisos", "alertas", "novedades"],
        action: () => router.push("/notifications"),
      },
    );
  } else if (role === "organization") {
    // Organization Quick Actions
    quickActions.push(
      {
        id: "action-create-vacancy",
        title: "Publicar Oferta de Empleo",
        subtitle: "Crear una nueva vacante con requisitos y sueldo",
        icon: "add_circle",
        group: "Acciones Rápidas",
        badge: "Empresa",
        badgeVariant: "primary",
        keywords: [
          "crear",
          "publicar",
          "nueva",
          "vacante",
          "oferta",
          "reclutar",
          "empleo",
        ],
        action: () => router.push("/create-vacancy"),
      },
      {
        id: "action-applicants",
        title: "Tablero ATS de Candidatos",
        subtitle: "Gestionar candidatos en el embudo de contratación",
        icon: "dashboard_customize",
        group: "Acciones Rápidas",
        badge: "ATS",
        badgeVariant: "secondary",
        keywords: [
          "ats",
          "postulantes",
          "candidatos",
          "embudo",
          "talento",
          "revision",
        ],
        action: () => router.push("/applicants"),
      },
      {
        id: "action-my-vacancies",
        title: "Mis Vacantes Activas",
        subtitle: "Monitorear, editar o cerrar ofertas publicadas",
        icon: "work",
        group: "Acciones Rápidas",
        badge: "Gestión",
        badgeVariant: "neutral",
        keywords: [
          "mis vacantes",
          "activas",
          "ofertas publicadas",
          "gestionar vacantes",
        ],
        action: () => router.push("/my-vacancies"),
      },
      {
        id: "action-company-verification",
        title: "Estatus de Verificación",
        subtitle: "Validar documentación fiscal y legal",
        icon: "verified",
        group: "Acciones Rápidas",
        badge: "Validación",
        badgeVariant: "neutral",
        keywords: ["verificacion", "validar", "documentos", "rfc", "estatus"],
        action: () => router.push("/company/verification"),
      },
    );

    // Organization Navigation
    navigationItems.push(
      {
        id: "nav-company-profile",
        title: "Perfil de la Organización",
        subtitle: "Información corporativa, logotipo y cultura",
        icon: "business",
        group: "Navegación",
        badge: "Organización",
        badgeVariant: "neutral",
        keywords: [
          "perfil organizacion",
          "organizacion",
          "logo",
          "datos fiscales",
        ],
        action: () => router.push("/company/edit"),
      },
      {
        id: "nav-messages",
        title: "Bandeja de Mensajes",
        subtitle: "Conversaciones con candidatos",
        icon: "chat",
        group: "Navegación",
        badge: "Chat",
        badgeVariant: "neutral",
        keywords: ["mensajes", "chat", "inbox", "candidatos"],
        action: () => router.push("/messages"),
      },
      {
        id: "nav-notifications",
        title: "Notificaciones",
        subtitle: "Avisos de postulaciones y actividad",
        icon: "notifications",
        group: "Navegación",
        badge: "Alertas",
        badgeVariant: "neutral",
        keywords: ["notificaciones", "avisos", "alertas"],
        action: () => router.push("/notifications"),
      },
      {
        id: "nav-support",
        title: "Soporte y Apelaciones",
        subtitle: "Canal de soporte y resolución de controversias",
        icon: "gavel",
        group: "Navegación",
        badge: "Soporte",
        badgeVariant: "neutral",
        keywords: ["soporte", "apelaciones", "ayuda", "contacto"],
        action: () => router.push("/support"),
      },
    );
  } else if (role === "admin") {
    // Admin Quick Actions
    quickActions.push(
      {
        id: "action-admin-dashboard",
        title: "Panel Principal y Monitoreo",
        subtitle:
          "Métricas del sistema, salud de infraestructura y resumen general",
        icon: "dashboard",
        group: "Acciones Rápidas",
        badge: "Admin",
        badgeVariant: "primary",
        keywords: [
          "admin",
          "dashboard",
          "panel",
          "monitoreo",
          "metricas",
          "sistema",
          "salud",
        ],
        action: () => router.push("/admin"),
      },
      {
        id: "action-admin-analytics",
        title: "Métricas y Analítica Global",
        subtitle:
          "Habilidades en demanda, distribución geográfica y postulaciones",
        icon: "insights",
        group: "Acciones Rápidas",
        badge: "Analítica",
        badgeVariant: "secondary",
        keywords: [
          "analitica",
          "metricas",
          "kpi",
          "estadisticas",
          "habilidades",
          "mercado",
        ],
        action: () => router.push("/admin/analytics"),
      },
      {
        id: "action-admin-orgs",
        title: "Gestión de Organizaciones",
        subtitle: "Supervisar y auditar empresas registradas",
        icon: "account_balance",
        group: "Acciones Rápidas",
        badge: "Admin",
        badgeVariant: "secondary",
        keywords: ["organizaciones", "empresas", "gestion", "auditoria"],
        action: () => router.push("/admin/organizations"),
      },
      {
        id: "action-admin-catalog",
        title: "Catálogo Maestro",
        subtitle: "Habilidades, rubros y datos maestros del sistema",
        icon: "layers",
        group: "Acciones Rápidas",
        badge: "Catálogo",
        badgeVariant: "neutral",
        keywords: ["catalogo", "habilidades", "skills", "maestro"],
        action: () => router.push("/admin/catalog"),
      },
      {
        id: "action-admin-fraud",
        title: "Auditoría de Seguridad y Fraude",
        subtitle: "Supervisar alertas y comportamientos anómalos",
        icon: "security",
        group: "Acciones Rápidas",
        badge: "Seguridad",
        badgeVariant: "accent",
        keywords: ["fraude", "seguridad", "anomalias", "auditoria"],
        action: () => router.push("/admin/fraud"),
      },
    );

    // Admin Navigation
    navigationItems.push(
      {
        id: "nav-admin-dashboard",
        title: "Panel Principal",
        subtitle: "Monitoreo y métricas operativas",
        icon: "dashboard",
        group: "Navegación",
        badge: "Admin",
        badgeVariant: "neutral",
        keywords: ["inicio", "panel", "dashboard", "admin"],
        action: () => router.push("/admin"),
      },
      {
        id: "nav-admin-push",
        title: "Campañas de Notificaciones Push",
        subtitle: "Envío y difusión masiva de alertas",
        icon: "campaign",
        group: "Navegación",
        badge: "Push",
        badgeVariant: "neutral",
        keywords: ["push", "notificaciones", "difusion", "campana"],
        action: () => router.push("/admin/push"),
      },
      {
        id: "nav-notifications",
        title: "Notificaciones del Sistema",
        subtitle: "Bandeja de avisos administrativos",
        icon: "notifications",
        group: "Navegación",
        badge: "Alertas",
        badgeVariant: "neutral",
        keywords: ["notificaciones", "alertas"],
        action: () => router.push("/notifications"),
      },
    );
  } else if (role === "moderator") {
    // Moderator Quick Actions
    quickActions.push(
      {
        id: "action-mod-incidents",
        title: "Centro de Incidencias",
        subtitle: "Reportes de vacantes y usuarios en revisión",
        icon: "report_problem",
        group: "Acciones Rápidas",
        badge: "Moderación",
        badgeVariant: "primary",
        keywords: ["incidencias", "reportes", "quejas", "moderacion"],
        action: () => router.push("/mod/incidents"),
      },
      {
        id: "action-mod-appeals",
        title: "Canales de Apelación",
        subtitle: "Atención de controversias y apelaciones",
        icon: "gavel",
        group: "Acciones Rápidas",
        badge: "Apelaciones",
        badgeVariant: "secondary",
        keywords: ["apelaciones", "disputas", "revision"],
        action: () => router.push("/mod/appeals"),
      },
      {
        id: "action-mod-verifications",
        title: "Verificaciones Pendientes",
        subtitle: "Revisar documentos y sellos de empresas",
        icon: "verified",
        group: "Acciones Rápidas",
        badge: "Verificación",
        badgeVariant: "neutral",
        keywords: ["verificaciones", "empresas", "aprobar"],
        action: () => router.push("/mod/verifications"),
      },
      {
        id: "action-mod-support",
        title: "Soporte a Usuarios",
        subtitle: "Tickets y asistencia directa de moderación",
        icon: "contact_support",
        group: "Acciones Rápidas",
        badge: "Soporte",
        badgeVariant: "neutral",
        keywords: ["soporte", "tickets", "asistencia"],
        action: () => router.push("/mod/support"),
      },
    );

    // Moderator Navigation
    navigationItems.push(
      {
        id: "nav-mod-skills",
        title: "Taxonomía de Habilidades",
        subtitle: "Normalización de skills reportadas",
        icon: "psychology",
        group: "Navegación",
        badge: "Habilidades",
        badgeVariant: "neutral",
        keywords: ["habilidades", "skills", "taxonomia"],
        action: () => router.push("/mod/skills"),
      },
      {
        id: "nav-notifications",
        title: "Notificaciones",
        subtitle: "Alertas operativas de moderación",
        icon: "notifications",
        group: "Navegación",
        badge: "Alertas",
        badgeVariant: "neutral",
        keywords: ["notificaciones", "alertas"],
        action: () => router.push("/notifications"),
      },
    );
  }

  // Universal Navigation Items (Accessible to all roles)
  navigationItems.push(
    {
      id: "nav-map",
      title: "Mapa Interactivo de Empleos",
      subtitle: "Explorar vacantes geolocalizadas en el Estado de México",
      icon: "map",
      group: "Navegación",
      badge: "Edoméx",
      badgeVariant: "secondary",
      keywords: [
        "mapa",
        "geolocalizacion",
        "edomex",
        "ubicacion",
        "distancia",
        "gps",
        "toluca",
      ],
      action: () => router.push("/map"),
    },
    {
      id: "nav-companies",
      title: "Directorio de Organizaciones",
      subtitle: "Consultar empresas e instituciones registradas",
      icon: "domain",
      group: "Navegación",
      badge: "Empresas",
      badgeVariant: "neutral",
      keywords: [
        "empresas",
        "organizaciones",
        "directorio",
        "empleadores",
        "companias",
      ],
      action: () => router.push("/companies"),
    },
  );

  // Logout action for any authenticated user
  if (status.value === "authenticated") {
    quickActions.push({
      id: "action-logout",
      title: "Cerrar Sesión",
      subtitle: `Cerrar la sesión de ${userName.value}`,
      icon: "logout",
      group: "Acciones Rápidas",
      badge: "Sesión",
      badgeVariant: "neutral",
      keywords: ["salir", "cerrar", "logout", "desconectar", "exit"],
      action: () => signOut({ callbackUrl: "/login" }),
    });
  }

  return [...quickActions, ...navigationItems];
});

// Filtered and Search Results
const filteredItems = computed<CommandItem[]>(() => {
  const query = searchQuery.value.toLowerCase().trim();

  // If query is empty, return static actions and navigation tailored for role
  if (!query) {
    return staticItems.value;
  }

  // 1. Filter role-scoped static items
  const matchingStatic = staticItems.value.filter((item) => {
    const inTitle = item.title.toLowerCase().includes(query);
    const inSubtitle = (item.subtitle || "").toLowerCase().includes(query);
    const inKeywords = (item.keywords || []).some((kw) =>
      kw.toLowerCase().includes(query),
    );
    return inTitle || inSubtitle || inKeywords;
  });

  // 2. Dynamic Vacancies matches (ONLY for candidates and guests searching for jobs)
  const isCandidateOrGuest =
    userRole.value === "candidate" || userRole.value === "guest";
  const matchingJobs: CommandItem[] = isCandidateOrGuest
    ? (jobsStore.jobs || [])
        .filter((job) => {
          const inTitle = (job.title || "").toLowerCase().includes(query);
          const inCompany = (job.company || "").toLowerCase().includes(query);
          const inDesc = (job.descripcion || "").toLowerCase().includes(query);
          const inSkills = (job.habilidadesRequeridas || []).some((s) =>
            s.toLowerCase().includes(query),
          );
          return inTitle || inCompany || inDesc || inSkills;
        })
        .slice(0, 5)
        .map((job) => ({
          id: `job-${job.id || (job as any).uniqueId}`,
          title: job.title || "Vacante",
          subtitle: `${job.company || "Empresa"} · ${job.modalidad || "Modalidad"}`,
          icon: "work_outline",
          group: "Vacantes",
          badge: job.modalidad || "Vacante",
          badgeVariant: "primary",
          action: () => router.push(`/vacancies`),
        }))
    : [];

  return [...matchingStatic, ...matchingJobs];
});

// Group items for display
const groupedItems = computed(() => {
  const groups: { title: string; items: CommandItem[] }[] = [];
  const groupOrder: CommandItem["group"][] = [
    "Acciones Rápidas",
    "Navegación",
    "Vacantes",
  ];

  let currentFlatIndex = 0;
  const itemsWithIndex = filteredItems.value.map((item) => {
    return { ...item, flatIndex: currentFlatIndex++ };
  });

  for (const groupName of groupOrder) {
    const inGroup = itemsWithIndex.filter((item) => item.group === groupName);
    if (inGroup.length > 0) {
      groups.push({
        title: groupName,
        items: inGroup,
      });
    }
  }

  return groups;
});

// Badge styling helper
const getBadgeClasses = (variant?: CommandItem["badgeVariant"]) => {
  switch (variant) {
    case "primary":
      return "bg-primary/10 text-primary border-primary/20 dark:bg-indigo-950/60 dark:text-indigo-400";
    case "secondary":
      return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400";
    case "accent":
      return "bg-amber-500/10 text-amber-700 border-amber-500/20 dark:text-amber-400";
    case "neutral":
    default:
      return "bg-surface-container dark:bg-slate-800 text-on-surface-variant dark:text-slate-400 border-outline-variant/40";
  }
};

// Keyboard navigation handlers
const navigateDown = () => {
  if (filteredItems.value.length === 0) return;
  if (activeIndex.value < filteredItems.value.length - 1) {
    activeIndex.value++;
    scrollToActive();
  } else {
    activeIndex.value = 0;
    scrollToActive();
  }
};

const navigateUp = () => {
  if (filteredItems.value.length === 0) return;
  if (activeIndex.value > 0) {
    activeIndex.value--;
    scrollToActive();
  } else {
    activeIndex.value = filteredItems.value.length - 1;
    scrollToActive();
  }
};

const executeActiveItem = () => {
  const item = filteredItems.value[activeIndex.value];
  if (item) {
    executeItem(item);
  }
};

const executeItem = (item: CommandItem) => {
  closeCommandPalette();
  searchQuery.value = "";
  item.action();
};

const scrollToActive = () => {
  nextTick(() => {
    const el = resultsContainerRef.value?.querySelector(
      `[data-item-index="${activeIndex.value}"]`,
    );
    if (el) {
      el.scrollIntoView({ block: "nearest" });
    }
  });
};

// Reset active index when query changes
watch(searchQuery, () => {
  activeIndex.value = 0;
});

// Watch open state to focus input and fetch background data if needed
watch(isOpen, async (opened) => {
  if (opened) {
    activeIndex.value = 0;
    searchQuery.value = "";
    if (userRole.value === "candidate" || userRole.value === "guest") {
      if (jobsStore.jobs.length === 0) {
        jobsStore.fetchJobs();
      }
    }
    await nextTick();
    searchInputRef.value?.focus();
  }
});

// Global keyboard shortcut listener (Cmd+K / Ctrl+K and Escape)
const handleGlobalKeyDown = (e: KeyboardEvent) => {
  // Allow Ctrl+K or Cmd+K from anywhere
  if ((e.metaKey || e.ctrlKey) && (e.key === "k" || e.key === "K")) {
    e.preventDefault();
    if (isOpen.value) {
      closeCommandPalette();
    } else {
      useCommandPalette().openCommandPalette();
    }
    return;
  }

  // Escape to close if open
  if (e.key === "Escape" && isOpen.value) {
    e.preventDefault();
    closeCommandPalette();
  }
};

onMounted(() => {
  if (import.meta.client) {
    window.addEventListener("keydown", handleGlobalKeyDown);
  }
});

onUnmounted(() => {
  if (import.meta.client) {
    window.removeEventListener("keydown", handleGlobalKeyDown);
  }
});
</script>
