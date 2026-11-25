import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import type { CvData, CvOptions } from "~/types/cv";
import TemplateCompactOnePage from "./TemplateCompactOnePage.vue";
import TemplateCreative from "./TemplateCreative.vue";
import TemplateExecutive from "./TemplateExecutive.vue";
import TemplateHarvardClassic from "./TemplateHarvardClassic.vue";
import TemplateMinimalTech from "./TemplateMinimalTech.vue";
import TemplateModernSplit from "./TemplateModernSplit.vue";
import TemplateStandard from "./TemplateStandard.vue";

const sampleCv: CvData = {
  name: "Ana Sofía Mendoza",
  title: "Ingeniera de Software Senior",
  bio: "Arquitecta frontend con 6 años diseñando aplicaciones web de alto tráfico.",
  email: "ana@jobnet.test",
  phone: "+52 55 1234 5678",
  location: "Ciudad de México, MX",
  photoUrl: "https://jobnet.test/avatar.png",
  sector: "Tecnología",
  skills: ["TypeScript", "Vue 3", "Nuxt", "Tailwind CSS"],
  languages: [{ idioma: "Inglés", nivel: "Avanzado C1" }],
  experience: [
    {
      puesto: "Tech Lead Frontend",
      empresa: "JobNet",
      periodo: "2023 - Actualidad",
      descripcion: "• Lideré la migración a Nuxt 4\n• Automaticé pruebas E2E",
    },
  ],
  education: [
    {
      titulo: "Ingeniería en Sistemas",
      institucion: "IPN",
      periodo: "2015 - 2019",
    },
  ],
  links: [{ label: "LinkedIn", url: "https://linkedin.com/in/anasofia" }],
};

function makeOptions(fontSize: CvOptions["fontSize"]): CvOptions {
  return {
    templateId: "minimal-tech",
    colorTheme: "indigo-jobnet",
    anonymousMode: false,
    showPhoto: true,
    showBio: true,
    showPhone: true,
    showEmail: true,
    showLocation: true,
    showLinks: true,
    showSkills: true,
    showLanguages: true,
    showEducation: true,
    showExperience: true,
    fontSize,
  };
}

const TEMPLATES = [
  {
    name: "TemplateCompactOnePage",
    component: TemplateCompactOnePage,
    compact: true,
  },
  { name: "TemplateCreative", component: TemplateCreative, compact: false },
  { name: "TemplateExecutive", component: TemplateExecutive, compact: false },
  {
    name: "TemplateHarvardClassic",
    component: TemplateHarvardClassic,
    compact: false,
  },
  {
    name: "TemplateMinimalTech",
    component: TemplateMinimalTech,
    compact: false,
  },
  {
    name: "TemplateModernSplit",
    component: TemplateModernSplit,
    compact: false,
  },
  { name: "TemplateStandard", component: TemplateStandard, compact: false },
] as const;

describe("CV Templates Typography & US Letter Layout Consistency", () => {
  it.each(TEMPLATES)(
    "$name updates root fontSize dynamically and maintains safe US Letter dimensions",
    async ({ component, compact }) => {
      const wrapper = mount(component, {
        props: {
          cv: sampleCv,
          options: makeOptions("sm"),
          primaryColor: "#3525cd",
        },
      });

      const page = wrapper.find(".cv-letter-page");
      expect(page.exists()).toBe(true);

      const styleSm = page.attributes("style") || "";
      expect(styleSm).toContain("width: 215.9mm");
      expect(styleSm).toContain("min-height: 278.5mm");
      expect(styleSm).toContain(
        compact ? "font-size: 9.5px" : "font-size: 10.5px",
      );

      await wrapper.setProps({ options: makeOptions("base") });
      expect(page.attributes("style")).toContain(
        compact ? "font-size: 11px" : "font-size: 12px",
      );

      await wrapper.setProps({ options: makeOptions("lg") });
      expect(page.attributes("style")).toContain(
        compact ? "font-size: 12.5px" : "font-size: 13.5px",
      );

      // text-justify causes uneven spacing mismatches between Chrome DOM and html2canvas PDFs
      expect(wrapper.findAll(".text-justify")).toHaveLength(0);
    },
  );

  it("TemplateStandard keeps two-column skills/languages grid locked regardless of viewport width", () => {
    const wrapper = mount(TemplateStandard, {
      props: {
        cv: sampleCv,
        options: makeOptions("base"),
        primaryColor: "#3525cd",
      },
    });

    expect(wrapper.find(".grid-cols-2").exists()).toBe(true);
    expect(wrapper.find(".sm\\:grid-cols-2").exists()).toBe(false);
  });
});
