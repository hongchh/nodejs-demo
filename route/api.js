var fs = require('fs');
var url = require('url');
var querystring = require('querystring');
var foods = require('../model/foods')();
var detail = require('../model/detail')();

var getHandler = {};
var postHandler = {};

getHandler['/'] = function(req, res) {
  var foodMenu = "";
  var food = foods.getAllFoods();
  for (var i = 0; i < food.length; ++i) {
      foodMenu += '<div class="food-card" id="' + food[i].id + '"><img src="';
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

getHandler['/detail'] = function(req, res) {
  var query = querystring.parse(url.parse(req.url).query);
  var foodDetail = detail.getDetail(query.id);
  res.writeHead(200, {"Content-Type": "text/html"});
  fs.readFile(__dirname + '/../views/detail.html', (err, data) => {
    res.end(data.toString().replace('{{image}}', foodDetail.image)
      .replace('{{name}}', foodDetail.name)
      .replace('{{description}}', foodDetail.description)
      .replace('{{price}}', foodDetail.price));
  });
};

getHandler['/404'] = function(req, res) {
  res.writeHead(404, {"Content-Type": "text/plain"});
  res.end("404 Not Found");
};

postHandler['/'] = function(res, data) {
  // do something
};

function get(req, res) {
  if (typeof getHandler[req.url] === "function") {
    getHandler[req.url](req, res);
  } else {
    getHandler["/404"](req, res);
  }
}

function post(req, res) {
  if (typeof postHandler[req.url] === "function") {
    var postData = "";
    req.on('data', (data) => {
      postData += data;
    });
    req.on('end', () => {
      postData = querystring.parse(postData);
      postHandler[req.url](res, postData);
    });
  } else {
    getHandler["/404"](req, res);
  }
}

module.exports = {
  get: get,
  post: post
};
