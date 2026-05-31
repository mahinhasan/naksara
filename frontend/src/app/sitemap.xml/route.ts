import { NextResponse } from 'next/server';

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://heritage-artisan.com';
  
  // In a real app, fetch slugs from the API/DB
  const products = [
    { slug: 'handcrafted-vase', updatedAt: new Date().toISOString() },
    { slug: 'artisan-rug', updatedAt: new Date().toISOString() },
  ];
  
  const posts = [
    { slug: 'story-of-craft', updatedAt: new Date().toISOString() },
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/catalog</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <priority>0.8</priority>
  </url>
  ${products.map(p => `
  <url>
    <loc>${baseUrl}/products/${p.slug}</loc>
    <lastmod>${p.updatedAt}</lastmod>
    <priority>0.7</priority>
  </url>`).join('')}
  ${posts.map(post => `
  <url>
    <loc>${baseUrl}/blog/${post.slug}</loc>
    <lastmod>${post.updatedAt}</lastmod>
    <priority>0.6</priority>
  </url>`).join('')}
</urlset>`;

  return new NextResponse(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}
