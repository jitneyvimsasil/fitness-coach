import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    const n8nUrl = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL || '';
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';

    // Extract origins for CSP connect-src
    const n8nOrigin = n8nUrl ? new URL(n8nUrl).origin : '';
    const supabaseOrigin = supabaseUrl ? new URL(supabaseUrl).origin : '';

    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: blob:",
              "font-src 'self' https://fonts.gstatic.com",
              `connect-src 'self' ${n8nOrigin} ${supabaseOrigin}`.trim(),
              "frame-ancestors 'none'",
            ].join('; '),
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
