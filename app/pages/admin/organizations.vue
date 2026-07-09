<template>
  <div
    class="max-w-7xl mx-auto px-6 py-8 w-full bg-slate-50 min-h-screen text-slate-800"
  >
    <!-- Breadcrumb and title -->
    <div
      class="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
    >
      <div>
        <h1
          class="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
        >
          Control de Organizaciones
        </h1>
        <p class="text-slate-500 text-sm mt-1">
          Visualiza, verifica y gestiona sanciones de las empresas del sistema.
        </p>
      </div>
      <button
        @click="refresh()"
        class="self-start flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold px-4 py-2.5 rounded-xl border border-slate-200 transition active:scale-95 duration-100 shadow-sm"
      >
        <span class="material-symbols-outlined text-[18px]">refresh</span>
        Sincronizar Datos
      </button>
    </div>

    <!-- Stats row -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <div
        class="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex items-center gap-4"
      >
        <div
          class="w-12 h-12 bg-indigo-600/10 text-indigo-600 rounded-xl flex items-center justify-center"
        >
          <span class="material-symbols-outlined">domain</span>
        </div>
        <div>
          <span
            class="text-[10px] text-slate-400 font-bold uppercase tracking-wider"
            >Total Empresas</span
          >
          <h2 class="text-2xl font-bold text-slate-900">{{ orgs.length }}</h2>
        </div>
      </div>

      <div
        class="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex items-center gap-4"
      >
        <div
          class="w-12 h-12 bg-emerald-600/10 text-emerald-600 rounded-xl flex items-center justify-center"
        >
          <span class="material-symbols-outlined">verified</span>
        </div>
        <div>
          <span
            class="text-[10px] text-slate-400 font-bold uppercase tracking-wider"
            >Verificadas</span
          >
          <h2 class="text-2xl font-bold text-slate-900">{{ verifiedCount }}</h2>
        </div>
      </div>

      <div
        class="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex items-center gap-4"
      >
        <div
          class="w-12 h-12 bg-amber-600/10 text-amber-600 rounded-xl flex items-center justify-center"
        >
          <span class="material-symbols-outlined">gavel</span>
        </div>
        <div>
          <span
            class="text-[10px] text-slate-400 font-bold uppercase tracking-wider"
            >En Revisión</span
          >
          <h2 class="text-2xl font-bold text-slate-900">{{ inReviewCount }}</h2>
        </div>
      </div>

      <div
        class="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex items-center gap-4"
      >
        <div
          class="w-12 h-12 bg-rose-600/10 text-rose-600 rounded-xl flex items-center justify-center"
        >
          <span class="material-symbols-outlined">block</span>
        </div>
        <div>
          <span
            class="text-[10px] text-slate-400 font-bold uppercase tracking-wider"
            >Suspendidas</span
          >
          <h2 class="text-2xl font-bold text-slate-900">
            {{ suspendedCount }}
          </h2>
        </div>
      </div>
    </div>

    <!-- Alert Notifications -->
    <div
      v-if="successMsg"
      class="mb-6 bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl flex items-center gap-2 text-sm font-semibold"
    >
      <span class="material-symbols-outlined text-lg">check_circle</span>
      {{ successMsg }}
    </div>

    <!-- Filters Section -->
    <div
      class="bg-white border border-slate-200 rounded-2xl p-6 mb-8 shadow-sm"
    >
      <h3 class="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
        <span class="material-symbols-outlined text-[18px]">filter_list</span>
        Búsqueda y Filtros de Empresas (RF-5)
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <!-- Text search -->
        <div class="md:col-span-2 relative">
          <span
            class="absolute left-3.5 top-3.5 material-symbols-outlined text-slate-400 text-lg"
            >search</span
          >
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Buscar por Nombre Comercial, Razón Social o RFC..."
            class="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 focus:border-indigo-600 focus:bg-white rounded-xl pl-10 pr-4 py-3 text-xs outline-none transition text-slate-800 shadow-inner"
          />
        </div>

        <!-- Status Verification Filter -->
        <div>
          <select
            v-model="filterVerification"
            class="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 focus:border-indigo-600 focus:bg-white rounded-xl px-4 py-3 text-xs outline-none transition text-slate-800 shadow-sm"
          >
            <option value="ALL">Todos los Estatus de Verificación</option>
            <option value="VERIFIED">Verificada (Icono Activo)</option>
            <option value="NOT_VERIFIED">No Verificada</option>
          </select>
        </div>

        <!-- Account Status Filter -->
        <div>
          <select
            v-model="filterAccountStatus"
            class="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 focus:border-indigo-600 focus:bg-white rounded-xl px-4 py-3 text-xs outline-none transition text-slate-800 shadow-sm"
          >
            <option value="ALL">Todos los Estatus de Cuenta</option>
            <option value="ACTIVO">Activa</option>
            <option value="REVISION">En Revisión (Periodo de Gracia)</option>
            <option value="SUSPENDIDA">Suspendida (Bloqueada)</option>
          </select>
        </div>
      </div>

      <!-- Secondary Date Filter -->
      <div
        class="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4 pt-4 border-t border-slate-100"
      >
        <div class="md:col-span-2 flex items-center gap-2">
          <span class="text-xs text-slate-500 font-bold whitespace-nowrap"
            >Fecha Registro:</span
          >
          <input
            v-model="filterDateStart"
            type="date"
            class="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 outline-none w-full"
          />
          <span class="text-xs text-slate-400 font-bold">a</span>
          <input
            v-model="filterDateEnd"
            type="date"
            class="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 outline-none w-full"
          />
        </div>

        <div class="md:col-span-2 flex justify-end items-center">
          <button
            @click="clearFilters"
            class="text-xs text-slate-500 hover:text-indigo-600 font-bold transition flex items-center gap-1"
          >
            <span class="material-symbols-outlined text-[14px]">backspace</span>
            Restablecer Filtros
          </button>
        </div>
      </div>
    </div>

    <!-- Table of Organizations (RF-4) -->
    <div
      class="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm"
    >
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr
              class="border-b border-slate-100 bg-slate-50/60 text-slate-500 font-bold text-xs uppercase tracking-wider"
            >
              <th class="px-6 py-4">Organización</th>
              <th class="px-6 py-4">RFC / Contacto</th>
              <th class="px-6 py-4">Teléfono</th>
              <th class="px-6 py-4">Registro</th>
              <th class="px-6 py-4">Estatus</th>
              <th class="px-6 py-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 text-slate-600">
            <tr
              v-for="org in paginatedOrgs"
              :key="org.id"
              class="hover:bg-slate-50/60 transition duration-150"
            >
              <!-- Org Name & Logo -->
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div
                    class="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center p-1 overflow-hidden flex-shrink-0"
                  >
                    <img
                      v-if="org.fotoPerfil"
                      :src="org.fotoPerfil"
                      alt="Logo"
                      class="w-full h-full object-contain"
                    />
                    <span v-else class="font-bold text-slate-400 text-sm">{{
                      org.nombre.charAt(0)
                    }}</span>
                  </div>
                  <div>
                    <h4
                      class="text-sm font-bold text-slate-900 flex items-center gap-1.5"
                    >
                      {{ org.nombre }}
                      <!-- RF-6 Verification icon in public profile -->
                      <span
                        v-if="org.organizacionVerificada"
                        class="material-symbols-outlined text-secondary text-sm flex items-center"
                        style="font-variation-settings: &quot;FILL&quot; 1"
                        title="Empresa Verificada"
                      >
                        verified
                      </span>
                    </h4>
                    <span class="text-[10px] text-slate-400 font-medium">{{
                      org.sector || "Sector no especificado"
                    }}</span>
                  </div>
                </div>
              </td>

              <!-- RFC & Email -->
              <td class="px-6 py-4">
                <p class="text-xs font-mono text-slate-800">
                  {{ org.taxId || "SIN RFC" }}
                </p>
                <p class="text-[11px] text-slate-400 mt-0.5">{{ org.email }}</p>
              </td>

              <!-- Phone -->
              <td class="px-6 py-4 text-xs text-slate-700">
                {{ org.telefono || "No registrado" }}
              </td>

              <!-- Registration Date -->
              <td class="px-6 py-4 text-xs font-mono text-slate-500">
                {{ formatDate(org.fechaCreacion) }}
              </td>

              <!-- Status Badge -->
              <td class="px-6 py-4">
                <span
                  :class="[
                    'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider',
                    org.estadoCuenta === 'ACTIVO'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : '',
                    org.estadoCuenta === 'REVISION'
                      ? 'bg-amber-50 text-amber-700 border border-amber-200'
                      : '',
                    org.estadoCuenta === 'SUSPENDIDA'
                      ? 'bg-rose-50 text-rose-700 border border-rose-200'
                      : '',
                  ]"
                >
                  <span class="w-1.5 h-1.5 rounded-full bg-current"></span>
                  {{
                    org.estadoCuenta === "ACTIVO"
                      ? "Activa"
                      : org.estadoCuenta === "REVISION"
                        ? "En Revisión"
                        : "Suspendida"
                  }}
                </span>
              </td>

              <!-- Actions -->
              <td class="px-6 py-4 text-right">
                <div class="flex items-center justify-end gap-2">
                  <!-- RF-6 Verify Insignia Trigger -->
                  <button
                    @click="toggleVerification(org)"
                    :class="[
                      'p-2 rounded-xl transition active:scale-95 duration-100 flex items-center justify-center border',
                      org.organizacionVerificada
                        ? 'bg-secondary/10 border-secondary/20 text-secondary hover:bg-secondary hover:text-white'
                        : 'bg-white border-slate-200 text-slate-400 hover:bg-indigo-600 hover:text-white hover:border-indigo-600',
                    ]"
                    :title="
                      org.organizacionVerificada
                        ? 'Quitar Verificación de Confianza'
                        : 'Asignar Insignia de Confianza'
                    "
                  >
                    <span class="material-symbols-outlined text-[18px]"
                      >verified</span
                    >
                  </button>

                  <!-- RF-7 Sanctioning Button -->
                  <button
                    @click="openSanctionModal(org)"
                    class="bg-white border border-slate-200 hover:border-rose-600 hover:text-rose-600 p-2 rounded-xl text-slate-400 transition active:scale-95 duration-100 flex items-center justify-center"
                    title="Administrar Sanciones / Suspensión"
                  >
                    <span class="material-symbols-outlined text-[18px]"
                      >gavel</span
                    >
                  </button>
                </div>
              </td>
            </tr>

            <!-- Empty State -->
            <tr v-if="filteredOrgs.length === 0">
              <td
                colspan="6"
                class="px-6 py-12 text-center text-slate-400 text-sm"
              >
                No se encontraron organizaciones con los filtros seleccionados.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Table Pagination footer -->
      <div
        v-if="totalPages > 1"
        class="px-6 py-4 bg-slate-50/60 border-t border-slate-100 flex items-center justify-between"
      >
        <span class="text-xs text-slate-500"
          >Mostrando página {{ currentPage }} de {{ totalPages }} ({{
            filteredOrgs.length
          }}
          total)</span
        >
        <div class="flex items-center gap-1.5">
          <button
            @click="currentPage = Math.max(1, currentPage - 1)"
            :disabled="currentPage === 1"
            class="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 disabled:opacity-40 transition"
          >
            <span class="material-symbols-outlined text-sm flex items-center"
              >chevron_left</span
            >
          </button>
          <button
            v-for="p in totalPages"
            :key="p"
            @click="currentPage = p"
            :class="[
              'w-8 h-8 rounded-lg border font-bold text-xs flex items-center justify-center transition',
              currentPage === p
                ? 'bg-indigo-600 text-white border-indigo-600'
                : 'border-slate-200 text-slate-600 hover:bg-slate-100',
            ]"
          >
            {{ p }}
          </button>
          <button
            @click="currentPage = Math.min(totalPages, currentPage + 1)"
            :disabled="currentPage === totalPages"
            class="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 disabled:opacity-40 transition"
          >
            <span class="material-symbols-outlined text-sm flex items-center"
              >chevron_right</span
            >
          </button>
        </div>
      </div>
    </div>

    <!-- RF-7 Sanction Modal Drawer -->
    <div
      v-if="isSanctionModalOpen"
      class="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <div
        class="bg-white border border-slate-200 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl animate-fade-in"
      >
        <!-- Header -->
        <div
          class="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between"
        >
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-amber-500">gavel</span>
            <h3 class="text-md font-bold text-slate-850">
              Sanciones Administrativas: {{ selectedOrg?.nombre }}
            </h3>
          </div>
          <button
            @click="isSanctionModalOpen = false"
            class="text-slate-400 hover:text-slate-700 transition"
          >
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>

        <!-- Content -->
        <div class="p-6 space-y-6">
          <!-- Stepper Overview of Sanction Status -->
          <div class="relative flex items-center justify-between mb-8">
            <div
              class="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-0.5 bg-slate-100 z-0"
            ></div>
            <!-- Step indicators -->
            <div
              v-for="step in sanctionSteps"
              :key="step.number"
              class="relative z-10 flex flex-col items-center gap-1.5"
            >
              <div
                :class="[
                  'w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs border transition duration-300',
                  isStepActive(step.number)
                    ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                    : 'bg-slate-50 border-slate-200 text-slate-400',
                ]"
              >
                {{ step.number }}
              </div>
              <span
                class="text-[10px] font-bold uppercase tracking-wider text-slate-400"
                >{{ step.label }}</span
              >
            </div>
          </div>

          <!-- Description box -->
          <div
            class="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-4"
          >
            <!-- Phase details -->
            <div
              v-if="
                selectedOrg?.estadoCuenta === 'ACTIVO' ||
                !selectedOrg?.estadoCuenta
              "
            >
              <h4
                class="text-xs font-bold text-emerald-600 flex items-center gap-1.5 mb-1.5"
              >
                <span class="material-symbols-outlined text-sm"
                  >check_circle</span
                >
                Fase 1: Cuenta Activa sin Sanciones
              </h4>
              <p class="text-xs text-slate-500 leading-relaxed">
                La cuenta de la organización está en buen estado. Si se ha
                reportado una infracción, puede colocar la cuenta en estado de
                <strong class="text-slate-800">Revisión</strong>. Esto iniciará
                un periodo de gracia y le enviará una notificación de
                advertencia por correo a la empresa.
              </p>
            </div>

            <div v-else-if="selectedOrg?.estadoCuenta === 'REVISION'">
              <h4
                class="text-xs font-bold text-amber-600 flex items-center gap-1.5 mb-1.5"
              >
                <span class="material-symbols-outlined text-sm">warning</span>
                Fase 2: Periodo de Apelación Activo
              </h4>
              <p class="text-xs text-slate-500 leading-relaxed">
                La cuenta está en periodo de gracia. El acceso del usuario no se
                bloquea temporalmente. La fecha límite de apelación expira el
                <strong class="text-slate-800 font-mono">{{
                  formatDate(selectedOrg?.fechaLimiteApelacion)
                }}</strong
                >.
              </p>

              <!-- MOCK APPEAL DETAILS -->
              <div
                class="mt-4 bg-white border border-slate-100 rounded-xl p-4 space-y-2 shadow-sm"
              >
                <span
                  class="text-[10px] text-indigo-600 font-bold uppercase tracking-wider"
                  >Apelación Recibida (Canal Soporte)</span
                >
                <p class="text-xs italic text-slate-600">
                  "Hola equipo de soporte. Hemos corregido el texto de la
                  vacante de Desarrollador Junior que contenía información
                  confidencial de un cliente, lo cual violaba las normas.
                  Solicitamos se retire la revisión del perfil corporativo."
                </p>
                <div class="text-[10px] text-slate-400 font-mono mt-1">
                  Enviado: Hace 1 día | Evidencia adjunta:
                  correccion_vacante.pdf
                </div>
              </div>
            </div>

            <div v-else-if="selectedOrg?.estadoCuenta === 'SUSPENDIDA'">
              <h4
                class="text-xs font-bold text-rose-600 flex items-center gap-1.5 mb-1.5"
              >
                <span class="material-symbols-outlined text-sm">cancel</span>
                Fase 3: Cuenta Suspendida por Infracción
              </h4>
              <p class="text-xs text-slate-500 leading-relaxed">
                El dictamen de apelación fue desfavorable (o concluyó el periodo
                de gracia). El inicio de sesión se encuentra bloqueado de forma
                definitiva y todas sus ofertas han sido retiradas de los
                listados de JobNet.
              </p>
            </div>
          </div>

          <!-- Controls by state -->
          <div class="flex flex-col gap-4">
            <!-- Phase 1: Action (Put in Review) -->
            <div
              v-if="
                selectedOrg?.estadoCuenta === 'ACTIVO' ||
                !selectedOrg?.estadoCuenta
              "
              class="space-y-4"
            >
              <h4 class="text-xs font-bold text-slate-800">
                Iniciar Sanción (Colocar en Revisión)
              </h4>
              <div class="flex gap-4">
                <button
                  @click="applySanction('REVISION')"
                  class="flex-1 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs px-4 py-3 rounded-xl transition shadow active:scale-95 duration-100 flex items-center justify-center gap-2"
                >
                  <span class="material-symbols-outlined text-[18px]"
                    >warning</span
                  >
                  Notificar Infracción e Iniciar Revisión
                </button>
              </div>
            </div>

            <!-- Phase 2: Action (Resolve Appeal) -->
            <div
              v-else-if="selectedOrg?.estadoCuenta === 'REVISION'"
              class="space-y-4"
            >
              <h4 class="text-xs font-bold text-slate-800">
                Emitir Dictamen de Apelación (Fase 3)
              </h4>
              <div class="flex flex-col sm:flex-row gap-3">
                <button
                  @click="applySanction('ACTIVO')"
                  class="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-3 rounded-xl transition shadow active:scale-95 duration-100 flex items-center justify-center gap-2"
                >
                  <span class="material-symbols-outlined text-[18px]"
                    >task_alt</span
                  >
                  Aceptar Apelación (Revocar)
                </button>
                <button
                  @click="applySanction('SUSPENDIDA')"
                  class="flex-1 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs px-4 py-3 rounded-xl transition shadow active:scale-95 duration-100 flex items-center justify-center gap-2"
                >
                  <span class="material-symbols-outlined text-[18px]"
                    >block</span
                  >
                  Rechazar Apelación y Suspender
                </button>
              </div>
            </div>

            <!-- Phase 3: Action (Reactivate / Lift suspension) -->
            <div
              v-else-if="selectedOrg?.estadoCuenta === 'SUSPENDIDA'"
              class="space-y-4"
            >
              <h4 class="text-xs font-bold text-slate-800">
                Rehabilitación de Cuenta
              </h4>
              <p class="text-xs text-slate-500">
                Si la empresa ha justificado debidamente la infracción de forma
                posterior, puede reactivar su cuenta a su estado normal de forma
                manual.
              </p>
              <button
                @click="applySanction('ACTIVO')"
                class="w-full bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs px-4 py-3 rounded-xl border border-slate-200 transition active:scale-95 duration-100 flex items-center justify-center gap-2 shadow-sm"
              >
                <span class="material-symbols-outlined text-[18px]"
                  >restore</span
                >
                Reactivar Cuenta a Normal (Activa)
              </button>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div
          class="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end"
        >
          <button
            @click="isSanctionModalOpen = false"
            class="bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold px-4 py-2.5 rounded-xl border border-slate-200 transition shadow-sm"
          >
            Cerrar Ventana
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

