export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: false },
  css: ["~/assets/css/main.css"],
  routeRules: {
    "/**": { ssr: false },
  },
  build: {
    transpile: [
      "next-auth",
      "@sidebase/nuxt-auth",
      "@babel/runtime",
      "@panva/hkdf",
      "jose",
    ],
  },
  modules: ["@nuxtjs/tailwindcss", "@pinia/nuxt", "@sidebase/nuxt-auth"],
  runtimeConfig: {
    public: {
      apiUrl:
        process.env.NUXT_PUBLIC_API_URL ||
        "https://olhoy8ebq7.execute-api.us-east-1.amazonaws.com",
      wsUrl:
        process.env.NUXT_PUBLIC_WS_URL ||
        "wss://lzvcx59zaa.execute-api.us-east-1.amazonaws.com/prod",
    },
  },
  app: {
    head: {
      script: [
        {
          children: `(function(){try{var t=localStorage.getItem('jobnet-theme');var d=t==='dark'||((!t||t==='system')&&window.matchMedia('(prefers-color-scheme: dark)').matches);if(d){document.documentElement.classList.add('dark');document.documentElement.setAttribute('data-theme','dark');}else{document.documentElement.classList.remove('dark');document.documentElement.setAttribute('data-theme','light');}}catch(e){}})()`,
        },
      ],
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
    origin:
      process.env.NUXT_AUTH_ORIGIN ||
      (process.env.NODE_ENV === "production"
        ? "https://dsty3j5u0b31g.cloudfront.net"
        : "http://localhost:3000"),
    secret: process.env.NUXT_AUTH_SECRET || "jobnet-super-secret-key-prod-2026",
    provider: {
      type: "authjs",
      pages: {
        signIn: "/login",
      },
    },
  },
  nitro: {
    preset: process.env.NODE_ENV === "production" ? "aws-lambda" : undefined,
    externals: {
      inline: [
        "@babel/runtime",
        "@panva/hkdf",
        "jose",
        "@sidebase/nuxt-auth",
        "next-auth",
        "hookable",
        "unhead",
        "pinia",
        "vue-demi",
        "devalue",
        "ufo",
      ],
    },
  },
});
