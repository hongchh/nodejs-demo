var http = require('http');

http.createServer((req, res) => {
  res.writeHead(200, {'ContentType': 'text:plain'});
  res.end('hello world');
}).listen(3000);

console.log('[Server Info] Start server at http://localhost:3000/');
