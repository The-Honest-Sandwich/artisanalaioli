'use strict';

angular.module('myApp.split', [])

.controller('SplitCtrl', function($scope, Bill, $rootScope, Party) {
  $scope.friendSelected = [];
  $scope.subtotal = Bill.getSubtotal();
  $scope.friends = Party.getAll();
  $scope.bill = Bill.getBill();
  $scope.assigneditems = [];
  $scope.items = $scope.bill.items;
  $scope.final = {
    tax: $scope.bill.tax,
    tip: $scope.bill.tip,
    total: parseFloat(($scope.bill.subtotal + $scope.bill.tax + $scope.bill.tip).toFixed(2))
  }


  /************** TEST DATA ****************/

  // $scope.items = [
  //     [1, 'pizza', 10, []],
  //     [2, 'beer', 16, []],
  //     [3, 'rice', 13, []],
  //     [4, 'potato', 12, []]
  //   ]

  //   $scope.friends = [
  //     {name: 'Pat', email: null, items: [], cost: {}, total: 0, displayTotal: '0.00'},
  //     {name: 'Frank', email: null, items: [], cost: {}, total: 0, displayTotal: '0.00'},
  //     {name: 'Greg', email: null, items: [], cost: {}, total: 0, displayTotal: '0.00'},
  //     {name: 'James', email: null, items: [], cost: {}, total: 0, displayTotal: '0.00'}
  //   ]

  //   $scope.bill = {
  //     items: $scope.items,
  //     name: 'Pizzeria',
  //     subtotal: 51,
  //     tax: 5,
  //     taxRate: 0.098,
  //     tip: 7.65,
  //     tipRate: 0.15
  //   }
  // $scope.final = {
  //   tax: $scope.bill.tax,
  //   tip: $scope.bill.tip,
  //   total: $scope.bill.subtotal + parseFloat($scope.bill.tax) + parseFloat($scope.bill.tip)
  // }
  /************************************/

  // console.log('friends: ', $scope.friends)
  // console.log('bill: ', $scope.bill)
  // console.log('items: ', $scope.items)
  /******************************************/
  /* THIS IS STRUCTURE OF bill, item, friend
  /* bill: {name: string, items:[], subtotal: number, taxRate: number, tipRate: number}
  /* item: [id, itemname, price, [people.names]];
  /* friend: {name: string, items: [], cost: {}, total: number, displayTota: string}
  /*****************************************/ 

  $scope.getAllFriendName = function() {
    var array = [];
    $scope.friends.forEach(function(friend) {
      array.push(friend.name);
      console.log('Adding friend name:', friend.name);
    });
    return array;
  }

  $scope.itemSelected = [];
  $scope.friendNames = $scope.getAllFriendName();
  /**
  * This function calculate the grand total price for a single friend. Grand total
  * includes total price, tax and tip.
  * @param {object} input a friend object
  */
  $scope.grandTotal = function(friend) {
    $scope.final.tip = Number.parseFloat(($scope.bill.subtotal * $scope.bill.tipRate).toFixed(2));
    $scope.final.tax = Number.parseFloat(($scope.bill.subtotal * $scope.bill.taxRate).toFixed(2));
    $scope.final.total = Number.parseFloat(($scope.bill.subtotal + $scope.final.tip + $scope.final.tax).toFixed(2));
    Party.getAll();        
  }

  /**
  * This function assign an item to a friend, add this item to $scope.assignedItems,
  * and update the grand total for this friend
  * @params {array} item, {object} friend
  */
  $scope.assign = function(item, friend) {
    item[3] = friend.name; 
    friend.items.push(item); // add item for friend               
    $scope.assigneditems.push(item); // add item into assigneditems list
    $scope.grandTotal(friend); 
  }

  /**
  * This function unassign an item from a friend, remove this item from $scope.assignedItems,
  * and update the total grand for this friend.
  * @params {array} item to be unassigned, {object} friend
  */
  $scope.unassign = function(item, friend) {
    var indexforFriend = friend.items.indexOf(item);
    friend.items.splice(indexforFriend, 1);
    var indexForAllAssigned = $scope.assigneditems.indexOf(item);
    $scope.assigneditems.splice(indexForAllAssigned, 1); // remove item from assigneditems list
    item[3] = "";
    $scope.grandTotal(friend);
  }

  /**
   * This function check if this item is already been assigned. 
   * If this item is not assigned, it will call 'assign function'.
   * If this item is assigned to the same person, it will unassign from this person.
   * If this item is assigned to a different person, it will unassign the item from
   * the origin person, and assign the item to the new person.
   * @param {array} input an item object, {object} input a friend object.
   */
  $scope.openModal = function(item, index) {
    $scope.friendSelected =[];
    for (var i = 0; i < $scope.friends.length; i++) {
      if ($scope.friends[i].items.includes(item)) {
        $scope.friendSelected[i] = 'selected';
      }
    }
    $scope.addedItem = item;
    $scope.itemIndex = index;
  }
  
  $scope.highlightItem = function(item, index) {
    if (item[3].length > 0) {
      $scope.itemSelected[index]='selected'
      if ($scope.assigneditems.indexOf(item) < 0) {
        $scope.assigneditems.push(item);
      }
    } else {
      $scope.itemSelected[index]='';
      $scope.assigneditems.splice($scope.assigneditems.indexOf(item), 1);
    }
  }

  $scope.selectFriend = function(index, item, friend, itemIndex) {
    if (friend.items.includes(item)) {
      var removedIndex = friend.items.indexOf(item);
      friend.items.splice(removedIndex, 1);
      item[3].splice(item[3].indexOf(friend.name), 1);
      $scope.friendSelected[index] = '';
    } else {
      item[3].push(friend.name)
      friend.items.push(item);
      $scope.friendSelected[index] = 'selected';
    }

    $scope.assignCost(friend, item);
    $scope.highlightItem(item, itemIndex);
    $scope.individualTotal();
  }

  $scope.assignCost = function(friend, item) {
    var itemCost = parseFloat((item[2] / item[3].length).toFixed(2));
    itemCost = itemCost * (1 + $scope.bill.taxRate + $scope.bill.tipRate);
    itemCost = itemCost.toFixed(2);

    for (var i = 0; i < $scope.friends.length; i++) {
      delete $scope.friends[i].cost[item[1]];
    }

    for  (var i = 0; i < item[3].length; i++) {
      for (var j = 0; j < $scope.friends.length; j++) {
        if (item[3][i] === $scope.friends[j].name) {
          $scope.friends[j].cost[item[1]] = itemCost;
        }
      }
    }

  }

  /**
  * This function is sending a post request to server
  * 
  */
  $scope.submitFinalBill = function() {
    // console.log('she gave me a straight up grape soda')
    var finalBill = {
      restaurant: $scope.bill.name,
      total: $scope.bill.subtotal * (1 + $scope.bill.tipRate + $scope.bill.taxRate),
      people: $scope.friendNames,
      info: $scope.friends,
      date: new Date(),
      owner: $rootScope.username
    }
    console.log('Setting date on bill:', finalBill.date);
    Bill.clearAllBill();
    Party.removeAll();
    Bill.submitSplit(finalBill);
  }

  $scope.individualTotal = function() {
    for (var i = 0; i < $scope.friends.length; i++) {
      $scope.friends[i].total = 0;
      $scope.friends[i].displayTotal = $scope.friends[i].total.toFixed(2)
    }

    for (var i = 0; i < $scope.friends.length; i++) {
      for (var key in $scope.friends[i].cost) {
        $scope.friends[i].total += parseFloat($scope.friends[i].cost[key]);
        $scope.friends[i].displayTotal = $scope.friends[i].total.toFixed(2)
      }
    }
  }


  // $scope.init = function() {
  //   $scope.subtotal = Bill.getSubtotal();
  //   $scope.bill = Bill.getBill();
  // }

  // $scope.init();
});