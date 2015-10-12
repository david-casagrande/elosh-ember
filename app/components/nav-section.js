import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['section'],
  open: false,

  closedHeight: 20,

  _update: Ember.on('didReceiveAttrs', function() {
    Ember.run.schedule('afterRender', () => this._setHeight());
  }),

  _setHeight: function() {
    var height = this.get('closedHeight');
    var open = this._checkIfOpen();

    if(open) {
      height = this.$().find('.links').outerHeight() + this.get('closedHeight');
    }

    this.$().css({ height: height });
  },

  _checkIfOpen: function() {
    var parentRoute = this.get('currentPath').split('.').objectAt(0);
    return parentRoute === this.get('path');
  }
});
