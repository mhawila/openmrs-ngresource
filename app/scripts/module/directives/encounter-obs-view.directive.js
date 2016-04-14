/* global angular */
/*
 jshint -W003, -W026
 */
(function() {
  'use strict';

  angular
    .module('openmrs-ngresource.restServices')
    .directive('obsview', obsview);

  function obsview() {
    return {
      restict: 'E',
      controller: obsviewController,
      scope: {
        obs: '=',
      },
      templateUrl: 'views/directives/obsview.html',
    };

  }
  obsviewController.$inject = ['$scope','$filter'];
  function obsviewController($scope,$filter) {
    $scope.formatDate = function (date) {
      if (isNaN(date)){
        date = $filter('date')(date,'dd/MM/yyyy');
      }
      return date;
    };
  }

})();
