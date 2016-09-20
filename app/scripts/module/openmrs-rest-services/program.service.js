/*jshint -W003, -W098, -W117, -W026 */
(function () {
    'use strict';

    angular
        .module('openmrs-ngresource.restServices')
        .service('ProgramResService', ProgramResService);

    ProgramResService.$inject = ['OpenmrsSettings', '$resource'];

    function ProgramResService(OpenmrsSettings, $resource) {
        var serviceDefinition = {
            getResource: getResource,
            getPrograms: getPrograms
        };
        return serviceDefinition;

        function getResource() {
            var v = 'full';
            return $resource(OpenmrsSettings.getCurrentRestUrlBase().trim() + 'program',
                { v: v },
                { query: { method: 'GET', isArray: false } });
        }

        function getPrograms(successCallback, failedCallback) {
            var resource = getResource();
            return resource.get().$promise
                .then(function (response) {
                    successCallback(response);
                })
                .catch(function (error) {
                    if (typeof failedCallback === 'function')
                        failedCallback('Error processing request', error);
                    console.error(error);
                });
        }
    }
})();
