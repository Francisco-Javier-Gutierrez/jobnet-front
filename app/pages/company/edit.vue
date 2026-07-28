<template>
  <main
    class="flex-grow pt-4 pb-36 px-4 md:px-8 flex flex-col gap-6 max-w-4xl mx-auto w-full bg-background dark:bg-slate-950 dark:text-slate-100 transition-colors duration-200"
  >
    <!-- Header Section (RF-33: Logo + Nombre Comercial preview) -->
    <div
      class="flex items-center gap-4 mt-4 p-4 bg-surface-container-lowest dark:bg-slate-900 border border-outline-variant/60 rounded-2xl shadow-sm"
    >
      <div
        class="w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden bg-white dark:bg-slate-900 border border-outline-variant/80 shadow-md flex items-center justify-center relative group cursor-pointer flex-shrink-0 p-1.5"
        @click="triggerLogoSelect"
        title="Cambiar logotipo corporativo"
      >
        <img
          alt="Logotipo Corporativo"
          class="w-full h-full object-contain rounded-xl"
          :src="
            fotoPerfil ||
            'https://lh3.googleusercontent.com/aida-public/AB6AXuBv7ieXvxtMvK4Bf5kvEuqFTPF59k2wFj0FOiA-v1xXN5VHCH9_ZcdYzKj6xGbyBIeLHVW5FuXPuhZ8ghouEp8A22nMpZV0iW6Zvg_YQ0avpohEqle9p-AR9bgPXdnJadM20BCP6_nuDkNCMnR9ywHb5fxRNfK1sAIL6bXl7qjeDQaRa5J--hkEcazv-m8Brqe_BbKSdIGlVhXvuRzLzSM3HSd57GyjW2Ueeh0XvBP7u4bT3o0EWgnO0Q'
          "
        />
        <div
          class="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"
        >
          <span class="material-symbols-outlined text-white text-xl"
            >add_a_photo</span
          >
        </div>
      </div>

      <div class="min-w-0 flex-grow">
        <h1
          class="text-xl font-bold text-on-background dark:text-slate-100 truncate"
        >
          {{ nombreComercial || "Mi Organización" }}
        </h1>
        <p
          class="text-xs text-on-surface-variant dark:text-slate-300 flex items-center gap-1"
        >
          <span class="material-symbols-outlined text-sm text-primary"
            >domain</span
          >
          Configuración e Identidad Corporativa (Organización)
        </p>
      </div>

      <NuxtLink
        :to="`/company/${companyId}`"
        class="px-3 py-1.5 bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-bold rounded-xl transition flex items-center gap-1 active:scale-95"
      >
        <span class="material-symbols-outlined text-sm">visibility</span>
        Ver Perfil Público
      </NuxtLink>
    </div>

    <!-- Segmented Navigation Tabs -->
    <div
      class="w-full border-b border-outline-variant/60 overflow-x-auto hide-scrollbar"
    >
      <nav class="flex gap-4 min-w-max pb-1">
        <button
          v-for="tab in tabItems"
          :key="tab.id"
          @click="activeTab = tab.id"
          :class="[
            activeTab === tab.id
              ? 'text-primary border-b-2 border-primary font-bold'
              : 'text-on-surface-variant dark:text-slate-300 hover:text-primary',
          ]"
          class="pb-2.5 px-2 text-xs font-medium transition-colors flex items-center gap-1.5"
        >
          <span class="material-symbols-outlined text-base">{{
            tab.icon
          }}</span>
          {{ tab.label }}
        </button>
      </nav>
    </div>

    <!-- Status Messages -->
    <div
      v-if="successMessage"
      class="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 p-4 rounded-xl flex items-center gap-2 text-xs font-bold shadow-sm"
    >
      <span class="material-symbols-outlined text-emerald-600"
        >check_circle</span
      >
      {{ successMessage }}
    </div>

    <div
      v-if="errorMessage"
      class="bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300 p-4 rounded-xl flex items-center gap-2 text-xs font-bold shadow-sm"
    >
      <span class="material-symbols-outlined text-rose-600">error</span>
      {{ errorMessage }}
    </div>

    <!-- Draft Restore Notification Banner -->
    <div
      v-if="hasDraft"
      class="bg-primary/10 border border-primary/20 text-on-surface text-xs p-3 rounded-xl flex items-center justify-between"
    >
      <span class="flex items-center gap-1.5 font-medium">
        <span class="material-symbols-outlined text-base text-primary"
          >info</span
        >
        Se ha restaurado un borrador con cambios sin guardar de la organización.
      </span>
      <button
        type="button"
        @click="discardDraft"
        class="text-rose-500 hover:text-rose-600 font-bold transition"
      >
        Descartar
      </button>
    </div>

    <!-- Tab 1: Identidad Visual (RF-33) -->
    <section v-show="activeTab === 'identidad'" class="flex flex-col gap-6">
      <div
        class="bg-surface-container-lowest dark:bg-slate-900 dark:border-slate-800 border border-outline-variant/60 rounded-2xl p-6 flex flex-col gap-5 shadow-sm"
      >
        <h2
          class="text-base font-bold text-on-background flex items-center gap-2 border-b border-outline-variant/40 pb-3"
        >
          <span class="material-symbols-outlined text-primary">palette</span>
          Identidad Visual Corporativa
        </h2>

        <!-- Logo Upload Control -->
        <div
          class="flex items-center gap-5 p-5 bg-surface-container-low/40 rounded-2xl border border-outline-variant/40"
        >
          <div
            class="w-24 h-24 md:w-28 md:h-28 rounded-2xl overflow-hidden bg-white dark:bg-slate-900 border border-outline-variant/80 shadow-md flex items-center justify-center relative group cursor-pointer flex-shrink-0 p-1.5"
            @click="triggerLogoSelect"
          >
            <img
              alt="Logo Corporativo"
              class="w-full h-full object-contain rounded-xl"
              :src="
                fotoPerfil ||
                'https://lh3.googleusercontent.com/aida-public/AB6AXuBv7ieXvxtMvK4Bf5kvEuqFTPF59k2wFj0FOiA-v1xXN5VHCH9_ZcdYzKj6xGbyBIeLHVW5FuXPuhZ8ghouEp8A22nMpZV0iW6Zvg_YQ0avpohEqle9p-AR9bgPXdnJadM20BCP6_nuDkNCMnR9ywHb5fxRNfK1sAIL6bXl7qjeDQaRa5J--hkEcazv-m8Brqe_BbKSdIGlVhXvuRzLzSM3HSd57GyjW2Ueeh0XvBP7u4bT3o0EWgnO0Q'
              "
            />
            <div
              class="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"
            >
              <span class="material-symbols-outlined text-white text-xl"
                >add_a_photo</span
              >
            </div>
          </div>

          <div class="flex flex-col gap-1 min-w-0">
            <p class="text-xs font-bold text-on-background">
              Logotipo Corporativo
            </p>
            <p class="text-[11px] text-on-surface-variant dark:text-slate-300">
              Formatos soportados: PNG, JPG, WEBP, SVG (Máximo 5MB).
            </p>
            <div class="flex items-center gap-2 mt-1">
              <button
                type="button"
                @click="triggerLogoSelect"
                :disabled="uploadingLogo"
                class="px-3 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary font-bold text-xs rounded-xl transition disabled:opacity-50 flex items-center gap-1 active:scale-95"
              >
                <span v-if="uploadingLogo" class="animate-spin text-xs"
                  >⌛</span
                >
                <span>{{
                  uploadingLogo ? "Subiendo..." : "Subir Nuevo Logotipo"
                }}</span>
              </button>
            </div>
            <input
              type="file"
              ref="logoFileInput"
              @change="handleLogoUpload"
              accept="image/*"
              class="hidden"
            />
          </div>
        </div>

        <!-- Nombre Comercial -->
        <div class="flex flex-col gap-1.5">
          <label
            class="text-xs font-bold text-on-surface-variant dark:text-slate-300"
            for="nombre-comercial"
          >
            Nombre Comercial de la Organización *
          </label>
          <input
            v-model="nombreComercial"
            id="nombre-comercial"
            type="text"
            placeholder="Ej: TechSolutions Internacional"
            class="w-full bg-surface border border-outline-variant/60 focus:border-primary rounded-xl px-4 py-2.5 text-xs text-on-background outline-none transition"
          />
        </div>

        <div>
          <AppSelect
            v-model="sector"
            label="Sector Económico Principal"
            :options="[
              {
                value: 'Tecnología y Software',
                label: 'Tecnología y Software',
                icon: 'computer',
              },
              {
                value: 'Recursos Humanos',
                label: 'Recursos Humanos y Reclutamiento',
                icon: 'groups',
              },
              {
                value: 'Finanzas y Banca',
                label: 'Finanzas y Banca',
                icon: 'account_balance',
              },
              {
                value: 'Salud y Farmacéutica',
                label: 'Salud y Farmacéutica',
                icon: 'local_hospital',
              },
              {
                value: 'Educación e Investigación',
                label: 'Educación e Investigación',
                icon: 'school',
              },
              {
                value: 'Manufactura e Industria',
                label: 'Manufactura e Industria',
                icon: 'precision_manufacturing',
              },
              {
                value: 'Comercio Electrónico y Retail',
                label: 'Comercio Electrónico y Retail',
                icon: 'shopping_cart',
              },
              { value: 'Otro', label: 'Otro Sector', icon: 'business' },
            ]"
          />
        </div>

        <!-- Ubicación en Mapa (Leaflet Map) -->
        <div class="flex flex-col gap-2 mt-2">
          <div class="flex items-center justify-between">
            <label
              class="text-xs font-bold text-on-surface-variant dark:text-slate-300"
            >
              Ubicación Geográfica en Mapa
            </label>
            <button
              type="button"
              @click="useCurrentLocation"
              class="text-xs font-bold text-primary hover:underline flex items-center gap-1 transition"
            >
              <span class="material-symbols-outlined text-sm">my_location</span>
              Usar ubicación actual
            </button>
          </div>
          <div
            id="company-leaflet-map"
            class="w-full h-48 rounded-xl border border-outline-variant/60 overflow-hidden bg-surface-container-low shadow-sm z-10"
          ></div>
        </div>
      </div>
    </section>

    <!-- Tab 2: Perfil Corporativo (RF-34) -->
    <section v-show="activeTab === 'perfil'" class="flex flex-col gap-6">
      <div
        class="bg-surface-container-lowest dark:bg-slate-900 dark:border-slate-800 border border-outline-variant/60 rounded-2xl p-6 flex flex-col gap-5 shadow-sm"
      >
        <h2
          class="text-base font-bold text-on-background flex items-center gap-2 border-b border-outline-variant/40 pb-3"
        >
          <span
            class="material-symbols-outlined text-indigo-600 dark:text-indigo-400"
            >business</span
          >
          Edición de Perfil Corporativo
        </h2>

        <!-- Descripción General -->
        <div class="flex flex-col gap-1.5">
          <label
            class="text-xs font-bold text-on-surface-variant dark:text-slate-300"
            for="descripcion"
          >
            Descripción General de la Empresa *
          </label>
          <textarea
            v-model="descripcion"
            id="descripcion"
            rows="4"
            placeholder="Escribe una visión global de tu organización, a qué se dedica, mercado meta e historia..."
            class="w-full bg-surface border border-outline-variant/60 focus:border-primary rounded-xl px-4 py-2.5 text-xs text-on-background outline-none transition resize-none"
          ></textarea>
        </div>

        <!-- Misión -->
        <div class="flex flex-col gap-1.5">
          <label
            class="text-xs font-bold text-on-surface-variant dark:text-slate-300 flex items-center gap-1"
            for="mision"
          >
            <span class="material-symbols-outlined text-sm text-indigo-500"
              >flag</span
            >
            Misión Corporativa
          </label>
          <textarea
            v-model="mision"
            id="mision"
            rows="3"
            placeholder="Define el propósito fundamental y razón de ser de la organización..."
            class="w-full bg-surface border border-outline-variant/60 focus:border-primary rounded-xl px-4 py-2.5 text-xs text-on-background outline-none transition resize-none"
          ></textarea>
        </div>

        <!-- Visión -->
        <div class="flex flex-col gap-1.5">
          <label
            class="text-xs font-bold text-on-surface-variant dark:text-slate-300 flex items-center gap-1"
            for="vision"
          >
            <span class="material-symbols-outlined text-sm text-purple-500"
              >visibility</span
            >
            Visión Corporativa
          </label>
          <textarea
            v-model="vision"
            id="vision"
            rows="3"
            placeholder="Describe las metas a futuro y hacia dónde aspira llegar la empresa..."
            class="w-full bg-surface border border-outline-variant/60 focus:border-primary rounded-xl px-4 py-2.5 text-xs text-on-background outline-none transition resize-none"
          ></textarea>
        </div>

        <!-- Beneficios o Cultura Laboral -->
        <div class="flex flex-col gap-1.5">
          <label
            class="text-xs font-bold text-on-surface-variant dark:text-slate-300 flex items-center gap-1"
            for="beneficios"
          >
            <span class="material-symbols-outlined text-sm text-emerald-500"
              >card_giftcard</span
            >
            Beneficios y Cultura Laboral
          </label>
          <textarea
            v-model="beneficios"
            id="beneficios"
            rows="4"
            placeholder="Detalla la cultura de trabajo, horario flexible, trabajo remoto, seguro médico, bonos o capacitación contínua..."
            class="w-full bg-surface border border-outline-variant/60 focus:border-primary rounded-xl px-4 py-2.5 text-xs text-on-background outline-none transition resize-none"
          ></textarea>
        </div>
      </div>
    </section>

    <!-- Tab 3: Documentos Corporativos Relevantes ("Documentos Relevantes") -->
    <section v-show="activeTab === 'documentos'" class="flex flex-col gap-6">
      <div
        class="bg-surface-container-lowest dark:bg-slate-900 dark:border-slate-800 border border-outline-variant/60 rounded-2xl p-6 flex flex-col gap-5 shadow-sm"
      >
        <h2
          class="text-base font-bold text-on-background flex items-center gap-2 border-b border-outline-variant/40 pb-3"
        >
          <span
            class="material-symbols-outlined text-rose-600 dark:text-rose-400"
            >verified</span
          >
          Documentos Corporativos Relevantes (ISO, NOMs, Registro Mercantil)
        </h2>
        <p
          class="text-xs text-on-surface-variant dark:text-slate-300 leading-relaxed"
        >
          Sube tus certificaciones de calidad ISO, constancias de cumplimiento
          NOM, Registro Mercantil u otros documentos estratégicos que den
          credibilidad a tu organización frente a candidatos y postulantes.
        </p>

        <!-- List of Already Uploaded Corporate Documents -->
        <div v-if="documentosCorporativos.length > 0" class="space-y-3">
          <p class="text-xs font-bold text-on-background">
            Documentos Corporativos Registrados ({{
              documentosCorporativos.length
            }})
          </p>

          <div
            v-for="(doc, idx) in documentosCorporativos"
            :key="doc.id || idx"
            class="bg-surface-container-low/40 dark:bg-slate-800/40 border border-outline-variant/50 dark:border-slate-800 rounded-xl p-4 flex items-center justify-between flex-wrap gap-3"
          >
            <div class="flex items-center gap-3 min-w-0">
              <div
                class="w-10 h-10 rounded-xl bg-indigo-600/10 text-indigo-600 flex items-center justify-center flex-shrink-0"
              >
                <span class="material-symbols-outlined text-xl"
                  >workspace_premium</span
                >
              </div>
              <div class="min-w-0">
                <div class="flex items-center gap-2 flex-wrap">
                  <span
                    class="text-[10px] font-bold uppercase tracking-wider bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 px-2 py-0.5 rounded-md border border-indigo-200 dark:border-indigo-800"
                  >
                    {{ doc.tipo || "Certificación Corporativa" }}
                  </span>
                </div>
                <p class="text-xs font-bold text-on-background truncate mt-1">
                  {{ doc.nombre || "Documento_Corporativo.pdf" }}
                </p>
                <p class="text-[10px] text-slate-500 dark:text-slate-400">
                  Subido: {{ doc.fechaCarga || "Recientemente" }}
                </p>
              </div>
            </div>

            <!-- Controls: Visualizar & Eliminar -->
            <div class="flex items-center gap-2">
              <button
                type="button"
                @click="previewDoc(doc)"
                class="px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-indigo-500 text-indigo-600 dark:text-indigo-400 font-bold text-xs rounded-lg transition flex items-center gap-1 shadow-sm active:scale-95"
              >
                <span class="material-symbols-outlined text-sm"
                  >visibility</span
                >
                Visualizar
              </button>

              <button
                type="button"
                @click="removeDoc(idx)"
                class="px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-rose-500 text-rose-600 font-bold text-xs rounded-lg transition flex items-center gap-1 shadow-sm active:scale-95"
              >
                <span class="material-symbols-outlined text-sm">delete</span>
                Eliminar
              </button>
            </div>
          </div>
        </div>

        <!-- Mini-Form to Add New Corporate Document -->
        <div
          class="bg-surface-container-low/60 dark:bg-slate-800/60 border border-outline-variant/60 dark:border-slate-800 rounded-xl p-4 space-y-3"
        >
          <p
            class="text-xs font-bold text-on-background flex items-center gap-1.5"
          >
            <span class="material-symbols-outlined text-sm text-indigo-500"
              >post_add</span
            >
            Agregar Nuevo Documento Relevante
          </p>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div class="flex flex-col gap-1">
              <label
                class="text-[11px] font-bold text-on-surface-variant dark:text-slate-300"
              >
                Naturaleza / Tipo de Documento *
              </label>
              <input
                v-model="nuevoDocTipo"
                type="text"
                placeholder="Ej: Certificación ISO 9001, Cumplimiento NOM, Registro Mercantil, Brochure..."
                class="w-full bg-surface border border-outline-variant/60 focus:border-primary rounded-xl px-3 py-2 text-xs text-on-background outline-none transition"
              />
            </div>

            <div class="flex flex-col gap-1">
              <label
                class="text-[11px] font-bold text-on-surface-variant dark:text-slate-300"
              >
                Nombre Personalizado del Archivo
              </label>
              <input
                v-model="nuevoDocNombre"
                type="text"
                placeholder="Ej: Certificación ISO 9001:2015 Vigente"
                class="w-full bg-surface border border-outline-variant/60 focus:border-primary rounded-xl px-3 py-2 text-xs text-on-background outline-none transition"
              />
            </div>
          </div>

          <!-- Drag & Drop Upload Zone strictly for PDF -->
          <div
            @click="$refs.docFileInput.click()"
            @dragover.prevent="docDragOver = true"
            @dragleave.prevent="docDragOver = false"
            @drop.prevent="handleDocDrop"
            :class="[
              docDragOver
                ? 'border-indigo-500 bg-indigo-500/5'
                : 'border-outline-variant bg-surface-container-low/40 hover:border-indigo-400',
            ]"
            class="border-2 border-dashed rounded-xl p-5 flex flex-col items-center justify-center cursor-pointer transition text-center"
          >
            <div v-if="uploadStore.uploading" class="w-full max-w-xs space-y-2">
              <div
                class="flex items-center justify-between text-xs font-bold text-indigo-600 dark:text-indigo-400"
              >
                <span>{{ uploadStore.uploadProgress }}</span>
              </div>
              <div
                class="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden"
              >
                <div
                  class="h-full bg-gradient-to-r from-indigo-500 to-purple-600 animate-pulse w-full"
                ></div>
              </div>
            </div>

            <template v-else>
              <span
                class="material-symbols-outlined text-indigo-500 text-3xl mb-1"
              >
                cloud_upload
              </span>
              <span class="text-xs font-bold text-on-surface">
                Selecciona o arrastra el documento PDF de la organización aquí
              </span>
              <span
                class="text-[11px] text-on-surface-variant dark:text-slate-400 mt-0.5"
              >
                Formato estrictamente PDF (.pdf) — Tamaño máximo: 5MB
              </span>
            </template>

            <input
              type="file"
              ref="docFileInput"
              @change="handleDocSelect"
              accept="application/pdf"
              class="hidden"
            />
          </div>

          <p
            v-if="docError"
            class="text-xs text-rose-600 font-semibold bg-rose-50 dark:bg-rose-950/40 p-2.5 rounded-lg border border-rose-200 dark:border-rose-800"
          >
            ⚠️ {{ docError }}
          </p>
        </div>
      </div>
    </section>

    <!-- Tab 4: Marca y Redes -->
    <section v-show="activeTab === 'marca'" class="flex flex-col gap-6">
      <div
        class="bg-surface-container-lowest dark:bg-slate-900 dark:border-slate-800 border border-outline-variant/60 rounded-2xl p-6 flex flex-col gap-4 shadow-sm"
      >
        <h2
          class="text-base font-bold text-on-background flex items-center gap-2 border-b border-outline-variant/40 pb-3"
        >
          <span class="material-symbols-outlined text-primary">language</span>
          Presencia de Marca y Redes Oficiales
        </h2>

        <div class="flex flex-col gap-1.5">
          <label
            class="text-xs font-bold text-on-surface-variant dark:text-slate-300"
            for="sitio-web"
          >
            Sitio Web Oficial
          </label>
          <input
            v-model="website"
            id="sitio-web"
            type="url"
            placeholder="https://www.tuempresa.com"
            class="w-full bg-surface border border-outline-variant/60 focus:border-primary rounded-xl px-4 py-2.5 text-xs text-on-background outline-none transition"
          />
        </div>

        <div class="flex flex-col gap-1.5">
          <label
            class="text-xs font-bold text-on-surface-variant dark:text-slate-300"
            for="linkedin"
          >
            Perfil de LinkedIn Corporativo
          </label>
          <input
            v-model="linkedin"
            id="linkedin"
            type="url"
            placeholder="https://linkedin.com/company/tuempresa"
            class="w-full bg-surface border border-outline-variant/60 focus:border-primary rounded-xl px-4 py-2.5 text-xs text-on-background outline-none transition"
          />
        </div>
      </div>
    </section>

    <!-- Tab 5: Verificación Fiscal (Insignia) -->
    <section v-show="activeTab === 'verificacion'" class="flex flex-col gap-6">
      <div
        class="bg-surface-container-lowest dark:bg-slate-900 dark:border-slate-800 border border-outline-variant/60 rounded-2xl p-6 flex flex-col gap-4 shadow-sm"
      >
        <h2
          class="text-base font-bold text-on-background flex items-center gap-2 border-b border-outline-variant/40 pb-3"
        >
          <span class="material-symbols-outlined text-emerald-600"
            >verified_user</span
          >
          Insignia de Verificación Corporativa
        </h2>

        <p
          class="text-xs text-on-surface-variant dark:text-slate-300 leading-relaxed"
        >
          Sube tu Constancia de Situación Fiscal o RFC para certificar tu
          empresa frente a los candidatos.
        </p>

        <div class="flex flex-col gap-1.5">
          <label
            class="text-xs font-bold text-on-surface-variant dark:text-slate-300"
            for="tax-id"
          >
            RFC / Identificador Fiscal
          </label>
          <input
            v-model="taxId"
            id="tax-id"
            type="text"
            placeholder="Ej: ABC123456XYZ"
            class="w-full bg-surface border border-outline-variant/60 focus:border-primary rounded-xl px-4 py-2.5 text-xs text-on-background outline-none transition uppercase"
          />
        </div>

        <button
          @click="handleVerificationRequest"
          :disabled="submittingVerification"
          class="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs py-3 px-4 rounded-xl transition flex items-center justify-center gap-2 active:scale-95"
        >
          <span class="material-symbols-outlined text-sm">verified</span>
          {{
            submittingVerification
              ? "Enviando..."
              : "Solicitar Verificación de Empresa"
          }}
        </button>
      </div>
    </section>

    <!-- Tab 6: Seguridad y MFA -->
    <section v-show="activeTab === 'seguridad'" class="flex flex-col gap-6">
      <MfaSettingsCard
        :user-id="companyId || ''"
        :initial-mfa-state="mfaEnabled"
        @mfa-updated="(state) => (mfaEnabled = state)"
      />
    </section>

    <!-- Standardized Corporate Document Viewer -->
    <AppDocumentViewer
      v-model="isPdfModalOpen"
      :url="activePreviewUrl"
      :title="activePreviewName"
    />

    <!-- Save Action Button -->
    <button
      @click="handleSave"
      :disabled="saving"
      class="bg-primary hover:bg-primary-container disabled:opacity-50 text-white font-semibold text-sm h-12 rounded-xl transition shadow-md shadow-primary/20 flex items-center justify-center gap-2 active:scale-95 duration-100 mt-4"
    >
      <span class="material-symbols-outlined text-lg">{{
        saving ? "sync" : "save"
      }}</span>
      {{ saving ? "Guardando..." : "Guardar Perfil de la Organización" }}
    </button>
  </main>
