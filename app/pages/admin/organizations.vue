<template>
  <div
    class="max-w-7xl mx-auto px-6 py-8 w-full bg-slate-50 dark:bg-slate-950 min-h-screen text-slate-800 dark:text-slate-200 dark:text-slate-100 transition-colors duration-200"
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
        <p
          class="text-slate-500 dark:text-slate-400 dark:text-slate-500 text-sm mt-1"
        >
          Visualiza, verifica y gestiona sanciones de las empresas del sistema.
        </p>
      </div>
      <button
        @click="refresh()"
        class="self-start flex items-center gap-2 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 dark:text-slate-200 text-xs font-bold px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 transition active:scale-95 duration-100 shadow-sm"
      >
        <span class="material-symbols-outlined text-[18px]">refresh</span>
        Sincronizar Datos
      </button>
    </div>

    <!-- Stats row -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <div
        class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 dark:border-slate-800 rounded-2xl p-5 shadow-sm flex items-center gap-4"
      >
        <div
          class="w-12 h-12 bg-indigo-600/10 text-indigo-600 rounded-xl flex items-center justify-center"
        >
          <span class="material-symbols-outlined">domain</span>
        </div>
        <div>
          <span
            class="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider"
            >Total Empresas</span
          >
          <h2 class="text-2xl font-bold text-slate-900 dark:text-slate-100">
            {{ orgs.length }}
          </h2>
        </div>
      </div>

      <div
        class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 dark:border-slate-800 rounded-2xl p-5 shadow-sm flex items-center gap-4"
      >
        <div
          class="w-12 h-12 bg-emerald-600/10 text-emerald-600 rounded-xl flex items-center justify-center"
        >
          <span class="material-symbols-outlined">verified</span>
        </div>
        <div>
          <span
            class="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider"
            >Verificadas</span
          >
          <h2 class="text-2xl font-bold text-slate-900 dark:text-slate-100">
            {{ verifiedCount }}
          </h2>
        </div>
      </div>

      <div
        class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 dark:border-slate-800 rounded-2xl p-5 shadow-sm flex items-center gap-4"
      >
        <div
          class="w-12 h-12 bg-amber-600/10 text-amber-600 rounded-xl flex items-center justify-center"
        >
          <span class="material-symbols-outlined">gavel</span>
        </div>
        <div>
          <span
            class="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider"
            >En Revisión</span
          >
          <h2 class="text-2xl font-bold text-slate-900 dark:text-slate-100">
            {{ inReviewCount }}
          </h2>
        </div>
      </div>

      <div
        class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 dark:border-slate-800 rounded-2xl p-5 shadow-sm flex items-center gap-4"
      >
        <div
          class="w-12 h-12 bg-rose-600/10 text-rose-600 rounded-xl flex items-center justify-center"
        >
          <span class="material-symbols-outlined">block</span>
        </div>
        <div>
          <span
            class="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider"
            >Suspendidas</span
          >
          <h2 class="text-2xl font-bold text-slate-900 dark:text-slate-100">
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
      class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 dark:border-slate-800 rounded-2xl p-6 mb-8 shadow-sm"
    >
      <h3
        class="text-sm font-bold text-slate-700 dark:text-slate-300 mb-4 flex items-center gap-2"
      >
        <span class="material-symbols-outlined text-[18px]">filter_list</span>
        Búsqueda y Filtros de Empresas
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <!-- Text search with Buscar button -->
        <form
          @submit.prevent="executeServerSearch"
          class="md:col-span-2 flex gap-2"
        >
          <div class="relative flex-grow">
            <span
              class="absolute left-3.5 top-3.5 material-symbols-outlined text-slate-400 dark:text-slate-500 text-lg"
              >search</span
            >
            <input
              v-model="searchInput"
              type="text"
              placeholder="Buscar por Nombre Comercial, Razón Social o RFC..."
              class="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 hover:border-slate-300 focus:border-indigo-600 focus:bg-white dark:focus:bg-slate-900 rounded-xl pl-10 pr-8 py-3 text-xs outline-none transition text-slate-800 dark:text-slate-200 shadow-inner"
            />
            <button
              v-if="searchInput"
              @click="clearSearchInput"
              type="button"
              class="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs font-bold"
              title="Limpiar búsqueda"
            >
              ✕
            </button>
          </div>
          <button
            type="submit"
            :disabled="loading"
            class="px-4 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs transition flex items-center gap-1.5 shadow active:scale-95 disabled:opacity-50 flex-shrink-0"
          >
            <span
              v-if="loading"
              class="animate-spin rounded-full h-3.5 w-3.5 border-2 border-white border-t-transparent"
            ></span>
            <span v-else class="material-symbols-outlined text-base"
              >search</span
            >
            <span>Buscar</span>
          </button>
        </form>

        <!-- Status Verification Filter -->
        <div>
          <AppSelect
            v-model="filterVerification"
            :options="[
              { value: 'ALL', label: 'Todos los Estatus de Verificación' },
              {
                value: 'VERIFIED',
                label: 'Verificada (Icono Activo)',
                icon: 'verified',
              },
              { value: 'NOT_VERIFIED', label: 'No Verificada' },
            ]"
          />
        </div>

        <!-- Account Status Filter -->
        <div>
          <AppSelect
            v-model="filterAccountStatus"
            :options="[
              { value: 'ALL', label: 'Todos los Estatus de Cuenta' },
              { value: 'ACTIVO', label: 'Activa', icon: 'check_circle' },
              { value: 'REVISION', label: 'En Revisión', icon: 'warning' },
              {
                value: 'SUSPENDIDA',
                label: 'Suspendida (Bloqueada)',
                icon: 'block',
              },
            ]"
          />
        </div>
      </div>

      <!-- Secondary Date Filter -->
      <div
        class="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800"
      >
        <div class="md:col-span-2 flex items-center gap-2">
          <span
            class="text-xs text-slate-500 dark:text-slate-400 dark:text-slate-500 font-bold whitespace-nowrap"
            >Fecha Registro:</span
          >
          <input
            v-model="filterDateStart"
            type="date"
            class="bg-slate-50 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-700 dark:text-slate-300 outline-none w-full"
          />
          <span class="text-xs text-slate-400 dark:text-slate-500 font-bold"
            >a</span
          >
          <input
            v-model="filterDateEnd"
            type="date"
            class="bg-slate-50 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-700 dark:text-slate-300 outline-none w-full"
          />
        </div>

        <div class="md:col-span-2 flex justify-end items-center">
          <button
            @click="clearFilters"
            class="text-xs text-slate-500 dark:text-slate-400 dark:text-slate-500 hover:text-indigo-600 font-bold transition flex items-center gap-1"
          >
            <span class="material-symbols-outlined text-[14px]">backspace</span>
            Restablecer Filtros
          </button>
        </div>
      </div>
    </div>

    <!-- Table of Organizations (RF-4) -->
    <div
      class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm"
    >
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr
              class="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/80 text-slate-600 dark:text-slate-300 font-bold text-xs uppercase tracking-wider"
            >
              <th class="px-6 py-4">Organización</th>
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
            <!-- Skeleton Rows -->
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
                <!-- Org Name & Logo -->
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
                      <span
                        class="text-[10px] text-slate-400 dark:text-slate-400 font-medium"
                        >{{ org.sector || "Sector no especificado" }}</span
                      >
                    </div>
                  </div>
                </td>

                <!-- RFC & Email -->
                <td
                  class="px-6 py-4 text-xs font-mono text-slate-600 dark:text-slate-300"
                >
                  <div class="flex flex-col">
                    <span
                      class="font-bold text-slate-800 dark:text-slate-100"
                      >{{ org.taxId || "SIN RFC" }}</span
                    >
                    <span
                      class="text-[11px] text-slate-400 dark:text-slate-400 mt-0.5"
                      >{{ org.email }}</span
                    >
                  </div>
                </td>

                <!-- Phone -->
                <td
                  class="px-6 py-4 text-xs text-slate-700 dark:text-slate-300"
                >
                  {{ org.telefono || "No registrado" }}
                </td>

                <!-- Reg Date -->
                <td
                  class="px-6 py-4 text-xs text-slate-500 dark:text-slate-400 font-mono"
                >
                  {{ formatDate(org.fechaCreacion) }}
                </td>

                <!-- Account Status Badge -->
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
                        (org.suspensionGracePeriodEnd ||
                          org.fechaLimiteApelacion)
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

                <!-- Actions -->
                <td class="px-6 py-4 text-right">
                  <div class="flex items-center justify-end gap-2">
                    <!-- RF-6 Verify Insignia Trigger -->
                    <button
                      @click="toggleVerification(org)"
                      :class="[
                        'p-2 rounded-xl transition active:scale-95 duration-100 flex items-center justify-center border',
                        org.organizacionVerificada
                          ? 'bg-secondary/15 border-secondary/30 text-secondary hover:bg-secondary hover:text-white'
                          : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-300 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 dark:hover:border-indigo-600 dark:hover:text-white',
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

              <!-- Empty State -->
              <tr v-if="filteredOrgs.length === 0">
                <td
                  colspan="6"
                  class="px-6 py-12 text-center text-slate-400 dark:text-slate-500 text-sm"
                >
                  No se encontraron organizaciones con los filtros
                  seleccionados.
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>

      <div class="px-6 border-t border-slate-100 dark:border-slate-800">
        <AppPagination
          v-model:current-page="currentPage"
          :total-pages="totalPages"
          :total-items="filteredOrgs.length"
        />
      </div>
    </div>

    <!-- RF-7 Sanction Modal Drawer -->
    <div
      v-if="isSanctionModalOpen"
      class="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
    >
      <div
        class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl animate-fade-in my-auto"
      >
        <!-- Header -->
        <div
          class="px-6 py-4 bg-slate-50 dark:bg-slate-800/90 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between flex-shrink-0"
        >
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-amber-500">gavel</span>
            <h3 class="text-md font-bold text-slate-900 dark:text-slate-100">
              Sanciones Administrativas: {{ selectedOrg?.nombre }}
            </h3>
          </div>
          <button
            @click="isSanctionModalOpen = false"
            class="text-slate-400 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition"
          >
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>

        <!-- Content -->
        <div class="p-6 space-y-6 overflow-y-auto flex-1">
          <!-- Stepper Overview of Sanction Status -->
          <div class="relative flex items-center justify-between mb-8">
            <div
              class="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-0.5 bg-slate-100 dark:bg-slate-800 z-0"
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
                    : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-400',
                ]"
              >
                {{ step.number }}
              </div>
              <span
                class="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400"
                >{{ step.label }}</span
              >
            </div>
          </div>

          <!-- Description box -->
          <div
            class="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-2xl p-4 space-y-4"
          >
            <!-- Phase details -->
            <div v-if="getOrgStatusKey(selectedOrg) === 'ACTIVO'">
              <h4
                class="text-xs font-bold text-emerald-600 flex items-center gap-1.5 mb-1.5"
              >
                <span class="material-symbols-outlined text-sm"
                  >check_circle</span
                >
                Fase 1 — Cuenta activa
              </h4>
              <p
                class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed"
              >
                La cuenta está activa. Al iniciar el proceso de suspensión, el
                sistema **no bloquea** inmediatamente la cuenta, sino que la
                coloca en estado de
                <strong class="text-slate-800 dark:text-slate-200"
                  >Revisión</strong
                >, envía una notificación oficial a la empresa y otorga un
                periodo de gracia (4 días por defecto) para apelar.
              </p>
            </div>

            <div v-else-if="getOrgStatusKey(selectedOrg) === 'REVISION'">
              <h4
                class="text-xs font-bold text-amber-600 flex items-center gap-1.5 mb-1.5"
              >
                <span class="material-symbols-outlined text-sm">warning</span>
                Fase 2 — Periodo de apelación activo
              </h4>
              <p
                class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-3"
              >
                La empresa está en periodo de gracia. Puede enviar
                justificaciones y evidencia a través del canal de soporte.
              </p>
              <NuxtLink
                to="/mod/support"
                @click="isSanctionModalOpen = false"
                class="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-50 dark:bg-indigo-950/40 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 rounded-xl text-xs font-bold transition shadow-sm"
              >
                <span class="material-symbols-outlined text-sm">forum</span>
                <span>Ver Canal de Apelación en Chat WS</span>
              </NuxtLink>
            </div>

            <div v-else-if="getOrgStatusKey(selectedOrg) === 'SUSPENDIDA'">
              <h4
                class="text-xs font-bold text-rose-600 flex items-center gap-1.5 mb-1.5"
              >
                <span class="material-symbols-outlined text-sm">cancel</span>
                Fase 3 — Cuenta suspendida
              </h4>
              <p
                class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed"
              >
                El dictamen de apelación fue desfavorable (o concluyó el periodo
                de gracia). El inicio de sesión se encuentra bloqueado de forma
                definitiva y todas sus ofertas han sido ocultadas del Job Board.
              </p>
            </div>
          </div>

          <!-- Controls by state -->
          <div class="flex flex-col gap-4">
            <!-- Phase 1: Action (Put in Review) -->
            <div
              v-if="getOrgStatusKey(selectedOrg) === 'ACTIVO'"
              class="space-y-4"
            >
              <h4 class="text-xs font-bold text-slate-800 dark:text-slate-200">
                Iniciar proceso de suspensión
              </h4>
              <div
                class="space-y-3 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-800"
              >
                <div>
                  <label
                    class="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1"
                    >Motivo / Descripción de Infracción</label
                  >
                  <input
                    v-model="suspensionReasonInput"
                    type="text"
                    placeholder="Ej. Publicación de ofertas engañosas o infracción de términos"
                    class="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-xs outline-none text-slate-800 dark:text-slate-200"
                  />
                </div>
                <div>
                  <label
                    class="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1"
                    >Días de Gracia para Apelar</label
                  >
                  <input
                    v-model.number="graceDaysInput"
                    type="number"
                    min="1"
                    max="15"
                    class="w-24 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-xs outline-none text-slate-800 dark:text-slate-200"
                  />
                </div>
              </div>
              <button
                @click="applySanction('INITIATE')"
                class="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs px-4 py-3 rounded-xl transition shadow active:scale-95 duration-100 flex items-center justify-center gap-2"
              >
                <span class="material-symbols-outlined text-[18px]"
                  >warning</span
                >
                Notificar infracción e iniciar periodo de gracia
              </button>
            </div>

            <!-- Fase 2 — Emitir dictamen -->
            <div
              v-else-if="getOrgStatusKey(selectedOrg) === 'REVISION'"
              class="space-y-4"
            >
              <h4 class="text-xs font-bold text-slate-800 dark:text-slate-200">
                Emitir dictamen de apelación
              </h4>
              <div class="flex flex-col sm:flex-row gap-3">
                <button
                  @click="applySanction('CANCEL')"
                  class="flex-grow bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-3 rounded-xl transition shadow active:scale-95 duration-100 flex items-center justify-center gap-2"
                >
                  <span class="material-symbols-outlined text-[18px]"
                    >task_alt</span
                  >
                  Aceptar Apelación (Revocar Suspensión)
                </button>
                <button
                  @click="applySanction('CONFIRM')"
                  class="flex-grow bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs px-4 py-3 rounded-xl transition shadow active:scale-95 duration-100 flex items-center justify-center gap-2"
                >
                  <span class="material-symbols-outlined text-[18px]"
                    >block</span
                  >
                  Rechazar Apelación y Suspender Definitivamente
                </button>
              </div>
            </div>

            <!-- Fase 3 — Rehabilitación de cuenta -->
            <div
              v-else-if="getOrgStatusKey(selectedOrg) === 'SUSPENDIDA'"
              class="space-y-4"
            >
              <h4 class="text-xs font-bold text-slate-800 dark:text-slate-200">
                Rehabilitación de Cuenta
              </h4>
              <p class="text-xs text-slate-500 dark:text-slate-400">
                Si la empresa ha corregido las infracciones señaladas, el
                administrador puede reactivar su cuenta y desbloquear el acceso.
              </p>
              <button
                @click="applySanction('CANCEL')"
                class="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-3 rounded-xl transition shadow active:scale-95 duration-100 flex items-center justify-center gap-2"
              >
                <span class="material-symbols-outlined text-[18px]"
                  >restart_alt</span
                >
                Reactivar Cuenta y Desbloquear Acceso
              </button>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div
          class="px-6 py-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex justify-end flex-shrink-0"
        >
          <button
            @click="isSanctionModalOpen = false"
            class="bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 transition shadow-sm"
          >
            Cerrar Ventana
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAppFeedback } from "~/composables/useAppFeedback";
const { showError, showSuccess, showInfo } = useAppFeedback();
useSeoMeta({
  title: "Control de Organizaciones - Administrador",
  description:
    "Tabla de control maestro y gestión de sanciones de empresas registradas en JobNet",
});

