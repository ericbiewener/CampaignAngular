app.factory('HttpErrorInterceptor', ['$q', '$location', '$rootScope', 'Flash', 'Storage', function($q, $location, $rootScope, Flash, Storage) {
	'use strict';

	return {

		responseError: function(response) {
			if (response.status === 404) {
				Flash.notice('Whoops, couldn\'t find that!');
			}
			else if (response.status === 401 || response.status === 419) {
				Storage.emptySession();

				// Can't use $location.path() or window.location.hash for some reason. They're both empty.
				if (response.config.url !== '/auth') {
					Flash.notice('Please log in first.');
					$rootScope.destination = $location.path();
					$location.path('/login');
				}
			}
			else if (response.status === 403) {
				Flash.notice('Whoaaaa, you aren\'t allowed to go in there!');
				$location.path('/');
			}
			else if (response.status === 418) {
				Flash.notice('That password reset token is either invalid or has expired.', false);
				$location.path('/password-reset');
			}
			else if (response.status !== 422) {
				// For status 422, the $http call itself should handle the error, generally by showing errors on the form
				Flash.notice('Uh oh, something went wrong.');
			}

			// Must return this promise in order to not break the HttpErrorInterceptor chain
			return $q.reject(response);
		}
	
	};
}]);

app.config(['$httpProvider', function($httpProvider) {
	'use strict';
	return $httpProvider.interceptors.push('HttpErrorInterceptor');
}]);