</template>

<script setup lang="ts">
import { useUploadStore } from "../../stores/upload";

interface DocumentoCorporativo {
  id: string;
  tipo: string;
  nombre: string;
  url: string;
  fechaCarga: string;
}

useSeoMeta({
  title: "Configuración Corporativa - JobNet",
  description:
    "Administra la identidad visual, perfil corporativo y documentos relevantes de la organización",
});

useHead({
  link: [
    {
      rel: "stylesheet",
      href: "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css",
      crossorigin: "",
    },
  ],
});

const router = useRouter();
const config = useRuntimeConfig();
const { data: sessionData, status } = useAuth();
const uploadStore = useUploadStore();

const activeTab = ref("identidad");
const mfaEnabled = ref(false);

const tabItems = [
  { id: "identidad", label: "Identidad Visual", icon: "palette" },
  { id: "perfil", label: "Perfil Corporativo", icon: "business" },
  { id: "documentos", label: "Documentos Relevantes", icon: "verified" },
  { id: "marca", label: "Marca y Redes", icon: "language" },
  { id: "verificacion", label: "Verificación Fiscal", icon: "verified_user" },
  { id: "seguridad", label: "Seguridad y MFA", icon: "shield_lock" },
];

// Form fields state for ORGANIZACION
const companyId = ref("");
const nombreComercial = ref("");
const sector = ref("Tecnología y Software");
const fotoPerfil = ref("");

