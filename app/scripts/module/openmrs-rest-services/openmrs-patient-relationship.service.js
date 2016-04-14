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
