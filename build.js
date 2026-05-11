// Copies Ultraviolet's built files into public/uv/ after npm install
const fs = require('fs');
const path = require('path');

const uvDist = path.join(__dirname, 'node_modules', '@titaniumnetwork-dev', 'ultraviolet', 'dist');
const uvPublic = path.join(__dirname, 'public', 'uv');

if (!fs.existsSync(uvPublic)) fs.mkdirSync(uvPublic, { recursive: true });

if (fs.existsSync(uvDist)) {
  for (const file of fs.readdirSync(uvDist)) {
    fs.copyFileSync(path.join(uvDist, file), path.join(uvPublic, file));
  }
  console.log('Ultraviolet files copied to public/uv/');
} else {
  console.warn('Ultraviolet dist not found — skipping copy');
}
