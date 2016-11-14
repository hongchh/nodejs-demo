var fs = require('fs');
var querystring = require('querystring');
var foods = require('../model/foods')();

var handler = {};

handler['/'] = function(req, res) {
  var foodMenu = "";
  var food = foods.getAllFoods();
  for (var i = 0; i < food.length; ++i) {
      foodMenu += '<div class="food-card"><img src="';
      foodMenu += food[i].image + '"><h1>' + food[i].name + '</h1><h2>' + food[i].price + '</h2></div>';
  }

  res.writeHead(200, {"Content-Type": "text/html"});
  fs.readFile(__dirname + '/../views/index.html', (err, data) => {
    if (err) {
      console.log(err);
      res.end();
    } else {
      res.end(data.toString().replace('{{foodMenu}}', foodMenu));
    }
  });
};

handler['/404'] = function(req, res) {
  res.writeHead(404, {"Content-Type": "text/plain"});
  res.end("404 Not Found");
};

function get(req, res) {
  if (typeof handler[req.url] === "function") {
    handler[req.url](req, res);
  } else {
    handler["/404"](req, res);
  }
}

function post(req, res) {
  if (typeof handler[req.url] === "function") {
    var postData = "";
    req.on('data', (data) => {
      postData += data;
    });
    req.on('end', () => {
      postData = querystring.parse(postData);
      handler[req.url](req, res);
    });
  } else {
    handler["/404"](req, res);
  }
}

module.exports = {
  get: get,
  post: post
};
