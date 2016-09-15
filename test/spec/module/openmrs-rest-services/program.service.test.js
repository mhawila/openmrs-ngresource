/* global afterEach */
/*jshint -W026, -W030 */
(function () {
    'use strict';

    describe('OpenMRS Program Rest Service Unit Tests', function () {
        beforeEach(function () {
            module('openmrs-ngresource.restServices');
        });

        var callbacks;
        var httpBackend;
        var ProgramResService;
        var settingsService;

        beforeEach(inject(function ($injector) {
            httpBackend = $injector.get('$httpBackend');
            ProgramResService = $injector.get('ProgramResService');
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
        });

        it('should have ProgramResService service defined', function () {
            expect(ProgramResService).to.exist;
        });

        it('ProgramResService should have getResource method', function () {
            expect(ProgramResService.getResource).to.be.an('function');
        });

        it('ProgramResService Service should have getPrograms method', function () {
            expect(ProgramResService.getPrograms).to.be.an('function');
        });

        it('should make an api call to the program resource when getPrograms is',
            function () {
                httpBackend.expectGET(settingsService.getCurrentRestUrlBase() +
                    'program?v=full').respond({});
                ProgramResService.getPrograms(function () { }, function () { });

                httpBackend.flush();
            });
    });
})();
