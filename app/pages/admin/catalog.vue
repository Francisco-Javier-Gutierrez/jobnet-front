<template>
  <div
    class="max-w-4xl mx-auto px-4 py-8 w-full bg-background dark:bg-slate-950 dark:text-slate-100 min-h-screen transition-colors duration-200"
  >
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-on-background mb-2">
        Catálogo Maestro
      </h1>
      <p class="text-on-surface-variant dark:text-slate-300 text-sm">
        Gestiona y expande de forma global la lista maestra de habilidades
        técnicas sugeridas y sectores industriales.
      </p>
    </div>

    <!-- Alert messages -->
    <div
      v-if="globalSuccess"
      class="mb-4 bg-secondary/10 border border-secondary/20 text-secondary p-4 rounded-xl flex items-center gap-2 text-sm font-semibold"
    >
      <span class="material-symbols-outlined text-lg">check_circle</span>
      {{ globalSuccess }}
    </div>
    <div
      v-if="globalError"
      class="mb-4 bg-rose-500/10 border border-rose-500/20 text-rose-600 p-4 rounded-xl flex items-center gap-2 text-sm font-semibold"
    >
      <span class="material-symbols-outlined text-lg">error</span>
      {{ globalError }}
    </div>

    <!-- Stats row -->
    <AppSkeletonLoader
      v-if="!catalog.loaded"
      type="stats"
      :count="2"
      class="mb-6"
      label="Cargando resumen del catálogo..."
    />
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
      <div
        class="bg-surface-container-lowest dark:bg-slate-900 dark:border-slate-800 border border-outline-variant/60 rounded-2xl p-5 shadow-sm flex items-center gap-4"
      >
        <div
          class="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary"
        >
          <span class="material-symbols-outlined">psychology</span>
        </div>
        <div>
          <span
            class="text-xs text-on-surface-variant dark:text-slate-300 font-bold uppercase tracking-wider"
            >Habilidades Técnicas</span
          >
          <h2 class="text-2xl font-bold text-on-background">
            {{ catalog.skills.length }}
          </h2>
        </div>
      </div>
      <div
        class="bg-surface-container-lowest dark:bg-slate-900 dark:border-slate-800 border border-outline-variant/60 rounded-2xl p-5 shadow-sm flex items-center gap-4"
      >
        <div
          class="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center text-secondary"
        >
          <span class="material-symbols-outlined">domain</span>
        </div>
        <div>
          <span
            class="text-xs text-on-surface-variant dark:text-slate-300 font-bold uppercase tracking-wider"
            >Sectores Laborales</span
          >
          <h2 class="text-2xl font-bold text-on-background">
            {{ catalog.sectors.length }}
          </h2>
        </div>
      </div>
    </div>

    <!-- RF-10: Expansión del Catálogo (Agregar Nuevo Elemento) -->
    <div
      class="bg-surface-container-lowest dark:bg-slate-900 dark:border-slate-800 border border-outline-variant/60 rounded-2xl p-6 shadow-sm mb-8"
    >
      <h3
        class="text-sm font-bold text-on-background mb-4 flex items-center gap-2"
      >
        <span class="material-symbols-outlined text-primary text-lg"
          >add_circle</span
        >
        Agregar Nuevo Registro al Catálogo
      </h3>
      <form
        @submit.prevent="handleCreateItem"
        class="flex flex-col sm:flex-row gap-4 items-end"
      >
        <div class="flex-grow flex flex-col gap-1.5 w-full">
          <label
            class="text-xs font-bold text-on-surface-variant dark:text-slate-300"
            for="new-item-name"
            >Nombre del Elemento</label
          >
          <input
            v-model="newItemName"
            id="new-item-name"
            type="text"
            required
            placeholder="Ej: Node.js, Inteligencia Artificial, Sector Agropecuario"
            class="w-full bg-surface border border-outline-variant/60 hover:border-outline focus:border-primary rounded-xl px-4 py-2.5 text-sm text-on-background outline-none transition"
          />
        </div>
        <div class="w-full sm:w-56">
          <AppSelect
            v-model="newItemCategory"
            label="Categoría"
            :options="[
              {
                value: 'Habilidad',
                label: 'Habilidad Técnica',
                icon: 'psychology',
              },
              {
                value: 'Sector',
                label: 'Sector Laboral',
                icon: 'business_center',
              },
            ]"
          />
        </div>
        <AppActionButton
          type="submit"
          :loading="isCreating"
          icon="save"
          icon-class="text-lg"
          spinner-size="md"
          loading-text="Guardando..."
          label="Guardar"
          class="bg-primary hover:bg-primary-container text-white font-semibold text-sm px-6 h-11 rounded-xl w-full sm:w-auto shadow-sm active:scale-95 duration-100 cursor-pointer"
        />
      </form>
    </div>

    <!-- Navigation Tab Categories using AppTabs -->
    <div class="mb-6">
      <AppTabs
        :tabs="[
          {
            id: 'Habilidad',
            label: 'Habilidades Técnicas',
            icon: 'psychology',
            count: catalog.skills.length,
          },
          {
            id: 'Sector',
            label: 'Sectores Laborales',
            icon: 'domain',
            count: catalog.sectors.length,
          },
        ]"
        v-model="activeCategoryTab"
        @change="resetPage"
      />
    </div>

    <!-- RF-9 & RF-11: Listado, Paginación y Modificación -->
    <div
      class="bg-surface-container-lowest dark:bg-slate-900 dark:border-slate-800 border border-outline-variant/60 rounded-2xl overflow-hidden shadow-sm"
    >
      <table class="w-full text-left border-collapse">
        <thead>
          <tr
            class="bg-surface-container-low/30 border-b border-outline-variant/60 text-xs text-on-surface-variant dark:text-slate-300 uppercase tracking-wider font-bold"
          >
            <th class="py-3.5 px-6">Nombre de la Habilidad o Sector</th>
            <th class="py-3.5 px-6 hidden sm:table-cell">Categoría</th>
            <th class="py-3.5 px-6 hidden md:table-cell">Fecha de Registro</th>
            <th class="py-3.5 px-6 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-outline-variant/30 text-sm">
          <!-- Skeleton Loading Rows -->
          <template v-if="loading">
            <tr v-for="i in 5" :key="i" class="animate-pulse">
              <td class="py-4 px-6">
                <div class="h-4 w-40 bg-outline/20 rounded animate-pulse"></div>
              </td>
              <td class="py-4 px-6 hidden sm:table-cell">
                <div
                  class="h-5 w-20 bg-outline/20 rounded-full animate-pulse"
                ></div>
              </td>
              <td class="py-4 px-6 hidden md:table-cell font-mono">
                <div class="h-4 w-28 bg-outline/15 rounded animate-pulse"></div>
              </td>
              <td class="py-4 px-6 text-right flex justify-end gap-2">
                <div
                  class="h-7 w-12 bg-outline/20 rounded-lg animate-pulse"
                ></div>
                <div
                  class="h-7 w-12 bg-outline/20 rounded-lg animate-pulse"
                ></div>
              </td>
            </tr>
          </template>

          <template v-else>
            <tr v-if="paginatedItems.length === 0">
              <td colspan="4" class="p-0">
                <AppEmptyState
                  icon="inventory_2"
                  title="Sin elementos registrados"
                  description="No hay registros disponibles en esta categoría actualmente."
                />
              </td>
            </tr>
            <tr
              v-for="item in paginatedItems"
              :key="item.id"
              class="hover:bg-surface-container-low/10 transition-colors"
            >
              <!-- Name (and Inline Editing Field) -->
              <td class="py-4 px-6 font-medium text-on-background">
                <div
                  v-if="editingId === item.id"
                  class="flex items-center gap-2 max-w-sm"
                >
                  <input
                    v-model="editingName"
                    type="text"
                    class="flex-grow bg-surface border border-primary focus:border-primary rounded-lg px-3 py-1.5 text-sm text-on-background outline-none transition"
                    @keyup.enter="handleSaveEdit(item.id)"
                    @keyup.esc="cancelEdit"
                  />
                </div>
                <span v-else>{{ item.name }}</span>
              </td>

              <!-- Category -->
              <td class="py-4 px-6 hidden sm:table-cell">
                <AppStatusBadge
                  :status="item.category"
                  :label="
                    item.category === 'Habilidad'
                      ? 'Habilidad Técnica'
                      : 'Sector Laboral'
                  "
                  :icon="
                    item.category === 'Habilidad'
                      ? 'psychology'
                      : 'business_center'
                  "
                  :dot="false"
                />
              </td>

              <!-- Registration Date -->
              <td
                class="py-4 px-6 text-on-surface-variant dark:text-slate-300 text-xs hidden md:table-cell font-mono"
              >
                {{ formatDate(item.createdAt) }}
              </td>

              <!-- Actions (Edit/Delete/Save/Cancel) -->
              <td class="py-4 px-6 text-right">
                <div
                  v-if="editingId === item.id"
                  class="flex items-center justify-end gap-2"
                >
                  <AppActionButton
                    @click="handleSaveEdit(item.id)"
                    :loading="isSavingEdit(item.id)"
                    icon="done"
                    spinner-size="xs"
                    loading-text="Guardando..."
                    label="Guardar"
                    class="bg-secondary text-white hover:bg-[#005236] px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm cursor-pointer"
                    title="Guardar cambios"
                  />
                  <button
                    @click="cancelEdit"
                    class="bg-surface border border-outline-variant hover:bg-surface-container-high text-on-surface-variant dark:text-slate-300 transition px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer"
                    title="Cancelar edición"
                  >
                    Cancelar
                  </button>
                </div>
                <div v-else class="flex items-center justify-end gap-2">
                  <button
                    @click="startEdit(item)"
                    class="text-primary hover:bg-primary/5 transition p-1.5 rounded-lg flex items-center cursor-pointer"
                    title="Editar registro"
                  >
                    <span class="material-symbols-outlined text-sm">edit</span>
                  </button>
                  <button
                    @click="handleDeleteItem(item)"
                    class="text-rose-600 hover:bg-rose-50/50 transition p-1.5 rounded-lg flex items-center cursor-pointer"
                    title="Eliminar registro"
                  >
                    <span class="material-symbols-outlined text-sm"
                      >delete</span
                    >
                  </button>
                </div>
              </td>
            </tr>
          </template>
        </tbody>
      </table>

      <!-- Reusable AppPagination Component -->
      <div class="px-4 border-t border-outline-variant/60">
        <AppPagination
          v-model:current-page="currentPage"
          :total-pages="totalPages"
          :total-items="filteredItems.length"
          :start-index="startIndex"
          :end-index="endIndex"
        />
      </div>
    </div>

    <!-- Reusable AppConfirmModal Component -->
    <AppConfirmModal
      v-model="isConfirmOpen"
      :title="confirmTitle"
      :message="confirmMessage"
      variant="danger"
      :is-loading="isConfirming"
      @confirm="handleConfirm"
      @cancel="closeConfirm"
    />
  </div>
