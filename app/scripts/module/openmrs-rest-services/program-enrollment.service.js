/*jshint -W003, -W098, -W117, -W026 */
(function () {
    'use strict';

    angular
        .module('openmrs-ngresource.restServices')
        .service('ProgramEnrollmentResService', ProgramEnrollmentResService);

    ProgramEnrollmentResService.$inject = ['OpenmrsSettings', '$resource'];

    function ProgramEnrollmentResService(OpenmrsSettings, $resource) {
        var serviceDefinition = {
            getResource: getResource,
            getFullResource: getFullResource,
            saveUpdateProgramEnrollment: saveUpdateProgramEnrollment,
            getProgramEnrollmentByPatientUuid: getProgramEnrollmentByPatientUuid
        };
        return serviceDefinition;

        function getResource() {
            return $resource(OpenmrsSettings.getCurrentRestUrlBase().trim() + 'programenrollment/:uuid',
                { uuid: '@uuid' },
                { query: { method: 'GET', isArray: false } });
        }


        function getFullResource() {
            var v = 'full';
            return $resource(OpenmrsSettings.getCurrentRestUrlBase().trim() + 'programenrollment/:uuid',
                { uuid: '@uuid', v: v },
                { query: { method: 'GET', isArray: false } });
        }

        function getCustomResource(customResource) {
            if (customResource === false || customResource === undefined) return getResource();

            var v = customResource === undefined || customResource === true ?
                'custom:(display,uuid,dateEnrolled,outcome:default,dateCompleted,' +
                'states,program:default,location:default,patient:default)' : customResource;
            return $resource(OpenmrsSettings.getCurrentRestUrlBase().trim() + 'programenrollment/:uuid',

                { uuid: '@uuid', v: v },
                { query: { method: 'GET', isArray: false } });
        }

        function getProgramEnrollmentByPatientUuid(patientUuid, successCallback, failedCallback, customResource) {
            var resource = getCustomResource(customResource);
            return resource.get({ patient: patientUuid }).$promise
                .then(function (response) {
                    successCallback(response);
                })
                .catch(function (error) {
                    if (typeof failedCallback === 'function')
                        failedCallback('Error processing request', error);
                    console.error(error);
                });
        }

        function saveUpdateProgramEnrollment(enrollment, successCallback, failedCallback) {
            var programEnrollmentResource = getResource();

            if (enrollment.uuid !== undefined) {
                //update Program Enrollment
                var uuid = enrollment.uuid;
                delete enrollment['uuid'];
                console.log('Enrollment Payload', JSON.stringify(enrollment));
                return programEnrollmentResource.save({ uuid: uuid }, JSON.stringify(enrollment)).$promise
                    .then(function (data) {
                        successCallback(data);
                    })
                    .catch(function (error) {
                        console.error('An error occured while saving the Patient Program Enrollment ', error);
                        if (typeof failedCallback === 'function')
                            failedCallback('Error processing request', error);
                    });
            }

            programEnrollmentResource = getResource();
            return programEnrollmentResource.save(enrollment).$promise
                .then(function (data) {
                    successCallback(data);
                })
                .catch(function (error) {
                    console.error('An error occured while saving the order ', error);
                    if (typeof failedCallback === 'function')
                        failedCallback('Error processing request', error);
                });

        }


    }
})();
