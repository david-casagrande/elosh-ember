import Ember from 'ember';

export default Ember.Component.extend({

  classNames: ['section'],
  open: false,

  closedHeight: 20,
  openHeight: 0,

  attributeBindings: ['style'],

  style: function() {
    var sectionHeight = this.get('open') ? this.get('openHeight') : this.get('closedHeight');
    return 'height: ' + sectionHeight + 'px;';
  }.property('open', 'openHeight'),

  _setOpenHeight: function() {
    var height = this.$().find('.links').outerHeight();
    this.set('openHeight', height + this.get('closedHeight'));
  }.on('didInsertElement'),

  _currentPathChange: function() {
    var parentRoute = this.get('currentPath').split('.').objectAt(0),
        open = parentRoute === this.get('path');

    this.set('open', open);
  }.observes('currentPath').on('init')

});
