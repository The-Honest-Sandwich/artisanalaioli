import express from 'express';
import routes from './utils/routes';
import middleware from './utils/middleware';
import mailSender from './utils/mailer';

var _ = require('underscore');
var app = express();

var bodyParser = require('body-parser');
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

var rootDir = __dirname;

middleware(app, express);
routes(app, express);
mailSender(app, express, rootDir);

var port = process.env.PORT || 3000;

app.listen(port, function() {
  console.log('listening on port', port);
});

export { app };

// Imports the Google Cloud client library
const vision = require('@google-cloud/vision')({
  	projectId: 'AIzaSyDp_Bl-MD9PhAu3-SqWaLo5vf9cQLQa3NM',
  	keyFilename: './server/Divvy-8f936cd51c11.json'
});

export function OCR(req, res) {
	var link = req.body;
	for(var key in link) {
		link = key
	}
	vision.detectText(link)
		.then((results => {
			res.data = parseRows(assignRows(results));
			console.log(res.data)
			res.send(res.data)

		})).catch( (err) => {
			console.log(err)
		});
};

var checkRows = function(rows, yValue) {
	var bool = false
	rows.forEach( (row, i) => {
		if(yValue > row.bounds.lowerBound && yValue < row.bounds.upperBound) {
			bool = true;
		}
	})
	return bool;
}

var assignRows = function(data) {
	var listWithVertices = data[1].responses[0].textAnnotations
	listWithVertices.shift()
	var rows = [];
	var row = {};
	var rowExists;
	
	listWithVertices.forEach( (el, i) => {
		rowExists = checkRows(rows, el.boundingPoly.vertices[0].y);
		if(!rowExists) {
			rows.push({
				bounds: {
					lowerBound: el.boundingPoly.vertices[0].y - 5,
					upperBound: el.boundingPoly.vertices[0].y + 5
				}, 
				strings: [el.description]
			})
		} else {
			rows[rows.length-1].strings.push(el.description)
		}
	});
	return rows
}

var isFoodItem = function(str) {
	var bool = false
	if( _.contains(str.split(''), '.')) {
		bool = true;
	}
	return bool
}

var formatItem = function(strings) {
	var foodItem = {}
	strings.forEach( (str, i) => {
		if(isFoodItem(str)) {
			foodItem.price = strings.splice(i, 1)[0]
		}
	})
	foodItem.name = strings.join(' ')
	return foodItem
}

var parseRows = function(rows) {
	var filteredRows = [];
	rows.forEach( (row) => {
		row.strings.forEach( (string) => {
				if(isFoodItem(string)) {
					filteredRows.push( formatItem( row.strings ) ) 
			}
		});
	});
	return filteredRows		
}