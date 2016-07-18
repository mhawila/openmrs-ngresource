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
    '$http',
    '$resource',
    'Restangular',
    '$q',
    '$log',
    'FORM_REP'
  ];

  function FormResService(OpenmrsSettings, $http, $resource, Restangular, $q, 
    $log, FORM_REP) {
    // Some local variables
    var _baseRestUrl = null;
    
    var serviceDefinition;

    serviceDefinition = {
      getFormByUuid: getFormByUuid,
      getFormSchemaByUuid: getFormSchemaByUuid,
      findPocForms: findPocForms,
      uploadFormResource: uploadFormResource,
      saveForm: saveForm,
      saveFormResource: saveFormResource,        
      getFormBaseUrl: getFormBaseUrl,
      setFormBaseUrl: setFormBaseUrl
    };

    return serviceDefinition;
    
    function getFormBaseUrl() {
      return _baseRestUrl !== null ? _baseRestUrl 
                    : OpenmrsSettings.getCurrentRestUrlBase().trim();
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
    
    /**
     * uploadFormResource takes a raw file and returns a promise
     * if successfully the openmrs server returns the uuid of the newly
     * created resource.
     * @params file a Blob instance 
     *            (see #https://developer.mozilla.org/en-US/docs/Web/API/Blob)
     * @return promise/Future for the request to the file.
     */
    function uploadFormResource(file) {
      if(file === null || file === undefined) {
        throw new Error('Error: Function expects a raw file object argument');
      }
      var formData = new FormData();
      formData.append('file', file);
      
      var uploadUrl = getFormBaseUrl() + 'clobdata';
      
      return $http.post(uploadUrl, formData, {
        transformRequest: angular.identity,
        transformResponse: angular.identity,
        headers: { 'Content-Type': undefined}
      });
    }
    
    /**
     * saveForm takes form openmrs payload and saves post it returning a promise
     * @param form: an openmrs rest form payload
     * @return promise
     */
    function saveForm(form) {
      if(form === null || form === undefined) {
        throw new Error('Error: Function expects an openmrs form payload argument');
      }
      return $resource(getFormBaseUrl() + 'form').save(form).$promise;
    }
     
    /**
     * saveFormResource() post a resource for a given form uuid
     * @param formUuid: uuid of the form for which resource is to be posted
     * @param resource: Openmrs form resource payload
     * @return promise of posted resource
     */
    function saveFormResource(formUuid, resource) {
      if(arguments.length !== 2) {
        throw new Error('Error: Function expects a form uuid and a resource '
                        + ' as arguments in that order');
      }
      
      if(resource.dataType === undefined) {
        $log.debug('Saving resource without datatype');
      }
      
      var urlSuffix = 'form/' + formUuid + '/resource';
      return $resource(getFormBaseUrl() + urlSuffix).save(resource).$promise;
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
