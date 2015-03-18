angular.module('nutrixApp')

.controller('viewIngredientCtrl', function($scope, $http, $stateParams, $state, nutrientList) {

    var id = $stateParams.id;

    $scope.ingredients = [];
    $scope.nutrients = [];

    $scope.viewdetailIngredient = function() {
        $http.get('http://localhost:7777/nutrix-app/ws/nutrix/adm/ingredient/' + id)
            .success(function(data) {
                console.log(data);
                $scope.ingredients = data;
            });
    };
    $scope.getNutrientUnitType = function(id) {
        // console.log(id);
        return nutrientList.getNutrient(id).unitType;
    };

    $scope.viewdetailIngredient();
})

.controller('homeCtrl', function($scope, $http, $stateParams, $state, nutrientList) {
  
    $scope.ingredients = [],
    $scope.currentPage = 1,
    $scope.numPerPage = 20,
    //$scope.maxSize = 5;

  $scope.numPages = function () {
    return Math.ceil($scope.ingredients.length / $scope.numPerPage);
  };
  
  $scope.$watch('currentPage + numPerPage', function() {
    var begin = (($scope.currentPage - 1) * $scope.numPerPage)
        , end = begin + $scope.numPerPage;
        // console.log('ssss');
    $scope.ingredients = $scope.ingredients.slice(begin, end);

  });

  //$scope.ingredients = [];
  $scope.ingredientMeta = {};
  // console.log('ssss');
  $scope.init = function() {
    $scope.ingredients = [];
    $scope.ingredientMeta['total'] = -1;
    $scope.ingredientMeta['start'] = 0;
    $scope.ingredientMeta['limit'] = 100;
    $scope.ingredientMeta['range'] = 50;
    delete $scope.ingredientMeta['query'];
  }

  $scope.moreDataCanBeLoaded = function() {
    if (($scope.ingredientMeta['total'] == -1) || 
        ($scope.ingredientMeta['start'] < $scope.ingredientMeta['total'])) {
      return true;
    }
    return false;
  }

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
          console.log('Success', resp);
          $scope.ingredientMeta['total'] = resp.data.total;
          $scope.ingredients = $scope.ingredients.concat(resp.data.collection);
          $scope.ingredientMeta['start'] += resp.data.collection.length;
          $scope.$broadcast('scroll.infiniteScrollComplete');
        }, function(err) {
          console.error('ERR', err);
        });
  };

  $scope.$on('$stateChangeSuccess', function() {
    $scope.loadMoreIngredients();
  });

  $scope.doSearchIngredients = function(q) {
      console.log('doSearchIngredients');
      $scope.init();
      $scope.ingredientMeta['query'] = q;
      $scope.loadMoreIngredients();
  };

  $scope.init();
})

.factory('nutrientList', function() {
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
})

.run(function(nutrientList, $http) {

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
