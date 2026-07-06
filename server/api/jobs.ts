import { defineEventHandler } from "h3";

export default defineEventHandler(() => {
  return [
    {
      id: "1",
      title: "Senior Frontend Engineer (Nuxt)",
      company: "TechSolutions",
      lat: 19.4326,
      lng: -99.1332,
    },
    {
      id: "2",
      title: "Fullstack Developer (Node/Vue)",
      company: "InnovateCorp",
      lat: 19.4194,
      lng: -99.1456,
    },
    {
      id: "3",
      title: "DevOps Architect",
      company: "CloudSystems",
      lat: 19.4382,
      lng: -99.1219,
    },
  ];
});
