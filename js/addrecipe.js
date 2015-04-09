var app = angular.module('nutrixApp');

app.directive('addrecipe', function($timeout, $log, $http,nutrientList) {
    return {
        restrict: 'E',
        scope: {},
        templateUrl: 'tmpl/addrecipe.html',
        replace: true,
        //controllerAs: 'paginationCtrl',
        controller: function ($scope , $http) {
            $scope.ingredients = [];
            $scope.init = function() {
              $scope.ingredients = [];
              $scope.query = undefined;
              $scope.currentPage = 1;
              $scope.itemsPerPage = 30;
              $scope.totalItems = -1;
            }

            $scope.loadMoreIngredients = function() {
              var myparams = {
                  offset: ($scope.currentPage - 1) * $scope.itemsPerPage,
                  max: $scope.itemsPerPage
              }

              if ($scope.query != undefined && $scope.query != null) {
                myparams['q'] = $scope.query;
              }

              $http.get('http://localhost:7777/nutrix-app/ws/nutrix/adm/ingredient', {
                  params: myparams
                }).then(function(resp) {
                  console.log('Success', resp);
                  $log.debug("Start:" + ($scope.currentPage - 1) * $scope.itemsPerPage);
                  $scope.totalItems = resp.data.total;
                  $log.debug("Total:" + $scope.totalItems);
                  $scope.ingredients = resp.data.collection;
                  console.log($scope.itemsPerPage);
                }, function(err) {
                  console.error('ERR', err);
                });
              };

            $scope.$watch('currentPage + itemsPerPage', function() {
              $scope.loadMoreIngredients();
            });

            $scope.doSearchIngredients = function(q) {
                console.log('doSearchIngredients');
                $scope.init();
                $scope.query = q;
                $scope.loadMoreIngredients();
            };

            $scope.init();
        },

        link: function($scope, element, attrs) {

            $log.debug("addrecipe go to here");
            $scope.getTemplate = function() {
                    return 'display';
                },

            $scope.addIngredient = function() {
                $log.debug("add ingredient");
                $scope.getTemplateIngredient = function() {
                    return 'edit';
                    }
            }
          //
          }
    }
 });

app.run(function(nutrientList, $http, $log) {

    $http.get('http://localhost:7777/nutrix-app/ws/nutrix/adm/nutrient', { 
            params: {
                offset: 0, max: 1000
            }
        })
        .success(function(data) {
            console.log(data);
            nutrientList.setNutrients(data.collection);
        });
});

app.factory('nutrientList', function($log) {
    //$log.debug('factory');
    var nutrients = {};

    return {
        setNutrients: function(_nutrients) {
            for(var i=0; i<_nutrients.length; i++) {
                var _nutrient = _nutrients[i];
                nutrients[_nutrient.id] = _nutrient;
            }
        },
        getNutrients: function() {
            return nutrients;
        },
        getNutrient: function(id) {
            return nutrients[id];
        }
    }
    
});

app.controller('createRecipeCtrl', ['$scope', '$log', '$http', function($scope, $log, $http) {
    $log.debug('go to createRecipe Controller');
    
}]);