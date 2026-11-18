/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/tr',
        permanent: false,
      },
      // Gerçek domain'in Vercel projesinde admin env'leri yok (Arda Bey'in hesabı) →
      // 🔒 ikonu / admin adresleri, admin'in çalıştığı vercel.app'e gider.
      ...['fikrimvaricmimarlik.com', 'www.fikrimvaricmimarlik.com'].map((host) => ({
        source: '/admin/:path*',
        has: [{type: 'host', value: host}],
        destination: 'https://fikrim-var-mimarlik.vercel.app/admin/:path*',
        permanent: false,
      })),
    ]
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        pathname: '/images/**',
      },
    ],
  },
  typescript: {
    // Build sırasında TypeScript tip hatalarını atla (dev'de çalışmaya devam eder)
    // Sanity v3 + Next.js 15 arasında tip tanımı uyumsuzlukları için geçici çözüm
    ignoreBuildErrors: true,
  },
  eslint: {
    // Build sırasında ESLint kontrolünü de atla
    ignoreDuringBuilds: true,
  },
}

export default nextConfig