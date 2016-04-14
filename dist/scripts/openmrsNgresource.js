/*jscs:disable disallowMixedSpacesAndTabs, requireDotNotation, requirePaddingNewLinesBeforeLineComments, requireTrailingComma*/
(function() {
  'use strict';

  angular
        .module('openmrs-ngresource.restServices', [
            'base64',
            'ngResource',
            'ngCookies',
            'openmrs-ngresource.models',
            'restangular'
        ])
        .run(RestangularConfig);

  RestangularConfig.$inject = ['Restangular', 'OpenmrsSettings'];

  function RestangularConfig(Restangular, OpenmrsSettings) {  // jshint ignore:line
    // Should of the form /ws/rest/v1 or https://host/ws/rest/v1
    Restangular.setBaseUrl(OpenmrsSettings.getCurrentRestUrlBase().trim());
  }
})();

(function() {
  'use strict';

  angular
        .module('openmrs-ngresource.models', [
          'openmrs-ngresource.utils'
        ]);
})();

/*jshint -W098, -W030 */

(function() {
  'use strict';
  var app = angular.module('openmrs-ngresource.utils', []);
})();

/* global _ */
/*jshint -W003, -W098, -W117, -W026 */
(function () {
  'use strict';

  angular
    .module('openmrs-ngresource.restServices')
    .service('ConceptResService', ProviderResService);

  ProviderResService.$inject = ['OpenmrsSettings', '$resource'];

  function ProviderResService(OpenmrsSettings, $resource) {
    var serviceDefinition;
    serviceDefinition = {
      getResource: getResource,
      getConceptClassResource: getConceptClassResource,
      getSearchResource: getSearchResource,
      getConceptClasses: getConceptClasses,
      getConceptByUuid: getConceptByUuid,
      findConcept: findConcept,
      findConceptByConceptClassesUuid: findConceptByConceptClassesUuid,
      filterResultsByConceptClassesUuid: filterResultsByConceptClassesUuid,
      filterResultsByConceptClassesName:filterResultsByConceptClassesName,
      getConceptAnswers:getConceptAnswers
    };
    return serviceDefinition;

    function getResource() {
      return $resource(OpenmrsSettings.getCurrentRestUrlBase().trim() + 'concept/:uuid?v=custom:(uuid,name,conceptClass)',
        { uuid: '@uuid' },
        { query: { method: 'GET', isArray: false } });
    }

    function getSearchResource() {
      return $resource(OpenmrsSettings.getCurrentRestUrlBase().trim() + 'concept?q=:q&v=custom:(uuid,name,conceptClass)',
        { q: '@q' },
        { query: { method: 'GET', isArray: false } });
    }

    function getConceptClassResource() {
      return $resource(OpenmrsSettings.getCurrentRestUrlBase().trim() + 'conceptclass',
        { uuid: '@uuid' },
        { query: { method: 'GET', isArray: false } });
    }

    function getConceptWithAnswersResource() {
      return $resource(OpenmrsSettings.getCurrentRestUrlBase().trim() + 'concept/:uuid?v=custom:(uuid,name,answers)',
        { q: '@q' },
        { query: { method: 'GET', isArray: false } });
    }

    function getConceptClasses(successCallback, failedCallback) {
      var resource = getConceptClassResource();
      return resource.get({ v: 'default' }).$promise
        .then(function (response) {
          successCallback(response.results ? response.results : response);
        })
        .catch(function (error) {
          failedCallback('Error processing request', error);
          console.error(error);
        });
    }

    function getConceptByUuid(uuid, successCallback, failedCallback) {
      var resource = getResource();
      return resource.get({ uuid: uuid }).$promise
        .then(function (response) {
          successCallback(response);
        })
        .catch(function (error) {
          failedCallback('Error processing request', error);
          console.error(error);
        });
    }

    function getConceptAnswers(uuid, successCallback, failedCallback) {
      var resource = getConceptWithAnswersResource();
      return resource.get({ uuid: uuid }).$promise
        .then(function (response) {
          successCallback(response);
        })
        .catch(function (error) {
          failedCallback('Error processing request', error);
          console.error(error);
        });
    }

    function findConcept(searchText, successCallback, failedCallback) {
      var resource = getSearchResource();
      return resource.get({ q: searchText }).$promise
        .then(function (response) {
          successCallback(response.results ? response.results : response);
        })
        .catch(function (error) {
          failedCallback('Error processing request', error);
          console.error(error);
        });
    }

    function findConceptByConceptClassesUuid(searchText, conceptClassesUuidArray, successCallback, failedCallback) {
      var resource = getSearchResource();

      return resource.get({ q: searchText }).$promise
        .then(function (response) {
          successCallback(response.results ? filterResultsByConceptClassesUuid(response.results, conceptClassesUuidArray) : response);
        })
        .catch(function (error) {
          failedCallback('Error processing request', error);
          console.error(error);
        });
    }

    function filterResultsByConceptClassesUuid(results, conceptClassesUuidArray) {
      var res = _.filter(results, function (result) {
        return _.find(conceptClassesUuidArray, function (uuid) {
          return result.conceptClass.uuid === uuid;
        });
      });
      return res;
    }

    function filterResultsByConceptClassesName(results, conceptClassesNameArray) {
      var res = _.filter(results, function (result) {
        return _.find(conceptClassesNameArray, function (name) {
          return result.conceptClass.name === name;
        });
      });
      return res;
    }

    function filterConceptAnswersByConcept(results, conceptUuid) {
      var res = _.filter(results, function (result) {
        return _.find(conceptUuid, function (name) {
          return result.uuid === name;
        });
      });
      return res;
    }

  }
})();

/* global _ */
/*jshint -W003, -W098, -W117, -W026 */
(function () {
  'use strict';

  angular
    .module('openmrs-ngresource.restServices')
    .service('DrugResService', DrugResService);

  DrugResService.$inject = ['OpenmrsSettings', '$resource'];

  function DrugResService(OpenmrsSettings, $resource) {
    var serviceDefinition;
    serviceDefinition = {
      getResource: getResource,
      getSearchResource: getSearchResource,
      getDrugByUuid: getDrugByUuid,
      findDrugs: findDrugs
    };

    return serviceDefinition;

    function getResource() {
      return $resource(OpenmrsSettings.getCurrentRestUrlBase().trim() + 'drug/:uuid?v=custom:(uuid,name,concept)',
        { uuid: '@uuid' },
        { query: { method: 'GET', isArray: false } });
    }

    function getSearchResource() {
      return $resource(OpenmrsSettings.getCurrentRestUrlBase().trim() + 'drug?q=:q&v=custom:(uuid,name,concept)',
        { q: '@q' },
        { query: { method: 'GET', isArray: false } });
    }


    function getDrugByUuid(uuid, successCallback, failedCallback) {
      var resource = getResource();
      return resource.get({ uuid: uuid }).$promise
        .then(function (response) {
          successCallback(response);
        })
        .catch(function (error) {
          failedCallback('Error processing request', error);
          console.error(error);
        });
    }

    function findDrugs(searchText, successCallback, failedCallback) {
      var resource = getSearchResource();
      return resource.get({ search: searchText }).$promise
        .then(function (response) {
          successCallback(response.results ? response.results : response);
        })
        .catch(function (error) {
          failedCallback('Error processing request', error);
          console.error(error);
        });
    }

  }
})();

/*
jshint -W026, -W116, -W098, -W003, -W068, -W069, -W004, -W033, -W030, -W117
*/
(function () {
    'use strict';

    angular
        .module('openmrs-ngresource.restServices')
        .factory('EncounterResService', EncounterResService);

    EncounterResService.$inject = ['Restangular', 'OpenmrsSettings', '$resource'];

    function EncounterResService(Restangular, OpenmrsSettings, $resource) {
        var service = {
            getEncounterByUuid: getEncounterByUuid,
            saveEncounter: saveEncounter,
            getPatientEncounters: getPatientEncounters,
            voidEncounter: voidEncounter
        };

        return service;

        function getResource(cachingEnabled) {
            var v = 'custom:(uuid,encounterDatetime,' +
                'patient:(uuid,uuid),form:(uuid,name),' +
                'location:ref,encounterType:ref,provider:ref,' +
                'obs:(uuid,obsDatetime,concept:(uuid,uuid),value:ref,groupMembers))';
            return $resource(OpenmrsSettings.getCurrentRestUrlBase().trim() + 'encounter/:uuid',
                { uuid: '@uuid', v: v },
                { query: { method: 'GET', isArray: false, cache: cachingEnabled? true: false } });
        }

        function voidEncounter(uuid, successCallback, errorCallback) {
            Restangular.one('encounter', uuid).remove().then(function (response) {
                if (typeof successCallback === 'function') {
                    successCallback(response);
                }
            }, function (error) {
                if (typeof errorCallback === 'function') {
                    errorCallback(error);
                }
            });
        }

        function getEncounterByUuid(params, successCallback, errorCallback, cachingEnabled) {
            var objParams = {};
            var _customDefaultRep = 'custom:(uuid,encounterDatetime,' +
                'patient:(uuid,uuid,identifiers),form:(uuid,name),' +
                'location:ref,encounterType:ref,provider:ref,' +
                'obs:(uuid,obsDatetime,concept:(uuid,uuid,name:(display)),value:ref,groupMembers))';

            if (angular.isDefined(params) && typeof params === 'string') {
                var encounterUuid = params;
                objParams = { 'encounter': encounterUuid, 'v': _customDefaultRep };
            } else {
                objParams = {
                    'encounter': params.uuid,
                    'v': params.rep || _customDefaultRep
                };
            }
            Restangular.one('encounter', objParams.encounter).withHttpConfig({ cache: cachingEnabled? true: false}).get({ v: objParams.v }).then(function (data) {
                _successCallbackHandler(successCallback, data);
            },
                function (error) {
                    console.log('An error occured while attempting to fetch encounter ' +
                        'with uuid ' + params.patientUuid);
                    if (typeof errorCallback === 'function') errorCallback(error);
                });
        }

        function saveEncounter(encounter, successCallback, errorCallback) {

            var _encounter = JSON.parse(encounter);
            var encounterResource = getResource();

            if (_encounter.uuid !== undefined) {
                var uuid = _encounter.uuid;
                delete _encounter['uuid'];

                console.log('update json');
                console.log(JSON.stringify(_encounter));
                //updating an existing encounter
                // Restangular.one('encounter', uuid).customPOST(JSON.stringify(_encounter)).then(function (success) {
                //     console.log('Encounter saved successfully');
                //     if (typeof successCallback === 'function') successCallback(success);
                // },
                //     function (error) {
                //         console.log('Error saving encounter');
                //         if (typeof errorCallback === 'function') errorCallback(error);
                //    });

                encounterResource.save({ uuid: uuid }, JSON.stringify(_encounter)).$promise
                    .then(function (data) {
                        console.log('Encounter saved successfully');
                        if (typeof successCallback === 'function') successCallback(data);
                    })
                    .catch(function (error) {
                        console.log('Error saving encounter');
                        if (typeof errorCallback === 'function')
                            errorCallback(error);
                    });
            }
            else {
                // Restangular.service('encounter').post(encounter).then(function (success) {
                //     console.log('Encounter saved successfully');
                //     if (typeof successCallback === 'function') successCallback(success);
                // },
                //     function (error) {
                //         console.log('Error saving encounter');
                //         if (typeof errorCallback === 'function') errorCallback(error);
                //     });
                encounterResource.save(encounter).$promise
                    .then(function (data) {
                        console.log('Encounter saved successfully');
                        if (typeof successCallback === 'function')
                            successCallback(data);
                    })
                    .catch(function (error) {
                        console.log('Error saving encounter');
                        if (typeof errorCallback === 'function')
                            errorCallback(error);
                    });
            }
        }

        function getPatientEncounters(params, successCallback, errorCallback, cachingEnabled) {
            var objParams = {};

            // Don't include obs by default
            var _customDefaultRep = 'custom:(uuid,encounterDatetime,' +
                'patient:(uuid,uuid),form:(uuid,name),' +
                'location:ref,encounterType:ref,provider:ref)';

            if (angular.isDefined(params) && typeof params === 'string') {
                var patientUuid = params;
                objParams = { 'patient': patientUuid, 'v': _customDefaultRep }
            } else {
                var v = params.rep || params.v;
                objParams = {
                    'patient': params.patientUuid,
                    'v': v || _customDefaultRep
                };

                /* jshint ignore: start */
                delete params.patientUuid;
                delete params.rep;
                /* jshint ignore: end */

                //Add objParams to params and assign it back objParams
                params.patient = objParams.patient;
                params.v = objParams.v;

                objParams = params;
            }

            Restangular.one('encounter').withHttpConfig({ cache: cachingEnabled? true: false}).get(objParams).then(function (data) {
                if (angular.isDefined(data.results)) data = data.results;
                _successCallbackHandler(successCallback, data.reverse());
            },
                function (error) {
                    console.log('An error occured while attempting to fetch encounters ' +
                        'for patient with uuid ' + params.patientUuid);
                    if (typeof errorCallback === 'function') errorCallback(error);
                });
        }

        function _successCallbackHandler(successCallback, data) {
            if (typeof successCallback !== 'function') {
                console.log('Error: You need a callback function to process' +
                    ' results');
                return;
            }
            successCallback(data);
        }
    }
})();

