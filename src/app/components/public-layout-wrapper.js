'use client'

import { usePathname } from 'next/navigation'
import PublicNavbar from './public-navbar'
import Footer from './footer'

export default function PublicLayoutWrapper({ children }) {
  const pathname = usePathname()

  // Pages qui ne doivent PAS avoir navbar/footer
  const excludedPaths = ['/dashboard', '/login', '/signup']

  // ✅ Vérifier la racine séparément
  if (pathname === '/') {
    return <>{children}</>
  }

  // ✅ Vérifier les autres chemins exclus
  const shouldShowLayout = !excludedPaths.some((path) =>
    pathname.startsWith(path),
  )

  if (!shouldShowLayout) {
    return <>{children}</>
  }

  return (
    <>
      <PublicNavbar />
      <main className="min-h-screen">{children}</main>
      <Footer />
    </>
  )
}
