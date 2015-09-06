angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, $location, $ionicPopup, API) {

  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  $scope.openLogin = function() {
    $scope.modal.show();
  };

  var passLogin = function () {
    $scope.loginData.password = '';
    $scope.loggedIn = true;
    $scope.closeLogin();
    $location.path('app/signup');
  };

  $scope.login = function() {
    $scope.connecting = true;
    API.GET('/access', $scope.loginData.username, $scope.loginData.password)
    .then(
      function (response) {
        localStorage.setItem("token", response.token);
        passLogin();
        $scope.connecting = false;
      },
      function (error) {
        $scope.loginData.password = '';
        $scope.connecting = false;
        if(error.code === 401){
          $ionicPopup.alert({
            title: ('Error: ' + error.code),
            template: 'Incorrect Username/Password',
            okType: 'button-assertive'
          });
        }
        else {
          $ionicPopup.alert({
            title: ('Error: ' + error.code),
            template: 'Check your internet connection',
            okType: 'button-assertive'
          });
        }
      }
    );
  };

  $scope.logout = function() {
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
        $scope.connecting = false;
        localStorage.removeItem("token");
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

  var localToken = localStorage.getItem("token");

  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  })
  .then(function(modal) {
    $scope.modal = modal;
    if(!localToken){
      $scope.openLogin();
    }
  });

});
