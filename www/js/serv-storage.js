angular.module('starter.services', [])

.service('Storage', function ( API , $q ) {
  var currentlyUploading = false;

  var tempMemAdd = 'ducss-member-temp-storage';
  var temp = [];

  var sendingMemAdd = 'ducss-member-sending-storage';
  var sending = [];

  var dirtyMemAdd = 'ducss-member-dirty-storage';
  var dirty = [];

  var sentMemAdd = 'ducss-member-sent-storage';
  var sent = [];

  var hasConnection = function () {
    if(window.Connection) {
      return navigator.connection.type !== 'Connection.NONE';
    }
    return true;
  };

  this.addMember = function (user) {
    //TODO: add validations on passed obj
    temp = JSON.parse(localStorage.getItem(tempMemAdd)) || temp;
    temp.push(user);
    localStorage.setItem(tempMemAdd, JSON.stringify(temp));
  };

  this.getTempMembers = function () {
    return JSON.parse(localStorage.getItem(tempMemAdd)) || [];
  };

  this.getSendingMembers = function () {
    return JSON.parse(localStorage.getItem(sendingMemAdd)) || [];
  };

  this.getDirtyMembers = function () {
    return JSON.parse(localStorage.getItem(dirtyMemAdd)) || [];
  };

  this.getSentMembers = function () {
    return JSON.parse(localStorage.getItem(sentMemAdd)) || [];
  };

  this.deleteDirty = function (checksum) {
    dirty = this.getDirtyMembers();
    dirty = dirty.filter(function( member ) {
      return member.checksum !== checksum;
    });
    localStorage.setItem(dirtyMemAdd, JSON.stringify(dirty));
  };

  this.deleteSent = function (checksum) {
    sent = this.getSentMembers();
    sent = sent.filter(function( member ) {
      return member.checksum !== checksum;
    });
    localStorage.setItem(sentMemAdd, JSON.stringify(sent));
  };

  this.uploadTemp = function () {
    var deferred = $q.defer();
    if ( !currentlyUploading && hasConnection() ) {
      currentlyUploading = true;
      sending = (this.getSendingMembers() || sending).concat(this.getTempMembers());
      localStorage.setItem(sendingMemAdd, JSON.stringify(sending));
      temp = [];
      localStorage.setItem(tempMemAdd, JSON.stringify(temp));

      API.addMembers(sending).then(
        function(response) {
          if (response.data.results.errors === 0) {
            sent = JSON.parse(localStorage.getItem(sentMemAdd)) || [];
            sent = sent.concat(sending);
            localStorage.setItem(sentMemAdd, JSON.stringify(sent));

            sending = [];
            localStorage.setItem(sendingMemAdd, JSON.stringify(sending));
            deferred.resolve(200);
          }
          else {
            dirty = JSON.parse(localStorage.getItem(dirtyMemAdd)) || dirty;
            for (var i = response.data.results.error_checksums.length - 1; i >= 0; i--) {
              for (var j = sending.length - 1; j >= 0; j--) {
                if (sending[j].checksum === response.data.results.error_checksums[i]) {
                  dirty.push(sending[j]);
                }
                else {
                  sent.push(sending[j]);
                }
              }
            }
            localStorage.setItem(sentMemAdd, JSON.stringify(sent));
            localStorage.setItem(dirtyMemAdd, JSON.stringify(dirty));
            sending = [];
            localStorage.setItem(sendingMemAdd, JSON.stringify(sending));
            deferred.resolve(response.code);
          }
          currentlyUploading = false;
        },
        function(response) {
          temp = JSON.parse(localStorage.getItem(sendingMemAdd));
          localStorage.setItem(tempMemAdd, JSON.stringify(temp));
          sending = [];
          localStorage.setItem(sendingMemAdd, JSON.stringify(sending));
          currentlyUploading = false;
          deferred.reject(response.status);
        });
   } else {
      // show popup
      deferred.reject(0);
    }
    return deferred.promise;
  };
});
