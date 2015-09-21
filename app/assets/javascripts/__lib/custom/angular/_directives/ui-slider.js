app.directive('uiSlider', ['$timeout', function($timeout) {
	'use strict';

	return {
		restrict: 'E',
		replace: true,
		template: '<div class="slider">'
								+ '<label class="left" ng-if="labels">{{labels[0]}}</label>'
								+ '<div class="track">'
									+ '<div class="fill"></div>'
									+ '<div class="handle" fn-draggable></div>'
								+ '</div>'
								+ '<label class="right">{{labels[1]}}</label>'
							+ '</div>',
		scope: true,
		link: function($scope, $element, attrs){

			if (attrs.labels) $scope.labels = attrs.labels.split('|');

			var outlet = $scope[attrs.info],
					track = $element.find('.track'),
					handle = track.find('.handle'),
					fill = track.find('.fill'),
					hasReachedLimit, cursorLimit, pos, prevPos, offset, trackRect, handleRect, isDragging;

			function setPos(pos, prevPos, preventCallback){
				// preventCallback is most likely used when initializing state from stored settings.
				// in such a case, the controller may not want the changing of the slider to actually
				// modify state, because the controller is modifying state directly
				var percent = pos * 100 + '%';
				handle.css('left', percent);
				fill.width(percent);
				if (outlet.callback && !preventCallback) outlet.callback(pos, prevPos);
				return pos;
			}

			outlet.setPos = setPos; // allows the controller to set the position programatically

			$scope.dragStart = function(o) {
				isDragging = true;

				trackRect = track[0].getBoundingClientRect();
				handleRect = handle[0].getBoundingClientRect();

				// iOS doesn't provide an event.offsetX property, so we have to calculate it
				offset = o.event.offsetX !== undefined ? o.event.offsetX : o.event.originalEvent.pageX - handleRect.left;
				cursorLimit = {min: trackRect.left - handleRect.width/2 + offset};
				cursorLimit.max = cursorLimit.min + trackRect.width;
				prevPos = parseFloat(handle.css('left')) / trackRect.width;
				
			};

			$scope.dragMoved = function(o) {
				var x = o.event.originalEvent.pageX;

				if (x < cursorLimit.min || x > cursorLimit.max) {
					if (hasReachedLimit) return;
					hasReachedLimit = true;
					pos = x < cursorLimit.min ? 0 : 1;
				}
				else {
					hasReachedLimit = false;
					pos = (x - cursorLimit.min)/trackRect.width;
				}

				prevPos = setPos(pos, prevPos);
			};

			$scope.dragEnd = function(){
				setTimeout(function(){
					isDragging = false;
				});
			};

			track.click(function(e){
				if (!isDragging) {
					trackRect = track[0].getBoundingClientRect();
					prevPos = setPos(e.offsetX/trackRect.width, prevPos);
				}
			});

			$timeout(function(){
				// $timeout needed to bind click to both labels; otherwise, only one gets bound for some reason
				$element.find('label').click(function(){
					prevPos = setPos($(this).hasClass('left')	 ? 0 : 1);
				});
			});
		}
	};
}]);