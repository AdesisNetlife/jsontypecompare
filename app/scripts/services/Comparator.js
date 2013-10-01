/*global angular*/
(function () {
    'use strict';
    var analyzeProperty,
        arePropertiesEqual,
        compare,
        compareProperties,
        existingProperties,
        generateArrayDescription,
        generatePropertiesDescription,
        missingProperties;


    arePropertiesEqual = function arePropertiesEqualFn(properties) {
        var key;
        for (key in properties) {
            if (properties.hasOwnProperty(key)) {
                if (!properties[key].equal) {
                    return false;
                }
            }
        }
        return true;
    };


    existingProperties = function existingPropertiesFn(description1, description2, keySet) {
        var key, property1, property2, properties = {};
        for (key in keySet) {
            if (keySet.hasOwnProperty(key)) {
                property1 = description1[key];
                property2 = description2[key];
                if (property1.type === property2.type) {
                    if (property1.type === 'object') {
                        properties[key] = compareProperties(property1.properties, property2.properties);
                        properties[key].type = 'object';
                    } else if (property1.type === 'array') {
                        properties[key] = {
                            type: 'array'
                        };
                        if (property1.arrayType === property2.arrayType) {
                            properties[key].arrayType = property1.arrayType;
                            properties[key].equal = true;
                        } else {
                            properties[key].leftArrayType = property1.arrayType;
                            properties[key].rightArrayType = property2.arrayType;
                            properties[key].equal = false;
                        }
                    } else {
                        properties[key] = property1;
                        property1.equal = true;
                    }
                } else {
                    properties[key] = {
                        equal: false,
                        leftType: property1.type,
                        rightType: property2.type
                    };
                }
            }
        }
        return properties;
    };

    missingProperties = function missingPropertiesFn(description, keySet, missing) {
        var key, properties = {};
        for (key in keySet) {
            if (keySet.hasOwnProperty(key)) {
                description[key].equal = false;
                description[key].missing = missing;
                properties[key] = description[key];
            }
        }
        return properties;
    };

    generateArrayDescription = function generateArrayDescription(arr) {
        var type;
        arr.forEach(function (element) {
            type = typeof element;
        });
        return {
            type: type
        };
    };

    analyzeProperty = function analyzePropertyFn(o, key) {
        var description, arrayInfo;
        description =  {
            type: angular.isArray(o[key]) ? 'array' : typeof o[key]
        };
        if (description.type === 'object') {
            description.properties = generatePropertiesDescription(o[key]);
        }
        if (description.type === 'array') {
            arrayInfo = generateArrayDescription(o[key]);
            description.arrayType = arrayInfo.type;
            //description.properties = arrayInfo.properties;
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


    compareProperties = function comparePropertiesFn(description1, description2) {
        var key,
            commonKeySet = {},
            desc1KeySet = {},
            desc2KeySet = {},
            properties = {};


        for (key in description1) {
            if (description1.hasOwnProperty(key)) {
                desc1KeySet[key] = true;
            }
        }
        for (key in description2) {
            if (description2.hasOwnProperty(key)) {
                if (desc1KeySet[key]) {
                    delete desc1KeySet[key];
                    commonKeySet[key] = true;
                } else {
                    desc2KeySet[key] = true;
                }
            }
        }

        angular.extend(properties, missingProperties(description1, desc1KeySet, "right"));
        angular.extend(properties, missingProperties(description2, desc2KeySet, "left"));
        angular.extend(properties, existingProperties(description1, description2, commonKeySet));

        return {
            properties: properties,
            equal: arePropertiesEqual(properties)
        };
    };

    compare = function compareFn(o1, o2) {
        var o1description, o2description, comparison;


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

        o1description = generatePropertiesDescription(o1);
        o2description = generatePropertiesDescription(o2);
        comparison = compareProperties(o1description, o2description);

        return comparison;
    };

    angular.module('JsoncompareApp').service('Comparator', function Comparator() {
        this.compare = compare;
    });

}(angular));