import http from 'http';
import fs from 'fs';
import path from 'path';

const port = process.env.PORT || 5000;
const root = path.join(process.cwd(), 'dist', 'client');

const mime = {
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.html': 'text/html',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
};

const server = http.createServer((req, res) => {
  let urlPath = req.url.split('?')[0];
  if (urlPath === '/') urlPath = '/index.html';
  const filePath = path.join(root, urlPath);
  fs.readFile(filePath, (err, data) => {
    if (err) {
      // fallback to index.html for SPA routing
      fs.readFile(path.join(root, 'index.html'), (err2, indexData) => {
        if (err2) {
          res.statusCode = 500;
          res.end('Server error');
          return;
        }
        res.setHeader('Content-Type', 'text/html');
        res.end(indexData);
      });
      return;
    }
    const ext = path.extname(filePath);
    res.setHeader('Content-Type', mime[ext] || 'application/octet-stream');
    res.end(data);
  });
});

server.listen(port, () => {
  console.log(`Static server running at http://localhost:${port}`);
});
