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

        it('should inform when valid documents have been introducec', function () {
            expect(scope.validDocuments).toBe(false);
            scope.leftValue = '{"a": 1}';
            scope.$digest();
            expect(scope.validDocuments).toBe(false);
            scope.rightValue = '{"a": 1';
            scope.$digest();
            expect(scope.validDocuments).toBe(false);
            scope.rightValue = '{"a": 1}';
            scope.$digest();
            expect(scope.validDocuments).toBe(true);
        });

        it('should compare json values', function () {
            scope.leftValue = '{"a": 1}';
            scope.rightValue = '{"a": 2}';
            scope.$digest();
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
        it('should generate report of differences', function () {
            scope.leftValue = '{"a": {"b": 1}}';
            scope.rightValue = '{"a": {"b": "2"}}';
            scope.$digest();
            scope.compare();
            expect(scope.differences).toEqual([
                {
                    path: 'a',
                    errorType: 'children'
                },
                {
                    path: 'a.b',
                    errorType: 'type',
                    leftType: 'number',
                    rightType: 'string'
                }
            ]);
        });
    });

}());
