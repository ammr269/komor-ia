// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   eslint: { ignoreDuringBuilds: true },

//   webpack: (config, { isServer }) => {
//     config.watchOptions = {
//       ...config.watchOptions,
//       ignored: [
//         '**/node_modules/**',
//         '**/.next/**',
//         '**/Application Data/**',
//         '**/AppData/**',
//         '**/Cookies/**',
//         '**/Local Settings/**',
//         '**/.mysqlsh-gui/**',
//         'C:/Users/HP/Application Data/**',
//         'C:\\Users\\HP\\Application Data\\**',
//       ],
//     }

//     // Désactiver les symlinks
//     config.resolve = {
//       ...config.resolve,
//       symlinks: false,
//     }

//     return config
//   },
// }

// export default nextConfig

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: { ignoreDuringBuilds: true },

  // Configuration pour Prisma + Vercel (IMPORTANT pour le déploiement)
  outputFileTracingIncludes: {
    '/api/**/*': ['./node_modules/.prisma/client/**/*'],
  },

  serverExternalPackages: ['@prisma/client', 'bcryptjs'],

  webpack: (config, { isServer }) => {
    // Simplifier watchOptions - retirer les chemins Windows problématiques
    config.watchOptions = {
      ...config.watchOptions,
      ignored: [
        '**/node_modules/**',
        '**/.next/**',
        '**/.mysqlsh-gui/**',
        '**/AppData/**',
        '**/Local Settings/**',
        '**/Cookies/**',
      ],
    }

    // NE PAS désactiver les symlinks (nécessaire pour Prisma sur Vercel)
    if (!isServer) {
      config.resolve = {
        ...config.resolve,
        fallback: {
          fs: false,
          net: false,
          tls: false,
        },
      }
    }

    return config
  },
}

export default nextConfig
