const fs = require('fs');
const path = require('path');

// HTML files to copy
const htmlFiles = [
  'index.html',
  'about.html',
  'subscribe.html',
  'faq.html',
  'countdown-presets.html',
  'preset-countdown.html',
  'hiit-presets.html',
  'interval-presets.html',
  'quick-interval-iphone-shadcn.html',
  'tabata.html',
  'interval.html',
  'main.html',
  'countdown.html',
  'clock.html',
  'stopwatch.html',
  'stopwatch-splits.html',
  'emom.html',
  'emom-splits.html',
  'amrap.html',
  'amrap-splits.html',
  'hiit.html',
  'pyramid.html',
  'custom.html',
  'mobility.html',
  'Component_Demo.html',
  'Sample_Audio_3.html',
  // Timer about / article pages
  'clock-timer-about.html',
  'countdown-timer-about.html',
  'emom-timer-about.html',
  'hiit-timer-about.html',
  'interval-timer-about.html',
  'mobility-timer-about.html',
  'pyramid-timer-about.html',
  'stopwatch-timer-about.html',
  'tabata-timer-about.html'
];

// JSON files to copy from public directory
const jsonFiles = [
  'version.json'
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

// Copy JSON files from public directory
const publicDir = path.join(rootDir, 'public');
jsonFiles.forEach(file => {
  const src = path.join(publicDir, file);
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
