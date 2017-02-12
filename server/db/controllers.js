import { User } from './models.js';
import { Bill } from './models.js';
//.findOne, .create, .find({})


// ALL UNTESTED


function getAllUsers(req, res, next) {
  User.find({})
  .then(function(users) {
    res.send(users);
  });
}

function getFriends(req, res, next) {
  User.findOne({id: req.session.passport.user})
  .then(function(user) {
    User.find({})
    .where(id).in(user.friends)
    .then(function(friends) {
      res.send(friends);
    });
  });
}
//edit
function addFriend(req, res, next) {
  User.findOne({id: req.session.passport.user})
  .then(function(user) {
    User.findOne({username: req.body.FRIENDUSERNAME})
    .then(function(friend) {
      user.friends.push(friend.id);
      user.save(function(error, savedUser) {
        if (error) {
          console.log(error); 
        } else {
          res.end('Friend added');
        }
      });
    });
  });
}
//edit
function removeFriend(req, res, next) {
  User.findOne({id: req.session.passport.user})
  .then(function(user) {
    for (var i = 0; i < user.friends.length; i++) {
      if (user.friends[i].username === req.body.FRIENDUSERNAME) {
        user.friends.splice(i,1);
      }
    }
    user.save(function(error, savedUser) {
      if (error) {
        console.log(error); 
      } else {
        res.end('Friend removed');
      }
    });
  });
}

function addPaymentMethod(req, res) {
  User.findOne({username: req.session.username})
  .then(function(user) {
    user.paymentMethods.push(req.body);
    user.save(function(err, savedUser) {
      if (err) {
        console.log(error);
      } else {
        res.send('Payment method added');
      }
    })
  });
}

function getPaymentMethods(req, res) {
  User.findOne({'username': req.session.username})
  .then(function(user) {
    res.json({'methods': user.paymentMethods});
  })
  .catch(function(err) {
    if (err) {
      console.log(err);
    }
  });
}

/*
Consider refactoring to also send all bills related to you (the ones
you don't own but were part of)

When refactoring to also retrieve outstanding debts & debtors,
send an object instead of an array:
  var allBills = {
    'bills': bills,
    debts: [],
    debtors: []
  };
*/
function getOwnBills(req, res, next) {
  console.log(req.session);
  if (req.session.passport !== undefined) {
    User.findOne({_id: req.session.passport.user})
    .then(function(user) {
      console.log(user);
      Bill.find({})
      .where('_id').in(user.bills)
      .then(function(bills) {
        res.send(bills);
      });
    });
  } else {
    res.end('Not logged in');
  }

}

function postBill(req, res, next) {
  console.log(req.body);
  var newBill = {
    userID: req.session.passport.user,
    restaurant: req.body.restaurant,
    total: req.body.total,
    people: req.body.people,
    info: req.body.info,
    date: req.body.date
  };
  Bill.create(newBill)
  .then(function(createdBill) {
    User.findOne({username: req.params.username})
    .then(function(user) {
      user.bills.push(createdBill._id);
      user.save(function(error, savedUser) {
        if (error) {
          console.log(error); 
        } else {
          res.status(201).end('Bill saved');
          // res.redirect('/#!/bills')
        }
      });
    })
    .catch(function(err) {
      console.log('Party member', req.params.username, 'is not a registered user to save to - ignoring.');
    });
  });
}

export { postBill, getOwnBills, getAllUsers, getFriends, addFriend, removeFriend, addPaymentMethod, getPaymentMethods };


