/* global _ */
/*jshint -W003, -W098, -W117, -W026 */
(function () {
    'use strict';

    angular
        .module('openmrs-ngresource.restServices')
        .service('PatientIdentifierTypeResService', PatientIdentifierTypeResService);

    PatientIdentifierTypeResService.$inject = ['OpenmrsSettings', '$resource', 'Restangular'];

    function PatientIdentifierTypeResService(OpenmrsSettings, $resource, Restangular) {
        var serviceDefinition;
        serviceDefinition = {
            getPatientIdentifierTypeResource: getPatientIdentifierTypeResource,
            getPatientIdentifierTypes: getPatientIdentifierTypes
        };
        return serviceDefinition;

        function getPatientIdentifierTypeResource() {
            var v = 'custom:(uuid,name,format,formatDescription,checkDigit,validator)';
            return $resource(OpenmrsSettings.getCurrentRestUrlBase().trim() + 'patientidentifiertype',
                { v: v },
                { query: { method: 'GET', isArray: false } });
        }

        function getPatientIdentifierTypes(successCallback, failedCallback) {
            var resource = getPatientIdentifierTypeResource();
            return resource.get().$promise
                .then(function (response) {
                    console.log('This is Identifier Type Object', response);
                    if (typeof successCallback === 'function')
                        successCallback(response);
                    return response;
                })
                .catch(function (error) {
                    if (typeof failedCallback === 'function')
                        failedCallback('Error processing request', error);
                    return error;
                });
        }

    }
})();
