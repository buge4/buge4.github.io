const fs = require('fs');
const path = require('path');

function prepareDeployment() {
  console.log('📦 Preparing deployment files...');
  
  const distPath = './dist';
  const configs = [
    { name: '.htaccess', content: getHtaccessContent() },
    { name: '_redirects', content: getNetlifyRedirects() },
  ];
  
  configs.forEach(config => {
    const filePath = path.join(distPath, config.name);
    fs.writeFileSync(filePath, config.content);
    console.log(`✅ Created ${config.name}`);
  });
  
  console.log('✅ Deployment preparation complete');
}

function getHtaccessContent() {
  return `# Enhanced SPA routing for GitHub Pages and custom domains
RewriteEngine On
RewriteBase /

# Handle Angular, React, Vue.js and other SPA frameworks
RewriteRule ^index\\.html$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]

# Security headers
<IfModule mod_headers.c>
    Header always set X-Content-Type-Options nosniff
    Header always set X-Frame-Options DENY
    Header always set X-XSS-Protection "1; mode=block"
    Header always set Referrer-Policy "strict-origin-when-cross-origin"
</IfModule>

# Cache static assets
<IfModule mod_expires.c>
    ExpiresActive on
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/gif "access plus 1 year"
    ExpiresByType image/svg+xml "access plus 1 year"
</IfModule>`;
}

function getNetlifyRedirects() {
  return `# Netlify redirects for SPA
/*    /index.html   200`;
}

prepareDeployment();