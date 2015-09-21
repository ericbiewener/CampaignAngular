// Adds a "clicked" class when the $element is clicked. This allows the hover state to be disabled on click.

app.directive('uiAddClickedClass', function () {
	'use strict';

	return {
		restrict: 'A',
		link: function ($scope, $element, attrs) {
			$element.click(function(){
				$element.addClass('clicked');
			})
			.mouseout(function(){
				$element.removeClass('clicked');
			});
		}
	};
});