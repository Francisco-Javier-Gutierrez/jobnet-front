<template>
  <div
    class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm"
  >
    <div class="overflow-x-auto">
      <table class="w-full text-left border-collapse">
        <thead>
          <tr
            class="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/80 text-slate-600 dark:text-slate-300 font-bold text-xs uppercase tracking-wider"
          >
            <th class="px-6 py-4">Organización / Razón Social</th>
            <th class="px-6 py-4">RFC / Contacto</th>
            <th class="px-6 py-4">Teléfono</th>
            <th class="px-6 py-4">Registro</th>
            <th class="px-6 py-4">Estatus</th>
            <th class="px-6 py-4 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody
          class="divide-y divide-slate-100 dark:divide-slate-800/80 text-slate-600 dark:text-slate-300"
        >
          <template v-if="loading">
            <tr v-for="i in 5" :key="i" class="animate-pulse">
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div
                    class="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex-shrink-0 animate-pulse"
                  ></div>
                  <div class="space-y-2 flex-grow">
                    <div
                      class="h-4 w-32 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"
                    ></div>
                    <div
                      class="h-3 w-20 bg-slate-100 dark:bg-slate-800 rounded animate-pulse"
                    ></div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="space-y-2">
                  <div
                    class="h-3.5 w-24 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"
                  ></div>
                  <div
                    class="h-3 w-28 bg-slate-100 dark:bg-slate-800 rounded animate-pulse"
                  ></div>
                </div>
              </td>
              <td class="px-6 py-4">
                <div
                  class="h-3.5 w-20 bg-slate-100 dark:bg-slate-800 rounded animate-pulse"
                ></div>
              </td>
              <td class="px-6 py-4">
                <div
                  class="h-3.5 w-24 bg-slate-100 dark:bg-slate-800 rounded animate-pulse"
                ></div>
              </td>
              <td class="px-6 py-4">
                <div
                  class="h-6 w-16 bg-slate-200 dark:bg-slate-700 rounded-full animate-pulse"
                ></div>
              </td>
              <td class="px-6 py-4 text-right flex justify-end gap-2">
                <div
                  class="h-9 w-9 bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse"
                ></div>
                <div
                  class="h-9 w-9 bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse"
                ></div>
              </td>
            </tr>
          </template>

          <template v-else>
            <tr
              v-for="org in paginatedOrgs"
              :key="org.id"
              class="hover:bg-slate-50 dark:hover:bg-slate-800/60 border-b border-slate-100 dark:border-slate-800/70 transition duration-150"
            >
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div
                    class="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center p-1 overflow-hidden flex-shrink-0"
                  >
                    <img
                      v-if="org.fotoPerfil"
                      :src="org.fotoPerfil"
                      alt="Logo"
                      class="w-full h-full object-contain"
                    />
                    <span
                      v-else
                      class="font-bold text-slate-500 dark:text-slate-300 text-sm"
                      >{{ org.nombre.charAt(0) }}</span
                    >
                  </div>
                  <div>
                    <h4
                      class="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5"
                    >
                      {{ org.nombreComercial || org.nombre }}
                      <span
                        v-if="org.organizacionVerificada"
                        class="material-symbols-outlined text-secondary text-sm flex items-center"
                        style="font-variation-settings: &quot;FILL&quot; 1"
                        title="Organización Verificada"
                        >verified</span
                      >
                    </h4>
                    <span
                      class="text-[10px] text-slate-400 dark:text-slate-400 font-medium block"
                      >{{
                        org.razonSocial || "Razón social no registrada"
                      }}</span
                    >
                    <span
                      class="text-[10px] text-slate-400 dark:text-slate-400 font-medium"
                      >{{ org.sector || "Sector no especificado" }}</span
                    >
                  </div>
                </div>
              </td>
              <td
                class="px-6 py-4 text-xs font-mono text-slate-600 dark:text-slate-300"
              >
                <div class="flex flex-col">
                  <span class="font-bold text-slate-800 dark:text-slate-100">{{
                    org.taxId || "SIN RFC"
                  }}</span>
                  <span
                    class="text-[11px] text-slate-400 dark:text-slate-400 mt-0.5"
                    >{{ org.email }}</span
                  >
                </div>
              </td>
              <td class="px-6 py-4 text-xs text-slate-700 dark:text-slate-300">
                {{ org.telefono || "No registrado" }}
              </td>
              <td
                class="px-6 py-4 text-xs text-slate-500 dark:text-slate-400 font-mono"
              >
                {{ formatDate(org.fechaCreacion) }}
              </td>
              <td class="px-6 py-4">
                <div class="flex flex-col items-start gap-1">
                  <AppStatusBadge
                    v-if="getOrgStatusKey(org) === 'ACTIVO'"
                    status="ACTIVA"
                    size="sm"
                  />
                  <AppStatusBadge
                    v-else-if="getOrgStatusKey(org) === 'REVISION'"
                    status="EN_REVISION"
                    size="sm"
                  />
                  <AppStatusBadge v-else status="SUSPENDIDA" size="sm" />
                  <span
                    v-if="
                      getOrgStatusKey(org) === 'REVISION' &&
                      (org.suspensionGracePeriodEnd || org.fechaLimiteApelacion)
                    "
                    class="text-[9px] font-mono text-amber-600 dark:text-amber-400"
                  >
                    Vence:
                    {{
                      formatDate(
                        org.suspensionGracePeriodEnd ||
                          org.fechaLimiteApelacion,
                      )
                    }}
                  </span>
                </div>
              </td>
              <td class="px-6 py-4 text-right">
                <div class="flex items-center justify-end gap-2">
                  <button
                    @click="$emit('toggleVerification', org)"
                    :disabled="
                      getOrgStatusKey(org) !== 'ACTIVO' &&
                      !org.organizacionVerificada
                    "
                    :class="[
                      'p-2 rounded-xl transition active:scale-95 duration-100 flex items-center justify-center border',
                      org.organizacionVerificada
                        ? 'bg-secondary/15 border-secondary/30 text-secondary hover:bg-secondary hover:text-white'
                        : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-300 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 dark:hover:border-indigo-600 dark:hover:text-white',
                      {
                        'opacity-40 cursor-not-allowed':
                          getOrgStatusKey(org) !== 'ACTIVO' &&
                          !org.organizacionVerificada,
                      },
                    ]"
                    :title="
                      getOrgStatusKey(org) !== 'ACTIVO' &&
                      !org.organizacionVerificada
                        ? 'Solo se puede verificar organizaciones con estatus Activa'
                        : org.organizacionVerificada
                          ? 'Quitar Verificación de Confianza'
                          : 'Asignar Insignia de Confianza'
                    "
                  >
                    <span class="material-symbols-outlined text-[18px]"
                      >verified</span
                    >
                  </button>
                  <button
                    @click="$emit('openSanctionModal', org)"
                    class="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-300 hover:bg-rose-600 hover:text-white dark:hover:bg-rose-600 dark:hover:border-rose-600 dark:hover:text-white p-2 rounded-xl transition active:scale-95 duration-100 flex items-center justify-center"
                    title="Administrar Sanciones / Suspensión"
                  >
                    <span class="material-symbols-outlined text-[18px]"
                      >gavel</span
                    >
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="filteredOrgsLength === 0">
              <td
                colspan="6"
                class="px-6 py-12 text-center text-slate-400 dark:text-slate-500 text-sm"
              >
                No se encontraron organizaciones con los filtros seleccionados.
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>

    <div class="px-6 border-t border-slate-100 dark:border-slate-800">
      <AppPagination
        v-model:current-page="internalCurrentPage"
        :total-pages="totalPages"
        :total-items="filteredOrgsLength"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  loading: boolean;
  paginatedOrgs: any[];
  filteredOrgsLength: number;
  currentPage: number;
  totalPages: number;
  getOrgStatusKey: (org: any) => string;
}>();

const emit = defineEmits<{
  (e: "update:currentPage", value: number): void;
  (e: "toggleVerification", org: any): void;
  (e: "openSanctionModal", org: any): void;
}>();

const internalCurrentPage = computed({
  get: () => props.currentPage,
  set: (val) => emit("update:currentPage", val),
});

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
</script>