// RF-34 fields
const descripcion = ref("");
const mision = ref("");
const vision = ref("");
const beneficios = ref("");

// Web & Tax
const website = ref("");
const linkedin = ref("");
const taxId = ref("");

// Map variables
const latitude = ref(19.4326);
const longitude = ref(-99.1332);
let map: any = null;
let marker: any = null;

// Corporate Documents State ("Documentos Relevantes")
const documentosCorporativos = ref<DocumentoCorporativo[]>([]);
const nuevoDocTipo = ref("Certificación ISO");
const nuevoDocNombre = ref("");
const docDragOver = ref(false);
const docError = ref("");
const docFileInput = ref<HTMLInputElement | null>(null);

// Modal state
const isPdfModalOpen = ref(false);
const activePreviewUrl = ref("");
const activePreviewName = ref("");

// Actions state
const loading = ref(true);
const saving = ref(false);
const uploadingLogo = ref(false);
const submittingVerification = ref(false);
const successMessage = ref("");
const errorMessage = ref("");
const logoFileInput = ref<HTMLInputElement | null>(null);

// Draft State
const hasDraft = ref(false);
let isRestoring = false;

const previewDoc = (doc: DocumentoCorporativo) => {
  activePreviewUrl.value = doc.url;
  activePreviewName.value = doc.nombre || doc.tipo;
  isPdfModalOpen.value = true;
};

