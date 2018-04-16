(function() {
  'use strict';

  window.onload = function() {
    var foodCards = document.getElementsByClassName('food-card');
    for (var i = 0; i < foodCards.length; ++i) {
      foodCards[i].onclick = goToDetail;
    }
  };

  // 点击跳转到对应的详情页
  function goToDetail() {
    window.location = '/detail?id=' + this.id;
  }
})();