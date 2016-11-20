angular.module('featureToggleFrontend').factory('Category', function () {
  return (() => { // eslint-disable-line wrap-iife
    function Category(categoryId) {
      this.categoryId = categoryId;
    }

    Category.prototype.isSimple = () => this.categoryId === 0;

    return Category;
  })();
});