/* global _ */
/*jshint -W003, -W098, -W117, -W026 */
(function () {
  'use strict';

  angular
    .module('openmrs-ngresource.restServices')
    .service('IdentifierResService',IdentifierResService);

  IdentifierResService.$inject = ['OpenmrsSettings', '$resource'];

  function IdentifierResService(OpenmrsSettings, $resource) {
    var serviceDefinition;
    serviceDefinition = {
      getResource: getResource,
      getPatientIdentifiers: getPatientIdentifiers
    };
    return serviceDefinition;

    function getResource() {
      return $resource(OpenmrsSettings.getCurrentRestUrlBase().trim() + 'patient/:uuid/identifier',
        {q: '@q'},
        {query: {method: 'GET', isArray: false}});
    }

    function getPatientIdentifiers(uuid, successCallback, failedCallback) {
      var resource = getResource();
      return resource.get({uuid: uuid}).$promise
        .then(function (response) {
          console.log('This is Identifier Object', response);
          successCallback(response);

        })
        .catch(function (error) {
          failedCallback('Error processing request', error);
          console.error(error);
        });
    }
  }
})();


/*
jshint -W026, -W116, -W098, -W003, -W068, -W069, -W004, -W033, -W030, -W117
*/
(function() {
  'use strict';

  angular
    .module('openmrs-ngresource.restServices')
    .service('LocationResService', LocationResService);

  LocationResService.$inject = ['OpenmrsSettings', '$resource', '$rootScope', 'CachedDataService'];

  function LocationResService(OpenmrsSettings, $resource, $rootScope, CachedDataService) {
    var serviceDefinition;

    var cachedLocations = [];

    serviceDefinition = {
      initialize: initialize,
      getResource: getResource,
      searchResource: searchResource,
      getListResource: getListResource,
      getLocations: getLocations,
      getLocationByUuid: getLocationByUuid,
      findLocation: findLocation,
      cachedLocations: cachedLocations
    };

    return serviceDefinition;

    function initialize() {
      getLocations(function() {}, function() {});
    }

    function getResource() {
      return $resource(OpenmrsSettings.getCurrentRestUrlBase().trim() + 'location/:uuid', {
        uuid: '@uuid'
      }, {
        query: {
          method: 'GET',
          isArray: false
        }
      });
    }

    function getListResource() {
      return $resource(OpenmrsSettings.getCurrentRestUrlBase().trim() + 'location?v=default', {
        uuid: '@uuid'
      }, {
        query: {
          method: 'GET',
          isArray: false
        }
      });
    }

    function searchResource() {
      return $resource(OpenmrsSettings.getCurrentRestUrlBase().trim() + 'location?q=:search&v=default', {
        search: '@search'
      }, {
        query: {
          method: 'GET',
          isArray: false
        }
      });
    }

    function getLocationByUuid(uuid, successCallback, failedCallback) {
      var resource = getResource();
      return resource.get({
          uuid: uuid
        }).$promise
        .then(function(response) {
          successCallback(response);
        })
        .catch(function(error) {
          failedCallback('Error processing request', error);
          console.error(error);
        });
    }

    function findLocation(searchText, successCallback, failedCallback) {
      var resource = searchResource();
      return resource.get({
          search: searchText
        }).$promise
        .then(function(response) {
          successCallback(response.results ? response.results : response);
        })
        .catch(function(error) {
          failedCallback('Error processing request', error);
          console.error(error);
        });
    }

    function getLocations(successCallback, failedCallback, refreshCache) {
      var resource = getListResource();
      //console.log(serviceDefinition.cachedLocations);
      if (refreshCache === false && serviceDefinition.cachedLocations.length !== 0) {
        successCallback(serviceDefinition.cachedLocations);
        return {
          results: serviceDefinition.cachedLocations
        };
      }

      return resource.get().$promise
        .then(function(response) {
          serviceDefinition.cachedLocations = response.results ? response.results : response;
          successCallback(response.results ? response.results : response);
        })
        .catch(function(error) {
          failedCallback('Error processing request', error);
          console.error(error);
        });
    }
  }
})();

/*
jshint -W026, -W116, -W098, -W003, -W068, -W069, -W004, -W033, -W030, -W117
*/
/*
jscs:disable disallowQuotedKeysInObjects, safeContextKeyword, requireDotNotation, requirePaddingNewLinesBeforeLineComments, requireTrailingComma
*/
(function() {
  'use strict';

  angular
    .module('openmrs-ngresource.restServices')
          .factory('ObsResService', ObsResService);

  ObsResService.$inject = ['OpenmrsSettings', '$resource'];

  function ObsResService(OpenmrsSettings, $resource) {
    var service = {
      getObsByUuid: getObsByUuid,
      saveUpdateObs:saveUpdateObs,
      voidObs: voidObs
    };

    return service;

    function getResource() {
      var v = 'custom:(uuid,obsDatetime,concept:(uuid,uuid),groupMembers,value:ref)';
      return $resource(OpenmrsSettings.getCurrentRestUrlBase().trim() + 'obs/:uuid',
        { uuid: '@uuid', v:v},
        { query: { method: 'GET', isArray: false } });
    }

    function saveUpdateObs(obs, successCallback, errorCallback) {
      // console.log('Received Obs', obs)
      var obsResource = getResource();
      var _obs = obs;
      if (obs.uuid !== undefined)
      {
        //update obs
        var uuid = obs.uuid;
        delete obs['uuid'];
        console.log('Stringified Obs', JSON.stringify(obs));
        obsResource.save({uuid: uuid }, JSON.stringify(obs)).$promise
          .then(function(data) {
          successCallback(data);
        })
          .catch(function(error) {
            console.error('An Error occured when saving Obs ', error);
            if (typeof errorCallback === 'function')
              errorCallback('Error processing request', error);
          });
        /*
        Plan B
        var _obs =JSON.parse(obs);
        var uuid = _obs.uuid
        delete _obs['uuid'];
        obsResource.save({uuid: uuid, value:JSON.stringify(_obs)}).$promise
          .then(function (data) {
          successCallback(data);
        })
          .catch(function (error) {
          errorCallback('Error processing request', error);
          console.error(error);
        });

        */
      } else {
        obsResource = getResource();
        obsResource.save(obs).$promise
        .then(function(data) {
        successCallback(data);
      })
        .catch(function(error) {
          console.error('An Error occured when saving Obs ', error);
          if (typeof errorCallback === 'function')
            errorCallback('Error processing request', error);
        });
      }
    }

    function getObsByUuid(obs, successCallback, errorCallback) {
      var obsResource = getResource();

      return obsResource.get({ uuid: obs.uuid }).$promise
        .then(function(data) {
        successCallback(data);
      })
        .catch(function(error) {
          console.error('An Error occured when getting Obs ', error);
          if (typeof errorCallback === 'function')
            errorCallback('Error processing request', error);
        });
    }

    function voidObs(obs, successCallback, errorCallback) {
      var obsResource = getResource();
      obsResource.delete({uuid:obs.uuid},
        function(data) {
          if (successCallback) {
            successCallback(data);
          } else return data;
        },

        function(error) {
          console.error('An Error occured when voiding Obs ', error);
          if (typeof errorCallback === 'function')
            errorCallback('Error processing request', error);
        }
      );
    }

  }
})();

/*
jshint -W003,-W109, -W106, -W098, -W003, -W068, -W004, -W033, -W030, -W117, -W116, -W069, -W026
*/
/*jscs:disable requireDotNotation, requirePaddingNewLinesBeforeLineComments, requireTrailingComma*/
(function() {
  'use strict';

  angular
    .module('openmrs-ngresource.restServices')
    .service('FormResService', FormResService);

  FormResService.$inject = ['OpenmrsSettings','$resource'];

  function FormResService(OpenmrsSettings, $resource) {
    var serviceDefinition;

    serviceDefinition = {
      getFormByUuid: getFormByUuid,
      findPocForms: findPocForms
    };

    return serviceDefinition;

    function getSearchResource() {
      return $resource(OpenmrsSettings.getCurrentRestUrlBase().trim() + 'form?q=:q&v=custom:(uuid,name,encounterType,version)',
        { q: '@q' },
        { query: { method: 'GET', isArray: false } });
    }

    function findPocForms(searchText, successCallback, failedCallback) {
      var resource = getSearchResource();
      return resource.get({ q: searchText }).$promise
        .then(function(response) {
          var wrapped = wrapForms(response.results ? response.results : response);
          // successCallback(response.results ? response.results : response);
          successCallback(wrapped);
        })
        .catch(function(error) {
          failedCallback('Error processing request', error);
          console.error(error);
        });
    }

    function getResource() {
      return $resource(OpenmrsSettings.getCurrentRestUrlBase().trim() + 'form/:uuid?v=custom:(uuid,name,encounterType,version)',
        { uuid: '@uuid' },
        { query: { method: 'GET', isArray: false } });
    }

    function getFormByUuid(uuid, successCallback, failedCallback) {
      var resource = getResource();
      return resource.get({ uuid: uuid }).$promise
        .then(function(response) {
          var _form = response;
          var form = {
            uuid:_form.uuid,
            name: _form.name,
            encounterTypeUuid: _form.encounterType.uuid,
            encounterTypeName: _form.encounterType.display,
            version: _form.version
          };
          successCallback(form);
        })
        .catch(function(error) {
          failedCallback('Error processing request', error);
          console.error(error);
        });
    }

    function wrapForms(forms) {
      var wrappedObjects = [];
      _.each(forms, function(_form) {
        var form = {
          uuid:_form.uuid,
          name: _form.name,
          encounterTypeUuid: _form.encounterType.uuid,
          encounterTypeName: _form.encounterType.display,
          version: _form.version
        };
        wrappedObjects.push(form);
      });

      return wrappedObjects;
    }

  }
})();

/*jshint -W003, -W098, -W117, -W026 */
(function() {
  'use strict';

  angular
    .module('openmrs-ngresource.restServices')
    .service('PatientResService', PatientResService);

  PatientResService.$inject = ['OpenmrsSettings', '$resource', 'PatientModel'];

  function PatientResService(OpenmrsSettings, $resource, PatientModel) {
    var service;
    var currentSession;
    service = {
      getPatientByUuid: getPatientByUuid,
      getPatientQuery: getPatientQuery
    };
    return service;
    function getResource() {
          var v = 'custom:(uuid,identifiers:(identifier,uuid,identifierType:(uuid,name)),person:(uuid,gender,birthdate,dead,age,deathDate,preferredName:(givenName,middleName,familyName),';
          v = v  + 'attributes,preferredAddress:(preferred,address1,address2,cityVillage,stateProvince,country,postalCode,countyDistrict,address3,address4,address5,address6)))';
      var r = $resource(OpenmrsSettings.getCurrentRestUrlBase().trim() + 'patient/:uuid',
                {uuid: '@uuid', v: v},
                {query: {method: 'GET', isArray: false}});
          return r;

        }

    function getPatientByUuid(params, callback) {
        var PatientRes = getResource();

        PatientRes.get(params, function(data) {
          //console.log(data);
          var p = {uuid:data.uuid,
            identifiers:data.identifiers,
            person:data.person};
          console.log(p);
          var d = new PatientModel.patient(p);
          callback(d);
        });
      }

    function getPatientQuery(params, callback) {
      var PatientRes = getResource();
      var patients = [];
      //console.log(params);
      PatientRes.query(params, false, function(data) {
        //console.log(data.results);
        angular.forEach(data.results, function(value, key) {
          //console.log(value);
          var myperson = value.person;
          var p = new PatientModel.patient(value);
          //console.log('Attedmted'+patientUuid);
          //console.log("New UUUID"+value.person.uuid+"d"+value.person.display);
          patients.push(p);
      });

        callback(patients);
      });
    }
  }
})();

