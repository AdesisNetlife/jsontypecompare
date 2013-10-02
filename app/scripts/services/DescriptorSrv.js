/*global angular*/
(function () {
    'use strict';
    var analyzeProperty,
        generateArrayDescription,
        generateArrayPropertiesDescription,
        generatePropertiesDescription;

    generateArrayPropertiesDescription = function generateArrayPropertiesDescriptionFn(arr) {
        var properties = {};
        arr.forEach(function (element) {
            angular.extend(properties, generatePropertiesDescription(element));
        });
        return properties;
    };


    generateArrayDescription = function generateArrayDescriptionFn(arr) {
        var description = {};
        arr.forEach(function (element) {
            if (!description.arrayType) {
                description.arrayType = typeof element;
            } else if (typeof element !== description.arrayType) {
                description.arrayType = "mixed";
            }
        });
        if (description.arrayType === 'object') {
            description.properties = generateArrayPropertiesDescription(arr);
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