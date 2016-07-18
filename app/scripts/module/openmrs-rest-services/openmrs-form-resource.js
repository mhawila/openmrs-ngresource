/*
jshint -W003,-W109, -W106, -W098, -W003, -W068, -W004, -W033, -W030, -W117, -W116, -W069, -W026
*/
/*jscs:disable requireDotNotation, requirePaddingNewLinesBeforeLineComments, requireTrailingComma*/
/* This service is Deprecated, please use FormService instead*/
(function() {
  'use strict';

  angular
    .module('openmrs-ngresource.restServices')
    .service('FormResourceService', FormResourceService);

  FormResourceService.$inject = ['OpenmrsSettings', '$resource','$http','$filter'];

  function FormResourceService(OpenmrsSettings, $resource,$http,$filter) {
    var serviceDefinition;

    serviceDefinition = {
      getResourcesByFormUuid: getResourcesByFormUuid
    };

    return serviceDefinition;

    function getResource() {
      return $resource(OpenmrsSettings.getCurrentRestUrlBase().trim() + 'form/:uuid/resource', {
        uuid: '@uuid'
      });
    }

    function getResourcesByFormUuid(uuid, successCallback, failedCallback) {
      var resource = getResource();
      return resource.get({
          uuid: uuid
        }).$promise
        .then(function(response) {
           return getValue(response.results[0]);
         })
       .then(function(response) {
          successCallback(response.data);
        })
        .catch(function(error) {
          failedCallback('Error processing request', error);
          console.error(error);
        });
    }

    function processResult(results) {
      var resource = results[0].resource;
      return results[0].resource('full').get().$promise
    }

    function getValue(resource) {
      var links = resource.links;
      var link =  $filter('filter')(links, {rel: 'value' })[0].uri;
      return $http({
        method: "GET",
        url: link
      });
    }
  }
})();