/*
jshint -W117, -W098, -W116, -W003, -W026
*/
(function() {
  'use strict';

  angular
        .module('openmrs-ngresource.restServices')
        .factory('OpenmrsRestService', OpenmrsRestService);

  OpenmrsRestService.$inject = ['SessionResService',
                                'AuthService',
                                'PatientResService',
                                'UserResService',
                                'EncounterResService',
                                'LocationResService',
                                'ProviderResService',
                                'ObsResService',
                                'DrugResService',
                                'PatientResRelationshipService'];

  function OpenmrsRestService(session, authService, PatientResService,
              UserResService, EncounterResService, LocationResService,
              ProviderResService, ObsResService, DrugResService,PatientResRelationshipService) {
    var service = {
          getSession: getSession,
          getAuthService: getAuthService,
          getPatientService: getPatientService,
          getUserService: getUserService,
          getLocationResService: getLocationService,
          getEncounterResService: getEncounterService,
          getProviderResService:getProviderResService,
          getObsResService:getObsResService,
          getDrugResService:getDrugResService,
          getPatientRelationshipService:getPatientRelationshipService
        };

    return service;

    function getSession() {
      return session;
    }

    function getAuthService() {
      return authService;
    }

    function getPatientService() {
      return PatientResService;
    }

    function getPatientRelationshipService() {
      return PatientResRelationshipService;
    }

    function getUserService() {
      return UserResService;
    }

    function getEncounterService() {
      return EncounterResService;
    }

    function getLocationService() {
      return LocationResService;
    }

    function getProviderResService() {
      return ProviderResService;
    }

    function getObsResService() {
      return ObsResService;
    }

    function getDrugResService() {
      return DrugResService;
    }

    function getUserDefaultPropertiesService() {
      return UserDefaultPropertiesService;
    }
  }
}) ();

/*jshint -W003, -W026, -W117, -W098 */
(function () {
  'use strict';

  angular
    .module('openmrs-ngresource.restServices')
    .service('OpenmrsSettings', OpenmrsSettings);

  OpenmrsSettings.$inject = ['$cookies'];

  function OpenmrsSettings($cookies) {
    var serviceDefinition;
    var restUrlBaseList = [
      'https://test1.ampath.or.ke:8443/amrs/ws/rest/v1/',
      'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/',
      'https://etl1.ampath.or.ke:8443/amrs/ws/rest/v1/',
      'http://localhost:8080/openmrs/ws/rest/v1/'
    ];
    var restUrlBase = restUrlBaseList[0];

    initialize();
    serviceDefinition = {
      reInitialize: initialize,
      getCurrentRestUrlBase: getCurrentRestUrlBase,
      setCurrentRestUrlBase: setCurrentRestUrlBase,
      restUrlBase: restUrlBase,
      addUrlToList: addUrlToList,
      getUrlBaseList: getUrlBaseList,
      hasCoockiePersistedCurrentUrlBase: hasCoockiePersistedCurrentUrlBase
    };
    return serviceDefinition;

    function initialize() {

      var lastSetUrl = $cookies.get('restUrlBase');

      if (lastSetUrl) {
        restUrlBase = lastSetUrl;
      }
    }

    function hasCoockiePersistedCurrentUrlBase() {
      var lastSetUrl = $cookies.get('restUrlBase');

      if (lastSetUrl) {
        return true;
      }

      return false;
    }

    function getCurrentRestUrlBase() {
      return restUrlBase;
    }

    function setCurrentRestUrlBase(url) {
      restUrlBase = url;
      var d = new Date();
      d.setFullYear(2050);//expires in 2050
      $cookies.put('restUrlBase', url, { 'expires': d });
    }

    function getUrlBaseList() {
      return restUrlBaseList;
    }

    function addUrlToList(url) {
      restUrlBaseList.push(url);
    }
  }
})();

/*jshint -W003, -W098, -W117, -W026 */
(function () {
  'use strict';

  angular
    .module('openmrs-ngresource.restServices')
    .service('ProviderResService', ProviderResService);

  ProviderResService.$inject = ['OpenmrsSettings', '$resource'];

  function ProviderResService(OpenmrsSettings, $resource) {
    var serviceDefinition;
    serviceDefinition = {
      getResource: getResource,
      searchResource: searchResource,
      getProviderByUuid: getProviderByUuid,
      getProviderByPersonUuid: getProviderByPersonUuid,
      findProvider: findProvider
    };
    return serviceDefinition;

    function getResource() {
      return $resource(OpenmrsSettings.getCurrentRestUrlBase().trim() + 'provider/:uuid?v=full',
        { uuid: '@uuid' },
        { query: { method: 'GET', isArray: false } });
    }

    function getPersonResource() {
      return $resource(OpenmrsSettings.getCurrentRestUrlBase().trim() + 'person/:uuid',
        { uuid: '@uuid' },
        { query: { method: 'GET', isArray: false } });
    }

    function searchResource() {
        return $resource(OpenmrsSettings.getCurrentRestUrlBase().trim() + 'provider?q=:search&v=default',
        { search: '@search' },
        { query: { method: 'GET', isArray: false } });
    }

    function getProviderByUuid(uuid, successCallback, failedCallback) {
      var resource = getResource();
      return resource.get({ uuid: uuid }).$promise
        .then(function (response) {
        successCallback(response);
      })
        .catch(function (error) {
        failedCallback('Error processing request', error);
        console.error(error);
      });
    }

    function getProviderByPersonUuid(uuid, successCallback, failedCallback) {
      var resource = getPersonResource();
      return resource.get({ uuid: uuid }).$promise
        .then(function (response) {
        var provider = {person:response, display:response.display };
        successCallback(provider);
      })
        .catch(function (error) {
        failedCallback('Error processing request', error);
        console.error(error);
      });
    }

    function findProvider(searchText, successCallback, failedCallback) {
      var resource = searchResource();
      return resource.get({ search: searchText }).$promise
        .then(function (response) {
           successCallback(response.results? response.results: response);
      })
        .catch(function (error) {
        failedCallback('Error processing request', error);
        console.error(error);
      });
    }
  }
})();

/*jshint -W003, -W098, -W117, -W026 */
(function() {
  'use strict';

  angular
        .module('openmrs-ngresource.restServices')
        .service('SessionResService', SessionResService);

  SessionResService.$inject = ['OpenmrsSettings', '$resource'];

  function SessionResService(OpenmrsSettings, $resource) {
        var serviceDefinition;
        var currentSession;
        serviceDefinition = {
          getResource:getResource,
          getSession:getSession,
          currentSession:currentSession,
          deleteSession:deleteSession
        };
        return serviceDefinition;

        function getResource() {
          return $resource(OpenmrsSettings.getCurrentRestUrlBase().trim() + 'session');
        }

        function getSession(successCallback, failedCallback) {
          var resource = getResource();
          return resource.get({}).$promise
          .then(function(response) {
            serviceDefinition.currentSession = response.sessionId;
            successCallback(response);
          })
          .catch(function(error) {
            serviceDefinition.currentSession = null;
            failedCallback('Error processing request', error);
            console.error(error);
          });
        }

        function deleteSession(callback) {
          var resource = getResource();
          return resource.delete({}).$promise
          .then(function(response) {
            callback(response);
          })
          .catch(function(error) {
            callback(error);
            console.error(error);
          });
        }
      }
})();

/*
jshint -W003, -W026, -W098
*/
(function () {
  'use strict';

  angular
    .module('openmrs-ngresource.restServices')
    .factory('UserResService', UserResService);

  UserResService.$inject = ['$resource', 'OpenmrsSettings', 'UserModel', '$rootScope'];

  function UserResService($resource, settings, UserModel, $rootScope) {
    var service = {
      getUser: getUser,
      user: '',
      getUserByUuid: getUserByUuid,
      findUser: findUser
    };

    return service;

    function getResource() {
      var v = 'custom:(uuid,username,systemId,roles:(uuid,name,privileges),person:(uuid,preferredName))'; // avoid spaces in this string
      var r = $resource(settings.getCurrentRestUrlBase().trim() + 'user/:uuid',
        { uuid: '@uuid', v: v },
        { query: { method: 'GET', isArray: false } }
        );
      return r;
    }

    function getFullResource() {
      var v = 'full'; // avoid spaces in this string
      var r = $resource(settings.getCurrentRestUrlBase().trim() + 'user/:uuid',
        { uuid: '@uuid', v: v },
        { query: { method: 'GET', isArray: false } }
        );
      return r;
    }


    function getUser(params, callback) {
      var UserRes = getResource();
      //console.log(params);
      UserRes.query(params, false,
        function (data) {
          console.log('userData');
          console.log(data.results);
          var result = data.results || [data];
          if (result.length > 0) {
            //user(userName_, personUuId_, password_, uuId_, systemId_, userRole_)
            service.user = new UserModel.user(result[0].username, result[0].person.uuid, '', result[0].uuid, result[0].systemId, result[0].roles);
            //service.user = result;
            $rootScope.$broadcast('loggedUser');//broadcasting user to other controllers
            callback(service.user);
          }
        });

    }

    function getUserByUuid(uuid, onSuccess, onError) {
      var resource = getFullResource();

      return resource.get({ uuid: uuid }).$promise
        .then(function (data) {
          onSuccess(data);
        })
        .catch(function (error) {
          onError(error);
          console.error(error);
        });
    }


    function findUser(searchText, onSuccess, onError) {
      var resource = getFullResource();

      return resource.get({ q: searchText }).$promise
        .then(function (data) {
          onSuccess(data.results);
        })
        .catch(function (error) {
          onError(error);
          console.error(error);
        });
    }


    function getRoles(argument) {
      // body...
      var UserRes = getResource();
    }
  }
})()
;