const config = useRuntimeConfig();

// Search and Filters reactive states
const searchInput = ref("");
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
const sanctionType = ref<"SUSPENDIDA" | "SUSPENDIDA_TEMPORAL">("SUSPENDIDA");
const tempSuspensionDays = ref(7);
const suspensionReasonInput = ref("Infracción de términos de servicio");
const graceDaysInput = ref(4);

// Appeal Chat States
const appealMessages = ref<any[]>([]);
const newAppealMessage = ref("");
const loadingAppealMessages = ref(false);

const executeServerSearch = () => {
  searchQuery.value = searchInput.value.trim();
  currentPage.value = 1;
  refresh();
};

const clearSearchInput = () => {
  searchInput.value = "";
  searchQuery.value = "";
  currentPage.value = 1;
  refresh();
};

// Fetch data from DynamoDB listProfiles endpoint (filtered by tipoUsuario=ORGANIZACION and server q)
const {
  data: rawProfiles,
  pending: profilesPending,
  refresh,
} = useLazyAsyncData("admin-profiles-list", () => {
  const url = searchQuery.value
    ? `/api/profiles?tipoUsuario=ORGANIZACION&q=${encodeURIComponent(searchQuery.value)}`
    : "/api/profiles?tipoUsuario=ORGANIZACION";
  return $fetch<any[]>(url)
    .then((res) => (typeof res === "string" ? JSON.parse(res) : res))
    .catch(() => []);
});

