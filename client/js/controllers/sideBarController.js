featureToggleFrontend.controller('SideBarController', ['$scope', 'applicationService', 'authorisationService', '$location', 'focus', 'CurrentUser', function ($scope, applicationService, authorisationService, $location, focus, CurrentUser) {
  $scope.applications = [];
  $scope.newApplicationName = '';
  $scope.adding = false;
  $scope.CurrentUser = CurrentUser;

  const loadApplications = () => {
    applicationService.getApplications(
      (data) => {
        $scope.applications = data;
      },
      (data) => {
        $scope.$emit('error', 'Failed to load applications', new Error(data));
      });
  };

  $scope.setAddingApplicationState = (state) => {
    $scope.adding = state;
    if (state) {
      focus('newApplicationName');
    } else {
      $scope.newApplicationName = '';
    }
  };

  const validateNewApplication = (applicationName) => {
    if (!applicationName) {
      return 'Must enter an application name';
    }
    if (_.any($scope.applications, application => application.toLowerCase() === applicationName.toLowerCase())) {
      return 'Application already exists';
    }
    if (!/^[a-z0-9-_.]+$/i.test(applicationName)) {
      return 'Application name must be alphanumeric with no spaces';
    }

    return null;
  };

  $scope.addApplication = () => {
    const applicationName = $scope.newApplicationName;

    const validationError = validateNewApplication(applicationName);
    if (validationError) {
      $scope.$emit('error', validationError);
      return;
    }

    applicationService.addApplication(applicationName,
      (status) => {
        if (status === 201) { // created
          $scope.applications.push(applicationName);
          $location.path(`/applications/${applicationName}`);
        }
        $scope.setAddingApplicationState(false);
      },
      (data) => {
        $scope.$emit('error', 'Failed to add application', new Error(data));
      });
  };


  $scope.isActive = function (applicationName) {
    const appUrlPart = `/applications/${applicationName}`;
    return $location.path() === appUrlPart || $location.path().indexOf(`${appUrlPart}/`) > -1;
  };

  $scope.$on('$locationChangeSuccess', () => {
    loadApplications();
  });

  loadApplications();
}]);
