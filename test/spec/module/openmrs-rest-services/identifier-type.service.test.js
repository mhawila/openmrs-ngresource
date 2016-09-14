/* global afterEach */
/*jshint -W026, -W030 */
(function() {
  'use strict';

  describe('OpenMRS Identifier Type Service Unit Tests', function () {
    beforeEach(function () {
      module('openmrs-ngresource.restServices');
    });

    var callbacks;
    var httpBackend;
    var patientIdentifierTypeService;
    var settingsService;

    beforeEach(inject(function ($injector) {
      httpBackend = $injector.get('$httpBackend');
      patientIdentifierTypeService = $injector.get('PatientIdentifierTypeResService');
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
    });

    it('should have PatientIdentifierType service defined', function () {
      expect(patientIdentifierTypeService).to.exist;
    });

    it('should make an api call to the PatientIdentifierType resource with right url when getPatientIdentifierTypes is called', function () {
      httpBackend.expectGET(settingsService.getCurrentRestUrlBase() + 'patientidentifiertype?v=custom:(uuid,name,format,formatDescription,checkDigit,validator)').respond({});
      patientIdentifierTypeService.getPatientIdentifierTypes(function () { }, function () { });
      httpBackend.flush();
    });

    it('should call the onSuccess callback getPatientIdentifierTypes request successfully returns', function () {
      httpBackend.expectGET(settingsService.getCurrentRestUrlBase() + 'patientidentifiertype?v=custom:(uuid,name,format,formatDescription,checkDigit,validator)').respond({});
      patientIdentifierTypeService.getPatientIdentifierTypes(callbacks.onSuccess, callbacks.onFailure);
      httpBackend.flush();
      expect(callbacks.onSuccessCalled).to.equal(true);
      expect(callbacks.onFailedCalled).to.equal(false);
    });

   
    
      it('patientIdentifierTypeService should have getPatientIdentifierTypes method', function () {
        expect(patientIdentifierTypeService.getPatientIdentifierTypes).to.be.an('function');
      });

      it('patientIdentifierTypeService should have getPatientIdentifierTypeResource method', function () {
        expect(patientIdentifierTypeService.getPatientIdentifierTypeResource).to.be.an('function');
      });  
 
  });
})();
