/* global afterEach */
/*jshint -W026, -W030 */
(function () {
    'use strict';

    describe('OpenMRS Person Name Service Unit Tests', function () {
        beforeEach(function () {
            module('openmrs-ngresource.restServices');
        });

        var callbacks;
        var httpBackend;
        var personNameResService;
        var settingsService;

        beforeEach(inject(function ($injector) {
            httpBackend = $injector.get('$httpBackend');
            personNameResService = $injector.get('PersonNameResService');
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

        it('should have Person Name service defined', function () {
            expect(personNameResService).to.exist;
        });

        it('PersonNameResService should have saveUpdatePersonName method', function () {
            expect(personNameResService.saveUpdatePersonName).to.be.an('function');
        });

        it('PersonNameResService Service should have getPersonNameResource method', function () {
            expect(personNameResService.getPersonNameResource).to.be.an('function');
        });

        it('should make an api call to save an Person Name resource when saveUpdatePersonName is called',
            function () {
                var v = 'custom:(uuid,givenName,familyName,middleName,familyName2,preferred)';
                var saveParam = { personUuid: 'passed-person-uuid', name: { givenName: 'test1', middleName: 'test2' }, nameUuid: '' };
                var updateParam = { personUuid: 'passed-person-uuid', name: { givenName: 'test1', middleName: 'test2' }, nameUuid: 'passed-name-uuid' };
                
                //case saving new Name
                
                httpBackend.expectPOST(settingsService.getCurrentRestUrlBase()
                    + 'person/passed-person-uuid/name?v=' + v, JSON.stringify(saveParam.name))
                    .respond({});

                personNameResService.saveUpdatePersonName(saveParam, function () { }, function () { });
                httpBackend.flush();

                //updating  Name                                       
                httpBackend.expectPOST(settingsService.getCurrentRestUrlBase()
                    + 'person/passed-person-uuid/name/passed-name-uuid?v=' + v, updateParam.name)
                    .respond({});
                personNameResService.saveUpdatePersonName(updateParam, function () { }, function () { });
                httpBackend.flush();

            });

    });
})();