/*
jshint -W026, -W116, -W098, -W003, -W068, -W069, -W004, -W033, -W030, -W117
*/
(function() {
  'use strict';

  angular
    .module('openmrs-ngresource.restServices')
          .factory('VisitResService', VisitResService);

  VisitResService.$inject = ['Restangular'];

  function VisitResService(Restangular) {
      var service = {
          getVisitByUuid: getVisitByUuid,
          getPatientVisits: getPatientVisits,
          saveVisit: saveOrUpdateVisit,
          getVisitEncounters: getVisitEncounters,
          getVisitTypes: getVisitTypes,
          defaultCustomRep: new DefaultCustomRep().getterSetter
      };

      return service;

      function getVisitByUuid(params, successCallback, errorCallBack) {
          var objParams = {};
          if(angular.isDefined(params) && typeof params === 'string') {
            objParams = {
                'visitUuid': params,
                'v': new DefaultCustomRep().getterSetter()
            }
          } else {
             var v = params.rep || params.v;
             objParams = {
                 'visitUuid': params.uuid,
                 'v': v || new DefaultCustomRep().getterSetter()
             }
          }

         Restangular.one('visit', objParams.visitUuid).get({v: objParams.v})
            .then(function(data) {
                _successCallbackHandler(successCallback, data);
            }, function(error) {
                console.log('Error: An error occured while fetching visit' +
                ' data for visit with uuid ' + objParams.visitUuid);
                if(typeof errorCallBack === 'function') {
                    errorCallBack(error);
                }
            });
      }
      
      /**
       * fetches patient visits.
       * @params is an object which can have the following properties
       *    patient: patient's uuid
       *    v: desired data representation from OpenMRS
       *    caching: Whether to cache or not (true/false) - default is false
       */
      function getPatientVisits(params, successCallback, errorCallBack) {
          var caching = false;
          var objParams = {};
          if(angular.isDefined(params) && typeof params === 'string') {
              // params is a patient uuid
              objParams = {
                  'patient': params,
                  'v': new DefaultCustomRep().getterSetter()
              }
          } else {
              var v = params.rep || params.v;
              caching = params.caching || false;
              objParams = {
                  'patient': params.patientUuid,
                  'v': v || new DefaultCustomRep().getterSetter()
              }
              /* jshint ignore: start */
              delete params.patientUuid;
              delete params.rep;
              /* jshint ignore: end */

              //Copy other fields.
              params.patient = objParams.patient;
              params.v = objParams.v;

              // Assign params to objParams
              objParams = params;
          }

          Restangular.one('visit').withHttpConfig({cache: caching})
            .get(objParams).then(function(data) {
              if(angular.isDefined(data.results)) data = data.results.reverse();
              _successCallbackHandler(successCallback, data);
          }, function(error) {
              if(typeof errorCallBack === 'function') {
                  errorCallBack(error);
              }
          });
      }

      function saveOrUpdateVisit(payload, successCallback, errorCallBack) {
          if(angular.isDefined(payload.uuid)) {
              var visitUuid = payload.uuid;
              delete payload.uuid;

              Restangular.one('visit', visitUuid).customPOST(
                  JSON.stringify(payload)).then(function(data) {
                      _successCallbackHandler(successCallback, data);
                  }, function (error) {
                      if(typeof errorCallBack === 'function') {
                          errorCallBack(error);
                      }
                  })
          } else {
              // It is a new visit.
              Restangular.service('visit').post(payload).then(function(data) {
                  _successCallbackHandler(successCallback, data);
              }, function(error) {
                  if(typeof errorCallBack === 'function') {
                      errorCallBack(error);
                  }
              });
          }
      }

      //Get encounters for a given Visit
      function getVisitEncounters(params, successCallback, errorCallBack) {
          var rep = 'custom:(encounters:(obs,uuid,patient:(uuid,uuid),' +
                  'encounterDatetime,form:(uuid,name),encounterType:(uuid,name),' +
                  'encounterProviders:(uuid,uuid,provider:(uuid,name),' +
                  'encounterRole:(uuid,name)),location:(uuid,name),' +
                  'visit:(uuid,visitType:(uuid,name))))';

          var visitUuid=null;
          var caching = false;
          if(angular.isDefined(params) && typeof params === 'object') {
              visitUuid = params.visitUuid;
              caching = params.caching || false;
          } else {
              //Assume string passed
              visitUuid = params;
          }

          Restangular.one('visit', visitUuid).withHttpConfig({cache: caching})
            .get({v:rep}).then(function(data) {
              if(angular.isDefined(data.encounters)) {
                  data = data.encounters.reverse();
              }
              _successCallbackHandler(successCallback, data);
          }, function(error) {
              if(typeof errorCallBack === 'function') {
                  errorCallBack(error);
              }
          });
      }

      function getVisitTypes(rep, successCallback, errorCallback) {
          var params = {};
          if(angular.isDefined(rep)) {
              if(typeof rep === 'string')params.v = rep;
              else if(typeof rep === 'object')params = rep;
              else {
                  errorCallback = successCallback;
                  successCallback = rep;
              }
          }
          params.v = params.v || 'custom:(uuid,name,description)';

          Restangular.one('visittype').get(params).then(function(data) {
              if(angular.isDefined(data.results)) data = data.results.reverse();
              _successCallbackHandler(successCallback, data);
          }, function(error) {
              if(typeof errorCallBack === 'function') {
                  errorCallBack(error);
              }
          });
      }

      function DefaultCustomRep() {
         var _defaultCustomRep = 'custom:(uuid,patient:(uuid,uuid),' +
            'visitType:(uuid,name),location:ref,startDatetime,encounters:(' +
            'uuid,encounterDatetime,form:(uuid,name),encounterType:ref,' +
            'encounterProviders:ref,' +
            'obs:(uuid,obsDatetime,concept:(uuid,uuid),value:ref,groupMembers)))';

        this.getterSetter = function(value) {
              if(angular.isDefined(value)) {
                  _defaultCustomRep = value;
              } else {
                  return _defaultCustomRep;
              }
         };
      }

      function _successCallbackHandler(successCallback, data) {
        if (typeof successCallback !== 'function') {
          console.log('Warning: You need a callback function to process' +
          ' results');
          return;
        }

        successCallback(data);
      }
  }
})();

/*
jshint -W098, -W003, -W068, -W004, -W033, -W026, -W030, -W117
*/
/*
jscs:disable disallowQuotedKeysInObjects, safeContextKeyword, requireDotNotation, requirePaddingNewLinesBeforeLineComments, requireTrailingComma
*/

(function () {
  'use strict';

  angular
    .module('openmrs-ngresource.utils')
    .factory('SearchDataService', SearchDataService);

  SearchDataService.$inject = ['ProviderResService', 'CachedDataService',
    'LocationModel', 'ProviderModel', 'ConceptResService', 'ConceptModel',
    'DrugResService', 'DrugModel', '$rootScope'];

  function SearchDataService(ProviderResService, CachedDataService,
    LocationModelFactory, ProviderModelFactory, ConceptResService,
    ConceptModelFactory, DrugResService, DrugModelFactory, $rootScope, FormRestService) {

    var problemConceptClassesArray = ['Diagnosis', 'Symptom',
      'Symptom/Finding', 'Finding'];
    var drugConceptClassesArray = ['Drug'];
    var service = {
      findProvider: findProvider,
      getProviderByUuid: getProviderByPersonUuid,
      getProviderByProviderUuid: getProviderByProviderUuid,
      findLocation: findLocation,
      getLocationByUuid: getLocationByUuid,
      findProblem: findProblem,
      getProblemByUuid: getProblemByUuid,
      findDrugConcepts: findDrugConcepts,
      getDrugConceptByUuid: getDrugConceptByUuid,
      findDrugs: findDrugs,
      findDrugByUuid: findDrugByUuid,
      getConceptAnswers: getConceptAnswers
    };

    return service;

    function findLocation(searchText, onSuccess, onError) {
      CachedDataService.getCachedLocations(searchText, function (results) {
        var wrapped = wrapLocations(results);
        onSuccess(wrapped);
      });
    }

    function getLocationByUuid(uuid, onSuccess, onError) {
      CachedDataService.getCachedLocationByUuid(uuid, function (results) {
        var wrapped = wrapLocation(results);
        onSuccess(wrapped);
      });
    }

    function findProblem(searchText, onSuccess, onError) {
      ConceptResService.findConcept(searchText,
        function (concepts) {
          var filteredConcepts = ConceptResService.filterResultsByConceptClassesName(concepts,
            problemConceptClassesArray);
          var wrapped = wrapConcepts(filteredConcepts);
          onSuccess(wrapped);
        },

        function (error) {
          onError(onError);
        });
    }

    function getProblemByUuid(uuid, onSuccess, onError) {
      ConceptResService.getConceptByUuid(uuid,
        function (concept) {
          var wrapped = wrapConcept(concept);
          onSuccess(wrapped);
        },

        function (error) {
          onError(onError);
        });
    }

    function findProvider(searchText, onSuccess, onError) {
      ProviderResService.findProvider(searchText,
        function (providers) {
          var wrapped = wrapProviders(providers);
          onSuccess(wrapped);
        },

        function (error) {
          onError(onError);
        });
    }

    function getProviderByPersonUuid(uuid, onSuccess, onError) {
      ProviderResService.getProviderByPersonUuid(uuid,
        function (provider) {
          var wrapped = wrapProvider(provider);
          onSuccess(wrapped);
        },

        function (error) {
          onError(onError);
        });
    }

    function getProviderByProviderUuid(uuid, onSuccess, onError) {
      ProviderResService.getProviderByUuid(uuid,
        function (provider) {
          var wrapped = wrapProvider(provider);
          onSuccess(wrapped);
        },

        function (error) {
          onError(onError);
        });
    }

    function findDrugConcepts(searchText, onSuccess, onError) {
      ConceptResService.findConcept(searchText,
        function (concepts) {
          var filteredConcepts = ConceptResService.filterResultsByConceptClassesName(concepts,
            drugConceptClassesArray);
          var wrapped = wrapConcepts(filteredConcepts);
          onSuccess(wrapped);
        },

        function (error) {
          onError(onError);
        });
    }

    function getDrugConceptByUuid(uuid, onSuccess, onError) {
      ConceptResService.getConceptByUuid(uuid,
        function (concept) {
          var wrapped = wrapConcept(concept);
          onSuccess(wrapped);
        },

        function (error) {
          onError(onError);
        });
    }

    function findDrugs(searchText, onSuccess, onError) {
      DrugResService.findDrugs(searchText,
        function (drugs) {
          var wrapped = wrapDrugs(drugs);
          onSuccess(wrapped);
        },

        function (error) {
          onError(onError);
        });
    }

    function findDrugByUuid(uuid, onSuccess, onError) {
      DrugResService.findDrugByUuid(uuid,
        function (drug) {
          var wrapped = wrapDrug(drug);
          onSuccess(wrapped);
        },

        function (error) {
          onError(onError);
        });
    }

    function getConceptAnswers(uuid, onSuccess, onError) {
      ConceptResService.getConceptAnswers(uuid,
        function (concept) {
          var wrapped = wrapConceptsWithLabels(concept.answers);
          onSuccess(wrapped);
        },

        function (error) {
          onError(onError);
        });
    }
    
    function wrapDrug(drug) {
      return DrugModelFactory.toWrapper(drug);
    }

    function wrapDrugs(drugs) {
      var wrappedDrugs = [];
      for (var i = 0; i < drugs.length; i++) {
        wrappedDrugs.push(wrapDrug(drugs[i]));
      }

      return wrappedDrugs;
    }

    function wrapProvider(provider) {
      return ProviderModelFactory.toWrapper(provider);
    }

    function wrapProviders(providers) {
      var wrappedProviders = [];
      for (var i = 0; i < providers.length; i++) {
        wrappedProviders.push(wrapProvider(providers[i]));
      }

      return wrappedProviders;
    }

    function wrapLocations(locations) {
      var wrappedLocations = [];
      for (var i = 0; i < locations.length; i++) {
        wrappedLocations.push(wrapLocation(locations[i]));
      }

      return wrappedLocations;
    }

    function wrapLocation(location) {
      return LocationModelFactory.toWrapper(location);
    }

    function wrapConcept(concept) {
      return ConceptModelFactory.toWrapper(concept);
    }

    function wrapConcepts(concepts) {
      var wrappedObjects = [];
      for (var i = 0; i < concepts.length; i++) {
        wrappedObjects.push(wrapConcept(concepts[i]));
      }

      return wrappedObjects;
    }

    function wrapConceptsWithLabels(concepts) {
      var wrappedObjects = [];
      for (var i = 0; i < concepts.length; i++) {
        var concept = {
          'concept': concepts[i].uuid,
          'label': concepts[i].display
        };
        wrappedObjects.push(concept);
      }

      return wrappedObjects;
    }

  }

})();

/*
 jshint -W098, -W003, -W068, -W004, -W033, -W026, -W030, -W117
 */
/*jscs:disable safeContextKeyword, requireDotNotation, requirePaddingNewLinesBeforeLineComments, requireTrailingComma*/
(function(){
    'use strict';

    angular
            .module('openmrs-ngresource.utils')
            .factory('CachedDataService',CachedDataService);

    CachedDataService.$inject=['$rootScope'];

    function CachedDataService($rootScope){
        var service={
            //locations retrieved  from the  etl server
            getCachedEtlLocations:getCachedEtlLocations,
            getCachedEtlLocationsByUuid:getCachedEtlLocationsByUuid,
            getCachedLocations:getCachedLocations,
            getCachedLocationByUuid:getCachedLocationByUuid,
            getCachedPocForms:getCachedPocForms,
            getCachedPatient:getCachedPatient
        };

        return service;

        function getCachedEtlLocationsByUuid(locationUuid,callback){
            var result=[];
            angular.forEach($rootScope.cachedEtlLocations,function(value,key){
                if(value.uuid===locationUuid){
                    result=value
                }
            });
            callback(result);
        }

        function getCachedLocations(searchText,callback){
            var results=_.filter($rootScope.cachedLocations,
                    function(l){
                        // console.log('location ', l);
                        if(l.description!==null||l.description!=='null'){
                            return (_.contains(l.name.toLowerCase(),searchText.toLowerCase())||
                                    _.contains(l.description.toLowerCase(),searchText.toLowerCase()));
                        }else{
                            return (_.contains(l.name.toLowerCase(),searchText.toLowerCase()));
                        }

                    });

            callback(results);
        }

        function getCachedLocationByUuid(uuid,callback){
            var results=_.find($rootScope.cachedLocations,
                    function(l){
                        // console.log('location ', l);
                        return (l.uuid===uuid);
                    });

            callback(results);
        }

        function getCachedFormByUuid(uuid,callback){
            var results=_.find($rootScope.cachedPocForms,
                    function(f){
                        // console.log('location ', l);
                        return (f.uuid===uuid);
                    });

            callback(results);
        }

        function getCachedPocForms(){
            return $rootScope.cachedPocForms;
        }

        function getCachedPatient(){
            return $rootScope.broadcastPatient;
        }
        function getCachedEtlLocations(){
            return $rootScope.cachedEtlLocations;

        }

    }
})();

