var app = angular.module('nutrixApp', []);
app.directive('addrecipe', function($timeout, $log, $http,nutrientList) {
    return {
        restrict: 'E',
        scope: {nameIngredient: "=", nameNutrient: "=", nameingredientMeta:"="},
        templateUrl: 'tmpl/addrecipe.html',
        replace: true,
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
            },
            $scope.ingredients = [];
            $scope.ingredientMeta = {};
            $scope.init = function() {

                $scope.ingredients = [];
                $scope.ingredientMeta['total'] = -1;
                $scope.ingredientMeta['start'] = 0;
                $scope.ingredientMeta['limit'] = 30;
                $scope.ingredientMeta['range'] = 50;
                delete $scope.ingredientMeta['query'];
            },

            $scope.moreDataCanBeLoaded = function() {
                $log.debug("more data can be loaded");
                if (($scope.ingredientMeta['total'] == -1) || 
                    ($scope.ingredientMeta['start'] < $scope.ingredientMeta['total'])) {
                  return true;
                }
                return false;
            },

            $scope.loadMoreIngredients = function() {
                
                var myparams = {
                    offset: $scope.ingredientMeta['start'],
                    max: $scope.ingredientMeta['limit']
                }

                if ($scope.ingredientMeta['query'] != undefined && $scope.ingredientMeta['query'] != null) {
                  myparams['q'] = $scope.ingredientMeta['query'];
                }

                $http.get('http://localhost:7777/nutrix-app/ws/nutrix/adm/ingredient', {
                    params: myparams
                  }).then(function(resp) {
                    $log.debug("load more ingredient 3333");
                      console.log('Success', resp);
                      $log.debug("Start:" + $scope.ingredientMeta['start']);
                      $scope.ingredientMeta['total'] = resp.data.total;
                      $log.debug("Total:" + $scope.ingredientMeta['total']);
                      $scope.ingredients = $scope.ingredients.concat(resp.data.collection);
                      $scope.ingredientMeta['start'] += resp.data.collection.length;
                      $log.debug("Start:" + $scope.ingredientMeta['start']);
                      $scope.$broadcast('scroll.infiniteScrollComplete');
                    }, function(err) {
                      console.error('ERR', err);
                    });
                };
            $scope.$on('$stateChangeSuccess', function() {
                $scope.loadMoreIngredients();
            }),

            $scope.doSearchIngredients = function(q) {

              console.log('doSearchIngredients');
              $scope.init();
              $scope.ingredientMeta['query'] = q;
              $scope.loadMoreIngredients();
            },

            $scope.init()
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

app.controller('createRecipeCtrl', ['$scope', '$log', function($scope, $log) {
    $log.debug('go to createRecipe Controller');
    $scope.ingredients = [];
    $scope.ingredientMeta = {};

  
  
}]);

