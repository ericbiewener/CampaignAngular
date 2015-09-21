app.directive('uiAjaxThrobber', ['$timeout', function ($timeout) {
	'use strict';

	return {
		restrict: 'E',
		replace: true,
		template: '<div class="shroud" ng-class="{visible: initVisible}">'
								+ '<div class="throbber">'
									+ '<div class="a"></div>'
									+ '<div class="b"></div>'
									+ '<div class="c"></div>'
								+ '</div>'
							+ '</div>',
		scope: true,
		link: function ($scope, $element, attrs) {

			var throbber = $element.children();
			$scope.initVisible = attrs.visible;
			
			$scope.$on(attrs.name + '-start', function(){
				$element.show();
			});

			$scope.$on(attrs.name + '-complete', function() {
				// $timeout allows the DOM changes to occur before the fadeout
				$timeout(function(){
					throbber.hide();
					$element.fadeOut(500, function(){
						throbber.show();
					});
				});
			});
		}
	};
}]);