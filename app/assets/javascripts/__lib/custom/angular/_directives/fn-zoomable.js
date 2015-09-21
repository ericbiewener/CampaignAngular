app.directive('fnZoomable', ['$timeout', function($timeout) {
	'use strict';

	return {
		restrict: 'A',
		link: function($scope, dragEl, attrs){

			var container = dragEl.parent(),
					scaleEl = dragEl.children().css('transform-origin', 'left top'),
					scaleElSize = {width: scaleEl.width(), height: scaleEl.height()},
					heightContainer = attrs.fullWindow !== 'false' ? $(window) : container.parent(),
					currentTranslate = {x: 0, y: 0},
					translateLimit = {},
					scaleFactor = 0,
					containerBBox, containerSize, scale, prevScale, center;

			function adjustForWindowSize() {
				containerBBox = container[0].getBoundingClientRect();
				var offset = attrs.fullWindow !== 'false' ? containerBBox.top : 0;
				containerSize = {width: containerBBox.width, height: heightContainer.height() - offset};

				var scaleElRatio = scaleElSize.width / scaleElSize.height;
				if (scaleElRatio >= containerSize.width / containerSize.height) {
					scaleElSize = {width: containerSize.height * scaleElRatio, height: containerSize.height};
				} else {
					scaleElSize = {width: containerSize.width, height: containerSize.width / scaleElRatio};
				}

				scaleEl.css(scaleElSize);
				container.height(containerSize.height);

				center = {x: containerSize.width/2, y: containerSize.height/2};

				setScaleAndTranslateLimit();
				changeTranslation({x:0, y:0});
			}

			$timeout(function(){
				adjustForWindowSize();
				setScaleAndTranslateLimit();
				
				// Set opacity to 0 in css for container element to prevent initial load jerkiness resulting
				// from immediate resize
				container.css('opacity', 1);
			}, 500); //Timeout needed for iOS. Otherwise, resize doesn't work properly and map doesn't display. 250 seems to work as well, but giving more time padding just to be safe

			$(window).resize(adjustForWindowSize);

			function setScaleAndTranslateLimit() {
				scale = Math.pow(2, scaleFactor);
				translateLimit.x = containerSize.width - scaleElSize.width * scale;
				translateLimit.y = containerSize.height - scaleElSize.height * scale;
			}

			function changeTranslation(delta) {
				currentTranslate.x = limitNumber(currentTranslate.x + delta.x, translateLimit.x, 0);
				currentTranslate.y = limitNumber(currentTranslate.y + delta.y, translateLimit.y, 0);

				// Use TweenMax so that it has the correct initial translation settings when animating
				// the translation in $scope.zoom(). If we instead just use dragEl.css('transform', ...),
				// the translation animation when zooming jumps at first because TweenMax still has the old
				// value stored. Akin to forcefeeding in Velocity.js
				TweenMax.to(dragEl, 0, {x: currentTranslate.x, y: currentTranslate.y});
			}

			$scope.zoom = function(zoomAmount, coord) {

				if (coord) {
					coord.x -= containerBBox.left;
					coord.y -= containerBBox.top;
				} else {
					coord = center;
				}

				var prevScaleFactor = scaleFactor;
				scaleFactor = limitNumber(scaleFactor + zoomAmount, 0, 5);
				if (scaleFactor === prevScaleFactor) return;

				prevScale = scale;
				setScaleAndTranslateLimit();
				var scaleRatio = scale/prevScale;

				var coordInScaledEl = {
					x: coord.x - currentTranslate.x,
					y: coord.y - currentTranslate.y
				};

				currentTranslate.x = limitNumber(coord.x - coordInScaledEl.x * scaleRatio, translateLimit.x, 0);
				currentTranslate.y = limitNumber(coord.y - coordInScaledEl.y * scaleRatio, translateLimit.y, 0);

				var duration = limitNumber(500 * Math.abs(scaleFactor - prevScaleFactor), 0, 250) / 1000;

				TweenMax.to(scaleEl, duration, {scale: scale});
				TweenMax.to(dragEl, duration, {x: currentTranslate.x, y: currentTranslate.y});
			};

			// Zooming

			container.mousewheel(function (e) {
				$scope.zoom(e.originalEvent.wheelDelta/500, {
					x: e.clientX,
					y: e.clientY
				});
				e.preventDefault();
			});

			$scope.pinching = function(o) {
				$scope.zoom(o.delta/100, o.initCenter);
				o.event.preventDefault();
			};

			// Panning
			$scope.dragMoved = function(o) {
				changeTranslation(o.delta);
				o.event.preventDefault();
			};
		}
	};
}]);