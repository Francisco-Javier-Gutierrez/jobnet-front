import path from "node:path";

export default defineNuxtConfig({
  components: [
    {
      path: "~/components",
      pathPrefix: false,
    },
  ],
  compatibilityDate: "2025-07-15",
  experimental: {
    appManifest: false,
  },
  devtools: { enabled: false },
  css: ["material-symbols/outlined.css", "~/assets/css/main.css"],
  alias: {
    "vue-demi": "vue",
    "@panva/hkdf": path.resolve("./server/shims/hkdf.cjs"),
    "@babel/runtime/helpers/interopRequireDefault": path.resolve(
      "./server/shims/interopRequireDefault.cjs",
    ),
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
  vite: {
    optimizeDeps: {
      include: ["leaflet"],
    },
  },
  modules: ["@nuxtjs/tailwindcss", "@pinia/nuxt", "@sidebase/nuxt-auth"],
  runtimeConfig: {
    public: {
      apiUrl:
        process.env.NUXT_PUBLIC_API_URL ||
        "https://olhoy8ebq7.execute-api.us-east-1.amazonaws.com",
      wsUrl:
        process.env.NUXT_PUBLIC_WS_URL ||
        "wss://v9b53l2zr2.execute-api.us-east-1.amazonaws.com/prod",
      vapidPublicKey:
        process.env.NUXT_PUBLIC_VAPID_KEY ||
        "BOIrktuQCHHiOWcKICA7YEwdKJf8WNYCmBS_PI338wnaB9VqXPQfCRwTN5NLYokujXBp5pdD83av6DACG2rAYok",
      cognitoClientId:
        process.env.COGNITO_CLIENT_ID || "4ef8k4tofjj4ounvo8nf7d9pep",
      cognitoDomain:
        process.env.COGNITO_DOMAIN ||
        "jobnet-auth-prod.auth.us-east-1.amazoncognito.com",
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
    preset: "aws-lambda",
    alias: {
      "@panva/hkdf": path.resolve("./server/shims/hkdf.cjs"),
      "@babel/runtime/helpers/interopRequireDefault": path.resolve(
        "./server/shims/interopRequireDefault.cjs",
      ),
    },
    externals: {
      inline: [
        "@babel/runtime",
        "@panva/hkdf",
        "jose",
        "@sidebase/nuxt-auth",
        "next-auth",
      ],
    },
  },
});
