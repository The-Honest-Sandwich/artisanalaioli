import express from 'express';
import routes from '.server/utils/routes';
import middleware from '.server/utils/middleware';
import mailSender from '.server/utils/mailer';

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

app.listen(3000, function() {
  console.log('listening on port 3000');
});

export { app };

// Imports the Google Cloud client library
const vision = require('@google-cloud/vision')({
  	projectId: 'AIzaSyDp_Bl-MD9PhAu3-SqWaLo5vf9cQLQa3NM',
  	keyFilename: './Divvy-8f936cd51c11.json'
})
//http://www.trbimg.com/img-561c0d46/turbine/la-sp-sarkisian-alcohol-receipts-20151012
export function OCR(req, res) {
	var link = req.body;
	for(var key in link) {
		link = key
	}
	vision.detectText(link)
		.then((results => {
			// console.log( JSON.stringify(results[results.length-1].responses[0], null, 4) )
			res.data = parseRows(assignRows(results));
			res.send(res.data)
		})).catch( (err) => {
			console.log(err)
		});
};

var checkRows = function(rows, yValue) {
	var bool = false
	rows.forEach( (row, i) => {
	//if yVal fits within the bounds of any exisiting row return row index
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
		//check rows 
		rowExists = checkRows(rows, el.boundingPoly.vertices[0].y);
		if(!rowExists) {
			//create new row
			rows.push({
				bounds: {
					lowerBound: el.boundingPoly.vertices[0].y - 5,
					upperBound: el.boundingPoly.vertices[0].y + 5
				}, 
				strings: [el.description]
			})
		} else {
			//push to existing row
			rows[rows.length-1].strings.push(el.description)
		}
	});
	return rows
}

var isFoodItem = function(str) {
	var bool = false
	if( _.contains(str.split(''), '.') /* && next two characters are numbers */) {
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
