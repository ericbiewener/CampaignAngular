app.directive('uiSwitch', function() {
	'use strict';

	return {
		restrict: 'E',
		replace: true,
		template: '<div class="switch-container" ng-class="{off: outlet.off}">'
								+ '<div class="switch-inner">'
									+ '<div class="option option-on">{{labels[0]}}</div><div class="switch"></div><div class="option option-off">{{labels[1]}}</div>'
								+ '</div>'
								+ '<div class="shadow"></div>'
							+ '</div>',
		scope: true,
		link: function($scope, $element, attrs){
			$scope.labels = attrs.labels.split('|');

			var outlet = $scope.outlet = $scope[attrs.info],
					inner = $element.children();

			// Give parent scope access to the element, for things like preventing transitions on initialization
			outlet.el = $element;

			// @TODO: Probably makes more sense to go with $scope.switch.on, and have that default to true
			if (outlet.off === undefined) outlet.off = false;
			
			inner.on('transitionend webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd', function(){
				$element.removeClass('transitioning');
			});

			$element.click(function(){
				$element.addClass('transitioning');

				$scope.$apply(function(){
					outlet.off = !outlet.off;
					if (outlet.callback) outlet.callback();
				});
			});
		}
	};
});