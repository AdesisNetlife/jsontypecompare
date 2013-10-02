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

});
