/*global module, inject, describe, beforeEach, it, expect*/
(function () {
    'use strict';

    describe('Controller: MainCtrl', function () {

        // load the controller's module
        beforeEach(module('JsontypecompareApp'));

        var scope;

        // Initialize the controller and a mock scope
        beforeEach(inject(function ($controller, $rootScope) {
            scope = $rootScope.$new();
            $controller('MainCtrl', {
                $scope: scope
            });
        }));

        it('should compare json values', function () {
            scope.leftValue = '{"a": 1}';
            scope.rightValue = '{"a": 2}';
            scope.compare();
            expect(scope.comparison).toEqual({
                properties: {
                    a: {
                        type: 'number',
                        equal: true
                    }
                },
                equal: true
            });
        });
    });

}());
