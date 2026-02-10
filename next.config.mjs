// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   eslint: { ignoreDuringBuilds: true },
//   //   experimental: { optimizeCss: false },

//   webpack: (config, { isServer }) => {
//     config.watchOptions = {
//       ...config.watchOptions,
//       ignored:
//         /node_modules|\.next|Application Data|AppData|Cookies|Local Settings|\.mysqlsh-gui/,
//     }

//     // Alternative: exclude from resolution
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

    // Désactiver les symlinks
    config.resolve = {
      ...config.resolve,
      symlinks: false,
    }

    return config
  },
}

export default nextConfig
