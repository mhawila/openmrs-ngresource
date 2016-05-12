/*jshint -W003, -W098, -W117, -W026, -W040 */
(function() {
  'use strict';

  angular
        .module('openmrs-ngresource.models')
        .factory('PatientRelationshipTypeModel', factory);

  factory.$inject = [];

  function factory() {
    var service = {
      patientRelationshipType: patientRelationshipType
    };

    return service;

function patientRelationshipType(uuId_,display_){
  var modelDefinition=this;
  var _uuId=uuId_ ||'';
  var _display=display_||'';

  modelDefinition.uuId=function(value){
    if(angular.isDefined(value)){
      _uuId=value;
    }
    else{
      return _uuId;
    }
  };

  modelDefinition.display=function(value){
    if(angular.isDefined(value)){
      _display=value;
    }
    else{
      return _display;
    }
  };
}
}
})();