(function() {
  'use strict';
  
  /**
   * Names too long hence abbreviations
   * CUR_TB_TX_DETAILED = PATIENT REPORTED CURRENT TUBERCULOSIS TREATMENT, DETAILED [grouper concept]
   * CUR_TB_TX = PATIENT REPORTED CURRENT TUBERCULOSIS TREATMENT
   * TB_TX_DRUG_STARTED_DETAILED = TB TREATMENT DRUGS STARTED, DETAILED [grouper]
   * TB_TX_PLAN = TUBERCULOSIS TREATMENT PLAN
   */  
   
  angular
    .module('openmrs-ngresource.utils')
      .constant('CONCEPT_UUIDS', {
        CUR_TB_TX_DETAILED: 'a8afdb8c-1350-11df-a1f1-0026b9348838',
        CUR_TB_TX: 'a899e444-1350-11df-a1f1-0026b9348838',
        TB_TX_DRUG_STARTED_DETAILED: 'a89fe6f0-1350-11df-a1f1-0026b9348838',
        TB_TX_PLAN: 'a89c1fd4-1350-11df-a1f1-0026b9348838'
      });  
})();

(function(){
'use strict';
angular.module('openmrs-ngresource.restServices')
.service('PatientResRelationshipService',PatientResRelationshipService);

PatientResRelationshipService.$inject = ['OpenmrsSettings', '$resource','PatientRelationshipModel'];
function PatientResRelationshipService(OpenmrsSettings,$resource,PatientRelationshipModel){
  var service;
  var currentSession;
  service = {
    getResource:getResource,
    getPatientRelationships: getPatientRelationships
  };
  return service;
  function getResource() {
    var r = $resource(OpenmrsSettings.getCurrentRestUrlBase().trim() + 'relationship');
        return r;
      }

      function getPatientRelationships(params,successCallback,errorCallback){
        var patientRelationshipRes=getResource();
        var patientRelationship={
          relationships:[]
        }
        patientRelationshipRes.get(params).$promise.then(function (data) {
          angular.forEach(data.results,function(value,key){
            var relationship;
            if(params.person==value.personA.uuid)
            {
            relationship=new PatientRelationshipModel.patientRelationship(value.uuid,value.personB.display,value.relationshipType.bIsToA);
            }
            else{
              relationship=new PatientRelationshipModel.patientRelationship(value.uuid,value.personA.display,value.relationshipType.aIsToB);
            }
            patientRelationship.relationships.push(relationship);
          });
          successCallback(patientRelationship);
        })
        .catch(function(error){
          errorCallback(error);
        });
      }
}
})();

/*jshint -W003, -W098, -W117, -W026, -W040, -W004 */
(function() {
    'use strict';

    angular
        .module('openmrs-ngresource.models')
        .factory('ConceptClassModel', factory);

    factory.$inject = [];

    function factory() {
        var service = {
            conceptClass: ConceptClass,
            toWrapper:toWrapper
        };

        return service;
       
        function ConceptClass(display_, uuId_, name_, description_, retired_) {
            var modelDefinition = this;

            //initialize private members
            var _display = display_? display_: '';
            var _uuId = uuId_ ? uuId_: '';
            var _name = name_ ? name_: '';
            var _description = description_ ? description_: '';
            var _retired = retired_;


            modelDefinition.display = function(value){
                return _display;
            };

            modelDefinition.uuId = function(value){
              if(angular.isDefined(value)){
                _uuId = value;
              }
              else{
                return _uuId;
              }
            };

            modelDefinition.name = function(value){
              if(angular.isDefined(value)){
                _name = value;
              }
              else{
                return _name;
              }
            };

            modelDefinition.description = function(value){
              if(angular.isDefined(value)){
                _description = value;
              }
              else{
                return _description;
              }
            };
            
            modelDefinition.retired = function(value){
              if(angular.isDefined(value)){
                _retired = value;
              }
              else{
                return _retired;
              }
            };            

            modelDefinition.openmrsModel = function(value){
              return {display:_display,
                      uuid:_uuId,
                      name:_name,
                      description:_description,
                      retired: _retired
              };
            };
        }

        function toWrapper(openmrsModel){
            return new ConceptClass(openmrsModel.display, openmrsModel.uuid, openmrsModel.name,
              openmrsModel.description, openmrsModel.retired);
        }

    }
})();

/*jshint -W003, -W098, -W117, -W026, -W040, -W004 */
(function() {
  'use strict';

  angular
      .module('openmrs-ngresource.models')
      .factory('ConceptNameModel', factory);

  factory.$inject = [];

  function factory() {
    var service = {
      conceptName: ConceptName,
      toWrapper: toWrapper
    };

    return service;

    function ConceptName(display_, uuId_, name_, conceptNameType_) {
      var modelDefinition = this;

      // initialize private members
      var _display = display_? display_ : '';
      var _uuId = uuId_ ? uuId_: '';
      var _name = name_ ? name_: '';
      var _conceptNameType = conceptNameType_ ? conceptNameType_: '';


      modelDefinition.display = function(value){
        return _display;
      };

      modelDefinition.uuId = function(value) {
        if(angular.isDefined(value)) {
          _uuId = value;
        }
        else {
          return _uuId;
        }
      };

      modelDefinition.name = function(value) {
        if(angular.isDefined(value)) {
          _name = value;
        }
        else {
          return _name;
        }
      };

      modelDefinition.conceptNameType = function(value) {
        if(angular.isDefined(value)) {
          _conceptNameType = value;
        }
        else {
          return _conceptNameType;
        }
      };

      modelDefinition.openmrsModel = function(value) {
        return {display:_display,
                uuid:_uuId,
                name:_name,
                conceptNameType:_conceptNameType
        };
      };
    }

    function toWrapper(openmrsModel) {
      return new ConceptName(openmrsModel.display, openmrsModel.uuid, openmrsModel.name,
          openmrsModel.conceptNameType);
    }

  }
})();

/* global angular */
/*jshint -W003, -W098, -W117, -W026, -W040, -W055 */
(function() {
  'use strict';

  angular
        .module('openmrs-ngresource.models')
        .factory('ConceptModel', factory);

  factory.$inject = ['ConceptNameModel', 'ConceptClassModel'];

  function factory(ConceptNameModel, ConceptClassModel) {
    var service = {
      concept: concept,
      toWrapper: toWrapper
    };

    return service;

    function concept(name_, uuId_, conceptClass_) {
      var modelDefinition = this;

      //initialize private members
      var _uuId = uuId_ ? uuId_ : '' ;
      var _name = name_ ? ConceptNameModel.toWrapper(name_) : undefined;
      var _conceptClass = conceptClass_ ? ConceptClassModel.toWrapper(conceptClass_): undefined;

      modelDefinition.name = function(value) {
        if (angular.isDefined(value)) {
          _name = value;
        }
        else {
          return _name;
        }
      };

      modelDefinition.uuId = function(value) {
        if (angular.isDefined(value)) {
          _uuId = value;
        }
        else {
          return _uuId;
        }
      };

      modelDefinition.conceptClass = function(value) {
              if (angular.isDefined(value)) {
                _conceptClass = value;
              }
              else {
                return _conceptClass;
              }
       };
       
      modelDefinition.display = function(value) {
             
              return _name?_name.display(): undefined;
       };

      modelDefinition.openmrsModel = function(value) {
              return {name: _name? _name.openmrsModel():undefined,
                      uuid: _uuId,
                      conceptClass: _conceptClass? _conceptClass.openmrsModel():undefined
              };
       };
    }

    function toWrapper(openmrsModel){
        return new concept(openmrsModel.name, openmrsModel.uuid, openmrsModel.conceptClass);
    }
  }
})();

/* global angular */
/*jshint -W003, -W098, -W117, -W026, -W040, -W055 */
(function() {
  'use strict';

  angular
        .module('openmrs-ngresource.models')
        .factory('DrugModel', factory);

  factory.$inject = ['ConceptModel'];

  function factory(ConceptModel) {
    var service = {
      drug: drug,
      toWrapper: toWrapper
    };

    return service;

    function drug(name_, uuId_, description_, dosageForm_, doseStrength_, maximumDailyDose_, minimumDailyDose_, units_,concept_) {
      var modelDefinition = this;

      //initialize private members
      var _uuId = uuId_ ? uuId_ : '' ;
      var _name = name_ ? name_ : '';
      var _description = description_ ? description_ : '';
      var _dosageForm = dosageForm_ ? dosageForm_ : '';
      var _doseStrength = name_ ? doseStrength_ : '';
      var _maximumDailyDose = name_ ? maximumDailyDose_ : '';
      var _minimumDailyDose = minimumDailyDose_ ? minimumDailyDose_ : '';
      var _units = units_ ? units_ : '';
      var _concept = concept_ ? ConceptModel.toWrapper(concept_): undefined;

      modelDefinition.name = function(value) {
        if (angular.isDefined(value)) {
          _name = value;
        }
        else {
          return _name;
        }
      };

      modelDefinition.uuId = function(value) {
        if (angular.isDefined(value)) {
          _uuId = value;
        }
        else {
          return _uuId;
        }
      };


      modelDefinition.description = function(value) {
        if (angular.isDefined(value)) {
          _description = value;
        }
        else {
          return _description;
        }
      };


      modelDefinition.dosageForm = function(value) {
        if (angular.isDefined(value)) {
          _dosageForm = value;
        }
        else {
          return _dosageForm;
        }
      };


      modelDefinition.doseStrength = function(value) {
        if (angular.isDefined(value)) {
          _doseStrength = value;
        }
        else {
          return _doseStrength;
        }
      };

      modelDefinition.maximumDailyDose = function(value) {
        if (angular.isDefined(value)) {
          _maximumDailyDose = value;
        }
        else {
          return _maximumDailyDose;
        }
      };

      modelDefinition.minimumDailyDose = function(value) {
        if (angular.isDefined(value)) {
          _minimumDailyDose = value;
        }
        else {
          return _minimumDailyDose;
        }
      };

      modelDefinition.units = function(value) {
        if (angular.isDefined(value)) {
          _units = value;
        }
        else {
          return _units;
        }
      };

      modelDefinition.concept = function(value) {
              if (angular.isDefined(value)) {
                _concept = value;
              }
              else {
                return _concept;
              }
       };

      modelDefinition.openmrsModel = function(value) {
              return {name: _name? _name.openmrsModel():undefined,
                      uuid: _uuId,
                      description:_description,
                      dosageForm:_dosageForm,
                      doseStrength:_doseStrength,
                      maximumDailyDose:_maximumDailyDose,
                      minimumDailyDose:_minimumDailyDose,
                      units:_units,
                      concept: _concept? _concept.openmrsModel():undefined
              };
       };
    }

    function toWrapper(openmrsModel){
        return new drug(openmrsModel.name, openmrsModel.uuid, openmrsModel.description, openmrsModel.dosageForm, openmrsModel.doseStrength, openmrsModel.maximumDailyDose, openmrsModel.minimumDailyDose, openmrsModel.units, openmrsModel.concept);
    }
  }
})();

