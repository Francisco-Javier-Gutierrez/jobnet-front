export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@sidebase/nuxt-auth'
  ],
  auth: {
    globalAppMiddleware: false,
    provider: {
      type: 'authjs'
    }
  },
  nitro: {
    preset: 'aws-lambda'
  }
})
