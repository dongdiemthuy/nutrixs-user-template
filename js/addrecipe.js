var app = angular.module('nutrixApp', []);

app.directive('addrecipe', function($timeout, $log) {
    return {
        restrict: 'E',
        scope: { name:  '=', value: '=' },
        templateUrl: 'tmpl/addrecipe.html',
        replace: true,
        link: function($scope, element, attrs) {
            $log.debug("addrecipe go to here");
            $scope.getTemplate = function () {
                // if (addrecipe.id === $scope.selected.id) return 'edit';
                //     else return 'display';
                return 'display';
            }
        }
    }
});

app.controller('createRecipeCtrl', ['$scope', function($scope) {
	


    }]);