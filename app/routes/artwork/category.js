import Ember from 'ember';
import ScrollToTop from '../../mixins/routes/scroll-to-top';
import NextArtwork from '../../mixins/routes/next-artwork';

export default Ember.Route.extend(ScrollToTop, NextArtwork, {

  actions: {
    closeModal: function() {
      var slug = this.get('controller.model.category.slug');
      this.transitionTo('artwork.category', slug);
      return true;
    },
    nextItem: function(art) {
      this._transitionToArt(art);
    },
    previousItem: function(art) {
      this._transitionToArt(art, true);
    },
    linkToArtModal: function(art) {
      this.transitionTo('artwork.category.show', art.get('slug'));
    }
  },

  model: function(params) {
    var artwork = this.modelFor('artwork'),
        artworkCategories = this.store.peekAll('artworkCategory'),
        category = artworkCategories.findBy('slug', params.category_slug);

    artwork = artwork.filter(function(artwork) {
      var categories = artwork.get('categories');
      return categories.contains(params.category_slug);
    });

    return Ember.Object.create({ artwork: artwork, category: category });
  },

  _transitionToArt: function(art, previous = false) {
    var allArtwork = this.get('controller.model.artwork');
    var nextArtIndex = this._nextArtwork(art, allArtwork, previous);

    this.transitionTo('artwork.category.show', allArtwork.objectAt(nextArtIndex).get('slug'));
  }
});
