angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, $location, $ionicPopup) {

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
    var confirmPopup = $ionicPopup.confirm({
      title: 'Warning',
      subTitle: ("Data may be lost!"),
      template: 'Are you sure you want to log out?',
      okText: 'LOGOUT',
      okType: 'button-assertive'
    });
    confirmPopup.then(function(res) {
      if(res) {
        $scope.loggedIn = false;
        $scope.modal.show();
        $location.path('app/signup');
      } else {
        // user clicked no to logout, butter fingers
      }
    });
  };

})
.controller('SignupCtrl', function($scope, $ionicPopup) {
  $scope.signup = function (user) {
    //buffered local storage

    $ionicPopup.alert({
      title: ('Welcome to DUCSS, ' + user.firstName + "!"),
      subTitle: ("We'll send more information to your email later on in the week!"),
      okText: 'Sweet!',
      okType: 'button-balanced',
   });

    user = {};
  };

})
.controller('ReviewCtrl', function($scope) {

});
