/*-----------------------------------------------------------*/
/* Project	: Andy Burdin // andrewburdin.com
/* Author		: Matt Johnston // matt@mattjohnston.net
/* Created	: 2013-03-07
/*-----------------------------------------------------------*/
var AB = AB || {};

$(function() {
	(function(ab) {
	"use strict";

		ab.main = {};

		/* hold on to your butts */
		ab.main.init = function() {
			ab.main.vars = {};
			ab.main.setVars();
			ab.main.setSelectors();
			ab.main.setEvents();
		};

		/* setup our vars */
		ab.main.setVars = function() {
			ab.main.vars.loading		= setInterval(ab.main.showLoading, 20);
			ab.main.vars.loaded			= 0;
			ab.main.vars.loadState	= 0;
			ab.main.vars.loadMax		= 29;
			ab.main.vars.device			= ($(window).width() < 640 ? 'mobile' : ($(window).width() < 980) ? 'tablet' : 'desktop');
			ab.main.vars.page				= $('body').attr('data-page');
			ab.main.vars.ss					= 1;
			ab.main.vars.ssTotal		= $('.post-screenshots').attr('data-total');
		};

		/* assign our selectors */
		ab.main.setSelectors = function() {
			ab.main.preloadBG 		= $('.preload-bg');
			ab.main.preloader 		= $('.preloader');
			if(ab.main.vars.page == 'home') {
				ab.main.pageWork		= $('#work').offset().top - 55;
				ab.main.pageAbout		= $('#about').offset().top - 55;
				ab.main.pageContact	= $('#contact').offset().top - 280;
			}
		};

		/* setup the events */
		ab.main.setEvents = function() {

			/* to show or not to show the preloader */
			setTimeout(function() {
				if(ab.main.loaded) {
					ab.main.preloadBG.remove();
					ab.main.preloader.remove();
				} else {
					ab.main.showPreloader();
				}
			}, 10);

			/* our deferred handler for preloading images */
			var dfd = $('body').imagesLoaded();
			dfd.always(function() {
				ab.main.loaded = 1;
				ab.main.preloadBG.animate({
					opacity: 0,
				}, 500, function() {
					ab.main.preloadBG.remove();
					ab.main.vars.loaded = 1;
				});
				ab.main.preloader.animate({
					opacity: 0,
				}, 500, function() {
					ab.main.preloader.remove();
				});
			});

			/* user wants to hide/show the menu */
			$('.menu-icon').click(function(e) {
				e.preventDefault();
				$('.site-header').toggleClass('menu-active');
			});

			/* user clicks the top button */
			$('.top').click(function(e) {
				e.preventDefault();
				ab.main.slidePage($(this));
			});

			/* some things we only do on the homepage */
			if(ab.main.vars.page == 'home') {

				/* user clicks the logo */
				$('.menu-logo').click(function(e) {
					e.preventDefault();
					ab.main.slidePage($('.top'));
				});

				/* user clicks a menu link */
				$('.item-link').click(function(e) {
					e.preventDefault();
					ab.main.slidePage($(this));
				});

				/* update the current page without blowing up */
				$(window).smartscroll(ab.main.checkPage);

			}

			/* user wants to page screenshots */
			$('.ssBullet').on({
				click: function(e) {
					e.preventDefault();
					ab.main.pageScreenshot($(this).attr('data-ss'));
				}
			});

			$('.ss-paging').on({
				click: function(e) {
					e.preventDefault();
					if($(this).hasClass('paging-prev')) {
						if(ab.main.vars.ss == 1) {
							ab.main.pageScreenshot(ab.main.vars.ssTotal);
						} else {
							ab.main.pageScreenshot(ab.main.vars.ss - 1);
						}
					} else {
						if(ab.main.vars.ss == ab.main.vars.ssTotal) {
							ab.main.pageScreenshot(1);
						} else {
							ab.main.pageScreenshot(ab.main.vars.ss + 1);
						}
					}
				}
			});

			/* if touch events are supported */
			if(Modernizr.touch) {

				/* then let the user swipe through screenshots */
				$('.screenshot').swipe({
					swipe: function(event, direction, distance, duration, fingerCount) {
						if(direction == 'left') {
							if($(this).attr('data-ss') == ab.main.vars.ssTotal) {
								ab.main.pageScreenshot(1);
							} else {
								ab.main.pageScreenshot(Number($(this).attr('data-ss')) + 1);
							}
						} else if(direction == 'right') {
							if($(this).attr('data-ss') == 1) {
								ab.main.pageScreenshot(ab.main.vars.ssTotal);
							} else {
								ab.main.pageScreenshot(Number($(this).attr('data-ss')) - 1);
							}
						}
					}
				});

			}

		};

		/*-----------------------------------------------------------
			function		: showLoading
			description	: animate the preloader
		-----------------------------------------------------------*/
		ab.main.showLoading = function() {
			if(!ab.main.vars.loaded) {
				if(ab.main.vars.loadState < ab.main.vars.loadMax) {
					ab.main.vars.loadState++;
				} else {
					ab.main.vars.loadState	= 0;
				}

				ab.main.preloader.css('background-position', '0px -'+ (ab.main.vars.loadState*68) +'px');
			}

			/* we're done here */
			if(ab.main.vars.loaded)
				clearInterval(ab.main.vars.loading);
		}

		/* this might be silly... */
		ab.main.showPreloader = function() {
			if(!ab.main.vars.loaded) {
				var pH = ab.main.preloader.height() / $(window).height() * 100;
				var pW = ab.main.preloader.width() / $(window).width() * 100;
				var pH2 = ab.main.preloader.height() / 2 / $(window).height() * 100;
				var pW2 = ab.main.preloader.width() / 2 / $(window).width() * 100;

				ab.main.preloader.css({
					'top':	50 - pH + (pH2) + '%',
					'left':	50 - pW + (pW2) + '%',
					'opacity': 1
				});
				ab.main.preloadBG.css('opacity','0.8');
			}
		}

		/*-----------------------------------------------------------
			function		: slidePage
			description	: slide the page to the selected navigational
										item
		-----------------------------------------------------------*/
		ab.main.slidePage = function(ele) {
			$('html, body').animate({
				scrollTop: $('#'+ele.attr('data-loc')).offset().top - (ab.main.vars.device != 'mobile' ? 55 : '')
			}, 1000);
		}

		/*-----------------------------------------------------------
			function		: checkPage
			description	: check if we've scroll enough to highlight a
										page.
		-----------------------------------------------------------*/
		ab.main.checkPage = function() {

			/* update the nav if necessary */
			$('.nav-item').removeClass('nav-active');

			if($(window).scrollTop() >= ab.main.pageWork && $(window).scrollTop() < ab.main.pageAbout) {
				$('.item-work').addClass('nav-active');
			} else if($(window).scrollTop() >= ab.main.pageAbout && $(window).scrollTop() < ab.main.pageContact) {
				$('.item-about').addClass('nav-active');
			} else if($(window).scrollTop() >= ab.main.pageContact) {
				$('.item-contact').addClass('nav-active');
			}
		}

		/*-----------------------------------------------------------
			function		: pageScreenshot
			description	: page through screenshots of projects
		-----------------------------------------------------------*/
		ab.main.pageScreenshot = function(theID) {

			/* we don't do this if it's the current screenshot */
			if(ab.main.vars.ss != theID) {

				/* update the bullet status */
				$('.ssBullet').each(function() {
					if($(this).hasClass('ssActive')) {
						$(this).removeClass('ssActive');
					}
					if($(this).attr('data-ss') == theID) {
						$(this).addClass('ssActive');
					}
				});

				/* update the current screenshot */
				$('.screenshot').each(function() {
					if($(this).attr('data-ss') == theID) {
						$(this).addClass('screenshotActive');
					} else {
						$(this).removeClass('screenshotActive');
					}
				});

				/* update the current ss */
				ab.main.vars.ss = theID;
			}

		}

		/* full power */
 		return(ab.main.init());
	}) (AB);
});
/*-----------------------------------------------------------*/
