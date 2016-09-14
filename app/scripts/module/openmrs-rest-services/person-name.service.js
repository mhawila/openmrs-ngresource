/* global _ */
/*jshint -W003, -W098, -W117, -W026 */
(function () {
    'use strict';

    angular
        .module('openmrs-ngresource.restServices')
        .service('PersonNameResService', PersonNameResService);

    PersonNameResService.$inject = ['OpenmrsSettings', '$resource', 'Restangular'];

    function PersonNameResService(OpenmrsSettings, $resource, Restangular) {
        var serviceDefinition;
        serviceDefinition = {
            getPersonNameResource: getPersonNameResource,
            saveUpdatePersonName: saveUpdatePersonName,
            createPersonNamePayload: createPersonNamePayload
        };
        return serviceDefinition;


        function getPersonNameResource() {
            var v = 'custom:(uuid,givenName,familyName,middleName,familyName2,preferred)';
            return $resource(OpenmrsSettings.getCurrentRestUrlBase().trim() + 'person/:uuid/name/:personNameUuid',
                { personNameUuid: '@personNameUuid', v: v },
                { query: { method: 'GET', isArray: false } });
        }

        function createPersonNamePayload(givenName, familyName, middleName, preferred) {
            return {
                givenName: givenName,
                familyName: familyName,
                middleName: middleName,
                preferred: preferred

            };
        }

        function saveUpdatePersonName(params, successCallback, errorCallback) {

            var personUuid = params.personUuid;
            var name = params.name;
            var personNameUuid = params.nameUuid;
            var personNameResource = getPersonNameResource();
            return personNameResource.save({ uuid: personUuid, personNameUuid: personNameUuid }, JSON.stringify(name)).$promise
                .then(function (data) {
                    if (typeof successCallback === 'function')
                        successCallback(data);
                    console.log('Person Name saved successfully');
                    return data;
                })
                .catch(function (error) {
                    console.error('An Error occured when saving Person Name', error);
                    if (typeof errorCallback === 'function')
                        errorCallback('Error processing request', error);
                    return error;
                });

        }

    }
})();
