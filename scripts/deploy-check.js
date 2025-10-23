const fs = require('fs');
const path = require('path');

function checkDeploymentReadiness() {
  console.log('🚀 Checking deployment readiness...');
  
  // Check build size
  const distPath = './dist';
  if (fs.existsSync(distPath)) {
    const stats = fs.statSync(distPath);
    console.log(`📁 Build directory size: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);
  }
  
  // Check for common issues
  const indexPath = path.join(distPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    const indexContent = fs.readFileSync(indexPath, 'utf8');
    
    // Check for development URLs
    if (indexContent.includes('localhost') || indexContent.includes('127.0.0.1')) {
      console.log('⚠️  Warning: Development URLs found in build');
    }
    
    // Check for proper asset references
    if (indexContent.includes('/assets/')) {
      console.log('✅ Asset references look correct');
    }
  }
  
  console.log('✅ Deployment readiness check complete');
}

checkDeploymentReadiness();