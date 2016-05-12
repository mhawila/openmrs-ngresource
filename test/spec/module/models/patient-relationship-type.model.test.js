(function(){
  'use strict';
  describe('OpenMRS patient relationship type model unit tests',function(){
    beforeEach(function(){
      module('openmrs-ngresource.restServices');
    });
    var PatientRelationshipTypeModelFactory;
    beforeEach(inject(function($injector){
      PatientRelationshipTypeModelFactory=$injector.get('PatientRelationshipTypeModel');
    }));

    it('should have patient relationship type model Factory defined', function() {
      expect(PatientRelationshipTypeModelFactory).to.exist;
    });

    it('should create patient relationship type model with all properties defined', function() {
      var uuId='uuId';
      var display='display';
      var model=new PatientRelationshipTypeModelFactory.patientRelationshipType(uuId,display);
        expect(model.uuId).to.exist;
        expect(model.display).to.exist;
    });


  })
})();
