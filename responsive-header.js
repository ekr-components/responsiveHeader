// Requires jQuery

var components = components || {};

jQuery(document).ready(function() {
    jQuery('[data-component="responsive-header"]').each(function() {
        var header = new components.responsiveHeader(this);
    });
});

components.responsiveHeader = function(el) {
    this.el = jQuery(el);
    this.responsiveCurrent = false;
    this.responsiveBreakpoint = 1000;
    this.init();
};
components.responsiveHeader.prototype = {
    init: function() {
        this.desktop = new components.responsiveHeader.desktop(
            this.el.find('[data-rh="desktop"]')
        );
        this.mobile = new components.responsiveHeader.mobile(
            this.el.find('[data-rh="mobile"]')
        );
        jQuery(window).on('resize.rh', this.resize.bind(this));
        this.resize();
    },
    destroy: function() {
        jQuery(window).off('.rh');
    },
    resize: function() {
        var ww = jQuery(window).width();
        if(ww <= this.responsiveBreakpoint) { // Mobile
            if(this.currentResponsive !== 'mobile') {
                this.mobile.init();
                this.desktop.destroy();
                this.currentResponsive = 'mobile';
            }
        } else { // Desktop
            if(this.currentResponsive !== 'desktop') {
                this.desktop.init();
                this.mobile.destroy();
                this.currentResponsive = 'desktop';
            }
        }
    }
};

components.responsiveHeader.desktop = function(el) {
    this.el = jQuery(el);
    this.isScrolled = false;
    this.scrollBreakpoint = 100
};
components.responsiveHeader.desktop.prototype = {
    init: function() {
        this.el.show();
        jQuery(document).on('scroll.rhDesktop', this.scrollcheck.bind(this));
    },
    destroy: function() {
        this.el.hide();
        jQuery(window).off('.rhDesktop');
        jQuery(document).off('.rhDesktop');
    },
    scrollcheck: function() {
        if(jQuery(document).scrollTop() > this.scrollBreakpoint) {
            if(!this.isScrolled) this.setScrolledState();
        } else {
            if(this.isScrolled) this.removeScrolledState();
        }
    },
    setScrolledState: function() {
        this.el.addClass('isScrolled');
        this.isScrolled = true;
    },
    removeScrolledState: function() {
        this.el.removeClass('isScrolled');
        this.isScrolled = false;
    }
};

components.responsiveHeader.mobile = function(el) {
    this.el = jQuery(el);
    this.menu = this.el.find('[data-rh-mobile="menu"]');
    this.trigger = this.el.find('[data-rh-mobile="trigger"]');
};
components.responsiveHeader.mobile.prototype = {
    init: function() {
        this.el.show();
        this.isOpen = false;
        this.el.css('opacity', 0);
        this.menu.css('height', '');
        this.originalHeight = this.menu.height();
        this.menu.css('height', 0);
        this.el.css('opacity', 1);
        this.trigger.on('click.rhMobile', this.toggle.bind(this));
    },
    toggle: function() {
        if(this.isOpen) {
            this.close();
        } else {
            this.open();
        }
    },
    destroy: function() {
        this.el.hide();
        this.trigger.off('.rhMobile');
    },
    open: function() {
        this.menu.css('height', this.originalHeight);
        this.trigger.addClass('menuOpen');
        this.isOpen = true;
    },
    close: function() {
        this.menu.css('height', 0);
        this.trigger.removeClass('menuOpen');
        this.isOpen = false;
    }
};
