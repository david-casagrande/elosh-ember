import Ember from 'ember';

export default Ember.Mixin.create({

  artModalBindingId: null,

  setupHeightManagement: function() {
    this._setArtModalBindingId();
    this._setArtModalManagement();
  }.on('didInsertElement'),

  _setArtModalBindingId: function() {
    var id = ['resize', 'artModalComponent', this.get('elementId')];
    this.set('artModalBindingId', id.join('.'));
  },

  _setArtModalManagement: function() {
    var win = Ember.$(window);
    this._setHeight(win);
    win.on(this.get('artModalBindingId'), () => {
      this._setHeight(win);
    });
  },

  _setHeight: function(win) {
    var marginTotal   = 80, //80 for outside margin
        modalPadding  = 40,
        windowHeight  = win.outerHeight(),
        detailsHeight = this.$().find('.artwork-details').outerHeight();

    var modalHeight = windowHeight - marginTotal - modalPadding - detailsHeight;

    this.$().css({ height: windowHeight - marginTotal });
    this.$().find('.art-modal-image').css({
      height: modalHeight,
      'line-height' : modalHeight+'px'
    });
  },

  teardownHeightManagement: function() {
    Ember.$(window).off(this.get('artModalBindingId'));
  }.on('willDestroyElement')

});
