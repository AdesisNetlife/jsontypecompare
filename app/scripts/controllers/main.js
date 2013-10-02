/*global angular*/
(function (angular) {
    'use strict';

    angular.module('JsontypecompareApp').controller('MainCtrl', function ($scope, ComparatorSrv) {
        $scope.compare = function () {
            var o1 = JSON.parse($scope.leftValue),
                o2 = JSON.parse($scope.rightValue);
            $scope.comparison = ComparatorSrv.compare(o1, o2);
        };
    });

}(angular));