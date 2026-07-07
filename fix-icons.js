const fs = require('fs');
const path = require('path');

function replaceInFiles(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      replaceInFiles(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let updated = content
        .replace(/CheckCircle2/g, 'CircleCheck')
        .replace(/AlertCircle/g, 'CircleAlert')
        .replace(/AlertTriangle/g, 'TriangleAlert');
        
      if (content !== updated) {
        fs.writeFileSync(fullPath, updated, 'utf8');
        console.log(`Updated icons in: ${fullPath}`);
      }
    }
  }
}

console.log('Starting icon replacement...');
replaceInFiles('./src');
console.log('Icon replacement complete.');
