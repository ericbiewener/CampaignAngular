/* Requires https://github.com/jackmoore/autosize
*  
* Initializes a textarea to automatically resize
* Watches for changes on the corresponding model to trigger a resize when necessary
* (eg. after an HTTP request returns)
*/

app.directive('uiAutosizeTextarea', function() {
	'use strict';

	return {
		restrict: 'A',
		link: function ($scope, $element, attrs) {
			autosize($element[0]);

			// Trigger automatic resize whenever the model updates.
			// Most common use-case is for http requests returning
			if (attrs.ngModel) {
				$scope.$watch(attrs.ngModel, function(){
					autosize.update($element);
				});
			}
		}
	};
});