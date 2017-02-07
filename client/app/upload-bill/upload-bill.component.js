'use strict';

angular.module('myApp.uploadbill', ['ngRoute'])

.controller('UploadBillCtrl', function ($scope, Bill) {
  // $scope.image = "";
  $scope.priceBeforeTip = 0;
  $scope.readyToSplit = false;
  $scope.item; // single item
  $scope.price; // price for single item
  $scope.tax = 0;
  $scope.taxRate = 0;
  $scope.tipRate = 0; // this 'rate' is percentage 
  $scope.items = []; // items is an array of [id, item, price, people]
  $scope.count = 0; // when remove item, currentItemId will not decrease

  $scope.addbillinfo = function() {
    $scope.priceBeforeTip = Number.parseFloat($scope.priceBeforeTip);
    // calculate tax rate
    if ($scope.tax) {
      $scope.tax = Number.parseFloat($scope.tax);
      $scope.taxRate = $scope.tax / $scope.priceBeforeTip;
    }
    // calculate tiprate
    if (!$scope.tipRate) {
      $scope.tipRate = ($scope.tipnum / $scope.priceBeforeTip * 100).toFixed(2);
    } 
    $scope.readyToSplit = true;
  }

  $scope.additeminfo = function() {
    $scope.count += 1;
    $scope.price = Number.parseFloat($scope.price);
    $scope.items.push([$scope.count, $scope.item, $scope.price, '']);
    $scope.item = "";
    $scope.price = 0;
  }

  $scope.addBill = function() {
    var bill = {};
    bill.name = $scope.name;
    bill.items = $scope.items;
    bill.priceBeforeTip = $scope.priceBeforeTip;
    bill.taxRate = $scope.taxRate; 
    bill.tipRate = $scope.tipRate / 100; // convert percentage to decimal
    Bill.addBill(bill);
  }

  $scope.removeitem = function(singleitem) {
    var index = $scope.items.indexOf(singleitem);
    $scope.items.splice(index, 1);
    $scope.count -= 1;
    for (var i = 0; i < $scope.items.length; i++) {
      $scope.items[i][0] = i + 1;
    }
  }

  // $scope.removeimg = function() {
  //  $scope.image = "";
  // }
  // $scope.process = function() {
  // }

})
.directive('stringToNumber', function() {
  return {
    require: 'ngModel',
    link: function(scope, element, attrs, ngModel) {
      ngModel.$parsers.push(function(value) {
        return '' + value;
      });
      ngModel.$formatters.push(function(value) {
        return parseFloat(value);
      });
    }
  };
});
// .directive('myUpload', [function () {
//  return {
//    restrict: 'A',
//    link: function ($scope, elem, attrs) {
//    var reader = new FileReader();
//    reader.onload = function (e) {
//      $scope.image = e.target.result;
//      $scope.$apply();
//    }

//    elem.on('change', function() {
//      reader.readAsDataURL(elem[0].files[0]);
//    });
//  }
//  };
// }]);

