/*global angular*/
(function () {
    'use strict';

    function arePropertiesEqual(properties) {
        return properties.every(function (property) {
            return property.equal;
        });
    }

    function addMissingProperties(properties, keySet, missing) {
        var key;
        for (key in keySet) {
            properties.push({
                name: key,
                equal: false,
                missing: missing
            });
        }
    }

    function addPresentProperties(properties, keySet) {
        var key, types, definition, equal;
        for (key in keySet) {
            types = keySet[key];
            equal = types.leftType === types.rightType;

            definition = {
                name: key,
                equal: true
            };

            if (!equal) {
                definition.equal = false;
                definition.leftType = types.leftType;
                definition.righType = types.rightType;
            }

            properties.push(definition);
        }
    }

    function compare(o1, o2) {
        var comparison,
            key,
            keySet = {},
            o1KeySet = {},
            o2KeySet = {},
            properties = [];

        if (o1 === o2) {
            return {
                equal: true,
                same: true
            };
        }
        if (o1 === null) {
            return {
                equal: false,
                missing: "left"
            };
        }
        if (o2 === null) {
            return {
                equal: false,
                missing: "right"
            };
        }

        for (key in o1) {
            o1KeySet[key] = true;
        }
        for (key in o2) {
            if (o1KeySet[key]) {
                delete o1KeySet[key];
                keySet[key] = {
                    leftType: typeof o1[key],
                    rightType: typeof o2[key]
                };
            } else {
                o2KeySet[key] = true;
            }
        }
        addPresentProperties(properties, keySet);
        addMissingProperties(properties, o1KeySet, "right");
        addMissingProperties(properties, o2KeySet, "left");

        comparison =  {
            equal: true
        };

        if (properties.length) {
            comparison.properties = properties;
            comparison.equal = arePropertiesEqual(properties);
        }

        return comparison;
    }

    angular.module('JsoncompareApp').service('Comparator', function Comparator() {
        this.compare = compare;
    });

}(angular));