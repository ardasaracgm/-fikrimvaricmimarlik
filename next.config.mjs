// Admin, env'lerin (ADMIN_*, SANITY_API_TOKEN) bulunduğu bizim Vercel projesinde çalışır.
// Gerçek domain (Arda Bey'in Vercel projesi, env'ler yok) admin isteklerini oraya
// görünmez şekilde aktarır (proxy) — adres çubuğunda hep fikrimvaricmimarlik.com kalır.
const ADMIN_ORIGIN = 'https://fikrim-var-mimarlik.vercel.app'
const REAL_HOSTS = ['fikrimvaricmimarlik.com', 'www.fikrimvaricmimarlik.com']
const PROXIED = ['/admin', '/admin/:path*', '/api/admin/:path*', '/api/translate']

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Sadece bizim Vercel projesinde ASSET_PREFIX=https://fikrim-var-mimarlik.vercel.app tanımlı:
  // proxy'lenen admin sayfası JS/CSS'ini kendi build'inden (vercel.app) yüklesin,
  // gerçek domain'in farklı build'inden değil.
  assetPrefix: process.env.ASSET_PREFIX || undefined,
  async headers() {
    return [
      {
        // assetPrefix ile başka domainden yüklenen fontlar için CORS
        source: '/_next/static/:path*',
        headers: [{key: 'Access-Control-Allow-Origin', value: '*'}],
      },
    ]
  },
  async rewrites() {
    return {
      // beforeFiles: bu build'in kendi /admin sayfalarından önce devreye girsin
      beforeFiles: REAL_HOSTS.flatMap((host) =>
        PROXIED.map((source) => ({
          source,
          has: [{type: 'host', value: host}],
          destination: `${ADMIN_ORIGIN}${source}`,
        }))
      ),
    }
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/tr',
        permanent: false,
      },
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