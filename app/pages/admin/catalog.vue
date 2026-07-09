<template>
  <div class="max-w-4xl mx-auto px-4 py-8 w-full bg-background min-h-screen">
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-on-background mb-2">
        Catálogo Maestro (Administrador)
      </h1>
      <p class="text-on-surface-variant text-sm">
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
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
      <div
        class="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-5 shadow-sm flex items-center gap-4"
      >
        <div
          class="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary"
        >
          <span class="material-symbols-outlined">psychology</span>
        </div>
        <div>
          <span
            class="text-xs text-on-surface-variant font-bold uppercase tracking-wider"
            >Habilidades Técnicas</span
          >
          <h2 class="text-2xl font-bold text-on-background">
            {{ catalog.skills.length }}
          </h2>
        </div>
      </div>
      <div
        class="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-5 shadow-sm flex items-center gap-4"
      >
        <div
          class="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center text-secondary"
        >
          <span class="material-symbols-outlined">domain</span>
        </div>
        <div>
          <span
            class="text-xs text-on-surface-variant font-bold uppercase tracking-wider"
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
      class="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-6 shadow-sm mb-8"
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
            class="text-xs font-bold text-on-surface-variant"
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
        <div class="flex flex-col gap-1.5 w-full sm:w-48">
          <label
            class="text-xs font-bold text-on-surface-variant"
            for="new-item-category"
            >Categoría</label
          >
          <select
            v-model="newItemCategory"
            id="new-item-category"
            class="w-full bg-surface border border-outline-variant/60 hover:border-outline focus:border-primary rounded-xl px-4 py-2.5 text-sm text-on-background outline-none transition appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23777587%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[position:right_0.5rem_center] bg-[length:1.5em_1.5em] pr-10"
          >
            <option value="Habilidad">Habilidad Técnica</option>
            <option value="Sector">Sector Laboral</option>
          </select>
        </div>
        <button
          type="submit"
          class="bg-primary hover:bg-primary-container text-white font-semibold text-sm px-6 h-11 rounded-xl transition flex items-center justify-center gap-1.5 w-full sm:w-auto shadow-sm active:scale-95 duration-100"
        >
          <span class="material-symbols-outlined text-lg">save</span>
          Guardar
        </button>
      </form>
    </div>

    <!-- Navigation Tab Categories -->
    <div class="flex border-b border-outline-variant/60 mb-6 gap-2">
      <button
        @click="
          activeCategoryTab = 'Habilidad';
          currentPage = 1;
        "
        :class="
          activeCategoryTab === 'Habilidad'
            ? 'text-primary border-b-2 border-primary font-bold'
            : 'text-on-surface-variant hover:text-primary'
        "
        class="pb-3 px-4 text-sm font-semibold transition"
      >
        Habilidades Técnicas
      </button>
      <button
        @click="
          activeCategoryTab = 'Sector';
          currentPage = 1;
        "
        :class="
          activeCategoryTab === 'Sector'
            ? 'text-primary border-b-2 border-primary font-bold'
            : 'text-on-surface-variant hover:text-primary'
        "
        class="pb-3 px-4 text-sm font-semibold transition"
      >
        Sectores Laborales
      </button>
    </div>

    <!-- RF-9 & RF-11: Listado, Paginación y Modificación -->
    <div
      class="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl overflow-hidden shadow-sm"
    >
      <table class="w-full text-left border-collapse">
        <thead>
          <tr
            class="bg-surface-container-low/30 border-b border-outline-variant/60 text-xs text-on-surface-variant uppercase tracking-wider font-bold"
          >
            <th class="py-3.5 px-6">Nombre de la Habilidad o Sector</th>
            <th class="py-3.5 px-6 hidden sm:table-cell">Categoría</th>
            <th class="py-3.5 px-6 hidden md:table-cell">Fecha de Registro</th>
            <th class="py-3.5 px-6 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-outline-variant/30 text-sm">
          <tr v-if="paginatedItems.length === 0">
            <td
              colspan="4"
              class="py-8 text-center text-on-surface-variant text-xs"
            >
              No hay elementos registrados en esta categoría.
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
              <span
                :class="
                  item.category === 'Habilidad'
                    ? 'bg-primary/10 text-primary'
                    : 'bg-secondary/10 text-secondary'
                "
                class="px-2.5 py-0.5 rounded-full text-xs font-bold"
              >
                {{ item.category }}
              </span>
            </td>

            <!-- Registration Date -->
            <td
              class="py-4 px-6 text-on-surface-variant text-xs hidden md:table-cell font-mono"
            >
              {{ formatDate(item.createdAt) }}
            </td>

            <!-- Actions (Edit/Delete/Save/Cancel) -->
            <td class="py-4 px-6 text-right">
              <div
                v-if="editingId === item.id"
                class="flex items-center justify-end gap-2"
              >
                <button
                  @click="handleSaveEdit(item.id)"
                  class="bg-secondary text-white hover:bg-[#005236] transition px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 shadow-sm"
                  title="Guardar cambios"
                >
                  <span class="material-symbols-outlined text-sm">done</span>
                  Guardar
                </button>
                <button
                  @click="cancelEdit"
                  class="bg-surface border border-outline-variant hover:bg-surface-container-high text-on-surface-variant transition px-3 py-1.5 rounded-lg text-xs font-semibold"
                  title="Cancelar edición"
                >
                  Cancelar
                </button>
              </div>
              <div v-else class="flex items-center justify-end gap-2">
                <button
                  @click="startEdit(item)"
                  class="text-primary hover:bg-primary/5 transition p-1.5 rounded-lg flex items-center"
                  title="Editar registro"
                >
                  <span class="material-symbols-outlined text-sm">edit</span>
                </button>
                <button
                  @click="handleDeleteItem(item.id)"
                  class="text-rose-600 hover:bg-rose-50/50 transition p-1.5 rounded-lg flex items-center"
                  title="Eliminar registro"
                >
                  <span class="material-symbols-outlined text-sm">delete</span>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Pagination controls (20 items per page) -->
      <div
        v-if="totalPages > 1"
        class="p-4 border-t border-outline-variant/60 flex items-center justify-between bg-surface-container-low/20"
      >
        <span class="text-xs text-on-surface-variant">
          Mostrando {{ pageStartIndex + 1 }}-{{
            Math.min(pageEndIndex, filteredItems.length)
          }}
          de {{ filteredItems.length }}
        </span>
        <div class="flex items-center gap-1">
          <button
            @click="currentPage = Math.max(1, currentPage - 1)"
            :disabled="currentPage === 1"
            class="p-1.5 rounded-lg border border-outline-variant/60 hover:bg-surface-container-high text-on-surface-variant disabled:opacity-50 transition"
          >
            <span class="material-symbols-outlined text-sm flex items-center"
              >chevron_left</span
            >
          </button>
          <button
            v-for="p in totalPages"
            :key="p"
            @click="currentPage = p"
            :class="
              currentPage === p
                ? 'bg-primary text-white border-primary'
                : 'border-outline-variant/60 text-on-surface-variant hover:bg-surface-container-high'
            "
            class="w-8 h-8 rounded-lg border font-bold text-xs flex items-center justify-center transition"
          >
            {{ p }}
          </button>
          <button
            @click="currentPage = Math.min(totalPages, currentPage + 1)"
            :disabled="currentPage === totalPages"
            class="p-1.5 rounded-lg border border-outline-variant/60 hover:bg-surface-container-high text-on-surface-variant disabled:opacity-50 transition"
          >
            <span class="material-symbols-outlined text-sm flex items-center"
              >chevron_right</span
            >
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useCatalogStore, type CatalogItem } from "~/stores/catalog";

