/*global module, inject, describe, beforeEach, it, expect*/
(function () {
    'use strict';

    describe('Service: ReporterSrv', function () {

        // load the service's module
        beforeEach(module('JsontypecompareApp'));

        // instantiate service
        var ReporterSrv;
        beforeEach(inject(function (_ReporterSrv_) {
            ReporterSrv = _ReporterSrv_;
        }));

        it('should do something', function () {
            expect(!!ReporterSrv).toBe(true);
        });

        describe('sortProperties', function () {

            it('should sort properties of object', function () {
                var sorted,
                    o = {"b": 1, "a": 2};
                sorted = ReporterSrv.sortProperties(o);
                expect(JSON.stringify(sorted)).toEqual('{"a":2,"b":1}');
            });

            it('should sort properties of inner objects', function () {
                var sorted,
                    o = {"c":{"b": 1, "a": 2}};
                sorted = ReporterSrv.sortProperties(o);
                expect(JSON.stringify(sorted)).toEqual('{"c":{"a":2,"b":1}}');
            });

            it('should sort properties of objects inside arrays', function () {
                var sorted,
                    o = {"c":[{"b": 1, "a": 2}]};
                sorted = ReporterSrv.sortProperties(o);
                expect(JSON.stringify(sorted)).toEqual('{"c":[{"a":2,"b":1}]}');
            });

        });

        describe('generateDifferencesReport', function () {

            it('should make a report from a comparion', function () {
                var comparison = {
                    "properties": {
                        "a": {
                            "type": "array",
                            "arrayType": "object",
                            "properties": {
                                "b": {
                                    "properties": {
                                        "c": {
                                            "equal": false,
                                            "leftType": "number",
                                            "rightType": "string"
                                        }
                                    },
                                    "equal": false,
                                    "type": "object"
                                }
                            },
                            "equal": false
                        }
                    },
                    "equal": false
                };
                expect(ReporterSrv.generateDifferencesReport(comparison)).toEqual([
                    {
                        path: 'a',
                        errorType: 'children'
                    },
                    {
                        path: 'a[].b',
                        errorType: 'children'
                    },
                    {
                        path: 'a[].b.c',
                        errorType: 'type',
                        leftType: 'number',
                        rightType: 'string'
                    }
                ]);
            });
        });

    });

}());
