(function() {
  'use strict';
  
  /**
   * Names too long hence abbreviations
   * CUR_TB_TX_DETAILED = PATIENT REPORTED CURRENT TUBERCULOSIS TREATMENT, DETAILED [grouper concept]
   * CUR_TB_TX = PATIENT REPORTED CURRENT TUBERCULOSIS TREATMENT
   * TB_TX_DRUG_STARTED_DETAILED = TB TREATMENT DRUGS STARTED, DETAILED [grouper]
   * TB_TX_PLAN = TUBERCULOSIS TREATMENT PLAN
   */  
   
  angular
    .module('openmrs-ngresource.utils')
      .constant('CONCEPT_UUIDS', {
        CUR_TB_TX_DETAILED: 'a8afdb8c-1350-11df-a1f1-0026b9348838',
        CUR_TB_TX: 'a899e444-1350-11df-a1f1-0026b9348838',
        TB_TX_DRUG_STARTED_DETAILED: 'a89fe6f0-1350-11df-a1f1-0026b9348838',
        TB_TX_PLAN: 'a89c1fd4-1350-11df-a1f1-0026b9348838',
        CC_HPI: 'a89ffbf4-1350-11df-a1f1-0026b9348838',
        ASSESSMENT: '23f710cc-7f9c-4255-9b6b-c3e240215dba'
      });  
})();
