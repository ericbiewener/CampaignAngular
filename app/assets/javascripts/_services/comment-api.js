app.factory('CommentAPI', ['$http', function($http){
	'use strict';

	return {
		all: function(policy) {
			return $http.get('/comments/all/' + policy.id);
		},

		save: function(policy) {
			return $http.post('/comments/', {
				text: policy.newComment,
				policy_id: policy.id
			});
		}
	};
	
}]);