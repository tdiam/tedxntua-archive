/*
     * Parallax effect code
     */
(function(global) {
	var isMac = navigator.platform.toUpperCase().indexOf('MACINTEL')>=0,
		isFF = (window.InstallTrigger) ? true : false,
		viewportHeight = document.documentElement.clientHeight,
		mainTitle = document.querySelector('#main-title'),
		subTitle = document.querySelector('#sub-title'),
		bgImage = document.querySelector('#bg'),
		maxHeight = document.querySelector('main').offsetHeight,
		video = (isFF) ? document.querySelector('#fallback-img') : document.querySelector('video'),
		videoSection = video.parentNode,
		transform = (isFF) ? 'transform' : 'webkitTransform',
		parallax,
		scrollDist,
		scrollPercentage;

	console.log(maxHeight);


	console.log(navigator.platform);
	console.log(isMac);

	function parallaxScroll() {
		scrollDist = window.scrollY;
		scrollPercentage = scrollDist*100/maxHeight;

		if (scrollDist > viewportHeight) {
			return false;
		}

		if (isMac) {
			bgImage.style[transform] = 'translate3d(0, ' + (scrollPercentage*3) + '%, 0)';
			video.style[transform] = 'translate3d(-50%, ' + (scrollPercentage*1.5) + '%, 0)';
		} else {
			video.style[transform] = 'translate3d(-50%, ' + (-scrollPercentage*1) + '%, 0)';
			video.style.transition = 'all .2s ease';
			bgImage.style.transition = 'all .2s ease';
		}
	}

	function updateViewportHeight() {
		viewportHeight = document.documentElement.clientHeight;
	}

	function playVideo() {
		video.classList.remove('transparent');
		video.setAttribute('autoplay', true);
// 				setTimeout(function() {
			video.play();
// 				}, 200);
	}

	global.addEventListener('resize', updateViewportHeight);
	global.addEventListener('scroll', parallaxScroll);
	global.addEventListener('load', function() {
		maxHeight = document.querySelector('main').offsetHeight;
		console.log(maxHeight);
	});
	
	if (!isFF) {
		global.addEventListener('DOMContentLoaded', playVideo);
	}
})(window);

/*
     * Smooth scrolling code
     */
(function() {
	$(function() {
		$('#nav-bar a[href*=#]:not([href=#])').click(function() {
			if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
				var target = $(this.hash),
					navBar = $('#nav-bar');
				console.log(target);
				target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
				if (target.length) {
					$('html,body').animate({
						scrollTop: target.offset().top// - navBar.outerHeight()
					}, 1000);
					return false;
				}
			}
		});
	});
})();

/*
     * Countdown code
     */
