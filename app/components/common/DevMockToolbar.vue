<template>
  <div class="fixed bottom-4 right-4 z-50 font-sans select-none print:hidden">
    <!-- Collapsed Floating Button -->
    <button
      v-if="!isOpen"
      @click="isOpen = true"
      class="flex items-center gap-2 bg-slate-900/90 hover:bg-slate-900 text-white text-xs font-bold px-3.5 py-2.5 rounded-full shadow-2xl border border-indigo-500/40 backdrop-blur-md transition-all hover:scale-105 active:scale-95 group cursor-pointer"
      title="Abrir panel de desarrollo y selector de roles"
    >
      <span class="inline-block w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
      <span class="font-extrabold text-indigo-400">DevMode</span>
      <span class="text-slate-400">|</span>
      <span class="text-slate-200 group-hover:text-white capitalize flex items-center gap-1">
        {{ getRoleLabel(mockRole) }}
        <span class="material-symbols-outlined text-[16px]">tune</span>
      </span>
    </button>

    <!-- Expanded Dev Toolbar Card -->
    <div
      v-else
      class="bg-slate-900/95 border border-indigo-500/30 text-slate-100 rounded-2xl shadow-2xl p-4 w-80 max-w-[92vw] backdrop-blur-xl animate-in fade-in slide-in-from-bottom-4 duration-150"
    >
      <!-- Header -->
      <div class="flex items-center justify-between pb-3 border-b border-slate-800">
        <div class="flex items-center gap-2">
          <div class="w-6 h-6 rounded-lg bg-gradient-to-tr from-indigo-500 to-cyan-400 flex items-center justify-center font-black text-[11px] text-white">
            JN
          </div>
          <div>
            <h4 class="text-xs font-bold text-white flex items-center gap-1.5">
              Panel de Datos Mock
              <span class="bg-indigo-950 text-indigo-400 border border-indigo-700/50 text-[10px] px-1.5 py-0.2 rounded font-mono">v2.0</span>
            </h4>
            <p class="text-[10px] text-slate-400">Vistas con datos reales simulados</p>
          </div>
        </div>
        <button
          @click="isOpen = false"
          class="text-slate-400 hover:text-white transition p-1 rounded-lg hover:bg-slate-800"
          title="Cerrar panel"
        >
          <span class="material-symbols-outlined text-sm">close</span>
        </button>
      </div>

      <!-- Active Role Switcher -->
      <div class="mt-3 space-y-1.5">
        <div class="flex items-center justify-between text-[11px] font-semibold text-slate-300">
          <span>Cambiar Rol Activo:</span>
          <span class="text-indigo-400 text-[10px]">{{ currentMockUser?.name || 'Público' }}</span>
        </div>
        <div class="grid grid-cols-2 gap-1.5">
          <button
            v-for="role in roleOptions"
            :key="role.value"
            @click="selectRole(role.value)"
            class="flex items-center gap-2 px-2.5 py-2 rounded-xl text-[11px] font-semibold transition border text-left cursor-pointer"
            :class="[
              mockRole === role.value
                ? 'bg-indigo-600/30 text-indigo-300 border-indigo-500 shadow-sm'
                : 'bg-slate-800/60 hover:bg-slate-800 text-slate-300 border-slate-700/60'
            ]"
          >
            <span class="material-symbols-outlined text-sm shrink-0">{{ role.icon }}</span>
            <span class="truncate">{{ role.label }}</span>
          </button>
        </div>
      </div>

      <!-- Quick Route Jump -->
      <div class="mt-3.5 space-y-1.5">
        <div class="flex items-center justify-between text-[11px] font-semibold text-slate-300">
          <span>Acceso Rápido a Vistas:</span>
          <span class="text-[10px] text-slate-400">{{ routerRoutes.length }} vistas</span>
        </div>
        <select
          v-model="selectedRoute"
          @change="goToRoute"
          class="w-full bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-xl px-2.5 py-2 focus:ring-1 focus:ring-indigo-500 outline-none cursor-pointer"
        >
          <option value="" disabled>Seleccionar vista del router...</option>
          <optgroup label="Candidato & General">
            <option value="/">1. Muro / Feed Principal (/)</option>
            <option value="/vacancies">2. Explorador de Vacantes (/vacancies)</option>
            <option value="/jobs/vac-frontend-sr-01">3. Detalle de Vacante (/jobs/vac-01)</option>
            <option value="/candidate/francisco-gomez">4. Perfil Profesional (/candidate/...)</option>
            <option value="/companies">5. Directorio de Empresas (/companies)</option>
            <option value="/map">6. Mapa Interactivo (/map)</option>
            <option value="/candidate/my-applications">7. Mis Solicitudes (/candidate/my-applications)</option>
          </optgroup>
          <optgroup label="Empresa & Reclutador (Requiere Rol Empresa)">
            <option value="/my-vacancies">8. Mis Vacantes Publicadas (/my-vacancies)</option>
            <option value="/applicants">9. Tablero ATS de Candidatos (/applicants)</option>
            <option value="/create-vacancy">10. Crear Publicación (/create-vacancy)</option>
            <option value="/company/edit">11. Perfil Corporativo (/company/edit)</option>
          </optgroup>
          <optgroup label="Mensajería & Cuenta">
            <option value="/messages">12. Mensajes y Chat WebSocket (/messages)</option>
            <option value="/notifications">13. Centro de Notificaciones (/notifications)</option>
            <option value="/settings">14. Configuración de Usuario (/settings)</option>
          </optgroup>
          <optgroup label="Moderación & Admin (Requiere Rol Mod/Admin)">
            <option value="/mod/incidents">15. Bandeja de Incidentes (/mod/incidents)</option>
            <option value="/mod/verifications">16. Verificaciones SAT KYC (/mod/verifications)</option>
            <option value="/mod/appeals">17. Centro de Apelaciones (/mod/appeals)</option>
            <option value="/admin/organizations">18. Control de Organizaciones (/admin/organizations)</option>
            <option value="/admin/catalog">19. Catálogo Maestro (/admin/catalog)</option>
          </optgroup>
        </select>
      </div>

      <!-- Footer Info -->
      <div class="mt-3.5 pt-2.5 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
        <div class="flex items-center gap-1">
          <span class="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
          <span>Datos en memoria activos</span>
        </div>
        <button
          @click="resetToDefault"
          class="text-indigo-400 hover:text-indigo-300 font-semibold cursor-pointer"
        >
          Restablecer
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useMockSession, type MockRole } from "~/composables/useMockSession";

