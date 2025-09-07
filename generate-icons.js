const fs = require('fs');
const { createCanvas, loadImage } = require('canvas');

// Create a canvas for the icon
const canvas = createCanvas(1024, 1024);
const ctx = canvas.getContext('2d');

// Background gradient
const gradient = ctx.createLinearGradient(0, 0, 1024, 1024);
gradient.addColorStop(0, '#3B82F6');  // Blue
gradient.addColorStop(1, '#1E40AF');  // Darker blue

// Draw background with rounded corners
ctx.fillStyle = gradient;
ctx.fillRect(0, 0, 1024, 1024);

// Add rounded rectangle overlay
ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
ctx.beginPath();
ctx.roundRect(80, 80, 864, 864, 150);
ctx.fill();

// Draw chart bars (representing data visualization)
const barColors = ['#60A5FA', '#34D399', '#FBBF24', '#F87171'];
const barData = [
  { x: 200, height: 300 },
  { x: 350, height: 450 },
  { x: 500, height: 250 },
  { x: 650, height: 380 }
];

barData.forEach((bar, i) => {
  ctx.fillStyle = barColors[i];
  const barWidth = 120;
  const y = 700 - bar.height;
  
  ctx.beginPath();
  ctx.roundRect(bar.x, y, barWidth, bar.height, [15, 15, 0, 0]);
  ctx.fill();
});

// Draw "S" letter
ctx.fillStyle = '#FFFFFF';
ctx.font = 'bold 320px Arial';
ctx.textAlign = 'center';
ctx.textBaseline = 'middle';
ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
ctx.shadowBlur = 20;
ctx.shadowOffsetX = 0;
ctx.shadowOffsetY = 10;
ctx.fillText('S', 512, 320);

// Save as PNG
const buffer = canvas.toBuffer('image/png');
fs.writeFileSync('./icon.png', buffer);

// Create adaptive icon (same but slightly different positioning)
const adaptiveCanvas = createCanvas(1024, 1024);
const adaptiveCtx = adaptiveCanvas.getContext('2d');

// Simpler version for adaptive icon - just the S on transparent background
adaptiveCtx.fillStyle = '#3B82F6';
adaptiveCtx.beginPath();
adaptiveCtx.arc(512, 512, 400, 0, Math.PI * 2);
adaptiveCtx.fill();

adaptiveCtx.fillStyle = '#FFFFFF';
adaptiveCtx.font = 'bold 280px Arial';
adaptiveCtx.textAlign = 'center';
adaptiveCtx.textBaseline = 'middle';
adaptiveCtx.fillText('S', 512, 512);

const adaptiveBuffer = adaptiveCanvas.toBuffer('image/png');
fs.writeFileSync('./adaptive-icon.png', adaptiveBuffer);

console.log('Icons generated successfully!');