const removeDoc = (index: number) => {
  documentosCorporativos.value.splice(index, 1);
};

const triggerLogoSelect = () => {
  logoFileInput.value?.click();
};

const saveDraft = () => {
  if (process.client && !isRestoring) {
    if (
      nombreComercial.value ||
      descripcion.value ||
      mision.value ||
      documentosCorporativos.value.length > 0
    ) {
      localStorage.setItem(
        "jobnet_draft_company_edit",
        JSON.stringify({
          nombreComercial: nombreComercial.value,
          sector: sector.value,
          descripcion: descripcion.value,
          mision: mision.value,
          vision: vision.value,
          beneficios: beneficios.value,
          latitude: latitude.value,
          longitude: longitude.value,
          website: website.value,
          linkedin: linkedin.value,
          taxId: taxId.value,
          fotoPerfil: fotoPerfil.value,
          documentosCorporativos: documentosCorporativos.value,
        }),
      );
    }
  }
};

const loadDraft = () => {
  if (process.client) {
    const saved = localStorage.getItem("jobnet_draft_company_edit");
    if (saved) {
      try {
        const draft = JSON.parse(saved);
        if (
          draft.nombreComercial ||
          draft.descripcion ||
          draft.mision ||
          draft.documentosCorporativos?.length > 0
        ) {
          isRestoring = true;
          nombreComercial.value = draft.nombreComercial || "";
          sector.value = draft.sector || "Tecnología y Software";
          descripcion.value = draft.descripcion || "";
          mision.value = draft.mision || "";
          vision.value = draft.vision || "";
          beneficios.value = draft.beneficios || "";
          latitude.value = draft.latitude || 19.4326;
          longitude.value = draft.longitude || -99.1332;
          website.value = draft.website || "";
          linkedin.value = draft.linkedin || "";
          taxId.value = draft.taxId || "";
          fotoPerfil.value = draft.fotoPerfil || "";
          documentosCorporativos.value = draft.documentosCorporativos || [];
          hasDraft.value = true;
          isRestoring = false;
        }
      } catch (e) {
        console.error("Error loading company edit draft:", e);
      }
    }
  }
};

