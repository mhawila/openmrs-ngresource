(function() {
  'use strict';
  
  angular
    .module('openmrs-ngresource.restServices')
    .constant('DEFAULT_FORM_REP', 'custom:(uuid,name,encounterType:(uuid,name),version,' +
                       'published,retired,retiredReason,resources:(uuid,name,dataType,valueReference))');
})();
