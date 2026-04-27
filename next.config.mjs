/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: { bodySizeLimit: '2mb' }
  },
  // Bundle the SQLite DB into every serverless function output so Vercel can read it
  // at runtime. Without this, Next's file tracer doesn't see the .db file (it's not
  // statically imported, just opened by path).
  outputFileTracingIncludes: {
    '/**/*': ['./data/hwarex.db'],
  },
  // better-sqlite3 ships a native binding — exclude it from the server bundle so Next
  // doesn't try to webpack it.
  serverExternalPackages: ['better-sqlite3'],
};

export default nextConfig;
