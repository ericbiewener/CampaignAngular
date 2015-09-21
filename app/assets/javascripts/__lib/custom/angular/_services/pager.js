app.factory('Pager', [function(){
	'use strict';

	return function(pageTrackingObj, page) {
		// Automatically send back next page if 'page' is not specified
		if (!page) {
			if (!pageTrackingObj.page) pageTrackingObj.page = 0;
			pageTrackingObj.page++;
		} else {
			pageTrackingObj.page = page;
		}
	}

}]);