import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['section'],
  open: false,

  closedHeight: 20,

  _setHeight: function() {
    if(!this.$()) { return; }

    var height = this.get('closedHeight');
    if(this.get('open')) {
      height = this.$().find('.links').outerHeight() + this.get('closedHeight');
    }

    this.$().css({ height: height });
  },

  _setOpenHeight: Ember.on('didInsertElement', function() {
    this._setHeight();
  }),

  _openObserver: Ember.observer('open', function() {
    this._setHeight();
  }),

  _currentPathChange: Ember.observer('currentPath', function() {
    var parentRoute = this.get('currentPath').split('.').objectAt(0),
        open = parentRoute === this.get('path');

    this.set('open', open);
  })
});
