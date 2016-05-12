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
    getPatientRelationships: getPatientRelationships,
    updatePatientRelationship:updatePatientRelationship,
    setResource:setResource,
    setPurgeResource:setPurgeResource,
    purgePatientRelationship:purgePatientRelationship
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
            relationship=new PatientRelationshipModel.patientRelationship(value.uuid,value.personB.display,value.relationshipType.bIsToA,value.personB.uuid,value.relationshipType.uuid);
            }
            else{
              relationship=new PatientRelationshipModel.patientRelationship(value.uuid,value.personA.display,value.relationshipType.aIsToB,value.personA.uuid,value.relationshipType.uuid);
            }
            patientRelationship.relationships.push(relationship);
          });
          successCallback(patientRelationship);
        })
        .catch(function(error){
          errorCallback(error);
        });
      }
      function setResource() {
        var resource = $resource(OpenmrsSettings.getCurrentRestUrlBase().trim() + 'relationship/:uuid');
        return resource;
          }
    function updatePatientRelationship(relationshipUuId,payload,successCallback,errorCallback){
      var relationshipRes=setResource();
      relationshipRes.save({uuid:relationshipUuId},payload).$promise
      .then(function(success){
        successCallback(success);
      })
      .catch(function(error){
        errorCallback(error);
      });
    }
    function setPurgeResource(){
      var resource=$resource(OpenmrsSettings.getCurrentRestUrlBase().trim() + 'relationship/:uuid');
      return resource;
    }
    function purgePatientRelationship(relationshipUuId,successCallback,errorCallback){
      var purgeResource=setPurgeResource();
      purgeResource.delete({uuid:relationshipUuId}).$promise
      .then(function(success){
        successCallback(success);
      })
      .catch(function(error){
        errorCallback(error);
      });
    }
}
})();
