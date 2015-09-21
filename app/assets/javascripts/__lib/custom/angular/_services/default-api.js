app.factory('DefaultAPI', ['$http', function($http){
	'use strict';

	return function(singular, plural, methods) {

		var urlStart = '/' + plural + '/';

		var defaultMethods = {
			index: function(params) {
				// params would most likely be used to filter a list. can be left undefined.
				return $http.get(urlStart, {params: params});
			},
			
			show: function(id) {
				return $http.get(urlStart + id);
			},

			edit: function(id) {
				return $http.get(urlStart + id + '/edit');
			},

			update: function(resource) {
				var params = {};
				params[singular] = resource;
				return 	$http.put(urlStart + resource.id, params);
			},

			create: function(resource) {
				var params = {};
				params[singular] = resource;
				return $http.post(urlStart, params);
			},

			delete: function(resource) {
				return $http.delete(urlStart + resource.id);
			},

			vote: function(data) {
				return $http.post(urlStart + 'vote', data);
			}
		};

		var newFactory = {};
		for (var i = 0; i < methods.length; i++) {
			newFactory[methods[i]] = defaultMethods[methods[i]];
		}

		return newFactory;
	};
	
}]);