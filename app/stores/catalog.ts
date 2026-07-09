import { defineStore } from "pinia";

export interface CatalogItem {
  id: string;
  name: string;
  category: "Habilidad" | "Sector";
  createdAt: string;
}

export const useCatalogStore = defineStore("catalog", {
  state: () => ({
    items: [
      {
        id: "1",
        name: "Angular",
        category: "Habilidad",
        createdAt: "2026-07-01T00:00:00.000Z",
      },
      {
        id: "2",
        name: "AWS (Amazon Web Services)",
        category: "Habilidad",
        createdAt: "2026-07-01T00:00:00.000Z",
      },
      {
        id: "3",
        name: "Azure",
        category: "Habilidad",
        createdAt: "2026-07-02T00:00:00.000Z",
      },
      {
        id: "4",
        name: "CSS3 / Flexbox",
        category: "Habilidad",
        createdAt: "2026-07-02T00:00:00.000Z",
      },
      {
        id: "5",
        name: "Docker & Containers",
        category: "Habilidad",
        createdAt: "2026-07-03T00:00:00.000Z",
      },
      {
        id: "6",
        name: "Express.js",
        category: "Habilidad",
        createdAt: "2026-07-03T00:00:00.000Z",
      },
      {
        id: "7",
        name: "Figma UI/UX Design",
        category: "Habilidad",
        createdAt: "2026-07-04T00:00:00.000Z",
      },
      {
        id: "8",
        name: "Git & GitHub",
        category: "Habilidad",
        createdAt: "2026-07-04T00:00:00.000Z",
      },
      {
        id: "9",
        name: "Go / Golang",
        category: "Habilidad",
        createdAt: "2026-07-05T00:00:00.000Z",
      },
      {
        id: "10",
        name: "GraphQL API",
        category: "Habilidad",
        createdAt: "2026-07-05T00:00:00.000Z",
      },
      {
        id: "11",
        name: "HTML5 Semantic Web",
        category: "Habilidad",
        createdAt: "2026-07-06T00:00:00.000Z",
      },
      {
        id: "12",
        name: "Java EE",
        category: "Habilidad",
        createdAt: "2026-07-06T00:00:00.000Z",
      },
      {
        id: "13",
        name: "JavaScript ES6+",
        category: "Habilidad",
        createdAt: "2026-07-07T00:00:00.000Z",
      },
      {
        id: "14",
        name: "Kubernetes Orchestration",
        category: "Habilidad",
        createdAt: "2026-07-07T00:00:00.000Z",
      },
      {
        id: "15",
        name: "MongoDB NoSQL",
        category: "Habilidad",
        createdAt: "2026-07-08T00:00:00.000Z",
      },
      {
        id: "16",
        name: "Nuxt.js 3 Framework",
        category: "Habilidad",
        createdAt: "2026-07-08T00:00:00.000Z",
      },
      {
        id: "17",
        name: "PostgreSQL Database",
        category: "Habilidad",
        createdAt: "2026-07-09T00:00:00.000Z",
      },
      {
        id: "18",
        name: "Python / Django",
        category: "Habilidad",
        createdAt: "2026-07-09T00:00:00.000Z",
      },
      {
        id: "19",
        name: "React & Next.js",
        category: "Habilidad",
        createdAt: "2026-07-09T00:00:00.000Z",
      },
      {
        id: "20",
        name: "Ruby on Rails",
        category: "Habilidad",
        createdAt: "2026-07-09T00:00:00.000Z",
      },
      {
        id: "21",
        name: "Rust Programming",
        category: "Habilidad",
        createdAt: "2026-07-09T00:00:00.000Z",
      },
      {
        id: "22",
        name: "TailwindCSS styling",
        category: "Habilidad",
        createdAt: "2026-07-09T00:00:00.000Z",
      },
      {
        id: "23",
        name: "TypeScript standard",
        category: "Habilidad",
        createdAt: "2026-07-09T00:00:00.000Z",
      },
      {
        id: "24",
        name: "Vue.js 3 Composition API",
        category: "Habilidad",
        createdAt: "2026-07-09T00:00:00.000Z",
      },
      {
        id: "25",
        name: "Webpack & Vite bundlers",
        category: "Habilidad",
        createdAt: "2026-07-09T00:00:00.000Z",
      },

      // Sectors
      {
        id: "s1",
        name: "Tecnología y Software",
        category: "Sector",
        createdAt: "2026-07-01T00:00:00.000Z",
      },
      {
        id: "s2",
        name: "Finanzas y Banca",
        category: "Sector",
        createdAt: "2026-07-02T00:00:00.000Z",
      },
      {
        id: "s3",
        name: "Salud y Farmacéutica",
        category: "Sector",
        createdAt: "2026-07-03T00:00:00.000Z",
      },
      {
        id: "s4",
        name: "Educación y E-learning",
        category: "Sector",
        createdAt: "2026-07-04T00:00:00.000Z",
      },
      {
        id: "s5",
        name: "E-commerce y Retail",
        category: "Sector",
        createdAt: "2026-07-05T00:00:00.000Z",
      },
      {
        id: "s6",
        name: "Marketing y Publicidad",
        category: "Sector",
        createdAt: "2026-07-06T00:00:00.000Z",
      },
      {
        id: "s7",
        name: "Logística y Transporte",
        category: "Sector",
        createdAt: "2026-07-07T00:00:00.000Z",
      },
      {
        id: "s8",
        name: "Turismo y Hostelería",
        category: "Sector",
        createdAt: "2026-07-08T00:00:00.000Z",
      },
      {
        id: "s9",
        name: "Automotriz y Manufactura",
        category: "Sector",
        createdAt: "2026-07-09T00:00:00.000Z",
      },
      {
        id: "s10",
        name: "Construcción e Inmobiliaria",
        category: "Sector",
        createdAt: "2026-07-09T00:00:00.000Z",
      },
    ] as CatalogItem[],
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
    addItem(
      name: string,
      category: "Habilidad" | "Sector",
    ): { success: boolean; error?: string } {
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

      const newItem: CatalogItem = {
        id: Math.random().toString(36).substring(2, 9),
        name: cleanName,
        category,
        createdAt: new Date().toISOString(),
      };

      this.items.push(newItem);
      return { success: true };
    },

    updateItem(
      id: string,
      newName: string,
    ): { success: boolean; error?: string } {
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

      this.items[itemIndex].name = cleanName;
      return { success: true };
    },

    deleteItem(id: string): boolean {
      const lengthBefore = this.items.length;
      this.items = this.items.filter((item) => item.id !== id);
      return this.items.length < lengthBefore;
    },
  },
});
