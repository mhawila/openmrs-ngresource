/*jshint -W003, -W098, -W117, -W026, -W040, -W004 */
(function () {
    'use strict';

    angular
        .module('openmrs-ngresource.models')
        .factory('OrderModel', factory);

    factory.$inject = ['ConceptModel', 'EncounterModel'];

    function factory(ConceptModel, EncounterModel) {
        var service = {
            order: order,
            toWrapper: toWrapper,
            toArrayOfWrappers: toArrayOfWrappers,
            fromArrayOfWrappers: fromArrayOfWrappers
        };

        return service;

        function order(encounterUuid_, patientUuid_, conceptUuid_,
            type_, ordererProviderUuid_, careSettingUuid_, action_, dateActivated_,
            autoExpireDate_, orderReasonConceptUuid_, orderReasonNonCoded_,
            instructions_, urgency_, commentToFulfiller_,
            clinicalHistory_, numberOfRepeats_, uuid_, orderNumber_, display_,
            patient_, concept_, encounter_, orderer_, careSetting_, orderReason_) {
            var modelDefinition = this;

            //initialize private members
            var _encounterUuid = encounterUuid_ ? encounterUuid_ : '';
            var _patientUuid = patientUuid_ ? patientUuid_ : '';
            var _conceptUuid = conceptUuid_ ? conceptUuid_ : '';
            var _type = type_ ? type_ : '';
            var _ordererProviderUuid = ordererProviderUuid_ ? ordererProviderUuid_ : '';
            var _careSettingUuid = careSettingUuid_ ? careSettingUuid_ : '';
            var _action = action_ ? action_ : '';
            var _dateActivated = dateActivated_ ? dateActivated_ : '';
            var _autoExpireDate = autoExpireDate_ ? autoExpireDate_ : '';
            var _orderReasonConceptUuid = orderReasonConceptUuid_ ? orderReasonConceptUuid_ : '';
            var _orderReasonNonCoded = orderReasonNonCoded_ ? orderReasonNonCoded_ : '';
            var _instructions = instructions_ ? instructions_ : '';
            var _urgency = urgency_ ? urgency_ : '';
            var _commentToFulfiller = commentToFulfiller_ ?
                commentToFulfiller_ : '';
            var _clinicalHistory = clinicalHistory_ ? clinicalHistory_ : '';
            var _numberOfRepeats = numberOfRepeats_ ? numberOfRepeats_ : '';

            var _uuid = uuid_ ? uuid_ : '';
            var _orderNumber = orderNumber_ ? orderNumber_ : '';
            var _display = display_ ? display_ : '';

            //complex members
            var _orderReason = orderReason_ ? ConceptModel.toWrapper(orderReason_) : null;
            var _patient = patient_ ? patient_ : null;
            var _concept = concept_ ? ConceptModel.toWrapper(concept_) : null;
            var _encounter = encounter_ ? new EncounterModel.model(encounter_) : null;
            var _orderer = orderer_ ? orderer_ : null;
            var _careSetting = careSetting_ ? careSetting_ : null;

            modelDefinition.encounterUuid = function (value) {
                if (angular.isDefined(value)) {
                    _encounterUuid = value;
                }
                else {
                    return _encounterUuid;
                }
            };

            modelDefinition.patientUuid = function (value) {
                if (angular.isDefined(value)) {
                    _patientUuid = value;
                }
                else {
                    return _patientUuid;
                }
            };

            modelDefinition.conceptUuid = function (value) {
                if (angular.isDefined(value)) {
                    _conceptUuid = value;
                }
                else {
                    return _conceptUuid;
                }
            };

            modelDefinition.type = function (value) {
                if (angular.isDefined(value)) {
                    _type = value;
                }
                else {
                    return _type;
                }
            };

            modelDefinition.ordererProviderUuid = function (value) {
                if (angular.isDefined(value)) {
                    _ordererProviderUuid = value;
                }
                else {
                    return _ordererProviderUuid;
                }
            };

             modelDefinition.careSettingUuid = function (value) {
                if (angular.isDefined(value)) {
                    _careSettingUuid = value;
                }
                else {
                    return _careSettingUuid;
                }
            };

            modelDefinition.action = function (value) {
                if (angular.isDefined(value)) {
                    _action = value;
                }
                else {
                    return _action;
                }
            };

            modelDefinition.dateActivated = function (value) {
                if (angular.isDefined(value)) {
                    _dateActivated = value;
                }
                else {
                    return _dateActivated;
                }
            };

            modelDefinition.autoExpireDate = function (value) {
                if (angular.isDefined(value)) {
                    _autoExpireDate = value;
                }
                else {
                    return _autoExpireDate;
                }
            };

            modelDefinition.orderReasonConceptUuid = function (value) {
                if (angular.isDefined(value)) {
                    _orderReasonConceptUuid = value;
                }
                else {
                    return _orderReasonConceptUuid;
                }
            };

            modelDefinition.orderReasonNonCoded = function (value) {
                if (angular.isDefined(value)) {
                    _orderReasonNonCoded = value;
                }
                else {
                    return _orderReasonNonCoded;
                }
            };

            modelDefinition.instructions = function (value) {
                if (angular.isDefined(value)) {
                    _instructions = value;
                }
                else {
                    return _instructions;
                }
            };

            modelDefinition.urgency = function (value) {
                if (angular.isDefined(value)) {
                    _urgency = value;
                }
                else {
                    return _urgency;
                }
            };

            modelDefinition.commentToFulfiller = function (value) {
                if (angular.isDefined(value)) {
                    _commentToFulfiller = value;
                }
                else {
                    return _commentToFulfiller;
                }
            };

             modelDefinition.urgency = function (value) {
                if (angular.isDefined(value)) {
                    _urgency = value;
                }
                else {
                    return _urgency;
                }
            };

            modelDefinition.clinicalHistory = function (value) {
                if (angular.isDefined(value)) {
                    _clinicalHistory = value;
                }
                else {
                    return _clinicalHistory;
                }
            };

            modelDefinition.numberOfRepeats = function (value) {
                if (angular.isDefined(value)) {
                    _numberOfRepeats = value;
                }
                else {
                    return _numberOfRepeats;
                }
            };

            modelDefinition.uuid = function (value) {
                return _uuid;
            };

            modelDefinition.display = function (value) {
                return _display;
            };

            modelDefinition.orderNumber = function (value) {
                return _orderNumber;
            };

            

            modelDefinition.patient = function (value) {
                if (angular.isDefined(value)) {
                    _patient = value;
                }
                else {
                    return _patient;
                }
            };

            modelDefinition.concept = function (value) {
                if (angular.isDefined(value)) {
                    _concept = value;
                }
                else {
                    return _concept;
                }
            };

            modelDefinition.encounter = function (value) {
                if (angular.isDefined(value)) {
                    _encounter = value;
                }
                else {
                    return _encounter;
                }
            };

            modelDefinition.orderReason = function (value) {
                if (angular.isDefined(value)) {
                    _orderReason = value;
                }
                else {
                    return _orderReason;
                }
            };

            modelDefinition.orderer = function (value) {
                if (angular.isDefined(value)) {
                    _orderer = value;
                }
                else {
                    return _orderer;
                }
            };

            modelDefinition.careSetting = function (value) {
                if (angular.isDefined(value)) {
                    _careSetting = value;
                }
                else {
                    return _careSetting;
                }
            };

            modelDefinition.fromWrapper = function (value) {
                return {
                    uuid: _uuid,
                    display: _display,
                    orderNumber: _orderNumber,
                    encounter: encounter_,
                    patient: _patient,
                    concept: _concept ? _concept.openmrsModel() : null,
                    type: _type,
                    orderer: _orderer,
                    careSetting: _careSetting,
                    action: _action,
                    dateActivated: _dateActivated,
                    autoExpireDate: _autoExpireDate,
                    orderReason: _orderReason? _orderReason.openmrsModel(): null,
                    orderReasonNonCoded: _orderReasonNonCoded,
                    urgency: _urgency,                                        
                    instructions: _instructions,
                    commentToFulfiller: _commentToFulfiller,
                    clinicalHistory: _clinicalHistory,
                    numberOfRepeats: _numberOfRepeats
                };
            };

            modelDefinition.getCreateVersion = function (value) {
                return {
                    encounter: _encounterUuid,
                    patient: _patientUuid,
                    concept: _conceptUuid,
                    type: _type,
                    orderer: _ordererProviderUuid,
                    careSetting: _careSettingUuid,
                    action: _action,
                    dateActivated: _dateActivated, 
                    autoExpireDate: _autoExpireDate,
                    orderReason: _orderReasonConceptUuid,
                    orderReasonNonCoded: _orderReasonNonCoded,
                    urgency: _urgency,
                    instructions: _instructions,
                    commentToFulfiller: _commentToFulfiller,
                    clinicalHistory: _clinicalHistory,
                    numberOfRepeats: _numberOfRepeats
                };
            };

            modelDefinition.getUpdateVersion = function (value) {
                return modelDefinition.getCreateVersion();
            };
        }

        function toWrapper(openmrsModel) {
            return new order(
                openmrsModel.encounter ? openmrsModel.encounter.uuid : null,
                openmrsModel.patient ? openmrsModel.patient.uuid : null,
                openmrsModel.concept ? openmrsModel.concept.uuid : null,
                openmrsModel.type, openmrsModel.orderer.uuid,
                openmrsModel.careSetting ? openmrsModel.careSetting.uuid : null,
                openmrsModel.action, openmrsModel.dateActivated, openmrsModel.autoExpireDate,
                openmrsModel.orderReason ? openmrsModel.orderReason.uuid : null, 
                openmrsModel.orderReasonNonCoded, openmrsModel.instructions,
                openmrsModel.urgency, openmrsModel.commentToFulfiller, openmrsModel.clinicalHistory,
                openmrsModel.numberOfRepeats, openmrsModel.uuid,  openmrsModel.orderNumber, 
                openmrsModel.display, openmrsModel.patient, openmrsModel.concept, openmrsModel.encounter,
                openmrsModel.orderer, openmrsModel.careSetting, openmrsModel.orderReason);
        }

        function toArrayOfWrappers(openmrsOrderArray) {
            var array = [];
            for (var i = 0; i < openmrsOrderArray.length; i++) {
                array.push(toWrapper(openmrsOrderArray[i]));
            }
            return array;
        }

        function fromArrayOfWrappers(orderWrappersArray) {
            var array = [];
            for (var i = 0; i < orderWrappersArray.length; i++) {
                array.push(orderWrappersArray[i].fromWrapper());
            }
            return array;
        }
    }
})();