const discardDraft = () => {
  if (process.client) {
    localStorage.removeItem("jobnet_draft_company_edit");
    hasDraft.value = false;
    fetchCompanyProfile();
  }
};

watch(
  [
    nombreComercial,
    sector,
    descripcion,
    mision,
    vision,
    beneficios,
    documentosCorporativos,
    website,
    linkedin,
    fotoPerfil,
  ],
  () => {
    saveDraft();
  },
  { deep: true },
);

const processDocFile = async (file: File) => {
  docError.value = "";

  const isPdfExtension = file.name.toLowerCase().endsWith(".pdf");
  const isPdfMime = file.type === "application/pdf";

  if (!isPdfExtension || (!isPdfMime && file.type !== "")) {
    docError.value =
      "Error: El archivo seleccionado no es un formato PDF válido. Cargue únicamente archivos .pdf";
    return;
  }

  if (file.size > 5 * 1024 * 1024) {
    docError.value =
      "Error: El archivo PDF supera el tamaño máximo permitido (5MB).";
    return;
  }

  const userId = companyId.value || "company";
  const result = await uploadStore.uploadFile(file, "corporate_docs", userId);

  if (result.success) {
    const docTitle = nuevoDocNombre.value.trim() || file.name;
    const docEntry: DocumentoCorporativo = {
      id: Date.now().toString(),
      tipo: nuevoDocTipo.value || "Certificación Corporativa",
      nombre: docTitle,
      url: result.url,
      fechaCarga: new Date().toLocaleDateString("es-ES"),
    };

    documentosCorporativos.value.push(docEntry);
    nuevoDocNombre.value = "";
    successMessage.value = `¡Documento "${docTitle}" (${docEntry.tipo}) cargado exitosamente!`;
    setTimeout(() => {
      successMessage.value = "";
    }, 3500);
  } else {
    docError.value =
      result.error || "Error al cargar el documento corporativo.";
  }
};