const loading = computed(() => profilesPending.value);

// Derived Companies computed list with guaranteed non-undefined id
const orgs = computed(() => {
  return (rawProfiles.value || [])
    .filter(
      (p: any) =>
        p.tipoUsuario === "ORGANIZACION" ||
        p.tipoUsuario === "EMPRESA" ||
        !p.tipoUsuario,
    )
    .map((p: any) => {
      const companyId =
        p.id || p.companyId || (p.PK ? p.PK.replace("USER#", "") : "");
      return {
        ...p,
        id: companyId,
        companyId,
        nombre: p.nombreComercial || p.nombre || p.name || "Organización",
      };
    });
});

const getOrgStatusKey = (org: any): "ACTIVO" | "REVISION" | "SUSPENDIDA" => {
  if (!org) return "ACTIVO";
  const statusStr = [org.suspensionStatus, org.estatus, org.estadoCuenta]
    .filter(Boolean)
    .join(" ")
    .toUpperCase();

  if (
    statusStr.includes("REVISI") ||
    statusStr.includes("REVISION") ||
    statusStr.includes("IN_REVIEW")
  ) {
    return "REVISION";
  }
  if (statusStr.includes("SUSPEND") || statusStr.includes("BLOQUEAD")) {
    return "SUSPENDIDA";
  }
  return "ACTIVO";
};

