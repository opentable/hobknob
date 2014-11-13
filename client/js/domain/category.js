angular.module('featureToggleFrontend').factory('Category', function() {
  'use strict';

  return (function(){

    function Category(categoryId){
        this.categoryId = categoryId;
    }

    Category.prototype.isSimple = function(){
        return this.categoryId === 0;
    };

    return Category;
  })();

});
