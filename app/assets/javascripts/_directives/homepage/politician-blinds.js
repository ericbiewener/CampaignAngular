app.directive('politicianBlinds', function () {
	'use strict';

	return {
		restrict: 'A',
		scope: true,
		link: function ($scope, $element, attrs) {
			var femaleContainer = $('#female-container'),
					blinds = $('#blinds'),
					female = $('#female'),
					offset, width;

			$element.mousemove(function(e){
				var percent = (e.pageX - offset) / width;
				var percentForContainer = (percent - 1) * 100;
				
				femaleContainer.css('left', percentForContainer + '%');
				female.css('left', -percentForContainer + '%');
				blinds.css('left', percent * 100 + '%');
			});

			$('#appearance').mouseleave(function(){
				TweenMax.to(femaleContainer, .5, {left: '-50%'});
				TweenMax.to([female, blinds], .5, {left: '50%'});
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