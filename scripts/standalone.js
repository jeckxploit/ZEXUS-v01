const fs = require('fs');
const path = require('path');

const nextStandalone = path.join(__dirname, '..', '.next', 'standalone');
const nextStatic = path.join(__dirname, '..', '.next', 'static');
const publicDir = path.join(__dirname, '..', 'public');

// Copy .next/static to .next/standalone/.next/
const standaloneStatic = path.join(nextStandalone, '.next', 'static');
if (!fs.existsSync(standaloneStatic)) {
  fs.mkdirSync(standaloneStatic, { recursive: true });
}

fs.cpSync(nextStatic, standaloneStatic, { recursive: true, force: true });
console.log('✓ Copied static files to standalone');

// Copy public to .next/standalone/public
const standalonePublic = path.join(nextStandalone, 'public');
if (!fs.existsSync(standalonePublic)) {
  fs.mkdirSync(standalonePublic, { recursive: true });
}

fs.cpSync(publicDir, standalonePublic, { recursive: true, force: true });
console.log('✓ Copied public files to standalone');

console.log('\n✅ Standalone build ready!\n');
