angular.module('starter.controllers')

.controller('SignupCtrl', function($scope, $ionicPopup, Storage) {
  $scope.user = {};

  $scope.yearOptions = [{name: 'First', value: 1},
                        {name: 'Second', value: 2},
                        {name: 'Third', value: 3},
                        {name: 'Fourth', value: 4},
                        {name: 'Postgrad/Staff', value: 5}];

  var hash = function(s){
    return s.split("").reduce(function(a,b){a=((a<<5)-a)+b.charCodeAt(0);return a&a},0);
  };

  $scope.signup = function (user) {
    //buffered local storage
    user.checksum = hash('' + user.email + user.first_name + user.last_name + user.year).toString();
    Storage.addMember(user);
    $ionicPopup.alert({
      title: ('Welcome to DUCSS, ' + user.first_name + "!"),
      subTitle: ("We'll send you an email later in the week!"),
      okText: 'Sweet!',
      okType: 'button-balanced'
    });
    $scope.user = {};
    Storage.uploadTemp();
  };
});
