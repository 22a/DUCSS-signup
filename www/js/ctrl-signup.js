angular.module('starter.controllers')

.controller('SignupCtrl', function($scope, $ionicPopup, Storage) {
  $scope.user = {};

  var hash = function(s){
    return s.split("").reduce(function(a,b){a=((a<<5)-a)+b.charCodeAt(0);return a&a},0);
  };

  $scope.signup = function (user) {
    //buffered local storage
    user.checksum = hash('' + user.email + user.first_name + user.last_name + user.year).toString();
    Storage.addMember(user);
    $ionicPopup.alert({
      title: ('Welcome to DUCSS, ' + user.first_name + "!"),
      subTitle: ("We'll send more information to your email later on this week!"),
      okText: 'Sweet!',
      okType: 'button-balanced'
    });
    $scope.user = {};
    Storage.uploadTemp();

    // $ionicPopup.alert({
    //   title: ((a?'':'NOT ') + 'Connected'),
    //   subTitle: ("to the internet"),
    //   okText: (a?'Sweet!':'DAMN!'),
    //   okType: (a?"button-balanced":"button-assertive")
    // });
  };
});
