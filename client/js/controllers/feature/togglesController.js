
featureToggleFrontend.controller('TogglesController', ['$scope', '$timeout', 'toggleService', 'applicationService', 'focus', 'ENV', '$rootScope', function($scope, $timeout, toggleService, applicationService, focus, ENV, $rootScope) {

    $scope.adding = false;
    $scope.newToggleName = '';
    $scope.setAddingToggleState = function(state){
        $scope.adding = state;
        if (state){
            $scope.newToggleName = $scope.toggleSuggestions[0];
            focus('newToggleName');
        }
    };

    $scope.updateThisToggle = function(toggle){
        $timeout(function(){
            toggleService.updateFeatureToggle($scope.applicationName, $scope.featureName,
                $scope.isMultiToggle, toggle.name, toggle.value,
                function(){
                    $rootScope.$broadcast('toggleUpdated', toggle, $scope.isMultiToggle);
                },
                function(data){
                    $scope.$emit('error', "Failed to update toggle", new Error(data));
                });
        });
    };

    var validateNewToggle = function(toggleName){
        if (!toggleName){
            return "Must enter an toggle name";
        }
        if (!_.contains($scope.toggleSuggestions, toggleName)){
            return "Not a valid toggle name. Please use the autocomplete box to get valid values.";
        }
        if (_.any($scope.toggles, function(toggle){ return toggle.name === toggleName;})){
            return "Toggle name must be unique in this application";
        }
    };

    var addFakeToggle = function(toggleName){
        $scope.toggles.push({
            name: toggleName,
            value: false
        });
        $scope.toggleSuggestions = _.without($scope.toggleSuggestions, toggleName);
    };

    $scope.addToggle = function() {
        var applicationName = $scope.applicationName;
        var featureName = $scope.featureName;
        var toggleName = $scope.newToggleName.trim();

        var validationError = validateNewToggle(toggleName);
        if (validationError){
            $scope.$emit('error', validationError);
            return;
        }

        toggleService.addFeatureToggle(applicationName, featureName, toggleName,
            function(){
                addFakeToggle(toggleName);
                $scope.setAddingToggleState(false);
                $scope.$emit('success', toggleName + " was successfully added");
            },
            function(data){
                $scope.$emit('error', "Failed to add feature", new Error(data));
            });
    };

    var addGithubSearchDataToToggles = function(feature, metaData){
        var githubRepoUrl = metaData.githubRepoUrl;
        if (githubRepoUrl){
            _.each($scope.toggles, function(toggle){
                var searchPhrase = feature.isMultiToggle ? $scope.featureName + '+AND+' + toggle.name : $scope.featureName;
                toggle.githubSearchUrl = githubRepoUrl + '/search?utf8=✓&type=Code&q=' + searchPhrase + '+AND+getOrDefault';
            });
        }
    };

    (function loadFeatureToggles() {
        $scope.toggles = [];
        $scope.loadingToggles = true;
        $scope.isMultiToggle = false;

        toggleService.getFeature($scope.applicationName, $scope.featureName,
            function(feature){
                $scope.toggles = feature.toggles;
                $scope.isMultiToggle = feature.isMultiToggle;
                $scope.toggleSuggestions = feature.toggleSuggestions;
                $scope.loadingToggles = false;

                applicationService.getApplicationMetaData($scope.applicationName, function(err, metaData){
                    if (err){
                        return $scope.$emit('error', "Failed to get Github search data for these toggles", new Error(err));
                    }
                    addGithubSearchDataToToggles(feature, metaData);
                });
            },
            function(data){
                $scope.$emit('error', "Failed to load this feature toggle", new Error(data));
                $scope.loadingToggles = false;
            });
    })();

}]);
