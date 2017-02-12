import mailer from 'express-mailer';
import path from 'path';
import ejs from 'ejs';

export default function mailSender(app, express, rootDir) {

  mailer.extend(app, {
    from: 'no-reply@divvy-app.com',
    host: 'smtp.gmail.com', // hostname
    secureConnection: true, // use SSL
    port: 465, // port for secure SMTP
    transportMethod: 'SMTP', // default is SMTP. Accepts anything that nodemailer accepts
    auth: {
      user: 'divvyappmailer@gmail.com',
      pass: 'divvyappmailer1'
    }
  });

  app.set('views', path.join(rootDir, 'views'));
  app.set('view engine', 'ejs');

  // MAILER ROUTING

  // this sends mails
  app.post('/mail', function(req, res, next) {
    // for each person in the bill's info array...
    console.log('INFO RECEIVED BY THE MAILER:', req.body);
    req.body.info.forEach(function(person) {
      if (person.name !== req.body.owner && person.email) {
        // send an email to them telling them they owe money
        app.mailer.send('email', {
          to: person.email, // REQUIRED. This can be a comma delimited string just like a normal email to field. 
          subject: 'A Payment Owed Reminder from Divvy!', // REQUIRED.
          otherProperty: 'Other Property', // All additional properties are also passed to the template as local variables.
          name: person.name,
          owner: req.body.owner,
          restaurant: req.body.restaurant || 'an eating establishment',
          split: person.total
        }, function (err) {
          if (err) {
            // handle error
            console.log(err);
            res.send('There was an error sending the email');
            return;
          }
        });
      }
      
    })
  });

  // this notifies a user they were paid
  app.post('/paid', function(req, res, next) {
    // send an email to them telling them they owe money
    app.mailer.send('paid', {
      to: req.body.to.email, // REQUIRED. This can be a comma delimited string just like a normal email to field. 
      subject: 'From Divvy: You were just paid!', // REQUIRED.
      otherProperty: 'Other Property', // All additional properties are also passed to the template as local variables.
      name: req.body.to.username,
      payer: req.body.from,
      amount: req.body.amount
    }, function (err) {
      if (err) {
        // handle error
        console.log(err);
        res.send('There was an error sending the email');
        return;
      }
    });
  });

  // this simply renders the e-mail template (views/email.ejs) for easy rendering during editing
  app.get('/mailrender', function (req, res, next) {
    res.end(ejs.renderFile('../artisanalaioli/server/views/email.ejs',
    {
      subject: 'A Payment Owed Reminder from Divvy!', // REQUIRED.
      name: 'John',
      owner: 'exampleuser55',
      restaurant: 'Tu Lan',
      split: '12.75'
    },
    function(err, data) {
      if (err) {
        console.log(err);
      }
      return data;
    }));
  });

}
