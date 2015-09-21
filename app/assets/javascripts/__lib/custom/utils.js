function capitalize(str){
	'use strict';
	return str.slice(0,1).toUpperCase() + str.slice(1);
}

function limitNumber(number, min, max) {
	'use strict';
	
	if(number < min) return min;
	if(number > max) return max;
	return number;
}

function getDistance(point1, point2) {
	'use strict';
	return Math.sqrt(Math.pow(point1.x - point2.x, 2) + Math.pow(point1.y - point2.y, 2));
}

function getMidpoint(point1, point2) {
	'use strict';
	return {x: (point1.x + point2.x) / 2, y: (point1.y + point2.y) / 2};
}

function randomIntFromInterval (min,max) {
	'use strict';
	return Math.floor(Math.random()*(max-min+1)+min);
}

function matrixToArray(str) {
	'use strict';

	return str.split('(')[1].split(')')[0].split(',').map(function(v){
		return parseFloat(v);
	});
}

function arrayShuffle (array) {
	'use strict';

	// Fisher-Yates (aka Knuth) Shuffle
	var currentIndex = array.length, temporaryValue, randomIndex ;
	while (0 !== currentIndex) {
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}
	return array;
}

function arrayUnique(array) { // from http://stackoverflow.com/questions/1890203/unique-for-arrays-in-javascript
	'use strict';

	var hash = {}, result = [];
	for ( var i = 0, l = array.length; i < l; ++i ) {
		if ( !hash.hasOwnProperty(array[i]) ) { //it works with objects & arrays! in FF & Chrome, at least
			hash[ array[i] ] = true;
			result.push(array[i]);
		}
	}
	return result;
}