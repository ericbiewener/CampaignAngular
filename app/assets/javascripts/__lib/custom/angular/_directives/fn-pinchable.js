app.directive('fnPinchable', function () {
	'use strict';

	return {
		restrict: 'A',
		link: function ($scope, $element, attrs) {
			
			var prevDistance, initCenter, isPinching = false;

			$element.on('touchstart touchmove', function(e){
				var touches = e.originalEvent.touches;
				if (touches.length !== 2) return;

				changePinching(true);

				var point1 = {
					x: touches[0].pageX - window.pageXOffset,
					y: touches[0].pageY - window.pageYOffset
				};
				var point2 = {
					x: touches[1].pageX - window.pageXOffset,
					y: touches[1].pageY - window.pageYOffset
				};

				var distance = getDistance(point1, point2),
						center = getMidpoint(point1, point2);

				if (e.originalEvent.type === 'touchmove') {
					// Note that a copy of initCenter is passed to the callback,
					// not the original object in case the callback modifies it.
					$scope.pinching({
						event: e,
						element: $element,
						eventType: e.originalEvent.type,
						delta: prevDistance ? distance - prevDistance : distance,
						center: center,
						initCenter: {x: initCenter.x, y: initCenter.y}
					});
				} else {
					initCenter = center;
				}
				
				prevDistance = distance;

			})
			.on('touchend', function(){
				if (!isPinching) return;

				// Use setTimeout to ensure that the class removal doesn't take place until any click handlers
				// are fired. This allows for the discarding of undesired clicks resulting from pinching.
				setTimeout(function(){
					changePinching(false);
				}, 250);
			});

			function changePinching(val) {
				isPinching = val;
				$element.toggleClass('pinching', val);
			}
		}
	};
});