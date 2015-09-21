angular.module('Sessions', [])
.controller('SessionsController', ['$scope', '$http', '$location', '$rootScope', 'Flash', 'Storage', function($scope, $http, $location, $rootScope, Flash, Storage){
	'use strict';
	
	$scope.redirectIfLoggedIn();
	
	$scope.login = function(){
		$http.post('/auth', {
			username_or_email: $scope.username_or_email,
			password: $scope.password,
			remember: $scope.remember
		})
		.success(function(resp){
			Storage.sessionKeys().forEach(function(key){
				Storage(key, resp.user[key]);
			});
			Storage('token', resp.auth_token);

			$location.path($rootScope.destination || '/users/' + resp.user.id);
			Flash.success('You are now logged in.');
		})
		.error(function(resp){
			Flash.error(resp.error);

			// Dismiss keyboard on iOS to ensure error can be seen
			document.activeElement.blur();
		});
	};
	
}]);