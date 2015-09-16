angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, $location, $ionicPopup, API, $state, $http) {

  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  $scope.openLogin = function() {
    $scope.modal.show();
  };

  var passLogin = function () {
    $scope.loginData.password = '';
    $scope.loggedIn = true;
    $http.defaults.headers.post.Authorization = 'Token token="' + localStorage.getItem('token') + '"';
    $scope.closeLogin();
  };

  $scope.pinCheck = function(destination) {
    $scope.data = {};
    var pinPopup = $ionicPopup.show({
      template: '<input type="password" ng-model="data.pin">',
      title: 'Enter Magnus Password',
      scope: $scope,
      buttons: [
        { text: 'Cancel'   },
        {
          text: '<b>Submit</b>',
          type: 'button-balanced',
          onTap: function(e) {
            if (!$scope.data.pin) {
              e.preventDefault();
            }
            else {
              return $scope.data.pin;
            }
          }
        }
      ]
    });
    pinPopup.then(function(res) {
      if(res === 'spoot') {
        if (destination === 'logout') {
          $scope.logout();
        }
        else if (destination === 'signup') {
          $state.go('app.signup');
        }
        else if (destination === 'review') {
          $state.go('app.review');
        }
      }
    });
  };

  $scope.login = function() {
    $scope.connecting = true;
    API.login($scope.loginData.username, $scope.loginData.password).then(
      function(response) {
        localStorage.setItem("token", response.data.token);
        passLogin();
        $scope.connecting = false;
      },
      function(response) {
        $scope.loginData.password = '';
        $scope.connecting = false;
        if(response.status === 401){
          $ionicPopup.alert({
            title: ('Error: ' + response.status),
            template: 'Incorrect Username/Password',
            okType: 'button-assertive'
          });
        }
        else {
          $ionicPopup.alert({
            title: ('Error: ' + response.status),
            template: 'Check your internet connection',
            okType: 'button-assertive'
          });
        }
      });
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
    if(typeof localToken === "undefined" || localToken === null){
      $scope.openLogin();
    } else {
      $http.defaults.headers.post.Authorization = 'Token token="' + localStorage.getItem('token') + '"';
    }
  });

});
