import Ember from 'ember';

export default Ember.Mixin.create({

  beforeModel: function() {
    $('#app-window').scrollTop(0);
    this._super();
  }

});
