app.directive('avatar', function () {
	'use strict';

	return {
		restrict: 'E',
		replace: true,
		template: '<a class="avatar" ng-href="/#/users/{{user.id}}" style="{{style}}"></a>',
		scope: {
			user: '=user'
		},
		link: function ($scope, $element, attrs) {
			$scope.$watch('user', function(){
				if ($scope.user && $scope.user.avatar) $scope.style = 'background-image: url(' + $scope.user.avatar + ')';
			});
		}
	};
});

app.directive('avatarNoLink', function () {
	'use strict';

	return {
		restrict: 'E',
		replace: true,
		template: '<div class="avatar" style="{{style}}"></div>',
		scope: {
			user: '=user'
		},
		link: function ($scope, $element, attrs) {
			$scope.$watch('user', function(){
				if ($scope.user && $scope.user.avatar) $scope.style = 'background-image: url(' + $scope.user.avatar + ')';
			});
		}
	};
});