import Ember from 'ember';
import NextArtwork from '../../../mixins/routes/next-artwork';
import ImageDataStore from '../../../stores/image-data';

export default Ember.Route.extend(NextArtwork, {
  model: function(params) {
    var artwork = this.store.peekAll('artwork'),
        art = artwork.findBy('slug', params.book_page);

    return art ? art : {};
  },

  afterModel: function(model) {
    var controller = this.controllerFor('books.show');
    if(!controller) { return; }

    var _model = controller.get('model.bookPages');
    if(!_model) { return; }

    _model
      .then((bookPages) => {
        if(!bookPages) { return; }
        var nextArtIndex = this._nextArtwork(model, bookPages);
        var nextArt = bookPages.objectAt(nextArtIndex);

        nextArt.get('image').then((img) => ImageDataStore.get(img.get('url')));
      });
  },

  renderTemplate: function(controller) {
    this.send('openModal', { template: 'books.show.bookPage', controller: controller });
  }
});
