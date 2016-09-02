(function () {

    angular.module('meanApp', ['ngRoute']);

    function config ($routeProvider, $locationProvider) {
        $routeProvider
            .when('/', {
                templateUrl: '/modules/home/home-view.html',
                controller: 'homeCtrl',
                controllerAs: 'vm'
            })
            .when('/register', {
                templateUrl: '/modules/register/register-view.html',
                controller: 'registerCtrl',
                controllerAs: 'vm'
            })
            .when('/login', {
                templateUrl: '/modules/login/login-view.html',
                controller: 'loginCtrl',
                controllerAs: 'vm'
            })
            .when('/profile', {
                templateUrl: '/modules/profile/profile-view.html',
                controller: 'profileCtrl',
                controllerAs: 'vm'
            })
            .otherwise({redirectTo: '/'});

        // use the HTML5 History API
        if (window.history && window.history.pushState) {
            $locationProvider.html5Mode(true);
        }
    }

    function run($rootScope, $location, authentication) {
        $rootScope.$on('$routeChangeStart', function(event, nextRoute, currentRoute) {

            if (authentication.isLoggedIn()) {
                if($location.path() === '/' || $location.path() === '/login' || $location.path() === '/register'){
                    console.log("User Logged and redirected to Profile Page");
                    $location.path('/profile');
                }
            }else if($location.path() === '/profile' && !authentication.isLoggedIn()){
                console.log("User have to be logged in order to access profile page");
                $location.path('/');
            }

        });
    }

    angular
        .module('meanApp')
        .config(['$routeProvider', '$locationProvider', config])
        .run(['$rootScope', '$location', 'authentication', run]);

})();