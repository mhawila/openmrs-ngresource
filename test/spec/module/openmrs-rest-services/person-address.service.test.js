/* global afterEach */
/*jshint -W026, -W030 */
(function() {
  'use strict';

  describe('OpenMRS Person Address Service Unit Tests', function () {
    beforeEach(function () {
      module('openmrs-ngresource.restServices');
    });

    var callbacks;
    var httpBackend;
    var personAddressService;
    var settingsService;

    beforeEach(inject(function ($injector) {
      httpBackend = $injector.get('$httpBackend');
      personAddressService = $injector.get('PersonAddressResService');
      settingsService = $injector.get('OpenmrsSettings');
    }));

    beforeEach(inject(function () {
      callbacks = {
        onSuccessCalled: false,
        onFailedCalled: false,
        message: null,
        onSuccess: function () {
          callbacks.onSuccessCalled = true;
        },

        onFailure: function (message) {
          callbacks.onFailedCalled = true;
          callbacks.message = message;
        }
      };
    }));

    afterEach(function () {
      httpBackend.verifyNoOutstandingExpectation();

      // httpBackend.verifyNoOutstandingRequest (); //expectation is sufficient for now
    });

    it('should have Person Address service defined', function () {
      expect(personAddressService).to.exist;
    });

    
    
      it('PersonAddressService should have saveUpdatePersonAddress method', function () {
        expect(personAddressService.saveUpdatePersonAddress).to.be.an('function');
      });

      it('PersonAddress Service should have getPersonAddressResource method', function () {
        expect(personAddressService.getPersonAddressResource).to.be.an('function');
      });
      
      
    it('should make an api call to save an Person Address resource when saveUpdatePersonAddress is called',
            function () {
                var v='custom:(uuid,preferred,address1,address2,cityVillage,stateProvince,country,postalCode,latitude,longitude,countyDistrict,address3)';
            var saveParam={personUuid:'passed-person-uuid',address:{address1:232,address2:123},addressUuid:''       }  ;
            var updateParam={personUuid:'passed-person-uuid',address:{address1:232,address2:123},addressUuid:'passed-address-uuid'       }  ;
                
                //case saving new Address
                
                httpBackend.expectPOST(settingsService.getCurrentRestUrlBase()
                    + 'person/passed-person-uuid/address?v='+v, JSON.stringify(saveParam.address))
                    .respond({});

                personAddressService.saveUpdatePersonAddress(saveParam, function () { }, function () { });
                httpBackend.flush();

                //updating  Address                                       
                httpBackend.expectPOST(settingsService.getCurrentRestUrlBase()
                     + 'person/passed-person-uuid/address/passed-address-uuid?v='+v, updateParam.address)
                    .respond({});
                personAddressService.saveUpdatePersonAddress(updateParam, function () { }, function () { });
                httpBackend.flush();

            });

    
  });
})();
