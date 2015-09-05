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
    return true; //TODO: CHANGE TO FALSE WHEN DONE DEBUGGING!!!
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
    if (!currentlyUploading && hasConnection() ) {
      currentlyUploading = true;
      sending = sending.concat(this.getTempMembers());
      localStorage.setItem(sendingBuffAdd, JSON.stringify(sending));
      temp = [];
      localStorage.setItem(tempBuffAdd, JSON.stringify(temp));

      API.POST('/members/import', sending, localStorage.getItem("token"))
      .then(
        function (response) {
          sending = [];
          localStorage.setItem(sendingBuffAdd, JSON.stringify(sending));
          currentlyUploading = false;
          return true;
        },
        function (error) {
          // error in upload
          // TODO: add reaction
          return false;
        }
      );
    }
  };
})

.service('API', function($http, $q) {
  var url = 'https://spootbean.cbrenn.me/api';
  var deferredGet;
  var deferredPost;

  this.GET = function (endpoint, authUser, authPass) {
    deferredGet = $q.defer();
    var auth = 'Basic ' + btoa(authUser + ':' + authPass);
    $http.get(url + endpoint, {
      headers :{ 'Authorization' : auth}
    })
    .success(function (data) {
      deferredGet.resolve(data);
    })
    .error(function (message, code) {
      deferredGet.reject({"message" : message, "code" : code});
    });
    return deferredGet.promise;
  };

  this.POST = function (endpoint, postData, token) {
    deferredPost = $q.defer();
    $http.post(url + endpoint, {
      headers :{ 'Authorization': 'Token token="' + token + '"' },
      data :{ "members" : postData }
    })
    .success(function (data) {
      deferredPost.resolve(data);
    })
    .error(function (message, code) {
      deferredPost.reject({"message" : message, "code" : code});
    });
    return deferredPost.promise;
  };
});
