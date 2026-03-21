// 'use client'

// import { SessionProvider } from 'next-auth/react'

// export default function Providers({ children }) {
//   return <SessionProvider>{children}</SessionProvider>
// }

'use client'

import { SessionProvider } from 'next-auth/react'
import PublicLayoutWrapper from './components/public-layout-wrapper'

export default function Providers({ children }) {
  return (
    <SessionProvider>
      <PublicLayoutWrapper>{children}</PublicLayoutWrapper>
    </SessionProvider>
  )
}
