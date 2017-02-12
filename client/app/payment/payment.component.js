'use strict';

angular.module('myApp.payment', [])

.controller('PaymentCtrl', function($scope, Bill, Users, $rootScope) {

  $scope.enterPaymentInfo = false;
  $scope.selectedUser = null;
  $scope.amountToPay = null;
  $scope.amountString = null;
  $scope.savedPayments = [];
  $scope.cardNumber = null;
  $scope.cvvNumber = null;
  $scope.cardName = null;
  $scope.address1 = null;
  $scope.address2 = null;
  $scope.cityName = null;
  $scope.stateName = null;
  $scope.zipCode = null;
  $scope.paymentInfoReady = false;
  $scope.paymentSubmitted = false;
  $scope.saveCard = false;
  $scope.paymentSaveName = '';

  // on initialize, populates all users from DB into $scope.users for typeahead
  var init = function() {
    Users.getAll(function(res) {
        $scope.users = res.data;

        for (var i = 0; i < $scope.users.length; i++) {
          if ($scope.users[i].username === $rootScope.username) {
            $scope.users.splice(i, 1);
            console.log('Removed current user from available search options.');
            return;
          }
        }
    });

  };

  init();

  $scope.selectUser = function(username, amount) {
    $scope.selectedUser = username;
    $scope.amountToPay = amount;
    $scope.amountString = amount.toFixed(2);
    console.log($scope.selectedUser, $scope.amountString);
  };

  $scope.prepPayment = function() {
    $scope.paymentInfoReady = true;
    $scope.enterPaymentInfo = false;
  }

  $scope.submitPayment = function() {
    console.log('Payment submitted!');
    if ($scope.saveCard) {
      console.log($scope.paymentSaveName);
    }
    $scope.paymentInfoReady = false;
    $scope.paymentSubmitted = true;

    var paymentData = {
      to: $scope.selectedUser,
      from: $rootScope.username,
      amount: $scope.amountString
    };

    Users.paymentNotify(paymentData);
  }

});