/*jshint -W003, -W098, -W117, -W026, -W040 */
(function() {
  'use strict';

  angular
        .module('openmrs-ngresource.models')
        .factory('EncounterModel', EncounterModel);

  EncounterModel.$inject = [];

  function EncounterModel() {
    var service = {
      model: Model,
      toArrayOfModels: toArrayOfModels
    };

    return service;

    function Model(openmrsModel) {
      var modelDefinition = this;

      //Evaluate the passed models for non-existent propertis.
      // Take care of provider special case
      if(openmrsModel.encounterProviders !== undefined) {
          if(openmrsModel.encounterProviders.length > 0) {
              openmrsModel.provider =
                            openmrsModel.encounterProviders[0].provider;
          } else {

              openmrsModel.provider = {};
          }
      } else {
          openmrsModel.provider = openmrsModel.provider || {};
      }

      openmrsModel.encounterType = openmrsModel.encounterType || {};
      openmrsModel.patient = openmrsModel.patient || {};
      openmrsModel.location = openmrsModel.location || {};
      openmrsModel.form = openmrsModel.form || {};

      //initialize private members
      var _providerName, _providerIdentifier;
      if(openmrsModel.provider.person) {
        _providerName = openmrsModel.provider.person.display || '';
        _providerIdentifier = openmrsModel.provider.identifier || '';
      } else {
        // Split the name & identifier on display field.
        if(openmrsModel.provider.display) {
          var temp = openmrsModel.provider.display;
          var index = temp.lastIndexOf('-');
          if(index !== -1) {
            _providerName = temp.substring(index).trim();
            _providerIdentifier = temp.substring(0,index).trim();
          } else {
             //Assume the whole thing is a name
             _providerName = temp;
             _providerIdentifier = openmrsModel.provider.identifier || '';
          }
        }
      }

      var _uuid = openmrsModel.uuid || '' ;
      var _patientUuid = openmrsModel.patient.uuid || '';
      var _encounterTypeName = openmrsModel.encounterType.display ||
                                openmrsModel.encounterType.name || '';

      var _encounterTypeUuid = openmrsModel.encounterType.uuid || '';

      var _providerUuid = openmrsModel.provider.uuid || '';
      var _encounterDate = openmrsModel.encounterDatetime || '';

      var _locationName = openmrsModel.location.display ||
                                    openmrsModel.location.name || '';

      var _locationUuid = openmrsModel.location.uuid || '';
      var _formUuid = openmrsModel.form.uuid || '';
      var _formName = openmrsModel.form.name || '';

      modelDefinition.uuid = function(value) {
        if (angular.isDefined(value)) {
          _uuid = value;
        } else {
          return _uuid;
        }
      };

      modelDefinition.patientUuid = function(value) {
        if(angular.isDefined(value)) {
          _patientUuid = value;
        } else {
          return _patientUuid;
        }
      };

      modelDefinition.encounterTypeName = function(value) {
        if (angular.isDefined(value)) {
          _encounterTypeName = value;
        } else {
          return _encounterTypeName;
        }
      };

      modelDefinition.encounterTypeUuid = function(value) {
        if (angular.isDefined(value)) {
          _encounterTypeUuid = value;
        } else {
          return _encounterTypeUuid;
        }
      };

      modelDefinition.providerName = function(value) {
        if (angular.isDefined(value)) {
          _providerName = value;
        } else {
          return _providerName;
        }
      };

      modelDefinition.providerIdentifier = function(value) {
          if(!angular.isDefined(value)) {
            return _providerIdentifier;
          }
          _providerIdentifier = value;
      };

      modelDefinition.providerUuid = function(value) {
        if (angular.isDefined(value)) {
          _providerUuid = value;
        } else {
          return _providerUuid;
        }
      };

      modelDefinition.encounterDate = function(value) {
        if (angular.isDefined(value)) {
          _encounterDate = value;
        } else {
          return _encounterDate;
        }
      };

      modelDefinition.locationName = function(value) {
        if (angular.isDefined(value)) {
          _locationName = value;
        } else {
          return _locationName;
        }
      };
      modelDefinition.locationUuid = function(value) {
        if (angular.isDefined(value)) {
          _locationUuid = value;
        } else {
          return _locationUuid;
        }
      };

      modelDefinition.formUuid = function(value) {
        if (angular.isDefined(value)) {
            _formUuid = value;
        } else {
          return _formUuid;
        }
      };

      modelDefinition.formName = function(value) {
        if(angular.isDefined(value)) {
          _formName = value;
        } else {
          return _formName;
        }
      };

      modelDefinition.openmrsModel = function() {
        /* jshint ignore:start */
        return {
            "uuid" : _uuid,
            "patient" : _patientUuid,
            "encounterDatetime" : _encounterDate,
            "encounterType" : _encounterTypeUuid,
            "provider" : _providerUuid,
            "location" : _locationUuid,
            "form" : _formUuid
        };
        /* jshint ignore:end */
      };
    }

    function toArrayOfModels(encounterArray) {
      var modelArray = [];
      for(var i=0; i<encounterArray.length; i++) {
        modelArray.push(new Model(encounterArray[i]));
      }
      return modelArray;
    }
  }
})();

/* global angular */
/* jshint -W003, -W098, -W117, -W026, -W040 */
(function() {
  'use strict';

  angular
        .module('openmrs-ngresource.models')
        .factory('LocationModel', factory);

  factory.$inject = [];

  function factory() {
    var service = {
      location: Location,
      toWrapper: toWrapper,
      toArrayOfWrappers: toArrayOfWrappers,
      fromArrayOfWrappers:fromArrayOfWrappers
    };

    return service;

    function Location(name_, uuId_, description_, address1_,  address2_,
      cityVillage_, stateProvince_, country_, postalCode_, latitude_,
      longitude_, countyDistrict_, address3_, address4_, address5_, address6_,
      tags_, parentLocation_, childLocations_, attributes_) {
      var modelDefinition = this;

      // initialize private members
      var _uuId = uuId_ ? uuId_ : '' ;
      var _name = name_ ? name_ : '' ;
      var _description = description_ ? description_ : '' ;
      var _address1 = address1_ ? address1_ : '' ;
      var _address2 = address2_ ? address2_ : '' ;
      var _cityVillage = cityVillage_ ? cityVillage_ : '';
      var _stateProvince = stateProvince_ ? stateProvince_ : '';
      var _country = country_ ? country_ : '';
      var _postalCode = postalCode_ ? postalCode_ : '';
      var _latitude = latitude_ ? latitude_ : '';
      var _longitude = longitude_ ? longitude_ : '';
      var _address3 = address3_ ? address3_ : '';
      var _address4 = address4_ ? address4_ : '';
      var _address5 = address5_ ? address5_ : '';
      var _address6 = address6_ ? address6_ : '';
      var _tags = tags_ ? tags_ : '';

      var _parentLocation = parentLocation_ ? toWrapper( parentLocation_) :undefined;
      var _childLocations = childLocations_ ? toArrayOfWrappers(childLocations_): [];
      var _attributes = attributes_ ? attributes_ : '' ;

      modelDefinition.uuId = function(value) {
        if (angular.isDefined(value)) {
          _uuId = value;
        }
        else {
          return _uuId;
        }
      };


      modelDefinition.name = function(value) {
        if (angular.isDefined(value)) {
          _name = value;
        }
        else {
          return _name;
        }
      };

      modelDefinition.description = function(value) {
        if (angular.isDefined(value)) {
          _description = value;
        }
        else {
          return _description;
        }
      };

      modelDefinition.address1 = function(value) {
        if (angular.isDefined(value)) {
          _address1 = value;
        }
        else {
          return _address1;
        }
      };

      modelDefinition.address2 = function(value) {
        if (angular.isDefined(value)) {
          _address2 = value;
        }
        else {
          return _address2;
        }
      };

      modelDefinition.cityVillage = function(value) {
        if (angular.isDefined(value)) {
          _cityVillage = value;
        }
        else {
          return _cityVillage;
        }
      };

      modelDefinition.stateProvince = function(value) {
        if (angular.isDefined(value)) {
          _stateProvince = value;
        }
        else {
          return _stateProvince;
        }
      };

      modelDefinition.country = function(value) {
        if (angular.isDefined(value)) {
          _country = value;
        }
        else {
          return _country;
        }
      };

      modelDefinition.postalCode = function(value) {
        if (angular.isDefined(value)) {
          _postalCode = value;
        }
        else {
          return _postalCode;
        }
      };

      modelDefinition.latitude = function(value) {
        if (angular.isDefined(value)) {
          _latitude = value;
        }
        else {
          return _latitude;
        }
      };

      modelDefinition.longitude = function(value) {
        if (angular.isDefined(value)) {
          _longitude = value;
        }
        else {
          return _longitude;
        }
      };

      modelDefinition.address3 = function(value) {
        if (angular.isDefined(value)) {
          _address3 = value;
        }
        else {
          return _address3;
        }
      };

      modelDefinition.address4 = function(value) {
        if (angular.isDefined(value)) {
          _address4 = value;
        }
        else {
          return _address4;
        }
      };

      modelDefinition.address5 = function(value) {
        if (angular.isDefined(value)) {
          _address5 = value;
        }
        else {
          return _address5;
        }
      };

      modelDefinition.address6 = function(value) {
        if (angular.isDefined(value)) {
          _address6 = value;
        }
        else {
          return _address6;
        }
      };

      modelDefinition.tags = function(value) {
        if (angular.isDefined(value)) {
          _tags = value;
        }
        else {
          return _tags;
        }
      };

      modelDefinition.parentLocation = function(value) {
        if (angular.isDefined(value)) {
          _parentLocation = value;
        }
        else {
          return _parentLocation;
        }
      };

      modelDefinition.childLocations = function (value) {
        if (angular.isDefined(value)) {
          _childLocations = value;
        }
        else {
          return _childLocations;
        }
      };

      modelDefinition.attributes = function (value) {
        if (angular.isDefined(value)) {
          _attributes = value;
        }
        else {
          return _attributes;
        }
      };

      modelDefinition.display = function (value) {
        return _name + ' [' + _description + ']';
      };

      modelDefinition.openmrsModel = function(value) {
        return {name: _name,
                description: _description,
                address1: _address1,
                address2: _address2,
                cityVillage: _cityVillage,
                stateProvince: _stateProvince,
                country: _country,
                postalCode: _postalCode,
                latitude: _latitude,
                longitude: _longitude,
                address3: _address3,
                address4: _address4,
                address5: _address5,
                address6: _address6,
                tags: _tags,
                parentLocation:_parentLocation? _parentLocation.openmrsModel():undefined,
                childLocations: fromArrayOfWrappers(_childLocations),
                attributes: _attributes};
      };
    }

    function toWrapper(openmrsModel){
      if(openmrsModel!==undefined){
            var obj = new Location(openmrsModel.name, openmrsModel.uuid,
        openmrsModel.description, openmrsModel.address1, openmrsModel.address2,
        openmrsModel.cityVillage, openmrsModel.stateProvince,
        openmrsModel.country, openmrsModel.postalCode, openmrsModel.latitude,
        openmrsModel.longitude, openmrsModel.countyDistrict,
        openmrsModel.address3, openmrsModel.address4,
        openmrsModel.address5, openmrsModel.address6, openmrsModel.tags,
        openmrsModel.parentLocation, openmrsModel.childLocations,
        openmrsModel.attributes
      );

      return obj;

      }

    }

    function toArrayOfWrappers(openmrsLocationArray) {
      var array = [];
      for(var i = 0; i<openmrsLocationArray.length;i++) {
        array.push(toWrapper(openmrsLocationArray[i]));
      }

      return array;
    }

    function fromArrayOfWrappers(locationWrappersArray) {
      var array = [];
      for(var i = 0; i< locationWrappersArray.length; i++) {
        array.push(locationWrappersArray[i].openmrsModel());
      }

      return array;
    }
  }
})();

/*jshint -W003, -W098, -W117, -W026, -W040, -W004 */
(function() {
    'use strict';

    angular
        .module('openmrs-ngresource.models')
        .factory('NameModel', factory);

    factory.$inject = [];

    function factory() {
        var service = {
            name: name,
            toWrapper:toWrapper,
            toArrayOfWrappers: toArrayOfWrappers,
            fromArrayOfWrappers:fromArrayOfWrappers
        };

        return service;

        //madnatory fields givenName, familyName
        function name(givenName_, middleName_, familyName_, familyName2_, voided_, uuId_) {
            var modelDefinition = this;

            //initialize private members
            var _givenName = givenName_? givenName_: '';
            var _middleName = middleName_ ? middleName_: '';
            var _familyName = familyName_ ? familyName_: '';
            var _familyName2 = familyName2_ ? familyName2_: '';
            var _voided = voided_ ? voided_: false;
            var _uuId = uuId_ ? uuId_: '';


            modelDefinition.givenName = function(value){
              if(angular.isDefined(value)){
                _givenName = value;
              }
              else{
                return _givenName;
              }
            };

            modelDefinition.middleName = function(value){
              if(angular.isDefined(value)){
                _middleName = value;
              }
              else{
                return _middleName;
              }
            };

            modelDefinition.familyName = function(value){
              if(angular.isDefined(value)){
                _familyName = value;
              }
              else{
                return _familyName;
              }
            };

            modelDefinition.familyName2 = function(value){
              if(angular.isDefined(value)){
                _familyName2 = value;
              }
              else{
                return _familyName2;
              }
            };

            modelDefinition.voided = function(value){
              if(angular.isDefined(value)){
                _voided = value;
              }
              else{
                return _voided;
              }
            };

            modelDefinition.uuId = function(value){
              if(angular.isDefined(value)){
                _uuId = value;
              }
              else{
                return _uuId;
              }
            };

            modelDefinition.openmrsModel = function(value){
              return {givenName:_givenName,
                      middleName:_middleName,
                      familyName:_familyName,
                      familyName2:_familyName2,
                      voided:_voided,
                      uuId:_uuId};
            };
        }

        function toWrapper(openmrsModel){
            return new name(openmrsModel.givenName, openmrsModel.middleName, openmrsModel.familyName,
              openmrsModel.familyName2, openmrsModel.voided, openmrsModel.uuId );
        }

        function toArrayOfWrappers(openmrsNameArray){
            var array = [];
            for(var i = 0; i<openmrsNameArray.length;i++){
              array.push(toWrapper(openmrsNameArray[i]));
            }
            return array;
        }

        function fromArrayOfWrappers(nameWrappersArray){
            var array = [];
            for(var i = 0; i< nameWrappersArray.length; i++){
              array.push(nameWrappersArray[i].openmrsModel());
            }
            return array;
        }
    }
})();

