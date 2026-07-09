import { defineStore } from "pinia";

export interface CatalogItem {
  id: string;
  name: string;
  category: "Habilidad" | "Sector";
  createdAt: string;
}

export const useCatalogStore = defineStore("catalog", {
  state: () => ({
    items: [] as CatalogItem[],
    loaded: false,
  }),
  getters: {
    skills: (state) =>
      state.items
        .filter((item) => item.category === "Habilidad")
        .sort((a, b) => a.name.localeCompare(b.name)),
    sectors: (state) =>
      state.items
        .filter((item) => item.category === "Sector")
        .sort((a, b) => a.name.localeCompare(b.name)),
  },
  actions: {
    async fetchCatalog() {
      const config = useRuntimeConfig();
      try {
        const data = await $fetch<CatalogItem[]>(`${config.public.apiUrl}/catalog`);
        this.items = data || [];
        this.loaded = true;
      } catch (error) {
        console.error("Error fetching catalog from AWS:", error);
      }
    },

    async addItem(
      name: string,
      category: "Habilidad" | "Sector",
    ): Promise<{ success: boolean; error?: string }> {
      const cleanName = name.trim();
      if (!cleanName) {
        return { success: false, error: "El nombre no puede estar vacío" };
      }

      const duplicate = this.items.some(
        (item) =>
          item.category === category &&
          item.name.toLowerCase() === cleanName.toLowerCase(),
      );

      if (duplicate) {
        return {
          success: false,
          error: `Ya existe este ${category.toLowerCase()} en el catálogo`,
        };
      }

      const config = useRuntimeConfig();
      try {
        const response = await $fetch<CatalogItem>(`${config.public.apiUrl}/catalog`, {
          method: "POST",
          body: { name: cleanName, category },
        });
        this.items.push(response);
        return { success: true };
      } catch (error: any) {
        return {
          success: false,
          error: error.data?.error || "Error al registrar el elemento.",
        };
      }
    },

    async updateItem(
      id: string,
      newName: string,
    ): Promise<{ success: boolean; error?: string }> {
      const cleanName = newName.trim();
      if (!cleanName) {
        return { success: false, error: "El nombre no puede estar vacío" };
      }

      const itemIndex = this.items.findIndex((item) => item.id === id);
      if (itemIndex === -1) {
        return { success: false, error: "Elemento no encontrado" };
      }

      const item = this.items[itemIndex];
      const duplicate = this.items.some(
        (other) =>
          other.id !== id &&
          other.category === item.category &&
          other.name.toLowerCase() === cleanName.toLowerCase(),
      );

      if (duplicate) {
        return {
          success: false,
          error: `Ya existe otro ${item.category.toLowerCase()} con ese nombre`,
        };
      }

      const config = useRuntimeConfig();
      try {
        const response = await $fetch<CatalogItem>(`${config.public.apiUrl}/catalog/${id}`, {
          method: "PUT",
          body: { name: cleanName },
        });
        this.items[itemIndex].name = response.name;
        return { success: true };
      } catch (error: any) {
        return {
          success: false,
          error: error.data?.error || "Error al actualizar.",
        };
      }
    },

    async deleteItem(id: string): Promise<boolean> {
      const config = useRuntimeConfig();
      try {
        await $fetch(`${config.public.apiUrl}/catalog/${id}`, {
          method: "DELETE",
        });
        this.items = this.items.filter((item) => item.id !== id);
        return true;
      } catch (error) {
        console.error("Error deleting catalog item:", error);
        return false;
      }
    },
  },
});
