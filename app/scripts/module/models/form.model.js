/* global angular */
/*jshint -W003, -W098, -W117, -W026, -W040, -W055 */
(function() {
  'use strict';

  angular
        .module('openmrs-ngresource.models')
        .factory('FormModel', factory);

  function factory() {
    var service = {
      Model: FormModel,
      toArrayOfModels: toArrayOfModels
    };

    return service;
    
    function FormModel(openmrsModel) {
      var modelDefinition = this;
      
      // Iron out things that might be missing
      openmrsModel.encounterType = openmrsModel.encounterType || {};
      
      // Get the stuff from OpenMRS rest resource.
      var _uuid = openmrsModel.uuid;
      var _name = openmrsModel.name;
      var _description = openmrsModel.description;
      var _encounterTypeUuid = openmrsModel.encounterType.uuid || '';
      var _encounterTypeName = openmrsModel.encounterType.name || '';
      var _version = openmrsModel.version || '';
      var _published = openmrsModel.published;
      
      modelDefinition.uuid = function() {
        return _uuid;
      };
      
      modelDefinition.name = function(value) {
        if(angular.isDefined(value)) {
          _name = value;
        } else {
          return _name;
        }
      };
      
      modelDefinition.description = function(value) {
        if(angular.isDefined(value)) {
          _description = value;
        } else {
          return _description;
        }
      };
      
      modelDefinition.encounterTypeUuid = function() {
        return _encounterTypeUuid;
      };
      
      modelDefinition.encounterTypeName = function(value) {
        if(angular.isDefined(value)) {
          _encounterTypeName = value;
        } else {
          return _encounterTypeName;
        }
      };
      
      modelDefinition.version = function() {
        return _version;
      };
      
      modelDefinition.published = function() {
        return _published;
      }
    }
    
    function toArrayOfModels(formsArray) {
       if(!Array.isArray(formsArray)) {
         throw new Error('An array argument required');
       }
       var models = [];
       _.each(formsArray, function(form) {
         models.push(new FormModel(form));
       });
       return models;
    }
  }
})();
