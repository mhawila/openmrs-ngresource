/* global afterEach */
/*jshint -W026, -W030 */
(function () {
    'use strict';

    describe('OpenMRS Identifier Service Unit Tests', function () {
        beforeEach(function () {
            module('openmrs-ngresource.restServices');
        });

        var callbacks;
        var httpBackend;
        var identifierService;
        var settingsService;

        beforeEach(inject(function ($injector) {
            httpBackend = $injector.get('$httpBackend');
            identifierService = $injector.get('IdentifierResService');
            settingsService = $injector.get('OpenmrsSettings');
        }));

        beforeEach(inject(function () {
            callbacks = {
                onSuccessCalled: false,
                onFailedCalled: false,
                message: null,
                onSuccess: function () {
                    callbacks.onSuccessCalled = true;
                },

                onFailure: function (message) {
                    callbacks.onFailedCalled = true;
                    callbacks.message = message;
                }
            };
        }));

        afterEach(function () {
            httpBackend.verifyNoOutstandingExpectation();

            // httpBackend.verifyNoOutstandingRequest (); //expectation is sufficient for now
        });

        it('should have PatientIdentifiers service defined', function () {
            expect(identifierService).to.exist;
        });

        it('should make an api call to the PatientIdentifiers resource with right url when getPatientIdentifiersByUuid is invoked with a uuid', function () {
            httpBackend.expectGET(settingsService.getCurrentRestUrlBase() + 'patient/passed-uuid/identifier').respond({});
            identifierService.getPatientIdentifiers('passed-uuid', function () { }, function () { });
            httpBackend.flush();
        });

        it('should call the onSuccess callback getPatientIdentifiersByUuid request successfully returns', function () {
            httpBackend.expectGET(settingsService.getCurrentRestUrlBase() + 'patient/passed-uuid/identifier').respond({});
            identifierService.getPatientIdentifiers('passed-uuid', callbacks.onSuccess, callbacks.onFailure);
            httpBackend.flush();
            expect(callbacks.onSuccessCalled).to.equal(true);
            expect(callbacks.onFailedCalled).to.equal(false);
        });

        it('should call the onFailed callback when getPatientIdentifiersByUuid request is not successful', function () {
            httpBackend.expectGET(settingsService.getCurrentRestUrlBase() + 'patient/passed-uuid/identifier').respond(500);
            identifierService.getPatientIdentifiers('passed-uuid', callbacks.onSuccess, callbacks.onFailure);
            httpBackend.flush();
            expect(callbacks.onSuccessCalled).to.equal(false);
            expect(callbacks.onFailedCalled).to.equal(true);
            expect(callbacks.message).to.exist;
            expect(callbacks.message.trim()).not.to.equal('');
        });

        it('IdentifierService should have getLuhnCheckDigit method', function () {
            expect(identifierService.getLuhnCheckDigit).to.be.an('function');
        });

        it('IdentifierService should have commonIdentifierTypes method', function () {
            expect(identifierService.commonIdentifierTypes).to.be.an('function');
        });

        it('IdentifierService should have checkRegexValidity method', function () {
            expect(identifierService.checkRegexValidity).to.be.an('function');
        });

        it('should make an api call to calculate correct Luhn Check Digits', function () {
            var checkDigit = identifierService.getLuhnCheckDigit('MH1003');
            expect(checkDigit).to.equal(2);
        });

        it('should make an api call to validate provided identifier format', function () {
            var validFormat = identifierService.checkRegexValidity('\\d{5}-\\d{5}', '12345-12345');
            expect(validFormat).to.equal(true);
        });

        it('should make an api call to save an PatientIdentifier to the PatientIdentifier resource when saveUpdatePatientIdentifier is called',
            function () {
                var saveParam = { patientUid: 'passed-person-uuid', identifier: { identifier: 232, identifierType: 'type' }, identifierUuid: '' };
                var updateParam = { patientUid: 'passed-person-uuid', identifier: { identifier: 232, identifierType: 'type' }, identifierUuid: 'passed-identifier-uuid' };
                
                //case saving new identifiers
                httpBackend.expectPOST(settingsService.getCurrentRestUrlBase()
                    + 'patient/passed-person-uuid/identifier', JSON.stringify(saveParam.identifier))
                    .respond({});

                identifierService.saveUpdatePatientIdentifier(saveParam, function () { }, function () { });
                httpBackend.flush();

                //updating  identifiers                                       
                httpBackend.expectPOST(settingsService.getCurrentRestUrlBase()
                    + 'patient/passed-person-uuid/identifier/passed-identifier-uuid', updateParam.identifier)
                    .respond({});
                identifierService.saveUpdatePatientIdentifier(updateParam, function () { }, function () { });
                httpBackend.flush();

            });


    });
})();
