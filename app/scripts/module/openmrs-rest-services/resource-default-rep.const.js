(function() {
  'use strict';
  
  angular
    .module('openmrs-ngresource.restServices')
    .constant('FORM_REP', 'custom:(uuid,name,encounterType:(uuid,name),version,' +
                       'published,resources:(uuid,name,dataType,valueReference))');
})();
