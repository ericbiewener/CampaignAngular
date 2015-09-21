app.factory('Storage', ['$cookies', '$rootScope', function($cookies, $rootScope){
	'use strict';

	var sessionKeys = ['token'],
			useLocalStorage;
	
	$rootScope.storage = {};

	// Detertime if localStorage is available
	try {
		localStorage.setItem('t', 1);
		localStorage.removeItem('t');
		useLocalStorage = true;
	} catch(e) {
		useLocalStorage = false;
	}

	// Rebuild the data on $rootScope from localStorage or cookie
	$rootScope.$on('$locationChangeSuccess', function () {
		buildRootScope();
	});

	function buildRootScope() {
		angular.forEach(getStorage(), function(val, key){
			$rootScope.storage[key] = val;
		});
	}

	// Private methods to get or retrieve the main storage object
	function getStorage() {
		if (useLocalStorage) return localStorage.hasOwnProperty('storage') ? JSON.parse(localStorage.getItem('storage')) : {};
		return $cookies.getObject('storage') || {};
	}
	function setStorage(storageObj) {
		if (useLocalStorage) {
			localStorage.setItem('storage', JSON.stringify(storageObj));
		} else {
			$cookies.putObject('storage', storageObj);
		}
	}

	// Public Getter/Setter. Usage: Storage(key, val)
	var factory = function(key, val) {

		// Getter
		if (val === undefined) return ($rootScope.storage || {})[key]; // return from $rootScope since it's already deserialized
		
		// Setter
		$rootScope.storage = $rootScope.storage || {};
		$rootScope.storage[key] = val;
		var storage = getStorage();
		storage[key] = val;
		setStorage(storage);

		return factory;
	};

	// Public Storage.empty(key1, key2...)
	// If no keys are provided, the entire storage property is removed from localStorage
	factory.empty = function() {
		if (arguments.length > 0) {
			var storage = getStorage();

			// Allow either a single array argument or a number of string arguments to be passed to the empty() function
			var collection = Array.isArray(arguments[0]) ? arguments[0] : arguments;

			for (var i = 0; i < collection.length; i++) {
				delete $rootScope.storage[collection[i]];
				delete storage[collection[i]];
			}
			setStorage(storage);
		}
		else {
			delete $rootScope.storage;
			if (useLocalStorage) {
				localStorage.removeItem('storage');
			} else {
				$cookies.remove('storage');
			}
		}

		return factory;
	};

	factory.sessionKeys = function(arr) {
		if (arr === undefined) return sessionKeys.slice(0);
		sessionKeys = arrayUnique(sessionKeys.concat(arr));
	};

	factory.emptySession = function() {
		factory.empty(sessionKeys);
	};

	return factory;
}]);