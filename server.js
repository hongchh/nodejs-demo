var http = require('http');
var url = require('url');
var api = require('./route/api');
var static = require('./route/static');

var staticExp = /\/public\/(img|css|js)\/[a-z]*\.(jpg|png|gif|css|js)/;

http.createServer((req, res) => {
  var pathname = url.parse(req.url).pathname;
  if (staticExp.test(pathname)) {
    static.get(__dirname + pathname, res);
  } else if (req.method == 'POST') {
    api.post(req, res);
  } else {
    api.get(req, res);
  }
}).listen(3000);

console.log('[Server Info] Start server at http://localhost:3000/');
