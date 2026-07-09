export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: false },
  modules: ["@nuxtjs/tailwindcss", "@pinia/nuxt", "@sidebase/nuxt-auth"],
  runtimeConfig: {
    public: {
      apiUrl:
        process.env.NUXT_PUBLIC_API_URL ||
        "https://av7lebx0sf.execute-api.us-east-1.amazonaws.com",
      wsUrl:
        process.env.NUXT_PUBLIC_WS_URL ||
        "wss://oa7jw5dfza.execute-api.us-east-1.amazonaws.com/dev",
    },
  },
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
    origin: process.env.NUXT_AUTH_ORIGIN || "http://localhost:3000",
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