</template>

<script setup lang="ts">
import { useCatalogStore, type CatalogItem } from "~/stores/catalog";

useSeoMeta({
  title: "Catálogo Maestro - Administrador",
  description:
    "Bandeja de administración del catálogo global de habilidades y sectores",
});

const catalog = useCatalogStore();
const loading = ref(true);

onMounted(async () => {
  loading.value = true;
  await catalog.fetchCatalog();
  loading.value = false;
});

// Setup UI Tab state
const activeCategoryTab = ref<string>("Habilidad");

// Form input fields
const newItemName = ref("");
const newItemCategory = ref<"Habilidad" | "Sector">("Habilidad");

// Inline Editing state
const editingId = ref<string | null>(null);
const editingName = ref("");
const isCreating = ref(false);
const { isPending: isEditPending, runWithLoading: runEditWithLoading } =
  useActionLoading();
const isSavingEdit = (id: string) => isEditPending(`catalog-edit-${id}`);

// Notifications state
const globalSuccess = ref("");
const globalError = ref("");

// Filter items based on active tab category
const filteredItems = computed(() => {
  if (activeCategoryTab.value === "Habilidad") {
    return catalog.skills;
  }
  return catalog.sectors;
});

// Reusable usePagination Composable
const {
  currentPage,
  totalPages,
  paginatedItems,
  startIndex,
  endIndex,
  resetPage,
} = usePagination(filteredItems, { initialPageSize: 20 });

