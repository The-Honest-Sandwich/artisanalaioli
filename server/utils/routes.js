import { passport, login, register, logout, checkAuth } from './authentication';
import { postBill, getOwnBills, getAllUsers, getFriends, addFriend, removeFriend, addPaymentMethod, getPaymentMethods } from '../db/controllers';
import { OCR } from '../../index';

export default function routes(app, express) {
  app.post('/auth/register', register, passport.authenticate('local'), login);
  app.post('/auth/login', passport.authenticate('local'), login);
  app.post('/auth/logout', logout);
  app.get('/auth/isLoggedIn', checkAuth);

  app.post('/bills/:username', postBill);
  app.get('/bills', getOwnBills); 
  app.post('/upload', (req, res, next) => {
    console.log(req.body);
  })

  app.get('/users', getAllUsers); // to use when adding friends
  app.get('/me/friends', getFriends);
  app.post('/me/friends', addFriend);
  app.post('/me/friends/remove', removeFriend);

  app.get('/me/payments', getPaymentMethods);
  app.post('/me/payments', addPaymentMethod);
  
  app.post('/ocr', OCR);
  
  /*
  Possible endpoints:
  /me --> get own bills (and debts and debtors) 
  */

}
