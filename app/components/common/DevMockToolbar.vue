<template>
  <div class="fixed bottom-4 right-4 z-[99999] select-none font-sans">
    <!-- Collapsed Floating Launcher Button -->
    <button
      v-if="!isOpen"
      @click="isOpen = true"
      type="button"
      class="group flex items-center gap-2.5 px-3.5 py-2.5 rounded-full bg-slate-900/95 dark:bg-slate-950/95 text-white border border-indigo-500/50 shadow-2xl hover:border-indigo-400 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer backdrop-blur-md"
      title="Abrir panel de datos mock y simulador de vistas"
    >
      <div class="w-6 h-6 rounded-full bg-gradient-to-tr from-indigo-500 to-cyan-400 flex items-center justify-center font-black text-[11px] text-white shadow-sm shadow-indigo-500/50">
        JN
      </div>
      <div class="flex items-center gap-1.5 text-xs font-bold">
        <span>Mock Data</span>
        <span class="text-[10px] font-mono px-1.5 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-700/60 uppercase">
          {{ mockRole }}
        </span>
      </div>
      <span class="material-symbols-outlined text-sm text-indigo-400 group-hover:rotate-45 transition-transform duration-200">
        tune
      </span>
    </button>

    <!-- Expanded Drawer Panel -->
    <div
      v-else
      class="w-96 max-w-[calc(100vw-2rem)] max-h-[85vh] overflow-y-auto bg-slate-900/95 dark:bg-slate-950/95 text-slate-100 rounded-2xl border border-indigo-500/40 p-4 shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95 duration-200 flex flex-col"
    >
      <!-- Header -->
      <div class="flex items-center justify-between pb-3 border-b border-slate-800">
        <div class="flex items-center gap-2.5">
          <div class="w-7 h-7 rounded-lg bg-gradient-to-tr from-indigo-500 to-cyan-400 flex items-center justify-center font-black text-xs text-white shadow-sm">
            JN
          </div>
          <div>
            <h4 class="text-xs font-extrabold text-white flex items-center gap-1.5">
              Panel de Vistas Mock
              <span class="bg-indigo-950 text-indigo-300 border border-indigo-700/50 text-[9px] px-1.5 py-0.5 rounded font-mono font-bold">
                Paridad Develop
              </span>
            </h4>
            <p class="text-[10px] text-slate-400">Simulación integral de roles y navegación</p>
          </div>
        </div>
        <button
          type="button"
          @click="isOpen = false"
          class="text-slate-400 hover:text-white transition p-1 rounded-lg hover:bg-slate-800 cursor-pointer"
          title="Minimizar panel"
        >
          <span class="material-symbols-outlined text-base">close</span>
        </button>
      </div>

      <!-- Active User Card -->
      <div class="mt-3 p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center gap-2.5">
        <div class="relative shrink-0">
          <img
            v-if="currentMockUser?.avatarUrl"
            :src="currentMockUser.avatarUrl"
            :alt="currentMockUser.name"
            class="w-9 h-9 rounded-full object-cover border border-indigo-500/50"
          />
          <div
            v-else
            class="w-9 h-9 rounded-full bg-indigo-600/30 text-indigo-300 flex items-center justify-center font-bold text-xs border border-indigo-500/40"
          >
            {{ mockRole === 'GUEST' ? 'P' : 'U' }}
          </div>
          <span
            class="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-slate-900"
            :class="mockRole === 'GUEST' ? 'bg-amber-400' : 'bg-emerald-400'"
          ></span>
        </div>
        <div class="min-w-0 flex-1">
          <p class="text-xs font-bold text-white truncate">
            {{ currentMockUser?.name || 'Usuario Público / Invitado' }}
          </p>
          <p class="text-[10px] text-slate-400 truncate">
            {{ currentMockUser?.email || 'Sin sesión activa' }}
          </p>
        </div>
        <div class="text-right shrink-0">
          <span class="inline-block text-[9px] font-mono font-extrabold uppercase px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            {{ mockRole }}
          </span>
        </div>
      </div>

      <!-- Role Switcher -->
      <div class="mt-3.5 space-y-1.5">
        <div class="flex items-center justify-between text-[11px] font-bold text-slate-300">
          <span>Cambiar Rol Activo:</span>
          <span class="text-[10px] text-indigo-400 font-mono">{{ availableRoles.length }} roles</span>
        </div>
        <div class="grid grid-cols-2 gap-1.5">
          <button
            v-for="role in roleOptions"
            :key="role.value"
            type="button"
            @click="selectRole(role.value)"
            class="flex items-center gap-2 px-2.5 py-2 rounded-xl text-[11px] font-semibold transition border text-left cursor-pointer"
            :class="[
              mockRole === role.value
                ? 'bg-indigo-600/40 text-indigo-200 border-indigo-400 ring-1 ring-indigo-400/50 shadow-sm'
                : 'bg-slate-800/60 hover:bg-slate-800 text-slate-300 border-slate-700/60'
            ]"
          >
            <span class="material-symbols-outlined text-sm shrink-0">{{ role.icon }}</span>
            <span class="truncate">{{ role.label }}</span>
          </button>
        </div>
      </div>

      <!-- Quick Route Jump with Categorized Views -->
      <div class="mt-3.5 space-y-1.5">
        <div class="flex items-center justify-between text-[11px] font-bold text-slate-300">
          <span>Acceso Rápido a Vistas:</span>
          <span class="text-[10px] text-slate-400 font-mono">{{ totalRoutesCount }} vistas</span>
        </div>
        <select
          v-model="selectedRoute"
          @change="goToRoute"
          class="w-full bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-xl px-2.5 py-2 focus:ring-1 focus:ring-indigo-500 outline-none cursor-pointer"
        >
          <option value="" disabled>Seleccionar vista del sistema...</option>

          <optgroup label="Candidato & General">
            <option value="/">1. Muro / Feed Principal (/)</option>
            <option value="/vacancies">2. Explorador Facetado de Vacantes (/vacancies)</option>
            <option value="/jobs/vac-frontend-sr-01">3. Detalle de Vacante (/jobs/vac-01)</option>
            <option value="/candidate/francisco-gomez">4. Perfil Profesional (/candidate/...)</option>
            <option value="/candidate/my-applications">5. Mis Postulaciones ATS (/candidate/my-applications)</option>
            <option value="/candidate/cv-templates">6. Comunidad de Plantillas CV [RF-133] (/candidate/cv-templates)</option>
            <option value="/saved">7. Empleos y Publicaciones Guardadas (/saved)</option>
            <option value="/companies">8. Directorio de Empresas (/companies)</option>
            <option value="/company/org-techsolutions-01">9. Perfil de Empresa (/company/...)</option>
            <option value="/map">10. Mapa Cartográfico Edo. Méx (/map)</option>
          </optgroup>

          <optgroup label="Empresa & Reclutador (Requiere Rol Empresa)">
            <option value="/applicants">11. Tablero ATS de Candidatos (/applicants)</option>
            <option value="/my-vacancies">12. Mis Vacantes y Plazas Múltiples (/my-vacancies)</option>
            <option value="/create-vacancy">13. Publicar Oferta Laboral (/create-vacancy)</option>
            <option value="/company/edit">14. Configuración y Perfil Corporativo (/company/edit)</option>
            <option value="/company/verification">15. Estatus de Verificación KYC (/company/verification)</option>
            <option value="/preview/vacancy">16. Previsualización de Oferta (/preview/vacancy)</option>
          </optgroup>

          <optgroup label="Moderación & Gobernanza (Requiere Rol Mod/Admin)">
            <option value="/mod/incidents">17. Bandeja de Incidentes (/mod/incidents)</option>
            <option value="/mod/verifications">18. Verificaciones SAT KYC (/mod/verifications)</option>
            <option value="/mod/appeals">19. Centro de Apelaciones (/mod/appeals)</option>
            <option value="/mod/skills">20. Gobernanza de Habilidades (/mod/skills)</option>
            <option value="/mod/audit-logs">21. Bitácora de Auditoría [RF-130] (/mod/audit-logs)</option>
            <option value="/mod/support">22. Mesa de Ayuda Moderación (/mod/support)</option>
          </optgroup>

          <optgroup label="Administración Central (Requiere Rol Admin)">
            <option value="/admin">23. Monitoreo Cloud de Infraestructura [RF-129] (/admin)</option>
            <option value="/admin/analytics">24. Analítica Ejecutiva y Anomalías (/admin/analytics)</option>
            <option value="/admin/push">25. Campañas Web Push Masivas [RF-128] (/admin/push)</option>
            <option value="/admin/organizations">26. Control y Sanción de Organizaciones (/admin/organizations)</option>
            <option value="/admin/catalog">27. Catálogo Maestro de Habilidades (/admin/catalog)</option>
            <option value="/admin/fraud">28. Detección de Fraude (/admin/fraud)</option>
          </optgroup>

          <optgroup label="Mensajería, Seguridad & Cuenta">
            <option value="/messages">29. Mensajería y Chat WebSocket (/messages)</option>
            <option value="/notifications">30. Centro de Notificaciones Push (/notifications)</option>
            <option value="/settings">31. Configuración de Cuenta y Documentos (/settings)</option>
            <option value="/setup-mfa">32. Configuración de MFA TOTP [RF-136] (/setup-mfa)</option>
            <option value="/link-account">33. Fusión de Cuenta Federada [RF-134] (/link-account)</option>
            <option value="/preview/post">34. Previsualización de Publicación (/preview/post)</option>
          </optgroup>
        </select>
      </div>

      <!-- Footer & Controls -->
      <div class="mt-3.5 pt-2.5 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
        <div class="flex items-center gap-1.5">
          <span class="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Modo Mock Activo</span>
        </div>
        <div class="flex items-center gap-3">
          <button
            type="button"
            @click="resetToDefault"
            class="text-indigo-400 hover:text-indigo-300 font-semibold cursor-pointer transition"
          >
            Restablecer
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useMockSession, type MockRole } from "~/composables/useMockSession";