// Reusable useConfirmDialog Composable
const {
  isOpen: isConfirmOpen,
  isConfirming,
  title: confirmTitle,
  message: confirmMessage,
  openConfirm,
  closeConfirm,
  handleConfirm,
} = useConfirmDialog();

// Format date helper
const formatDate = (isoString: string) => {
  if (!isoString) return "";
  const d = new Date(isoString);
  return d.toLocaleDateString("es-ES", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// RF-10: Expansión - Creación de Elemento
const handleCreateItem = async () => {
  if (isCreating.value) return;
  globalSuccess.value = "";
  globalError.value = "";
  isCreating.value = true;

  try {
    const result = await catalog.addItem(
      newItemName.value,
      newItemCategory.value,
    );
    if (result.success) {
      globalSuccess.value = `¡"${newItemName.value}" se agregó con éxito a ${newItemCategory.value === "Habilidad" ? "habilidades" : "sectores"}!`;
      activeCategoryTab.value = newItemCategory.value; // Switch to the category we just added to see it
      newItemName.value = "";
      resetPage();
    } else {
      globalError.value =
        result.error || "Ocurrió un error al registrar el elemento.";
    }
  } finally {
    isCreating.value = false;
  }
};

// RF-11: Modificación - Iniciar edición inline
const startEdit = (item: CatalogItem) => {
  editingId.value = item.id;
  editingName.value = item.name;
};

// RF-11: Modificación - Cancelar edición inline
const cancelEdit = () => {
  editingId.value = null;
  editingName.value = "";
};

// RF-11: Modificación - Guardar edición inline
const handleSaveEdit = async (id: string) => {
  await runEditWithLoading(`catalog-edit-${id}`, async () => {
    globalSuccess.value = "";
    globalError.value = "";

    const result = await catalog.updateItem(id, editingName.value);
    if (result.success) {
      globalSuccess.value = "Elemento actualizado correctamente.";
      editingId.value = null;
      editingName.value = "";
    } else {
      globalError.value = result.error || "Ocurrió un error al actualizar.";
    }
  });
};

// RF-11: Modificación - Eliminar Elemento usando AppConfirmModal
const handleDeleteItem = (item: CatalogItem) => {
  globalSuccess.value = "";
  globalError.value = "";

  openConfirm({
    title: "¿Eliminar Registro?",
    message: `¿Estás seguro de que deseas eliminar "${item.name}" del catálogo global de ${item.category === "Habilidad" ? "habilidades" : "sectores"}?`,
    confirmText: "Eliminar",
    variant: "danger",
    onConfirm: async () => {
      const success = await catalog.deleteItem(item.id);
      if (success) {
        globalSuccess.value = "Registro eliminado del catálogo correctamente.";
      } else {
        globalError.value = "No se pudo encontrar el registro para eliminar.";
      }
    },
  });
};
</script>
