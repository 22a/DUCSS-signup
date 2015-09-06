angular.module('starter.controllers')

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

    Storage.uploadTemp();

    // $ionicPopup.alert({
    //   title: ((a?'':'NOT ') + 'Connected'),
    //   subTitle: ("to the internet"),
    //   okText: (a?'Sweet!':'DAMN!'),
    //   okType: (a?"button-balanced":"button-assertive")
    // });
  };
});