import Promise from 'bluebird';
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/divvyPresent');
mongoose.Promise = Promise;

var UserSchema = new mongoose.Schema({
  username: String,
  password: String,
  email: String,
  bills: [mongoose.Schema.Types.ObjectId],
  friends: [mongoose.Schema.Types.ObjectId],
  debts: [mongoose.Schema.Types.ObjectId],
  debtors: [mongoose.Schema.Types.ObjectId],
  paymentMethods: {
    type: Array,
    default: []
  },
  venmo: String
});

//allow a (restaurant) name, a date
var BillSchema = new mongoose.Schema({
  restaurant: String,
  userID: mongoose.Schema.Types.ObjectId,
  total: Number,
  people: [],
  info: [],
  outstanding: [{
    userID: mongoose.Schema.Types.ObjectId, 
    amount: Number
  }],
  image: String,
  date: Date,
  owner: String
});

module.exports = {
  User: mongoose.model('User', UserSchema),
  Bill: mongoose.model('Bill', BillSchema)
};


