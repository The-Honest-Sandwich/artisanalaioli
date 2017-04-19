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
			console.log(res.data)
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



















// var parseImageData = function( data ) {
// 	var strings = data[0]
// 	var itemList = [];
// 	var nameOfDish = [];
// 	data = data.filter( (value) => {
// 		return typeof value === 'string';
// 	})
// 	for(var i = 1; i < strings.length; i++) {
// 		// console.log(strings[i])
// 		if( _.contains(strings[i].split(''), '.') ){
// 			var index = i - 1;
// 			while( !_.contains(strings[index].split(''), '.') ) {
// 				nameOfDish.push(strings[index])
// 				// console.log(strings[index])
// 				index--;
// 			}
// 			// console.log(nameOfDish.reverse().join(''))
// 			// console.log(strings[i])
// 			itemList.push({
// 				name: strings[i -1],
// 				price: Number(strings[i])
// 			})
// 		}
// 	}
// 	itemList = itemList.filter( (value) => {
// 		return (!Number(value.name))
// 	})
// 	return itemList
// } 

// var determineAreaOfInterest = function(array) {
// 	var areaOfInterest;
// 	var indexOfFirstPrice = -1;
// 	var indexOfLastPrice = 100000;
// 	array.forEach( (el, i) => {
// 		if( _.contains(el.description.split(''), '.') /* && next two digits are numbers */) {
// 			if(i > indexOfFirstPrice) {
// 				indexOfFirstPrice = i;
// 			}
// 			if(i < indexOfLastPrice) {
// 				indexOfLastPrice = i
// 			}
// 		}
// 		// console.log(indexOfLastPrice, indexOfFirstPrice)
// 	});
// 	// vv The order of prices to names is upredictable so it is possible a name could
// 	// come before a price.  The -5 is insurance for this
// 	areaOfInterest = array.slice(indexOfLastPrice - 5, indexOfFirstPrice)
// 	return areaOfInterest
// };

// var checkYCoordinates = function(obj, yValue) {
// 	//checks if element is within 5 pixels of an exisiting row 

// 	//loops through key key in object
// 	_.each(obj, (val, key) => {
// 		console.log(key, yValue)
// 		//checks if val is within 5 pixels of a key
// 		if( yValue > Number(key) - 5 && yValue < Number(key) + 5) {

// 			return {
// 				bool: true,
// 				key: key
// 			}
// 		}
// 	})
// 	//returns true or false
// 	return { bool: false }
// }

// var assignRows = function(array) {
// 	var rows = {};
// 	var yVal;
// 	var rowKey;
// 	array.forEach( (el, i) => {

// 		yVal = el.boundingPoly.vertices[0].y;
// 		rowKey = checkYCoordinates(rows, yVal)
// 		if( rowKey.bool ) {

// 			//element is within 5 pixels of an exisiting row, add it to the row 
// 			rows[JSON.stringify(rowKey.key)].push(el)
// 		} else {
// 			// else create new row and add element to it 
// 			console.log('hi')
// 			rows[JSON.stringify(yVal)] = [el]
// 		}
// 	});
// 	return rows
// }


// var parseResults = function(data) {
// 	// return JSON.stringi fy(data[1], null, 4)
// 	var workingSet = data[1].responses[0].textAnnotations;
// 	workingSet.shift()
// 	var areaOfInterest = determineAreaOfInterest(workingSet);
// 	return assignRows(areaOfInterest)
// 	// return workingSet


// }




































