import Ember from 'ember';

export default Ember.Mixin.create({
  keyboardNavigationBindingId: null,

  _setupKeyboardNavigation: Ember.on('didInsertElement', function() {
    this._setKeyboardNavigationBindingId();
    this._setKeyboardNavigationManagement();
  }),

  _setKeyboardNavigationBindingId: function() {
    var id = ['keyup', 'artModalComponent', this.get('elementId')];
    this.set('keyboardNavigationBindingId', id.join('.'));
  },

  _setKeyboardNavigationManagement: function() {
    var win = Ember.$(window);
    win.on(this.get('keyboardNavigationBindingId'), (e) => {
      this._parseKeyPress(e);
    });
  },

  _parseKeyPress: function(e) {
    var keyCode = e.keyCode;
    if(keyCode !== 37 && keyCode !== 39) { return; }
    var action = keyCode === 37 ? 'previousItem' : 'nextItem';
    this.send(action);
  },

  _teardownKeyboardNavigationManagement: Ember.on('willDestroyElement', function() {
    Ember.$(window).off(this.get('keyboardNavigationBindingId'));
  })
});
