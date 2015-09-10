angular.module('starter.controllers')

.controller('ReviewCtrl', function($scope, Storage) {
  var refreshLists = function () {
    $scope.tempMembers = Storage.getTempMembers();
    $scope.sendingMembers = Storage.getSendingMembers();
    $scope.dirtyMembers = Storage.getDirtyMembers();
    $scope.emptyBuffers = !( $scope.tempMembers[0] || $scope.sendingMembers[0] || $scope.dirtyMembers[0] );
  };

  $scope.$on('$ionicView.enter', function(e) {
    refreshLists();
  });

  $scope.deleteDirty = function (member) {
    Storage.deleteDirty(member.checksum);
    refreshLists();
  };
});