const handleDocSelect = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (file) processDocFile(file);
};

const handleDocDrop = (event: DragEvent) => {
  docDragOver.value = false;
  const file = event.dataTransfer?.files?.[0];
  if (file) processDocFile(file);
};

const handleLogoUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file) return;

  uploadingLogo.value = true;
  successMessage.value = "";
  errorMessage.value = "";

  const result = await uploadStore.uploadFile(file, "logos", companyId.value);

  if (result.success) {
    fotoPerfil.value = result.url;
    successMessage.value = "¡Logotipo subido exitosamente!";
    setTimeout(() => {
      successMessage.value = "";
    }, 3000);
  } else {
    errorMessage.value =
      result.error || "Error al subir el logotipo corporativo.";
  }

  uploadingLogo.value = false;
};

const fetchCompanyProfile = async () => {
  if (status.value !== "authenticated" || !sessionData.value?.user?.id) {
    router.push("/login");
    return;
  }

  companyId.value = sessionData.value.user.id;
  loading.value = true;

  try {
    const profile = await $fetch<any>(
      `${config.public.apiUrl}/profile/${companyId.value}`,
    );
    if (profile) {
      nombreComercial.value = profile.nombre || profile.nombreComercial || "";
      sector.value = profile.sector || "Tecnología y Software";
      descripcion.value = profile.biografia || profile.descripcion || "";
      mision.value = profile.mision || "";
      vision.value = profile.vision || "";
      beneficios.value = profile.beneficios || profile.culturaLaboral || "";
      fotoPerfil.value = profile.fotoPerfil || "";
      taxId.value = profile.taxId || "";
      mfaEnabled.value = Boolean(profile.mfaConfigured || profile.mfaEnabled);
      documentosCorporativos.value = profile.documentosCorporativos || [];

      if (profile.ubicacion) {
        if (typeof profile.ubicacion === "object") {
          latitude.value = parseFloat(profile.ubicacion.lat) || 19.4326;
          longitude.value = parseFloat(profile.ubicacion.lng) || -99.1332;
        }
      }

      if (map && marker) {
        map.setView([latitude.value, longitude.value], 13);
        marker.setLatLng([latitude.value, longitude.value]);
      }

      if (profile.enlacesWeb) {
        website.value = profile.enlacesWeb.website || "";
        linkedin.value = profile.enlacesWeb.linkedin || "";
      }
    }
  } catch (error) {
    console.error("Error fetching company profile:", error);
  } finally {
    loading.value = false;
  }
};

