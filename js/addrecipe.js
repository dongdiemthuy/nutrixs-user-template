var app = angular.module('nutrixApp');

app.directive('addrecipe', function($timeout, $log, $http,nutrientList) {
  return {
    restrict: 'E',
    scope: {},
    templateUrl: 'tmpl/addrecipe.html',
    replace: true,
    controller: function ($scope , $http) {
      // display mode
      $scope.displayMode = null;

      // init the data model: recipe, materialItem, value materialItem
      $scope.recipe = {};
      $scope.recipe.materials = [];
      $scope.materialItem = {};
      //$scope.recipe.values = [];

      // init ingredients list
      $scope.ingredients = [];

      // @Deprecated
      $scope.selectedIngredient = {};
        
      $scope.init = function() {
        $scope.ingredients = [];
        $scope.query = undefined;
        $scope.currentPage = 1;
        $scope.itemsPerPage = 15;
        $scope.totalItems = -1;
        $scope.bigTotalItems = -1;
        $scope.bigCurrentPage = 1;
        $scope.maxSize = 7;
      }

      $scope.loadMoreIngredients = function() {
        var myparams = {
            offset: ($scope.bigCurrentPage - 1) * $scope.itemsPerPage,
            max: $scope.itemsPerPage
        }

        if ($scope.query != undefined && $scope.query != null) {
          myparams['q'] = $scope.query;
        }

        $http.get('http://localhost:7777/nutrix-app/ws/nutrix/adm/ingredient', {
          params: myparams
        }).then(function(resp) {
          console.log('Success', resp);
          $log.debug("Start:" + ($scope.bigCurrentPage - 1) * $scope.itemsPerPage);
          $scope.bigTotalItems = resp.data.total;
          $log.debug("Total:" + $scope.bigTotalItems);
          $scope.ingredients = resp.data.collection;
          console.log($scope.itemsPerPage);
        }, function(err) {
          console.error('ERR', err);
        });
      };

      $scope.$watch('bigCurrentPage + itemsPerPage', function() {
        $scope.loadMoreIngredients();
      });

      $scope.onClickIngredient = function(ingredient) {
        $log.debug(ingredient.label);
        $scope.materialItem.id = ingredient.id;
        $scope.materialItem.label = ingredient.label;
      }
        
      $scope.doSearchIngredients = function(q) {
          console.log('doSearchIngredients');
          $scope.init();
          $scope.query = q;
          $scope.loadMoreIngredients();
      };

      $scope.openMaterialForm = function() {
        $log.debug("add ingredient");
        $scope.materialItem = {
          label: "(choose one ingredient, please!)"
        };
        $scope.displayMode = 'edit';
      };
      
      $scope.hideMaterialForm = function() {
	     $scope.displayMode = null;
      }

      $scope.addMaterial = function(material) {
        $scope.recipe.materials.push(material);
        $scope.materialItem = {};
      }

      $scope.deleteMaterial = function(material) {
        $scope.recipe.materials.splice($scope.recipe.materials.indexOf(material), 1);
      }

      $scope.init();

      $scope.submitData = function(ingredient) {
        $http.post('http://localhost:7777/nutrix-app/ws/nutrix/adm/ingredient', ingredient)
        .success(function(data) {
          $scope.ingredients.push(data);
          $scope.ingredients.label = '';
        });
      };

      $scope.consoleLogModel = function() {
        $log.debug("---------------------------------");
        $log.debug("Recipe object:");
        $log.debug($scope.recipe);
        $log.debug("Material object:");
        $log.debug($scope.materialItem);
      }
    },

    link: function($scope, element, attrs) {
      $log.debug("addrecipe go to here");
      $scope.getTemplate = function() {
        return 'display';
      };

      $scope.isMaterialFormVisibled = function() {
        return $scope.displayMode == 'edit';
      };
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


     
