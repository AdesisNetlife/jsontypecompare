/*global angular*/
(function (angular) {
    'use strict';

    angular.module('JsontypecompareApp').controller('MainCtrl', function ($scope, ComparatorSrv) {
        var o1, o2;
        $scope.pretty = true;
        $scope.validDocuments = false;
        $scope.validLeftDocument = false;
        $scope.validRightDocument = false;

        $scope.prettifyLeft = function () {
            if ($scope.pretty && o1) {
                $scope.leftValue = JSON.stringify(o1, true, "  ");
            }
        };

        $scope.prettifyRight = function () {
            if ($scope.pretty && o1) {
                $scope.leftValue = JSON.stringify(o1, true, "  ");
            }
        };

        $scope.$watch("leftValue", function (newValue) {
            o1 = null;
            $scope.validLeftDocument = false;
            if (newValue) {
                try {
                    o1 = JSON.parse(newValue);
                    $scope.validLeftDocument = true;
                } catch (ex) {
                    $scope.validLeftDocument = false;
                }
                $scope.validDocuments = $scope.validLeftDocument && $scope.validRightDocument;
            }
        });
        $scope.$watch("rightValue", function (newValue) {
            $scope.validRightDocument = false;
            if (newValue) {
                try {
                    o2 = JSON.parse(newValue);
                    $scope.validRightDocument = true;
                } catch (ex) {
                    $scope.validRightDocument = false;
                }
                $scope.validDocuments = $scope.validLeftDocument && $scope.validRightDocument;
            }
        });
        $scope.compare = function () {
            $scope.comparison = ComparatorSrv.compare(o1, o2);
        };
    });

}(angular));