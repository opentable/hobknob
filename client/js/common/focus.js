featureToggleFrontend.directive('focusOn', () => (scope, elem, attr) => {
  scope.$on('focusOn', (e, name) => {
    if (name === attr.focusOn) {
      elem[0].focus();
    }
  });
});

featureToggleFrontend.factory('focus', ($rootScope, $timeout) => (name) => {
  $timeout(() => {
    $rootScope.$broadcast('focusOn', name);
  });
});
