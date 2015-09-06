angular.module('starter.services', [])

.service('Storage', function ( API ) {
  var currentlyUploading = false;

  var tempBuffAdd = 'ducss-member-temp-storage';
  var temp = [];

  var sendingBuffAdd = 'ducss-member-sending-storage';
  var sending = [];

  var hasConnection = function () {
    if(window.Connection) {
      return navigator.connection.type !== 'Connection.NONE';
    }
    return false;
  };

  this.addMember = function (user) {
    //TODO: add validations on passed obj
    temp = JSON.parse(localStorage.getItem(tempBuffAdd)) || temp;
    temp.push(user);
    localStorage.setItem(tempBuffAdd, JSON.stringify(temp));
  };

  this.getTempMembers = function () {
    return JSON.parse(localStorage.getItem(tempBuffAdd));
  };

  this.getSendingMembers = function () {
    return JSON.parse(localStorage.getItem(sendingBuffAdd));
  };

  this.uploadTemp = function () {
    if ( !currentlyUploading && hasConnection() ) {
      currentlyUploading = true;
      sending = sending.concat(this.getTempMembers());
      localStorage.setItem(sendingBuffAdd, JSON.stringify(sending));
      temp = [];
      localStorage.setItem(tempBuffAdd, JSON.stringify(temp));

      API.POST('/members/import', sending, localStorage.getItem("token"))
      .then(
        function (response) {
          if (response.results.errors === 0) {
            sending = [];
            localStorage.setItem(sendingBuffAdd, JSON.stringify(sending));
            return true;
          }
          currentlyUploading = false;
        },
        function (error) {
          // error in upload
          // TODO: add reaction
        }
      );
    }
    return false;
  };
});
