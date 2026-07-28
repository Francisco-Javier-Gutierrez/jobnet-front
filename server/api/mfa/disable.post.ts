import { callCognito } from "../../utils/cognito";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { accessToken } = body || {};

  if (!accessToken) {
    throw createError({
      statusCode: 400,
      statusMessage: "AccessToken de sesión requerido",
    });
  }

  try {
    // Disable software token MFA preference in Cognito
    await callCognito("SetUserMFAPreference", {
      AccessToken: accessToken,
      SoftwareTokenMfaSettings: {
        Enabled: false,
        PreferredMfa: false,
      },
    });

    return {
      success: true,
    };
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage:
        error.statusMessage || "Error al desactivar MFA en Cognito",
      data: error.data || {},
    });
  }
});
