/*global angular*/
(function (angular) {
    'use strict';

    angular.module('JsontypecompareApp').directive('contenteditable', function () {
        return {
            require: 'ngModel',
            link: function(scope, elm, attrs, ctrl) {
                // view -> model
                elm.on('blur', function() {
                    scope.$apply(function() {
                        ctrl.$setViewValue(elm.html());
                    });
                });

                // model -> view
                ctrl.$render = function(value) {
                    elm.html(value);
                };

                // load init value from DOM
                ctrl.$setViewValue(elm.html());
            }
        };
    });

}(angular));