(function(global) {
	"use strict";

	// Vanilla JS alternative to $.extend
	global.extend = function (obj, extObj) {
		obj = obj || {};
		if (arguments.length > 2) {
			for (var a = 1; a < arguments.length; a++) {
				global.extend(obj, arguments[a]);
			}
		} else {
			for (var i in extObj) {
				obj[i] = extObj[i];
			}
		}
		return obj;
	};

	// Countdown constructor
	var Countdown = function (conf) {
		this.conf = global.extend({
			// Dates
			dateStart    : new Date(),
			dateEnd      : new Date(new Date().getTime() + (24 * 60 * 60 * 1000)),

			// Default elements
			selector     : ".timer",

			// Messages
			msgBefore    : "Be ready!",
			msgAfter     : "It's over, sorry folks!",
			msgPattern   : "{days} days, {hours} hours, {minutes} minutes and {seconds} seconds left.",

			// Callbacks
			onStart      : null,
			onEnd        : null,

			// Extra options
			leadingZeros : false,
			initialize   : true
		}, conf);

		// Private variables
		this.started = false;
		this.selector = document.querySelectorAll(this.conf.selector);
		this.interval = 1000;
		this.patterns = [
			{ pattern: "{years}", secs: 31536000 },
			{ pattern: "{months}", secs: 2628000 },
			{ pattern: "{weeks}", secs: 604800 },
			{ pattern: "{days}", secs: 86400 },
			{ pattern: "{hours}", secs: 3600 },
			{ pattern: "{minutes}", secs: 60 },
			{ pattern: "{seconds}", secs: 1 }
		];

		// Doing all the things!
		if (this.initialize !== false) {
			this.initialize();
		}
	};

	// Initializing the instance
	Countdown.prototype.initialize = function () {
		this.defineInterval();

		// Already over
		if (this.isOver()) {
			return this.outOfInterval();
		}

		this.run();
	};

	// Converting a date into seconds
	Countdown.prototype.seconds = function (date) {
		return date.getTime() / 1000;
	};

	// Returning if countdown has started yet
	Countdown.prototype.isStarted = function () {
		return this.seconds(new Date()) >= this.seconds(this.conf.dateStart);
	};

	// Returning if countdown is over yet
	Countdown.prototype.isOver = function () {
		return this.seconds(new Date()) >= this.seconds(this.conf.dateEnd);
	};

	// Running the countdown
	Countdown.prototype.run = function () {
		var that = this,
			sec  = Math.abs(this.seconds(this.conf.dateEnd) - this.seconds(new Date())),
			timer;

		// Initial display before first tick
		if (this.isStarted()) {
			this.display(sec);
		}

		// Not started yet
		else {
			this.outOfInterval();
		}

		// Vanilla JS alternative to $.proxy
		timer = global.setInterval(function () {
			sec--;

			// Time over
			if (sec <= 0) {
				global.clearInterval(timer);
				that.outOfInterval();
				that.callback("end");
			}

			else if (that.isStarted()) {
				if (!that.started) {
					that.callback("start");
					that.started = true;
				}

				that.display(sec);
			}
		}, this.interval);
	};

	// Displaying the countdown
	Countdown.prototype.display = function (sec) {
		var output = this.conf.msgPattern;

		for (var b = 0; b < this.patterns.length; b++) {
			var currentPattern = this.patterns[b];

			if (this.conf.msgPattern.indexOf(currentPattern.pattern) !== -1) {
				var number = Math.floor(sec / currentPattern.secs),
					displayed = this.conf.leadingZeros && number <= 9 ? "0" + number : number;
				sec -= number * currentPattern.secs;
				output = output.replace(currentPattern.pattern, displayed);
			}
		}

		for (var c = 0; c < this.selector.length; c++) {
			this.selector[c].innerHTML = output;
		}
	};

	// Defining the interval to be used for refresh
	Countdown.prototype.defineInterval = function () {
		for (var e = this.patterns.length; e > 0; e--) {
			var currentPattern = this.patterns[e-1];

			if (this.conf.msgPattern.indexOf(currentPattern.pattern) !== -1) {
				this.interval = currentPattern.secs * 1000;
				return;
			}
		}
	};

	// Canceling the countdown in case it's over
	Countdown.prototype.outOfInterval = function () {
		var message = new Date() < this.conf.dateStart ? this.conf.msgBefore : this.conf.msgAfter;

		for (var d = 0; d < this.selector.length; d++) {
			if (this.selector[d].innerHTML !== message) {
				this.selector[d].innerHTML = message;
			}
		}
	};

	// Dealing with events and callbacks
	Countdown.prototype.callback = function (event) {
		var e = event.capitalize();

		// onStart callback
		if (typeof this.conf["on" + e] === "function") {
			this.conf["on" + e]();
		}

		// Triggering a jQuery event if jQuery is loaded
		if (typeof global.jQuery !== "undefined") {
			global.jQuery(this.conf.selector).trigger("countdown" + e);
		}
	};

	// Adding a capitalize method to String
	String.prototype.capitalize = function () {
		return this.charAt(0).toUpperCase() + this.slice(1);
	};

	global.Countdown = Countdown;


	new Countdown({
		selector: '#countdown',
		msgAfter: "We are live!",
		msgPattern: "{days}d:{hours}h:{minutes}m:{seconds}s",
		dateStart: new Date(),
		dateEnd: new Date('Jan 17, 2015 11:00')
	});
}(window));

/*
 * Instafeed initialization code
 */
/* INSTAGRAM FEED BROKEN
(function(global) {
	var loadButton = document.querySelector('#instafeed-more-button'),
		firstTime = true,
		triggerDistance = getPosition(document.querySelector('#sofar-section')).y - global.innerHeight,
		thumbHeight,
		counter = 0,
		scrollDistance,
		feed = new Instafeed({
			limit: 20,
			callback: swapFullImage,
			resolution: 'standard_resolution',
			get: 'tagged',
			tagName: 'tedxntua',
			sortBy: 'most-recent',
			clientId: '1e30b27b4b8c41518398c6a39e3c621d',
			template:'<li><div class="thumb-wrapper" data-link="{{link}}" ><img src="{{image}}" /><div class="likes">&hearts; {{likes}}</div></div></li>',
			// every time we load more, run this function
			after: function() {

				//Fancy stuff, makes use of animate.css
				var thumbs = $("#instafeed").find('.thumb-wrapper');

				$.each(thumbs, function(index, thumb) {
					counter += 1;
					if (firstTime && (index==0)) {
						swapFullImage(thumb, 'zoomIn', firstTime);
						firstTime = false;
					}

					var delay = (index * 75) + 'ms';
					$(thumb).css('-webkit-animation-delay', delay);
					$(thumb).css('-moz-animation-delay', delay);
					$(thumb).css('-ms-animation-delay', delay);
					$(thumb).css('-o-animation-delay', delay);
					$(thumb).css('animation-delay', delay);
					$(thumb).addClass('animated flipInX');
				});

				if (!thumbHeight) {
					thumbs[0].querySelector('img').onload = function() {
						loadButton.classList.remove('hidden');
						thumbHeight = $(thumbs[0]).parent().outerHeight(true);
						$("#instafeed").css('height', thumbHeight * (counter/5));
						counter = 0;
					};
				} else {
					scrollDistance = Math.ceil(counter/5) * thumbHeight;
					counter = 0;
				}

				$('#instafeed').animate({
					scrollTop: scrollDistance
				}, 1000);

				// disable button if no more results to load
				if (!this.hasNext()) {
					loadButton.setAttribute('disabled', 'true');
				}
			}
		});


	function swapFullImage(thumb, effect, firstTime) {
		var link = thumb.getAttribute('data-link'),
			img = thumb.querySelector('img').src,
			fullImage = document.querySelector('#instafeed-full-image'),
			fullImageLink = document.querySelector('#instafeed-full-image-link'),
			effect = effect || 'fadeIn';

		fullImage.src = img;
		fullImageLink.href = link;

		if (firstTime) {
			fullImage.classList.remove('transparent');
		}

		if(global.timeout) {
			clearTimeout(global.timeout);
			delete global.timeout;
			fullImage.classList.remove('animated');
			fullImage.classList.remove(effect);
		}
		fullImage.classList.add('animated');
		fullImage.classList.add(effect);
		global.timeout = setTimeout(function() {
			clearTimeout(global.timeout);
			delete global.timeout;
			fullImage.classList.remove('animated');
			fullImage.classList.remove(effect);
		}, 1000);
	}

	function getPosition(element) {
		//         var xPosition = 0;
		var yPosition = 0;

		while(element) {
			//xPosition += (element.offsetLeft - element.scrollLeft + element.clientLeft);
			yPosition += (element.offsetTop - element.scrollTop + element.clientTop);
			element = element.offsetParent;
		}

		return { 
			//             x: xPosition, 
			y: yPosition 
		};
	}

	function fireFeed() {
		if (global.scrollY >= triggerDistance) {
			feed.run();
			global.removeEventListener('scroll', fireFeed); 
		}
	}

	// bind the load more button
	loadButton.addEventListener('click', function() {
		feed.next();
	});

	global.addEventListener('scroll', fireFeed);
	global.triggerDistance = triggerDistance;
})(window);

*/

