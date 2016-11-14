var fs = require('fs');

module.exports = function() {
  var data = JSON.parse(fs.readFileSync(__dirname + '/../data/detail.json'));
  var foods = {
    getDetail: getDetail
  };

  function getDetail(id) {
    for (var i = 0; i < data.detail.length; ++i) {
      if (data.detail[i].id == id)
        return data.detail[i];
    }
  }

  return foods;
};
