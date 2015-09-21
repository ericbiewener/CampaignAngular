angular.module('Policies', [])
.controller('PoliciesController', ['$scope', 'action', '$location', '$routeParams', 'Flash', 'PolicyAPI', 'CommentAPI', '$q', function($scope, action, $location, $routeParams, Flash, PolicyAPI, CommentAPI, $q){
	'use strict';

	$scope.viewAllComments = function(policy) {
		CommentAPI.all(policy).success(function(resp){
			policy.comments = resp;
		});
	};

	$scope.vote = function(policy, votedUp) {
		var data = {
			id: policy.id,
			vote: votedUp,
			// user_vote will be null if no vote has been cast
			toggle: votedUp ? !policy.user_vote : policy.user_vote !== false
		};

		if (data.toggle) {
			if (votedUp) {
				policy.cached_votes_score += policy.user_vote === false ? 2 : 1;
				policy.user_vote = true;
			} else {
				policy.cached_votes_score += policy.user_vote ? -2 : -1;
				policy.user_vote = false;
			}
		} else {
			policy.cached_votes_score += votedUp ? -1 : 1;
			policy.user_vote = null;
		}

		PolicyAPI.vote(data);
	};

	$scope.commentSave = function(policy) {
		return CommentAPI.save(policy).success(function(resp){
			policy.comments.push(resp[0]);
			policy.newComment = '';
			policy.comment_count++;
		});
	};


	var actions = {

		index: function() {
			$scope.policyAreas = ['All Policies', 'Economy', 'Health', 'Education', 'National Security', 'Environment', 'Space!'];
			$scope.currentPolicyArea = $routeParams.area || $scope.policyAreas[0];
			$scope.showingMostPopular = true;

			$scope.$watch('currentPolicyArea', function(policyArea) {
				$scope.$root.$broadcast('main-start');

				var params = policyArea === $scope.policyAreas[0] ? {} : {area: policyArea};
				$location.path('/policies').search(params);

				PolicyAPI.index(params).success(function(resp){
					angular.extend($scope, resp);
					$scope.showingMostPopular = true;
					$scope.$root.$broadcast('main-complete');
				});
			});

			$scope.changePolicyArea = function(area) {
				$scope.currentPolicyArea = area;
			};

			$scope.showMostPopular = function(showMostPopular){
				if ($scope.showingMostPopular === showMostPopular) return;
				$scope.showingMostPopular = showMostPopular;

				$scope.$root.$broadcast('ranking-start');

				PolicyAPI.popular(showMostPopular, $routeParams.area).success(function(resp){
					angular.extend($scope, resp);
					$scope.$root.$broadcast('ranking-complete');
				});
			};

			$scope.loadNextPage = function() {
				var that = $scope.loadNextPage;

				if (that.disabled) return;
				if (!that.page) that.page = 1;

				// Temporarily disable the loading of new results until the current request returns. Otherwise, if user
				// is at bottom of page and tries scrolling down again, it will generate a new request.
				that.disabled = true;

				var params = {page: ++that.page};
				if ($scope.currentPolicyArea !== $scope.policyAreas[0]) params.area = $scope.currentPolicyArea;

				PolicyAPI.index(params).success(function(resp){
					$scope.policies = $scope.policies.concat(resp.policies);
					that.disabled = false;
				});
			};
		},

		show: function() {
			$scope.isSinglePolicy = true;

			PolicyAPI.show($routeParams.id).success(function(resp){
				angular.extend($scope, resp);
				$scope.$root.$broadcast('main-complete');
			});

			$scope.changePolicyArea = function(area) {
				$location.path('/policies').search({area: area});
			};
		},

		edit: function() {
			PolicyAPI.edit($routeParams.id).success(function(resp){
				console.log(resp)
				angular.extend($scope, resp);
				$scope.$root.$broadcast('main-complete');
			});

			$scope.save = function(){
				return PolicyAPI.update($scope.policy).success(function(resp){
					Flash.success('Policy updated!');
					$location.path('/policies/' + $routeParams.id);
				})
				.error(function(resp){
					$scope.errors = resp;
				});
			};

			$scope.delete = function(){
				if (confirm('Like a diamond, deletion is forever.')) {
					return PolicyAPI.delete($scope.policy).success(function(){
						Flash.success('Policy deleted!');
						$location.path('/policies');
					});
				} else {
					// Return empty promise for uiAjaxDisable
					return $q.when();
				}
			};
		},

		new: function() {
			$scope.isNew = true;

			$scope.save = function() {
				return PolicyAPI.create($scope.policy).success(function(resp){
					Flash.success('Policy successfully created!');
					$location.path('/policies/' + resp.id);
				})
				.error(function(resp){
					$scope.errors = resp;
				});
			};
		}

	};

	actions[action]();
	
}]);