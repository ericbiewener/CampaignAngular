app.filter('limitString', function(){
	'use strict';

	return function(str, limit, isDisabled, useWordBoundaries){
		if (isDisabled || str.length <= limit) return str;
		if (useWordBoundaries === undefined) useWordBoundaries = true;

		var substring = str.slice(0, limit);
		if (useWordBoundaries) substring = substring.slice(0, Math.min(substring.length, substring.lastIndexOf(' ')));

		return substring + '&hellip;';
	};

});