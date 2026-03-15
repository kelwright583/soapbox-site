// Create PNG icons using sharp library
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const iconsDir = path.join(__dirname, 'assets', 'icons');

// Ensure directory exists
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Color: #1B2943 (ink color)
const color = { r: 27, g: 41, b: 67 };

async function createIcons() {
  const sizes = [
    { name: 'icon-192.png', size: 192 },
    { name: 'icon-512.png', size: 512 },
    { name: 'maskable-192.png', size: 192 },
    { name: 'maskable-512.png', size: 512 }
  ];
  
  for (const icon of sizes) {
    const outputPath = path.join(iconsDir, icon.name);
    
    // Create solid color image
    await sharp({
      create: {
        width: icon.size,
        height: icon.size,
        channels: 3,
        background: { r: color.r, g: color.g, b: color.b }
      }
    })
    .png()
    .toFile(outputPath);
    
    console.log(`Created ${icon.name} (${icon.size}x${icon.size})`);
  }
  
  console.log('\nAll icons created successfully!');
}

createIcons().catch(error => {
  console.error('Error creating icons:', error);
  process.exit(1);
});

