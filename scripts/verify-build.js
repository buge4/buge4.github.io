const fs = require('fs');
const path = require('path');

function verifyBuild() {
  const distPath = './dist';
  const requiredFiles = ['index.html', '404.html', '.nojekyll'];
  const assetPath = './dist/assets';
  
  console.log('🔍 Verifying build...');
  
  // Check required files
  requiredFiles.forEach(file => {
    const filePath = path.join(distPath, file);
    if (fs.existsSync(filePath)) {
      console.log(`✅ ${file} exists`);
    } else {
      console.log(`❌ ${file} missing`);
      process.exit(1);
    }
  });
  
  // Check assets directory
  if (fs.existsSync(assetPath)) {
    const assets = fs.readdirSync(assetPath);
    console.log(`✅ Assets directory contains ${assets.length} files`);
    assets.forEach(asset => {
      console.log(`  - ${asset}`);
    });
  } else {
    console.log('❌ Assets directory missing');
    process.exit(1);
  }
  
  // Verify 404.html content
  const fourOhFourPath = path.join(distPath, '404.html');
  const fourOhFourContent = fs.readFileSync(fourOhFourPath, 'utf8');
  
  if (fourOhFourContent.includes('redirect')) {
    console.log('✅ 404.html contains SPA redirect logic');
  } else {
    console.log('❌ 404.html missing SPA redirect logic');
    process.exit(1);
  }
  
  console.log('✅ Build verification passed!');
}

verifyBuild();