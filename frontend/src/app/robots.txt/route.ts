import { NextResponse } from 'next/server';

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://heritage-artisan.com';
  
  const robots = `User-agent: *
Allow: /
Disallow: /admin
Disallow: /api/
Disallow: /checkout
Disallow: /account

Sitemap: ${baseUrl}/sitemap.xml`;

  return new NextResponse(robots, {
    headers: {
      'Content-Type': 'text/plain',
    },
  });
}
