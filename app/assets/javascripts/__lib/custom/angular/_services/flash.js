app.factory('Flash', ['$rootScope', '$timeout', function($rootScope, $timeout){
	'use strict';

	$rootScope.flash = {};

	function create(message, type, temporary){
		// Wrap it all in $timeout so that calls to clear messages $onRouteChangeSuccess don't clear ones
		// that were just set
		$timeout(function(){
			if (type === undefined) type = 'notice';
			if (temporary === undefined) temporary = 5000;
			
			$rootScope.flash[type] = message;

			if (temporary) {
				$timeout(function(){
					$rootScope.flash[type] = '';
				}, temporary);
			}
		});
	}

	return {
		error: function(message, temporary) {
			create(message, 'error', temporary);
		},
		notice: function(message, temporary) {
			create(message, 'notice', temporary);
		},
		success: function(message, temporary) {
			create(message, 'success', temporary);
		},
		clear: function(type) {
			if (!type) {
				$rootScope.flash = {};
			} else {
				delete $rootScope.flash[type];
			}
		}
	};
}]);