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
  secret: process.env.NEXTAUTH_SECRET
})
