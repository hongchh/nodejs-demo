var fs = require('fs');

module.exports = function() {
  var data = JSON.parse(fs.readFileSync(__dirname + '/../data/foods.json'));
  var foods = {
    getAllFoods: getAllFoods,
    getFood: getFood
  };

  function getAllFoods() {
    return data.foods;
  }

  function getFood(id) {
    for (var i = 0; i < data.foods.length; ++i) {
      if (data.foods[i].id == id)
        return data.foods[i];
    }
  }

  return foods;
};
