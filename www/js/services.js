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
});
