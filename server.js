var http = require('http');
var url = require('url');
var api = require('./route/api');
var static = require('./route/static');

// 匹配静态文件夹路径的正则表达式，用于判定请求是否为静态文件请求
var staticExp = /\/public\/(img|css|js)\/[a-z]*\.(jpg|png|gif|css|js)/;

http.createServer((req, res) => {
  var pathname = url.parse(req.url).pathname;
  if (staticExp.test(pathname)) {// 静态文件请求交由static处理
    static.get(__dirname + pathname, res);
  } else if (req.method == 'POST') {// 处理普通post请求
    api.post(req, res);
  } else {// 处理普通get请求
    api.get(req, res);
  }
}).listen(3000);

console.log('[Server Info] Start server at http://localhost:3000/');
