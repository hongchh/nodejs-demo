var fs = require('fs');
var path = require('path');

var MIME = {};
MIME[".css"] = "text/css";
MIME[".js"] = "text/js";
MIME[".jpg"] = "image/jpeg";
MIME[".jpeg"] = "image/jpeg";
MIME[".png"] = "image/png";
MIME[".gif"] = "image/gif";

function get(pathname, res) {
  if (fs.existsSync(pathname)) {
    var extname = path.extname(pathname);
    res.writeHead(200, {'Content-Type': MIME[extname]});
    fs.readFile(pathname, (err, data) => {
      if (err) {
        console.log(err);
        res.end();
      } else {
        if (isImage(extname)) {
          res.end(data, "binary");
        } else {
          res.end(data.toString());
        }
      }
    });
  }
}

function isImage(extname) {
  if (extname === '.jpg' || extname === '.jpeg' ||
    extname === '.png' || extname === '.gif') {
    return true;
  }
  return false;
}

module.exports = {
  get: get
};