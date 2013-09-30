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
                type: keySet[key].type,
                missing: missing
            });
        }
    }

    function addPresentProperties(properties, keySet) {
        var key, info, definition, equal;
        for (key in keySet) {
            info = keySet[key];
            equal = info.leftType === info.rightType;

            definition = {
                name: key
            };


            definition.equal = equal;

            if (!equal) {
                definition.leftType = info.leftType;
                definition.righType = info.rightType;
            } else {
                definition.type = info.leftType;
            }

            if (info.properties) {
                definition.properties = info.properties;
                definition.equal = equal && (info.equal === undefined || info.equal);
            }

            properties.push(definition);
        }
    }

    function compare(o1, o2) {
        var childs,
            comparison,
            info,
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
            o1KeySet[key] = {
                type: typeof o1[key]
            };
        }

        for (key in o2) {
            if (o1KeySet[key]) {
                delete o1KeySet[key];
                info = {
                    leftType: typeof o1[key],
                    rightType: typeof o2[key]
                };
                if (info.leftType === 'object') {
                    childs = compare(o1[key], o2[key]);
                    childs.leftType = info.leftType;
                    childs.rightType = info.rightType;
                    info = childs;
                }
                keySet[key] = info;
            } else {
                o2KeySet[key] = {
                    type: typeof o2[key]
                };
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