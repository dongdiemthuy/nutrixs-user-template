angular.module('nutrixApp')

.controller('viewIngredientCtrl', function($scope, $http, $stateParams, $state, nutrientList) {

    var id = $stateParams.id;

    $scope.ingredients = [];
    $scope.nutrients   = [];

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


.controller('homeCtrl', function($scope, $http, $stateParams, $state, nutrientList, $log) {

  $scope.ingredients = [];
  $scope.ingredientMeta = {};
   
  $scope.init = function() {
    $scope.ingredients = [];
    $scope.ingredientMeta['total'] = -1;
    $scope.ingredientMeta['start'] = 0;
    $scope.ingredientMeta['limit'] = 30;
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
  });

  $scope.doSearchIngredients = function(q) {
      console.log('doSearchIngredients');
      $scope.init();
      $scope.ingredientMeta['query'] = q;
      $scope.loadMoreIngredients();
  };

  $scope.init();

  $scope.compareIngredient = function(){
    console.log('dddd');
        $state.go('compareingredient');
    }
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
})
.controller('compareIngredientCtrl', function($scope, $http, $stateParams, $state, nutrientList){

    
  
})
.controller('listRecipeCtrl', function($scope, $http, $stateParams, $state, nutrientList) {

    //button createRecipe: goto viewdetailcreateRecipe
    //list many recipe(ng-repeat list recipe) when click + go to detailRecipe with id of recipe
})

.controller('createRecipeCtrl', function($scope, $http, $stateParams, $state, nutrientList) {

    //recipe name
    //preparation: mo ta cach thuc hien
    //cancel
    //button save analyze: luu va phan tich ra dinh duong cua tat ca cac ingredient nguoi dung chon
    //Add ingredient: giong trang home, list ra cac mon an, nhan button + de add ingredient va hien thi len 
    // INGREDIENT o trang moi (viewRecipe), idIngredient

})

.controller('viewRecipeCtrl', function($scope, $http, $stateParams, $state, nutrientList) {

  // Ingredient hien thi list khi nguoi dung chon
  // combobox Qty and gram tren 1 mon
   
})

.controller('addIngredientCtrl', function($scope, $http, $stateParams, $state, nutrientList, $log) {

  $scope.ingredients = [];
  $scope.ingredientMeta = {};
 
  $scope.init = function() {
    $scope.ingredients = [];
    $scope.ingredientMeta['total'] = -1;
    $scope.ingredientMeta['start'] = 0;
    $scope.ingredientMeta['limit'] = 30;
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
  });

  $scope.doSearchIngredients = function(q) {
      console.log('doSearchIngredients');
      $scope.init();
      $scope.ingredientMeta['query'] = q;
      $scope.loadMoreIngredients();
  };

  $scope.init();

})


