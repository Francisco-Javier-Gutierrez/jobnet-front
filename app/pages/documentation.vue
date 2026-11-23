<template>
  <div
    class="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-primary/20 selection:text-primary transition-colors duration-200"
  >
    <!-- Top Navigation Bar (Dedicated Documentation Header) -->
    <header
      :class="[
        'sticky top-0 z-50 backdrop-blur-md bg-white/90 dark:bg-slate-950/90 border-b border-slate-200 dark:border-slate-800 transition-transform duration-300',
        isHeaderVisible ? 'translate-y-0' : '-translate-y-full',
      ]"
    >
      <div
        class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4"
      >
        <div class="flex items-center gap-3">
          <NuxtLink
            to="/"
            class="flex items-center group transition-transform hover:scale-105"
            aria-label="Volver a Inicio"
          >
            <img
              src="/logo.svg"
              alt="Logo"
              class="h-9 w-9 filter brightness-100 dark:brightness-0 dark:invert transition-all"
            />
          </NuxtLink>
          <span
            class="hidden sm:inline-block text-xs font-mono px-2.5 py-0.5 rounded-md bg-primary/10 text-primary dark:text-indigo-300 font-semibold border border-primary/20"
          >
            BLUEPRINT & DOCS
          </span>
          <span
            class="hidden md:inline-flex items-center gap-1.5 text-[11px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20"
          >
            <span
              class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"
            ></span>
            799 Tests Passing (100%)
          </span>
        </div>

        <!-- Right Quick Actions -->
        <div class="flex items-center gap-2 sm:gap-3">
          <!-- Toggle Nav Bar Button (Desktop & Mobile) -->
          <button
            type="button"
            @click="isNavCollapsed = !isNavCollapsed"
            class="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition text-slate-700 dark:text-slate-300 cursor-pointer"
            :title="
              isNavCollapsed
                ? 'Mostrar barra de navegación'
                : 'Ocultar barra de navegación'
            "
            aria-label="Alternar visibilidad del índice"
          >
            <span class="material-symbols-outlined text-[18px]">
              {{ isNavCollapsed ? "expand_more" : "expand_less" }}
            </span>
            <span class="hidden sm:inline text-xs">
              {{ isNavCollapsed ? "Mostrar Secciones" : "Ocultar Secciones" }}
            </span>
          </button>

          <NuxtLink
            to="/"
            class="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition text-slate-700 dark:text-slate-300"
          >
            <span class="material-symbols-outlined text-sm">home</span>
            <span class="hidden sm:inline">Ir al Portal</span>
          </NuxtLink>
          <ThemeToggle />
        </div>
      </div>

      <!-- Quick Section Anchor Navigation (Horizontal Scrollable with Overflow-X & Drag/Wheel Controls) -->
      <div
        v-show="!isNavCollapsed"
        class="border-t border-slate-100 dark:border-slate-800/80 relative transition-all duration-200"
      >
        <div
          class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative flex items-center"
        >
          <!-- Left scroll arrow button (Desktop) -->
          <button
            type="button"
            @click="scrollNav('left')"
            class="hidden md:flex absolute left-2 z-10 w-7 h-7 rounded-full bg-white/95 dark:bg-slate-900/95 shadow-md border border-slate-200 dark:border-slate-700 items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-50 transition cursor-pointer"
            aria-label="Desplazar a la izquierda"
          >
            <span class="material-symbols-outlined text-base"
              >chevron_left</span
            >
          </button>

          <!-- Nav Element with Overflow-X, Wheel scroll and Mouse Drag -->
          <nav
            ref="navRef"
            @wheel.passive="handleNavWheel"
            @mousedown="onMouseDown"
            @mousemove="onMouseMove"
            @mouseup="onMouseUp"
            @mouseleave="onMouseUp"
            class="w-full py-2 flex items-center gap-2 text-xs overflow-x-auto select-none overscroll-x-contain scrollbar-nav"
            aria-label="Índice de secciones"
            :class="
              isDragging ? 'cursor-grabbing' : 'cursor-grab md:cursor-pointer'
            "
          >
            <button
              v-for="section in sections"
              :key="section.id"
              :id="`nav-btn-${section.id}`"
              type="button"
              @click="scrollTo(section.id)"
              :class="[
                'px-3.5 py-1.5 rounded-full whitespace-nowrap font-medium transition cursor-pointer flex items-center gap-1.5 flex-shrink-0 text-xs',
                activeSection === section.id
                  ? 'bg-primary text-white shadow-sm ring-2 ring-primary/20 font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/80 bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800',
              ]"
            >
              <span class="material-symbols-outlined text-[15px]">{{
                section.icon
              }}</span>
              {{ section.title }}
            </button>
          </nav>

          <!-- Right scroll arrow button (Desktop) -->
          <button
            type="button"
            @click="scrollNav('right')"
            class="hidden md:flex absolute right-2 z-10 w-7 h-7 rounded-full bg-white/95 dark:bg-slate-900/95 shadow-md border border-slate-200 dark:border-slate-700 items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-50 transition cursor-pointer"
            aria-label="Desplazar a la derecha"
          >
            <span class="material-symbols-outlined text-base"
              >chevron_right</span
            >
          </button>
        </div>
      </div>
    </header>

    <!-- Main Content Container -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      <!-- Hero / Executive Overview Section -->
      <section
        id="overview"
        class="relative overflow-hidden rounded-3xl bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 p-8 sm:p-12 shadow-sm border border-slate-200 dark:border-slate-800"
      >
        <div
          class="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-primary/5 blur-3xl pointer-events-none"
        ></div>
        <div
          class="absolute -left-20 -bottom-20 w-80 h-80 rounded-full bg-indigo-500/5 blur-3xl pointer-events-none"
        ></div>

        <div class="relative z-10 space-y-6 max-w-4xl">
          <div class="flex flex-wrap items-center gap-2">
            <span
              class="px-3 py-1 rounded-full text-[11px] font-mono font-bold tracking-wider uppercase bg-primary/10 border border-primary/20 text-primary dark:text-indigo-300"
            >
              Arquitectura Serverless Cloud-Native
            </span>
            <span
              class="px-3 py-1 rounded-full text-[11px] font-mono font-bold tracking-wider uppercase bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300"
            >
              Zero-Trust Security & STD
            </span>
            <span
              class="px-3 py-1 rounded-full text-[11px] font-mono font-bold tracking-wider uppercase bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-300"
            >
              Autónomo VAPID WebPush
            </span>
            <span
              class="px-3 py-1 rounded-full text-[11px] font-mono font-bold tracking-wider uppercase bg-purple-500/10 border border-purple-500/20 text-purple-700 dark:text-purple-300"
            >
              Terraform & AWS CLI Pipeline
            </span>
          </div>

          <h1
            class="text-3xl sm:text-5xl font-black tracking-tight leading-tight text-slate-900 dark:text-white"
          >
            Engineering Blueprint & Architectural Dossier
          </h1>

          <p
            class="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal"
          >
            Ecosistema tecnológico de empleo de escala empresarial diseñado bajo
            el paradigma <strong>Cloud Native Serverless</strong> sobre
            <strong>Amazon Web Services (AWS)</strong> y desarrollado con
            <strong>Nuxt 4 / Vue 3</strong>. Este informe técnico documenta en
            profundidad el stack, patrones de diseño (Single-Table Design,
            WebSockets bidireccionales, VAPID RFC 8292), el pipeline de
            despliegue automatizado mediante
            <strong>Terraform (IaC) y AWS CLI</strong>, y la cobertura de
            <strong>799 pruebas automatizadas</strong> con 100% de éxito.
          </p>

          <!-- Key Metrics Grid -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
            <div
              class="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-2xl p-4 shadow-2xs"
            >
              <div
                class="text-2xl sm:text-3xl font-extrabold text-primary dark:text-indigo-400"
              >
                799
              </div>
              <div
                class="text-xs text-slate-700 dark:text-slate-300 font-semibold mt-1"
              >
                Tests Automatizados (100%)
              </div>
              <div
                class="text-[10px] text-slate-500 dark:text-slate-400 font-mono mt-0.5"
              >
                516 Back + 283 Front
              </div>
            </div>

            <div
              class="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-2xl p-4 shadow-2xs"
            >
              <div
                class="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400"
              >
                &lt; 85ms
              </div>
              <div
                class="text-xs text-slate-700 dark:text-slate-300 font-semibold mt-1"
              >
                Latencia P95 DynamoDB STD
              </div>
              <div
                class="text-[10px] text-slate-500 dark:text-slate-400 font-mono mt-0.5"
              >
                Single-Roundtrip NoSQL
              </div>
            </div>

            <div
              class="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-2xl p-4 shadow-2xs"
            >
              <div
                class="text-2xl sm:text-3xl font-extrabold text-purple-600 dark:text-purple-400"
              >
                100%
              </div>
              <div
                class="text-xs text-slate-700 dark:text-slate-300 font-semibold mt-1"
              >
                Serverless Pay-As-You-Go
              </div>
              <div
                class="text-[10px] text-slate-500 dark:text-slate-400 font-mono mt-0.5"
              >
                Escalamiento a Cero
              </div>
            </div>

            <div
              class="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-2xl p-4 shadow-2xs"
            >
              <div
                class="text-2xl sm:text-3xl font-extrabold text-sky-600 dark:text-sky-400"
              >
                ~12s
              </div>
              <div
                class="text-xs text-slate-700 dark:text-slate-300 font-semibold mt-1"
              >
                Fast Deploy (AWS CLI)
              </div>
              <div
                class="text-[10px] text-slate-500 dark:text-slate-400 font-mono mt-0.5"
              >
                Terraform + CLI Híbrido
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Section 1: Stack Tecnológico -->
      <section id="stack" class="space-y-6">
        <div class="flex items-center gap-3">
          <div
            class="p-2.5 rounded-2xl bg-indigo-500/10 text-primary dark:text-indigo-400 border border-primary/20"
          >
            <span class="material-symbols-outlined text-2xl">layers</span>
          </div>
          <div>
            <h2 class="text-2xl sm:text-3xl font-extrabold tracking-tight">
              1. Stack Tecnológico & Frameworks
            </h2>
            <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Elección de herramientas de última generación para rendimiento y
              mantenibilidad.
            </p>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <!-- Card: Nuxt 4 & Vue 3 -->
          <div
            class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4 hover:border-primary/40 transition-all"
          >
            <div class="flex items-center justify-between">
              <span class="material-symbols-outlined text-3xl text-emerald-500"
                >devices</span
              >
              <span
                class="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
              >
                Frontend Moderno
              </span>
            </div>
            <h3 class="text-lg font-bold text-slate-900 dark:text-slate-100">
              Nuxt 4 + Vue 3 (Composition API)
            </h3>
            <p
              class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed"
            >
              Implementación con el motor <strong>Nitro</strong>, script setup
              reactivo, enrutamiento automático basado en archivos, hidratación
              progresiva, code-splitting automático por vistas y soporte nativo
              para PWA.
            </p>
            <div class="flex flex-wrap gap-1.5 pt-2">
              <span class="tech-pill">Nuxt 4.4.8</span>
              <span class="tech-pill">Vue 3.5.38</span>
              <span class="tech-pill">Vite</span>
              <span class="tech-pill">Nitro</span>
            </div>
          </div>

          <!-- Card: Tailwind CSS & Material 3 -->
          <div
            class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4 hover:border-primary/40 transition-all"
          >
            <div class="flex items-center justify-between">
              <span class="material-symbols-outlined text-3xl text-indigo-500"
                >palette</span
              >
              <span
                class="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-indigo-500/10 text-primary dark:text-indigo-400 border border-primary/20"
              >
                Design System
              </span>
            </div>
            <h3 class="text-lg font-bold text-slate-900 dark:text-slate-100">
              Tailwind CSS & Material Design 3
            </h3>
            <p
              class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed"
            >
              Tokens semánticos de diseño de Material Design 3 (surfaces,
              on-surface, outline-variant), paleta de colores adaptativa, modo
              oscuro (dark mode) persistente y diseño 100% responsivo
              mobile-first.
            </p>
            <div class="flex flex-wrap gap-1.5 pt-2">
              <span class="tech-pill">Tailwind 3</span>
              <span class="tech-pill">Material 3</span>
              <span class="tech-pill">Material Symbols</span>
              <span class="tech-pill">CSS Variables</span>
            </div>
          </div>

          <!-- Card: State & Architecture -->
          <div
            class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4 hover:border-primary/40 transition-all"
          >
            <div class="flex items-center justify-between">
              <span class="material-symbols-outlined text-3xl text-purple-500"
                >account_tree</span
              >
              <span
                class="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20"
              >
                Estado & Arquitectura
              </span>
            </div>
            <h3 class="text-lg font-bold text-slate-900 dark:text-slate-100">
              Pinia & Composables Modulares
            </h3>
            <p
              class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed"
            >
              Gestión de estado global modular con Pinia y lógica de negocio
              desacoplada en composables de alta cohesión (<code
                class="text-[11px] font-mono"
                >useSupportTickets</code
              >, <code class="text-[11px] font-mono">useWebPush</code>,
              <code class="text-[11px] font-mono">useApiClient</code>).
            </p>
            <div class="flex flex-wrap gap-1.5 pt-2">
              <span class="tech-pill">Pinia 2.3</span>
              <span class="tech-pill">Composables</span>
              <span class="tech-pill">Leaflet Maps</span>
              <span class="tech-pill">html2pdf.js</span>
            </div>
          </div>

          <!-- Card: Backend Node & Express -->
          <div
            class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4 hover:border-primary/40 transition-all"
          >
            <div class="flex items-center justify-between">
              <span class="material-symbols-outlined text-3xl text-amber-500"
                >terminal</span
              >
              <span
                class="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
              >
                Backend Serverless
              </span>
            </div>
            <h3 class="text-lg font-bold text-slate-900 dark:text-slate-100">
              Node.js + Express en AWS Lambda
            </h3>
            <p
              class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed"
            >
              Backend desacoplado montado sobre Express y adaptado a AWS Lambda
              con
              <code class="text-[11px] font-mono"
                >@codegenie/serverless-express</code
              >. Manejo de seguridad con Helmet, sanitización y enrutamiento
              jerárquico.
            </p>
            <div class="flex flex-wrap gap-1.5 pt-2">
              <span class="tech-pill">Node 20 LTS</span>
              <span class="tech-pill">Express 5</span>
              <span class="tech-pill">Helmet</span>
              <span class="tech-pill">AWS SDK v3</span>
            </div>
          </div>

          <!-- Card: Strict TypeScript -->
          <div
            class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4 hover:border-primary/40 transition-all"
          >
            <div class="flex items-center justify-between">
              <span class="material-symbols-outlined text-3xl text-sky-500"
                >code_blocks</span
              >
              <span
                class="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20"
              >
                Type Safety
              </span>
            </div>
            <h3 class="text-lg font-bold text-slate-900 dark:text-slate-100">
              TypeScript 5 Strict & Zod
            </h3>
            <p
              class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed"
            >
              Tipado estricto extremo con validación de esquemas en tiempo de
              ejecución mediante <strong>Zod</strong>. Cero uso de
              <code class="text-[11px] font-mono">any</code>
              en interfaces críticas, garantizando contratos de API inmutables.
            </p>
            <div class="flex flex-wrap gap-1.5 pt-2">
              <span class="tech-pill">TypeScript 5.6</span>
              <span class="tech-pill">Zod 4.6</span>
              <span class="tech-pill">vue-tsc</span>
              <span class="tech-pill">ESLint 10</span>
            </div>
          </div>

          <!-- Card: Vitest & Unit Testing -->
          <div
            class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4 hover:border-primary/40 transition-all"
          >
            <div class="flex items-center justify-between">
              <span class="material-symbols-outlined text-3xl text-rose-500"
                >verified</span
              >
              <span
                class="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20"
              >
                Testing Engine
              </span>
            </div>
            <h3 class="text-lg font-bold text-slate-900 dark:text-slate-100">
              Vitest + Coverage v8 + Happy DOM
            </h3>
            <p
              class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed"
            >
              Suite de pruebas ultra-rápida impulsada por Vitest con soporte
              para mocks de AWS SDK v3, validación de componentes con
              <code class="text-[11px] font-mono">@vue/test-utils</code> y
              análisis de cobertura en V8.
            </p>
            <div class="flex flex-wrap gap-1.5 pt-2">
              <span class="tech-pill">Vitest 4.1</span>
              <span class="tech-pill">Happy DOM</span>
              <span class="tech-pill">Vue Test Utils</span>
              <span class="tech-pill">V8 Coverage</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Section 2: AWS Serverless Cloud Architecture -->
      <section id="aws" class="space-y-6">
        <div class="flex items-center gap-3">
          <div
            class="p-2.5 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
          >
            <span class="material-symbols-outlined text-2xl">cloud_sync</span>
          </div>
          <div>
            <h2 class="text-2xl sm:text-3xl font-extrabold tracking-tight">
              2. Infraestructura Cloud Serverless en AWS
            </h2>
            <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Arquitectura completamente desacoplada, autoescalable y
              aprovisionada con Terraform (IaC).
            </p>
          </div>
        </div>

        <!-- AWS Services Detailed Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- AWS Lambda -->
          <div
            class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-3"
          >
            <div class="flex items-center gap-3">
              <div
                class="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center font-bold text-lg"
              >
                λ
              </div>
              <div>
                <h3 class="font-bold text-slate-900 dark:text-slate-100">
                  AWS Lambda
                </h3>
                <span class="text-[11px] font-mono text-slate-500"
                  >Cómputo Serverless Efímero</span
                >
              </div>
            </div>
            <p
              class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed"
            >
              Múltiples funciones especializadas con asignación de memoria
              ajustada (1024MB-2048MB): procesador HTTP API principal,
              orquestador de WebSockets bidireccionales (<code
                class="text-[11px] font-mono"
                >lambdaWs</code
              >), autorizador JWT (<code class="text-[11px] font-mono"
                >wsAuthorizer</code
              >), trigger de post-confirmación Cognito y worker periódico (<code
                class="text-[11px] font-mono"
                >lambdaSuspensionExpiry</code
              >).
            </p>
          </div>

          <!-- Amazon DynamoDB -->
          <div
            class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-3"
          >
            <div class="flex items-center gap-3">
              <div
                class="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center"
              >
                <span class="material-symbols-outlined">database</span>
              </div>
              <div>
                <h3 class="font-bold text-slate-900 dark:text-slate-100">
                  Amazon DynamoDB
                </h3>
                <span class="text-[11px] font-mono text-slate-500"
                  >Single-Table Design + Streams</span
                >
              </div>
            </div>
            <p
              class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed"
            >
              Base de datos NoSQL con modo On-Demand (<code
                class="text-[11px] font-mono"
                >PAY_PER_REQUEST</code
              >), tabla unificada
              <code class="text-[11px] font-mono">jobnet-jobs-prod</code>,
              índice global secundario
              <code class="text-[11px] font-mono">GSI1</code> para consultas
              transversales, Time-To-Live (TTL) automático para desconexiones
              WebSocket y activación de Streams para eventos en tiempo real.
            </p>
          </div>

          <!-- Amazon API Gateway v2 -->
          <div
            class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-3"
          >
            <div class="flex items-center gap-3">
              <div
                class="w-10 h-10 rounded-xl bg-indigo-500/10 text-primary dark:text-indigo-400 flex items-center justify-center"
              >
                <span class="material-symbols-outlined">hub</span>
              </div>
              <div>
                <h3 class="font-bold text-slate-900 dark:text-slate-100">
                  Amazon API Gateway (v2)
                </h3>
                <span class="text-[11px] font-mono text-slate-500"
                  >HTTP API + WebSocket API</span
                >
              </div>
            </div>
            <p
              class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed"
            >
              Doble compuerta: una compuerta HTTP v2 de latencia ultra-baja para
              endpoints REST y una compuerta WebSocket v2 stateful (<code
                class="text-[11px] font-mono"
                >wss://</code
              >) para canales en tiempo real con rutas dedicadas (<code
                class="text-[11px] font-mono"
                >$connect</code
              >, <code class="text-[11px] font-mono">$disconnect</code>,
              <code class="text-[11px] font-mono">sendMessage</code>,
              <code class="text-[11px] font-mono">subscribeTicket</code>).
            </p>
          </div>

          <!-- Amazon Cognito -->
          <div
            class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-3"
          >
            <div class="flex items-center gap-3">
              <div
                class="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center"
              >
                <span class="material-symbols-outlined">lock_person</span>
              </div>
              <div>
                <h3 class="font-bold text-slate-900 dark:text-slate-100">
                  Amazon Cognito
                </h3>
                <span class="text-[11px] font-mono text-slate-500"
                  >IAM, OAuth 2.0 & MFA</span
                >
              </div>
            </div>
            <p
              class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed"
            >
              Directorio de identidades con User Pool, Federated Google Sign-In
              con OpenID Connect, atributos personalizados (<code
                class="text-[11px] font-mono"
                >custom:tipoUsuario</code
              >, <code class="text-[11px] font-mono">custom:tax_id</code>),
              Hosted UI, tokens JWT (ID Token & Access Token), y doble factor de
              autenticación TOTP (Software Token MFA).
            </p>
          </div>

          <!-- Amazon S3 & CloudFront -->
          <div
            class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-3"
          >
            <div class="flex items-center gap-3">
              <div
                class="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center"
              >
                <span class="material-symbols-outlined">public</span>
              </div>
              <div>
                <h3 class="font-bold text-slate-900 dark:text-slate-100">
                  CloudFront CDN & S3
                </h3>
                <span class="text-[11px] font-mono text-slate-500"
                  >Edge Caching & Presigned Uploads</span
                >
              </div>
            </div>
            <p
              class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed"
            >
              Distribución Edge global (<code class="text-[11px] font-mono"
                >dsty3j5u0b31g.cloudfront.net</code
              >) con compresión Gzip/Brotli y SSL/TLS. Bucket S3 privado para
              almacenamiento de CVs (PDF) y logos, empleando URLs prefirmadas
              (Presigned URLs) con expiración corta para carga segura directa.
            </p>
          </div>

          <!-- Amazon SES & EventBridge -->
          <div
            class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-3"
          >
            <div class="flex items-center gap-3">
              <div
                class="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center"
              >
                <span class="material-symbols-outlined">mark_email_read</span>
              </div>
              <div>
                <h3 class="font-bold text-slate-900 dark:text-slate-100">
                  Amazon SES & EventBridge
                </h3>
                <span class="text-[11px] font-mono text-slate-500"
                  >Mailing Transaccional & CRON Jobs</span
                >
              </div>
            </div>
            <p
              class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed"
            >
              Servicio de correo transaccional de alta entregabilidad con
              validación SPF/DKIM (<code class="text-[11px] font-mono"
                >contacto@franciscojgh.com</code
              >). Amazon EventBridge ejecuta reglas programadas periódicas para
              el mantenimiento automático del sistema (caducidad de suspensiones
              temporales).
            </p>
          </div>
        </div>
      </section>

      <!-- Section 3: DynamoDB Single-Table Design (STD) -->
      <section id="dynamodb" class="space-y-6">
        <div class="flex items-center gap-3">
          <div
            class="p-2.5 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20"
          >
            <span class="material-symbols-outlined text-2xl">table_chart</span>
          </div>
          <div>
            <h2 class="text-2xl sm:text-3xl font-extrabold tracking-tight">
              3. Amazon DynamoDB: Single-Table Design (STD) & Streams
            </h2>
            <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Patrón avanzado de persistencia NoSQL de Alex DeBrie y Rick
              Houlihan: 1 sola tabla física para todas las entidades.
            </p>
          </div>
        </div>

        <div
          class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6"
        >
          <div class="space-y-3">
            <h3 class="text-lg font-bold text-slate-900 dark:text-slate-100">
              ¿Por qué Single-Table Design frente a múltiples tablas
              relacionales?
            </h3>
            <p
              class="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed"
            >
              A diferencia de las arquitecturas tradicionales que sufren del
              problema de <em>N+1 queries</em> y complejos JOINs relacionales
              que degradan bajo carga masiva, el
              <strong>Single-Table Design</strong> en DynamoDB modela todos los
              patrones de acceso de la aplicación en una clave de partición
              (<code class="font-mono">PK</code>) y clave de ordenamiento (<code
                class="font-mono"
                >SK</code
              >). Esto permite obtener un usuario y todas sus relaciones
              (postulaciones, notificaciones, suscripciones push) en
              <strong>una única petición de red sub-10ms</strong>.
            </p>
          </div>

          <!-- Interactive Entity Matrix Table -->
          <div class="space-y-4">
            <div class="flex items-center justify-between flex-wrap gap-2">
              <h4
                class="text-xs font-mono font-bold uppercase tracking-wider text-slate-500"
              >
                Matriz de Claves y Patrones de Acceso (Schema Overview)
              </h4>
              <span
                class="text-[11px] font-mono text-primary dark:text-indigo-400 bg-primary/10 px-2.5 py-1 rounded-lg"
              >
                Tabla: jobnet-jobs-prod | GSI: GSI1
              </span>
            </div>

            <div
              class="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800"
            >
              <table class="w-full text-left text-xs">
                <thead
                  class="bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 font-mono text-[11px] border-b border-slate-200 dark:border-slate-800"
                >
                  <tr>
                    <th class="p-3">Entidad / Caso de Uso</th>
                    <th class="p-3">Partition Key (PK)</th>
                    <th class="p-3">Sort Key (SK)</th>
                    <th class="p-3">GSI1PK / GSI1SK</th>
                    <th class="p-3">Atributos Clave / TTL</th>
                  </tr>
                </thead>
                <tbody
                  class="divide-y divide-slate-100 dark:divide-slate-800/60 font-mono text-[11px]"
                >
                  <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td
                      class="p-3 font-bold font-sans text-slate-800 dark:text-slate-200"
                    >
                      Perfil de Usuario
                    </td>
                    <td class="p-3 text-primary dark:text-indigo-400">
                      USER#&lt;uuid&gt;
                    </td>
                    <td class="p-3 text-slate-500">PROFILE</td>
                    <td class="p-3 text-slate-400">
                      USER#&lt;role&gt; / &lt;createdAt&gt;
                    </td>
                    <td
                      class="p-3 font-sans text-slate-600 dark:text-slate-400"
                    >
                      email, tipoUsuario, estatus, verificationStatus
                    </td>
                  </tr>

                  <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td
                      class="p-3 font-bold font-sans text-slate-800 dark:text-slate-200"
                    >
                      Vacante Laboral
                    </td>
                    <td class="p-3 text-primary dark:text-indigo-400">
                      VACANCY#&lt;id&gt;
                    </td>
                    <td class="p-3 text-slate-500">METADATA</td>
                    <td class="p-3 text-slate-400">
                      COMPANY#&lt;orgId&gt; / &lt;createdAt&gt;
                    </td>
                    <td
                      class="p-3 font-sans text-slate-600 dark:text-slate-400"
                    >
                      titulo, empresaId, salario, modalidad, estatus
                    </td>
                  </tr>

                  <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td
                      class="p-3 font-bold font-sans text-slate-800 dark:text-slate-200"
                    >
                      Postulación ATS
                    </td>
                    <td class="p-3 text-primary dark:text-indigo-400">
                      VACANCY#&lt;id&gt;
                    </td>
                    <td class="p-3 text-slate-500">
                      APPLICATION#&lt;candidateId&gt;
                    </td>
                    <td class="p-3 text-slate-400">
                      CANDIDATE#&lt;candidateId&gt; / &lt;date&gt;
                    </td>
                    <td
                      class="p-3 font-sans text-slate-600 dark:text-slate-400"
                    >
                      fase (Pendiente, En Contacto, Finalista, Rechazado)
                    </td>
                  </tr>

                  <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td
                      class="p-3 font-bold font-sans text-slate-800 dark:text-slate-200"
                    >
                      Publicación Comunidad
                    </td>
                    <td class="p-3 text-primary dark:text-indigo-400">
                      POST#&lt;uuid&gt;
                    </td>
                    <td class="p-3 text-slate-500">METADATA</td>
                    <td class="p-3 text-slate-400">
                      FEED#ALL / &lt;createdAt&gt;
                    </td>
                    <td
                      class="p-3 font-sans text-slate-600 dark:text-slate-400"
                    >
                      authorId, likesCount, commentsCount, mediaUrls
                    </td>
                  </tr>

                  <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td
                      class="p-3 font-bold font-sans text-slate-800 dark:text-slate-200"
                    >
                      Notificaciones In-App
                    </td>
                    <td class="p-3 text-primary dark:text-indigo-400">
                      NOTIFICATION#&lt;userId&gt;
                    </td>
                    <td class="p-3 text-slate-500">
                      NOTIFICATION#&lt;timestamp&gt;
                    </td>
                    <td class="p-3 text-slate-400">-</td>
                    <td
                      class="p-3 font-sans text-slate-600 dark:text-slate-400"
                    >
                      tipo, titulo, cuerpo, leido, enlace
                    </td>
                  </tr>

                  <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td
                      class="p-3 font-bold font-sans text-slate-800 dark:text-slate-200"
                    >
                      Ticket Soporte / Mesa de Ayuda
                    </td>
                    <td class="p-3 text-primary dark:text-indigo-400">
                      SUPPORT#&lt;ticketId&gt;
                    </td>
                    <td class="p-3 text-slate-500">METADATA</td>
                    <td class="p-3 text-slate-400">
                      STATUS#&lt;status&gt; / &lt;updatedAt&gt;
                    </td>
                    <td
                      class="p-3 font-sans text-slate-600 dark:text-slate-400"
                    >
                      assignedModeratorId (Bloqueo concurrente), userRole
                    </td>
                  </tr>

                  <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td
                      class="p-3 font-bold font-sans text-slate-800 dark:text-slate-200"
                    >
                      Mensaje Soporte / Appeal
                    </td>
                    <td class="p-3 text-primary dark:text-indigo-400">
                      SUPPORT#&lt;ticketId&gt;
                    </td>
                    <td class="p-3 text-slate-500">
                      MSG#&lt;timestamp&gt;#&lt;uuid&gt;
                    </td>
                    <td class="p-3 text-slate-400">-</td>
                    <td
                      class="p-3 font-sans text-slate-600 dark:text-slate-400"
                    >
                      senderId, senderRole, text, attachmentUrl
                    </td>
                  </tr>

                  <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td
                      class="p-3 font-bold font-sans text-slate-800 dark:text-slate-200"
                    >
                      Conexión WebSocket Activa
                    </td>
                    <td class="p-3 text-primary dark:text-indigo-400">
                      WS_CONNECTION#&lt;connId&gt;
                    </td>
                    <td class="p-3 text-slate-500">METADATA</td>
                    <td class="p-3 text-slate-400">
                      USER#&lt;userId&gt; / &lt;connId&gt;
                    </td>
                    <td
                      class="p-3 font-sans text-slate-600 dark:text-slate-400"
                    >
                      <span
                        class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-600 border border-amber-500/20"
                        >TTL: 2 Horas</span
                      >
                    </td>
                  </tr>

                  <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td
                      class="p-3 font-bold font-sans text-slate-800 dark:text-slate-200"
                    >
                      Suscripción WebPush VAPID
                    </td>
                    <td class="p-3 text-primary dark:text-indigo-400">
                      USER#&lt;userId&gt;
                    </td>
                    <td class="p-3 text-slate-500">
                      PUSH_SUBSCRIPTION#&lt;hash&gt;
                    </td>
                    <td class="p-3 text-slate-400">-</td>
                    <td
                      class="p-3 font-sans text-slate-600 dark:text-slate-400"
                    >
                      endpoint, keys (p256dh, auth), userAgent
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- DynamoDB Streams reactive flow -->
          <div
            class="bg-slate-50 dark:bg-slate-800/40 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 space-y-3"
          >
            <div
              class="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-sm"
            >
              <span class="material-symbols-outlined text-lg">stream</span>
              DynamoDB Streams: Reactividad Desacoplada sin Polling
            </div>
            <p
              class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed"
            >
              La tabla emite eventos de mutación continuos con la vista
              <code class="font-mono">NEW_AND_OLD_IMAGES</code>. Cuando se
              inserta un mensaje en un chat o cambia el estado de una
              postulación, el stream activa de forma asíncrona un despachador
              que evalúa si el destinatario está conectado por WebSocket (para
              entrega directa) o si se le debe disparar una
              <strong>Notificación WebPush</strong> a su dispositivo a través
              del Service Worker.
            </p>
          </div>
        </div>
      </section>

      <!-- Section 4: Authentication, Security & Google Account Linking -->
      <section id="security" class="space-y-6">
        <div class="flex items-center gap-3">
          <div
            class="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
          >
            <span class="material-symbols-outlined text-2xl">shield</span>
          </div>
          <div>
            <h2 class="text-2xl sm:text-3xl font-extrabold tracking-tight">
              4. Seguridad, Google Login & Account Linking con Re-verificación
            </h2>
            <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Arquitectura Zero-Trust, prevención de secuestro de cuentas
              (Account Takeover) y RBAC riguroso.
            </p>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Account Linking Flow -->
          <div
            class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4"
          >
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span class="material-symbols-outlined text-2xl text-primary"
                  >link</span
                >
                <h3 class="font-bold text-slate-900 dark:text-slate-100">
                  Google Account Linking & Prevención de Takeover
                </h3>
              </div>
              <span
                class="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/20"
              >
                /link-account
              </span>
            </div>

            <p
              class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed"
            >
              Uno de los vectores de ataque más críticos en sistemas de
              autenticación híbrida es la colisión de correos: un atacante que
              controla un correo en un proveedor federado podría sobrescribir
              una cuenta existente con contraseña. JobNet implementa un flujo de
              <strong>doble confirmación de identidad</strong>:
            </p>

            <ol class="space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
              <li class="flex items-start gap-2">
                <span
                  class="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5"
                  >1</span
                >
                <span
                  ><strong>Detección de Colisión:</strong> Al iniciar sesión con
                  Google, si el correo ya existe en Cognito como usuario nativo,
                  el sistema interrumpe el acceso directo.</span
                >
              </li>
              <li class="flex items-start gap-2">
                <span
                  class="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5"
                  >2</span
                >
                <span
                  ><strong>Re-verificación de Contraseña:</strong> El usuario es
                  dirigido a una vista protegida donde debe autenticarse
                  obligatoriamente con su contraseña nativa actual.</span
                >
              </li>
              <li class="flex items-start gap-2">
                <span
                  class="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5"
                  >3</span
                >
                <span
                  ><strong>Fusión Criptográfica:</strong> Una vez validada la
                  identidad, se invoca
                  <code class="font-mono text-[11px]"
                    >AdminLinkProviderForUser</code
                  >
                  de AWS Cognito para unificar el ID federado de Google con el
                  perfil DynamoDB sin duplicar registros.</span
                >
              </li>
            </ol>
          </div>

          <!-- RBAC & Authorization Matrix -->
          <div
            class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4"
          >
            <div class="flex items-center gap-2">
              <span class="material-symbols-outlined text-2xl text-indigo-500"
                >badge</span
              >
              <h3 class="font-bold text-slate-900 dark:text-slate-100">
                Control de Acceso Basado en Roles (RBAC)
              </h3>
            </div>

            <p
              class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed"
            >
              La plataforma define 4 roles canónicos inmutables verificados
              tanto a nivel de middleware en cliente (<code
                class="font-mono text-[11px]"
                >auth-guard.global.ts</code
              >) como en cada microservicio Lambda:
            </p>

            <div class="grid grid-cols-2 gap-3 pt-2">
              <div
                class="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-1"
              >
                <div
                  class="flex items-center gap-1.5 font-bold text-xs text-red-600 dark:text-red-400"
                >
                  <span class="material-symbols-outlined text-sm"
                    >admin_panel_settings</span
                  >
                  ADMIN
                </div>
                <p
                  class="text-[11px] text-slate-500 dark:text-slate-400 leading-snug"
                >
                  Gestión total de la plataforma, auditoría financiera,
                  configuración global de términos y supervisión de moderadores.
                </p>
              </div>

              <div
                class="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-1"
              >
                <div
                  class="flex items-center gap-1.5 font-bold text-xs text-purple-600 dark:text-purple-400"
                >
                  <span class="material-symbols-outlined text-sm">gavel</span>
                  MODERADOR
                </div>
                <p
                  class="text-[11px] text-slate-500 dark:text-slate-400 leading-snug"
                >
                  Resolución de incidencias, apelaciones de empresas, soporte
                  técnico y asignación exclusiva de tickets en tiempo real.
                </p>
              </div>

              <div
                class="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-1"
              >
                <div
                  class="flex items-center gap-1.5 font-bold text-xs text-blue-600 dark:text-blue-400"
                >
                  <span class="material-symbols-outlined text-sm"
                    >business</span
                  >
                  ORGANIZACION
                </div>
                <p
                  class="text-[11px] text-slate-500 dark:text-slate-400 leading-snug"
                >
                  Publicación de ofertas, gestión de candidatos en ATS Kanban,
                  mensajería directa y verificación de dominio empresarial.
                </p>
              </div>

              <div
                class="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-1"
              >
                <div
                  class="flex items-center gap-1.5 font-bold text-xs text-emerald-600 dark:text-emerald-400"
                >
                  <span class="material-symbols-outlined text-sm">person</span>
                  CANDIDATO
                </div>
                <p
                  class="text-[11px] text-slate-500 dark:text-slate-400 leading-snug"
                >
                  Búsqueda con mapas geolocalizados, postulación en un clic,
                  seguimiento de fases, chat con empresas y generador de CV PDF.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Section 5: WebPush VAPID vs Firebase Cloud Messaging (FCM) -->
      <section id="webpush" class="space-y-6">
        <div class="flex items-center gap-3">
          <div
            class="p-2.5 rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20"
          >
            <span class="material-symbols-outlined text-2xl"
              >notifications_active</span
            >
          </div>
          <div>
            <h2 class="text-2xl sm:text-3xl font-extrabold tracking-tight">
              5. Notificaciones WebPush Autónomas: VAPID vs. Google FCM
            </h2>
            <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              ¿Por qué firmamos VAPID directamente en el servidor en lugar de
              usar librerías de terceros como Firebase?
            </p>
          </div>
        </div>

        <div
          class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6"
        >
          <div class="space-y-3">
            <h3 class="text-lg font-bold text-slate-900 dark:text-slate-100">
              Arquitectura Abierta basada en Estándares W3C (RFC 8292 & RFC
              8291)
            </h3>
            <p
              class="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed"
            >
              Muchas aplicaciones delegan las notificaciones push en Firebase
              Cloud Messaging (FCM) agregando librerías cliente pesadas (>500KB)
              que realizan rastreo de telemetría y generan dependencia con el
              ecosistema de Google. En JobNet implementamos el estándar puro
              <strong
                >VAPID (Voluntary Application Server Identification)</strong
              >
              firmando criptográficamente cada payload directamente en
              <strong>AWS Lambda</strong> mediante la librería nativa
              <code class="font-mono">web-push</code> y la API estándar de
              Service Workers en los navegadores.
            </p>
          </div>

          <!-- Comparison Table -->
          <div
            class="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800"
          >
            <table class="w-full text-left text-xs">
              <thead
                class="bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 font-mono text-[11px] border-b border-slate-200 dark:border-slate-800"
              >
                <tr>
                  <th class="p-3">Característica / Dimensión</th>
                  <th
                    class="p-3 text-emerald-600 dark:text-emerald-400 font-bold"
                  >
                    JobNet (VAPID Nativo en Lambda)
                  </th>
                  <th class="p-3 text-slate-500">
                    Firebase Cloud Messaging (FCM)
                  </th>
                </tr>
              </thead>
              <tbody
                class="divide-y divide-slate-100 dark:divide-slate-800/60 font-sans text-xs"
              >
                <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td
                    class="p-3 font-semibold text-slate-900 dark:text-slate-100"
                  >
                    Peso en el Bundle Cliente (Bundle Size)
                  </td>
                  <td
                    class="p-3 text-emerald-600 dark:text-emerald-400 font-bold"
                  >
                    0 KB adicionales (Usa la API Push nativa del navegador)
                  </td>
                  <td class="p-3 text-slate-500">
                    500 KB - 1.2 MB de dependencias y scripts externos
                  </td>
                </tr>

                <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td
                    class="p-3 font-semibold text-slate-900 dark:text-slate-100"
                  >
                    Vendor Lock-In (Independencia)
                  </td>
                  <td
                    class="p-3 text-emerald-600 dark:text-emerald-400 font-bold"
                  >
                    100% Neutral (Entrega a Chrome, Mozilla, Apple WebPush,
                    Edge)
                  </td>
                  <td class="p-3 text-slate-500">
                    Atado a las cuotas y políticas de Google Firebase Console
                  </td>
                </tr>

                <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td
                    class="p-3 font-semibold text-slate-900 dark:text-slate-100"
                  >
                    Privacidad y Telemetría
                  </td>
                  <td
                    class="p-3 text-emerald-600 dark:text-emerald-400 font-bold"
                  >
                    Cero tracking externo; los tokens se cifran en DynamoDB
                  </td>
                  <td class="p-3 text-slate-500">
                    Google recolecta telemetría de dispositivo y uso
                  </td>
                </tr>

                <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td
                    class="p-3 font-semibold text-slate-900 dark:text-slate-100"
                  >
                    Cifrado de Payloads
                  </td>
                  <td
                    class="p-3 text-emerald-600 dark:text-emerald-400 font-bold"
                  >
                    Cifrado ECDH sobre curva P-256 en Node.js (<code
                      class="font-mono text-[10px]"
                      >p256dh + auth</code
                    >)
                  </td>
                  <td class="p-3 text-slate-500">
                    Cifrado gestionado por los servidores intermedios de
                    Firebase
                  </td>
                </tr>

                <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td
                    class="p-3 font-semibold text-slate-900 dark:text-slate-100"
                  >
                    Control de Service Worker
                  </td>
                  <td
                    class="p-3 text-emerald-600 dark:text-emerald-400 font-bold"
                  >
                    <code class="font-mono text-[11px]">sw.js</code> autónomo
                    con acciones interactivas y sincronización de badges
                  </td>
                  <td class="p-3 text-slate-500">
                    <code class="font-mono text-[11px]"
                      >firebase-messaging-sw.js</code
                    >
                    caja negra
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <!-- Section 6: Real-Time WebSockets & Moderator Concurrency -->
      <section id="websockets" class="space-y-6">
        <div class="flex items-center gap-3">
          <div
            class="p-2.5 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20"
          >
            <span class="material-symbols-outlined text-2xl">sync_alt</span>
          </div>
          <div>
            <h2 class="text-2xl sm:text-3xl font-extrabold tracking-tight">
              6. WebSockets Bidireccionales & Control de Concurrencia
            </h2>
            <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Comunicación full-duplex con API Gateway v2 y bloqueo atómico para
              evitar colisiones entre moderadores.
            </p>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div
            class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-3"
          >
            <div
              class="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-sm"
            >
              <span class="material-symbols-outlined">forum</span>
              Canal ATS Empresa-Candidato
            </div>
            <p
              class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed"
            >
              Intercambio de mensajes en tiempo real cuando un candidato avanza
              a la fase <em>"En Contacto"</em>. Soporte para previsualización de
              archivos PDF de currículum y entrega instantánea sin refresco de
              pantalla.
            </p>
          </div>

          <div
            class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-3"
          >
            <div
              class="flex items-center gap-2 text-purple-600 dark:text-purple-400 font-bold text-sm"
            >
              <span class="material-symbols-outlined">support_agent</span>
              Mesa de Ayuda (Help Desk)
            </div>
            <p
              class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed"
            >
              Los candidatos y empresas pueden reportar problemas de la
              plataforma directamente desde la barra lateral. Notificación en
              tiempo real a los moderadores disponibles y persistencia de
              conversación.
            </p>
          </div>

          <div
            class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-3"
          >
            <div
              class="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-sm"
            >
              <span class="material-symbols-outlined">lock_clock</span>
              Auto-Asignación & Lock
            </div>
            <p
              class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed"
            >
              Mecanismo de <strong>bloqueo por concurrencia atómica</strong>: al
              primer mensaje enviado por un moderador, el ticket queda asignado
              exclusivamente a él en DynamoDB. Si otro moderador intenta
              responder, el sistema rechaza la operación evitando respuestas
              contradictorias.
            </p>
          </div>
        </div>
      </section>

      <!-- Section 7: DevOps, GitHooks, GitFlow & 800+ Testing Suite -->
      <section id="devops" class="space-y-6">
        <div class="flex items-center gap-3">
          <div
            class="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
          >
            <span class="material-symbols-outlined text-2xl"
              >verified_user</span
            >
          </div>
          <div>
            <h2 class="text-2xl sm:text-3xl font-extrabold tracking-tight">
              7. DevOps, GitHooks, GitFlow & Suite de 800+ Pruebas
            </h2>
            <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Cultura de ingeniería rigurosa con validaciones automatizadas
              antes de cada commit y push.
            </p>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- GitHooks Details -->
          <div
            class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4"
          >
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span
                  class="material-symbols-outlined text-2xl text-emerald-500"
                  >commit</span
                >
                <h3 class="font-bold text-slate-900 dark:text-slate-100">
                  GitHooks Automatizados (.githooks)
                </h3>
              </div>
              <span
                class="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/20"
              >
                Core Quality Gate
              </span>
            </div>

            <p
              class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed"
            >
              El repositorio configura automáticamente los hooks de Git mediante
              <code class="font-mono text-[11px]">core.hooksPath .githooks</code
              >. Ningún desarrollador puede introducir código que rompa estilos,
              tipos o pruebas:
            </p>

            <div class="space-y-3 font-mono text-xs">
              <div
                class="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-1"
              >
                <div
                  class="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold"
                >
                  <span>🛡️ pre-commit</span>
                  <span class="text-[10px] text-slate-400 font-sans font-normal"
                    >(Local en máquina del dev)</span
                  >
                </div>
                <p
                  class="text-[11px] text-slate-600 dark:text-slate-300 font-sans"
                >
                  Ejecuta en cadena:
                  <code class="text-primary font-mono"
                    >npm run format:check</code
                  >
                  (Prettier),
                  <code class="text-primary font-mono">npm run lint</code>
                  (ESLint),
                  <code class="text-primary font-mono">npm run typecheck</code>
                  (<code class="font-mono">vue-tsc</code> /
                  <code class="font-mono">tsc</code>), y la suite de pruebas
                  unitarias. Si una falla, el commit es abortado inmediatamente.
                </p>
              </div>

              <div
                class="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-1"
              >
                <div
                  class="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold"
                >
                  <span>🛑 pre-push & Jenkins Gatekeeper</span>
                  <span class="text-[10px] text-slate-400 font-sans font-normal"
                    >(Protección de producción)</span
                  >
                </div>
                <p
                  class="text-[11px] text-slate-600 dark:text-slate-300 font-sans"
                >
                  Protege las ramas <code class="font-mono">main</code> y
                  <code class="font-mono">master</code>. Bloquea cualquier push
                  directo sin pasar por el orquestador de CI/CD de Jenkins
                  (<code class="font-mono"
                    >JENKINS_GATEKEEPER_APPROVED=true</code
                  >) garantizando despliegues limpios y reproducibles.
                </p>
              </div>
            </div>
          </div>

          <!-- Testing Breakdown -->
          <div
            class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4"
          >
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span class="material-symbols-outlined text-2xl text-purple-500"
                  >checklist</span
                >
                <h3 class="font-bold text-slate-900 dark:text-slate-100">
                  Desglose de la Suite de Pruebas
                </h3>
              </div>
              <span
                class="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/10 text-purple-600 dark:text-purple-400 font-bold border border-purple-500/20"
              >
                100% Passing
              </span>
            </div>

            <p
              class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed"
            >
              Suite exhaustiva de 799 pruebas automatizadas (516 Back + 283
              Front) que cubren con 100% de éxito la lógica de negocio más
              crítica:
            </p>

            <div class="space-y-2.5 text-xs">
              <div
                class="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800"
              >
                <div class="flex items-center gap-2 font-medium">
                  <span
                    class="material-symbols-outlined text-sm text-indigo-500"
                    >dns</span
                  >
                  <span>Backend (jobnet-back)</span>
                </div>
                <div class="flex items-center gap-3 font-mono">
                  <span class="text-slate-500">43 archivos</span>
                  <span class="font-bold text-emerald-600 dark:text-emerald-400"
                    >516 pruebas ✓</span
                  >
                </div>
              </div>

              <div
                class="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800"
              >
                <div class="flex items-center gap-2 font-medium">
                  <span
                    class="material-symbols-outlined text-sm text-emerald-500"
                    >desktop_windows</span
                  >
                  <span>Frontend (jobnet-front)</span>
                </div>
                <div class="flex items-center gap-3 font-mono">
                  <span class="text-slate-500">31 archivos</span>
                  <span class="font-bold text-emerald-600 dark:text-emerald-400"
                    >283 pruebas ✓</span
                  >
                </div>
              </div>

              <div
                class="flex items-center justify-between p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60 font-bold"
              >
                <div
                  class="flex items-center gap-2 text-primary dark:text-indigo-400"
                >
                  <span class="material-symbols-outlined text-sm">stars</span>
                  <span>Total Cobertura Automatizada</span>
                </div>
                <div class="font-mono text-primary dark:text-indigo-400">
                  799 Pruebas (100% Éxito)
                </div>
              </div>
            </div>

            <div
              class="text-[11px] text-slate-500 dark:text-slate-400 leading-snug pt-1"
            >
              Incluye validación completa de: moderación con IA Gemini,
              verificación de dominios corporativos MX/DNS, cifrado de
              suscripciones VAPID, sincronización atómica de contadores NoSQL y
              flujos de autenticación.
            </div>
          </div>
        </div>
      </section>

      <!-- Section 8: AI-Assisted Moderation -->
      <section id="ai" class="space-y-6">
        <div class="flex items-center gap-3">
          <div
            class="p-2.5 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20"
          >
            <span class="material-symbols-outlined text-2xl">neurology</span>
          </div>
          <div>
            <h2 class="text-2xl sm:text-3xl font-extrabold tracking-tight">
              8. Moderación Híbrida Inteligente (IA + Determinista)
            </h2>
            <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Filtrado multicapa en tiempo de publicación para proteger a la
              comunidad de estafas y contenido ofensivo.
            </p>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div
            class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-3"
          >
            <div
              class="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-sm"
            >
              <span class="material-symbols-outlined">filter_alt</span>
              Capa 0: Filtro Determinista Sub-milisegundo
            </div>
            <p
              class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed"
            >
              Diccionario normalizado con algoritmos de Levenshtein y
              eliminación de diacríticos/leetspeak (<code
                class="font-mono text-[11px]"
                >textNormalizer.ts</code
              >). Detecta al instante palabras altisonantes, spam o patrones
              sospechosos sin incurrir en latencia de llamadas externas.
            </p>
          </div>

          <div
            class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-3"
          >
            <div
              class="flex items-center gap-2 text-purple-600 dark:text-purple-400 font-bold text-sm"
            >
              <span class="material-symbols-outlined">psychology</span>
              Capa 1: Análisis Contextual Multimodal con Gemini
            </div>
            <p
              class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed"
            >
              Integración con la API de <strong>Google Gemini</strong> para
              clasificar texto e imágenes de ofertas de trabajo y publicaciones.
              Evalúa riesgo de fraude financiero, esquemas piramidales,
              discriminación laboral y lenguaje de odio generando incidencias
              automáticas (<code class="font-mono text-[11px]">INCIDENT#</code
              >).
            </p>
          </div>
        </div>
      </section>

      <!-- Section 9: Deployment Pipeline (Terraform & AWS CLI Automation) -->
      <section id="deployment" class="space-y-6">
        <div class="flex items-center gap-3">
          <div
            class="p-2.5 rounded-2xl bg-indigo-500/10 text-primary dark:text-indigo-400 border border-primary/20"
          >
            <span class="material-symbols-outlined text-2xl"
              >rocket_launch</span
            >
          </div>
          <div>
            <h2 class="text-2xl sm:text-3xl font-extrabold tracking-tight">
              9. Pipeline de Despliegue Híbrido: Terraform (IaC) & AWS CLI
            </h2>
            <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Automatización mediante scripts dedicados (deploy-front.ps1 y
              deploy-back.ps1) para aprovisionamiento inmutable y despliegues de
              código en segundos.
            </p>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Card: Frontend SSR Deployment Pipeline -->
          <div
            class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4 hover:border-primary/40 transition-all"
          >
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span
                  class="material-symbols-outlined text-2xl text-emerald-500"
                  >devices</span
                >
                <h3 class="font-bold text-slate-900 dark:text-slate-100">
                  Frontend: Nuxt 4 SSR (deploy-front.ps1)
                </h3>
              </div>
              <span
                class="text-[10px] font-mono px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/20"
              >
                7 Fases Automatizadas
              </span>
            </div>

            <p
              class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed"
            >
              El script personalizado
              <code class="font-mono text-primary">deploy-front.ps1</code>
              orquesta el ciclo de vida completo del cliente SSR, garantizando
              infraestructura inmutable con Terraform y subidas atómicas con AWS
              CLI:
            </p>

            <ol
              class="space-y-2.5 text-xs text-slate-600 dark:text-slate-300 font-sans"
            >
              <li class="flex items-start gap-2.5">
                <span
                  class="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5"
                  >1</span
                >
                <div>
                  <strong>Limpieza y Build Nitro:</strong> Compila con
                  <code class="font-mono text-[11px]"
                    >NITRO_PRESET=aws-lambda</code
                  >
                  generando los directorios
                  <code class="font-mono text-[11px]">.output/server</code> y
                  <code class="font-mono text-[11px]">.output/public</code>.
                </div>
              </li>
              <li class="flex items-start gap-2.5">
                <span
                  class="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5"
                  >2</span
                >
                <div>
                  <strong>Empaquetado Payload Lambda:</strong> Comprime el
                  runtime en
                  <code class="font-mono text-[11px]">dummy_payload.zip</code>
                  con el handler
                  <code class="font-mono text-[11px]">index.mjs</code> en la
                  raíz.
                </div>
              </li>
              <li class="flex items-start gap-2.5">
                <span
                  class="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5"
                  >3</span
                >
                <div>
                  <strong>Aprovisionamiento Terraform:</strong> Ejecuta
                  <code class="font-mono text-[11px]">terraform init</code> y
                  <code class="font-mono text-[11px]">apply -auto-approve</code>
                  en
                  <code class="font-mono text-[11px]"
                    >terraform/environments/prod</code
                  >
                  con estado remoto en S3, exportando dinámicamente el bucket,
                  distribución CloudFront y función Lambda.
                </div>
              </li>
              <li class="flex items-start gap-2.5">
                <span
                  class="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5"
                  >4</span
                >
                <div>
                  <strong>Actualización Directa con AWS CLI:</strong> Despliega
                  el zip empaquetado mediante
                  <code class="font-mono text-[11px]"
                    >aws lambda update-function-code --publish</code
                  >
                  y aguarda estabilización con
                  <code class="font-mono text-[11px]"
                    >aws lambda wait function-updated</code
                  >.
                </div>
              </li>
              <li class="flex items-start gap-2.5">
                <span
                  class="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5"
                  >5</span
                >
                <div>
                  <strong>Sincronización de Variables de Entorno:</strong>
                  Inyecta endpoints de Cognito, URLs de API/WebSocket y claves
                  VAPID en caliente vía
                  <code class="font-mono text-[11px]"
                    >aws lambda update-function-configuration</code
                  >.
                </div>
              </li>
              <li class="flex items-start gap-2.5">
                <span
                  class="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5"
                  >6</span
                >
                <div>
                  <strong>S3 Sync Granular con Caché:</strong>
                  Sube <code class="font-mono text-[11px]">_nuxt/</code> con
                  caché inmutable a 1 año (<code class="font-mono text-[10px]"
                    >max-age=31536000</code
                  >), protege logos y validaciones SAT/Google de borrado, fuerza
                  MIME <code class="font-mono text-[10px]">image/png</code> y
                  publica <code class="font-mono text-[11px]">sw.js</code> con
                  <code class="font-mono text-[10px]">no-cache</code>.
                </div>
              </li>
              <li class="flex items-start gap-2.5">
                <span
                  class="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5"
                  >7</span
                >
                <div>
                  <strong>Invalidación CloudFront:</strong> Dispara
                  <code class="font-mono text-[11px]"
                    >aws cloudfront create-invalidation --paths "/*"</code
                  >
                  para refresco global instantáneo en todos los puntos de
                  presencia (Edge locations).
                </div>
              </li>
            </ol>
          </div>

          <!-- Card: Backend Multi-Lambda Deployment Pipeline -->
          <div
            class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4 hover:border-primary/40 transition-all"
          >
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span class="material-symbols-outlined text-2xl text-amber-500"
                  >terminal</span
                >
                <h3 class="font-bold text-slate-900 dark:text-slate-100">
                  Backend: Multi-Lambda Node 20 (deploy-back.ps1)
                </h3>
              </div>
              <span
                class="text-[10px] font-mono px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold border border-amber-500/20"
              >
                Estrategia Dual (Fast CLI / IaC)
              </span>
            </div>

            <p
              class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed"
            >
              El script
              <code class="font-mono text-primary">deploy-back.ps1</code>
              compila 5 funciones serverless independientes con
              <code class="font-mono text-[11px]">esbuild</code> y permite
              conmutar entre actualización exprés por AWS CLI y
              aprovisionamiento formal con Terraform:
            </p>

            <ol
              class="space-y-2.5 text-xs text-slate-600 dark:text-slate-300 font-sans"
            >
              <li class="flex items-start gap-2.5">
                <span
                  class="w-5 h-5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5"
                  >1</span
                >
                <div>
                  <strong>Multi-Bundling con esbuild:</strong> Compilación
                  ultrarrápida a CommonJS Node 20 para:
                  <code class="font-mono text-[10px]">api</code>,
                  <code class="font-mono text-[10px]">ws</code>,
                  <code class="font-mono text-[10px]">wsAuthorizer</code>,
                  <code class="font-mono text-[10px]">postConfirmation</code> y
                  <code class="font-mono text-[10px]">suspensionExpiry</code>,
                  excluyendo el AWS SDK nativo para un bundle mínimo.
                </div>
              </li>
              <li class="flex items-start gap-2.5">
                <span
                  class="w-5 h-5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5"
                  >2</span
                >
                <div>
                  <strong>Empaquetado de Artefactos ZIP:</strong> Genera
                  paquetes independientes en
                  <code class="font-mono text-[11px]">dist/zips/</code> listos
                  para distribución serverless.
                </div>
              </li>
              <li class="flex items-start gap-2.5">
                <span
                  class="w-5 h-5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5"
                  >3</span
                >
                <div>
                  <strong>Despliegue Híbrido Conmutable:</strong>
                  <div class="mt-1 space-y-1">
                    <div
                      class="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-[11px]"
                    >
                      <span class="font-bold text-slate-800 dark:text-slate-200"
                        >⚡ Modo Rápido (Default con AWS CLI):</span
                      >
                      Actualiza el código de las 5 Lambdas con
                      <code class="font-mono text-[10px]"
                        >aws lambda update-function-code</code
                      >
                      en solo <strong>~10 a 15 segundos</strong>.
                    </div>
                    <div
                      class="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-[11px]"
                    >
                      <span class="font-bold text-slate-800 dark:text-slate-200"
                        >🏗️ Modo Full Terraform (<code class="font-mono"
                          >-FullTerraform</code
                        >):</span
                      >
                      Aplica cambios estructurales (DynamoDB, IAM, API Gateway)
                      con
                      <code class="font-mono text-[10px]">terraform apply</code>
                      y estado remoto en S3.
                    </div>
                  </div>
                </div>
              </li>
              <li class="flex items-start gap-2.5">
                <span
                  class="w-5 h-5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5"
                  >4</span
                >
                <div>
                  <strong>Smoke Test / Health Check:</strong> Valida en tiempo
                  real la disponibilidad del endpoint de producción
                  <code class="font-mono text-[10px]"
                    >https://z79mmps5xk.execute-api.us-east-1.amazonaws.com/health</code
                  >
                  mediante
                  <code class="font-mono text-[11px]">Invoke-RestMethod</code>.
                </div>
              </li>
            </ol>
          </div>
        </div>

        <!-- Comparative & Best Practices Strip -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div
            class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-2xs space-y-1.5"
          >
            <div
              class="flex items-center gap-2 text-primary dark:text-indigo-400 font-bold text-xs"
            >
              <span class="material-symbols-outlined text-sm">terminal</span>
              Wrappers en Raíz del Workspace
            </div>
            <p
              class="text-[11px] text-slate-600 dark:text-slate-300 leading-snug"
            >
              Scripts ejecutables directos
              <code class="font-mono text-[10px]">./deploy-front.ps1</code> y
              <code class="font-mono text-[10px]">./deploy-back.ps1</code> para
              disparar cualquier capa desde la raíz sin cambiar de directorio.
            </p>
          </div>

          <div
            class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-2xs space-y-1.5"
          >
            <div
              class="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-xs"
            >
              <span class="material-symbols-outlined text-sm">security</span>
              Aislamiento AWS Profile Seguro
            </div>
            <p
              class="text-[11px] text-slate-600 dark:text-slate-300 leading-snug"
            >
              Ambos scripts configuran
              <code class="font-mono text-[10px]"
                >AWS_PROFILE=terra-profile</code
              >
              previniendo despliegues accidentales con credenciales o cuentas no
              autorizadas.
            </p>
          </div>

          <div
            class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-2xs space-y-1.5"
          >
            <div
              class="flex items-center gap-2 text-purple-600 dark:text-purple-400 font-bold text-xs"
            >
              <span class="material-symbols-outlined text-sm">cloud</span>
              Estado Remoto en S3 Cifrado
            </div>
            <p
              class="text-[11px] text-slate-600 dark:text-slate-300 leading-snug"
            >
              Backend S3 unificado (<code class="font-mono text-[10px]"
                >jobnet-terraform-state-prod-...</code
              >) con claves
              <code class="font-mono text-[10px]">front/prod</code> y
              <code class="font-mono text-[10px]">back/prod</code> con cifrado
              forzado.
            </p>
          </div>
        </div>
      </section>

      <!-- Footer / Technical Sign-off -->
      <footer
        class="border-t border-slate-200 dark:border-slate-800 pt-8 pb-12 text-center space-y-4"
      >
        <div
          class="flex items-center justify-center gap-2 text-slate-500 dark:text-slate-400 text-xs"
        >
          <span>JobNet Enterprise Platform</span>
          <span>•</span>
          <span
            >Arquitecto y Desarrollador: Francisco Javier Gutierrez
            Herculano</span
          >
          <span>•</span>
          <span>Región AWS: us-east-1</span>
        </div>
        <p
          class="text-[11px] text-slate-400 dark:text-slate-500 max-w-xl mx-auto"
        >
          Documento técnico confidencial generado para revisión de ingeniería,
          auditoría de código y procesos de atracción de talento técnico.
        </p>
      </footer>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { useSeoMeta } from "#imports";

