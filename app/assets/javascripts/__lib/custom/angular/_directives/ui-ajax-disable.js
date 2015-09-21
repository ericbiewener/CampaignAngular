app.directive('uiAjaxDisable', function () {
	'use strict';

	return {
		restrict: 'A',
		scope: {
			uiAjaxDisable: '&'
		},
		link: function ($scope, $element, attrs) {
			var el = $element.is('form') ? $element.find('button[type=submit]') : $element;

			el.click(function() {
				el.prop('disabled', true);
				$scope.uiAjaxDisable().finally(function() {
					el.prop('disabled', false);
				});
			});
		}
	};
});