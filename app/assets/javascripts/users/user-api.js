app.factory('UserAPI', ['DefaultAPI', '$http', 'Upload', 'Pager', function(DefaultAPI, $http, Upload, Pager){
	'use strict';

	var factory = DefaultAPI('user', 'users', ['show', 'edit', 'create']);

	factory.update = function(user, files) {
		var data = {
			url: 'users/' + user.id,
			method: 'PUT',
			fields: {user: user},
			sendFieldsAs: 'form'
		};
		if (files) data.file = files[0];
		return 	Upload.upload(data);
	};

	factory.policiesCreated = function(id, page) {
		return $http.get('/users/' + id + '/page/' + this.page);
	};

	factory.policiesLiked = function(id, page) {
		Pager(this, page);
		return $http.get('/users/' + id + '/liked/' + this.page);
	};

	factory.policiesDisliked = function(id, page) {
		Pager(this, page);
		return $http.get('/users/' + id + '/disliked/' + this.page);
	};

	return factory;
	
}]);