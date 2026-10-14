import _CognitoProvider from "next-auth/providers/cognito";
import _CredentialsProvider from "next-auth/providers/credentials";

const CognitoProvider: any =
  typeof _CognitoProvider === "function"
    ? _CognitoProvider
    : (_CognitoProvider as any)?.default || _CognitoProvider;
const CredentialsProvider: any =
  typeof _CredentialsProvider === "function"
    ? _CredentialsProvider
    : (_CredentialsProvider as any)?.default || _CredentialsProvider;
import { NuxtAuthHandler } from "#auth";
import crypto from "crypto";
import { translateCognitoError } from "../../utils/cognito";

// Helper to compute Cognito Client Secret Hash
function calculateSecretHash(
  username: string,
  clientId: string,
  clientSecret: string,
): string {
  return crypto
    .createHmac("sha256", clientSecret)
    .update(username + clientId)
    .digest("base64");
}

// Helper to refresh Cognito tokens using RefreshToken
async function refreshCognitoToken(refreshToken: string, email?: string) {
  const clientId =
    process.env.COGNITO_CLIENT_ID || "4ef8k4tofjj4ounvo8nf7d9pep";
  const clientSecret = process.env.COGNITO_CLIENT_SECRET || "";
  const issuer =
    process.env.COGNITO_ISSUER ||
    "https://cognito-idp.us-east-1.amazonaws.com/us-east-1_trquL61F2";
  const region =
    process.env.COGNITO_REGION || issuer.split(".")[1] || "us-east-1";

  const authParameters: Record<string, string> = {
    REFRESH_TOKEN: refreshToken,
  };

  if (clientSecret && email) {
    authParameters.SECRET_HASH = calculateSecretHash(
      email,
      clientId,
      clientSecret,
    );
  }

  try {
    const res = await fetch(`https://cognito-idp.${region}.amazonaws.com/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-amz-json-1.1",
        "X-Amz-Target": "AWSCognitoIdentityProviderService.InitiateAuth",
      },
      body: JSON.stringify({
        AuthFlow: "REFRESH_TOKEN_AUTH",
        ClientId: clientId,
        AuthParameters: authParameters,
      }),
    });

    const data = await res.json();
    if (data.AuthenticationResult) {
      return {
        idToken: data.AuthenticationResult.IdToken,
        accessToken: data.AuthenticationResult.AccessToken,
      };
    }
  } catch (err) {
    console.error("Failed to refresh Cognito token:", err);
  }
  return null;
}

export default NuxtAuthHandler({
  providers: [
    CognitoProvider({
      clientId: process.env.COGNITO_CLIENT_ID || "4ef8k4tofjj4ounvo8nf7d9pep",
      clientSecret: process.env.COGNITO_CLIENT_SECRET || "",
      issuer:
        process.env.COGNITO_ISSUER ||
        "https://cognito-idp.us-east-1.amazonaws.com/us-east-1_trquL61F2",
    }),
    CredentialsProvider({
      id: "credentials",
      name: "CognitoCredentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
        mfaCode: { label: "MfaCode", type: "text" },
        mfaSession: { label: "MfaSession", type: "text" },
        mfaChallenge: { label: "MfaChallenge", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email) {
          throw new Error("Email es requerido");
        }

        const clientId =
          process.env.COGNITO_CLIENT_ID || "4ef8k4tofjj4ounvo8nf7d9pep";
        const clientSecret = process.env.COGNITO_CLIENT_SECRET || "";
        const issuer =
          process.env.COGNITO_ISSUER ||
          "https://cognito-idp.us-east-1.amazonaws.com/us-east-1_trquL61F2";
        const region =
          process.env.COGNITO_REGION || issuer.split(".")[1] || "us-east-1";

        try {
          let responseData;

          // Check if we are responding to an MFA challenge
          if (
            credentials.mfaCode &&
            credentials.mfaSession &&
            credentials.mfaChallenge
          ) {
            const challengeResponses: Record<string, string> = {
              USERNAME: credentials.email,
            };

            if (credentials.mfaChallenge === "SMS_MFA") {
              challengeResponses.SMS_MFA_CODE = credentials.mfaCode;
            } else if (credentials.mfaChallenge === "SOFTWARE_TOKEN_MFA") {
              challengeResponses.SOFTWARE_TOKEN_MFA_CODE = credentials.mfaCode;
            } else {
              // Generic fallback just in case
              challengeResponses.ANSWER = credentials.mfaCode;
            }

            if (clientSecret) {
              challengeResponses.SECRET_HASH = calculateSecretHash(
                credentials.email,
                clientId,
                clientSecret,
              );
            }

            const response = await fetch(
              `https://cognito-idp.${region}.amazonaws.com/`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/x-amz-json-1.1",
                  "X-Amz-Target":
                    "AWSCognitoIdentityProviderService.RespondToAuthChallenge",
                },
                body: JSON.stringify({
                  ClientId: clientId,
                  ChallengeName: credentials.mfaChallenge,
                  Session: credentials.mfaSession,
                  ChallengeResponses: challengeResponses,
                }),
              },
            );

            responseData = await response.json();

            if (!response.ok) {
              const errorCode = responseData.__type
                ? responseData.__type.split("#")[1]
                : "MFAError";
              throw new Error(
                JSON.stringify({
                  code: errorCode,
                  message: translateCognitoError(
                    errorCode,
                    responseData.message ||
                      "Código de MFA incorrecto o expirado",
                  ),
                }),
              );
            }
          } else {
            // Standard InitiateAuth step
            if (!credentials.password) {
              throw new Error("Contraseña es requerida");
            }

            const authParams: Record<string, string> = {
              USERNAME: credentials.email,
              PASSWORD: credentials.password,
            };

            if (clientSecret) {
              authParams.SECRET_HASH = calculateSecretHash(
                credentials.email,
                clientId,
                clientSecret,
              );
            }

            const response = await fetch(
              `https://cognito-idp.${region}.amazonaws.com/`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/x-amz-json-1.1",
                  "X-Amz-Target":
                    "AWSCognitoIdentityProviderService.InitiateAuth",
                },
                body: JSON.stringify({
                  AuthFlow: "USER_PASSWORD_AUTH",
                  ClientId: clientId,
                  AuthParameters: authParams,
                }),
              },
            );

            responseData = await response.json();

            if (!response.ok) {
              const errorCode = responseData.__type
                ? responseData.__type.split("#")[1]
                : "AuthError";
              throw new Error(
                JSON.stringify({
                  code: errorCode,
                  message: translateCognitoError(
                    errorCode,
                    responseData.message || "Usuario o contraseña incorrectos",
                  ),
                }),
              );
            }
          }

          if (responseData.ChallengeName) {
            // Emit a stringified challenge payload that can be parsed on the frontend
            throw new Error(
              JSON.stringify({
                code: "ChallengeRequired",
                challengeName: responseData.ChallengeName,
                session: responseData.Session,
                email: credentials.email,
              }),
            );
          }

          const authResult = responseData.AuthenticationResult;
          if (authResult) {
            return {
              id: credentials.email,
              email: credentials.email,
              name: credentials.email.split("@")[0],
              idToken: authResult.IdToken,
              accessToken: authResult.AccessToken,
              refreshToken: authResult.RefreshToken,
            };
          }

          return null;
        } catch (error: any) {
          return {
            id: "error",
            error: error.message,
          };
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      if (user && (user as any).error) {
        throw new Error((user as any).error);
      }

      if (user && (user as any).idToken) {
        try {
          const payloadBase64 = (user as any).idToken.split(".")[1];
          const payload = JSON.parse(
            Buffer.from(payloadBase64, "base64").toString("ascii"),
          );
          // Detect assigned Cognito Scopes or custom attributes in token
          const rawScope = payload.scope || payload.scp || "";
          const scopes = Array.isArray(rawScope)
            ? rawScope
            : typeof rawScope === "string"
              ? rawScope.split(" ")
              : [];
          const customRole = (
            payload["custom:role"] ||
            payload["custom:tipoUsuario"] ||
            ""
          )
            .toString()
            .toUpperCase();

          let cognitoRole = "";
          if (
            scopes.some((s: string) => s.includes("admin")) ||
            customRole === "ADMIN"
          )
            cognitoRole = "ADMIN";
          else if (
            scopes.some(
              (s: string) => s.includes("moderator") || s.includes("mod"),
            ) ||
            customRole === "MODERATOR"
          )
            cognitoRole = "MODERATOR";
          else if (
            scopes.some(
              (s: string) =>
                s.includes("organization") || s.includes("empresa"),
            ) ||
            customRole === "ORGANIZACION" ||
            customRole === "EMPRESA" ||
            customRole === "COMPANY"
          )
            cognitoRole = "ORGANIZACION";
          else if (
            scopes.some(
              (s: string) => s.includes("candidate") || s.includes("candidato"),
            ) ||
            customRole === "CANDIDATO" ||
            customRole === "CANDIDATE"
          )
            cognitoRole = "CANDIDATO";

          const config = useRuntimeConfig();
          const profile: any = await $fetch(
            `${config.public.apiUrl}/profile/${userId}`,
          ).catch(() => null);

          if (profile) {
            if (profile.estadoCuenta === "SUSPENDIDA") {
              throw new Error(
                "Su cuenta ha sido suspendida definitivamente por infracción.",
              );
            }
            if (profile.estadoCuenta === "SUSPENDIDA_TEMPORAL") {
              const fin = profile.fechaFinSuspension
                ? new Date(profile.fechaFinSuspension)
                : null;
              if (fin && new Date() < fin) {
                const diasRestantes = Math.ceil(
                  (fin.getTime() - new Date().getTime()) / (1000 * 3600 * 24),
                );
                throw new Error(
                  `Su cuenta está suspendida temporalmente. Restan ${diasRestantes} días.`,
                );
              } else {
                // Suspension expired, automatically restore profile status to ACTIVO!
                await $fetch(`${config.public.apiUrl}/profile/${userId}`, {
                  method: "POST",
                  body: {
                    estadoCuenta: "ACTIVO",
                    fechaFinSuspension: null,
                  },
                }).catch(() => null);
              }
            }

            // Automatic reconciliation: If user was a blank user (PENDIENTE) and Admin assigned Cognito Group, sync DynamoDB!
            if (
              cognitoRole &&
              (profile.tipoUsuario === "PENDIENTE" ||
                profile.estadoCuenta === "PENDIENTE_ROL" ||
                profile.tipoUsuario !== cognitoRole)
            ) {
              await $fetch(`${config.public.apiUrl}/profile/${userId}`, {
                method: "POST",
                body: {
                  tipoUsuario: cognitoRole,
                  estadoCuenta: "ACTIVO",
                },
              }).catch(() => null);
            }
          }
        } catch (e: any) {
          if (e.message && e.message.includes("suspendida")) {
            throw e;
          }
          console.error("Error checking account suspension on login:", e);
        }
      }
      return true;
    },
    async redirect({ url, baseUrl }) {
      if (!url || url === "undefined") {
        return baseUrl;
      }
      if (url.startsWith("/")) {
        return `${baseUrl}${url}`;
      }
      try {
        const parsedUrl = new URL(url);
        if (parsedUrl.origin === baseUrl) {
          return url;
        }
      } catch (e) {
        // Fallback to baseUrl
      }
      return baseUrl;
    },
    async jwt({ token, user, account }) {
      if (account) {
        token.idToken = account.id_token;
        token.accessToken = account.access_token;
      }

      if (user && !(user as any).error) {
        token.email = user.email;
        token.idToken = (user as any).idToken || token.idToken;
        token.accessToken = (user as any).accessToken || token.accessToken;
        token.refreshToken = (user as any).refreshToken || token.refreshToken;
        token.name = user.name || token.name;
      }

      // If we have an idToken, decode it to extract Cognito sub (id), name, roles and check expiration
      if (token.idToken) {
        try {
          const payloadBase64 = (token.idToken as string).split(".")[1];
          if (payloadBase64) {
            const payloadJson = Buffer.from(payloadBase64, "base64").toString(
              "ascii",
            );
            const payload = JSON.parse(payloadJson);

            token.id = payload.sub; // Real Cognito UUID sub

            // Extract fullname/company name registered in Cognito
            if (payload.name) {
              token.name = payload.name;
            }

            const rawScope = payload.scope || payload.scp || "";
            const scopes = Array.isArray(rawScope)
              ? rawScope
              : typeof rawScope === "string"
                ? rawScope.split(" ")
                : [];
            const customRole = (
              payload["custom:role"] ||
              payload["custom:tipoUsuario"] ||
              ""
            )
              .toString()
              .toUpperCase();

            if (
              scopes.some((s: string) => s.includes("admin")) ||
              customRole === "ADMIN"
            ) {
              token.tipoUsuario = "ADMIN";
            } else if (
              scopes.some(
                (s: string) => s.includes("moderator") || s.includes("mod"),
              ) ||
              customRole === "MODERATOR"
            ) {
              token.tipoUsuario = "MODERATOR";
            } else if (
              scopes.some(
                (s: string) =>
                  s.includes("organization") || s.includes("empresa"),
              ) ||
              customRole === "ORGANIZACION" ||
              customRole === "EMPRESA" ||
              customRole === "COMPANY"
            ) {
              token.tipoUsuario = "ORGANIZACION";
            } else {
              token.tipoUsuario = "CANDIDATO";
            }

            // Check if Cognito idToken is expired or expiring in < 300 seconds
            const nowInSeconds = Math.floor(Date.now() / 1000);
            if (
              payload.exp &&
              payload.exp - nowInSeconds < 300 &&
              token.refreshToken
            ) {
              console.log(
                "Cognito idToken is expired or expiring soon. Refreshing via REFRESH_TOKEN_AUTH...",
              );
              const refreshed = await refreshCognitoToken(
                token.refreshToken as string,
                token.email as string,
              );
              if (refreshed?.idToken) {
                token.idToken = refreshed.idToken;
                if (refreshed.accessToken)
                  token.accessToken = refreshed.accessToken;
                console.log("Successfully refreshed Cognito idToken!");
              }
            }
          }
        } catch (e) {
          console.error(
            "Error decoding/refreshing Cognito IdToken payload:",
            e,
          );
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session as any).idToken = token.idToken;
        (session as any).accessToken = token.accessToken;
        (session as any).refreshToken = token.refreshToken;

        // Expose id, name and role to the frontend useAuth() session user
        (session.user as any).id = token.id;
        (session.user as any).tipoUsuario = token.tipoUsuario;
        (session.user as any).role = token.tipoUsuario;
        session.user.name = token.name;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  jwt: {
    secret:
      process.env.NEXTAUTH_SECRET ||
      process.env.NUXT_AUTH_SECRET ||
      "jobnet-super-secret-key-prod-2026",
    async encode({ token, secret }) {
      if (!token) return "";
      const hkdfModule = await import("@panva/hkdf");
      const hkdfFn: any =
        (hkdfModule as any).hkdf ||
        (hkdfModule as any).default?.hkdf ||
        hkdfModule.default;
      const joseModule = await import("jose");
      const EncryptJWT = joseModule.EncryptJWT;

      const keySecret =
        (secret as string) || "jobnet-super-secret-key-prod-2026";
      const encryptionSecret = await hkdfFn(
        "sha256",
        keySecret,
        "",
        "NextAuth.js Generated Encryption Key",
        32,
      );

      return await new EncryptJWT({ ...token })
        .setProtectedHeader({ alg: "dir", enc: "A256GCM" })
        .setIssuedAt()
        .setExpirationTime("30d")
        .encrypt(encryptionSecret);
    },
    async decode({ token, secret }) {
      if (!token) return null;
      const hkdfModule = await import("@panva/hkdf");
      const hkdfFn: any =
        (hkdfModule as any).hkdf ||
        (hkdfModule as any).default?.hkdf ||
        hkdfModule.default;
      const joseModule = await import("jose");
      const jwtDecrypt = joseModule.jwtDecrypt;

      const keySecret =
        (secret as string) || "jobnet-super-secret-key-prod-2026";
      const encryptionSecret = await hkdfFn(
        "sha256",
        keySecret,
        "",
        "NextAuth.js Generated Encryption Key",
        32,
      );

      try {
        const { payload } = await jwtDecrypt(token, encryptionSecret);
        return payload as any;
      } catch (e) {
        return null;
      }
    },
  },
  secret:
    process.env.NEXTAUTH_SECRET ||
    process.env.NUXT_AUTH_SECRET ||
    "jobnet-super-secret-key-prod-2026",
});
