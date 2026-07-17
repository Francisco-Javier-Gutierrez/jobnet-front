import _CognitoProvider from "next-auth/providers/cognito";
import _CredentialsProvider from "next-auth/providers/credentials";

// @ts-expect-error - Vite ESM interop
const CognitoProvider = _CognitoProvider.default || _CognitoProvider;
// @ts-expect-error - Vite ESM interop
const CredentialsProvider =
  _CredentialsProvider.default || _CredentialsProvider;
import { NuxtAuthHandler } from "#auth";
import crypto from "crypto";

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

export default NuxtAuthHandler({
  providers: [
    CognitoProvider({
      clientId: process.env.COGNITO_CLIENT_ID || "",
      clientSecret: process.env.COGNITO_CLIENT_SECRET || "",
      issuer: process.env.COGNITO_ISSUER || "",
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

        const clientId = process.env.COGNITO_CLIENT_ID || "";
        const clientSecret = process.env.COGNITO_CLIENT_SECRET || "";
        const issuer = process.env.COGNITO_ISSUER || "";
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
                  message:
                    responseData.message ||
                    "Código de MFA incorrecto o expirado",
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
                  message:
                    responseData.message || "Usuario o contraseña incorrectos",
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

      // If we have an idToken, decode it to extract Cognito sub (id), name and roles (groups)
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

            const groups = payload["cognito:groups"] || [];
            if (groups.includes("EMPRESA")) {
              token.tipoUsuario = "EMPRESA";
            } else if (groups.includes("ADMIN")) {
              token.tipoUsuario = "ADMIN";
            } else if (groups.includes("MODERATOR")) {
              token.tipoUsuario = "MODERATOR";
            } else {
              token.tipoUsuario = "CANDIDATO";
            }
          }
        } catch (e) {
          console.error("Error decoding Cognito IdToken payload:", e);
        }
      }

      if (user && !(user as any).error) {
        token.email = user.email;
        token.idToken = (user as any).idToken || token.idToken;
        token.accessToken = (user as any).accessToken || token.accessToken;
        token.refreshToken = (user as any).refreshToken;
        token.name = user.name || token.name;
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
        session.user.name = token.name;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
});
