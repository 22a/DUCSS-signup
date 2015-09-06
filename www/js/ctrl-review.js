angular.module('starter.controllers')

.controller('ReviewCtrl', function($scope, Storage) {
  var refreshLists = function () {
    $scope.tempMembers = Storage.getTempMembers();
    $scope.sendingMembers = Storage.getSendingMembers();
    $scope.dirtyMembers = Storage.getDirtyMembers();
  };

  $scope.$on('$ionicView.enter', function(e) {
    refreshLists();
  });
});