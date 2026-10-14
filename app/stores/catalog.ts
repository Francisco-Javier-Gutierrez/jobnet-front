import { defineStore } from "pinia";
import { MOCK_CATALOG_ITEMS } from "~/utils/mockData";

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
    pendingSuggestionsQueue: [] as { name: string; category: string }[],
    isProcessingQueue: false,
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
        const data = await $fetch<CatalogItem[]>(
          `${config.public.apiUrl}/catalog`,
        );
        if (data && data.length > 0) {
          this.items = data;
        } else {
          this.items = [...MOCK_CATALOG_ITEMS];
        }
        this.loaded = true;
      } catch (error) {
        console.warn("Fallback to mock catalog items:", error);
        this.items = [...MOCK_CATALOG_ITEMS];
        this.loaded = true;
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
        const response = await $fetch<CatalogItem>(
          `${config.public.apiUrl}/catalog`,
          {
            method: "POST",
            body: { name: cleanName, category },
          },
        );
        this.items.push(response);
        return { success: true };
      } catch (error: any) {
        // Fallback local addition for mock/offline testing
        const newItem: CatalogItem = {
          id: `item-${Date.now()}`,
          name: cleanName,
          category,
          createdAt: new Date().toISOString(),
        };
        this.items.push(newItem);
        return { success: true };
      }
    },

    async suggestSkill(
      name: string,
    ): Promise<{ success: boolean; error?: string }> {
      return this.suggestItem(name, "Habilidad");
    },

    async suggestSector(
      name: string,
    ): Promise<{ success: boolean; error?: string }> {
      return this.suggestItem(name, "Sector");
    },

    async suggestItem(
      name: string,
      category: "Habilidad" | "Sector" = "Habilidad",
    ): Promise<{ success: boolean; error?: string }> {
      const cleanName = name.trim();
      if (!cleanName) {
        return { success: false, error: "El nombre no puede estar vacío" };
      }

      this.pendingSuggestionsQueue.push({ name: cleanName, category });
      this.processQueue();
      return { success: true };
    },

    async processQueue() {
      if (this.isProcessingQueue || this.pendingSuggestionsQueue.length === 0)
        return;
      this.isProcessingQueue = true;
      const config = useRuntimeConfig();

      while (this.pendingSuggestionsQueue.length > 0) {
        const item = this.pendingSuggestionsQueue[0];
        try {
          await $fetch(`${config.public.apiUrl}/moderator/skills/suggestions`, {
            method: "POST",
            body: item,
          });
          this.pendingSuggestionsQueue.shift();
        } catch (error) {
          console.error(
            "Error processing suggestion queue, will retry later",
            error,
          );
          setTimeout(() => {
            this.isProcessingQueue = false;
            this.processQueue();
          }, 5000);
          return;
        }
      }
      this.isProcessingQueue = false;
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
        const response = await $fetch<CatalogItem>(
          `${config.public.apiUrl}/catalog/${id}`,
          {
            method: "PUT",
            body: { name: cleanName },
          },
        );
        this.items[itemIndex].name = response.name;
        return { success: true };
      } catch (error: any) {
        // Fallback local update for mock/offline testing
        this.items[itemIndex].name = cleanName;
        return { success: true };
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
        // Fallback local deletion for mock/offline testing
        this.items = this.items.filter((item) => item.id !== id);
        return true;
      }
    },
  },
});
