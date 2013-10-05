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

        describe('prettify', function () {

            it('should remove unchanged when scope.pretty = false', function () {
                scope.pretty = false;
                scope.leftValue = '{"b": 1, "a": 2}';
                scope.rightValue = '{"d": 1, "c": 2}';
                scope.$digest();
                scope.prettifyLeft();
                expect(scope.leftValue).toBe('{"b": 1, "a": 2}');

                scope.prettifyRight();
                expect(scope.rightValue).toBe('{"d": 1, "c": 2}');
            });

            it('should prettify when scope.pretty = true', function () {
                scope.pretty = true;
                scope.order = false;
                scope.leftValue = '{"b": 1, "a": 2}';
                scope.rightValue = '{"d": 1, "c": 2}';
                scope.$digest();
                scope.prettifyLeft();
                expect(scope.leftValue).toBe('{\n  "b": 1,\n  "a": 2\n}');

                scope.prettifyRight();
                expect(scope.rightValue).toBe('{\n  "d": 1,\n  "c": 2\n}');
            });

            it('should prettify and order properties when scope.pretty = true and scope.order = true', function () {
                scope.pretty = true;
                scope.order = true;
                scope.leftValue = '{"b": 1, "a": 2}';
                scope.rightValue = '{"d": 1, "c": 2}';
                scope.$digest();
                scope.prettifyLeft();
                expect(scope.leftValue).toBe('{\n  "a": 2,\n  "b": 1\n}');

                scope.prettifyRight();
                expect(scope.rightValue).toBe('{\n  "c": 2,\n  "d": 1\n}');
            });
            //scope.pretty = false;
        });


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
