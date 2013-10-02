/*global angular, module, inject, describe, beforeEach, it, expect*/
(function () {
    'use strict';

    describe('Filter: markerrors', function () {

        // load the filter's module
        beforeEach(module('JsontypecompareApp'));

        // initialize a new instance of the filter before each test
        var markerrors;
        beforeEach(inject(function ($filter) {
            markerrors = $filter('markerrors');
        }));

        it('should return the input prefixed with "markerrors filter:"', function () {
            var text = 'before "equal": false after';
            expect(markerrors(text)).toBe('before <span class="error">"equal": false</span> after');
        });

    });

}(angular));