import Ember from 'ember';

export default Ember.Mixin.create({
  _nextArtwork: function(art, allArtwork, previous = false) {
    var artIndex, nextArtIndex;

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

    return nextArtIndex;
  }
});
