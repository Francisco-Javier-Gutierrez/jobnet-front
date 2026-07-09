<template>
  <div class="max-w-5xl mx-auto px-4 py-8 w-full bg-background min-h-screen">
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-on-background mb-2">
        Gestión de Organizaciones (Administrador)
      </h1>
      <p class="text-on-surface-variant text-sm">
        Administra la base de datos maestra de empresas registradas en la
        plataforma.
      </p>
    </div>

    <div
      class="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl overflow-hidden shadow-sm"
    >
      <!-- Search bar -->
      <div
        class="p-4 border-b border-outline-variant/60 bg-surface-container-low/20"
      >
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Filtrar por nombre, RFC o correo..."
          class="w-full bg-surface border border-outline-variant/60 hover:border-primary focus:border-primary rounded-xl px-4 py-2.5 text-xs text-on-background outline-none transition"
        />
      </div>

      <!-- Organizations List -->
      <div class="divide-y divide-outline-variant/30">
        <div
          v-for="org in filteredOrgs"
          :key="org.id"
          class="p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          <div>
            <h3
              class="text-sm font-bold text-on-background flex items-center gap-1.5"
            >
              {{ org.name }}
              <span
                v-if="org.verified"
                class="material-symbols-outlined text-secondary text-sm"
                style="font-variation-settings: &quot;FILL&quot; 1"
                >verified</span
              >
            </h3>
            <p class="text-xs text-on-surface-variant mt-1">
              RFC:
              <span class="font-mono text-on-background font-semibold">{{
                org.taxId
              }}</span>
              | Email: {{ org.email }}
            </p>
          </div>
          <div class="flex items-center gap-2">
            <button
              @click="toggleVerify(org)"
              class="bg-primary/10 border border-primary/20 hover:bg-primary hover:text-white text-primary font-bold text-xs px-3.5 py-2 rounded-lg transition active:scale-95 duration-100 shadow-sm"
            >
              {{ org.verified ? "Remover Verificación" : "Verificar" }}
            </button>
            <button
              class="bg-surface border border-outline-variant hover:border-rose-600 hover:text-rose-600 text-on-surface-variant font-semibold text-xs px-3.5 py-2 rounded-lg transition active:scale-95 duration-100"
            >
              Bloquear
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

useSeoMeta({
  title: "Gestión de Organizaciones - Administrador",
  description: "Tabla de control maestro de empresas registradas en JobNet",
});

const config = useRuntimeConfig();
const searchQuery = ref("");

const orgs = ref([
  {
    id: "44f88418-9081-70d4-b8d9-e04f2e8230fc",
    name: "Francisco Tech",
    taxId: "XDDDD",
    email: "chinopaco.05@gmail.com",
    verified: true,
  },
  {
    id: "mock-techsolutions",
    name: "TechSolutions Inc.",
    taxId: "TAX123456",
    email: "contact@techsolutions.com",
    verified: true,
  },
]);

const filteredOrgs = computed(() => {
  if (!searchQuery.value.trim()) return orgs.value;
  const q = searchQuery.value.toLowerCase();
  return orgs.value.filter(
    (o) =>
      o.name.toLowerCase().includes(q) ||
      o.taxId.toLowerCase().includes(q) ||
      o.email.toLowerCase().includes(q),
  );
});

const toggleVerify = async (org: any) => {
  try {
    org.verified = !org.verified;
    await $fetch(`${config.public.apiUrl}/profile/${org.id}`, {
      method: "POST",
      body: {
        organizacionVerificada: org.verified,
      },
    });
  } catch (e) {
    console.error("Error setting verification status:", e);
  }
};
</script>
