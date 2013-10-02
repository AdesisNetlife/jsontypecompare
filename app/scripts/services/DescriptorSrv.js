/*global angular*/
(function (angular) {
    'use strict';
    var analyzeProperty,
        findMixedProperty,
        generateArrayDescription,
        generateArrayPropertiesDescription,
        generatePropertiesDescription;

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
                        properties[key].type = 'mixed';
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

    analyzeProperty = function analyzePropertyFn(o, key) {
        var description;
        description =  {
            type: angular.isArray(o[key]) ? 'array' : typeof o[key]
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

    angular.module('JsontypecompareApp')
        .service('DescriptorSrv', function DescriptorSrv() {
            this.generateDescription = generatePropertiesDescription;
        });
}(angular));