/* global _ */
/*jshint -W003, -W098, -W117, -W026 */
(function () {
    'use strict';

    angular
        .module('openmrs-ngresource.restServices')
        .service('IdentifierResService', IdentifierResService);

    IdentifierResService.$inject = ['OpenmrsSettings', '$resource', 'Restangular'];

    function IdentifierResService(OpenmrsSettings, $resource, Restangular) {
        var serviceDefinition;
        serviceDefinition = {
            getResource: getResource,
            getPatientIdentifiers: getPatientIdentifiers,
            saveUpdatePatientIdentifier: saveUpdatePatientIdentifier,
            getLuhnCheckDigit: getLuhnCheckDigit,
            checkRegexValidity: checkRegexValidity,
            commonIdentifierTypes: commonIdentifierTypes,
            createIdentifierPayload: createIdentifierPayload
        };
        return serviceDefinition;

        function getResource() {
            return $resource(OpenmrsSettings.getCurrentRestUrlBase().trim() + 'patient/:uuid/identifier/:patientIdentifierUuid',
                { patientIdentifierUuid: '@patientIdentifierUuid' },
                { query: { method: 'GET', isArray: false } });
        }

        function getPatientIdentifiers(uuid, successCallback, failedCallback) {
            var resource = getResource();
            return resource.get({ uuid: uuid }).$promise
                .then(function (response) {
                    console.log('This is Identifier Object', response);
                    successCallback(response);
                    return response;
                })
                .catch(function (error) {
                    failedCallback('Error processing request', error);
                    console.error(error);
                    return error;
                });
        }

        function createIdentifierPayload(identifierType, patientIdentifier, preferred, location) {
            return {
                identifier: patientIdentifier,
                identifierType: identifierType,
                preferred: preferred,
                location: location
            };
        }

        function saveUpdatePatientIdentifier(params, successCallback, errorCallback) {
            var patientUuid = params.patientUid;
            var identifier = params.identifier;
            var identifieruUuid = params.identifierUuid;
            patientUuid = patientUuid;
            var patientIdentifierResource = getResource();
            return patientIdentifierResource.save({ uuid: patientUuid, patientIdentifierUuid: identifieruUuid }, JSON.stringify(identifier)).$promise
                .then(function (data) {
                    if (typeof successCallback === 'function')
                        successCallback(data);
                    console.log('Patient Identifier saved successfully');
                    return data;
                })
                .catch(function (error) {
                    console.error('An Error occured when saving patient Identifier ', error);
                    if (typeof errorCallback === 'function')
                        errorCallback('Error processing request', error);
                    return error;
                });

        }

        function getLuhnCheckDigit(number) {
            var validChars = "0123456789ABCDEFGHIJKLMNOPQRSTUVYWXZ_";
            number = number.toUpperCase().trim();
            var sum = 0;
            for (var i = 0; i < number.length; i++) {
                var ch = number.charAt(number.length - i - 1);
                if (validChars.indexOf(ch) < 0) {
                    console.log("Invalid character(s) found!");
                    return false;
                }
                var digit = ch.charCodeAt(0) - 48;
                var weight;
                if (i % 2 == 0) {
                    weight = (2 * digit) - parseInt(digit / 5) * 9;
                }
                else {
                    weight = digit;
                }
                sum += weight;
            }
            sum = Math.abs(sum) + 10;
            var digit = (10 - (sum % 10)) % 10;
            console.log('Lunh Check Digit Is =' + digit);
            return digit;

        }

        function checkRegexValidity(expression, identifier) {
            var identifierRegex = new RegExp('^' + expression + '$');
            return (identifierRegex.test(identifier));
        }

        function commonIdentifierTypes() {
            return ['KENYAN NATIONAL ID NUMBER', 'AMRS Medical Record Number', 'AMRS Universal ID', 'CCC Number'];
        }
    }
})();