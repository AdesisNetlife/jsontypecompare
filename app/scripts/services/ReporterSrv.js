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


    function sortArrayProperties(arr) {
        var i;
        for (i = 0; i < arr.length; i += 1) {
            if (arr[i]) {
                arr[i] = sortProperties(arr[i]);
            }
        }
        return arr;
    }

    function sortObjectProperties(o1) {
        var i, key, keys = [], o2 = {}, value;
        for (key in o1) {
            if (o1.hasOwnProperty(key)) {
                keys.push(key);
            }
        }
        keys.sort();
        for (i = 0; i < keys.length; i += 1) {
            value = o1[keys[i]];
            if (typeof value === 'object') {
                o2[keys[i]] = sortProperties(value);
            } else {
                o2[keys[i]] = value;
            }
        }
        return o2;
    }

    function sortProperties(o1) {
        if (angular.isArray(o1)) {
            return sortArrayProperties(o1);
        }
        if (typeof o1 === 'object') {
            return sortObjectProperties(o1);
        }
        return o1;
    }

    angular.module('JsontypecompareApp').service('ReporterSrv', function ReporterSrv() {
        this.generateDifferencesReport = generateDifferencesReport;
        this.sortProperties = sortProperties;
    });
}(angular));
