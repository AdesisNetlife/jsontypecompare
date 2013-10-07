/*global angular*/
(function (angular) {
    'use strict';

    angular.module('JsontypecompareApp').controller('MainCtrl', function ($scope, ComparatorSrv, ReporterSrv) {
        var o1, o2;
        $scope.pretty = true;
        $scope.order = true;
        $scope.validDocuments = false;
        $scope.validLeftDocument = false;
        $scope.validRightDocument = false;

        $scope.prettifyLeft = function () {
            if ($scope.pretty && o1) {
                if ($scope.order) {
                    o1 = ReporterSrv.sortProperties(o1);
                }
                $scope.leftValue = JSON.stringify(o1, true, "  ");
            }
        };

        $scope.prettifyRight = function () {
            if ($scope.pretty && o2) {
                if ($scope.order) {
                    o2 = ReporterSrv.sortProperties(o2);
                }
                $scope.rightValue = JSON.stringify(o2, true, "  ");
            }
        };

        function cleanBuggySpaces(value) {
            var space = String.fromCharCode(160),
                regexp = new RegExp(space, 'g');
            return value.replace(regexp, " ");
        }

        $scope.$watch("leftValue", function (newValue) {
            o1 = null;
            $scope.validLeftDocument = false;
            if (newValue) {
                try {
                    o1 = JSON.parse(cleanBuggySpaces(newValue));
                    $scope.validLeftDocument = true;
                } catch (ex) {
                    $scope.validLeftDocument = false;
                }
                $scope.validDocuments = $scope.validLeftDocument && $scope.validRightDocument;
            }
        });
        $scope.$watch("rightValue", function (newValue) {
            o2 = null;
            $scope.validRightDocument = false;
            if (newValue) {
                try {
                    o2 = JSON.parse(cleanBuggySpaces(newValue));
                    $scope.validRightDocument = true;
                } catch (ex) {
                    $scope.validRightDocument = false;
                }
                $scope.validDocuments = $scope.validLeftDocument && $scope.validRightDocument;
            }
        });
        $scope.compare = function () {
            $scope.comparison = ComparatorSrv.compare(o1, o2);
            $scope.differences = ReporterSrv.generateDifferencesReport($scope.comparison);
        };
    });

}(angular));