/*jshint -W026, -W030 */
(function () {
    'use strict';

    describe('OpenMRS Order Service Unit Tests', function () {
        beforeEach(function () {
            module('openmrs-ngresource.restServices');
        });

        //var baseURl = 'https://etl1.ampath.or.ke:8443/amrs/ws/rest/v1/';

        var callbacks = {
            onSuccessCalled: false,
            onFailedCalled: false,
            message: null,
            onSuccess: function () {
                callbacks.onSuccessCalled = true;
            },

            onFailed: function (message) {
                callbacks.onFailedCalled = true;
                callbacks.message = message;
            }
        };

        var httpBackend;
        var orderService;
        var settingsService;

        beforeEach(inject(function ($injector) {
            httpBackend = $injector.get('$httpBackend');
            orderService = $injector.get('OrderResService');
            settingsService = $injector.get('OpenmrsSettings');
        }));

        afterEach(function () {
            httpBackend.verifyNoOutstandingExpectation();
        });

        it('should have Session service defined', function () {
            expect(orderService).to.exist;
        });

        it('should make an api call to the order resource when getOrderByUuid is called',
            function () {
                var orderUuid = 'orderuuid';
                httpBackend.expectGET(settingsService.getCurrentRestUrlBase() + 'order/' + orderUuid)
                    .respond({});

                orderService.getOrderByUuid(orderUuid, function () { }, function () { });

                httpBackend.flush();
            });

        it('should call the onSuccess callback getOrderByUuid request successfully returns',
            function () {
                var orderUuid = 'orderuuid';
                httpBackend.expectGET(settingsService.getCurrentRestUrlBase() + 'order/' + orderUuid)
                    .respond({});

                callbacks.onSuccessCalled = false;
                callbacks.onFailedCalled = false;
                orderService.getOrderByUuid(orderUuid,
                    callbacks.onSuccess, callbacks.onFailed);

                httpBackend.flush();
                expect(callbacks.onSuccessCalled).to.equal(true);
                expect(callbacks.onFailedCalled).to.equal(false);
            });

        it('should call the onError callback getOrderByUuid request fails',
            function () {
                var orderUuid = 'orderuuid';
                httpBackend.expectGET(settingsService.getCurrentRestUrlBase() + 'order/' + orderUuid)
                    .respond(403);

                callbacks.onSuccessCalled = false;
                callbacks.onFailedCalled = false;
                orderService.getOrderByUuid(orderUuid,
                    callbacks.onSuccess, callbacks.onFailed);

                httpBackend.flush();
                expect(callbacks.onSuccessCalled).to.equal(false);
                expect(callbacks.onFailedCalled).to.equal(true);
            });

        it('should make an api call to the order resource when getOrdersByPatientUuid is called',
            function () {
                var patientUuid = 'patientuuid';
                httpBackend.expectGET(settingsService.getCurrentRestUrlBase()
                    + 'order?patient=' + patientUuid)
                    .respond({});

                orderService.getOrdersByPatientUuid(patientUuid, function () { }, function () { });

                httpBackend.flush();
            });

        it('should call the onSuccess callback getOrdersByPatientUuid request successfully returns',
            function () {
                var patientUuid = 'patientuuid';
                httpBackend.expectGET(settingsService.getCurrentRestUrlBase()
                    + 'order?patient=' + patientUuid)
                    .respond({});

                callbacks.onSuccessCalled = false;
                callbacks.onFailedCalled = false;
                orderService.getOrdersByPatientUuid(patientUuid,
                    callbacks.onSuccess, callbacks.onFailed);

                httpBackend.flush();
                expect(callbacks.onSuccessCalled).to.equal(true);
                expect(callbacks.onFailedCalled).to.equal(false);
            });

        it('should call the onFailed callback getOrdersByPatientUuid request fails',
            function () {
                var patientUuid = 'patientuuid';
                httpBackend.expectGET(settingsService.getCurrentRestUrlBase()
                    + 'order?patient=' + patientUuid)
                    .respond(403);

                callbacks.onSuccessCalled = false;
                callbacks.onFailedCalled = false;
                orderService.getOrdersByPatientUuid(patientUuid,
                    callbacks.onSuccess, callbacks.onFailed);

                httpBackend.flush();
                expect(callbacks.onSuccessCalled).to.equal(false);
                expect(callbacks.onFailedCalled).to.equal(true);
            });

        it('should make an api delete order call to the delete resource when deleteOrder is called', function () {
            var orderUuid = 'orderuuid';
            httpBackend.expect('DELETE', settingsService.getCurrentRestUrlBase() + 'order/' + orderUuid + '?purge')
                .respond({});

            orderService.deleteOrder({ uuid: orderUuid }, function () { }, function () { });

            httpBackend.flush();
        });

        it('should call the onSuccess callback deleteOrder request successfully returns',
            function () {
                var orderUuid = 'orderuuid';
                httpBackend.expect('DELETE', settingsService.getCurrentRestUrlBase() + 'order/' + orderUuid + '?purge')
                    .respond({});

                callbacks.onSuccessCalled = false;
                callbacks.onFailedCalled = false;
                orderService.deleteOrder({ uuid: orderUuid },
                    callbacks.onSuccess, callbacks.onFailed);

                httpBackend.flush();
                expect(callbacks.onSuccessCalled).to.equal(true);
                expect(callbacks.onFailedCalled).to.equal(false);
            });

        it('should call the onFailed callback deleteOrder request fails',
            function () {
                var orderUuid = 'orderuuid';
                httpBackend.expect('DELETE', settingsService.getCurrentRestUrlBase() + 'order/' + orderUuid + '?purge')
                    .respond(403);

                callbacks.onSuccessCalled = false;
                callbacks.onFailedCalled = false;
                orderService.deleteOrder({ uuid: orderUuid },
                    callbacks.onSuccess, callbacks.onFailed);

                httpBackend.flush();
                expect(callbacks.onSuccessCalled).to.equal(false);
                expect(callbacks.onFailedCalled).to.equal(true);
            });


        it('should make an api call to save an order to the order resource when saveUpdateOrder is called',
            function () {
                var order = {
                    encounter: '1c3d77a5-6a78-4870-9d5c-e6104eb46f87',
                    patient: '0cdcc779-f616-4812-885b-608f3f091904',
                    concept: '5092AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
                    type: 'testorder',
                    orderer: 'f9badd80-ab76-11e2-9e96-0800200c9a66',
                    careSetting: 'c365e560-c3ec-11e3-9c1a-0800200c9a66',
                    action: 'NEW'
                };
                //case saving
                httpBackend.expectPOST(settingsService.getCurrentRestUrlBase()
                    + 'order', JSON.stringify(order))
                    .respond({});

                orderService.saveUpdateOrder(order, function () { }, function () { });
                httpBackend.flush();

                //case updating
                var payloadWithNoUuid = JSON.stringify(order);
                order.uuid = 'someuuid';
                //case saving
                httpBackend.expectPOST(settingsService.getCurrentRestUrlBase()
                    + 'order/' + order.uuid, payloadWithNoUuid)
                    .respond({});
                orderService.saveUpdateOrder(order, function () { }, function () { });
                httpBackend.flush();

            });

        it('should call the onSuccess callback saveUpdateOrder request successfully returns',
            function () {
                var order = {
                    encounter: '1c3d77a5-6a78-4870-9d5c-e6104eb46f87',
                    patient: '0cdcc779-f616-4812-885b-608f3f091904',
                    concept: '5092AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
                    type: 'testorder',
                    orderer: 'f9badd80-ab76-11e2-9e96-0800200c9a66',
                    careSetting: 'c365e560-c3ec-11e3-9c1a-0800200c9a66',
                    action: 'NEW'
                };
                //case saving
                httpBackend.expectPOST(settingsService.getCurrentRestUrlBase()
                    + 'order', JSON.stringify(order))
                    .respond({});
                callbacks.onSuccessCalled = false;
                callbacks.onFailedCalled = false;

                orderService.saveUpdateOrder(order, callbacks.onSuccess, callbacks.onFailed);
                httpBackend.flush();

                expect(callbacks.onSuccessCalled).to.equal(true);
                expect(callbacks.onFailedCalled).to.equal(false);

                //case updating
                var payloadWithNoUuid = JSON.stringify(order);
                order.uuid = 'someuuid';
                //case saving
                httpBackend.expectPOST(settingsService.getCurrentRestUrlBase()
                    + 'order/' + order.uuid, payloadWithNoUuid)
                    .respond({});

                callbacks.onSuccessCalled = false;
                callbacks.onFailedCalled = false;
                orderService.saveUpdateOrder(order, callbacks.onSuccess, callbacks.onFailed);
                httpBackend.flush();
                expect(callbacks.onSuccessCalled).to.equal(true);
                expect(callbacks.onFailedCalled).to.equal(false);
            });

        it('should call the onFailed callback saveUpdateOrder request fails',
            function () {
                 var order = {
                    encounter: '1c3d77a5-6a78-4870-9d5c-e6104eb46f87',
                    patient: '0cdcc779-f616-4812-885b-608f3f091904',
                    concept: '5092AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
                    type: 'testorder',
                    orderer: 'f9badd80-ab76-11e2-9e96-0800200c9a66',
                    careSetting: 'c365e560-c3ec-11e3-9c1a-0800200c9a66',
                    action: 'NEW'
                };
                //case saving
                httpBackend.expectPOST(settingsService.getCurrentRestUrlBase()
                    + 'order', JSON.stringify(order))
                    .respond(403);
                callbacks.onSuccessCalled = false;
                callbacks.onFailedCalled = false;

                orderService.saveUpdateOrder(order, callbacks.onSuccess, callbacks.onFailed);
                httpBackend.flush();

                expect(callbacks.onSuccessCalled).to.equal(false);
                expect(callbacks.onFailedCalled).to.equal(true);

                //case updating
                var payloadWithNoUuid = JSON.stringify(order);
                order.uuid = 'someuuid';
                //case saving
                httpBackend.expectPOST(settingsService.getCurrentRestUrlBase()
                    + 'order/' + order.uuid, payloadWithNoUuid)
                    .respond(403);

                callbacks.onSuccessCalled = false;
                callbacks.onFailedCalled = false;
                orderService.saveUpdateOrder(order, callbacks.onSuccess, callbacks.onFailed);
                httpBackend.flush();
                expect(callbacks.onSuccessCalled).to.equal(false);
                expect(callbacks.onFailedCalled).to.equal(true);
            });



    });
})();