/*
 * Speakers thingy code
 */

/* NOTE: When Instagram feed is fixed, replace "#where-section" below with "#sofar-section" */
(function(global) {

	var speakers = [].slice.call(document.querySelectorAll('.speaker[data-name]')),
		info = document.createElement('div'),
		expander = document.createElement('div'),
		height, 
		pos,
		posDiff, 
		targetElement, 
		activeSpeaker;

	info.classList.add('info');
	info.classList.add('clearfix');

	expander.classList.add('expander');
	expander.appendChild(info);

	function hideInfo(callback) {
		activeSpeaker.classList.remove('active');
		activeSpeaker = null;
		info.classList.remove('fadeInDown');
		info.classList.add('fadeOutUp');

		$('html,body').animate({
			scrollTop: pos + posDiff
		}, 1000);

		setTimeout(function() {
			info.classList.add('transparent');
			info.classList.remove('animated');
			info.classList.remove('fadeOutUp');
			expander.style.height = '0px';
			expander.classList.remove('show-overflow');
			setTimeout(function() {
				targetElement.removeChild(expander);
				global.triggerDistance = $(document.querySelector('#where-section')).offset().top - global.innerHeight;
				if (typeof callback === 'function') {
					callback();
				}
			}, 1000);
		}, 500);


	}

	function showInfo(element) {
		activeSpeaker = element;
		activeSpeaker.classList.add('active');
		info.innerHTML = element.getAttribute('data-text');
		targetElement = document.querySelector('#' + element.getAttribute('data-phase'));
		pos = $(targetElement).offset().top;
		posDiff = global.scrollY - pos;

		$('html,body').animate({
			scrollTop: pos - 40
		}, 1000);

		info.classList.add('animated');
		info.classList.add('transparent');

		targetElement.appendChild(expander);
		setTimeout(function() {
			height = info.offsetHeight;
			expander.style.height = height + 'px';
			setTimeout(function(){
				expander.classList.add('show-overflow');
				info.classList.remove('transparent');
				info.classList.add('fadeInDown');
				global.triggerDistance = $(document.querySelector('#where-section')).offset().top - global.innerHeight;
			}, 500);
		}, 10);
	}

	function toggleInfo(element) {
		if (activeSpeaker === element) {
			hideInfo(activeSpeaker);
		} else if (activeSpeaker && (activeSpeaker !== element)) {
			hideInfo(function() {
				showInfo(element);
			});
		} else {
			showInfo(element);
		}
	}

	speakers.forEach(function(element) {
		element.addEventListener('click', function() {
			toggleInfo(element);
		});
	});

})(window);

/*
 * ????
 */
(function(global) {
	function main(global) {
		var konami_keys = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
		var konami_index = 0;
		$(document).keydown(function(e){
			if(e.keyCode === konami_keys[konami_index++]){
				if(konami_index === konami_keys.length){
					$.fancybox({
						'padding': 0,
						'margin' : 0,
						'content' : '<video src="./media/loituma.webm" autoplay controls style="width:100vw;height:100vh" />',
						'closeBtn' : false,
						'onComplete' : function(){
							$('#fancybox-outer').css('background-color', 'transparent');
						}
					})
				}
			}else{
				konami_index = 0;
			}
		});
	}
	global.addEventListener('load', function() {
		main(global);
	});
})(window);
