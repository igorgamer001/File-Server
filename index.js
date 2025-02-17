const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const mime = require('mime-types');



// Configuration
const PORT = 3000;
const DIRECTORY = path.join(__dirname, 'public'); // Public directory for serving files

// Create an HTTP server
const server = http.createServer((req, res) => {
  // Parse the requested URL
  const parsedUrl = url.parse(req.url);
  const pathname = parsedUrl.pathname;
  const fullPath = path.join(DIRECTORY, pathname === '/' ? '/index.html' : pathname);

  // Check if the file exists
  fs.stat(fullPath, (err, stats) => {
    if (err || !stats.isFile()) {
      // If the file does not exist or is not a file, send a 404 response
      res.statusCode = 404;
      res.setHeader('Content-Type', 'text/html');
      res.end('<h1>404 Not Found</h1>');
      return;
    }

    // Get the MIME type for the file
    const mimeType = mime.lookup(fullPath) || 'application/octet-stream';

    // Set headers and read the file
    res.statusCode = 200;
    res.setHeader('Content-Type', mimeType);
    const fileStream = fs.createReadStream(fullPath);
    
    // Pipe the file content to the response
    fileStream.pipe(res);

    // Handle stream errors
    fileStream.on('error', (streamErr) => {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'text/html');
      res.end('<h1>500 Internal Server Error</h1>');
    });
  });
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