useSeoMeta({
  title: "Catálogo Maestro - Administrador",
  description:
    "Bandeja de administración del catálogo global de habilidades y sectores",
});

const catalog = useCatalogStore();

// Setup UI Tab state
const activeCategoryTab = ref<"Habilidad" | "Sector">("Habilidad");

// Form input fields
const newItemName = ref("");
const newItemCategory = ref<"Habilidad" | "Sector">("Habilidad");

// Inline Editing state
const editingId = ref<string | null>(null);
const editingName = ref("");

// Notifications state
const globalSuccess = ref("");
const globalError = ref("");

// Pagination state
const currentPage = ref(1);
const itemsPerPage = 20;

// Filters items based on active tab category
const filteredItems = computed(() => {
  if (activeCategoryTab.value === "Habilidad") {
    return catalog.skills;
  }
  return catalog.sectors;
});

// Total pages computation
const totalPages = computed(() => {
  return Math.ceil(filteredItems.value.length / itemsPerPage);
});

// Indexes for displaying text
const pageStartIndex = computed(() => {
  return (currentPage.value - 1) * itemsPerPage;
});

const pageEndIndex = computed(() => {
  return currentPage.value * itemsPerPage;
});

// Paginated items slicing
const paginatedItems = computed(() => {
  return filteredItems.value.slice(pageStartIndex.value, pageEndIndex.value);
});

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
const handleCreateItem = () => {
  globalSuccess.value = "";
  globalError.value = "";

  const result = catalog.addItem(newItemName.value, newItemCategory.value);
  if (result.success) {
    globalSuccess.value = `¡"${newItemName.value}" se agregó con éxito a ${newItemCategory.value === "Habilidad" ? "habilidades" : "sectores"}!`;
    activeCategoryTab.value = newItemCategory.value; // Switch to the category we just added to see it
    newItemName.value = "";
    currentPage.value = 1; // Back to first page
  } else {
    globalError.value =
      result.error || "Ocurrió un error al registrar el elemento.";
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
const handleSaveEdit = (id: string) => {
  globalSuccess.value = "";
  globalError.value = "";

  const result = catalog.updateItem(id, editingName.value);
  if (result.success) {
    globalSuccess.value = "Elemento actualizado correctamente.";
    editingId.value = null;
    editingName.value = "";
  } else {
    globalError.value = result.error || "Ocurrió un error al actualizar.";
  }
};

// RF-11: Modificación - Eliminar Elemento
const handleDeleteItem = (id: string) => {
  globalSuccess.value = "";
  globalError.value = "";

  if (
    confirm(
      "¿Estás seguro de que deseas eliminar este registro del catálogo global?",
    )
  ) {
    const success = catalog.deleteItem(id);
    if (success) {
      globalSuccess.value = "Registro eliminado del catálogo correctamente.";
      // Adjust current page if we deleted the last item on the page
      if (paginatedItems.value.length === 0 && currentPage.value > 1) {
        currentPage.value--;
      }
    } else {
      globalError.value = "No se pudo encontrar el registro para eliminar.";
    }
  }
};
</script>
