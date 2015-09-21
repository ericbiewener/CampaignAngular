app.directive('donkeyMorph', function () {
	'use strict';

	return {
		restrict: 'A',
		scope: false,
		link: function ($scope, $element, attrs) {
			var offset, width, percent = 0;

			$element.mousemove(function(e){
				percent = (e.pageX - offset) / width;
				$scope.svgAnimator.changeState('party', 'Elephant' , 'Donkey_1_', percent, {duration: 0});
			});
			
			$('#policies').mouseleave(function(){
				$scope.svgAnimator.changeState('party', 'Elephant' , 'Donkey_1_', Math.round(percent));
			});

			function updateValues() {
				offset = $element.offset().left;
				width = $element.outerWidth();
			}

			$(window).resize(updateValues);

			setTimeout(updateValues);
		}
	};
});