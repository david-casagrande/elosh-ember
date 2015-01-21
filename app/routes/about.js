import Ember from 'ember';

export default Ember.Route.extend({

  model: function() {
    return Ember.RSVP.hash({
      about: this.modelFor('application').about,
      contact: this.modelFor('application').contact
    });
    //return this.get('store').find('about', 1);
  },

  setupController: function(controller, model) {
    //this._super(controller, model);

    controller.setProperties({
      model: model.about,
      contact: model.contact
    });
    // var contactModel = this.modelFor('application').contact;
    // controller.set('contact', contactModel);
  }

});
