import { computed, ref, watchEffect } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuth } from "#imports";
import { useProtectedAction } from "~/composables/useProtectedAction";
import { useProfileState } from "~/composables/useProfileState";

export interface NavItem {
  to: string;
  icon: string;
  label: string;
  protected?: boolean;
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

export const useAppNavigation = () => {
  const route = useRoute();
  const router = useRouter();
  const { status, data, signOut } = useAuth();
  const { openProtectedModal } = useProtectedAction();
  const { profilePic, hasFetched, fetchProfilePic } = useProfileState();

  const effectiveStatus = computed(() => status.value);

  watchEffect(() => {
    if (
      status.value === "authenticated" &&
      data.value?.user?.id &&
      !hasFetched.value
    ) {
      fetchProfilePic(data.value.user.id as string);
    }
  });

  const userRole = computed<string>(() => {
    if (status.value !== "authenticated") return "guest";
    const user = data.value?.user;
    const tipo = (user?.tipoUsuario || "").toUpperCase();
    if (tipo === "ORGANIZACION") return "organization";
    if (tipo === "ADMIN") return "admin";
    if (tipo === "MODERATOR" || tipo === "MODERADOR") return "moderator";
    return "candidate";
  });

  const userName = computed(() => {
    return data.value?.user?.name || data.value?.user?.email || "Usuario";
  });

  const userInitial = computed(() => userName.value.charAt(0).toUpperCase());

  const userAvatar = computed(() => {
    return profilePic.value || data.value?.user?.image || "";
  });

  const roleBadge = computed(() => {
    switch (userRole.value) {
      case "admin":
        return "Administrador";
      case "moderator":
        return "Moderador";
      case "organization":
        return "Organización";
      default:
        return "Candidato";
    }
  });

  const profileRoute = computed(() => "/profile");

  const normalizePath = (p: string) => p.replace(/\/+$/, "") || "/";

  const isActive = (path: string | null): boolean => {
    if (!path) return false;

    const current = normalizePath(route.path);
    const target = normalizePath(path);

    // 1. Coincidencia exacta (ej: /admin === /admin, / === /, /admin/analytics === /admin/analytics)
    if (current === target) return true;

    // 2. Rutas raíz que NUNCA deben coincidir con subrutas hermanas
    if (target === "/" || target === "/admin") {
      return false;
    }

    // 3. Casos especiales de detalle asociados a listas principales
    if (target === "/vacancies" && current.startsWith("/jobs/")) {
      return true;
    }
    if (target === "/companies" && current.startsWith("/company/")) {
      return true;
    }
    if (target === "/my-vacancies" && current.startsWith("/edit-vacancy/")) {
      return true;
    }

    // 4. Subrutas jerárquicas reales (requiere frontera de segmento '/')
    // Evita falsos positivos como /create coincidiendo con /create-vacancy
    return current.startsWith(`${target}/`);
  };

  const handleNavClick = (item: NavItem, onBeforeNavigate?: () => void) => {
    if (onBeforeNavigate) {
      onBeforeNavigate();
    }
    if (effectiveStatus.value !== "authenticated" && item.protected) {
      openProtectedModal();
      return;
    }
    router.push(item.to);
  };

  // Prominent Action CTA Button per Role
  const primaryAction = computed<NavItem | null>(() => {
    switch (userRole.value) {
      case "organization":
        return {
          to: "/create",
          icon: "add_circle",
          label: "Crear Nuevo recurso",
          protected: true,
        };
      case "admin":
      case "moderator":
        return {
          to: "/create",
          icon: "add_circle",
          label: "Crear Nuevo",
          protected: true,
        };
      default:
        return {
          to: "/create",
          icon: "add_circle",
          label: "Crear Publicación",
          protected: true,
        };
    }
  });

  // Categorized Navigation Sections (Eliminates flat list crowding)
  const navSections = computed<NavSection[]>(() => {
    switch (userRole.value) {
      case "admin":
        return [
          {
            title: "Administración",
            items: [
              { to: "/", icon: "home", label: "Inicio", protected: false },
              {
                to: "/admin",
                icon: "dashboard",
                label: "Panel Principal",
                protected: true,
              },
              {
                to: "/admin/analytics",
                icon: "insights",
                label: "Analítica Avanzada",
                protected: true,
              },
              {
                to: "/admin/organizations",
                icon: "account_balance",
                label: "Organizaciones",
                protected: true,
              },
              {
                to: "/admin/catalog",
                icon: "layers",
                label: "Catálogo Maestro",
                protected: true,
              },
              {
                to: "/admin/push",
                icon: "campaign",
                label: "Notificaciones Push",
                protected: true,
              },
            ],
          },
          {
            title: "Moderación & Auditoría",
            items: [
              {
                to: "/admin/fraud",
                icon: "find_in_page",
                label: "Reportes de Fraude",
                protected: true,
              },
              {
                to: "/mod/incidents",
                icon: "report_problem",
                label: "Incidencias",
                protected: true,
              },
              {
                to: "/mod/appeals",
                icon: "gavel",
                label: "Canales Apelación",
                protected: true,
              },
              {
                to: "/notifications",
                icon: "notifications",
                label: "Notificaciones",
                protected: true,
              },
              {
                to: "/saved",
                icon: "bookmark",
                label: "Guardados",
                protected: true,
              },
              {
                to: "/support",
                icon: "report_problem",
                label: "Reportar un problema",
                protected: true,
              },
            ],
          },
        ];

      case "moderator":
        return [
          {
            title: "Supervisión",
            items: [
              { to: "/", icon: "home", label: "Inicio", protected: false },
              {
                to: "/mod/incidents",
                icon: "report_problem",
                label: "Incidencias",
                protected: true,
              },
              {
                to: "/mod/appeals",
                icon: "gavel",
                label: "Canales Apelación",
                protected: true,
              },
              {
                to: "/mod/verifications",
                icon: "verified",
                label: "Verificaciones",
                protected: true,
              },
            ],
          },
          {
            title: "Gestión & Soporte",
            items: [
              {
                to: "/notifications",
                icon: "notifications",
                label: "Notificaciones",
                protected: true,
              },
              {
                to: "/saved",
                icon: "bookmark",
                label: "Guardados",
                protected: true,
              },
              {
                to: "/support",
                icon: "report_problem",
                label: "Reportar un problema",
                protected: true,
              },
              {
                to: "/mod/support",
                icon: "contact_support",
                label: "Soporte Directo",
                protected: true,
              },
              {
                to: "/mod/skills",
                icon: "psychology",
                label: "Habilidades",
                protected: true,
              },
            ],
          },
        ];

      case "organization":
        return [
          {
            title: "Gestión de Talento",
            items: [
              { to: "/", icon: "home", label: "Inicio", protected: false },
              {
                to: "/applicants",
                icon: "dashboard_customize",
                label: "Tablero ATS",
                protected: true,
              },
              {
                to: "/my-vacancies",
                icon: "work",
                label: "Mis Vacantes",
                protected: true,
              },
            ],
          },
          {
            title: "Comunicación & Guardados",
            items: [
              {
                to: "/messages",
                icon: "forum",
                label: "Mensajes",
                protected: true,
              },
              {
                to: "/notifications",
                icon: "notifications",
                label: "Notificaciones",
                protected: true,
              },
              {
                to: "/saved",
                icon: "bookmark",
                label: "Guardados",
                protected: true,
              },
              {
                to: "/support",
                icon: "report_problem",
                label: "Reportar un problema",
                protected: true,
              },
            ],
          },
          {
            title: "Organización & Soporte",
            items: [
              {
                to: "/company/verification",
                icon: "verified",
                label: "Verificación",
                protected: true,
              },
              {
                to: "/support",
                icon: "report_problem",
                label: "Reportar un problema",
                protected: true,
              },
            ],
          },
        ];

      default: // CANDIDATE or GUEST
        return [
          {
            title: "Explorar & Empleos",
            items: [
              { to: "/", icon: "home", label: "Inicio", protected: false },
              {
                to: "/vacancies",
                icon: "work",
                label: "Explorar Vacantes",
                protected: false,
              },
              {
                to: "/companies",
                icon: "domain",
                label: "Directorio de Organizaciones",
                protected: false,
              },
            ],
          },
          {
            title: "Comunidad & Red",
            items: [
              {
                to: "/messages",
                icon: "forum",
                label: "Mensajes",
                protected: true,
              },
              {
                to: "/notifications",
                icon: "notifications",
                label: "Notificaciones",
                protected: true,
              },
            ],
          },
          {
            title: "Mi Actividad",
            items: [
              {
                to: "/candidate/my-applications",
                icon: "fact_check",
                label: "Mis Postulaciones",
                protected: true,
              },
              {
                to: "/saved",
                icon: "bookmark",
                label: "Guardados",
                protected: true,
              },
              {
                to: "/support",
                icon: "report_problem",
                label: "Reportar un problema",
                protected: true,
              },
            ],
          },
        ];
    }
  });

  const isSigningOut = ref(false);

  const onSignOut = async () => {
    if (isSigningOut.value) return;
    isSigningOut.value = true;
    try {
      await signOut({ callbackUrl: "/login" });
    } finally {
      isSigningOut.value = false;
    }
  };

  return {
    effectiveStatus,
    userRole,
    userName,
    userInitial,
    userAvatar,
    roleBadge,
    profileRoute,
    primaryAction,
    navSections,
    isActive,
    handleNavClick,
    isSigningOut,
    onSignOut,
  };
};
