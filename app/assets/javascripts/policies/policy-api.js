app.factory('PolicyAPI', ['DefaultAPI', '$http', 'Pager', function(DefaultAPI, $http, Pager){
	'use strict';

	var factory = DefaultAPI('policy', 'policies', ['index', 'show', 'edit', 'update', 'create', 'delete', 'vote']);
	
	factory.popular = function(showMostPopular, area) {
		var params = {type: showMostPopular};
		if (area) params.area = area;
		return $http.get('/policies/popular', {params: params});
	};

	return factory;
	
}]);