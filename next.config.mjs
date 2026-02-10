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

  // Configuration cruciale pour Prisma + Vercel
  experimental: {
    outputFileTracingIncludes: {
      '/api/**/*': ['./node_modules/.prisma/client/**/*'],
    },
  },

  serverComponentsExternalPackages: ['@prisma/client', 'bcryptjs'],

  webpack: (config, { isServer }) => {
    config.watchOptions = {
      ...config.watchOptions,
      ignored: [
        '**/node_modules/**',
        '**/.next/**',
        '**/Application Data/**',
        '**/AppData/**',
        '**/Cookies/**',
        '**/Local Settings/**',
        '**/.mysqlsh-gui/**',
        'C:/Users/HP/Application Data/**',
        'C:\\Users\\HP\\Application Data\\**',
      ],
    }

    // Configuration pour le client (ne pas désactiver symlinks pour Prisma)
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
