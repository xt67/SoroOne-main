const fs = require('fs');
const { createCanvas, loadImage } = require('canvas');

// Create a canvas for the icon
const canvas = createCanvas(1024, 1024);
const ctx = canvas.getContext('2d');

// Background gradient (white to light gray)
const gradient = ctx.createLinearGradient(0, 0, 1024, 1024);
gradient.addColorStop(0, '#FFFFFF');
gradient.addColorStop(1, '#F8F9FA');

// Draw background
ctx.fillStyle = gradient;
ctx.fillRect(0, 0, 1024, 1024);

// Draw chart container background
ctx.fillStyle = '#FFFFFF';
ctx.strokeStyle = '#E5E7EB';
ctx.lineWidth = 4;
ctx.beginPath();
ctx.roundRect(150, 200, 724, 500, 20);
ctx.fill();
ctx.stroke();

// Draw chart bars
const barData = [
    { x: 220, y: 350, height: 280 },
    { x: 330, y: 280, height: 350 },
    { x: 440, y: 400, height: 230 },
    { x: 550, y: 320, height: 310 },
    { x: 660, y: 250, height: 380 }
];

ctx.fillStyle = '#1F2937';
barData.forEach(bar => {
    ctx.beginPath();
    ctx.roundRect(bar.x, bar.y, 80, bar.height, 8);
    ctx.fill();
});

// Draw trend line
ctx.strokeStyle = '#3B82F6';
ctx.lineWidth = 6;
ctx.lineCap = 'round';
ctx.lineJoin = 'round';
ctx.beginPath();
ctx.moveTo(260, 350);
ctx.lineTo(370, 280);
ctx.lineTo(480, 400);
ctx.lineTo(590, 320);
ctx.lineTo(700, 250);
ctx.stroke();

// Draw trend dots
ctx.fillStyle = '#3B82F6';
const dots = [
    { x: 260, y: 350 },
    { x: 370, y: 280 },
    { x: 480, y: 400 },
    { x: 590, y: 320 },
    { x: 700, y: 250 }
];

dots.forEach(dot => {
    ctx.beginPath();
    ctx.arc(dot.x, dot.y, 8, 0, 2 * Math.PI);
    ctx.fill();
});

// Draw axes
ctx.strokeStyle = '#9CA3AF';
ctx.lineWidth = 2;
// X-axis
ctx.beginPath();
ctx.moveTo(200, 650);
ctx.lineTo(820, 650);
ctx.stroke();
// Y-axis
ctx.beginPath();
ctx.moveTo(200, 230);
ctx.lineTo(200, 650);
ctx.stroke();

// Draw "SoroOne" text
ctx.fillStyle = '#1F2937';
ctx.font = 'bold 120px Arial, sans-serif';
ctx.textAlign = 'center';
ctx.textBaseline = 'middle';

// Add text shadow
ctx.shadowColor = 'rgba(0, 0, 0, 0.15)';
ctx.shadowBlur = 8;
ctx.shadowOffsetX = 0;
ctx.shadowOffsetY = 4;

ctx.fillText('SoroOne', 512, 800);

// Save as PNG
const buffer = canvas.toBuffer('image/png');
fs.writeFileSync('./assets/icon.png', buffer);

// Create adaptive icon (simpler chart version)
const adaptiveCanvas = createCanvas(1024, 1024);
const adaptiveCtx = adaptiveCanvas.getContext('2d');

// White circle background
adaptiveCtx.fillStyle = '#FFFFFF';
adaptiveCtx.beginPath();
adaptiveCtx.arc(512, 512, 400, 0, Math.PI * 2);
adaptiveCtx.fill();

// Simple chart bars
const adaptiveBars = [
    { x: 400, y: 400, height: 150 },
    { x: 450, y: 350, height: 200 },
    { x: 500, y: 450, height: 100 },
    { x: 550, y: 380, height: 170 }
];

adaptiveCtx.fillStyle = '#1F2937';
adaptiveBars.forEach(bar => {
    adaptiveCtx.fillRect(bar.x, bar.y, 30, bar.height);
});

// SoroOne text
adaptiveCtx.fillStyle = '#1F2937';
adaptiveCtx.font = 'bold 80px Arial';
adaptiveCtx.textAlign = 'center';
adaptiveCtx.textBaseline = 'middle';
adaptiveCtx.fillText('SoroOne', 512, 650);

const adaptiveBuffer = adaptiveCanvas.toBuffer('image/png');
fs.writeFileSync('./assets/adaptive-icon.png', adaptiveBuffer);

console.log('SoroOne icons generated successfully!');
