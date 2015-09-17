angular.module('starter.services')

.service('API', function($http, $q) {
  var url = 'https://spootbean.cbrenn.me/api';
  var deferredGet;
  var deferredPost;

  this.GET = function (endpoint, authUser, authPass) {
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
      "members" : postData
    })
    .success(function (data) {
      deferredPost.resolve(data);
    })
    .error(function (message, code) {
      deferredPost.reject({"message" : message, "code" : code});
    });
    return deferredPost.promise;
  };

  this.login = function(email, password) {
    var auth = 'Basic ' + btoa(email + ':' + password);
    return $http.get(url + '/access', {
      headers :{ 'Authorization' : auth}
    });
  };

  this.addMembers = function(membersArray) {
    return $http.post(url + '/members/import', {
      'members' : membersArray
    });
  };
});
