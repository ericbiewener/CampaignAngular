// Adapted from https://goo.gl/j81iFZ in order to allow conditional autofocusing as a value to the autofocus attribute
// e.g. ui-autofocus="{{isNew}}"

app.directive('uiAutofocus', ['$timeout', function ($timeout) {
	'use strict';

	return {
		restrict: 'A',
		link: function ($scope, $element, attrs) {
			if (attrs.uiAutofocus === 'false') return;
			
			$timeout(function () {
				$element[0].focus();
			});
		}
	};
}]);