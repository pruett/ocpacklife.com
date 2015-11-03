Y.use('node', function (Y) {
	window.Authenticated = Singleton.create({

		ready: function () {
			this.bindUI();
		},

		bindUI: function () {

			Y.Global.on('tweak:close', function (f) {
				Y.one('#mobileNavToggle').set('checked',false);
			});

			Y.Global.on('tweak:change', function (f) {
				if(f.getName() == 'siteTitleContainerWidth' || 'logoContainerWidth'){
					Y.one('#header').addClass('tweaking');
					helper.debounce(function () {
						Y.one('#header').removeClass('tweaking');
					});
				}

				if(f.config && f.config.category == 'Site Navigation'){
					Y.one('#mobileNavToggle').set('checked',true);
				}

				if(f.getName() == 'transparent-header'){
					helper.debounce(function () {
						helper.imgLoad();
					});
				}

				helper.debounce(function () {
					Y.one('#header').removeClass('tweaking');
				},500);
			});

		}

	});
});
