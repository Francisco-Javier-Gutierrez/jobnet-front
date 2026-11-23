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
      <AppGoogleRoleNoticeModal />
    </ClientOnly>
  </div>
</template>
