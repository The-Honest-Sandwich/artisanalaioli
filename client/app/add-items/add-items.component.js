
angular.module('myApp.addItems', [])

.controller('AddItemCtrl', ['$scope', 'Upload', '$timeout', 'Bill', '$http', function ($scope, Upload, $timeout, Bill, $http) {
  // $scope.image = "";
  $scope.readyToSplit = true; // need this to be true to proceed
  $scope.price; // price for single item

  $scope.additeminfo = function() {
    $scope.count += 1;
    $scope.price = Number.parseFloat($scope.price);
    $scope.items.push([$scope.count, $scope.item, $scope.price, []]);
    Bill.pushItems($scope.items);
    $scope.item = "";
    $scope.price = 0;
  }

  $scope.removeitem = function(singleitem) {
    var index = $scope.items.indexOf(singleitem);
    $scope.items.splice(index, 1);
    $scope.count -= 1;
    for (var i = 0; i < $scope.items.length; i++) {
      $scope.items[i][0] = i + 1;
    }
  }

  $scope.calculateSubtotal = function() {
    $scope.subtotal = 0;
    for (var i = 0; i < $scope.items.length; i++) {
      $scope.subtotal += $scope.items[i][2];
    }
    Bill.updateSubtotal(parseFloat($scope.subtotal.toFixed(2)));
  }

  $scope.uploadFiles = function(files, errFiles) {
    console.log(files)
    $scope.files = files;
    $scope.errFiles = errFiles;
    
    angular.forEach(files, function(file) {
      console.log(file)
      file.upload = Upload.upload({
        
        data: {file: file},
        headers: {'Authorization': 'Client-ID 010fe699c18e3c9'},
        url: 'https://api.imgur.com/3/image',
        data: {image: file}

      });

      file.upload.then(function (response) {
        $timeout(function () {
          console.log('response data: ', response.data.data.link);
          // $http.post('/ocr','hello')
          $http({
            method: 'POST',
            url: '/ocr',
            data: response.data.data.link,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
          }).then(function(res) {
            console.log('res data', res.data)
            $scope.findHighestScanned(res.data);
            $scope.uploadedScannedItems(res.data);
          })

          
          file.result = response.data;

        });
      }, function (response) {
        // console.log(response)
        if (response.status > 0)
          $scope.errorMsg = response.status + ': ' + response.data;
      }, function (evt) {
        file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
      });
    });
  }

  $scope.findHighestScanned = function(data) {
    var sortedPrices = [];

    for (var i = 0; i < data.length; i++) {
      if (data[i].price.charAt(0) === '$') {
        data[i].price = data[i].price.slice(1);
      }
      
      if (!isNaN(parseFloat(data[i].price))) {
        sortedPrices.push([i, data[i].price]);
      }
    }
    sortedPrices = sortedPrices.sort((a, b) => ( b[1] - a[1]));
    $scope.ignoreIndex = [sortedPrices[0][0], sortedPrices[1][0]]
    if (sortedPrices[0][1] === sortedPrices[1][1]) {
      $scope.ignoreIndex.push(sortedPrices[2][0]);
    }

    return $scope.ignoreIndex;
  }

  $scope.uploadedScannedItems = function(data) {
    $scope.uploadedItems = data;
    for (var i = 0; i < $scope.uploadedItems.length; i++) {
      if (!$scope.ignoreIndex.includes(i)) {
        if ($scope.uploadedItems[i].price.charAt(0) === '$') {
          $scope.uploadedItems[i].price = $scope.uploadedItems[i].price.slice(1);
        }
        if ($scope.uploadedItems[i].name.toLowerCase() === 'tax' || $scope.uploadedItems[i].name.toLowerCase() === 'sales tax') {
          $scope.tax = parseFloat($scope.uploadedItems[i].price);
          Bill.updateTax($scope.tax);
        } else if (!isNaN(parseFloat($scope.uploadedItems[i].price))) {
          $scope.item = $scope.uploadedItems[i].name;
          $scope.price = $scope.uploadedItems[i].price;
          $scope.additeminfo();
        }
      }
    }
  }

  $scope.restaurantName = function() {
    Bill.updateName($scope.name);
  }

  $scope.submitRestaurantInfo = function() {
    $scope.calculateSubtotal();
    $scope.restaurantName();
  }

  $scope.init = function() {
    $scope.items = Bill.getItems(); // items is an array of [id, item, price, people]
    $scope.count = $scope.items.length;
    $scope.name = Bill.getName();
  }

  $scope.init();


}])
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

