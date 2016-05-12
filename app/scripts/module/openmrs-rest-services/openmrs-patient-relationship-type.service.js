(function(){
'use strict';
angular.module('openmrs-ngresource.restServices')
.service('PatientRelationshipTypeResService',PatientRelationshipTypeResService);

PatientRelationshipTypeResService.$inject = ['OpenmrsSettings', '$resource','PatientRelationshipTypeModel'];
function PatientRelationshipTypeResService(OpenmrsSettings,$resource,PatientRelationshipTypeModel){
  var service;
  var currentSession;
  service = {
    getResource:getResource,
    getPatientRelationshipTypes: getPatientRelationshipTypes,
    setPatientRelationship:setPatientRelationship
  };
  return service;
  function getResource() {
    var r = $resource(OpenmrsSettings.getCurrentRestUrlBase().trim() + 'relationshiptype');
        return r;
      }

      function getPatientRelationshipTypes(successCallback,errorCallback){
        var patientRelationshipTypesRes=getResource();
        var patientRelationshipTypes={
          relationshipTypes:[]
        }
        patientRelationshipTypesRes.get().$promise.then(function (data) {
          console.log("original relationship payload ",data);
          angular.forEach(data.results,function(value,key){
            var relationshipType;
            relationshipType=new PatientRelationshipTypeModel.patientRelationshipType(value.uuid,value.display);
            patientRelationshipTypes.relationshipTypes.push(relationshipType);
          });
          successCallback(patientRelationshipTypes);
        })
        .catch(function(error){
          errorCallback(error);
        });
      }
      function setResource(){
        var resource=$resource(OpenmrsSettings.getCurrentRestUrlBase().trim() + 'relationship');
        return resource;
      }
      function setPatientRelationship(params,successCallback,errorCallback){
        var patientRelationshipResource=setResource();
        patientRelationshipResource.save(params).$promise
        .then(function(data){
          successCallback(data);
        })
        .catch(function(error){
          errorCallback(error);
        });
      }
}
})();