const router = useRouter();
const route = useRoute();
const { mockRole, currentMockUser, setMockRole } = useMockSession();

const isOpen = ref(false);
const selectedRoute = ref("");

const roleOptions = [
  { value: "CANDIDATO" as MockRole, label: "Candidato", icon: "person" },
  { value: "EMPRESA" as MockRole, label: "Empresa", icon: "corporate_fare" },
  { value: "MODERATOR" as MockRole, label: "Moderador", icon: "shield" },
  { value: "ADMIN" as MockRole, label: "Admin", icon: "admin_panel_settings" },
  { value: "GUEST" as MockRole, label: "Público", icon: "public" },
];

const routerRoutes = [
  "/",
  "/vacancies",
  "/jobs/vac-frontend-sr-01",
  "/candidate/francisco-gomez",
  "/companies",
  "/map",
  "/candidate/my-applications",
  "/my-vacancies",
  "/applicants",
  "/create-vacancy",
  "/messages",
  "/notifications",
  "/settings",
  "/mod/incidents",
  "/mod/verifications",
  "/mod/appeals",
  "/admin/organizations",
  "/admin/catalog"
];

const getRoleLabel = (role: MockRole) => {
  const match = roleOptions.find((r) => r.value === role);
  return match ? match.label : role;
};

const selectRole = (role: MockRole) => {
  setMockRole(role);
  // Auto navigate if current route is role protected
  if (role === "ADMIN" && !route.path.startsWith("/admin") && !route.path.startsWith("/mod")) {
    router.push("/admin/organizations");
  } else if (role === "EMPRESA" && !route.path.startsWith("/my-vacancies") && !route.path.startsWith("/applicants")) {
    router.push("/applicants");
  } else if (role === "MODERATOR" && !route.path.startsWith("/mod")) {
    router.push("/mod/incidents");
  }
};

const goToRoute = () => {
  if (selectedRoute.value) {
    // Automatically adjust mock role if necessary for route permission
    if (selectedRoute.value.startsWith("/admin") && mockRole.value !== "ADMIN") {
      setMockRole("ADMIN");
    } else if (selectedRoute.value.startsWith("/mod") && mockRole.value !== "MODERATOR" && mockRole.value !== "ADMIN") {
      setMockRole("MODERATOR");
    } else if (
      (selectedRoute.value === "/applicants" || selectedRoute.value === "/my-vacancies" || selectedRoute.value === "/create-vacancy") &&
      mockRole.value !== "EMPRESA"
    ) {
      setMockRole("EMPRESA");
    }

    router.push(selectedRoute.value);
    selectedRoute.value = "";
  }
};

const resetToDefault = () => {
  setMockRole("CANDIDATO");
  router.push("/");
};
</script>
