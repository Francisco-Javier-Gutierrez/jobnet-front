import { callCognito } from "../../utils/cognito";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { accessToken, userCode } = body || {};

  if (!accessToken || !userCode) {
    throw createError({
      statusCode: 400,
      statusMessage: "AccessToken y Código MFA requeridos",
    });
  }

  try {
    // Step 1: Verify the software token with Cognito
    const verifyResult = await callCognito("VerifySoftwareToken", {
      AccessToken: accessToken,
      UserCode: userCode,
      FriendlyDeviceName: "JobNetAuthenticatorApp",
    });

    if (verifyResult.Status !== "SUCCESS") {
      throw createError({
        statusCode: 400,
        statusMessage: "El código de verificación ingresado no es válido",
      });
    }

    // Step 2: Enable software token MFA preference for this user in Cognito
    await callCognito("SetUserMFAPreference", {
      AccessToken: accessToken,
      SoftwareTokenMfaSettings: {
        Enabled: true,
        PreferredMfa: true,
      },
    });

    return {
      success: true,
      status: verifyResult.Status,
    };
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage:
        error.statusMessage || "Error al verificar y activar MFA en Cognito",
      data: error.data || {},
    });
  }
});
