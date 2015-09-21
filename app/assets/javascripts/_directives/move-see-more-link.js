app.directive('moveSeeMoreLink', ['$timeout', function ($timeout) {
	'use strict';

	return {
		restrict: 'A',
		link: function ($scope, $element, attrs) {
			$timeout(function(){
				var seeMoreLink = $element.find('.see-full-text');
				var newContainer = seeMoreLink.prev();
				var newContainerLastChild = newContainer.children(':last-child');
				var finalContainer = newContainerLastChild.length ? newContainerLastChild : newContainer;
				seeMoreLink.appendTo(finalContainer);
			});
		}
	};
}]);