const fs = require('fs');
const path = require('path');

// HTML files to copy
const htmlFiles = [
  'index.html',
  'quick-countdown.html',
  'tabata.html',
  'interval.html',
  'countdown.html',
  'stopwatch.html',
  'emom.html',
  'custom.html'
];

// Directories to copy
const dirsToCopy = [
  'styles',
  'scripts'
];

const outDir = path.join(__dirname, '..', 'out');
const rootDir = path.join(__dirname, '..');

// Ensure out directory exists
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// Copy HTML files
htmlFiles.forEach(file => {
  const src = path.join(rootDir, file);
  const dest = path.join(outDir, file);
  
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    console.log(`✓ Copied ${file}`);
  } else {
    console.warn(`⚠ File not found: ${file}`);
  }
});

// Copy directories
dirsToCopy.forEach(dir => {
  const srcDir = path.join(rootDir, dir);
  const destDir = path.join(outDir, dir);
  
  if (fs.existsSync(srcDir)) {
    // Create destination directory
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }
    
    // Copy all files in directory (except copy-html-to-out.js)
    const files = fs.readdirSync(srcDir);
    files.forEach(file => {
      if (file === 'copy-html-to-out.js') return; // Skip this script
      
      const src = path.join(srcDir, file);
      const dest = path.join(destDir, file);
      const stat = fs.statSync(src);
      
      if (stat.isFile()) {
        fs.copyFileSync(src, dest);
        console.log(`✓ Copied ${dir}/${file}`);
      }
    });
  } else {
    console.warn(`⚠ Directory not found: ${dir}`);
  }
});

console.log('\n✓ HTML files and assets copied to out directory');