// Stats Computed values
const verifiedCount = computed(
  () => orgs.value.filter((o: any) => o.organizacionVerificada).length,
);
const inReviewCount = computed(
  () => orgs.value.filter((o: any) => getOrgStatusKey(o) === "REVISION").length,
);
const suspendedCount = computed(
  () =>
    orgs.value.filter((o: any) => getOrgStatusKey(o) === "SUSPENDIDA").length,
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
  const statusKey = getOrgStatusKey(selectedOrg.value);
  if (statusKey === "ACTIVO") {
    return stepNum === 1;
  } else if (statusKey === "REVISION") {
    return stepNum <= 2;
  } else if (statusKey === "SUSPENDIDA") {
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
      (o: any) => getOrgStatusKey(o) === filterAccountStatus.value,
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
const openSanctionModal = async (org: any) => {
  selectedOrg.value = org;
  isSanctionModalOpen.value = true;
  appealMessages.value = [];

  // Fetch appeal chat messages if organization is in review
  if (getOrgStatusKey(org) === "REVISION") {
    fetchAppealMessages(org.id);
  }
};

const fetchAppealMessages = async (companyId: string) => {
  loadingAppealMessages.value = true;
  try {
    const res = await $fetch<any>(
      `${config.public.apiUrl}/moderator/organizations/${companyId}/appeal-messages`,
    );
    appealMessages.value = Array.isArray(res) ? res : res?.messages || [];
  } catch (e) {
    console.error("Error fetching appeal messages:", e);
  } finally {
    loadingAppealMessages.value = false;
  }
};

const sendAdminAppealMessage = async () => {
  if (!newAppealMessage.value.trim() || !selectedOrg.value) return;
  const companyId = selectedOrg.value.id;
  const text = newAppealMessage.value.trim();
  newAppealMessage.value = "";

  const msgItem = {
    companyId,
    senderId: "ADMIN",
    text,
    createdAt: new Date().toISOString(),
  };
  appealMessages.value.push(msgItem);

  try {
    // Send via API / WS
    await $fetch(
      `${config.public.apiUrl}/moderator/organizations/${companyId}/appeal-messages`,
      {
        method: "POST",
        body: { text, senderId: "ADMIN" },
      },
    ).catch(() => {});
  } catch (e) {
    console.error("Error sending appeal message:", e);
  }
};

// Transiciones de estado de sanción
const applySanction = async (
  actionType: "INITIATE" | "CANCEL" | "CONFIRM",
  reason?: string,
) => {
  if (!selectedOrg.value) return;
  const org = selectedOrg.value;

  try {
    if (actionType === "INITIATE") {
      // Fase 1 — Iniciar suspensión
      await $fetch(
        `${config.public.apiUrl}/moderator/organizations/${org.id}/initiate-suspension`,
        {
          method: "POST",
          body: {
            reason:
              suspensionReasonInput.value ||
              reason ||
              "Infracción de términos de servicio",
            graceDays: graceDaysInput.value || 4,
          },
        },
      );
      successMsg.value = `Fase 1 completada: Notificación enviada a ${org.nombre}. Cuenta en revisión (${graceDaysInput.value || 4} días de gracia).`;
    } else if (actionType === "CANCEL") {
      // Fase 3a — Revocar suspensión
      await $fetch(
        `${config.public.apiUrl}/moderator/organizations/${org.id}/cancel-suspension`,
        {
          method: "POST",
          body: {
            notes:
              "Apelación evaluada favorablemente. Suspensión revocada por el Administrador.",
          },
        },
      );
      successMsg.value = `Apelación aprobada. Cuenta de ${org.nombre} restablecida.`;
    } else if (actionType === "CONFIRM") {
      // Fase 3b — Suspensión definitiva
      await $fetch(
        `${config.public.apiUrl}/moderator/organizations/${org.id}/confirm-suspension`,
        {
          method: "POST",
          body: {
            reason:
              reason ||
              "Dictamen desfavorable tras proceso de evaluación/apelación",
          },
        },
      );
      successMsg.value = `Dictamen desfavorable emitido. Cuenta de ${org.nombre} suspendida.`;
    }

    isSanctionModalOpen.value = false;
    setTimeout(() => (successMsg.value = ""), 5000);
    await refresh();
  } catch (e: any) {
    console.error("Error applying sanction status:", e);
    showError("Error", `Error al procesar la acción: ${e.message || e}`);
  }
};
</script>
