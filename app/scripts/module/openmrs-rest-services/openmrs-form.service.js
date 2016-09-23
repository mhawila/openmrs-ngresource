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
    'DEFAULT_FORM_REP'
  ];

  function FormResService(OpenmrsSettings, $http, $resource, Restangular, $q, 
    $log, DEFAULT_FORM_REP) {
    // Some local variables
    var _baseRestUrl = null;
    
    var serviceDefinition;

    serviceDefinition = {
      getFormByUuid: getFormByUuid,
      getFormSchemaByUuid: getFormSchemaByUuid,
      deleteFormSchemaByUuid: deleteFormSchemaByUuid,
      findPocForms: findPocForms,
      findForms: findForms,
      uploadFormResource: uploadFormResource,
      saveForm: saveForm,
      updateForm: updateForm,
      retireForm: retireForm,
      saveFormResource: saveFormResource,
      deleteFormResource: deleteFormResource,        
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
    
    function __getResource(cachingEnabled, rep) {
      var rep = rep || DEFAULT_FORM_REP;
      return $resource(getFormBaseUrl() + 'form/:uuid?v=' + rep,
        { uuid: '@uuid' },{ 
          query: { 
            method: 'GET',
            isArray: false,
            cache: cachingEnabled? true: false 
          } 
        });
    }
    
    function __getSearchResource(cachingEnabled, rep) {
      var rep = rep || DEFAULT_FORM_REP;
      return $resource(getFormBaseUrl() + 'form?q=:q&v=' + DEFAULT_FORM_REP,
        { q: '@q' }, {
          query: {
            method: 'GET',
            isArray: false,
            cache: cachingEnabled? true: false
          }
        });
    }
    
    /**
     * findForms accepts params which can be simple search string or an object
     * containing searchText, representation and caching option.
     * @example params: 'order' or {searchText: 'order', v: 'custom:(uuid,name)'}
     * @param params: can be a search text or object param
     * @return a promise of the rest request.
     */
    function findForms(params, successCallback, failedCallback) {
      if(angular.isDefined(params) && typeof params === 'string') {
        var searchText = params;
        var resource = __getSearchResource();
      } else {
        var searchText = params.searchText;
        var rep = params.v || DEFAULT_FORM_REP;
        var cachingEnabled = params.caching ? true : false;
        var resource = __getSearchResource(cachingEnabled, rep);
      }
      var promise = resource.query({ q: searchText }).$promise
        .then(function(response) {
          return wrapForms(response.results ? response.results : response);
        })
        .catch(function(error) {
          return $q.reject(error);
        });
        
        __handleCallbacks(promise, successCallback, failedCallback);
        return promise;
    }
    
    /**
     *@deprecated since version 0.2.4, will be removed in version 1.0.0.
     *Use findForms instead.
     */
    function findPocForms(params, successCallback, failedCallback) {
      $log.warn('Calling deprecated function findPocForms, '
                + 'this function will be removed in version 1.0.0');
      return findForms(params, successCallback, failedCallback);
    }
    /**
     * getFormByUuid accepts params which can be simple uuid string or an object
     * containing uuid & representation along with caching option.
     * @param params: can be string form uuid or object
     * @return a promise of the rest request.
     */
    function getFormByUuid(params, successCallback, failedCallback) {
      if (angular.isDefined(params) && typeof params === 'string') {
          var formUuid = params;
          var resource = __getResource();
      } else {
          var formUuid = params.uuid;
          var rep = params.v || DEFAULT_FORM_REP;
          var cachingEnabled = params.caching ? true : false;
          var resource = __getResource(cachingEnabled, rep);
      }
      var promise = resource.query({ uuid: formUuid }).$promise
        .then(function(data) {
          return __toModel(data);
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
     * saveForm takes form openmrs payload and post it returning a promise
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
     * updateForm post an updated existing form
     * @param formUuid: uuid of form to be updated
     * @param form: form payload to be posted (make sure uuid is not there)
     * return promise of posted form
     */
     function updateForm(formUuid, form) {
       if(arguments.length !== 2) {
         throw new Error('Error: Function expects a form uuid and a payload '
                         + ' as arguments in that order');
       }
       var url = getFormBaseUrl() + 'form/' + formUuid;
       return $resource(url).save(form).$promise;
     } 
     
     /**
      * retireForm Retires an existing form
      * @param {string} formUuid - UUID of the form to be retired (Must)
      * @param {string} reason - Reason for retiring the form (optional)
      * @return {promise}  A promise of delete request
      * @throws Will throw an error formUuid is null
      */
     function retireForm(formUuid, reason) {
       if(arguments.length == 0) {
         throw new Error('Error: Function expects a form uuid');
       }
       
       var url = getFormBaseUrl() + 'form/' + formUuid;
       if(typeof reason === 'string' && reason.length > 0) {
         url += '?reason=' + encodeURIComponent(reason);
       }
       return $resource(url).delete().$promise;
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
    
    /**
     * deleteFormResource() send a request to remove a given resource from openmrs
     * @param formUuid: uuid of the form associated with the resource
     * @param resourceUuid: uuid of the resource to be deleted
     * @return promise of the delete request 
     */
    function deleteFormResource(formUuid, resourceUuid) {
      if(arguments.length !== 2) {
        throw new Error('Error: Function expects a form uuid and a resource uuid'
                        + ' as arguments in that order');
      }
      
      var urlSuffix = 'form/' + formUuid + '/resource/' + resourceUuid;
      return $resource(getFormBaseUrl() + urlSuffix).delete().$promise;
    } 
    
    /**
     * deleteFormSchemaByUuid() sends a request to remove a schema/clobdata
     * openmrs
     * @param schemaUuid: uuid of the schema to be deleted
     * @return promise of the delete request
     */
    function deleteFormSchemaByUuid(schemaUuid) {
      if(!schemaUuid || typeof schemaUuid !== 'string') {
        throw new Error('Error: Function expects a schema uuid as argument');
      }
      var url = getFormBaseUrl() + 'clobdata/' + schemaUuid;
      return $resource(url).delete().$promise;
    }
    
    function wrapForms(forms) {
      var wrappedObjects = [];
      _.each(forms, function(_form) {
        wrappedObjects.push(__toModel(_form));
      });

      return wrappedObjects;
    }
    
    function __toModel(openmrsForm) {
      var encounterType = openmrsForm.encounterType || {};
      return {
        uuid:openmrsForm.uuid,
        name: openmrsForm.name,
        description: openmrsForm.description,
        encounterTypeUuid: encounterType.uuid,
        encounterTypeName: encounterType.name,
        version: openmrsForm.version,
        published: openmrsForm.published,
        resources: openmrsForm.resources || [],
        auditInfo: openmrsForm.auditInfo
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
