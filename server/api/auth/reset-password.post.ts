import {
  getCognitoConfig,
  calculateSecretHash,
  callCognito,
} from "../../utils/cognito";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { email, code, newPassword } = body;

  if (!email || !code || !newPassword) {
    throw createError({
      statusCode: 400,
      statusMessage:
        "Todos los campos (email, code, newPassword) son obligatorios",
    });
  }

  const { clientId, clientSecret } = getCognitoConfig();

  const resetParams: Record<string, any> = {
    ClientId: clientId,
    Username: email,
    ConfirmationCode: code,
    Password: newPassword,
  };

  if (clientSecret) {
    resetParams.SecretHash = calculateSecretHash(email, clientId, clientSecret);
  }

  try {
    await callCognito("ConfirmForgotPassword", resetParams);
    return {
      success: true,
      message: "Contraseña restablecida con éxito",
    };
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage:
        error.statusMessage || "Error al restablecer la contraseña",
      data: error.data || {},
    });
  }
});
