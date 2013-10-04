/*global angular*/
(function (angular) {
    'use strict';

    function generateDifferenceReport(property, key, prefix) {
        var report = {
            path: (prefix || "") + key
        };
        if (!property.type) {
            report.errorType = "type";
            report.leftType = property.leftType;
            report.rightType = property.rightType;
        } else if (property.missing) {
            report.errorType = "missing";
            report.missing = property.missing;
        } else if (property.type === 'array') {
            if (!property.arrayType) {
                report.errorType = "arrayType";
                report.leftArrayType = property.leftArrayType;
                report.rightArrayType = property.rightArrayType;
            } else {
                report.errorType = 'children';
            }

        } else {
            report.errorType = 'children';
        }
        return report;
    }

    function calculateNextPrefix(prefix, key, property) {
        var newPrefix = (prefix  || "");
        newPrefix += key;
        if (property.type === 'array') {
            newPrefix += "[]";
        }
        newPrefix += ".";
        return newPrefix;
    }

    function checkDifferences(differences, comparison, prefix) {
        var key, properties, nextPrefix;
        if (!comparison.equal) {
            properties = comparison.properties;
            for (key in properties) {
                if (properties.hasOwnProperty(key)) {
                    if (!properties[key].equal) {
                        differences.push(generateDifferenceReport(properties[key], key, prefix));
                        nextPrefix = calculateNextPrefix(prefix, key, properties[key]);
                        checkDifferences(differences, properties[key], nextPrefix);
                    }
                }
            }
        }
    }

    function generateDifferencesReport(comparison) {
        var differences = [];
        checkDifferences(differences, comparison);
        return differences;
    }

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
            if ($scope.pretty && o2) {
                $scope.rightValue = JSON.stringify(o2, true, "  ");
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
            $scope.differences = generateDifferencesReport($scope.comparison);
        };
    });

}(angular));