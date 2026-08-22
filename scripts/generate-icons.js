import fs from 'fs';
import path from 'path';

const iconDir = path.resolve('public/icons');
if (!fs.existsSync(iconDir)) {
  fs.mkdirSync(iconDir, { recursive: true });
}

// Simple valid 1x1 base PNG buffer scaled to create solid valid PNG images for PWA manifest
function createMinimalPng(width, height) {
  // SVG vector fallback for PWA standard
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
    <rect width="${width}" height="${height}" rx="${width/5}" fill="#FF6B35"/>
    <text x="50%" y="55%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-weight="bold" font-size="${width*0.45}" fill="#FFFFFF">🍜</text>
  </svg>`;
  return svg;
}

fs.writeFileSync(path.join(iconDir, 'icon-192.svg'), createMinimalPng(192, 192));
fs.writeFileSync(path.join(iconDir, 'icon-512.svg'), createMinimalPng(512, 512));

console.log('PWA SVG icons generated successfully.');
