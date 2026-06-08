const fs = require('fs');
const path = require('path');

const png = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
  'base64',
);

const assetsDir = path.join(__dirname, '..', 'assets');
fs.mkdirSync(assetsDir, { recursive: true });

['icon.png', 'splash-icon.png', 'adaptive-icon.png'].forEach((file) => {
  fs.writeFileSync(path.join(assetsDir, file), png);
});

console.log('Created placeholder assets in assets/');
