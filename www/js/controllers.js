angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, $location, $ionicPopup, API) {

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

  var passLogin = function () {
    $scope.loginData.password = '';
    $scope.loggedIn = true;
    $scope.closeLogin();
    $location.path('app/signup');
  }

  $scope.doLogin = function() {
    $scope.connecting = true;
    API.GET('/auth', $scope.loginData.username, $scope.loginData.password)
      .then(
        function (response) {
          localStorage.setItem("token", response.token);
          localStorage.setItem("username", $scope.loginData.username);
          sendToken();
        },
        function (error) {
          $scope.loginData.password = '';
          $scope.connecting = false;
          if(error.code === 401 || error.code === 404){
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

  var sendToken = function () {
    API.GET('/token', localStorage.getItem("username"), localStorage.getItem("token"))
      .then(
        function (response) {
          passLogin();
        },
        function (error) {
          if(error.code === 401 || error.code === 404){
            localStorage.removeItem("token");
            $scope.connecting = false;
            $ionicPopup.alert({
              title: ('Error: ' + error.code),
              template: 'Your token is no longer valid',
              okType: 'button-assertive'
            });
          }
          else {
            $scope.connecting = false;
            $ionicPopup.alert({
              title: ('Error: ' + error.code),
              template: 'Check your internet connection',
              okType: 'button-assertive'
            });
          }
        }
      );
  }

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
      okType: 'button-balanced'
    });
    
    //attempt to upload new member
    Storage.uploadTemp();

    // $ionicPopup.alert({
    //   title: ((a?'':'NOT ') + 'Connected'),
    //   subTitle: ("to the internet"),
    //   okText: (a?'Sweet!':'DAMN!'),
    //   okType: (a?"button-balanced":"button-assertive")
    // });
  };

})
.controller('ReviewCtrl', function($scope, Storage) {
  var refreshLists = function () {
    $scope.tempMembers = Storage.getTempMembers();
    $scope.sendingMembers = Storage.getSendingMembers();
  }

  $scope.$on('$ionicView.enter', function(e) {
    refreshLists();
  });
});
