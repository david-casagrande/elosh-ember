import Ember from 'ember';

export default Ember.Component.extend({

  attributeBindings: ['style'],

  style: function() {
    var width = this.get('width') ? this.get('width') : 0;
    return 'max-width: ' + width + 'px;';
  }.property('width')

});
