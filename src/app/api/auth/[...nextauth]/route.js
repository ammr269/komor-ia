import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
// import prisma from '../../../../lib/prisma'
import bcrypt from 'bcryptjs'
import prisma from '@/lib/prisma'

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    // Google OAuth
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),

    // Email/Password
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email et mot de passe requis')
        }

        // Trouver l'utilisateur
        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        })

        if (!user || !user.hashPassword) {
          throw new Error('Email ou mot de passe incorrect')
        }

        // Vérifier le mot de passe
        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.hashPassword,
        )

        if (!isPasswordValid) {
          throw new Error('Email ou mot de passe incorrect')
        }

        return {
          id: user.id.toString(),
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role,
        }
      },
    }),
  ],

  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 jours
  },

  pages: {
    signIn: '/login',
    signOut: '/',
    error: '/login',
    verifyRequest: '/verify',
    newUser: '/dashboard',
  },

  callbacks: {
    async jwt({ token, user, account }) {
      // Première connexion
      if (user) {
        token.id = user.id
        token.role = user.role
      }

      // OAuth (Google)
      if (account?.provider === 'google') {
        const dbUser = await prisma.user.findUnique({
          where: { email: token.email },
        })
        if (dbUser) {
          token.id = dbUser.id.toString()
          token.role = dbUser.role
        }
      }

      return token
    },

    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id
        session.user.role = token.role
      }
      return session
    },

    async signIn({ user, account, profile }) {
      // Pour Google OAuth
      if (account?.provider === 'google') {
        // Vérifier si l'utilisateur existe
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email },
        })

        // Si l'utilisateur n'existe pas, il sera créé automatiquement par PrismaAdapter
        // Mais on peut ajouter une logique personnalisée ici si besoin

        return true
      }

      return true
    },
  },

  events: {
    async signIn({ user, account, profile, isNewUser }) {
      console.log('User signed in:', user.email)
    },
    async signOut({ token, session }) {
      console.log('User signed out')
    },
  },

  debug: process.env.NODE_ENV === 'development',
  secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
