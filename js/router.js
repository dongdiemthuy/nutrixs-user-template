'use strict';

//Setting up route
angular.module('nutrixApp').config(['$stateProvider', '$urlRouterProvider',

    function($stateProvider, $urlRouterProvider) {

      
        $urlRouterProvider.otherwise('/');

        // states for my app
        $stateProvider

        .state('viewingredient', {
            url: '/viewingredient/:id',
            resolve: {
                ingredientId: function($stateParams) {
                return $stateParams.id;
                },
            },
            controller: 'viewIngredientCtrl',
            templateUrl: 'view/viewingredient.html'
        })

        .state('home', {
            url: '/home',
            controller: 'homeCtrl',
            templateUrl: 'view/home.html'
        })

        .state('compareingredient', {
            url: '/compareingredient/',
            // resolve: {
            //     ingredientId: function($stateParams) {
            //     return $stateParams.id;
            //     },
            // },
            controller: 'compareIngredientCtrl',
            templateUrl: 'view/compare-ingredient.html'
        })


        .state('createRecipe', {
            url: '/createrecipe',
            controller: 'createRecipeCtrl',
            templateUrl: 'view/createrecipe.html'
        })

        // .state('viewRecipe', {
        //     url: '/viewrecipe',
        //     controller: 'viewRecipeCtrl',
        //     templateUrl: 'view/viewrecipe.html'
        // })

        .state('addIngredientRecipe',{
            url:'/addingredient',
            controller: 'addIngredientCtrl',
            templateUrl: 'view/addingredient.html'
        })

    }
]);