import Ember from 'ember';
import NextArtwork from '../../../mixins/routes/next-artwork';
import ImageDataStore from '../../../stores/image-data';

export default Ember.Route.extend(NextArtwork, {
  model: function(params) {
    var artwork = this.store.peekAll('artwork'),
        art = artwork.findBy('slug', params.artwork_slug);

    return art ? art : {};
  },

  afterModel: function(model) {
    var allArtwork = this.controllerFor('artwork.category').get('model.artwork');
    var nextArtIndex = this._nextArtwork(model, allArtwork);

    var nextArt = allArtwork.objectAt(nextArtIndex);
    nextArt.get('image').then((img) => ImageDataStore.get(img.get('url')));
  },

  renderTemplate: function(controller) {
    this.send('openModal', { template: 'artwork.category.show', controller: controller });
  }
});
