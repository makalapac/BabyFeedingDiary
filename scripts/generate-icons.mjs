import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const iconPath = join(__dirname, '../public/icon.svg');
const outputDir = join(__dirname, '../public/icons');

// Create output directory if it doesn't exist
if (!existsSync(outputDir)) {
  mkdirSync(outputDir, { recursive: true });
}

// Generate icons for each size
Promise.all(sizes.map(size => {
  return sharp(iconPath)
    .resize(size, size)
    .png()
    .toFile(join(outputDir, `icon-${size}x${size}.png`))
    .then(() => console.log(`Generated ${size}x${size} icon`))
    .catch(err => console.error(`Error generating ${size}x${size} icon:`, err));
}))
.then(() => console.log('All icons generated successfully!'))
.catch(err => {
  console.error('Error generating icons:', err);
  process.exit(1);
}); 