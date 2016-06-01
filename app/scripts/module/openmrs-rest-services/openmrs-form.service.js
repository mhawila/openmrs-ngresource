/*
jshint -W003,-W109, -W106, -W098, -W003, -W068, -W004, -W033, -W030, -W117, -W116, -W069, -W026
*/
/*jscs:disable requireDotNotation, requirePaddingNewLinesBeforeLineComments, requireTrailingComma*/
(function() {
  'use strict';

  angular
    .module('openmrs-ngresource.restServices')
    .service('FormResService', FormResService);

  FormResService.$inject = [
    'OpenmrsSettings',
    '$resource',
    'Restangular',
    '$q',
    'FORM_REP'
  ];

  function FormResService(OpenmrsSettings, $resource, Restangular, $q, FORM_REP) {
    // Some local variables
    var _baseRestUrl = OpenmrsSettings.getCurrentRestUrlBase().trim();
    
    var serviceDefinition;

    serviceDefinition = {
      getFormByUuid: getFormByUuid,
      getFormSchemaByUuid: getFormSchemaByUuid,
      findPocForms: findPocForms,        
      getFormBaseUrl: getFormBaseUrl,
      setFormBaseUrl: setFormBaseUrl
    };

    return serviceDefinition;
    
    function getFormBaseUrl() {
      return _baseRestUrl;
    }
    
    function setFormBaseUrl(url) {
      _baseRestUrl = url;
    }
    
    function __getResource() {
      return $resource(getFormBaseUrl() + 'form/:uuid?v=' + FORM_REP,
        { uuid: '@uuid' },{ query: { method: 'GET', isArray: false } });
    }
    
    function __getSearchResource() {
      return $resource(getFormBaseUrl() + 'form?q=:q&v=' + FORM_REP,
        { q: '@q' }, { query: { method: 'GET', isArray: false } });
    }

    function findPocForms(searchText, successCallback, failedCallback) {
      var promise = __getSearchResource().get({ q: searchText }).$promise
        .then(function(response) {
          return wrapForms(response.results ? response.results : response);
        })
        .catch(function(error) {
          return $q.reject(error);
        });
        
        __handleCallbacks(promise, successCallback, failedCallback);
        return promise;
    }

    function getFormByUuid(uuid, successCallback, failedCallback) {
      var resource = __getResource();
      var promise = resource.get({ uuid: uuid }).$promise
        .then(function(data) {
          return __toModel(data);
          // successCallback(__toModel(data));
        })
        .catch(function(err) {
           return $q.reject(err);
        });
        
        __handleCallbacks(promise, successCallback, failedCallback);
        return promise;
    }
    
    /**
     * getFormSchemaByUuid retrieves a form schema with given UUID from OpenMRS
     * Takes params as an argument which can be either a simple uuid string or
     * an object having the following properties
     *  uuid: form schema uuid, i.e resources's valueReference (must be provided)
     *  caching: true/false (Default true) 
     *          (whether to enable caching or not for this request (optional))
     * @param params 
     * @returns a promise
     */
    function getFormSchemaByUuid(params) {
      if(params === null || params === undefined) {
        throw new Error('Function expects an argument');
      }
      var requestParams = {} , cachingEnabled = true;
      if(angular.isDefined(params) && typeof params === 'string') {
           requestParams = { uuid: params };
      } else {
        // Assume params is an object otherwise it will fail of course
        if(params.uuid === null || params.uuid === undefined) {
          throw new Error('Oops! The parameter object should have uuid property defined!');
        }
        requestParams.uuid = params.uuid;
        if(angular.isDefined(params.caching)) {
          cachingEnabled = params.caching;
        } 
      } //end if else
      
      // Do the thing now and return the promise
      var schema = $resource(getFormBaseUrl() + 'clobdata/:uuid',
        { uuid: '@uuid' },
        { query: { method: 'GET', isArray: false, cache: cachingEnabled } });
        
      return schema.get(requestParams).$promise
        .then(function(data) {
          return data;
        })
        .catch(function (err) {
          return $q.reject(err);
      });
    }
    
    function wrapForms(forms) {
      var wrappedObjects = [];
      _.each(forms, function(_form) {
        wrappedObjects.push(__toModel(_form));
      });

      return wrappedObjects;
    }
    
    function __toModel(openmrsForm) {
      return {
        uuid:openmrsForm.uuid,
        name: openmrsForm.name,
        encounterTypeUuid: openmrsForm.encounterType.uuid,
        encounterTypeName: openmrsForm.encounterType.name,
        version: openmrsForm.version,
        published: openmrsForm.published,
        resources: openmrsForm.resources || []
      };
    }
    
    // Function to handle the old callback style
    function __handleCallbacks(promise, successCallback, failedCallback) {
      if(typeof successCallback === 'function') {
        // caller passed a success function, call it
        promise.then(function(data) {
          successCallback(data);
        }, function(err) {
          if(typeof failedCallback === 'function') {
            failedCallback(err);
          } else {
            // just log it
            console.error(err);
          }
        });
      } 
    }
    
  }
})();
