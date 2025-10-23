const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 9000;

// Serve static files from dist with proper caching
app.use(express.static(path.join(__dirname, 'dist'), {
  maxAge: '1y',
  etag: true,
  lastModified: true,
}));

// Handle React routing - return all requests to index.html
// This must come after static file serving
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(port, '0.0.0.0', () => {
  console.log(`SPA Server running on http://localhost:${port}`);
  console.log(`Serving files from: ${path.join(__dirname, 'dist')}`);
  console.log(`All routes will fallback to index.html for SPA routing`);
});