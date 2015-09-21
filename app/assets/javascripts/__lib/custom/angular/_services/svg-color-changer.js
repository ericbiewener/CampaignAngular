app.factory('SVGColorChanger', ['ColorPicker', function(ColorPicker){
	'use strict';

	// Private

	function _add(o) {
		var dependentChanges;

		if (o.dependents) {
			dependentChanges = [];
			angular.forEach(o.dependents, function(method, selector){
				method = typeof method === 'string'? method.split(' ') : [method];
				
				dependentChanges.push({
					el: $(selector),
					method: method[0],
					arg: method[1]
				});
			});
		}

		var svgElements = {
			fills: [],
			gradients: []
		};

		o.svgElements.each(function(){
			// Check if fill is a gradient
			var fill = this.getAttribute('fill');
			if (fill && fill.indexOf('url') > -1) { // fill could be null, hence the 'fill &&'
				svgElements.gradients.push($(fill.slice(4, fill.length-1)));
			} else {
				svgElements.fills.push($(this));
			}
		});

		o.trigger.data('svgColorChangerData', {
			svgElements: svgElements,
			dependents: dependentChanges
		});

		ColorPicker.bind(o.trigger, factory.changeColor);
	}

	function _addGradient(o){
		$(o.selector).data('gradientGeneratorMethod', o.method);
	}


	// Public

	var factory = {

		add: function(o){
			if (Array.isArray(o)) {
				o.forEach(function(v){
					_add(v);
				});
			} else {
				_add(o);
			}
			return factory;
		},

		addGradient: function(o){
			if (Array.isArray(o)) {
				o.forEach(function(v){
					_addGradient(v);
				});
			} else {
				_addGradient(o);
			}
		},

		changeColor: function(el, color, changeTrigger) {
			var data = el.data('svgColorChangerData');

			data.svgElements.fills.forEach(function(v){
				v.css('fill', color);
			});

			data.svgElements.gradients.forEach(function(v){
				var stops = v.children();
				v.data('gradientGeneratorMethod')(color).forEach(function(color, i){
					stops.eq(i).css('stop-color', color);
				});
			});

			if (data.dependents) {
				data.dependents.forEach(function(v){
					if (v.arg) {
						v.el.css('fill', tinycolor(color)[v.method](v.arg));
					} else {
						v.el.css('fill', v.method(color));
					}
				});
			}

			if (changeTrigger) {
				// Used when setting color programatically rather than through the actual color picker.
				// This keeps the color of the button the same as the selected color.
				el.css('background-color', color).val(color);
			}
		}
	};

	return factory;
}]);