// Use layout admin
definePageMeta({
  layout: "admin",
});

useSeoMeta({
  title: "Control de Organizaciones - Administrador",
  description:
    "Tabla de control maestro y gestión de sanciones de empresas registradas en JobNet",
});

const config = useRuntimeConfig();

// Search and Filters reactive states
const searchQuery = ref("");
const filterVerification = ref<"ALL" | "VERIFIED" | "NOT_VERIFIED">("ALL");
const filterAccountStatus = ref<"ALL" | "ACTIVO" | "REVISION" | "SUSPENDIDA">(
  "ALL",
);
const filterDateStart = ref("");
const filterDateEnd = ref("");

// Notifications
const successMsg = ref("");

// Pagination
const currentPage = ref(1);
const itemsPerPage = 20;

// Sanction Stepper step setup
const sanctionSteps = [
  { number: 1, label: "Activa" },
  { number: 2, label: "En Revisión (Apelando)" },
  { number: 3, label: "Dictamen Final" },
];

// Sanction Modal States
const isSanctionModalOpen = ref(false);
const selectedOrg = ref<any | null>(null);

// Fetch data from DynamoDB listProfiles endpoint
const { data: rawProfiles, refresh } = await useAsyncData(
  "admin-profiles-list",
  () =>
    $fetch(`${config.public.apiUrl}/profiles`)
      .then((res) => (typeof res === "string" ? JSON.parse(res) : res))
      .catch(() => []),
);

