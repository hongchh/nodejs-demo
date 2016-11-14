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
    for (food in data.foods) {
      if (food.id == id) return food;
    }
  }

  return foods;
};
