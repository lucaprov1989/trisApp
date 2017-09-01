var APP = angular.module('trisApp', ['ngRoute', 'app.config', 'app.proxy', 'AppControllers']);

APP.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
        when('/', {
            controller: 'controllerHome',
            templateUrl: 'pages/home.html',
        }).
        otherwise({
            redirectTo: '/404'
        });

    }
])
