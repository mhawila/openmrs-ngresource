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
        var ProgramEnrollmentResService;
        var settingsService;

        beforeEach(inject(function ($injector) {
            httpBackend = $injector.get('$httpBackend');
            ProgramEnrollmentResService = $injector.get('ProgramEnrollmentResService');
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

        it('should have ProgramEnrollmentResService service defined', function () {
            expect(ProgramEnrollmentResService).to.exist;
        });

        it('ProgramEnrollmentResService should have getResource method', function () {
            expect(ProgramEnrollmentResService.getResource).to.be.an('function');
        });

        it('ProgramEnrollmentResService Service should have getFullResource method', function () {
            expect(ProgramEnrollmentResService.getFullResource).to.be.an('function');
        });

        it('ProgramEnrollmentResService should have saveUpdateProgramEnrollment method', function () {
            expect(ProgramEnrollmentResService.saveUpdateProgramEnrollment).to.be.an('function');
        });

        it('ProgramEnrollmentResService Service should have getProgramEnrollmentByPatientUuid method', function () {
            expect(ProgramEnrollmentResService.getProgramEnrollmentByPatientUuid).to.be.an('function');
        });

        it('should make an api call to save an Program Enrollment resource when saveUpdateProgramEnrollment is called',
            function () {
                var saveParam = { "dateEnrolled": "2016-09-04T21:00:00.000Z", "dateCompleted": "2016-09-04T21:00:00.000Z", "program": "program-uuid", "patient": "patient-uuid" };
                var updateParam = { "dateEnrolled": "2016-09-04T21:00:00.000Z", "dateCompleted": "2016-09-04T21:00:00.000Z", "program": "program-uuid", "patient": "patient-uuid", "uuid": "passed-program-uuid" };
                
                //case saving new Program Enrollment                
                httpBackend.expectPOST(settingsService.getCurrentRestUrlBase()
                    + 'programenrollment', JSON.stringify(saveParam))
                    .respond({});

                ProgramEnrollmentResService.saveUpdateProgramEnrollment(saveParam, function () { }, function () { });
                httpBackend.flush();

                //updating  Program Enrollment                                          
                httpBackend.expectPOST(settingsService.getCurrentRestUrlBase()
                    + 'programenrollment/passed-program-uuid', updateParam.name)
                    .respond({});
                ProgramEnrollmentResService.saveUpdateProgramEnrollment(updateParam, function () { }, function () { });
                httpBackend.flush();

            });

    });
})();
