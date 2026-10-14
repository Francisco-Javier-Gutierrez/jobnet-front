import crypto from "crypto";

export interface CognitoConfig {
  clientId: string;
  clientSecret: string;
  region: string;
}

export function getCognitoConfig(): CognitoConfig {
  const clientId =
    process.env.COGNITO_CLIENT_ID || "4ef8k4tofjj4ounvo8nf7d9pep";
  const clientSecret = process.env.COGNITO_CLIENT_SECRET || "";
  const issuer =
    process.env.COGNITO_ISSUER ||
    "https://cognito-idp.us-east-1.amazonaws.com/us-east-1_trquL61F2";
  const region =
    process.env.COGNITO_REGION || issuer.split(".")[1] || "us-east-1";

  return {
    clientId,
    clientSecret,
    region,
  };
}

export function calculateSecretHash(
  username: string,
  clientId: string,
  clientSecret: string,
): string {
  return crypto
    .createHmac("sha256", clientSecret)
    .update(username + clientId)
    .digest("base64");
}

export function translateCognitoError(
  errorCode?: string,
  originalMessage?: string,
): string {
  const safeCode = typeof errorCode === "string" ? errorCode : "CognitoError";
  const safeMessage =
    typeof originalMessage === "string" ? originalMessage : "";
  const code = safeCode.replace("Exception", "");
  switch (code) {
    case "UserNotFound":
      return "Verifique sus datos.";
    case "NotAuthorized":
      return "El usuario o la contraseña son incorrectos.";
    case "UserNotConfirmed":
      return "El usuario no ha sido confirmado. Por favor, verifique su código OTP.";
    case "LimitExceeded":
      return "Se ha superado el límite de intentos. Inténtelo más tarde.";
    case "CodeMismatch":
      return "El código de verificación ingresado es incorrecto.";
    case "ExpiredCodeMismatch":
    case "ExpiredCode":
      return "El código de verificación ha expirado.";
    case "InvalidPassword":
      return "La contraseña no cumple con los requisitos mínimos de seguridad (debe tener al menos 8 caracteres, incluyendo mayúsculas, minúsculas y un número).";
    case "UsernameExists":
      return "Ya existe una cuenta registrada con este correo electrónico.";
    case "TooManyRequests":
      return "Demasiadas solicitudes. Por favor, inténtelo de nuevo más tarde.";
    case "InvalidParameter":
      if (
        safeMessage.toLowerCase().includes("email") ||
        safeMessage.toLowerCase().includes("username")
      ) {
        return "El formato del correo electrónico es inválido.";
      }
      return "Los parámetros proporcionados son inválidos o faltan campos obligatorios.";
    case "AliasExists":
      return "Este correo electrónico ya se encuentra registrado por otro usuario.";
    case "CodeDeliveryFailure":
      return "No se pudo entregar el código de verificación. Por favor intente más tarde.";
    case "InvalidLambdaResponse":
    case "UnexpectedLambda":
      return "Error interno del servicio de autenticación. Por favor intente nuevamente.";
    default: {
      const msgLower = safeMessage.toLowerCase();
      if (
        msgLower.includes("user does not exist") ||
        msgLower.includes("user doesnotexist")
      ) {
        return "Verifique sus datos.";
      }
      if (msgLower.includes("incorrect username or password")) {
        return "El usuario o la contraseña son incorrectos.";
      }
      if (msgLower.includes("password attempts exceeded")) {
        return "Límite de intentos excedido. Por favor intente más tarde.";
      }
      if (msgLower.includes("user is not confirmed")) {
        return "El usuario no ha sido confirmado. Por favor, verifique su código OTP.";
      }
      return safeMessage || "Ocurrió un error de autenticación.";
    }
  }
}

export async function callCognito(
  target: string,
  body: Record<string, any>,
): Promise<any> {
  const { region } = getCognitoConfig();

  const response = await fetch(`https://cognito-idp.${region}.amazonaws.com/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-amz-json-1.1",
      "X-Amz-Target": `AWSCognitoIdentityProviderService.${target}`,
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();

  if (!response.ok) {
    let errorCode = "CognitoError";
    if (data.__type && data.__type.includes("#")) {
      errorCode = data.__type.split("#")[1];
    }
    const translatedMsg = translateCognitoError(errorCode, data.message || "");
    throw createError({
      statusCode: response.status,
      statusMessage: translatedMsg,
      data: { code: errorCode },
    });
  }

  return data;
}
