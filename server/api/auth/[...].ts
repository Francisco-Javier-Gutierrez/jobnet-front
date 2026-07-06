import CognitoProvider from 'next-auth/providers/cognito'
import { NuxtAuthHandler } from '#auth'

export default NuxtAuthHandler({
  providers: [
    CognitoProvider({
      clientId: process.env.COGNITO_CLIENT_ID || '',
      clientSecret: process.env.COGNITO_CLIENT_SECRET || '',
      issuer: process.env.COGNITO_ISSUER || ''
    })
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.idToken = account.id_token
        token.accessToken = account.access_token
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session as any).idToken = token.idToken;
        (session as any).accessToken = token.accessToken;
      }
      return session
    }
  },
  secret: process.env.NEXTAUTH_SECRET
})
