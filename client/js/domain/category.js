'use strict';

angular.module('featureToggleFrontend').factory('Category', function () {
    return (function () {
        function Category(categoryId) {
            this.categoryId = categoryId;
        }

        Category.prototype.isSimple = function () {
            return this.categoryId === 0;
        };

        return Category;
    })();
});
