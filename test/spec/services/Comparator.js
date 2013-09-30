/*global module, inject, describe, beforeEach, it, expect*/
(function () {
    'use strict';

    describe('Service: Comparator', function () {

        // load the service's module
        beforeEach(module('JsoncompareApp'));

        // instantiate service
        var Comparator;
        beforeEach(inject(function (_Comparator_) {
            Comparator = _Comparator_;
        }));

        it('should be something', function () {
            expect(!!Comparator).toEqual(true);
        });

        it('should find equal empty objects', function () {
            expect(Comparator.compare({}, {})).toEqual({
                equal: true
            });
        });

        it('should find different object and null', function () {
            expect(Comparator.compare({}, null)).toEqual({
                equal: false,
                missing: 'right'
            });
            expect(Comparator.compare(null, {})).toEqual({
                equal: false,
                missing: 'left'
            });
        });

        it('should find equal and same when is same object', function () {
            var a = {b: 1};
            expect(Comparator.compare(a, a)).toEqual({
                equal: true,
                same: true
            });
        });

        it('should find equal objects with same properties', function () {
            expect(Comparator.compare({a: 2}, {a: 1})).toEqual({
                equal: true,
                properties: [{
                    name: 'a',
                    equal: true,
                    type: 'number'
                }]
            });
        });

        it('should find different objects with different properties', function () {
            expect(Comparator.compare({}, {a: 1})).toEqual({
                equal: false,
                properties: [{
                    name: 'a',
                    equal: false,
                    missing: 'left',
                    type: 'number'
                }]
            });
            expect(Comparator.compare({a: 1}, {})).toEqual({
                equal: false,
                properties: [{
                    name: 'a',
                    equal: false,
                    missing: 'right',
                    type: 'number'
                }]
            });
        });

        it('should find different objects with properties of different type', function () {
            expect(Comparator.compare({a: 2}, {a: "2"})).toEqual({
                equal: false,
                properties: [{
                    name: 'a',
                    equal: false,
                    leftType: 'number',
                    righType: 'string'
                }]
            });
        });

        it('should find mixed differences', function () {
            expect(Comparator.compare({a: 2, b: 3}, {a: "2", c: "a"})).toEqual({
                equal: false,
                properties: [{
                    name: 'a',
                    equal: false,
                    leftType: 'number',
                    righType: 'string'
                }, {
                    name: 'b',
                    equal: false,
                    missing: 'right',
                    type: 'number'
                }, {
                    name: 'c',
                    equal: false,
                    missing: 'left',
                    type: 'string'
                }]
            });
        });

        it('should find different in child objects', function () {
            expect(Comparator.compare({a: {b: 1}}, {a: {}})).toEqual({
                equal: false,
                properties: [{
                    name: 'a',
                    equal: false,
                    type: 'object',
                    properties: [{
                        name: 'b',
                        equal: false,
                        type: 'number',
                        missing: 'right'
                    }]
                }]
            });
        });
    });
}());
