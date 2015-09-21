app.factory('ForeignRelationAPI', ['DefaultAPI', '$http', 'Upload', function(DefaultAPI, $http, Upload){
	'use strict';

	return DefaultAPI('foreign_relation', 'foreign_relations', ['show', 'index', 'vote']);
	
}]);