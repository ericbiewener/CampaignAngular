jQuery.fn.cssPrefix = function(property, value){
	'use strict';

	var o = {};
	o[property] = value;
	o['-webkit-' + property] = value;
	o['-moz-' + property] = value;
	o['-ms-' + property] = value;
	o['-o-' + property] = value;

	return this.css(o);
};