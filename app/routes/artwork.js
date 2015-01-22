import Ember from 'ember';

export default Ember.Route.extend({

  _loadedArtwork: null,

  model: function() {
    return this.modelFor('application').artwork;
    // if(!this.get('_loadedArtwork')) {
    //   var artwork = this.get('store').find('artwork', { 'action': 'get_artwork' });
    //   this.set('_loadedArtwork', artwork);
    // }
    // return this.get('_loadedArtwork');
  }

});
