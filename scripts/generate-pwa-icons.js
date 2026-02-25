const fs = require('fs');
const path = require('path');
const { createCanvas } = require('canvas');

const publicDir = path.join(__dirname, '..', 'public', 'icons');

// Create icons directory if it doesn't exist
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Function to create gradient
function createGradient(ctx, width, height) {
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, '#06b6d4');  // cyan
  gradient.addColorStop(0.5, '#8b5cf6'); // purple
  gradient.addColorStop(1, '#ec4899');   // pink
  return gradient;
}

// Function to draw the Z logo
function drawLogo(ctx, x, y, scale) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  
  // Draw Z shape
  ctx.beginPath();
  // Top bar
  ctx.moveTo(6.16, 7.1);
  ctx.lineTo(15.47, 7.1);
  ctx.lineTo(14.17, 8.95);
  ctx.lineTo(13.27, 9.42);
  ctx.lineTo(6.17, 9.42);
  ctx.closePath();
  ctx.fill();
  
  // Diagonal
  ctx.beginPath();
  ctx.moveTo(24.3, 7.1);
  ctx.lineTo(16.86, 7.1);
  ctx.lineTo(13.14, 22.91);
  ctx.lineTo(5.7, 22.91);
  ctx.closePath();
  ctx.fill();
  
  // Bottom bar
  ctx.beginPath();
  ctx.moveTo(14.53, 22.91);
  ctx.lineTo(14.53, 20.58);
  ctx.lineTo(15.84, 20.58);
  ctx.lineTo(16.74, 21.05);
  ctx.lineTo(23.83, 21.05);
  ctx.lineTo(23.83, 22.91);
  ctx.closePath();
  ctx.fill();
  
  ctx.restore();
}

function createIcon(size) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');
  
  const borderRadius = size * 0.125; // 12.5% border radius
  
  // Background
  ctx.fillStyle = '#0a0a0a';
  ctx.beginPath();
  ctx.roundRect(0, 0, size, size, borderRadius);
  ctx.fill();
  
  // Border gradient
  const borderWidth = size * 0.025;
  const borderGradient = createGradient(ctx, size, size);
  ctx.strokeStyle = borderGradient;
  ctx.lineWidth = borderWidth;
  ctx.beginPath();
  ctx.roundRect(borderWidth, borderWidth, size - borderWidth * 2, size - borderWidth * 2, borderRadius - borderWidth);
  ctx.stroke();
  
  // Logo (white)
  ctx.fillStyle = '#ffffff';
  const logoSize = size * 0.55;
  const logoX = (size - logoSize) / 2;
  const logoY = (size - logoSize) / 2;
  const scale = logoSize / 30;
  drawLogo(ctx, logoX, logoY, scale);
  
  // Save
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(path.join(publicDir, `icon-${size}x${size}.png`), buffer);
  console.log(`Created icon-${size}x${size}.png`);
}

// Create icons
createIcon(192);
createIcon(512);

console.log('PWA icons created successfully!');
