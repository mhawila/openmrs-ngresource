(function(){
  'use strict';
  describe('openmrs patient relationship type service unit tests',function(){
    beforeEach(function () {
      module('openmrs-ngresource.restServices');
    });
    var httpBackend;
    var PatientRelationshipTypeService;
    var settingsService;
    var callbacks;

    beforeEach(inject(function($injector){
      httpBackend=$injector.get('$httpBackend');
      PatientRelationshipTypeService=$injector.get('PatientRelationshipTypeResService');
      settingsService = $injector.get('OpenmrsSettings');
    }));
    beforeEach(inject(function() {
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

    it('should call successCallback when request is successfull',function(){
      httpBackend.expectGET(settingsService.getCurrentRestUrlBase() +'relationshiptype').respond({});
      PatientRelationshipTypeService.getPatientRelationshipTypes(callbacks.onSuccess,callbacks.onFailure);
      httpBackend.flush();
      expect(callbacks.onSuccessCalled).to.equal(true);
      expect(callbacks.onFailedCalled).to.equal(false);
    });

    it('should call errorCallback when request fails',function(){
      httpBackend.expectGET(settingsService.getCurrentRestUrlBase() +'relationshiptype').respond(500);
      PatientRelationshipTypeService.getPatientRelationshipTypes(callbacks.onSuccess,callbacks.onFailure);
      httpBackend.flush();
      expect(callbacks.onSuccessCalled).to.equal(false);
      expect(callbacks.onFailedCalled).to.equal(true);
    });

  });
})();
