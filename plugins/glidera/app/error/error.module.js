(function (){
  'use strict';

  angular
    .module('app.error', [])
    .factory('Error', ['$state', errorService])
    .controller('errorController', [
      '$scope',
      '$state',
      '$stateParams',
      errorController
    ]);

  function errorController($scope, $state, $stateParams) {
    console.log('here');
    $scope.title = 'Unknown Error';
    $scope.message = 'Please try again.';
  }

  function errorService($state) {
    var factory = {
      'reject': reject
    };

    return factory;

    function reject(res) {
      if (!res.code) {
        Airbitz.ui.showAlert('Error', 'An unknown error occurred.');
      } else {
        if (res.code == 'MissingRequiredParameter') {
          Airbitz.ui.showAlert('Error', 'The request is missing required data.');
        } else if (res.code == 'InvalidParameterValue') {
          Airbitz.ui.showAlert('Invalid', res.message);
        } else if (res.code == 'UnauthorizedException') {
          Airbitz.ui.showAlert('Unauthorized', res.message);
        } else if (res.code == 'ConflictException') {
          if (res.message && res.message.match(/email not verified/i)) {
            $state.go('verifyEmail');
            Airbitz.ui.showAlert('Error', 'Please verify your email address before continuing.');
          } else {
            Airbitz.ui.showAlert('Error', res.message);
          }
        } else {
          Airbitz.ui.showAlert('Default Error', "An unknown error occurred.");
        }
      }
    }
  }

})();