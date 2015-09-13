angular.module('starter.services', [])

.service('Storage', function ( API ) {
  var currentlyUploading = false;

  var tempBuffAdd = 'ducss-member-temp-storage';
  var temp = [];

  var sendingBuffAdd = 'ducss-member-sending-storage';
  var sending = [];

  var dirtyMemAdd = 'ducss-member-dirty-storage';
  var dirty = [];

  var hasConnection = function () {
    if(window.Connection) {
      return navigator.connection.type !== 'Connection.NONE';
    }
    return true;
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

  this.getDirtyMembers = function () {
    return JSON.parse(localStorage.getItem(dirtyMemAdd));
  };

  this.deleteDirty = function (checksum) {
    dirty = this.getDirtyMembers();
    dirty = dirty.filter(function( member ) {
      return member.checksum !== checksum;
    });
    localStorage.setItem(dirtyMemAdd, JSON.stringify(dirty));
  };

  this.uploadTemp = function () {
    if ( !currentlyUploading && hasConnection() ) {
      currentlyUploading = true;
      sending = (this.getSendingMembers() || sending).concat(this.getTempMembers());
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
          else {
            dirty = JSON.parse(localStorage.getItem(dirtyMemAdd)) || dirty;
            for (var i = response.results.error_checksums.length - 1; i >= 0; i--) {
              for (var j = sending.length - 1; j >= 0; j--) {
                if (sending[j].checksum === response.results.error_checksums[i]) {
                  dirty.push(sending[j]);
                }
              }
            }
            localStorage.setItem(dirtyMemAdd, JSON.stringify(dirty));
            sending = [];
            localStorage.setItem(sendingBuffAdd, JSON.stringify(sending));
          }
        },
        function (error) {
          temp = JSON.parse(localStorage.getItem(sendingBuffAdd));
          localStorage.setItem(tempBuffAdd, JSON.stringify(temp));
          sending = [];
          localStorage.setItem(sendingBuffAdd, JSON.stringify(sending));
        }
      );
      currentlyUploading = false;
    }
    return false;
  };
});
