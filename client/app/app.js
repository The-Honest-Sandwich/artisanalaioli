'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
  'myApp.uploadbill',
  'myApp.addfriend',
  'myApp.split',
  'myApp.services',
  'myApp.auth',
  'myApp.bills'
])
.config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $locationProvider.hashPrefix('!');


  $routeProvider
    .when('/addfriend', {
      templateUrl: 'add-friend/add-friend.template.html',
      controller: 'AddFriendCtrl'
    })
    .when('/signin', {
      templateUrl: 'auth/signin.html',
      controller: 'AuthController'
    })
    .when('/signup', {
      templateUrl: 'auth/signup.html',
      controller: 'AuthController'
    })
    .when('/split', {
      templateUrl: 'split/split.template.html',
      controller: 'SplitCtrl'
    })
    .when('/bills', {
      templateUrl: 'user-details/bills.html',
      controller: 'BillsController'
    })
    .when('/uploadbill', {
      templateUrl: 'upload-bill/upload-bill.template.html',
      controller: 'UploadBillCtrl'
    })
    .otherwise({redirectTo: '/view1'});
}
])
.run(function($rootScope, $http, $window) {
  $rootScope.signout = function() {
    console.log('trying to sign out');
    $http({
      method: 'POST',
      url: '/auth/logout/'
    })
    .then(function(response) {
      console.log('logged out', response);
      $rootScope.signedIn = false;
      $window.location.href = '/#!/signin';
    })
    .catch(function(error) {
      console.log('Error: ', error);
    });
  }
});
