import Ember from 'ember';

export default Ember.Mixin.create({

  beforeModel: function() {
    Ember.$('#app-window').scrollTop(0);
    this._super();
  }

});
