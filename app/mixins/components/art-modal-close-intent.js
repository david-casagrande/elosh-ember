import Ember from 'ember';

export default Ember.Mixin.create({

  closeIntentBindingId: null,

  _setupCloseIntent: function() {
    this._setCloseIntentBindingId();
    this._setCloseIntent();
  }.on('didInsertElement'),

  _setCloseIntentBindingId: function() {
    var id = ['click', 'artModalComponent', this.get('elementId')];
    this.set('closeIntentBindingId', id.join('.'));
  },

  _setCloseIntent: function() {
    var win = Ember.$(window);
    win.on(this.get('closeIntentBindingId'), (e) => {
      this._parseClickEvent(e);
    });
  },

  _parseClickEvent: function(e) {
    var target = Ember.$(e.target),
        parents = target.parents('#modal .margin');

    if(parents.length < 1 && this.get('imageLoaded')) {
      this.send('closeModal');
    }
  },

  _teardownCloseIntent: function() {
    Ember.$(window).off(this.get('closeIntentBindingId'));
  }.on('willDestroyElement')

});
