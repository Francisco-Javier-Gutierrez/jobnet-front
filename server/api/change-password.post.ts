import { callCognito } from "../utils/cognito";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { oldPassword, newPassword, accessToken } = body || {};

  if (!accessToken) {
    throw createError({
      statusCode: 401,
      statusMessage: "No estás autenticado o falta el token de acceso.",
    });
  }

  if (!oldPassword || !newPassword) {
    throw createError({
      statusCode: 400,
      statusMessage: "La contraseña actual y la nueva son requeridas.",
    });
  }

  try {
    const result = await callCognito("ChangePassword", {
      PreviousPassword: oldPassword,
      ProposedPassword: newPassword,
      AccessToken: accessToken,
    });

    return {
      success: true,
      message: "Contraseña actualizada exitosamente.",
    };
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage:
        error.statusMessage || "Error al cambiar la contraseña en Cognito",
      data: error.data || {},
    });
  }
});
