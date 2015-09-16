angular.module('starter.controllers')

.controller('ReviewCtrl', function($scope, Storage) {
  $scope.refreshLists = function () {
    $scope.tempMembers = Storage.getTempMembers();
    $scope.sendingMembers = Storage.getSendingMembers();
    $scope.dirtyMembers = Storage.getDirtyMembers();
    $scope.emptyBuffers = !( $scope.tempMembers[0] || $scope.sendingMembers[0] || $scope.dirtyMembers[0] );
  };

  $scope.$on('$ionicView.enter', function(e) {
    $scope.refreshLists();
  });

  $scope.retryUpload = function () {
    Storage.uploadTemp();
    setTimeout(function() {
      $scope.refreshLists();
    }, 100);
  };

  $scope.deleteDirty = function (member) {
    Storage.deleteDirty(member.checksum);
    $scope.refreshLists();
  };
});
