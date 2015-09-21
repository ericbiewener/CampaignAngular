app.factory('SVGStateAnimator', function(){
	'use strict';

	// Private Constants
	
	var SVG_ANIMATION_ATTR = {
		rect: ['x', 'y', 'width', 'height', 'rx', 'ry'],
		circle: ['cx', 'cy', 'r'],
		ellipse: ['cx', 'cy', 'rx', 'ry'],
		line: ['x1', 'x2', 'y1', 'y2'],
		polyline: ['points'],
		polygon: ['points'],
		path: ['d'],
		linearGradient: ['x1', 'y1', 'x2', 'y2']
	};

	var SVG_NODE_NAMES = Object.keys(SVG_ANIMATION_ATTR);

	// Private Helper Methods

	function getAnimationAttr(el){
		var attr;

		if (el.nodeName === 'path') {
			attr = Snap.path.map(el.getAttribute('d'), Snap.matrix());
		} else {
			attr = {};
			SVG_ANIMATION_ATTR[el.nodeName].forEach(function(v){
				attr[v] = el.getAttribute(v);
			});
		}
		return attr;
	}

	function changeClass(animator, baseState, morphState, isStarting) {
		var classStr = (isStarting ? 'morph-start' : 'morph-end') + ' morph-state-' + morphState;

		angular.forEach(animator.currentStates, function(state){
			classStr += ' current-state-' + state;	
		});
		angular.forEach(animator.stateProgress, function(percentage, state){
			classStr += ' ' + state + '-percentage-' + percentage;
		});
		animator.svg.attr('class', classStr);
	}

	function getMorph(layer, baseState, morphState, percentage) {
		// Build finalAttr object based on the percentage between the baseState and the morphState
		
		var finalAttr = {};

		var baseAttr = layer.morphs[baseState];
		var morphAttr = layer.morphs[morphState];

		if (layer.el[0].nodeName === 'path') {

			finalAttr.d = [];
			for (var i = 0; i < baseAttr.length; i++) {
				for (var n = 0; n < baseAttr[i].length; n++) {
					if (typeof baseAttr[i][n] === 'number') {
						finalAttr.d.push( baseAttr[i][n] + (morphAttr[i][n] - baseAttr[i][n]) * percentage);
					} else {
						finalAttr.d.push(morphAttr[i][n]);
					}
				}
			}
		} else if (layer.el[0].nodeName === 'polygon' || layer.el[0].nodeName === 'polyline') {
			// @TODO: Snap.svg 0.4.1 has a bug when animating polygons. 
			return;

		} else {
			angular.forEach(baseAttr, function(v, k){
				finalAttr[k] = Number(v) + (Number(morphAttr[k]) - Number(v)) * percentage;
			});
		}

		return finalAttr;
	}


	// Constructor

	function Animator(o) { //o.svg, o.stateTypes
		var that = this;

		that.animationDefaults = {
			duration: 500,
			easing: mina.linear
		};

		that.svg = $('#' + o.svg);
		that.states = {};
		that.stateProgress = {};
		that.currentStates = {};

		angular.forEach(o.stateTypes, function(ids, type){
			// Must use jQuery for linearGradient selector because Chrome's querySelectorAll() won't find camelCase elements, like linearGradient
			// AND jQuery won't find it unless using just the linearGradient selector (i.e .find(SVG_NODE_NAMES.join(',')) is NOT grabbing it)
			// Hence the need for the .add() call. Snap's select() methods don't find the linearGradient either.

			that.states[type] = {
				mainGroup: $('#' + ids[0]),
				layers: []
			};

			var els = that.states[type].mainGroup.find(SVG_NODE_NAMES.join(',')).add(that.states[type].mainGroup.find('linearGradient'));

			var morphEls = {};
			ids.slice(1).forEach(function(id){
				var mainGroup = $('#' + id);
				morphEls[id] = mainGroup.find(SVG_NODE_NAMES.join(',')).add(mainGroup.find('linearGradient'));
				that.stateProgress[id] = 0;
			});

			els.each(function(i){
				var layer = {
					el: $(this),
					morphs: {}
				};
				layer.morphs[ids[0]] = getAnimationAttr(this);
				angular.forEach(morphEls, function(v, k){
					layer.morphs[k] = getAnimationAttr(v.eq(i)[0]);

				});

				that.states[type].layers.push(layer);
				that.currentStates[type] = ids[0];
			});
		}); // End main states loop
	}

	Animator.prototype.changeState = function(type, baseState, morphState, percentage, options){
		var that = this;

		$.extend(that.animationDefaults, options ? options.animationSettings : {});

		// Identify the change in percentage to modify the duration accordingly
		var	durationPercentage = options && options.durationPercentage !== undefined
															? options.durationPercentage
															: Math.abs(percentage - that.stateProgress[morphState]);


		changeClass(that, baseState, morphState, true);

		that.stateProgress[morphState] = percentage;
		that.currentStates[type] = morphState;

		var shouldChangeClass = true;

		that.states[type].layers.forEach(function(layer){
			
			var finalAttr = getMorph(layer, baseState, morphState, percentage);

			// Animate the layer.
			Snap(layer.el[0]).stop().animate(finalAttr, that.animationDefaults.duration * durationPercentage, that.animationDefaults.easing, function(){

				if (shouldChangeClass) {
					changeClass(that, baseState, morphState, false);
					shouldChangeClass = false;
				}

				if (typeof that.animationDefaults.callback === 'function') that.animationDefaults.callback();
			});

		});
	};

	return Animator;
});