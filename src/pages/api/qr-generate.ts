import type { APIRoute } from 'astro';
import QRCode from 'qrcode';

export const prerender = false;

export const GET: APIRoute = async ({ url }) => {
  try {
    const targetUrl = url.searchParams.get('url') || 'https://orandus.in';
    const format = url.searchParams.get('format') || 'svg'; // 'svg' | 'png'
    const colorDark = url.searchParams.get('dark') || '#FF5200';
    const colorLight = url.searchParams.get('light') || '#FFFFFF';
    const size = Math.min(Math.max(parseInt(url.searchParams.get('size') || '512', 10), 128), 1024);

    if (format === 'svg') {
      const svg = await QRCode.toString(targetUrl, {
        type: 'svg',
        color: {
          dark: colorDark,
          light: colorLight,
        },
        errorCorrectionLevel: 'H',
        margin: 1,
        width: size,
      });

      return new Response(svg, {
        status: 200,
        headers: {
          'Content-Type': 'image/svg+xml',
          'Cache-Control': 'public, max-age=86400',
        },
      });
    } else {
      const buffer = await QRCode.toBuffer(targetUrl, {
        type: 'png',
        color: {
          dark: colorDark,
          light: colorLight,
        },
        errorCorrectionLevel: 'H',
        margin: 1,
        width: size,
      });

      return new Response(buffer, {
        status: 200,
        headers: {
          'Content-Type': 'image/png',
          'Cache-Control': 'public, max-age=86400',
        },
      });
    }
  } catch (error: any) {
    console.error('QR generation error:', error);
    return new Response(JSON.stringify({ error: 'Failed to generate QR' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
