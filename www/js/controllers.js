angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, $location, $ionicPopup) {

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
    $scope.login();
  });

  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  $scope.login = function() {
    $scope.modal.show();
  };

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
      }
      else {
        // user clicked no to logout, butter fingers
      }
    });
  };

  $scope.loggedIn = false;
  $scope.loginData = {};
  $scope.connecting = true; // linked to loading icon during token comms

  var localToken = localStorage.getItem("token");
  var localUN = localStorage.getItem("username");

  if (localUN) {
    $scope.loginData.username = localUN;
  }
  if(!(localToken && localUN)){
    $scope.connecting = false;
  }
  else{
    sendToken();
  }

})
.controller('SignupCtrl', function($scope, $ionicPopup, Storage) {
  $scope.user = {};

  $scope.signup = function (user) {
    //buffered local storage
    Storage.addMember(user);
    $scope.user = {};
    $ionicPopup.alert({
      title: ('Welcome to DUCSS, ' + user.firstName + "!"),
      subTitle: ("We'll send more information to your email later on this week!"),
      okText: 'Sweet!',
      okType: 'button-balanced',
    });
  };

})
.controller('ReviewCtrl', function($scope, Storage) {
  $scope.tempMembers = Storage.getTempMembers();
});