const useCurrentLocation = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        latitude.value = Number(position.coords.latitude.toFixed(6));
        longitude.value = Number(position.coords.longitude.toFixed(6));
        if (map && marker) {
          map.setView([latitude.value, longitude.value], 13);
          marker.setLatLng([latitude.value, longitude.value]);
        }
      },
      (error) => {
        console.error("Error getting current location:", error);
      },
    );
  }
};

onMounted(async () => {
  await fetchCompanyProfile();
  loadDraft();

  if (process.client) {
    const L = await import("leaflet");

    map = L.map("company-leaflet-map", { attributionControl: false }).setView(
      [latitude.value, longitude.value],
      13,
    );

    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
      { attribution: "" },
    ).addTo(map);

    marker = L.marker([latitude.value, longitude.value], {
      draggable: true,
    }).addTo(map);

    marker.on("dragend", () => {
      const latLng = marker.getLatLng();
      latitude.value = Number(latLng.lat.toFixed(6));
      longitude.value = Number(latLng.lng.toFixed(6));
    });

    map.on("click", (e: any) => {
      marker.setLatLng(e.latlng);
      latitude.value = Number(e.latlng.lat.toFixed(6));
      longitude.value = Number(e.latlng.lng.toFixed(6));
    });
  }
});

onUnmounted(() => {
  if (map) {
    map.remove();
  }
});

