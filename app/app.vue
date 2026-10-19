<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <ClientOnly>
      <AppProtectedModal />
      <AppFeedbackModal />
      <AppCommandPalette />
      <DevMockToolbar />
    </ClientOnly>
  </div>
</template>
