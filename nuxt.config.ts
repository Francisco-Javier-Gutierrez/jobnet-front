export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: false },
  modules: ["@nuxtjs/tailwindcss", "@pinia/nuxt", "@sidebase/nuxt-auth"],
  app: {
    head: {
      link: [
        { rel: "icon", type: "image/svg+xml", href: "/logotipo.svg" },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap",
        },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap",
        },
      ],
    },
  },
  auth: {
    globalAppMiddleware: false,
    provider: {
      type: "authjs",
      pages: {
        signIn: "/login",
      },
    },
  },
  nitro: {
    preset: "aws-lambda",
  },
});
