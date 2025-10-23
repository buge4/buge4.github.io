const express = require('express');
const path = require('path');
const app = express();
const port = 9000;

// Serve static files from dist
app.use(express.static(path.join(__dirname, 'dist')));

// Handle React routing - return all requests to index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on http://localhost:${port}`);
});