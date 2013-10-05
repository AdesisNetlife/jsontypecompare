/*global module, inject, describe, beforeEach, it, expect*/
(function () {
    'use strict';

    describe('Service: ComparatorSrv', function () {

        // load the service's module
        beforeEach(module('JsontypecompareApp'));

        // instantiate service
        var ComparatorSrv;
        beforeEach(inject(function (_ComparatorSrv_) {
            ComparatorSrv = _ComparatorSrv_;
        }));

        it('should be something', function () {
            expect(!!ComparatorSrv).toEqual(true);
        });

        it('should find equal empty objects', function () {
            expect(ComparatorSrv.compare({}, {})).toEqual({
                equal: true,
                properties: {}
            });
        });

        it('should find different object and null', function () {
            expect(ComparatorSrv.compare({}, null)).toEqual({
                equal: false,
                missing: 'right'
            });
            expect(ComparatorSrv.compare(null, {})).toEqual({
                equal: false,
                missing: 'left'
            });
        });

        it('should find equal and same when is same object', function () {
            var a = {b: 1};
            expect(ComparatorSrv.compare(a, a)).toEqual({
                equal: true,
                same: true
            });
        });

        it('should find different objects and arrays', function () {
            expect(ComparatorSrv.compare([], {})).toEqual({
                equal: false,
                leftType: 'array',
                rightType: 'object'
            });
        });

        it('should find equal objects with same properties', function () {
            expect(ComparatorSrv.compare({a: 2}, {a: 1})).toEqual({
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
            expect(ComparatorSrv.compare({}, {a: 1})).toEqual({
                equal: false,
                properties: {
                    a: {
                        equal: false,
                        missing: 'left',
                        type: 'number'
                    }
                }
            });
            expect(ComparatorSrv.compare({a: 1}, {})).toEqual({
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
            expect(ComparatorSrv.compare({a: 2}, {a: "2"})).toEqual({
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
            expect(ComparatorSrv.compare({a: 2, b: 3}, {a: "2", c: "a"})).toEqual({
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
            expect(ComparatorSrv.compare({a: {b: 1}}, {a: {}})).toEqual({
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
            expect(ComparatorSrv.compare({a: [1, 2]}, {a: [1, 2, 3]})).toEqual({
                equal: true,
                properties: {
                    'a': {
                        equal: true,
                        type: 'array',
                        arrayType: 'number'
                    }
                }
            });
            expect(ComparatorSrv.compare({a: [1, 2]}, {a: ["1", "2"]})).toEqual({
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
            expect(ComparatorSrv.compare({a: [1, 2]}, {a: []})).toEqual({
                equal: true,
                properties: {
                    'a': {
                        equal: true,
                        type: 'array',
                        arrayType: 'number'
                    }
                }
            });
            expect(ComparatorSrv.compare({a: []}, {a: [1, 2]})).toEqual({
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

        it('should find consider mixed type arrays different to other arrays, even other mixed arrays', function () {
            expect(ComparatorSrv.compare({a: [1, "2"]}, {a: [1, 2]})).toEqual({
                equal: false,
                properties: {
                    'a': {
                        equal: false,
                        type: 'array',
                        leftArrayType: 'mixed',
                        rightArrayType: 'number'
                    }
                }
            });

            expect(ComparatorSrv.compare({a: [1, 2]}, {a: [1, "2"]})).toEqual({
                equal: false,
                properties: {
                    'a': {
                        equal: false,
                        type: 'array',
                        leftArrayType: 'number',
                        rightArrayType: 'mixed'
                    }
                }
            });
            expect(ComparatorSrv.compare({a: [1, "2"]}, {a: [1, "2"]})).toEqual({
                equal: false,
                properties: {
                    'a': {
                        equal: false,
                        type: 'array',
                        leftArrayType: 'mixed',
                        rightArrayType: 'mixed'
                    }
                }
            });
        });

        it('should compare objects inside arrays', function () {
            expect(ComparatorSrv.compare({a: [{b: 1}]}, {a: [{b: 2}]})).toEqual({
                equal: true,
                properties: {
                    'a': {
                        equal: true,
                        type: 'array',
                        arrayType: 'object',
                        properties: {
                            'b': {
                                equal: true,
                                type: 'number'
                            }
                        }
                    }
                }
            });

            expect(ComparatorSrv.compare({a: [{b: 1}]}, {a: [{c: 2}]})).toEqual({
                equal: false,
                properties: {
                    'a': {
                        equal: false,
                        type: 'array',
                        arrayType: 'object',
                        properties: {
                            'b': {
                                equal: false,
                                type: 'number',
                                missing: 'right'
                            },
                            'c': {
                                equal: false,
                                type: 'number',
                                missing: 'left'
                            }
                        }
                    }
                }
            });

        });

        it('should combine objects properties inside an array for comparison', function () {
            expect(ComparatorSrv.compare({a: [{b: 1}, {c: "1"}]}, {a: [{c: "5"}, {b: 2}]})).toEqual({
                equal: true,
                properties: {
                    'a': {
                        equal: true,
                        type: 'array',
                        arrayType: 'object',
                        properties: {
                            'b': {
                                equal: true,
                                type: 'number'
                            },
                            'c': {
                                equal : true,
                                type : 'string'
                            }
                        }
                    }
                }
            });

        });



    });
}());
