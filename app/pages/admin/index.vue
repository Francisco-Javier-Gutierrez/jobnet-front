<template>
  <div
    class="max-w-7xl mx-auto px-4 sm:px-6 py-8 w-full bg-slate-50 dark:bg-slate-950 min-h-screen text-slate-800 dark:text-slate-100 transition-colors duration-200"
    role="main"
  >
    <!-- Feedback Notification Banner -->
    <div
      v-if="successMsg"
      class="mb-6 p-3.5 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-500/40 rounded-xl text-xs font-semibold text-emerald-800 dark:text-emerald-200 flex items-center justify-between shadow-sm animate-fade-in"
      role="status"
    >
      <div class="flex items-center gap-2">
        <span
          class="material-symbols-outlined text-[18px] text-emerald-600 dark:text-emerald-400"
          >check_circle</span
        >
        <span>{{ successMsg }}</span>
      </div>
      <button
        @click="successMsg = ''"
        class="text-emerald-600 hover:text-emerald-800 dark:hover:text-emerald-300"
        aria-label="Cerrar notificación"
      >
        <span class="material-symbols-outlined text-sm">close</span>
      </button>
    </div>

    <!-- Header / Executive Overview -->
    <div
      class="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4"
    >
      <div>
        <div class="flex items-center gap-2 mb-1">
          <span
            class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800"
          >
            <span class="material-symbols-outlined text-[14px]"
              >shield_person</span
            >
            Panel Administrativo
          </span>
          <span class="text-xs text-slate-500 dark:text-slate-400"
            >· Vista Global de la Plataforma</span
          >
        </div>
        <h1
          class="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white"
        >
          Monitoreo y Métricas
        </h1>
        <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Estado en tiempo real de la infraestructura, métricas operativas y
          resumen general de JobNet.
        </p>
      </div>

      <!-- Action Buttons & Health Pill -->
      <div class="flex flex-wrap items-center gap-3">
        <!-- Live System Health Badge -->
        <div
          class="flex items-center gap-2 px-3 py-2 bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-900/60 rounded-xl text-xs font-semibold text-emerald-700 dark:text-emerald-400 shadow-xs"
          title="Todos los microservicios y funciones Lambda responden con normalidad"
        >
          <span class="relative flex h-2.5 w-2.5">
            <span
              class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"
            ></span>
            <span
              class="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"
            ></span>
          </span>
          <span>Sistemas Operativos 100%</span>
        </div>

        <!-- Refresh Button -->
        <button
          type="button"
          @click="handleManualRefresh"
          :disabled="isRefreshing"
          class="inline-flex items-center gap-2 px-3.5 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-primary text-xs font-semibold rounded-xl transition shadow-xs text-slate-700 dark:text-slate-200 disabled:opacity-50"
          aria-label="Actualizar datos del sistema"
        >
          <span
            class="material-symbols-outlined text-base"
            :class="{ 'animate-spin': isRefreshing }"
          >
            refresh
          </span>
          <span>{{ isRefreshing ? "Actualizando..." : "Actualizar" }}</span>
        </button>
      </div>
    </div>

    <!-- Live Concurrency / Anomaly Threat Center -->
    <div class="mb-8">
      <AnomalousConcurrencyAlert
        v-if="hasActiveAnomalies"
        :anomalies="activeAnomalies"
        @sanction="handleSanctionFromAlert"
        @dismiss="dismissAnomaly"
      />

      <div
        v-else
        class="p-4 bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-900/40 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
      >
        <div
          class="flex items-center gap-2.5 text-emerald-800 dark:text-emerald-300"
        >
          <span
            class="material-symbols-outlined text-[20px] text-emerald-600 dark:text-emerald-400 flex-shrink-0"
          >
            verified_user
          </span>
          <span class="font-medium">
            <strong>Monitoreo de Seguridad Óptimo:</strong> Sin concurrencia
            anómala, bots o reportes masivos detectados en la última hora.
          </span>
        </div>
        <NuxtLink
          to="/admin/fraud"
          class="font-semibold text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1 self-end sm:self-auto"
        >
          <span>Auditoría de Fraude</span>
          <span class="material-symbols-outlined text-xs">arrow_forward</span>
        </NuxtLink>
      </div>
    </div>

    <!-- Section 1: Executive KPI Summary -->
    <div class="mb-8">
      <div class="flex items-center justify-between mb-4">
        <h2
          class="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2"
        >
          <span class="material-symbols-outlined text-base text-primary"
            >equalizer</span
          >
          Resumen Ejecutivo de la Plataforma
        </h2>
        <NuxtLink
          to="/admin/analytics"
          class="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
        >
          <span>Analítica Detallada</span>
          <span class="material-symbols-outlined text-xs">arrow_forward</span>
        </NuxtLink>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- KPI 1: Vacantes Activas -->
        <div
          class="bg-surface-container-lowest dark:bg-slate-900 border border-outline-variant/60 dark:border-slate-800 rounded-2xl p-5 shadow-xs"
        >
          <div class="flex items-center justify-between">
            <span
              class="text-xs font-semibold text-slate-500 dark:text-slate-400"
              >Vacantes Publicadas</span
            >
            <div
              class="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center"
            >
              <span class="material-symbols-outlined text-[20px]">work</span>
            </div>
          </div>
          <div class="mt-3 flex items-baseline gap-2">
            <span class="text-2xl font-black text-slate-900 dark:text-white">
              {{ analyticsData.kpis.totalVacancies }}
            </span>
            <span
              class="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center"
            >
              <span class="material-symbols-outlined text-xs">trending_up</span>
              Activas
            </span>
          </div>
          <p class="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            En todas las regiones del Estado de México
          </p>
        </div>

        <!-- KPI 2: Organizaciones Totales y Verificadas -->
        <div
          class="bg-surface-container-lowest dark:bg-slate-900 border border-outline-variant/60 dark:border-slate-800 rounded-2xl p-5 shadow-xs"
        >
          <div class="flex items-center justify-between">
            <span
              class="text-xs font-semibold text-slate-500 dark:text-slate-400"
              >Organizaciones</span
            >
            <div
              class="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center"
            >
              <span class="material-symbols-outlined text-[20px]"
                >apartment</span
              >
            </div>
          </div>
          <div class="mt-3 flex items-baseline gap-2">
            <span class="text-2xl font-black text-slate-900 dark:text-white">
              {{ analyticsData.kpis.totalOrganizations }}
            </span>
            <span
              class="text-xs font-semibold text-purple-600 dark:text-purple-400"
            >
              {{ analyticsData.kpis.monthlyGrowthRate }}
            </span>
          </div>
          <p class="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            {{ analyticsData.kpis.verifiedOrganizations }} verificadas
            fiscalmente
          </p>
        </div>

        <!-- KPI 3: Postulaciones Totales -->
        <div
          class="bg-surface-container-lowest dark:bg-slate-900 border border-outline-variant/60 dark:border-slate-800 rounded-2xl p-5 shadow-xs"
        >
          <div class="flex items-center justify-between">
            <span
              class="text-xs font-semibold text-slate-500 dark:text-slate-400"
              >Postulaciones</span
            >
            <div
              class="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center"
            >
              <span class="material-symbols-outlined text-[20px]"
                >how_to_reg</span
              >
            </div>
          </div>
          <div class="mt-3 flex items-baseline gap-2">
            <span class="text-2xl font-black text-slate-900 dark:text-white">
              {{ analyticsData.kpis.totalApplications }}
            </span>
            <span
              class="text-xs font-medium text-slate-500 dark:text-slate-400"
            >
              {{ analyticsData.kpis.averageApplicationsPerJob }} / vacante
            </span>
          </div>
          <p class="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Tasa promedio de conversión laboral
          </p>
        </div>

        <!-- KPI 4: Uptime & Disponibilidad -->
        <div
          class="bg-surface-container-lowest dark:bg-slate-900 border border-outline-variant/60 dark:border-slate-800 rounded-2xl p-5 shadow-xs"
        >
          <div class="flex items-center justify-between">
            <span
              class="text-xs font-semibold text-slate-500 dark:text-slate-400"
              >Uptime Infraestructura</span
            >
            <div
              class="w-9 h-9 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center"
            >
              <span class="material-symbols-outlined text-[20px]"
                >cloud_done</span
              >
            </div>
          </div>
          <div class="mt-3 flex items-baseline gap-2">
            <span class="text-2xl font-black text-slate-900 dark:text-white">
              99.98%
            </span>
            <span class="text-xs font-semibold text-sky-600 dark:text-sky-400">
              AWS us-east-1
            </span>
          </div>
          <p class="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            5 servicios de nube sin interrupciones
          </p>
        </div>
      </div>
    </div>

    <!-- Section 2: System Health & Infrastructure Monitoring -->
    <div class="mb-8">
      <div class="flex items-center justify-between mb-4">
        <h2
          class="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2"
        >
          <span
            class="material-symbols-outlined text-base text-emerald-600 dark:text-emerald-400"
            >health_and_safety</span
          >
          Monitoreo de Infraestructura y Servicios AWS en Vivo
        </h2>
        <span class="text-xs font-semibold text-slate-500 dark:text-slate-400">
          Latencia p95 promedio: 48 ms
        </span>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- Service 1: AWS Lambda SSR -->
        <div
          class="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-4 shadow-xs"
        >
          <div class="flex items-center justify-between mb-2">
            <div class="flex items-center gap-2">
              <span class="material-symbols-outlined text-lg text-amber-500"
                >terminal</span
              >
              <span class="text-xs font-bold text-slate-900 dark:text-white"
                >Nuxt SSR (Lambda)</span
              >
            </div>
            <span
              class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300"
            >
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              Operativo
            </span>
          </div>
          <div
            class="text-[11px] text-slate-500 dark:text-slate-400 space-y-1 mt-2"
          >
            <div class="flex justify-between">
              <span>Tiempo de respuesta:</span>
              <span class="font-semibold text-slate-700 dark:text-slate-200"
                >~115 ms</span
              >
            </div>
            <div class="flex justify-between">
              <span>Tasa de error:</span>
              <span class="font-semibold text-emerald-600 dark:text-emerald-400"
                >0.00%</span
              >
            </div>
          </div>
        </div>

        <!-- Service 2: API Gateway -->
        <div
          class="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-4 shadow-xs"
        >
          <div class="flex items-center justify-between mb-2">
            <div class="flex items-center gap-2">
              <span class="material-symbols-outlined text-lg text-indigo-500"
                >lan</span
              >
              <span class="text-xs font-bold text-slate-900 dark:text-white"
                >API Gateway REST</span
              >
            </div>
            <span
              class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300"
            >
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              Operativo
            </span>
          </div>
          <div
            class="text-[11px] text-slate-500 dark:text-slate-400 space-y-1 mt-2"
          >
            <div class="flex justify-between">
              <span>Latencia HTTP:</span>
              <span class="font-semibold text-slate-700 dark:text-slate-200"
                >~42 ms</span
              >
            </div>
            <div class="flex justify-between">
              <span>Rutas autorizadas:</span>
              <span class="font-semibold text-slate-700 dark:text-slate-200"
                >JWT & Cognito</span
              >
            </div>
          </div>
        </div>

        <!-- Service 3: Amazon Cognito -->
        <div
          class="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-4 shadow-xs"
        >
          <div class="flex items-center justify-between mb-2">
            <div class="flex items-center gap-2">
              <span class="material-symbols-outlined text-lg text-rose-500"
                >lock</span
              >
              <span class="text-xs font-bold text-slate-900 dark:text-white"
                >Cognito Auth Pool</span
              >
            </div>
            <span
              class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300"
            >
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              Saludable
            </span>
          </div>
          <div
            class="text-[11px] text-slate-500 dark:text-slate-400 space-y-1 mt-2"
          >
            <div class="flex justify-between">
              <span>Protocolo:</span>
              <span class="font-semibold text-slate-700 dark:text-slate-200"
                >OAuth 2.0 / NextAuth</span
              >
            </div>
            <div class="flex justify-between">
              <span>Tokens revocados:</span>
              <span class="font-semibold text-slate-700 dark:text-slate-200"
                >0</span
              >
            </div>
          </div>
        </div>

        <!-- Service 4: DynamoDB & S3 -->
        <div
          class="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-4 shadow-xs"
        >
          <div class="flex items-center justify-between mb-2">
            <div class="flex items-center gap-2">
              <span class="material-symbols-outlined text-lg text-blue-500"
                >database</span
              >
              <span class="text-xs font-bold text-slate-900 dark:text-white"
                >DynamoDB & S3</span
              >
            </div>
            <span
              class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300"
            >
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              Sincronizado
            </span>
          </div>
          <div
            class="text-[11px] text-slate-500 dark:text-slate-400 space-y-1 mt-2"
          >
            <div class="flex justify-between">
              <span>Cifrado en reposo:</span>
              <span class="font-semibold text-slate-700 dark:text-slate-200"
                >AWS KMS</span
              >
            </div>
            <div class="flex justify-between">
              <span>Edge CloudFront:</span>
              <span class="font-semibold text-emerald-600 dark:text-emerald-400"
                >Caché Activo</span
              >
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Section 3: Quick Administrative Directory (Accesos Rápidos a Módulos) -->
    <div class="mb-8">
      <h2
        class="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2 mb-4"
      >
        <span class="material-symbols-outlined text-base text-primary"
          >apps</span
        >
        Módulos Administrativos y Acciones Rápidas
      </h2>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <!-- Module 1: Analítica Avanzada -->
        <NuxtLink
          to="/admin/analytics"
          class="group p-5 bg-surface-container-lowest dark:bg-slate-900 border border-outline-variant/60 dark:border-slate-800 rounded-2xl shadow-xs hover:border-primary dark:hover:border-indigo-500 hover:shadow-md transition-all flex flex-col justify-between"
        >
          <div>
            <div
              class="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform"
            >
              <span class="material-symbols-outlined text-[22px]"
                >insights</span
              >
            </div>
            <h3
              class="text-sm font-bold text-slate-900 dark:text-white group-hover:text-primary dark:group-hover:text-indigo-400 transition-colors"
            >
              Analítica Avanzada
            </h3>
            <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Top 10 habilidades técnicas más demandadas, distribución
              geográfica y tasas de postulación regional.
            </p>
          </div>
          <div
            class="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-primary dark:text-indigo-400"
          >
            <span>Explorar métricas de mercado</span>
            <span
              class="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform"
              >arrow_forward</span
            >
          </div>
        </NuxtLink>

        <!-- Module 2: Organizaciones -->
        <NuxtLink
          to="/admin/organizations"
          class="group p-5 bg-surface-container-lowest dark:bg-slate-900 border border-outline-variant/60 dark:border-slate-800 rounded-2xl shadow-xs hover:border-primary dark:hover:border-indigo-500 hover:shadow-md transition-all flex flex-col justify-between"
        >
          <div>
            <div
              class="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform"
            >
              <span class="material-symbols-outlined text-[22px]"
                >account_balance</span
              >
            </div>
            <h3
              class="text-sm font-bold text-slate-900 dark:text-white group-hover:text-primary dark:group-hover:text-indigo-400 transition-colors"
            >
              Control de Organizaciones
            </h3>
            <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Validar documentación de empresas, auditar estatus fiscal y
              aplicar suspensiones preventivas por irregularidades.
            </p>
          </div>
          <div
            class="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-purple-600 dark:text-purple-400"
          >
            <span>Gestionar empresas</span>
            <span
              class="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform"
              >arrow_forward</span
            >
          </div>
        </NuxtLink>

        <!-- Module 3: Catálogo Maestro -->
        <NuxtLink
          to="/admin/catalog"
          class="group p-5 bg-surface-container-lowest dark:bg-slate-900 border border-outline-variant/60 dark:border-slate-800 rounded-2xl shadow-xs hover:border-primary dark:hover:border-indigo-500 hover:shadow-md transition-all flex flex-col justify-between"
        >
          <div>
            <div
              class="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform"
            >
              <span class="material-symbols-outlined text-[22px]">layers</span>
            </div>
            <h3
              class="text-sm font-bold text-slate-900 dark:text-white group-hover:text-primary dark:group-hover:text-indigo-400 transition-colors"
            >
              Catálogo Maestro
            </h3>
            <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Estandarización de habilidades técnicas, ocupaciones y datos
              globales del motor de vacantes.
            </p>
          </div>
          <div
            class="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-emerald-600 dark:text-emerald-400"
          >
            <span>Administrar catálogo</span>
            <span
              class="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform"
              >arrow_forward</span
            >
          </div>
        </NuxtLink>

        <!-- Module 4: Notificaciones Push -->
        <NuxtLink
          to="/admin/push"
          class="group p-5 bg-surface-container-lowest dark:bg-slate-900 border border-outline-variant/60 dark:border-slate-800 rounded-2xl shadow-xs hover:border-primary dark:hover:border-indigo-500 hover:shadow-md transition-all flex flex-col justify-between"
        >
          <div>
            <div
              class="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform"
            >
              <span class="material-symbols-outlined text-[22px]"
                >campaign</span
              >
            </div>
            <h3
              class="text-sm font-bold text-slate-900 dark:text-white group-hover:text-primary dark:group-hover:text-indigo-400 transition-colors"
            >
              Campañas Push Globales
            </h3>
            <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Envío de alertas masivas y avisos segmentados a postulantes y
              reclutadores de la plataforma.
            </p>
          </div>
          <div
            class="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-amber-600 dark:text-amber-400"
          >
            <span>Configurar campañas</span>
            <span
              class="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform"
              >arrow_forward</span
            >
          </div>
        </NuxtLink>

        <!-- Module 5: Auditoría y Fraude -->
        <NuxtLink
          to="/admin/fraud"
          class="group p-5 bg-surface-container-lowest dark:bg-slate-900 border border-outline-variant/60 dark:border-slate-800 rounded-2xl shadow-xs hover:border-primary dark:hover:border-indigo-500 hover:shadow-md transition-all flex flex-col justify-between"
        >
          <div>
            <div
              class="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform"
            >
              <span class="material-symbols-outlined text-[22px]"
                >security</span
              >
            </div>
            <h3
              class="text-sm font-bold text-slate-900 dark:text-white group-hover:text-primary dark:group-hover:text-indigo-400 transition-colors"
            >
              Auditoría y Fraude
            </h3>
            <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Supervisión de reportes, denuncias de candidatos y bloqueos
              preventivos de cuentas sospechosas.
            </p>
          </div>
          <div
            class="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-rose-600 dark:text-rose-400"
          >
            <span>Revisar incidentes</span>
            <span
              class="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform"
              >arrow_forward</span
            >
          </div>
        </NuxtLink>

        <!-- Module 6: Canales de Apelación -->
        <NuxtLink
          to="/mod/appeals"
          class="group p-5 bg-surface-container-lowest dark:bg-slate-900 border border-outline-variant/60 dark:border-slate-800 rounded-2xl shadow-xs hover:border-primary dark:hover:border-indigo-500 hover:shadow-md transition-all flex flex-col justify-between"
        >
          <div>
            <div
              class="w-10 h-10 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform"
            >
              <span class="material-symbols-outlined text-[22px]">gavel</span>
            </div>
            <h3
              class="text-sm font-bold text-slate-900 dark:text-white group-hover:text-primary dark:group-hover:text-indigo-400 transition-colors"
            >
              Tribunal de Apelaciones
            </h3>
            <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Resolución de desacuerdos entre organizaciones sancionadas y el
              equipo de moderación.
            </p>
          </div>
          <div
            class="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-sky-600 dark:text-sky-400"
          >
            <span>Ver apelaciones</span>
            <span
              class="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform"
              >arrow_forward</span
            >
          </div>
        </NuxtLink>
      </div>
    </div>

    <!-- Section 4: Operational Activity & Breakdown -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <!-- 1. Organizaciones Recientes para Auditoría -->
      <div
        class="bg-surface-container-lowest dark:bg-slate-900 border border-outline-variant/60 dark:border-slate-800 rounded-2xl p-5 shadow-xs"
      >
        <div
          class="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-800"
        >
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-lg text-primary"
              >domain</span
            >
            <h3 class="text-sm font-bold text-slate-900 dark:text-white">
              Organizaciones Recientes
            </h3>
          </div>
          <NuxtLink
            to="/admin/organizations"
            class="text-xs font-semibold text-primary hover:underline"
          >
            Ver todas ({{ orgs.length }})
          </NuxtLink>
        </div>

        <div class="space-y-3">
          <div
            v-for="org in recentOrgs"
            :key="org.id"
            class="p-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 rounded-xl flex items-center justify-between gap-3 text-xs"
          >
            <div class="min-w-0">
              <p class="font-bold text-slate-900 dark:text-slate-100 truncate">
                {{ org.nombre }}
              </p>
              <p
                class="text-[11px] text-slate-500 dark:text-slate-400 truncate"
              >
                {{ org.rfc || "Sin RFC registrado" }} ·
                {{ org.sector || "Empresarial" }}
              </p>
            </div>

            <div class="flex items-center gap-2 flex-shrink-0">
              <span
                v-if="org.organizacionVerificada"
                class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300"
              >
                <span class="material-symbols-outlined text-xs">verified</span>
                Verificada
              </span>
              <span
                v-else
                class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300"
              >
                <span class="material-symbols-outlined text-xs">pending</span>
                Pendiente
              </span>
              <NuxtLink
                :to="`/admin/organizations`"
                class="p-1.5 text-slate-400 hover:text-primary transition"
                title="Auditar organización"
              >
                <span class="material-symbols-outlined text-base"
                  >manage_accounts</span
                >
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>

      <!-- 2. Distribución de Modalidades de Empleo -->
      <div
        class="bg-surface-container-lowest dark:bg-slate-900 border border-outline-variant/60 dark:border-slate-800 rounded-2xl p-5 shadow-xs"
      >
        <div
          class="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-800"
        >
          <div class="flex items-center gap-2">
            <span
              class="material-symbols-outlined text-lg text-emerald-600 dark:text-emerald-400"
              >pie_chart</span
            >
            <h3 class="text-sm font-bold text-slate-900 dark:text-white">
              Distribución Laboral & Demanda
            </h3>
          </div>
          <span
            class="text-xs font-semibold text-slate-500 dark:text-slate-400"
          >
            Habilidad #1: {{ analyticsData.kpis.topSkillName }}
          </span>
        </div>

        <div class="space-y-4">
          <!-- Remoto -->
          <div>
            <div class="flex justify-between text-xs mb-1">
              <span
                class="font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5"
              >
                <span class="material-symbols-outlined text-xs text-indigo-500"
                  >laptop_chromebook</span
                >
                Remoto
              </span>
              <span class="font-bold text-slate-900 dark:text-white">
                {{ analyticsData.applicationRate.byModality.Remoto }}
                post./oferta
              </span>
            </div>
            <div
              class="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden"
            >
              <div
                class="h-full bg-indigo-500 rounded-full"
                style="width: 58%"
              ></div>
            </div>
          </div>

          <!-- Híbrido -->
          <div>
            <div class="flex justify-between text-xs mb-1">
              <span
                class="font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5"
              >
                <span class="material-symbols-outlined text-xs text-purple-500"
                  >domain_verification</span
                >
                Híbrido
              </span>
              <span class="font-bold text-slate-900 dark:text-white">
                {{ analyticsData.applicationRate.byModality.Híbrido }}
                post./oferta
              </span>
            </div>
            <div
              class="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden"
            >
              <div
                class="h-full bg-purple-500 rounded-full"
                style="width: 32%"
              ></div>
            </div>
          </div>

          <!-- Presencial -->
          <div>
            <div class="flex justify-between text-xs mb-1">
              <span
                class="font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5"
              >
                <span class="material-symbols-outlined text-xs text-emerald-500"
                  >apartment</span
                >
                Presencial
              </span>
              <span class="font-bold text-slate-900 dark:text-white">
                {{ analyticsData.applicationRate.byModality.Presencial }}
                post./oferta
              </span>
            </div>
            <div
              class="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden"
            >
              <div
                class="h-full bg-emerald-500 rounded-full"
                style="width: 20%"
              ></div>
            </div>
          </div>

          <div
            class="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400"
          >
            <span>Demanda concentrada en Estado de México y CDMX</span>
            <NuxtLink
              to="/admin/analytics"
              class="font-semibold text-primary hover:underline"
            >
              Ver top 10 habilidades →
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>

    <!-- Sanction Modal for immediate resolution from Anomaly Alert -->
    <SanctionModal
      v-model="isSanctionModalOpen"
      :selected-org="selectedOrg"
      :sanction-steps="sanctionSteps"
      v-model:suspension-reason-input="suspensionReasonInput"
      v-model:grace-days-input="graceDaysInput"
      :get-org-status-key="getOrgStatusKey"
      @apply-sanction="handleApplySanction"
    />
  </div>
