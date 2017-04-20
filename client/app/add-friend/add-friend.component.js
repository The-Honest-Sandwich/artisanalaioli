'use strict';

angular.module('myApp.addfriend', ['ui.bootstrap'])

.controller('AddFriendCtrl',  function($scope, $rootScope, Users, Party, Auth) {

  $scope.party = [];

  var init = function() {
    $rootScope.newBill();

    Users.getAll(function(res) {
        $scope.users = res.data;
        for (var i = 0; i < res.data.length; i++) {
          if (res.data[i].username === $rootScope.username) {
            $scope.addToParty(res.data[i]);
            return;
          }
        }
    });
  }

  init();


  var getParty = function() {
    $scope.party = Party.getAll();
  }

  $scope.addToParty = function(user) {
    if (user !== '' || user !== undefined) {
      Party.addOne(user);
      getParty();
      $scope.partymember = '';
    }
  }

  $scope.removeFromParty = function(name) {
    Party.remove(name);
    getParty();
  }

  $scope.addToPartyManual = function(name, email) {
    Party.addOne({username: name, email: email});
    getParty();
    $scope.emailManual = '';
    $scope.memberManual = '';
  }

});
