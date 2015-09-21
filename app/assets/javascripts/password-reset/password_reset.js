angular.module('PasswordReset', [])
.controller('PasswordResetController', ['$scope', '$http', '$location', '$routeParams', 'Flash', function($scope, $http, $location, $routeParams, Flash){
	'use strict';
	
	if (!$routeParams.token) {
		$scope.create = function() {
			return	$http.post('/password_resets', {email: $scope.email}).success(function(resp){
								Flash.success('Check your email for a link to reset your password.', false);
								$location.path('/login');
							});
		};
	}
	
	else {
	// editing password
	
		$http.get('/password_resets/' + $routeParams.token + '/edit').success(function(resp){
			$scope.user = resp;
			$scope.$root.$broadcast('main-complete');
		});

		$scope.update = function() {
			return	$http.put('/password_resets/' + $routeParams.token, {password: $scope.password}).success(function(resp){
								Flash.success('Passord updated!');
								$location.path('/login');
							});
		};
	}

}]);