// Derived Companies computed list
const orgs = computed(() => {
  return (rawProfiles.value || []).filter(
    (p: any) => p.tipoUsuario === "EMPRESA",
  );
});

// Stats Computed values
const verifiedCount = computed(
  () => orgs.value.filter((o: any) => o.organizacionVerificada).length,
);
const inReviewCount = computed(
  () => orgs.value.filter((o: any) => o.estadoCuenta === "REVISION").length,
);
const suspendedCount = computed(
  () => orgs.value.filter((o: any) => o.estadoCuenta === "SUSPENDIDA").length,
);

// Date formatting helper
const formatDate = (isoString: string) => {
  if (!isoString) return "N/A";
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return "N/A";
    return d.toLocaleDateString("es-MX", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch (e) {
    return "N/A";
  }
};

// Clear filter controls
const clearFilters = () => {
  searchQuery.value = "";
  filterVerification.value = "ALL";
  filterAccountStatus.value = "ALL";
  filterDateStart.value = "";
  filterDateEnd.value = "";
};

// Stepper highlighted status helper
const isStepActive = (stepNum: number) => {
  if (!selectedOrg.value) return false;
  const status = selectedOrg.value.estadoCuenta;
  if (status === "ACTIVO" || !status) {
    return stepNum === 1;
  } else if (status === "REVISION") {
    return stepNum <= 2;
  } else if (status === "SUSPENDIDA") {
    return stepNum <= 3;
  }
  return false;
};

// Filtered list applying Search (RF-5)
const filteredOrgs = computed(() => {
  let list = [...orgs.value];

  // Search input matching
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase().trim();
    list = list.filter(
      (o: any) =>
        (o.nombre || "").toLowerCase().includes(q) ||
        (o.taxId || "").toLowerCase().includes(q) ||
        (o.email || "").toLowerCase().includes(q),
    );
  }

  // Verification filter
  if (filterVerification.value === "VERIFIED") {
    list = list.filter((o: any) => o.organizacionVerificada);
  } else if (filterVerification.value === "NOT_VERIFIED") {
    list = list.filter((o: any) => !o.organizacionVerificada);
  }

  // Account status filter
  if (filterAccountStatus.value !== "ALL") {
    list = list.filter(
      (o: any) => o.estadoCuenta === filterAccountStatus.value,
    );
  }

  // Date range filters
  if (filterDateStart.value) {
    const start = new Date(filterDateStart.value).getTime();
    list = list.filter(
      (o: any) =>
        o.fechaCreacion && new Date(o.fechaCreacion).getTime() >= start,
    );
  }
  if (filterDateEnd.value) {
    const end = new Date(filterDateEnd.value).getTime();
    list = list.filter(
      (o: any) => o.fechaCreacion && new Date(o.fechaCreacion).getTime() <= end,
    );
  }

  return list;
});

