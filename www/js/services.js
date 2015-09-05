angular.module('starter.services', [])

.service('Storage', function () {
  var tempBuffAdd = 'ducss-member-temp-storage';
  var temp = [];

  var sendingBuffAdd = 'ducss-member-sending-storage';
  var sending = [];

  this.addMember = function (user) {
    //TODO: add validations on passed obj
    temp = JSON.parse(localStorage.getItem(tempBuffAdd)) || temp;
    temp.push(user);
    localStorage.setItem(tempBuffAdd, JSON.stringify(temp));
  };

  this.getTempMembers = function () {
    return JSON.parse(localStorage.getItem(tempBuffAdd));
  };
})

.service('API', function($http, $q) {
  var url = 'http://localhost:3000';
  var deferred;

  this.GET = function (endpoint, authUser, authPass) {
    deferred = $q.defer();
    var auth = 'Basic ' + btoa(authUser + ':' + authPass);
    $http.get(url + endpoint, {
      headers :{ 'Authorization' : auth}
    })
    .success(function (data) {
      deferred.resolve(data);
    })
    .error(function (message, code) {
      deferred.reject({"message" : message, "code" : code});
    });
    return deferred.promise;
  };
});