const handleSave = async () => {
  if (!companyId.value) return;

  saving.value = true;
  successMessage.value = "";
  errorMessage.value = "";

  try {
    const response = await $fetch(
      `${config.public.apiUrl}/profile/${companyId.value}`,
      {
        method: "POST",
        body: {
          nombre: nombreComercial.value,
          nombreComercial: nombreComercial.value,
          sector: sector.value,
          biografia: descripcion.value,
          descripcion: descripcion.value,
          mision: mision.value,
          vision: vision.value,
          beneficios: beneficios.value,
          culturaLaboral: beneficios.value,
          fotoPerfil: fotoPerfil.value,
          documentosCorporativos: documentosCorporativos.value,
          ubicacion: {
            lat: latitude.value,
            lng: longitude.value,
          },
          taxId: taxId.value,
          enlacesWeb: {
            website: website.value,
            linkedin: linkedin.value,
          },
        },
      },
    );

    if (response) {
      if (process.client) {
        localStorage.removeItem("jobnet_draft_company_edit");
        hasDraft.value = false;
      }
      successMessage.value =
        "¡Perfil de la organización guardado con éxito! Redirigiendo a tu perfil público...";
      setTimeout(() => {
        successMessage.value = "";
        router.push(`/company/${companyId.value}`);
      }, 1500);
    }
  } catch (error: any) {
    console.error("Error saving company configuration:", error);
    errorMessage.value = "Error al intentar guardar el perfil corporativo.";
  } finally {
    saving.value = false;
  }
};

const handleVerificationRequest = async () => {
  if (!taxId.value || !companyId.value) {
    errorMessage.value = "Ingresa tu RFC para solicitar verificación.";
    return;
  }

  submittingVerification.value = true;
  try {
    await $fetch(`${config.public.apiUrl}/profile/${companyId.value}`, {
      method: "POST",
      body: {
        taxId: taxId.value,
        organizacionVerificada: false,
      },
    });

    successMessage.value = "¡Solicitud de verificación enviada exitosamente!";
  } catch (error: any) {
    console.error("Error requesting verification:", error);
    errorMessage.value = "Ocurrió un error al solicitar la verificación.";
  } finally {
    submittingVerification.value = false;
  }
};
</script>

<style>
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
