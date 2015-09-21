app.directive('mapColor', function () {
	'use strict';

	return {
		restrict: 'A',
		scope: false,
		link: function ($scope, $element, attrs) {
			var offset, width, percent, prevPercent;

			$element.mousemove(function(e){
				if (!$scope.changeCountryColor) return; // prevent error from this trying to run before we're ready

				percent = (e.pageX - offset) / width;
				if (prevPercent === undefined) {
					prevPercent = percent;
					return;
				}
				$scope.changeCountryColor(new TimelineMax(), limitNumber(Math.abs(percent - prevPercent) * 2, 0, 1));
				prevPercent = percent;
			});

			function updateValues() {
				offset = $element.offset().left;
				width = $element.outerWidth();
			}

			setTimeout(updateValues);
			$(window).resize(updateValues);
		}
	};
});