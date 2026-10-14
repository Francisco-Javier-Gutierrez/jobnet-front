import {
  getCognitoConfig,
  calculateSecretHash,
  callCognito,
} from "../../utils/cognito";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { email } = body;

  if (!email) {
    throw createError({
      statusCode: 400,
      statusMessage: "Email es obligatorio",
    });
  }

  const { clientId, clientSecret } = getCognitoConfig();

  const params: Record<string, any> = {
    ClientId: clientId,
    Username: email,
  };

  if (clientSecret) {
    params.SecretHash = calculateSecretHash(email, clientId, clientSecret);
  }

  try {
    await callCognito("ResendConfirmationCode", params);
    return {
      success: true,
      message: "Código de verificación reenviado con éxito",
    };
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || "Error al reenviar el código",
      data: error.data || {},
    });
  }
});
