import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const path = req.nextUrl.pathname

    // Pages admin - uniquement pour les admins
    if (path.startsWith('/admin') && token?.role !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }

    // Autres vérifications si nécessaire
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname

        // Pages publiques
        const publicPaths = ['/', '/login', '/signup', '/models']
        if (publicPaths.some((p) => path.startsWith(p))) {
          return true
        }

        // Pages protégées - nécessitent une connexion
        return !!token
      },
    },
  },
)

// Spécifier les routes à protéger
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/api-keys/:path*',
    '/settings/:path*',
    '/admin/:path*',
  ],
}
