/*
jshint -W030
*/
(function() {
  'use strict';

  describe('Patient Relationship model Factory Unit Tests', function() {
      beforeEach(function() {
        module('openmrs-ngresource.models');
      });

      var PatientRelationshipModelFactory;

      beforeEach(inject(function($injector) {
        PatientRelationshipModelFactory = $injector.get('PatientRelationshipModel');
      }));

      it('should have Patient Relationship Model Factory defined', function() {
        expect(PatientRelationshipModelFactory).to.exist;
      });

      it('should always create Patient Relationship Model with all required members defined ', function() {
        var uuId='uuId';
        var relationshipTypeName='relationshipTypeName';
        var relative='relative';
        var model = new PatientRelationshipModelFactory.patientRelationship(uuId, relative, relationshipTypeName);

        expect(model.uuId).to.exist;
        expect(model.relative).to.exist;
        expect(model.relationshipTypeName).to.exist;

        expect(model.uuId()).to.equal(uuId);
        expect(model.relative()).to.equal(relative);
        expect(model.relationshipTypeName()).to.equal(relationshipTypeName);
      });

    });

})();
