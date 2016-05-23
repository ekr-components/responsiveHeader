// Requires jQuery

var components = components || {};

jQuery(document).ready(function() {
	jQuery('[data-component="responsive-header"]').each(function() { 
		var header = new components.responsiveHeader(this); 
	});
});

components.responsiveHeader = function(el) {
	var self = this;
	self.el = jQuery(el);
	self.responsiveCurrent = false;
	self.init();
};
components.responsiveHeader.prototype = {
	init: function() {
		var self = this;
		// Desktop
		self.desktop = {};
		self.desktop.el = self.el.find('[data-header-responsive="desktop"]');
		self.desktop.el.wrapInner('<div data-header-desktop="inner"></div>');
		self.desktop.inner = self.el.find('[data-header-desktop="inner"]');
		self.desktop.init = function() {
			self.desktop.shrunk = false;
			self.desktop.el.css('width', jQuery(window).width());
			jQuery(window).on('resize.headerDesktop', function() {
				self.desktop.resize();
			});
			jQuery(document).on('scroll.headerDesktop', function() {
				self.desktop.scrollcheck();
			});
			self.desktop.resize();
		};
		self.desktop.destroy = function() {
			jQuery(window).off('.headerDesktop');
			jQuery(document).off('.headerDesktop');
		};
		self.desktop.scrollcheck = function() {
			if(jQuery(document).scrollTop() > 100) {
				if(!self.desktop.shrunk) self.desktop.shrink();
			} else {
				if(self.desktop.shrunk) self.desktop.grow();
			}
		};
		self.desktop.shrink = function() {
			self.desktop.el.addClass('shrunk');
			self.desktop.shrunk = true;
		};
		self.desktop.grow = function() {
			self.desktop.el.removeClass('shrunk');
			self.desktop.shrunk = false;
		};
		self.desktop.resize = function() {
			self.desktop.scrollcheck();
		};

		// Mobile
		self.mobile = {};
		self.mobile.el = self.el.find('[data-header-responsive="mobile"]');
		self.mobile.menu = self.mobile.el.find('[data-header-mobile="menu"]');
		self.mobile.trigger = self.mobile.el.find('[data-header-mobile="trigger"]');
		self.mobile.init = function() {
			self.mobile.isOpen = false;
			self.mobile.el.css('opacity', 0);
			self.mobile.menu.css('height', '');
			self.mobile.originalHeight = self.mobile.menu.height();
			self.mobile.menu.css('height', 0);
			self.mobile.el.css('opacity', 1);
			self.mobile.trigger.on('click.headerMobile', function() {
				if(self.mobile.isOpen) {
					self.mobile.close();
				} else {
					self.mobile.open();
				}
			});
		};
		self.mobile.destroy = function() {
			self.mobile.trigger.off('.headerMobile');
		};
		self.mobile.open = function() {
			self.mobile.menu.css('height', self.mobile.originalHeight);
			self.mobile.trigger.addClass('open');
			self.mobile.isOpen = true;
		},
		self.mobile.close = function() {
			self.mobile.menu.css('height', 0);
			self.mobile.trigger.removeClass('open');
			self.mobile.isOpen = false;
		};

		jQuery(window).on('resize.header', function() {
			self.resize();
		});
		self.resize();
	},
	resize: function() {
		var self = this;
		var ww = jQuery(window).width();
		if(ww <= 1000) { // Mobile
			if(self.currentResponsive !== 'mobile') {
				self.desktop.el.hide();
				self.desktop.destroy();
				self.mobile.el.show();
				self.mobile.init();
				self.currentResponsive = 'mobile';
			}
		} else { // Desktop
			if(self.currentResponsive !== 'desktop') {
				self.mobile.el.hide();
				self.mobile.destroy();
				self.desktop.el.show();
				self.desktop.init();
				self.currentResponsive = 'desktop';
			}
		}
	}
};
