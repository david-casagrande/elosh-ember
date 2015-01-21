import Ember from 'ember';

export default Ember.Mixin.create({

  imageLoaded: false,

  _trackImageLoading: function() {
    var img = new Image();

    img.src = this.get('art.image.url');
    img.onload = () => {
      //setTimeout(() => {
        this.set('imageLoaded', true);
      //}, 10000);
    };
  }.on('init')

});
