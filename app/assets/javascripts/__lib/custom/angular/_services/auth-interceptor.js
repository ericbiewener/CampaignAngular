// Adds JWT token to outgoing requests

app.factory('AuthInterceptor', ['$q', 'Storage', function($q, Storage) {
	'use strict';

	return {
		// This will be called on every outgoing http request
		request: function(config) {
			var token = Storage('token');
			config.headers = config.headers || {};
			if (token) config.headers.Authorization = 'Bearer ' + token;
			return config || $q.when(config);
		}
	};
}]);

app.config(['$httpProvider', function($httpProvider) {
	'use strict';
	return $httpProvider.interceptors.push('AuthInterceptor');
}]);