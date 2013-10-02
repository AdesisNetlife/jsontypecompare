/*global module, inject, describe, beforeEach, it, expect*/
(function () {
    'use strict';

    describe('Service: DescriptorSrv', function () {

        // load the service's module
        beforeEach(module('JsontypecompareApp'));

        // instantiate service
        var DescriptorSrv;
        beforeEach(inject(function (_DescriptorSrv_) {
            DescriptorSrv = _DescriptorSrv_;
        }));

        it('should do something', function () {
            expect(!!DescriptorSrv).toBe(true);
        });

        describe('generateDescription', function () {

            it('should describe object properties', function () {
                expect(DescriptorSrv.generateDescription({a: 1})).toEqual({
                    'a': {
                        type: 'number'
                    }
                });
            });

            it('should describe array types', function () {
                expect(DescriptorSrv.generateDescription({a: [1, 2]})).toEqual({
                    'a': {
                        type: 'array',
                        arrayType: 'number'
                    }
                });
            });

            it('should describe array as mixed if values have different type', function () {
                expect(DescriptorSrv.generateDescription({a: [1, '2']})).toEqual({
                    'a': {
                        type: 'array',
                        arrayType: 'mixed'
                    }
                });
            });

            it('should describe objects inside arrays', function () {
                expect(DescriptorSrv.generateDescription({a: [{b: 1, c: '2'}]})).toEqual({
                    'a': {
                        type: 'array',
                        arrayType: 'object',
                        properties: {
                            'b': {
                                type: 'number'
                            },
                            'c': {
                                type: 'string'
                            }
                        }
                    }
                });
            });

            it('should describe combine object properties inside arrays', function () {
                expect(DescriptorSrv.generateDescription({a: [{b: 1}, {c: '2'}]})).toEqual({
                    'a': {
                        type: 'array',
                        arrayType: 'object',
                        properties: {
                            'b': {
                                type: 'number'
                            },
                            'c': {
                                type: 'string'
                            }
                        }
                    }
                });
            });

        });

    });
}());