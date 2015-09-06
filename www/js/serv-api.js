angular.module('starter.services')

.service('API', function($http, $q) {
  $http.defaults.headers.post.Authorization = 'Token token="' + localStorage.getItem('token') + '"';
  
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
});
