const fs = require('fs');
const path = require('path');

// Path to version.json
const versionPath = path.join(__dirname, '..', 'public', 'version.json');

// Read current version
let versionData = { version: '1.1', buildTime: '', buildDate: '' };
if (fs.existsSync(versionPath)) {
  try {
    versionData = JSON.parse(fs.readFileSync(versionPath, 'utf8'));
  } catch (e) {
    console.warn('Could not read version.json, starting fresh');
  }
}

// Increment version by 0.01
const currentVersion = parseFloat(versionData.version || '1.1');
const newVersion = (currentVersion + 0.01).toFixed(2);

// Get current date and time
const now = new Date();
const buildTime = now.toISOString();
const buildDate = now.toLocaleString('en-US', {
  timeZone: 'America/Los_Angeles',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: true
});

// Update version data
const updatedData = {
  version: newVersion,
  buildTime: buildTime,
  buildDate: buildDate
};

// Write to version.json
fs.writeFileSync(versionPath, JSON.stringify(updatedData, null, 2), 'utf8');

console.log(`✓ Version updated to ${newVersion}`);
console.log(`✓ Build time: ${buildDate}`);
