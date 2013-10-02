/*global angular, module, inject, describe, beforeEach, it, expect*/
(function () {
    'use strict';

    describe('Directive: contenteditable', function () {

        // load the directive's module
        beforeEach(module('JsontypecompareApp'));

        var element,
            scope;

        beforeEach(inject(function ($rootScope) {
            scope = $rootScope.$new();
        }));

        it('should make hidden element visible', inject(function ($compile) {
            element = angular.element('<div contenteditable ng-model="content">this is the contenteditable directive</div>');
            element = $compile(element)(scope);
            expect(element.text()).toBe('this is the contenteditable directive');
            expect(scope.content).toBe('this is the contenteditable directive');
        }));
    });

}());
