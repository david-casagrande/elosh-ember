import Ember from 'ember';

export default Ember.Route.extend({

  model: function(params) {
    var artwork = this.store.peekAll('artwork'),
        art = artwork.findBy('slug', params.book_page);

    return art ? art : {};
  },

  renderTemplate: function(controller) {
    this.send('openModal', { template: 'books.show.bookPage', controller: controller });
  }

});
