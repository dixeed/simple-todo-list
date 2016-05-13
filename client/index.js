'use strict';

// Declare app level module which depends on views, and components.
var app = angular.module('todoList', [
    'ngMaterial',
    'ngRoute',
    'ngAnimate',
    'ngResource',
    'ui.router',
    'todolist.note'
]);

app.run(Startup)
   .config(Router);

Startup.$inject = [ '$rootScope', '$state', '$stateParams' ];
Router.$inject = [ '$stateProvider', '$urlRouterProvider' ];

function Startup($rootScope, $state, $stateParams) {
    // Set the $state and $stateParams to be globally accessible on the application.
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
}

function Router($stateProvider, $urlRouterProvider) {
    // Redirect on a 'not found' page when no urls are matched.
    $urlRouterProvider.otherwise('/not-found');

    // Base states already defined.
    $stateProvider
        .state('home', {
            url: '/',
            templateUrl: 'views/home/index.html'
        })
        .state('list', {
            url: '/list',
            templateUrl: 'views/notes-list/index.html',
            controller: 'notesListCtrl',
            controllerAs: '$ctrl',
            scope: {},
            bindToController: {

            }
        })
        .state('notFound', {
            url: '/not-found',
            templateUrl: 'views/errors/404.html'
        });
}