angular.module('starter.controllers')

.controller('ReviewCtrl', function($scope, Storage, $ionicPopup) {
  $scope.refreshLists = function () {
    $scope.tempMembers = Storage.getTempMembers();
    $scope.sendingMembers = Storage.getSendingMembers();
    $scope.dirtyMembers = Storage.getDirtyMembers();
    $scope.sentMembers = Storage.getSentMembers();
    $scope.emptyBuffers = !( $scope.tempMembers.length > 0 || $scope.sendingMembers.length > 0 || $scope.dirtyMembers.length > 0 || $scope.sentMembers.length > 0);
  };

  $scope.$on('$ionicView.enter', function(e) {
    $scope.refreshLists();
  });

  $scope.retryUpload = function () {
    Storage.uploadTemp().then(
      function(code) {
        $scope.refreshLists();
      },
      function(code) {
        console.log(code);
        $ionicPopup.alert({
          title: ('Error: ' + code),
          template: (code === 0)? 'No internet you boob!': 'You should maybe logout?',
          okType: 'button-assertive'
        });
      }
    );
    setTimeout(function() {
      $scope.refreshLists();
    }, 100);
  };

  $scope.deleteDirty = function (member) {
    Storage.deleteDirty(member.checksum);
    $scope.refreshLists();
  };

  $scope.deleteSent = function (member) {
    Storage.deleteSent(member.checksum);
    $scope.refreshLists();
  };
});
