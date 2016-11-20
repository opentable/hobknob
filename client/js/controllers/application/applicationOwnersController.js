featureToggleFrontend.controller('ApplicationOwnersController', ['$scope', 'authorisationService', 'focus', ($scope, authorisationService, focus) => {
  $scope.users = [];
  $scope.addingUser = false;
  $scope.newUserEmail = '';
  $scope.loadingUsers = true;

  const loadUsers = () => {
    if (!$scope.requiresAuthentication) return;

    authorisationService.getUsers($scope.applicationName,
      (users) => {
        $scope.users = users;
        $scope.loadingUsers = false;
      },
      (data) => {
        $scope.$emit('error', 'Failed to load application owners', new Error(data));
        $scope.loadingUsers = false;
      });
  };

  $scope.setAddingUserState = (state) => {
    $scope.addingUser = state;
    if (state) {
      focus('newUserEmail');
    } else {
      $scope.newUserEmail = '';
    }
  };

  const validateNewUser = (email) => {
    if (!validator.isEmail(email)) {
      return 'Invalid email address';
    }
    if (_.any($scope.users, existingUser => existingUser === email)) {
      return 'This user is already added to this application';
    }

    return null;
  };

  $scope.grantUser = () => {
    const email = $scope.newUserEmail;

    const validationError = validateNewUser(email);
    if (validationError) {
      $scope.$emit('error', validationError);
      return;
    }

    authorisationService.grant($scope.applicationName, email,
      () => {
        $scope.users.push(email);
        $scope.setAddingUserState(false);
        $scope.$emit('success', `${email} was successfully made an application owner`);
      },
      (data) => {
        $scope.$emit('error', 'Failed to add user to the application owners', new Error(data));
      });
  };

  $scope.revokeUser = (email) => {
    authorisationService.revoke($scope.applicationName, email,
      () => {
        const index = $scope.users.indexOf(email);
        if (index > -1) {
          $scope.users.splice(index, 1);
        }
      },
      (data) => {
        $scope.$emit('error', 'Failed to remove user from the application owners', new Error(data));
      });
  };

  loadUsers();
}]);
