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
