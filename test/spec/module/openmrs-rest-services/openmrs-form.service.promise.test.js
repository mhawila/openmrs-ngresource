/* global afterEach */
/* global describe */
/* global inject */
/* global beforeEach */
/* global expect */
/* global it */
/*jshint -W026, -W030 */
/*jscs:disable safeContextKeyword, requireDotNotation, requirePaddingNewLinesBeforeLineComments, requireTrailingComma*/
(function() {
  'use strict';

  describe('OpenMRS Promise Based Form Service Unit Tests', function() {
    beforeEach(function() {
      module('openmrs-ngresource.restServices');
      module('mock.data');
    });

    var callbacks;
    var mockData;
    var httpBackend;
    var formService;
    var settingsService;
    var v;
    var testUrl = 'https://test-url/ws/rest/v1/';

    beforeEach(inject(function($injector) {
      httpBackend = $injector.get('$httpBackend');
      formService = $injector.get('FormResService');
      settingsService = $injector.get('OpenmrsSettings');
      mockData = $injector.get('mockData');
      v = $injector.get('DEFAULT_FORM_REP');
      $injector.get('Restangular').setBaseUrl(testUrl);
      
      // set test URL
      formService.setFormBaseUrl(testUrl);
    }));

    beforeEach(inject(function() {
      callbacks = {
        onSuccessCalled: false,
        onFailedCalled: false,
        message: null,
        onSuccess: function() {
          callbacks.onSuccessCalled = true;
        },

        onFailure: function(message) {
          callbacks.onFailedCalled = true;
          callbacks.message = message;
        }
      };

    }));

    afterEach(function() {
      httpBackend.verifyNoOutstandingExpectation();
    });

    it('should make an api call to the form resource when ' +
     'getFormByUuid is called with a uuid and return a promise when ' +
     'no callbacks are passed', function() {
      var selectedForm = mockData.getMockedFormList();
      httpBackend.expectGET(testUrl + 'form/passed-uuid?v=' + v)
        .respond(selectedForm.results[0]);
      
      formService.getFormByUuid('passed-uuid').then(function(data) {
        expect(data.uuid).to.equal('passed-uuid');
        expect(data.encounterTypeUuid).to.equal('0010c6dffd0f');
        expect(data.encounterTypeName).to.equal('ADULTRETURN');
        expect(data.name).to.equal('AMPATH POC Adult Return Visit Form v0.01');
      });

      httpBackend.flush();
    });
    
    it('getFormByUuid should return a rejected promise when an error occur',
       function(){
         var errorMessage = 'something went wrong';
         httpBackend.expectGET(testUrl + 'form/passed-uuid?v=' + v)
            .respond(500, errorMessage);
         
        // This is bad because it does not exactly test whether the promise
        // was rejected as required. 
        formService.getFormByUuid('passed-uuid').then(function(data){
          // if this called it should failed
          expect('this').to.equal('that');
        }, function(err) {
          // This is what is expected to be called
          expect(err.data).to.equal(errorMessage);
        });
        
         httpBackend.flush();
    });

    it('should make an api call to the form resource when ' +
     'findForms is called with a passed-text and return a promise when ' +
     'no callbacks are passed', function() {
      httpBackend.expectGET(testUrl + 'form?q=passed-text&v=' + v)
        .respond(mockData.getMockedFormList());
      
      formService.findForms('passed-text').then(function(data) {
          expect(data[0].uuid).to.equal('passed-uuid');
          expect(data[0].encounterTypeUuid).to.equal('0010c6dffd0f');
          expect(data[0].encounterTypeName).to.equal('ADULTRETURN');
          expect(data[0].name).to.equal('AMPATH POC Adult Return Visit Form v0.01');
        });

      httpBackend.flush();
    });
    
    it('getFormSchemaByUuid should request an appropriate rest end point given '
     + 'schema uuid', function() {
       var testUuid = 'test-schema-uuid';
       var expectedSchema = mockData.getMockSchema();
       httpBackend.expectGET(testUrl + 'clobdata/' + testUuid)
        .respond(expectedSchema);
        
       formService.getFormSchemaByUuid(testUuid).then(function(data) {
         expect(data).to.be.an.object;
         expect(JSON.stringify(data)).to.deep.equal(JSON.stringify(expectedSchema));
         expect(data.name).to.equal(expectedSchema.name);
       });
       httpBackend.flush();    
     });
        
    it('getFormSchemaByUuid should throw an error if no uuid is passed', function() {
      expect(function(){ formService.getFormSchemaByUuid() }).to.throw.error;
      expect(function(){ formService.getFormSchemaByUuid({stuff:'stuff'}) })
        .to.throw.error;
    }); 
    
    it('uploadFormResource() should post the passed file blob', function() {
      var data = new Blob([JSON.stringify({test:'data'}, null, 2)], 
                                            {type:'application/json'});
      
      var formData = new FormData();
      formData.append('file', data);
                                            
      httpBackend.expectPOST(testUrl + 'clobdata', formData)
       .respond('uuid-created-resource');
      
      formService.uploadFormResource(data).then(function(res) {
        console.log(JSON.stringify(res));
        expect(res.data).to.equal('uuid-created-resource');
      });
      
      httpBackend.flush();
    });
    
    it('uploadFormResource() should throw exception if no file is passed',
       function() {
      expect(formService.uploadFormResource.bind(formService,null)).to.throw(Error);    
    });
    
    it('saveForm() should throw error when argument is null', function() {
      expect(formService.saveForm.bind(formService)).to.throw(Error);     
    });
    
    it('saveForm() should post to backend with correct uri', function() {
      var dummyForm = {
        name: 'New Form',
        version: '1.0'
      };
      var response = _.extend({}, dummyForm, { uuid: 'new-form-uuid'});
      httpBackend.expectPOST(testUrl + 'form', dummyForm).respond(201, response);
      formService.saveForm(dummyForm).then(function(data) {
        expect(data.uuid).to.equal(response.uuid);
      });
      httpBackend.flush();
    });
    
    it('saveFormResource should throw error if wrong number of arguments ' +
       'is passed', function() {
      expect(formService.saveFormResource.bind(formService)).to.throw(Error);
      expect(formService.deleteFormResource.bind(formService)).to.throw(Error);   
    });
    
    it('saveFormResource should post resource to right uri', function() {
      var formUuid = 'some-uuid';
      var resource = {
        name: 'test-resource',
        dataType: 'AmpathJsonSchema',
        valueReference: 'some-existing-clob-uuid'
      }
      var response = _.extend({}, resource, {uuid:'new-created-uuid'});
      
      httpBackend.expectPOST(testUrl + 'form/' + formUuid + '/resource')
        .respond(201, response);
        
      formService.saveFormResource(formUuid, resource).then(function(data) {
        expect(data.uuid).to.equal(response.uuid);
      });
      
      httpBackend.flush();
    });
    
    it('deleteFormResource should send a request to delete a resource', 
    function() {
      var expectUrl = testUrl + 'form/form-uuid/resource/resource-uuid';
      httpBackend.expectDELETE(expectUrl).respond(204);
      formService.deleteFormResource('form-uuid','resource-uuid');
      httpBackend.flush();
    });
    
    it('deleteFormSchemaByUuid should send a request to delete ' +
     'schema/clobdata', function() {
       var testUuid = 'schema-test-uuid';
       var expectUrl = testUrl + 'clobdata/' + testUuid;
       httpBackend.expectDELETE(expectUrl).respond(200);
       formService.deleteFormSchemaByUuid(testUuid);
       httpBackend.flush();
     });
     
     it('updateForm() should post to backend with correct uri', function() {
       var dummyForm = {
         name: 'New Form',
         version: '1.0'
       };
       var formUuid = 'test-form-uuid';
       var response = _.extend({}, dummyForm, { uuid: formUuid});
       
       httpBackend.expectPOST(testUrl + 'form/' + formUuid, dummyForm)
       .respond(201, response);
       
       formService.updateForm(formUuid, dummyForm).then(function(data) {
         expect(data.uuid).to.equal(formUuid);
       });
       httpBackend.flush();
     });
  });   
})();
