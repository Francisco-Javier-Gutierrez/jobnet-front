import crypto from "crypto";

export interface CognitoConfig {
  clientId: string;
  clientSecret: string;
  region: string;
}

export function getCognitoConfig(): CognitoConfig {
  const clientId = process.env.COGNITO_CLIENT_ID || "";
  const clientSecret = process.env.COGNITO_CLIENT_SECRET || "";
  const issuer = process.env.COGNITO_ISSUER || "";
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
    throw createError({
      statusCode: response.status,
      statusMessage: data.message || "Error executing Cognito operation",
      data: { code: errorCode },
    });
  }

  return data;
}
