const fs = require('fs');
const path = require('path');

console.log('\n🧹 Initiating post-execution cleanup...');

// Define the target directories
const targets = ['test-results', 'allure-results', 'playwright-report'];

targets.forEach((dirName) => {
  const dirPath = path.join(process.cwd(), dirName);

  if (fs.existsSync(dirPath)) {
    try {
      // Recursively deletes the directory
      fs.rmSync(dirPath, { recursive: true, force: true });
      console.log(`   ✅ Successfully removed: ${dirName}`);
    } catch (error) {
      console.error(`   ❌ Failed to remove ${dirName}:`, error);
    }
  } else {
    console.log(`   ℹ️  Directory not found (already clean): ${dirName}`);
  }
});

console.log('=============================================\n');
