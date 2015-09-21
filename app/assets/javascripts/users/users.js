angular.module('Users', [])
.controller('UsersController', ['$scope', 'action', '$location', '$routeParams', 'UserAPI', 'Storage', 'Flash', function($scope, action, $location, $routeParams, UserAPI, Storage, Flash){
	'use strict';

	var pager = 10; //Expected number of results per page. if backend changes, this must change

	var actions = {

		show: function() {
			UserAPI.show($routeParams.id).success(function(resp){
				angular.extend($scope, resp);

				$scope.morePolicies = $scope.policies.length === pager;
				$scope.moreLiked = $scope.liked.length === pager;
				$scope.moreDisliked = $scope.disliked.length === pager;

				$scope.$root.$broadcast('main-complete');
			});

			$scope.showMoreVoted = function(showLiked) {
				var that = $scope.showMoreVoted;
				var type = showLiked ? 'liked' : 'disliked';

				// Disable until AJAX call returns
				if (that[type]) return;
				that[type] = true;

				var typeCapitalized = capitalize(type);

				UserAPI['policies' + typeCapitalized]($scope.user.id).success(function(resp){
					$scope[type] = $scope[type].concat(resp[type]);
					$scope['more' + typeCapitalized] = resp[type].length === pager;
					that[type] = false;
				});
			};

			$scope.showMorePolicies = function() {
				var that = $scope.showMorePolicies;

				if (!that.page) that.page = 1;
				if (that.disabled) return;

				that.disabled = true;

				UserAPI.policiesCreated($scope.user.id).success(function(resp){
					$scope.policies = $scope.policies.concat(resp.policies);
					$scope.morePolicies = resp.policies.length === pager;
					that.disabled = false;
				});
			};
		},

		edit: function() {
			UserAPI.edit($routeParams.id).success(function(resp){
				angular.extend($scope, resp);
				$scope.$root.$broadcast('main-complete');
			});

			$scope.save = function() {
				return UserAPI.update($scope.user, $scope.files).success(function(resp){
					Storage('username', $scope.user.username);
					Storage('avatar', resp.avatar);
					$location.path('/users/' + $scope.user.id);
					Flash.success('Profile successfully updated.');
				})
				.error(function(resp){
					$scope.errors = resp;
				});
			};

			$scope.destroy = function() {
				$scope.delete = function() {
					Flash.error('No! Not allowed!');

					// Dismiss keyboard on iOS to ensure error can be seen
					document.activeElement.blur();
				};
			};
		},

		new: function() {
			$scope.redirectIfLoggedIn();
			$scope.isNew = true;

			$scope.save = function() {
				return UserAPI.create($scope.user).success(function(resp){
					Storage('id', resp.user.id);
					Storage('username', resp.user.username);
					Storage('token', resp.auth_token);
					Flash.success('Account successfully created!');
					$location.path('/users/' + resp.user.id);
				})
				.error(function(resp){
					$scope.errors = resp;
				});
			};
		}
		
	};

	actions[action]();

}]);