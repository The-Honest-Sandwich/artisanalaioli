angular.module('myApp.services',[])
  
  .factory('Bill', function($http) {
    var mybill = {}; 
    mybill.name;
    mybill.items = []; // an array of [itemName, price, people]
    mybill.subtotal;
    mybill.tipRate;
    mybill.taxRate;


    var getItems = function() {
      return mybill.items;
    }

    var pushItems = function(items) {
      mybill.items = items;
    }

    var getSubtotal = function() {
      return mybill.subtotal;
    }

    var updateSubtotal = function(newSub) {
      mybill.subtotal = newSub;
    }

   var addBill = function(bill) {
      mybill.name = bill.name;
      mybill.items = bill.items; // an array of [itemName, price, people]
      mybill.subtotal = bill.subtotal;
      mybill.tipRate = bill.tipRate;  
      mybill.taxRate = bill.taxRate;  
      mybill.tax = bill.tax;
      mybill.tip = bill.tip
    }

    var removeBill = function() {
      mybill = {}; 
    }

    var getBill = function() {
      return mybill;
    }

    var getName = function() {
      return mybill.name;
    }

    var getPriceBeforeTip = function() {
      return mybill.bill.subtotal;
    }

    var getTipRate = function() {
      return mybill.bill.tipRate;
    }

    var getTaxRate = function() {
      return mybill.bill.taxRate;
    }

    var clearAllBill = function() {
      mybill = {}; 
      mybill.name;
      mybill.items = []; // an array of [itemName, price, people]
      mybill.priceBeforeTip;
      mybill.tipRate;
      mybill.taxRate;
    }

    var submitSplit = function(data) {
      // console.log('she gave me a straight up grape soda')
      console.log('Final bill submitted data:', data);
      data.people.forEach(function(person) {
        $http({
          method: 'POST',
          url: '/bills/' + person,
          data: data
        });
      });
      $http({
        method: 'POST',
        url: '/mail',
        data: data
      });
    }

    var updateName = function(name) {
      mybill.name = name;
    }


    return {
      getItems: getItems,
      pushItems: pushItems,
      getSubtotal: getSubtotal,
      updateSubtotal: updateSubtotal,
      addBill: addBill,
      removeBill: removeBill,
      getBill: getBill,
      getName: getName,
      getPriceBeforeTip: getPriceBeforeTip,
      getTipRate: getTipRate,
      getTaxRate: getTaxRate,
      clearAllBill: clearAllBill,
      submitSplit: submitSplit,
      updateName: updateName
    }
  })

  .factory('Party', function() {
  	var party = [];

  	var addOne = function(userObj) {
  		var user = {
  			name: userObj.username,
  			email: userObj.email,
  			items: [],
        cost: {},
        total: 0,
        displayTotal: '0.00'
  		};
  		party.push(user);
  	}

  	var getAll = function() {
  		return party;
  	}

  	var remove = function(username) {
  		for (var i = 0; i < party.length; i++) {
  			if (party[i].name === username) {
  				party.splice(i, 1);
  			}
  		}
  	}

  	var removeAll = function() {
  		party = [];
  	}

  	return {
  		party: party,
  		addOne: addOne,
  		getAll: getAll,
  		remove: remove,
  		removeAll: removeAll
  	}

  })

  .factory('Auth', function($window, $rootScope, $http) {

  var signin = function (username, password) {
    $http({
      method: 'POST',
      url: '/auth/login',
      data: {
        username: username,
        password: password
      }
    })
    .then(function(response) {
      $rootScope.username = username;
      $rootScope.signedIn = true;
      $window.location.href = '/#!/addfriend';
      console.log('login', response);
    })
    .catch(function(error) {
      console.log('Error: ', error);
    });
  };

  var signup = function (username, email, password) {
    $http({
      method: 'POST',
      url: '/auth/register',
      data: {
        username: username,
        email: email,
        password: password
      }
    })
    .then(function(response) {
      $rootScope.signedIn = true;
      $window.location.href = '/#!/addfriend';
      console.log('signed up', response);
    })
    .catch(function(error) {
      console.log('Error: ', error);
    });
  };

  var signout = function() {
    console.log('Attempting to sign out.');
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

  return {
    signin: signin,
    signup: signup,
    signout: signout
  }

})

.factory('Users', function($http) {

  var getAll = function(cb) {
    $http.get('users').then(function(res) {
      cb(res);
    });
  };

  var paymentNotify = function(data) {
    $http({
      method: 'POST',
      url: '/paid',
      data: data
    });
  }

  return {
    getAll: getAll,
    paymentNotify: paymentNotify
  }

});