const router = useRouter();
const route = useRoute();
const { mockRole, currentMockUser, setMockRole, availableRoles } = useMockSession();

const isOpen = ref(false);
const selectedRoute = ref("");

const roleOptions = [
  { value: "CANDIDATO" as MockRole, label: "Candidato", icon: "person" },
  { value: "EMPRESA" as MockRole, label: "Empresa", icon: "corporate_fare" },
  { value: "MODERATOR" as MockRole, label: "Moderador", icon: "shield" },
  { value: "ADMIN" as MockRole, label: "Admin", icon: "admin_panel_settings" },
  { value: "GUEST" as MockRole, label: "Público", icon: "public" },
];

const totalRoutesCount = 34;

const selectRole = (role: MockRole) => {
  setMockRole(role);
  // Auto navigate if current route is role protected
  if (role === "ADMIN" && !route.path.startsWith("/admin") && !route.path.startsWith("/mod")) {
    router.push("/admin");
  } else if (
    role === "EMPRESA" &&
    !route.path.startsWith("/my-vacancies") &&
    !route.path.startsWith("/applicants") &&
    !route.path.startsWith("/company")
  ) {
    router.push("/applicants");
  } else if (role === "MODERATOR" && !route.path.startsWith("/mod")) {
    router.push("/mod/incidents");
  }
};

const goToRoute = () => {
  if (selectedRoute.value) {
    const target = selectedRoute.value;
    // Automatically adjust mock role if necessary for route permission
    if (target.startsWith("/admin") && mockRole.value !== "ADMIN") {
      setMockRole("ADMIN");
    } else if (target.startsWith("/mod") && mockRole.value !== "MODERATOR" && mockRole.value !== "ADMIN") {
      setMockRole("MODERATOR");
    } else if (
      (target === "/applicants" ||
        target === "/my-vacancies" ||
        target === "/create-vacancy" ||
        target.startsWith("/company/")) &&
      mockRole.value !== "EMPRESA"
    ) {
      setMockRole("EMPRESA");
    } else if (
      (target === "/candidate/my-applications" || target === "/candidate/cv-templates") &&
      mockRole.value !== "CANDIDATO"
    ) {
      setMockRole("CANDIDATO");
    }

    router.push(target);
    selectedRoute.value = "";
  }
};

const resetToDefault = () => {
  setMockRole("CANDIDATO");
  router.push("/");
};
</script>