/*jshint -W003, -W098, -W117, -W026, -W040, -W004, -W093 */
(function() {
  'use strict';

  angular
    .module('openmrs-ngresource.models')
    .factory('PatientModel', factory);

  factory.$inject = [];

  function factory() {
    var patient = {
      patient: patient
    };

    return patient;

    //this is the contructor for the patient object
    //call this using the new function
    //e.g. var p = new Patient(openmrsPatient);
    //get the members for ses using p.uuid();
    //set the members for ses using ses.sessionId(newValue);

    function patient(openmrsPatient) {
      //initialize private members by first checking whether the openmrPatient properties are set before assigning default values
    //  console.log('patient value from the promise(REST SERVICE)');
    //  console.log(openmrsPatient);

      var modelDefinition = this;
      var _uuid = openmrsPatient.uuid || '';
      var _identifier = openmrsPatient.identifiers || '';
      var _givenName = openmrsPatient.person.preferredName.givenName || '';
      var _middleName = openmrsPatient.person.preferredName.middleName  || '';
      var _familyName = openmrsPatient.person.preferredName.familyName || '';
      //var _preferredName=openmrsPatient.preferredName.display||'';
      var _age = openmrsPatient.person.age||0;
      var _birthdate =openmrsPatient.person.birthdate|| '';
      //var _birthdateEstimated =openmrsPatient.birthdateEstimated|| false;
      var _gender = openmrsPatient.person.gender||'';
      var _address =mapAddress(openmrsPatient.person.preferredAddress)||[];
      var _dead = openmrsPatient.person.dead||'';
      var _deathDate = formatDate(openmrsPatient.person.deathDate)||'';
      var _attributes = openmrsPatient.person.attributes||[];
      //var _causeOfDeath = openmrsPatient.causeOfDeath||'';
      /*
       Below are getters and setters for private properties
       The convention is usually to name private properties starting with _
       e.g _uuid is the private member and accessed via the setter below
      */

      modelDefinition.identifier = function(value){
        if(angular.isDefined(value)){
          _identifier = value;
        }
        else{
          return _identifier;
        }
      };
      modelDefinition.identifierFormatted = function(value){

        if(_identifier.length > 0) {
          //return _identifier[0].display.split('=')[1];
          return _identifier[0].identifier;
        }
        else{
          return _identifier = '';
        }

      };
      modelDefinition.commonIdentifiers = function(value){

        if(_identifier.length > 0) {
          //return _identifier[0].display.split('=')[1];
          var filteredIdentifiers;
          var identifier =_identifier;
          var kenyaNationalId =getIdentifierByType(identifier, 'KENYAN NATIONAL ID NUMBER');
          var amrsMrn =getIdentifierByType(identifier, 'AMRS Medical Record Number');
          var ampathMrsUId=getIdentifierByType(identifier, 'AMRS Universal ID');
          var cCC=getIdentifierByType(identifier, 'CCC');
          if(angular.isUndefined(kenyaNationalId) && angular.isUndefined(amrsMrn) &&
            angular.isUndefined(ampathMrsUId) && angular.isUndefined(cCC))
          {
            if (angular.isDefined(_identifier[0].identifier)) {
              filteredIdentifiers = {'default': _identifier[0].identifier};
            }
            else{
              filteredIdentifiers = {'default': ''};
            }
          }
          else {
            filteredIdentifiers = {
              'kenyaNationalId': kenyaNationalId,
              'amrsMrn': amrsMrn,
              'ampathMrsUId': ampathMrsUId,
              'cCC': cCC
            };
          }
          return filteredIdentifiers;
        }
        else{
          return _identifier = '';
        }

      };


      modelDefinition.uuid = function(value){
        if(angular.isDefined(value)){
          _uuid = value;
        }
        else{
          return _uuid;
        }
      };

      modelDefinition.givenName = function(value){
        if(angular.isDefined(value)){
          _givenName = value;
        }
        else{
          return _givenName;
        }
      };

      modelDefinition.middleName = function(value){
        if(angular.isDefined(value)){
          _middleName = value;
        }
        else{
          return _middleName;
        }
      };

      modelDefinition.fullNames = function(value){

          return _givenName + ' ' + _middleName + ' '+  _familyName;

      };

      modelDefinition.familyName = function(value){
        if(angular.isDefined(value)){
          _familyName = value;
        }
        else{
          return _familyName;
        }
      };

      modelDefinition.age = function(value){
        if(angular.isDefined(value)){
          _age = value;
        }
        else{
          return _age;
        }
      };

      modelDefinition.birthdate = function(value){
        if(angular.isDefined(value)){
          _birthdate = value;
        }
        else{
          return _birthdate;
        }
      };

      // modelDefinition.birthdateEstimated = function(value){
      //   if(angular.isDefined(value)){
      //     _birthdateEstimated = value;
      //   }
      //   else{
      //     return _birthdateEstimated;
      //   }
      // };

      modelDefinition.gender  = function(value){
        if(angular.isDefined(value)){
          _gender  = value;
        }
        else{
          return _gender ;
        }
      };

      modelDefinition.genderFull  = function(value){
          return _gender === 'M' ? 'Male':'Female';
      };

      modelDefinition.address = function(value){
        if(angular.isDefined(value)){
          _address = value;
        }
        else{
          return _address;
        }
      };

      // modelDefinition.preferredName = function(value){
      //   if(angular.isDefined(value)){
      //     _preferredName = value;
      //   }
      //   else{
      //     return _preferredName;
      //   }
      // };
      //
      // modelDefinition.attributes = function(value){
      //   if(angular.isDefined(value)){
      //     _attributes = value;
      //   }
      //   else{
      //     return _attributes;
      //   }
      // };
      //
      // modelDefinition.causeOfDeath = function(value){
      //   if(angular.isDefined(value)){
      //     _causeOfDeath = value;
      //   }
      //   else{
      //     return _causeOfDeath;
      //   }
      // };
      modelDefinition.phoneNumber = function(value) {
        var phoneNumberPersonAttributeTypeUuid='72a759a8-1359-11df-a1f1-0026b9348838';
        return getPersonAttribute(phoneNumberPersonAttributeTypeUuid);
      };
      modelDefinition.healthCenter = function(value) {
        var healthCenterPersonAttributeTypeUuid='8d87236c-c2cc-11de-8d13-0010c6dffd0f';
        var location =getPersonAttribute(healthCenterPersonAttributeTypeUuid);
        if(angular.isDefined(location)){
          return location.display;
        }
        else{
          return '';
        }
      };
      modelDefinition.isTestorFakePatient = function(value) {
        var testPatientPersonAttributeTypeUuid='1e38f1ca-4257-4a03-ad5d-f4d972074e69';
        var isTestPatient=getPersonAttribute(testPatientPersonAttributeTypeUuid);
        if(isTestPatient==='true'){
          return 'Test Patient';
        }
        else{
          return '';
        }

      };
      var _convertedAttributes = [];
      modelDefinition.getPersonAttributes = function(value) {
        _convertedAttributes.length = 0;
        if(_attributes.length>0){
          for(var i in _attributes) {
            var attr = _attributes[i];
            _convertedAttributes.push(
              { uuid:attr.uuid,
                attributeType:attr.attributeType.uuid,
                name:attr.attributeType.display,
                value:attr.value,
                size:_attributes.length
              }
            );
          }
        }
        return _convertedAttributes;
      };
      modelDefinition.deathDate = function(value){
        if(angular.isDefined(value)){
          _deathDate = value;
        }
        else{
          return _deathDate;
        }
      };

      modelDefinition.dead = function(value){
        if(angular.isDefined(value)){
          _dead = value;
        }
        else{
          return _dead;
        }
      };

      modelDefinition.openmrsModel = function(value){
        return {
          uuid:_uuid,
          identifier: _identifier,
          givenName:_givenName,
          familyName: _familyName,
          middleName:_middleName,

      //    preferredName:_preferredName,
          age:_age,
          birthdate:_birthdate,
          gender:_gender,
        //  address:_address,
          dead:_dead,
          deathDate:_deathDate
          //causeOfDeath:_causeOfDeath,
          //attributes:_attributes,
          //birthdateEstimated:_birthdateEstimated

        };
      };

      // get the person attribute value from a list of attributes using the person attribute type uuid
      function getPersonAttribute(personAttributeTypeUuid){
        if(_attributes.length>0) {
          for(var i in _attributes) {
            var attr = _attributes[i];
            if(attr.attributeType.uuid === personAttributeTypeUuid) {
              return attr.value;
            }
          }
        }

      }

    }

    //Other Util Functions
    function mapAddress(preferredAddress) {
      return preferredAddress ? {
        'county': preferredAddress.address1,
        'subCounty': preferredAddress.address2,
        'estateLandmark': preferredAddress.address3,
        'townVillage': preferredAddress.cityVillage,
        'stateProvince': preferredAddress.stateProvince

        //Added the noAddress to aid in creating logic for hiding when the patient has no address
      } : {noAddress:'None'};
    }
    function getIdentifierByType(identifierObject, type ) {
      for (var e in identifierObject) {
        if (angular.isDefined(identifierObject[e].identifierType)) {
          var idType = identifierObject[e].identifierType.name;
          var id = identifierObject[e].identifier;
          if (idType === type) {
            return id;
          }
        }
      }
    }
    //format dates
    function formatDate(dateString){
      var formattedDate='';
      if(dateString!==null) {
          var date = new Date(dateString);
          var day = date.getDate();
          var monthIndex = date.getMonth() + 1;
          var year = date.getFullYear();

          if (10 > monthIndex) {
            monthIndex = '0' + monthIndex;
          }
          if (10 > day) {
            day = '0' + day;
          }
          formattedDate = day + '-' + monthIndex + '-' +year ;
      }

      return formattedDate;
    }

  }
})();

/*jshint -W003, -W098, -W117, -W026, -W040 */
(function() {
  'use strict';

  angular
        .module('openmrs-ngresource.models')
        .factory('PatientRelationshipModel', factory);

  factory.$inject = [];

  function factory() {
    var service = {
      patientRelationship: patientRelationship
    };

    return service;

function patientRelationship(uuId_,relative_,relationshipTypeName_){
  var modelDefinition=this;
  var _uuId=uuId_ ||'';
  var _relationshipTypeName=relationshipTypeName_||'';
  var _relative=relative_||'';

  modelDefinition.uuId=function(value){
    if(angular.isDefined(value)){
      _uuId=value;
    }
    else{
      return _uuId;
    }
  };

  modelDefinition.relationshipTypeName=function(value){
    if(angular.isDefined(value)){
      _relationshipTypeName=value;
    }
    else{
      return _relationshipTypeName;
    }
  };

  modelDefinition.relative=function(value){
    if(angular.isDefined(value)){
      _relative=value;
    }
    else{
      return _relative;
    }
  }
}
}
})();

