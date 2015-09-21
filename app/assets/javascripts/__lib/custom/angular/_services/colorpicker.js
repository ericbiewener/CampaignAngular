// Uses tinyColorPicker library:  https://github.com/PitPik/tinyColorPicker

// tinyColorPicker only has a single instance on a page at a time. It is unable to have different
// callbacks for the renderCallback method. This factory solves the issue by storing custom callbacks
// on the trigger elements themselves using jQuery's data() method.

app.factory('ColorPicker', function(){
	'use strict';

	var factory = {
		config: {
			animationSpeed: 0,
			opacity: false,
			renderCallback: function(el, toggled){
				// el.text is the color. It can be '' when you drag off the edge of the picker
				if (toggled === undefined && el.text !== '') el.data('callback')(el, el.text);
			}
		},
		bind: function(el, callback) {
			// Binding the colorpicker will erase the initial background color of 'el'. We want to set it back.
			// Can't use jQuery to grab initial color value because it will always return the default rgba(0, 0, 0, 0) etc. if no value is actually set
			var color = el[0].style.backgroundColor;

			el.colorPicker(factory.config);
			el.data('callback', callback)
				.css('background-color', color)
				// value attribute is used by tinyColorPicker to determine what color the picker should show
				.val(color); 							
		}
	};

	return factory;
});

// To hide the colorpicker as soon as a selection is made, add the following property to config:

// buildCallback: function(el){
// 	// Hide colorpicker as soon as selection is made
// 	var cp = this;
// 	el.find('.cp-xy-slider').click(function(){
// 		cp.toggle();
// 	});
// },