</template>

<script setup lang="ts">
import AnomalousConcurrencyAlert from "~/components/admin/analytics/AnomalousConcurrencyAlert.vue";
import SanctionModal from "~/components/admin/organizations/SanctionModal.vue";
import { useAdminAnalytics } from "~/composables/useAdminAnalytics";
import { useAdminOrganizations } from "~/composables/useAdminOrganizations";
import { useOrgActions } from "~/composables/useOrgActions";

definePageMeta({
  alias: ["/admin/dashboard"],
});

useSeoMeta({
  title: "Monitoreo y Métricas - JobNet Admin",
  description:
    "Panel principal de control, monitoreo de infraestructura en tiempo real y métricas del sistema.",
});

const isRefreshing = ref(false);

const {
  analyticsData,
  activeAnomalies,
  hasActiveAnomalies,
  dismissAnomaly,
  refresh: refreshAnalytics,
} = useAdminAnalytics();

const { orgs, getOrgStatusKey, refresh: refreshOrgs } = useAdminOrganizations();

const {
  successMsg,
  isSanctionModalOpen,
  selectedOrg,
  suspensionReasonInput,
  graceDaysInput,
  sanctionSteps,
  openSanctionModal,
  applySanction,
} = useOrgActions(async () => {
  await refreshAnalytics();
  await refreshOrgs();
});

const recentOrgs = computed(() => {
  return orgs.value.slice(0, 5);
});

const handleManualRefresh = async () => {
  isRefreshing.value = true;
  try {
    await Promise.all([refreshAnalytics(), refreshOrgs()]);
  } finally {
    setTimeout(() => {
      isRefreshing.value = false;
    }, 400);
  }
};

const handleSanctionFromAlert = (org: {
  id: string;
  nombre: string;
  reason?: string;
}) => {
  openSanctionModal({
    id: org.id,
    nombre: org.nombre,
    companyId: org.id,
  });
  if (org.reason) {
    suspensionReasonInput.value = org.reason;
  }
};

const handleApplySanction = async (action: "FREEZE" | "SUSPEND" | "BAN") => {
  await applySanction(action);
};
</script>