// Paginating filtered results
const totalPages = computed(() =>
  Math.ceil(filteredOrgs.value.length / itemsPerPage),
);
const paginatedOrgs = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return filteredOrgs.value.slice(start, start + itemsPerPage);
});

// RF-6 toggle trust verification badge
const toggleVerification = async (org: any) => {
  try {
    const nextStatus = !org.organizacionVerificada;
    org.organizacionVerificada = nextStatus; // Optimistic update

    await $fetch(`${config.public.apiUrl}/profile/${org.id}`, {
      method: "POST",
      body: {
        organizacionVerificada: nextStatus,
      },
    });

    successMsg.value = `Estatus de verificación actualizado con éxito para ${org.nombre}.`;
    setTimeout(() => (successMsg.value = ""), 4000);
    await refresh();
  } catch (e) {
    console.error("Error setting verification status:", e);
  }
};

// Opening sanction modal dialog (RF-7)
const openSanctionModal = (org: any) => {
  selectedOrg.value = org;
  isSanctionModalOpen.value = true;
};

// RF-7 apply sanction status transitions (Fases 1, 2, 3)
const applySanction = async (
  newStatus: "ACTIVO" | "REVISION" | "SUSPENDIDA",
) => {
  if (!selectedOrg.value) return;
  try {
    const org = selectedOrg.value;
    const bodyUpdate: Record<string, any> = {
      estadoCuenta: newStatus,
    };

    if (newStatus === "REVISION") {
      // Set 15 days grace period limit date
      const graceLimit = new Date();
      graceLimit.setDate(graceLimit.getDate() + 15);
      bodyUpdate.fechaLimiteApelacion = graceLimit.toISOString();
      bodyUpdate.diasGracia = 15;
    }

    await $fetch(`${config.public.apiUrl}/profile/${org.id}`, {
      method: "POST",
      body: bodyUpdate,
    });

    // Notify simulated email sending
    if (newStatus === "REVISION") {
      successMsg.value = `Fase 1 completada: Notificación oficial de infracción enviada a ${org.email} y perfil puesto en estado de Revisión.`;
    } else if (newStatus === "ACTIVO" && org.estadoCuenta === "REVISION") {
      successMsg.value = `Fase 3 completada: Apelación evaluada favorablemente. Sanción revocada y cuenta devuelta a la normalidad para ${org.nombre}.`;
    } else if (newStatus === "SUSPENDIDA") {
      successMsg.value = `Fase 3 completada: Dictamen final desfavorable emitido. Cuenta de ${org.nombre} suspendida definitivamente y vacantes ocultadas.`;
    } else {
      successMsg.value = `Estatus de cuenta actualizado con éxito a ${newStatus}.`;
    }

    isSanctionModalOpen.value = false;
    setTimeout(() => (successMsg.value = ""), 5000);
    await refresh();
  } catch (e) {
    console.error("Error applying sanction status:", e);
  }
};
</script>
