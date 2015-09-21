app.factory('AppearanceAPI', ['$http', function($http){
	'use strict';

	return {
		show: function() {
			return $http.get('/appearances')
		},

		save: function(data) {
			return $http.post('/appearances/save', {properties: JSON.stringify(data)});
		}
	};
	
}]);