// Isolated documentation route: No default layout
definePageMeta({
  layout: false,
});

useSeoMeta({
  title: "JobNet - Arquitectura Técnica & Blueprint Serverless",
  description:
    "Expediente técnico completo de JobNet: Arquitectura Cloud Native Serverless en AWS, DynamoDB Single-Table Design, WebSockets bidireccionales, VAPID WebPush, pipeline de despliegue con Terraform y AWS CLI, y 799 pruebas automatizadas.",
});

const activeSection = ref("overview");
const navRef = ref<HTMLElement | null>(null);
const isNavCollapsed = ref(false);
const isHeaderVisible = ref(true);
let lastScrollY = 0;

// Mouse Drag State for horizontal scrolling
const isDragging = ref(false);
let startX = 0;
let scrollStartLeft = 0;

const onMouseDown = (e: MouseEvent) => {
  if (!navRef.value) return;
  isDragging.value = true;
  startX = e.pageX - navRef.value.offsetLeft;
  scrollStartLeft = navRef.value.scrollLeft;
};

const onMouseMove = (e: MouseEvent) => {
  if (!isDragging.value || !navRef.value) return;
  e.preventDefault();
  const x = e.pageX - navRef.value.offsetLeft;
  const walk = (x - startX) * 1.5;
  navRef.value.scrollLeft = scrollStartLeft - walk;
};

