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
