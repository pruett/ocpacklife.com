Y.use('node', function () {
	window.helper = Singleton.create({

		ready: function() {

			Y.on('domready', function() {
				this.bindUI();
			}, this);

		},


		bindUI: function() {

			this.dataToggleBody();
			this.dataToggleEl();
			this.dataLightbox();

			Y.one(window).on('resize', this.syncUI, this);

		},


		syncUI: function () {

			helper.debounce(function () {
				helper.imgLoad();
			});

		},


		radioCheckboxes: function (wrapper, checkbox, label) {

			/*
				Makes a group of checkboxes behave more
				like radios.

				Only the wrapper param is required.
				Checkbox and label default to the most
				generic selectors possible, but you can
				make them more specific.

				helper.radioCheckboxes('#nav', '.folder-checkbox', '.folder-label');
			*/

			if (!wrapper) {
				console.warn('radioCheckboxes: Must define a wrapper.');
				return;
			}

			if (!Y.one(wrapper)) {
				console.warn('radioCheckboxes: No wrapper found on page.');
				return;
			}

			checkbox = checkbox || '[type="checkbox"]';
			label = label || 'label[for]';

			if (Y.one(wrapper).all(checkbox).size() > 1) {
				Y.one(wrapper).delegate('click', function (e) {
					e.preventDefault();
					var currentCheck = Y.one('#' + e.currentTarget.getAttribute('for'));
					if (currentCheck.get('checked') === false) {
						Y.one(wrapper).all(checkbox).each(function (current) {
							current.set('checked', false);
						});
						currentCheck.set('checked', true);
					} else {
						currentCheck.set('checked', false);
					}
				}, label);
			}

		},


		folderRedirect: function (folder, wrapper) {

			/*
				Redirects the main folder link to the first
				page in the folder. Relies on a data attribute
				in the markup.

				<label for="{id}" data-href="{urlId}">Folder</label>
			*/

			folder = folder || 'label[for]';
			wrapper = wrapper || 'body';

			if (Y.one(folder)) {
				Y.one(wrapper).delegate('click', function (e) {
					e.preventDefault();
					var link = e.currentTarget.getData('href');
					if (link) {
						window.location = link;
					} else {
						console.warn('folderRedirect: You must add a data-href attribute to the label.')
					}
				}, folder);
			}

		},


		dataLightbox: function() {

			/*
				Creates a lightbox when you click on any image/video.
				To initialize, add a data attribute to any img or video tag

				<img data-lightbox="set-name"/>
			*/

			var lightboxSets = {};

			Y.all('[data-lightbox]').each(function(elem) {
				var name = elem.getAttribute('data-lightbox');
				lightboxSets[name] = lightboxSets[name] || new Array();

				lightboxSets[name].push({
					content: elem,
					meta: elem.getAttribute('alt')
				});

				elem.on('click', function(e) {
					e.halt();

					new Y.Squarespace.Lightbox2({
						set: lightboxSets[name],
						currentSetIndex: Y.all('[data-lightbox]').indexOf(elem),
						controls: { previous: true, next: true }
					}).render();
				});
			});

		},


		dataToggleBody: function() {

			/*
				Toggles a class on the body when you click an
				element. To initialize, add a data attribute to
				any element, like so.

				<div class="shibe" data-toggle-body="doge"></div>
			*/

			Y.one('body').delegate('click', function(e) {
				Y.one('body').toggleClass(e.currentTarget.getData('toggle-body'));
			}, '[data-toggle-body]');

		},


		dataToggleEl: function() {

			/*
				Toggles a class on any element when you click on
				it. To initialize, add a data attribute to any
				element, like so.

				<div class="shibe" data-toggle="doge"></div>
			*/

			Y.one('body').delegate('click', function(e) {
				var current = e.currentTarget;
				current.toggleClass(current.getData('toggle'));
			}, '[data-toggle]');

		},


		debounce: function(callback, timer, context) {

			/*
				This function takes an event that executes
				continuously - like scroll or resize - and
				fires only one event when the continuous
				events are finished.

				helpers.debounce(function () {
					// do stuff here.
				});
			*/

			timer = timer || 100;
			context = context || Site;

			if (callback) {
				this._timeout && this._timeout.cancel();
				this._timeout = Y.later(timer, context, callback);
			}

		},


		imgLoad: function (el) {

			/*
				Pass an image selector to this function and
				Squarespace will load up the proper image
				size.

				ex: this.imgLoad('img[data-src]');
			*/

			el = el || 'img[data-src]';

			Y.one(el) && Y.all(el).each(function (img) {
				ImageLoader.load(img);
			});

		},

		scrollAnchors: function (el) {

			/*
				Makes anchor links scroll smoothly instead of jumping
				down the page. The "el" argument is optional. By
				default, invoking this function will create the smooth
				scrolling behavior on every hash link.

				Y.Template.helper.scrollAnchors();
			*/

			el = el || 'a[href^="#"]';

			if (typeof el != 'string') {
				console.error('helpers.js: scrollAnchors argument must be a string.');
				return false;
			}

			Y.one('body').delegate('click', function (e) {
				if (e.currentTarget.hasClass('ignore-template-hash-behavior')) {
					return false;
				}

				e.halt();

				var hash = e.currentTarget.getAttribute('href').replace(/\//, '');

				Y.one(hash) && this.smoothScrollTo(Y.one(hash).getY());
				history && history.pushState({}, hash, hash);
			}, el, this);

		},


		smoothScrollTo: function (point) {

			/*
				Scrolls to some point on the Y axis of a page.
				Accepts a number as an argument.
			*/

			if (parseInt(point) == NaN) {
				console.warn('helpers.js: smoothScrollTo must have a scroll point passed to it.')
				return false;
			}

			if (!Y.Lang.isNumber(point)) {
				try {
					point = parseInt(point);
				} catch (e) {
					console.warn('helpers.js: scrollTo was passed an invalid argument.');
					return false;
				}
			}

			var a = new Y.Anim({
				node: Y.one(Y.UA.gecko || Y.UA.ie || !!navigator.userAgent.match(/Trident.*rv.11\./) ? 'html' : 'body'),
				to: {
					scrollTop : point
				},
				duration: 0.4,
				easing: 'easeOut'
			});

			a.run();

			a.on('end', function () {
				a.destroy();
			});

		}

	});
});
