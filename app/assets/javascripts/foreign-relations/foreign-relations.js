angular.module('ForeignRelations', [])
.controller('ForeignRelationsController', ['$scope', '$location', '$routeParams', 'Storage', 'ForeignRelationAPI', function($scope, $location, $routeParams, Storage, ForeignRelationAPI){
	'use strict';

	var paths = $('path').not('#id-167'); // don't bind to US path

	// SHOW
	if ($routeParams.id) {

		// Load Map Data
		ForeignRelationAPI.show($routeParams.id).success(function(resp){
			['friends', 'foes'].forEach(function(type){
				resp[type].forEach(function(v){
					document.getElementById('id-' + v.id).setAttribute('class', type.slice(0, -1));
				});
			});

			$scope.$root.$broadcast('main-complete');
		});

		$scope.switch = {labels: ['Friend', 'Foe']};
		var wrapper = $('.svg-wrapper');

		// Country voting
		paths.on('click touchend', function(e){ 
			if (wrapper.hasClass('dragging') || wrapper.hasClass('pinching')) return;

			var data = {
				id: this.id.slice(3),
				vote: e.shiftKey ? $scope.switch.off : !$scope.switch.off
			};

			var originalClass = this.getAttribute('class') || '';

			if ((data.vote && originalClass === 'friend') || (!data.vote && originalClass === 'foe')) {
				data.toggle = false;
				this.removeAttribute('class');
			} else {
				data.toggle = true;
				this.setAttribute('class', data.vote ? 'friend' : 'foe');
			}

			ForeignRelationAPI.vote(data);
		});
	}

	// INDEX
	else {

		ForeignRelationAPI.index().success(function(resp){
			var min = 0, max = 0;
			resp.forEach(function(country){
				if (country[1] > max) {
					max = country[1];
				} else if (country[1] < min) {
					min = country[1];
				}
			});
			resp.forEach(function(country) {
				if (country[0] === 167) return;

				// Using Math.pow() to make colors more extreme
				var color = country[1] > 0
											? tinycolor.mix('green', '#ccc', 100 * Math.pow(1 - country[1]/max, 2))
											: tinycolor.mix('#c00', '#ccc', 100 * Math.pow(1 - country[1]/min, 2));

				var countryPath = $('#id-' + country[0]);
				countryPath.data('votes', country[1]);
				
				// Cache original color for mouseleave since the darken() call will change the original color var
				var colorString = color.toString();

				countryPath.css('fill', colorString).hover(function(){
					countryPath.css('fill', color.darken(5));
				}, function(){
					countryPath.css('fill', colorString);
				});

			});

			$scope.$root.$broadcast('main-complete');
		});
	}

	$scope.closeModal = function() {
		if (!$routeParams.id) {
			Storage('hideForeignRelationsIndex', true);
		} else {
			Storage('hideForeignRelationsShow', true);
		}
	};

	paths.hover(function(){
		var t = $(this);
		$scope.$apply(function(){
			$scope.hoveredCountry = t.attr('title');
			$scope.hoveredCountryVotes = t.data('votes');
		});
	}, function(){
		$scope.$apply(function(){
			$scope.hoveredCountry = undefined;
		});
	});
	
}]);