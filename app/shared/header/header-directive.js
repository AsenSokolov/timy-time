(function () {

    angular
        .module('meanApp')
        .directive('navigation', navigation);

    function navigation () {
        return {
            restrict: 'EA',
            templateUrl: '/shared/header/header-view.html',
            controller: 'navigationCtrl as navvm'
        };
    }

})();