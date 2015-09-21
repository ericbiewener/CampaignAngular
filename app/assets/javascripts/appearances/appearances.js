angular.module('Appearances', [])
.controller('AppearancesController', ['$scope', 'AppearanceAPI', '$routeParams', '$timeout', 'Flash', 'SVGColorChanger', 'SVGStateAnimator', function($scope, AppearanceAPI, $routeParams, $timeout, Flash, SVGColorChanger, SVGStateAnimator){
	'use strict';

	var gender, weightPercentage, baldPercentage;

	// Morphs
	$scope.hair = {
		callback: function(pos) {
			baldPercentage = pos;
			changeHair(pos, 'Hair_Male_Bald');
		}
	};

	$scope.body = {
		callback: function(pos) {
			weightPercentage = pos;
			changeBody(pos);
		}
	};

	$scope.switch = {
		callback: function(){
			fullToggle(1);
		}
	};

	// Set initial state
	AppearanceAPI.show().success(function(resp){
		if(resp.colors) {

			$scope.switch.el.addClass('no-transition');

			$scope.switch.off = resp.female;
			baldPercentage = !$scope.switch.off ? resp.hair : 0;
			weightPercentage = resp.body;

			fullToggle(0);
			$scope.hair.setPos(baldPercentage, 0, true);
			$scope.body.setPos(weightPercentage, 0, true);
			
			$timeout(function(){
				$scope.switch.el.removeClass('no-transition');
			});

			angular.forEach(resp.colors, function(color, id){
				if (color !== '')	SVGColorChanger.changeColor($('#' + id), color, true);
			});

		} else {
			// Default Values
			gender = 'Male';
			weightPercentage = 0;
			baldPercentage = 0;
		}

		$scope.$root.$broadcast('main-complete');
	});


	var svgAnimator = new SVGStateAnimator({
		svg: 'politician-svg',
		stateTypes: {
			body: ['Male_Thin', 'Male_Heavy', 'Female_Thin', 'Female_Heavy'],
			hair: ['Hair_Male_Normal', 'Hair_Male_Bald', 'Hair_Female_Normal_1_']
		}
	});

	var stockingsColorPicker = $('#stockings-color');
	var tieColorPicker = $('#tie-color');

	function changeBody(percentage, options){
		svgAnimator.changeState('body', gender + '_Thin', gender + '_Heavy', percentage, options);
	}
	
	function changeHair(percentage, morphState, options){
		svgAnimator.changeState('hair', 'Hair_Male_Normal', morphState, percentage, options);
	}

	// Used on initial page load to create from saved settings, as well as gender switch
	function fullToggle(duration) {
		gender = $scope.switch.off ? 'Female' : 'Male';
		changeBody(weightPercentage, {durationPercentage: duration});
		
		if ($scope.switch.off) {
			changeHair(1, 'Hair_Female_Normal_1_', {durationPercentage: duration});
		} else {
			changeHair(baldPercentage, 'Hair_Male_Bald', {durationPercentage: duration});
		}

		stockingsColorPicker.parent().toggle($scope.switch.off);
		tieColorPicker.next().text($scope.switch.off ? 'Necklace' : 'Tie');
	}

	// Colors

	SVGColorChanger.add([{
		trigger: $('#shirt-color'),
		svgElements: $('#Shirt_1_, #Cuff_Left, #Cuff_Right'),
		dependents: {'#Collar_10_ path': 'lighten 10', '#Pocket_Square_1_': 'lighten 10'}
	},{
		trigger: $('#suit-color'),
		svgElements: $('#Jacket_Left, #Jacket_Right, #Jacket_Arm_Left, #Jacket_Arm_Right'),
		dependents: {'#Pants': 'darken 3', '#Jacket_Fold path': 'lighten 5'}
	},{
		trigger: tieColorPicker,
		svgElements: $('#Tie'),
		dependents: {'#Knot_1_': 'darken 5'}
	},{
		trigger: $('#shoes-color'),
		svgElements: $('#Shoes path'),
	},{
		trigger: stockingsColorPicker,
		svgElements: $('#Stockings path')
	},{
		trigger: $('#skin-color'),
		svgElements: $('#Head path, #Hand_Left, #Hand_Right'),
		dependents: {'#Neck_3_': function(color){
			return tinycolor(color).spin(-7.7).saturate(-21).darken(8.4).toString();
		}}
	},{
		trigger: $('#hair-color'),
		svgElements: $('#Hair_Male_Normal, #Hair_Male_Bald_Final'),
		dependents: {'#Hair_Back_1_': 'darken 10'}
	}])
	.addGradient([{
		selector: '#SVGID_2_, #Hand_Right_2_, #Hand_Left_1_',
		method: function (color1){
			return [tinycolor(color1).spin(-6).saturate(-7.5).darken(8).toString(), color1];
		}
	}]);

	var colors = $('#colors');
	colors.find('label').click(function(){
		$(this).siblings().click();
	});

	// Saving
	$scope.save = function() {
		var data = {
			female: $scope.switch.off,
			hair: baldPercentage,
			body: weightPercentage,
			colors: {}
		};

		colors.find('.control-wrapper button').each(function(){
			data.colors[this.id] = this.value;
		});

		return AppearanceAPI.save(data).success(function(resp){
			Flash.success('Saved!');
		});
	};

}]);