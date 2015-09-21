angular.module('Home', [])
.controller('HomeController', ['$scope', '$timeout', 'SVGStateAnimator', function($scope, $timeout, SVGStateAnimator){
	'use strict';
	/*jshint -W008 */	
	
	// Sugar for creating ScrollMagic scenes
	function scene(el, hook, duration, additionalOptions) {
		var options = {triggerElement: el};
		if (hook !== undefined) options.triggerHook = hook;
		if (duration !== undefined) options.duration = typeof duration === 'number' ? duration * 100 + '%' : duration;
		return new ScrollMagic.Scene(angular.extend(options, additionalOptions)).addTo(controller);
	}

	function tween(el, hook, duration, tweenOptions) {
		if (!Array.isArray(el)) el = [el, el];
		if (!tweenOptions.ease) tweenOptions.ease = Linear.easeNone;
		return scene(el[0], hook, duration).setTween(el[1], tweenOptions);
	}

	function tweenInstant(el, hook, duration, tweenOptions) {
		// Don't use Linear.easeNone on instant animations. In these cases, the default Power1 feels more natural.
		if (!Array.isArray(el)) el = [el, el];
		return scene(el[0], hook).setTween(el[1], duration, tweenOptions);
	}

	function createScreenGrow(el, scene) {
		if (scene) scene.destroy(true);
		var percent = 1 - $(el).outerHeight() / window.innerHeight;
		return tween(el, percent, percent, {height: '100vh'});
	}


	function beginAnimation() {
		// Disable pinning & dependent tweens for responsive
		var notResponsive = window.innerWidth > 800;


		TweenMax.to(document.body, 1, {opacity: 1, ease: Linear.easeNone});
		TweenMax.to(document.getElementById('sky'), 60, {scale: 2, repeat: -1, yoyo: true, ease: Linear.easeNone});
		TweenMax.to(document.getElementById('landscape'), 60, {scale: 1, repeat: -1, yoyo: true, ease: Linear.easeNone});

		var line1 = document.querySelector('#screen1 .line-1'),
				line2 = document.querySelector('#screen1 .line-2'),
				startArrow = document.getElementById('start-arrow');

		tween([line1, [line1, startArrow]], .3, .3, {opacity: 0});

		// set the pin hook to be when line-2 is vertically centered
		// but this doesn't update when the window is resized. is there a way to update the scenes on resize?
		// or is there a way built in to scrollMagic to keep this dynamic?
		var line2pinHook = ((window.innerHeight - $(line2).outerHeight()) / 2) / window.innerHeight;
		var line2pinHookDuration = (.7 - line2pinHook);

		tween(line2, .7, line2pinHookDuration, {opacity: 1});
		tween(line2, line2pinHook, line2pinHookDuration, {opacity: 0}).offset(200);
		if (notResponsive) scene(line2, line2pinHook).setPin(line2);

		// SCREEN 2

		var screen2 = document.getElementById('screen2'),
				bottomHelper = document.getElementById('bottom-helper'),
				h2 = screen2.querySelector('h2'),
				h2fadeOut = h2.querySelector('.fade-out'),
				$bg = $('#bg'),

				policiesH3 = screen2.querySelector('#policies h3'),
				alliesH3 = screen2.querySelector('#allies h3'),
				appearanceH3 = screen2.querySelector('#appearance h3'),
				policiesh3fadeOut = policiesH3.querySelector('.fade-out'),
				alliesh3fadeOut = alliesH3.querySelector('.fade-out'),
				appearanceh3fadeOut = appearanceH3.querySelector('.fade-out'),

				policiesDisc = screen2.querySelector('#policies .disc'),
				alliesDisc = screen2.querySelector('#allies .disc'),
				appearanceDisc = screen2.querySelector('#appearance .disc'),

				policiesShadowFadeOut = screen2.querySelector('#policies .shadow-fade-out'),
				alliesShadowFadeOut = screen2.querySelector('#allies .shadow-fade-out'),
				appearanceShadowFadeOut = screen2.querySelector('#appearance .shadow-fade-out'),
				policiesShadow = policiesShadowFadeOut.querySelector('.shadow'),
				alliesShadow = alliesShadowFadeOut.querySelector('.shadow'),
				appearanceShadow = appearanceShadowFadeOut.querySelector('.shadow'),

				femaleContainer = document.getElementById('female-container'),
				female = document.getElementById('female'),
				blinds = document.getElementById('blinds'),
				svgPaths = Array.prototype.slice.call($(alliesDisc.querySelectorAll('path')).not('#US')),
				USpath = document.getElementById('US');

		// Attached to scope so that directives can use the animator instance as well
		$scope.svgAnimator = new SVGStateAnimator({
			svg: 'donkey-elephant',
			stateTypes: {
				party: ['Elephant', 'Donkey_1_']
			}
		});

		// GSAP can't tween CSS filters, so we have to do it manually
		scene(screen2, 1, 1).on('progress', function(e){
			var filter = 'blur(' + 15 * e.progress + 'px)';
			$bg.cssPrefix('filter', filter);
		});

		// Color countries
		$scope.changeCountryColor = function (timeline, slicePercent) {
			if (slicePercent === undefined) slicePercent = 1;
			
			arrayShuffle(svgPaths).slice(0, svgPaths.length * slicePercent).forEach(function(svgPath){
				var fill = Math.random() < 0.5 ? 'green' : '#c00';
				
				timeline.to(svgPath, .5, {
					fill: tinycolor.mix('#ccc', fill, randomIntFromInterval(15, 100)).toString()
				}, '-=.49');
			});
		};

		var countryTimeline = new TimelineMax().to(USpath, .5, {fill: '#B3B3B3'});
		$scope.changeCountryColor(countryTimeline, 1);

		// H2
		var timelineH2 = new TimelineMax().to(h2, .5, {opacity: 1});

		// Policies
		var timelinePolicies = new TimelineMax()
																.to(policiesDisc, .5, {rotationY: 0, opacity: 1, onComplete: function(){
																	$scope.svgAnimator.changeState('party', 'Elephant' , 'Donkey_1_', 1);
																}})
																.to([policiesShadow, policiesH3], .5, {opacity: 1}, .5);

		// Allies
		var timelineAllies = new TimelineMax()
															.to(alliesDisc, .5, {rotationY: 0, opacity: 1})
															.to([alliesShadow, alliesH3], .5, {opacity: 1})
															.add(countryTimeline, .5);


		// Appearance
		var timelineAppearance = new TimelineMax()
																	.to(appearanceDisc, .5, {rotationY: 0, opacity: 1})
																	.to(blinds, .5, {left: '50%'})
																	.to(femaleContainer, .5, {left: '-50%'}, .5)
																	.to(female, .5, {left: '50%'}, .5)
																	.to([appearanceShadow, appearanceH3], .5, {opacity: 1}, .5);

		if (notResponsive) {
			scene(screen2, .6, 0, {reverse: false})
				.setTween(timelineH2.add(timelinePolicies).add(timelineAllies, 1.5).add(timelineAppearance, 3)
			);	
		}
		else {
			scene(h2, .7).setTween(timelineH2);
			scene(policiesDisc, .6).setTween(timelinePolicies);
			scene(alliesDisc, .6).setTween(timelineAllies);
			scene(appearanceDisc, .6).setTween(timelineAppearance);
		}
		


		if (notResponsive) {
			// Make Screen 2 grow to fit the viewport
				var sceneScreenGrow = createScreenGrow(screen2);

			$(window).resize(function(){
				sceneScreenGrow = createScreenGrow(screen2, sceneScreenGrow);
			});

			// Exit
			scene(screen2, 0).duration(200).setPin(screen2);
			scene(bottomHelper, .95, .25).setTween([h2fadeOut, policiesh3fadeOut, alliesh3fadeOut, appearanceh3fadeOut], {opacity: 0});
			scene(bottomHelper, .95, .5).setTween(new TimelineMax()
																		.to([policiesShadowFadeOut, alliesShadowFadeOut, appearanceShadowFadeOut], 1, {opacity: 0})
																		.to(policiesDisc, 1, {y: '-150%'}, 0)
																		.to(alliesDisc, 1, {y: '-200%'}, 0)
																		.to(appearanceDisc, 1, {y: '-100%'}, 0)
																	);
		}
		
		scene(bottomHelper, .95, 0).setClassToggle($bg[0], 'no-blur');
		tweenInstant([screen2, document.querySelector('#screen4 a')], 0, 0, {display: 'block'});

		// FINAL GRADIENT TRANSITION
		var screen3 = document.getElementById('screen3');
		tweenInstant([document.getElementById('screen4'), [screen2, screen3]], 1, .5, {y: -1000});
	}

	var controller = new ScrollMagic.Controller();

	if (document.readyState === 'complete') {
		$timeout(beginAnimation);
	} else {
		$(window).load(beginAnimation);
	}

}]);