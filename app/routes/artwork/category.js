import Ember from 'ember';

export default Ember.Route.extend({

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
        artworkCategories = this.store.all('artworkCategory'),
        category = artworkCategories.findBy('slug', params.category_slug);

    artwork = artwork.filter(function(artwork) {
      var categories = artwork.get('categories');
      return categories.contains(params.category_slug);
    });

    return Ember.Object.create({ artwork: artwork, category: category });
  },

  _transitionToArt: function(art, previous = false) {
    var allArtwork = this.get('controller.model.artwork'),
        artIndex, nextArtIndex;

    allArtwork.find(function(artwork, idx) {
      var found = artwork.get('id') === art.get('id');
      if(found) { artIndex = idx; }
      return found;
    });

    if(previous) {
      nextArtIndex = artIndex !== 0 ? (artIndex - 1) : allArtwork.get('length') - 1;
    }
    else {
      nextArtIndex = artIndex < (allArtwork.get('length') - 1) ? (artIndex + 1) : 0;
    }

    this.transitionTo('artwork.category.show', allArtwork.objectAt(nextArtIndex).get('slug'));
  }

});
