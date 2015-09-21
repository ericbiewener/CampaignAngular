var app = angular.module('app',[
	'templates',
	'ngRoute',
	'ngCookies',
	'ngSanitize',
	'ngFileUpload',
	'infinite-scroll',
	'Home',
	'Users',
	'Policies',
	'Sessions',
	'ForeignRelations',
	'Appearances',
	'PasswordReset'
]);

app.config(['$routeProvider', function($routeProvider){
	'use strict';

	$routeProvider
		.when('/', {
			templateUrl: 'home/index.html',
			controller: 'HomeController'
		})

		// Login / Logout
		.when('/login', {
			templateUrl: 'sessions/login.html',
			controller: 'SessionsController'
		})
		.when('/logout', {
			templateUrl: 'sessions/login.html',
			controller: 'SessionsController'
		})

		// Users
		.when('/users/:id', {
			templateUrl: 'users/show.html',
			controller: 'UsersController',
			resolve: {action: function(){return 'show';}}
		})
		.when('/users/:id/edit', {
			templateUrl: 'users/form.html',
			controller: 'UsersController',
			resolve: {action: function(){return 'edit';}}
		})
		.when('/register', {
			templateUrl: 'users/form.html',
			controller: 'UsersController',
			resolve: {action: function(){return 'new';}}
		})

		// Policies
		.when('/policies', {
			templateUrl: 'policies/index.html',
			controller: 'PoliciesController',
			resolve: {action: function(){return 'index';}},
			reloadOnSearch: false
		})
		.when('/policies/new', {
			templateUrl: 'policies/form.html',
			controller: 'PoliciesController',
			resolve: {action: function(){return 'new';}}
		})
		.when('/policies/:id/edit', {
			templateUrl: 'policies/form.html',
			controller: 'PoliciesController',
			resolve: {action: function(){return 'edit';}}
		})
		.when('/policies/:id', {
			templateUrl: 'policies/show.html',
			controller: 'PoliciesController',
			resolve: {action: function(){return 'show';}}
		})
		

		// Foreign Relations
		.when('/foreign-relations', {
			templateUrl: 'foreign-relations/index.html',
			controller: 'ForeignRelationsController'
		})
		.when('/foreign-relations/:id', {
			templateUrl: 'foreign-relations/show.html',
			controller: 'ForeignRelationsController'
		})

		// Appearance
		.when('/appearance', {
			templateUrl: 'appearances/show.html',
			controller: 'AppearancesController'
		})

		// Password Reset
		.when('/password-reset', {
			templateUrl: 'password-reset/new.html',
			controller: 'PasswordResetController'
		})
		.when('/password-reset/:token', {
			templateUrl: 'password-reset/edit.html',
			controller: 'PasswordResetController'
		})
		
		// Redirect
		.otherwise({ redirectTo: '/' });
}]);

app.run(['$rootScope', '$location', '$timeout', 'Storage', 'Flash', function($rootScope, $location, $timeout, Storage, Flash){
	'use strict';

	// Configure the keys that should be stored & removed upon logging in and out
	Storage.sessionKeys(['token', 'id', 'username', 'avatar']);

	$rootScope.logout = function () {
		Storage.emptySession();
		$location.path('/');
		Flash.success('You logged out.');
	};

	$rootScope.redirectIfLoggedIn = function () {
		if ($rootScope.storage.id) $location.path('/users/' + $rootScope.storage.id);
	};

	$rootScope.$on('$routeChangeSuccess', function(e, current, prev) {
		 // Set route-based classes on body, e.g. policies/index.html  >  .policies.index
		if (current.loadedTemplateUrl) $rootScope.bodyClass = current.loadedTemplateUrl.split('.')[0].replace(/\//g, ' ');
		Flash.clear();
		$rootScope.isProfile = window.location.hash.replace('/edit', '') === '#/users/' + $rootScope.storage.id;
	});

}]);