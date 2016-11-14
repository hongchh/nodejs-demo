var fs = require('fs');

var handler = {};

handler['/'] = function(req, res) {
  var foodMenu = "";
  for (food in foods.getAllFoods()) {
      foodMenu += '<div class="food-card"><img src="';
      foodMenu += food.image + '"><h1>' + food.name + '</h1><h2>' + food.price + '</h2></div>';
  }

  res.writeHead(200, {"Content-Type": "text/html"});
  fs.readFile(__dirname + '/../views/index', (err, data) => {
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
  if (typeof handler[url] === "function") {
    handler[url](req, res);
  } else {
    handler["/404"](req, res);
  }
}

module.exports = {
  get: get
};