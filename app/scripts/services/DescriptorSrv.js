/*global angular*/
(function (angular) {
    'use strict';
    var analyzeProperty,
        findMixedProperty,
        generateArrayDescription,
        generateArrayPropertiesDescription,
        generateDescription,
        generatePropertiesDescription;

    function combineTypes(type1, type2) {
        if (type1 === "null") {
            return type2;
        }
        if (type2 === "null") {
            return type1;
        }
        return "mixed";
    }

    generateArrayPropertiesDescription = function generateArrayPropertiesDescriptionFn(arr) {
        var properties = {};
        arr.forEach(function (element) {
            var key,
                newProperties = generatePropertiesDescription(element);
            for (key in newProperties) {
                if (newProperties.hasOwnProperty(key)) {
                    if (!properties[key]) {
                        properties[key] = newProperties[key];
                    } else if (properties[key].type !== newProperties[key].type) {
                        properties[key].type = combineTypes(properties[key].type, newProperties[key].type);
                    }
                }
            }
        });
        return properties;
    };

    findMixedProperty = function findMixedPropertyFn(properties) {
        var key;
        for (key in properties) {
            if (properties.hasOwnProperty(key) && properties[key].type === 'mixed') {
                return true;
            }
        }
        return false;
    };

    generateArrayDescription = function generateArrayDescriptionFn(arr) {
        var description = {};
        arr.forEach(function (element) {
            var type = typeof element;
            if (!description.arrayType) {
                description.arrayType = type;
            } else if (type !== description.arrayType) {
                description.arrayType = "mixed";
            }
        });
        if (description.arrayType === 'object') {
            description.properties = generateArrayPropertiesDescription(arr);
            if (findMixedProperty(description.properties)) {
                description.arrayType = 'mixed';
            }
        }

        if (!description.arrayType) {
            description.arrayType = 'unknown';
        }

        return description;
    };

    function findType(o, key) {
        var type;
        if (o[key] === null) {
            type = "null";
        } else {
            type = angular.isArray(o[key]) ? 'array' : typeof o[key];
        }
        return type;
    }

    analyzeProperty = function analyzePropertyFn(o, key) {
        var description;
        description =  {
            type: findType(o, key)
        };
        if (description.type === 'object') {
            description.properties = generatePropertiesDescription(o[key]);
        }
        if (description.type === 'array') {
            angular.extend(description, generateArrayDescription(o[key]));
        }
        return description;
    };

    generatePropertiesDescription = function generatePropertiesDescriptionFn(o) {
        var properties = {}, key;
        for (key in o) {
            if (o.hasOwnProperty(key)) {
                properties[key] = analyzeProperty(o, key);
            }
        }
        return properties;
    };

    generateDescription = function generateDescriptionFn(o) {
        if (angular.isArray(o)) {
            return angular.extend({type: 'array'}, generateArrayDescription(o));
        }
        var properties = {}, key;
        for (key in o) {
            if (o.hasOwnProperty(key)) {
                properties[key] = analyzeProperty(o, key);
            }
        }
        return {
            type: 'object',
            properties: properties
        };
    };

    angular.module('JsontypecompareApp')
        .service('DescriptorSrv', function DescriptorSrv() {
            this.generateDescription = generateDescription;
        });
}(angular));