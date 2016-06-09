/*
jshint -W030
*/
(function () {
  "use strict";

  describe("OrderModel Factory Unit Tests", function () {
    beforeEach(function () {
      module("openmrs-ngresource.models");
    });

    var orderModelFactory;
    var orderCreateVersionObject;
    var orderUpdateVersionObject;
    var orderGetVersionObject;
    var orders;

    beforeEach(inject(function ($injector) {
      orderModelFactory = $injector.get("OrderModel");
    }));

    beforeEach(inject(function ($injector) {
      orderCreateVersionObject = {
        encounter: "7be32806-8ec2-4409-8f15-5765e114c400",
        patient: "6a3655e5-9b0f-46cc-aaf5-fb039ff3ee42",
        concept: "a8982474-1350-11df-a1f1-0026b9348838",
        type: "testorder",
        orderer: "pb6f11f4-1359-11df-a1f1-0026b9348838",
        careSetting: "6f0c9a92-6f24-11e3-af88-005056821db0",
        action: "NEW",
        dateActivated: "2016-06-07T14:27:28.643+0300",
        autoExpireDate: "2017-06-07T14:27:28.643+0300",
        orderReason: "a8aaf3e2-1350-11df-a1f1-0026b9348838",
        orderReasonNonCoded: "for your own good",
        urgency: "ROUTINE",
        instructions: "hurry while it lasts",
        commentToFulfiller: "better deliver",
        clinicalHistory: "clinic history",
        numberOfRepeats: 1
      };
      orderUpdateVersionObject = orderCreateVersionObject;
      orderGetVersionObject =
        {
          uuid: 'uuid',
          display: 'display',
          orderNumber: 'ORD-25',
          encounter: {
            uuid: '7be32806-8ec2-4409-8f15-5765e114c400'
          },
          patient: {
            uuid: '6a3655e5-9b0f-46cc-aaf5-fb039ff3ee42'
          },
          concept: {
            uuid: 'a8982474-1350-11df-a1f1-0026b9348838'
          },
          type: 'testorder',
          orderer: {
            uuid: 'pb6f11f4-1359-11df-a1f1-0026b9348838'
          },
          careSetting: {
            uuid: '6f0c9a92-6f24-11e3-af88-005056821db0'
          },
          action: 'NEW',
          dateActivated: '2016-06-07T14:27:28.643+0300',
          autoExpireDate: '2017-06-07T14:27:28.643+0300',
          orderReason: {
            uuid: 'a8aaf3e2-1350-11df-a1f1-0026b9348838'
          },
          orderReasonNonCoded: 'for your own good',
          urgency: 'ROUTINE',
          instructions: 'hurry while it lasts',
          commentToFulfiller: 'better deliver',
          clinicalHistory: 'clinic history',
          numberOfRepeats: 1
        };

      orders = [
        orderGetVersionObject
        ,
        orderGetVersionObject
      ];


    }));

    it("should have Order Model Factory defined", function () {
      expect(orderModelFactory).to.exist;
    });

    it("should always create new order model with minimum required members defined ", function () {
      var _encounterUuid = "_encounterUuid";
      var _patientUuid = "_patientUuid";
      var _conceptUuid = "_conceptUuid";
      var _type = "testorder";
      var _ordererProviderUuid = "_ordererProviderUuid";
      var _careSettingUuid = "_careSettingUuid";      
      var _action = "_action";
      var _dateActivated = "_dateActivated";
      var _autoExpireDate = "_autoExpireDate";
      var _orderReasonConceptUuid = "_orderReasonConceptUuid";
      var _orderReasonNonCoded = "_orderReasonNonCoded";      
      var _instructions = "_instructions";
      var _urgency = "_urgency";
      var _commentToFulfiller = "_commentToFulfiller";      
      var _clinicalHistory = "_clinicalHistory";
      var _numberOfRepeats = 1;

      var model = new orderModelFactory.order(_encounterUuid, _patientUuid, _conceptUuid,
        _type, _ordererProviderUuid, _careSettingUuid, _action, _dateActivated,
         _autoExpireDate, _orderReasonConceptUuid, _orderReasonNonCoded,
        _instructions, _urgency, _commentToFulfiller,
        _clinicalHistory, _numberOfRepeats);

      expect(model.encounterUuid()).to.equal(_encounterUuid);
      expect(model.patientUuid()).to.equal(_patientUuid);
      expect(model.conceptUuid()).to.equal(_conceptUuid);
      expect(model.type()).to.equal(_type);
      expect(model.ordererProviderUuid()).to.equal(_ordererProviderUuid);
      expect(model.careSettingUuid()).to.equal(_careSettingUuid);
      expect(model.action()).to.equal(_action);
      expect(model.dateActivated()).to.equal(_dateActivated);
      expect(model.autoExpireDate()).to.equal(_autoExpireDate);
      expect(model.orderReasonConceptUuid()).to.equal(_orderReasonConceptUuid);
      expect(model.orderReasonNonCoded()).to.equal(_orderReasonNonCoded);
      expect(model.instructions()).to.equal(_instructions);
      expect(model.urgency()).to.equal(_urgency);
      expect(model.commentToFulfiller()).to.equal(_commentToFulfiller);
      expect(model.clinicalHistory()).to.equal(_clinicalHistory);
      expect(model.numberOfRepeats()).to.equal(_numberOfRepeats);

    });

    it("should always create order model that returns a valid openmrs create payload",
      function () {
        var model = orderModelFactory.toWrapper(orderGetVersionObject);
        // console.log("before", JSON.stringify(model.getCreateVersion()));
        // console.log("after ", JSON.stringify(orderCreateVersionObject));

        expect(model.getCreateVersion()).to.deep.equal(orderCreateVersionObject);
      });

    it("should always create order model that returns a valid openmrs update payload",
      function () {

        var model = orderModelFactory.toWrapper(orderGetVersionObject);
        expect(model.getUpdateVersion()).to.deep.equal(orderUpdateVersionObject);
      });

    it("should always create order model that returns an openmrs get payload",
      function () {

        var model = orderModelFactory.toWrapper(orderGetVersionObject);
        // console.log("before", JSON.stringify(model.fromWrapper()));
        // console.log("after ", JSON.stringify(orderGetVersionObject));
        expect(JSON.stringify(model.fromWrapper())).to.equal(JSON.stringify(orderGetVersionObject));
      });

    it("should always have toWrapperArray create an array of order models " +
      " that returns a valid openmrs orders array payload",
      function () {

        var models = orderModelFactory.toArrayOfWrappers(orders);

        for (var i = 0; i++; i < models.length) {
          expect(models[i].fromWrapper()).to.deep.equal(orders[i]);
        }

      });

    it("should always have fromArrayOfWrappers return an array of order" +
      " models that are valid openmrs order payload",
      function () {


        var models = orderModelFactory.toArrayOfWrappers(orders);

        var unwrappedModels = orderModelFactory.fromArrayOfWrappers(models);

        for (var i = 0; i++; i < unwrappedModels.length) {
          expect(unwrappedModels[i]).to.deep.equal(orders[i]);
        }

      });

  });

})();
