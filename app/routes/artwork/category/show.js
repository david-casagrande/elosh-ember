import Ember from 'ember';

export default Ember.Route.extend({

  model: function(params) {
    var artwork = this.store.all('artwork'),
        art = artwork.findBy('slug', params.artwork_slug);

    return art ? art : {};
  },

  renderTemplate: function(controller) {
    this.send('openModal', { template: 'artwork.category.show', controller: controller });
  }

});
