app.directive('fnDraggable', ['$document', function ($document) {
	'use strict';

	var interactStart, interactEnd, interactMove;

	// Detect if touch device
	if ('ontouchstart' in document.documentElement) {
		interactStart = 'touchstart';
		interactEnd = 'touchend';
		interactMove = 'touchmove';
	} else {
		interactStart = 'mousedown';
		interactEnd = 'mouseup';
		interactMove = 'mousemove';
	}

	return {
		restrict: 'A',
		link: function ($scope, $element) {
			
			var mousedown, prevPosition, initPosition;
			var body = $('body');
			var initUserSelect = body.css('user-select');

			$element.on(interactStart, function(e){
				mousedown = true;
				body.cssPrefix('user-select', 'none');
				initPosition = {x: e.originalEvent.pageX, y: e.originalEvent.pageY};
				// Can't set prevPosition = initPosition because we need it to be a separate object for modifying
				prevPosition = {x: e.originalEvent.pageX, y: e.originalEvent.pageY};

				if ($scope.dragStart) $scope.dragStart({
					event: e,
					element: $element
				});
			});

			$document.on(interactEnd, function(e){
				if(!mousedown) return;
				mousedown = false;
				body.cssPrefix('user-select', initUserSelect);
				if ($scope.dragEnd) $scope.dragEnd({
					event: e,
					element: $element
				});

				// Use setTimeout to ensure that the class removal doesn't take place until any click handlers
				// are fired. This allows for the discarding of undesired clicks resulting from dragging.
				setTimeout(function(){
					$element.removeClass('dragging');
				});
			})
			.on(interactMove, function(e){
				if(!mousedown) return;
				var newPosition = {x: e.originalEvent.pageX, y:e.originalEvent.pageY};

				// Events that are intended to be clicks may actually be very slight drags.
				// Only add the "dragging" class when clearly a drag.
				if (getDistance(initPosition, {x: newPosition.x, y: newPosition.y}) > 3) $element.addClass('dragging');

				if ($scope.dragMoved) $scope.dragMoved({
					event: e,
					element: $element,
					delta: {x: newPosition.x - prevPosition.x, y: newPosition.y - prevPosition.y}
				});
				prevPosition = newPosition;
			});
		}
	};
}]);