'use strict';

angular.module('myApp.payment', [])

.controller('PaymentCtrl', function($scope, Bill, Users, $rootScope) {

  $scope.enterPaymentInfo = false;
  $scope.selectedUser = null;
  $scope.amountToPay = null;
  $scope.amountString = null;
  $scope.savedPayments = [];
  $scope.paymentInfoReady = false;
  $scope.paymentSubmitted = false;
  $scope.saveCard = false;
  $scope.paymentSaveName = '';

  $scope.paymentInfo = {
    'cardNumber': null,
    'cvvNumber': null,
    'cardName': null,
    'address1': null,
    'address2': null,
    'cityName': null,
    'stateName': null,
    'zipCode': null,
    'name': null
  }

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

    Users.getPaymentMethods(function(res) {
      $scope.savedPayments = res.data.methods;
      console.log('Loaded payment methods:', $scope.savedPayments);
    });

  };

  init();

  $scope.selectSaved = function() {
    var selected = $scope.savedPaymentChoice;
    for (var i = 0; i < $scope.savedPayments.length; i++) {
      if ($scope.savedPayments[i].name === selected) {
        $scope.paymentInfo.cardNumber = $scope.savedPayments[i].cardNumber,
        $scope.paymentInfo.cvvNumber = $scope.savedPayments[i].cvvNumber,
        $scope.paymentInfo.cardName = $scope.savedPayments[i].cardName,
        $scope.paymentInfo.address1 = $scope.savedPayments[i].address1,
        $scope.paymentInfo.address2 = $scope.savedPayments[i].address2 || '',
        $scope.paymentInfo.cityName = $scope.savedPayments[i].cityName,
        $scope.paymentInfo.stateName = $scope.savedPayments[i].stateName,
        $scope.paymentInfo.zipCode = $scope.savedPayments[i].zipCode
      }
    }
  };

  $scope.selectUser = function(username, amount) {
    $scope.selectedUser = username;
    $scope.amountToPay = amount;
    $scope.amountString = amount.toFixed(2);
    console.log($scope.selectedUser, $scope.amountString);
  };

  $scope.prepPayment = function() {
    $scope.paymentInfoReady = true;
    $scope.enterPaymentInfo = false;
    console.log($scope.savedPaymentChoice);
  }

  $scope.submitPayment = function() {
    console.log('Payment submitted!');
    if ($scope.saveCard) {
      console.log($scope.paymentSaveName);
      Users.addPaymentMethod($scope.paymentInfo);
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