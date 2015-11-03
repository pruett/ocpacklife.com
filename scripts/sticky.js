/*

	This script takes an existing relatively positioned element
	like a header and converts it to fixed at a certain point
	when the user is scrolling down the page.

	To initialize it, you use a class and a couple of data
	attributes, like this:

	<header
		class="show-on-scroll"
		data-offset-el=".index-section"
		data-offset-behavior="bottom">

	class
	=====
		Put the class on the element you want to manipulate.

	data-offset-el
	==============
		The selector of the element that defines the offset
		top value where the appearance changes. This is used
		as a Y.one() so if you pass it a class, it will only
		get the first instance of that class.

	data-offset-behavior
	====================
		Options are "top" or "bottom." Top is the default. The
		.show-on-scroll element will change when you reach
		that position on the offset element.

*/

Y.use('node', function (Y) {
	window.showOnScroll = Singleton.create({

		ready: function () {

			Y.on('domready', function () {
				if (Y.one('.collection-type-index')) {
					if (Y.one('.touch-styles')) {
						return false;
					}
					
					this.initializer();
					this.bindUI();
					this.syncUI();
				}
			}, this);

		},

		initializer: function () {

			this.el = Y.one('.show-on-scroll');

			if (this.el) {
				this.elOffset = Y.one(this.el.getData('offset-el'));
				this.offsetBehavior = this.el.getData('offset-behavior') || 'top';
				if (this.elOffset) {
					Y.one('body').prepend(Y.Node.create('<div class="show-on-scroll-wrapper" id="showOnScrollWrapper"></div>'));
					this.wrapper = Y.one('#showOnScrollWrapper');
					this.wrapper.setHTML(this.el._node.outerHTML);
				} else {
					console.warn('No show on scroll offset element found.');
					return;					
				}
			} else {
				console.warn('No show on scroll element found.');
				return;
			}

		},

		bindUI: function () {

			this.scrollEvents();

			Y.one(window).on('resize', function () {
				this.syncUI();
			}, this);

		},

		syncUI: function () {

			this.getVariables();

		},

		getVariables: function () {

			var windowHeight = window.innerHeight;

			if (this.offsetBehavior == 'bottom') {
				this.navShowPosition = this.elOffset.getY() + this.elOffset.get('offsetHeight');
			} else {
				this.navShowPosition = this.elOffset.getY();
			}

		},

		scrollEvents: function () {

			this.scrolling = false;

			Y.one(window).on('scroll', function () {
				if (this.scrolling === false) {
					this.scrolling = true;
					this.scrollLogic();
					helper.debounce(function () {
						this.scrolling = false;
					}, 300, this);
				}
			}, this);

		},

		scrollLogic: function () {

			if (window.scrollY > this.navShowPosition) {
				this.wrapper.addClass('show');
			} else {
				this.wrapper.removeClass('show');
			}

			Y.later(100, this, function () {
				if (this.scrolling === true) {
					window.requestAnimationFrame(Y.bind(function () {
						this.scrollLogic();
					}, this));
				}
			});

		}

	});
});