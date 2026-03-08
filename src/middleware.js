// import { withAuth } from 'next-auth/middleware'
// import { NextResponse } from 'next/server'

// export default withAuth(
//   function middleware(req) {
//     const token = req.nextauth.token
//     const path = req.nextUrl.pathname

//     console.log(`🔍 Middleware - Path: ${path}, Role: ${token?.role}`)

//     // 🔐 Protection des routes admin
//     if (path.startsWith('/dashboard/admin')) {
//       if (!token) {
//         console.log('🚫 Admin - Non authentifié, redirect vers /login')
//         return NextResponse.redirect(new URL('/login', req.url))
//       }

//       if (token.role !== 'admin') {
//         console.log(
//           `🚫 Admin - Accès refusé pour ${token.email} (role: ${token.role})`,
//         )
//         return NextResponse.redirect(new URL('/dashboard', req.url))
//       }

//       console.log(`✅ Admin - Accès autorisé pour ${token.email}`)
//     }

//     // 🔐 Protection du dashboard général
//     if (
//       path.startsWith('/dashboard') &&
//       !path.startsWith('/dashboard/admin') &&
//       !token
//     ) {
//       console.log('🚫 Dashboard - Non authentifié, redirect vers /login')
//       return NextResponse.redirect(new URL('/login', req.url))
//     }

//     return NextResponse.next()
//   },
//   {
//     callbacks: {
//       authorized: ({ token }) => !!token,
//     },
//   },
// )

// // Routes à protéger
// export const config = {
//   matcher: ['/dashboard/:path*'],
// }

import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const path = req.nextUrl.pathname

    // Protection des routes admin
    if (path.startsWith('/dashboard/admin')) {
      if (!token) {
        return NextResponse.redirect(new URL('/login', req.url))
      }
      if (token.role !== 'admin') {
        return NextResponse.redirect(new URL('/dashboard', req.url))
      }
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname
        // Laisser le middleware gérer la logique, on autorise toujours ici
        if (path.startsWith('/dashboard/admin')) {
          return !!token && token.role === 'admin'
        }
        return !!token
      },
    },
    pages: {
      signIn: '/login',
    },
  },
)

export const config = {
  matcher: ['/dashboard/:path*'],
}