const onMouseUp = () => {
  isDragging.value = false;
};

// Horizontal mouse wheel scroll support
const handleNavWheel = (e: WheelEvent) => {
  if (!navRef.value) return;
  if (Math.abs(e.deltaY) > 0) {
    navRef.value.scrollLeft += e.deltaY * 0.9;
  }
};

// Arrow navigation helper
const scrollNav = (direction: "left" | "right") => {
  if (!navRef.value) return;
  const offset = direction === "left" ? -240 : 240;
  navRef.value.scrollBy({ left: offset, behavior: "smooth" });
};

// Auto-hide header on scroll down / show on scroll up (both desktop & mobile)
const handleWindowScroll = () => {
  if (typeof window === "undefined") return;
  const currentY = window.scrollY;

  if (currentY <= 60) {
    isHeaderVisible.value = true;
  } else {
    if (currentY > lastScrollY + 8) {
      // Scrolling down -> hide navbar to eliminate visual clutter
      isHeaderVisible.value = false;
    } else if (currentY < lastScrollY - 8) {
      // Scrolling up -> reveal navbar instantly
      isHeaderVisible.value = true;
    }
  }
  lastScrollY = currentY;
};

onMounted(() => {
  if (typeof window !== "undefined") {
    window.addEventListener("scroll", handleWindowScroll, { passive: true });
    window.addEventListener("mouseup", onMouseUp);
  }
});

