(function() {
  'use strict';

  window.onload = function() {
    var foodCards = document.getElementsByClassName('food-card');
    for (var i = 0; i < foodCards.length; ++i) {
      foodCards[i].onclick = goToDetail;
    }
  };

  function goToDetail() {
    window.location = '/detail?id=' + this.id;
  }
})();