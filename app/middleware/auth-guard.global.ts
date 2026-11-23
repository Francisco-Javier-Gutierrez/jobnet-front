export default defineNuxtRouteMiddleware((to) => {
  const { status, data } = useAuth();

  const effectiveStatus = status.value;
  const rawRole =
    (data.value?.user as any)?.tipoUsuario || (data.value?.user as any)?.role;
  const userRole = (rawRole || "").toUpperCase();

  const path = to.path.toLowerCase();

  // 0. Pending / Inactive Neutral Accounts -> Cannot access private platform features until authorized
  if (userRole === "PENDIENTE" || userRole === "PENDIENTE_ROL") {
    if (
      path !== "/login" &&
      path !== "/register-secret" &&
      path !== "/register-moderator" &&
      path !== "/register-mod" &&
      path !== "/verify-otp"
    ) {
      return navigateTo("/login");
    }
  }

  // 1a. User & Organization Support Route (/support) -> Allowed for all authenticated users
  if (path === "/support" || path.startsWith("/support/")) {
    if (effectiveStatus !== "authenticated") {
      return navigateTo("/login");
    }
    return;
  }

  // 1a.2. Personal Favorites Panel (/saved) -> Protected: Allowed ONLY for authenticated users
  if (path === "/saved" || path.startsWith("/saved/")) {
    if (effectiveStatus !== "authenticated") {
      return navigateTo("/login");
    }
    return;
  }

  // 1b. Moderator Support Routes (/mod/support) -> Allowed ONLY for MODERATOR
  if (path.startsWith("/mod/support")) {
    if (
      effectiveStatus !== "authenticated" ||
      (userRole !== "MODERATOR" &&
        userRole !== "MODERADOR" &&
        userRole !== "ADMIN")
    ) {
      throw createError({
        statusCode: 404,
        statusMessage: "Página no encontrada",
        fatal: true,
      });
    }
  }

  // 2. Admin Routes (/admin/*) -> Allowed ONLY for ADMIN (or admin access key for hidden route)
  if (path.startsWith("/admin")) {
    if (effectiveStatus !== "authenticated" || userRole !== "ADMIN") {
      throw createError({
        statusCode: 404,
        statusMessage: "Página no encontrada",
        fatal: true,
      });
    }
  }

  // 3. Moderator Routes (/mod/*) -> Allowed for ADMIN, MODERATOR, MODERADOR
  if (path.startsWith("/mod")) {
    if (
      effectiveStatus !== "authenticated" ||
      (userRole !== "ADMIN" &&
        userRole !== "MODERATOR" &&
        userRole !== "MODERADOR")
    ) {
      throw createError({
        statusCode: 404,
        statusMessage: "Página no encontrada",
        fatal: true,
      });
    }
  }

  // 4a. Dashboard Router (/dashboard) -> ADMIN to /admin/analytics, ORGANIZACION to /applicants
  if (path === "/dashboard" || path === "/dashboard/") {
    if (effectiveStatus !== "authenticated") {
      return navigateTo("/login");
    }
    if (userRole === "ADMIN") {
      return navigateTo("/admin");
    }
    if (userRole === "ORGANIZACION") {
      return navigateTo("/applicants");
    }
    throw createError({
      statusCode: 404,
      statusMessage: "Página no encontrada",
      fatal: true,
    });
  }

  // 4b. Organization Routes (/my-vacancies, /applicants, /company/edit, /create-vacancy) -> Allowed ONLY for ORGANIZACION
  const orgRoutes = [
    "/my-vacancies",
    "/applicants",
    "/company/edit",
    "/company/verification",
    "/create-vacancy",
  ];

  if (orgRoutes.some((r) => path === r || path.startsWith(`${r}/`))) {
    if (effectiveStatus !== "authenticated" || userRole !== "ORGANIZACION") {
      throw createError({
        statusCode: 404,
        statusMessage: "Página no encontrada",
        fatal: true,
      });
    }
  }

  // 5. Candidate Edit Routes (/settings) -> CANDIDATO, ADMIN, MODERADOR, or no role (default user)
  const candidateRoutes = ["/settings"];

  if (candidateRoutes.some((r) => path === r || path.startsWith(`${r}/`))) {
    if (
      effectiveStatus !== "authenticated" ||
      (userRole !== "CANDIDATO" &&
        userRole !== "ADMIN" &&
        userRole !== "MODERATOR" &&
        userRole !== "MODERADOR" &&
        userRole !== "")
    ) {
      throw createError({
        statusCode: 404,
        statusMessage: "Página no encontrada",
        fatal: true,
      });
    }
  }

  // 5b. Candidate My Applications (/candidate/my-applications) -> Allowed ONLY for CANDIDATO
  if (
    path === "/candidate/my-applications" ||
    path.startsWith("/candidate/my-applications/")
  ) {
    if (effectiveStatus !== "authenticated" || userRole !== "CANDIDATO") {
      throw createError({
        statusCode: 404,
        statusMessage: "Página no encontrada",
        fatal: true,
      });
    }
  }

  // 6. Public Job Search Routes (/vacancies, /jobs) -> BLOCKED for ORGANIZACION
  const searchRoutes = ["/vacancies", "/jobs"];

  if (searchRoutes.some((r) => path === r || path.startsWith(`${r}/`))) {
    if (userRole === "ORGANIZACION") {
      return navigateTo("/dashboard");
    }
  }
});