/*jshint -W003, -W098, -W117, -W026, -W040, -W055 */
(function() {
  'use strict';

  angular
        .module('openmrs-ngresource.models')
        .factory('PersonModel', factory);

  factory.$inject = ['NameModel'];

  function factory(NameModel) {
    var service = {
      person: person,
      toWrapper: toWrapper
    };

    return service;

    function person(names_, gender_, uuId_, age_, birthdate_,
      birthdateEstimated_, dead_, deathDate_, causeOfDeath_, addresses_,
      attributes_, preferredName_, preferredAddress_ ) {
      var modelDefinition = this;

      //initialize private members
      var _names = names_ ? NameModel.toArrayOfWrappers(names_)  : [] ;
      var _gender = gender_ ? gender_ : '' ;
      var _uuId = uuId_ ? uuId_ : '' ;
      var _age = age_ ? age_ : null ;
      var _birthdate = birthdate_ ? birthdate_ : null ;
      var _birthdateEstimated = birthdateEstimated_ ? birthdateEstimated_ : null ;
      var _dead = dead_ ? dead_ : false ;
      var _deathDate = deathDate_ ? deathDate_ : null ;
      var _causeOfDeath = causeOfDeath_ ? causeOfDeath_ : '' ;
      var _addresses = addresses_ ? addresses_ : [] ;
      var _attributes = attributes_ ? attributes_ : [] ;
      var _preferredName = preferredName_ ? NameModel.toWrapper(preferredName_) : {} ;
      var _preferredAddress = preferredAddress_  ? preferredAddress_  : {} ;

      modelDefinition.names = function(value) {
        if (angular.isDefined(value)) {
          _names = value;
        }
        else {
          return _names;
        }
      };

      modelDefinition.gender = function(value) {
        if (angular.isDefined(value)) {
          _gender = value;
        }
        else {
          return _gender;
        }
      };

      modelDefinition.uuId = function(value) {
        if (angular.isDefined(value)) {
          _uuId = value;
        }
        else {
          return _uuId;
        }
      };

      modelDefinition.age = function(value) {
              if (angular.isDefined(value)) {
                _age = value;
              }
              else {
                return _age;
              }
       };

       modelDefinition.birthdate = function(value) {
               if (angular.isDefined(value)) {
                 _birthdate = value;
               }
               else {
                 return _birthdate;
               }
        };

        modelDefinition.birthdateEstimated = function(value) {
                if (angular.isDefined(value)) {
                  _birthdateEstimated = value;
                }
                else {
                  return _birthdateEstimated;
                }
         };

         modelDefinition.dead = function(value) {
                 if (angular.isDefined(value)) {
                   _dead = value;
                 }
                 else {
                   return _dead;
                 }
          };

         modelDefinition.deathDate = function(value) {
                  if (angular.isDefined(value)) {
                    _deathDate = value;
                  }
                  else {
                    return _deathDate;
                  }
           };

          modelDefinition.causeOfDeath = function(value) {
                    if (angular.isDefined(value)) {
                      _causeOfDeath = value;
                    }
                    else {
                      return _causeOfDeath;
                    }
            };

          modelDefinition.addresses = function(value) {
                      if (angular.isDefined(value)) {
                        _addresses = value;
                      }
                      else {
                        return _addresses;
                      }
            };

          modelDefinition.attributes = function(value) {
                        if (angular.isDefined(value)) {
                          _attributes = value;
                        }
                        else {
                          return _attributes;
                        }
            };

            modelDefinition.preferredName = function(value) {
                          if (angular.isDefined(value)) {
                            _preferredName = value;
                          }
                          else {
                            return _preferredName;
                          }
              };

              modelDefinition.preferredAddress = function(value) {
                            if (angular.isDefined(value)) {
                              _preferredAddress = value;
                            }
                            else {
                              return _preferredAddress;
                            }
                };

      modelDefinition.openmrsModel = function(value) {
              return {names: NameModel.fromArrayOfWrappers(_names),
                      gender: _gender,
                      uuid: _uuId,
                      age: _age,
                      birthdate: _birthdate,
                      birthdateEstimated: _birthdateEstimated,
                      dead: _dead,
                      deathDate: _deathDate,
                      causeOfDeath: _causeOfDeath,
                      addresses: _addresses,
                      preferredName: _preferredName.openmrsModel(),
                      preferredAddress: _preferredAddress,
                      attributes: _attributes};
            };
    }

    function toWrapper(openmrsModel){
        return new person(openmrsModel.names, openmrsModel.gender, openmrsModel.uuid, openmrsModel.age,
          openmrsModel.birthdate, openmrsModel.birthdateEstimated, openmrsModel.dead, openmrsModel.deathDate,
          openmrsModel.causeOfDeath, openmrsModel.addresses, openmrsModel.attributes, openmrsModel.preferredName, openmrsModel.preferredAddress);
    }
  }
})();

/* global angular */
/*jshint -W003, -W098, -W117, -W026, -W040, -W055 */
(function() {
  'use strict';

  angular
        .module('openmrs-ngresource.models')
        .factory('ProviderModel', factory);

  factory.$inject = ['PersonModel'];

  function factory(PersonModel) {
    var service = {
      provider: provider,
      toWrapper: toWrapper
    };

    return service;

    function provider(person_, identifier_, uuId_,  display_, attributes_, retired_) {
      var modelDefinition = this;

      //initialize private members
      var _identifier = identifier_ ? identifier_ : '';
      var _person = person_ ? PersonModel.toWrapper(person_) :undefined;
      var _uuId = uuId_ ? uuId_ : '';
      var _display = display_ ? display_  : '' ;
      var _attributes = attributes_ ? attributes_ : null;
      var _retired = retired_ ? retired_ : null ;

      modelDefinition.display = function(value) {
        if (angular.isDefined(value)) {
          _display = value;
        }
        else {
          return _display;
        }
      };
      
     modelDefinition.person = function(value) {
        if (angular.isDefined(value)) {
          _person = value;
        }
        else {
          return _person;
        }
      };
      
     modelDefinition.personUuid = function(value) {
         var ret = _person? _person.uuId():null;
          return ret;
      };

      modelDefinition.identifier = function(value) {
        if (angular.isDefined(value)) {
          _identifier = value;
        }
        else {
          return _identifier;
        }
      };

      modelDefinition.uuId = function(value) {
        if (angular.isDefined(value)) {
          _uuId = value;
        }
        else {
          return _uuId;
        }
      };

      modelDefinition.attributes = function(value) {
              if (angular.isDefined(value)) {
                _attributes = value;
              }
              else {
                return _attributes;
              }
      };
       
      modelDefinition.retired = function(value) {
              if (angular.isDefined(value)) {
                _retired = value;
              }
              else {
                return _retired;
              }
       };

      modelDefinition.openmrsModel = function(value) {
              return {identifier: _identifier,
                      person: _person.openmrsModel(),
                      attributes: _attributes,
                      retired: _retired};
            };
    }

    function toWrapper(openmrsModel) {
      //provider(person_, identifier_, uuId_,  display_, attributes_)
        return new provider(openmrsModel.person, openmrsModel.identifier, openmrsModel.uuid, openmrsModel.display,
          openmrsModel.attributes, openmrsModel.retired);
    }
  }
})();

/*jshint -W003, -W098, -W117, -W026, -W040 */
(function() {
    'use strict';

    angular
        .module('openmrs-ngresource.models')
        .factory('SessionModel', factory);

    factory.$inject = [];

    function factory() {
        var service = {
            session: session
        };

        return service;

        //this is the contructor for the session object
        //call this using the new function
        //e.g. var ses = new session(sessionId,isAuthenticated);
        //get the members for ses using ses.sessionId();
        //set the members for ses using ses.sessionId(newValue);

        function session(sessionId_, isAuthenticated_) {
            var modelDefinition = this;

            //initialize private members
            var _sessionId = '';
            var _isAuthenticated = false;

            //assign values
            if(sessionId_){
              _sessionId = sessionId_;
            }
            if(isAuthenticated_){
              _isAuthenticated = isAuthenticated_;
            }

            //this is a getter and setter for _sessionId.
            //convetion is usually to name private properties starting with _
            //so _sessionId is the private member and accessed via the setter below
            modelDefinition.sessionId = function(value){
              if(angular.isDefined(value)){
                //you can modify the value here before assigning it to _sessionId.
                //e.g _sessionId = trim(value);
                _sessionId = value;
              }
              else{
                //you can change _sessionId before returning it
                //e.g. return 'prefix' + _sessionId;
                return _sessionId;
              }
            };

            modelDefinition.isAuthenticated = function(value){
              if(angular.isDefined(value)){
                _isAuthenticated = value;
              }
              else{
                return _isAuthenticated;
              }
            };
            modelDefinition.openmrsModel = function(value){
              return {sessionId:_sessionId, authenticated:_isAuthenticated};
            };
        }
    }
})();

/*jshint -W003, -W098, -W117, -W026, -W040 */
(function() {
  'use strict';

  angular
        .module('openmrs-ngresource.models')
        .factory('UserModel', factory);

  factory.$inject = [];

  function factory() {
    var service = {
      user: user
    };

    return service;

    function user(userName_, personUuId_, password_, uuId_, systemId_, userRole_) {
      var modelDefinition = this;

      //initialize private members
      var _uuId = uuId_ ? uuId_ : '' ;
      var _systemId = systemId_ ? systemId_ : '' ;
      var _userName = userName_ ? userName_ : '' ;
      var _personUuId = personUuId_ ? personUuId_ : '' ;
      var _password = password_ ? password_ : '' ;
      var _userRole = userRole_ ? userRole_ : [] ;

      modelDefinition.uuId = function(value) {
        if (angular.isDefined(value)) {
          _uuId = value;
        }
        else {
          return _uuId;
        }
      };

      modelDefinition.systemId = function(value) {
              if (angular.isDefined(value)) {
                _systemId = value;
              }
              else {
                return _systemId;
              }
            };

      modelDefinition.userName = function(value) {
              if (angular.isDefined(value)) {
                _userName = value;
              }
              else {
                return _userName;
              }
            };

      modelDefinition.personUuId = function(value) {
              if (angular.isDefined(value)) {
                _personUuId = value;
              }
              else {
                return _personUuId;
              }
            };

      modelDefinition.password = function(value) {
              if (angular.isDefined(value)) {
                _password = value;
              }
              else {
                return _password;
              }
            };

      modelDefinition.userRole = function(value) {
                    if (angular.isDefined(value)) {
                      _userRole = value;
                    }
                    else {
                      return _userRole;
                    }
                  };

      modelDefinition.openmrsModel = function(value) {
              return {username: _userName,
                      password: _password,
                      person: _personUuId,
                      systemId: _systemId,
                      userRole: _userRole};
            };
    }
  }
})();

/*jshint -W003, -W098, -W117, -W026, -W040 */
(function() {
  'use strict';

  angular
    .module('openmrs-ngresource.models')
    .factory('ObsModel', ObsModel);

  ObsModel.$inject = [];

  function ObsModel() {
    var service = {
      model: Model,
      toArrayOfModels: toArrayOfModels
    };

    return service;

    function Model(openmrsModel) {
      var modelDefinition = this;

      openmrsModel.concept = openmrsModel.concept || {};

      //initialize private members
      var _display = openmrsModel.display || '';
      var _uuid = openmrsModel.uuid || '';
      var _obsDatetime = openmrsModel.obsDatetime || '';
      var _concept = openmrsModel.concept || {};
      var _groupMembers = openmrsModel.groupMembers || [];
      var _value = openmrsModel.value || '';

      modelDefinition.display = function(value) {
        if (angular.isDefined(value)) {
          _display = value;
        } else {
          return _display;
        }
      };

      modelDefinition.value = function(value) {
        if (angular.isDefined(value)) {
          _value = value;
        } else {
          return _value;
        }
      };

      modelDefinition.uuid = function(value) {
        if (angular.isDefined(value)) {
          _uuid = value;
        } else {
          return _uuid;
        }
      };

      modelDefinition.obsDateTime = function(value) {
        if (angular.isDefined(value)) {
          _patientUuid = value;
        } else {
          return _patientUuid;
        }
      };

      modelDefinition.concept = function(value) {
        if (angular.isDefined(value)) {
          _encounterTypeName = value;
        } else {
          return _encounterTypeName;
        }
      };

      modelDefinition.openmrsModel = function() {
        /* jshint ignore:start */
        return {
          "uuid": _uuid,
          "obsDatetime": _obsDatetime,
          "concept": _concept,
        };
        /* jshint ignore:end */
      };
      modelDefinition.groupMembers = function(value) {
        if (angular.isDefined(value)) {
          _groupMembers = value;
        } else {
          return _groupMembers;
        }
      };
    }

    function toArrayOfModels(obsArray) {
      var modelArray = [];
      for (var i = 0; i < obsArray.length; i++) {
        if (obsArray[i].groupMembers !== null && obsArray[i].groupMembers.length > 0) {
          obsArray[i].groupMembers = toArrayOfModels(obsArray[i].groupMembers);
          modelArray.push(new Model(obsArray[i]));
        } else {
          modelArray.push(new Model(obsArray[i]));
        }
      }
      return modelArray;
    }
  }
})();

/*jshint -W098, -W030 */
(function() {
  'use strict';
  
  angular
    .module('openmrs-ngresource.utils')
      .filter('titlecase', titleCaseFilter);
      
  function titleCaseFilter() {
    return function(s) {
        s = ( s === undefined || s === null ) ? '' : s;
        return s.toString().toLowerCase().replace( /\b([a-z])/g, function(ch) {
            return ch.toUpperCase();
        });
    };
  } 
})();

/* global angular */
/*
 jshint -W003, -W026
 */
(function() {
  'use strict';

  angular
    .module('openmrs-ngresource.restServices')
    .directive('obsview', obsview);

  function obsview() {
    return {
      restict: 'E',
      controller: obsviewController,
      scope: {
        obs: '=',
      },
      templateUrl: 'views/directives/obsview.html',
    };

  }
  obsviewController.$inject = ['$scope','$filter'];
  function obsviewController($scope,$filter) {
    $scope.formatDate = function (date) {
      if (isNaN(date)){
        date = $filter('date')(date,'dd/MM/yyyy');
      }
      return date;
    };
  }

})();
