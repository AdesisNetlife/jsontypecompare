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
                equal: true,
                properties: {}
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
                properties: {
                    a: {
                        equal: true,
                        type: 'number'
                    }
                }
            });
        });

        it('should find different objects with different properties', function () {
            expect(Comparator.compare({}, {a: 1})).toEqual({
                equal: false,
                properties: {
                    a: {
                        equal: false,
                        missing: 'left',
                        type: 'number'
                    }
                }
            });
            expect(Comparator.compare({a: 1}, {})).toEqual({
                equal: false,
                properties: {
                    a: {
                        equal: false,
                        missing: 'right',
                        type: 'number'
                    }
                }
            });
        });

        it('should find different objects with properties of different type', function () {
            expect(Comparator.compare({a: 2}, {a: "2"})).toEqual({
                equal: false,
                properties: {
                    a: {
                        equal: false,
                        leftType: 'number',
                        rightType: 'string'
                    }
                }
            });
        });

        it('should find mixed differences', function () {
            expect(Comparator.compare({a: 2, b: 3}, {a: "2", c: "a"})).toEqual({
                equal: false,
                properties: {
                    a: {
                        equal: false,
                        leftType: 'number',
                        rightType: 'string'
                    },
                    b: {
                        equal: false,
                        missing: 'right',
                        type: 'number'
                    },
                    c: {
                        equal: false,
                        missing: 'left',
                        type: 'string'
                    }
                }
            });
        });

        it('should find different in child objects', function () {
            expect(Comparator.compare({a: {b: 1}}, {a: {}})).toEqual({
                equal: false,
                properties: {
                    'a': {
                        equal: false,
                        type: 'object',
                        properties: {
                            'b': {
                                equal: false,
                                type: 'number',
                                missing: 'right'
                            }
                        }
                    }
                }
            });
        });

        it('should find differences type of arrays', function () {
            expect(Comparator.compare({a: [1, 2]}, {a: [1, 2, 3]})).toEqual({
                equal: true,
                properties: {
                    'a': {
                        equal: true,
                        type: 'array',
                        arrayType: 'number'
                    }
                }
            });
            expect(Comparator.compare({a: [1, 2]}, {a: ["1", "2"]})).toEqual({
                equal: false,
                properties: {
                    'a': {
                        equal: false,
                        type: 'array',
                        leftArrayType: 'number',
                        rightArrayType: 'string'
                    }
                }
            });
        });

        it('should find consider empty arrays equal to other arrays', function () {
            expect(Comparator.compare({a: [1, 2]}, {a: []})).toEqual({
                equal: true,
                properties: {
                    'a': {
                        equal: true,
                        type: 'array',
                        arrayType: 'number'
                    }
                }
            });
            expect(Comparator.compare({a: []}, {a: [1, 2]})).toEqual({
                equal: true,
                properties: {
                    'a': {
                        equal: true,
                        type: 'array',
                        arrayType: 'number'
                    }
                }
            });
        });

    });
}());
