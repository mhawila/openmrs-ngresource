/*
jshint -W030
*/
(function () {
  'use strict';

  describe('FormModel Factory Unit Tests', function () {
    beforeEach(function () {
      module('openmrs-ngresource.models');
    });

    var formModelFactory;
    var openmrsForms = [
      {
        uuid: 'test-uuid',
        display: 'adult form',
        name: 'adult form',
        description: 'a form',
        encounterType: {
          uuid: 'encounter-type-uuid',
          name: 'test encounter',
          display: 'encounter type display',
          retired: false,
          links: [{
            rel: 'self',
            uri: 'test-url/instance/ws/rest/v1/encounterType/encounter-type-uuid',
          }, {
            rel: 'self',
            uri: 'test-url/instance/ws/rest/v1/encounterType/encounter-type-uuid?v=full',
          }]
        },
        version: 1.2,
        build: 0,
        published: true,
        formFields: []
      },
      {
        uuid: 'another-uuid',
        display: 'good form',
        name: 'good form',
        description: 'not bad form',
        encounterType: {
          uuid: 'encounter-type-uuid',
          name: 'test encounter',
          display: 'encounter type display',
          retired: false,
          links: [{
            rel: 'self',
            uri: 'test-url/instance/ws/rest/v1/encounterType/encounter-type-uuid',
          }, {
            rel: 'self',
            uri: 'test-url/instance/ws/rest/v1/encounterType/encounter-type-uuid?v=full',
          }]
        },
        version: 2.1,
        build: 0,
        published: false,
        formFields: []
      }
    ];
    
    beforeEach(inject(function ($injector) {
      formModelFactory = $injector.get('FormModel');
    }));
    
    it('FormModel should create a correct Model from OpenMRS rest resouce', function() {
      var form = openmrsForms[0];
      var formModel = new formModelFactory.Model(form);
      
      expect(formModel.uuid()).to.equal(form.uuid);
      expect(formModel.name()).to.equal(form.name);
      expect(formModel.description()).to.equal(form.description);
      expect(formModel.encounterTypeUuid()).to.equal(form.encounterType.uuid);
      expect(formModel.encounterTypeName()).to.equal(form.encounterType.name);
      expect(formModel.version()).to.equal(form.version);
      expect(formModel.published()).to.equal(form.published);
    });
    
    it('toArrayOfModels should create an array of models given an array of ' +
       'form resources from OpenMRS', function() {
      var models = new formModelFactory.toArrayOfModels(openmrsForms);
      
      expect(models).to.be.an.array;
      expect(models.length).to.be.equal(2);
      expect(models[0].uuid()).to.equal(openmrsForms[0].uuid);
      expect(models[1].uuid()).to.equal(openmrsForms[1].uuid);   
    });
    
    it('toArrayOfModels should throw an error if the passed argument is not ' +
       'an array', function() {
        expect(function() { formModelFactory.toArrayOfModels(10)}).to.
          throw('An array argument required'); 
        expect(function() { formModelFactory.toArrayOfModels([])}).to.not.throw();  
    });
  });
})();
