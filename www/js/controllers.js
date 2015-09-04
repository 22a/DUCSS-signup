angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, $location, $ionicSideMenuDelegate) {

  $scope.loggedIn = false;

  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
    $scope.login();
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    //Perhaps jump off to API Service?
    //putting this here as a placeholder
    var successfulLogin = true;
    if (successfulLogin) {
      $scope.loginData = {};
      $scope.loggedIn = true;
      $scope.closeLogin();
      $location.path('app/signup')
    }

  };

  $scope.doLogout = function() {
    // TODO: add confirm dialog
    $scope.loggedIn = false;
    $location.path('app/signup');
    $ionicSideMenuDelegate.toggleLeft();
    $scope.modal.show();
  };

})
.controller('SignupCtrl', function($scope) {

})
.controller('ReviewCtrl', function($scope) {

});
