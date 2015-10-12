import Ember from 'ember';

export default Ember.Component.extend({

  attributeBindings: ['style'],

  style: Ember.computed('width', {
    get() {
      var width = this.get('width') ? this.get('width') : 0;
      return new Ember.Handlebars.SafeString('max-width: ' + width + 'px;');
      // return 'max-width: ' + width + 'px;';
    }
  })
});
