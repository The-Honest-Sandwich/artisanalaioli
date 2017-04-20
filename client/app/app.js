'use strict';
//
// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
  'ngRoute.middleware',
  'ngFileUpload',
  'myApp.uploadbill',
  'myApp.addfriend',
  'myApp.split',
  'myApp.services',
  'myApp.auth',
  'myApp.bills',
  'myApp.addItems',
  'myApp.payment'
])

// FRONT-END MIDDLEWARE CONFIG
.config(['$middlewareProvider', function middlewareProviderConfig($middlewareProvider) {

  $middlewareProvider.map({

    /** Let everyone through */
    'everyone': function everyoneMiddleware() {
      // In order to resolve the middleware,
      // you MUST call this.next()
      this.next();
    },

    /** Wait for async authentication. */
    'async-auth': ['$http', '$rootScope', function asyncAuth($http, $rootScope) {
      // We'll need access to "this" in a deeper context
      var request = this;

      // Grab something from the server
      $http.get('/auth/isLoggedIn')

      // The server has responded!
      .then(function success(res) {
        if ( res.data.loggedIn === true ) {
          console.log('LOGGED IN: APPROVING.');
          $rootScope.username = res.data.username;
          $rootScope.signedIn = true;
          return request.next();
        }
        console.error('You must be logged in to visit this page!');
        request.redirectTo('/signin');
      },

      function fail(err) {
          request.redirectTo('/signin');
      });
    }]

  });

}])

// ROUTE CONFIG
.config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider, $httpProvider) {
  $locationProvider.hashPrefix('!');

  window.routes = {
    '/signin': {
      templateUrl: 'auth/signin.html',
      controller: 'AuthController',
      middleware: 'everyone'
    },
    '/addfriend': {
      templateUrl: 'add-friend/add-friend.template.html',
      controller: 'AddFriendCtrl',
      middleware: 'async-auth'
    },
    '/signup': {
      templateUrl: 'auth/signup.html',
      controller: 'AuthController',
      allowAnonymous: true
    },
    '/split': {
      templateUrl: 'split/split.template.html',
      controller: 'SplitCtrl',
      middleware: 'async-auth'
    },
    '/bills': {
      templateUrl: 'user-details/bills.html',
      controller: 'BillsController',
      middleware: 'async-auth'
    },
    '/uploadbill': {
      templateUrl: 'upload-bill/upload-bill.template.html',
      controller: 'UploadBillCtrl',
      middleware: 'async-auth'
    },
    '/additems': {
      templateUrl: 'add-items/add-items.template.html',
      controller: 'AddItemCtrl',
      middleware: 'async-auth'
    },
    '/collapseListGroup1': {
      templateUrl: '',
      controller: '',
      middleware: ''
    },
    '/pay': {
      templateUrl: 'payment/payment.template.html',
      controller: 'PaymentCtrl',
      middleware: 'async-auth'
    }
  };

  for (var path in window.routes) {
    $routeProvider.when(path, window.routes[path]);
  }

  $routeProvider.otherwise({redirectTo: '/signin'});
}])

.run(function($rootScope, Party, Auth, Bill, $location) {

  $rootScope.newBill = function() {
    Party.removeAll();
    Bill.clearAllBill();
  };

  $rootScope.signout = function() {
    Auth.signout();
  };

  $rootScope.signedIn = false;

});