onUnmounted(() => {
  if (typeof window !== "undefined") {
    window.removeEventListener("scroll", handleWindowScroll);
    window.removeEventListener("mouseup", onMouseUp);
  }
});

const sections = [
  { id: "overview", title: "Resumen & KPIs", icon: "dashboard" },
  { id: "stack", title: "Stack Tecnológico", icon: "layers" },
  { id: "aws", title: "Servicios AWS", icon: "cloud_sync" },
  { id: "dynamodb", title: "DynamoDB (STD)", icon: "table_chart" },
  { id: "security", title: "Seguridad & Auth", icon: "shield" },
  { id: "webpush", title: "WebPush VAPID", icon: "notifications_active" },
  { id: "websockets", title: "WebSockets v2", icon: "sync_alt" },
  { id: "devops", title: "DevOps & Tests", icon: "verified_user" },
  { id: "ai", title: "Moderación IA", icon: "neurology" },
  { id: "deployment", title: "Despliegue & IaC", icon: "rocket_launch" },
];

const scrollTo = (id: string) => {
  activeSection.value = id;
  const el = document.getElementById(id);
  if (el) {
    const yOffset = -120;
    const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
    window.scrollTo({ top: y, behavior: "smooth" });
  }

  // Auto-center the clicked button inside the horizontal nav
  const navBtn = document.getElementById(`nav-btn-${id}`);
  if (navBtn && navRef.value) {
    navBtn.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  }
};
</script>

<style scoped>
.tech-pill {
  @apply text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700;
}

/* Custom sleek scrollbar for horizontal navigation */
.scrollbar-nav::-webkit-scrollbar {
  height: 4px;
}
.scrollbar-nav::-webkit-scrollbar-track {
  background: transparent;
}
.scrollbar-nav::-webkit-scrollbar-thumb {
  background: rgba(148, 163, 184, 0.35);
  border-radius: 9999px;
}
.scrollbar-nav::-webkit-scrollbar-thumb:hover {
  background: rgba(79, 70, 229, 0.6);
}
.scrollbar-nav {
  scrollbar-width: thin;
  scrollbar-color: rgba(148, 163, 184, 0.35) transparent;
}
</style>
