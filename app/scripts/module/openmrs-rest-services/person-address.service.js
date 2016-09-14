/* global _ */
/*jshint -W003, -W098, -W117, -W026 */
(function () {
    'use strict';

    angular
        .module('openmrs-ngresource.restServices')
        .service('PersonAddressResService', PersonAddressResService);

    PersonAddressResService.$inject = ['OpenmrsSettings', '$resource', 'Restangular'];

    function PersonAddressResService(OpenmrsSettings, $resource, Restangular) {
        var serviceDefinition;
        serviceDefinition = {
            getPersonAddressResource: getPersonAddressResource,
            saveUpdatePersonAddress: saveUpdatePersonAddress,
            createAddressPayload: createAddressPayload
        };
        return serviceDefinition;

        function getPersonAddressResource() {
            var v = 'custom:(uuid,preferred,address1,address2,cityVillage,stateProvince,country,postalCode,latitude,longitude,countyDistrict,address3)';
            return $resource(OpenmrsSettings.getCurrentRestUrlBase().trim() + 'person/:uuid/address/:addressUuid',
                { addressUuid: '@addressUuid', v: v },
                { query: { method: 'GET', isArray: false } });
        }

        function createAddressPayload(address1, address2, address3, cityVillage, stateProvince, preferredAddress) {

            return {
                preferred: preferredAddress,
                address1: address1,
                address2: address2,
                address3: address3,
                cityVillage: cityVillage,
                stateProvince: stateProvince

            }
        }

        function saveUpdatePersonAddress(params, successCallback, errorCallback) {

            var personUuid = params.personUuid;
            var address = params.address;
            var addressUuid = params.addressUuid;
            var personAddressResource = getPersonAddressResource();
            return personAddressResource.save({ uuid: personUuid, addressUuid: addressUuid }, JSON.stringify(address)).$promise
                .then(function (data) {
                    if (typeof successCallback === 'function')
                        successCallback(data);
                    console.log('Person Address saved successfully');
                    return data;
                })
                .catch(function (error) {
                    console.error('An Error occured when saving Person Address', error);
                    if (typeof errorCallback === 'function')
                        errorCallback('Error processing request', error);
                    return error;
                });

        }
    }
})();
