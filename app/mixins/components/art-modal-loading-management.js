/* global ProgressBar */

import Ember from 'ember';
import ImageDataStore from '../../stores/image-data';

export default Ember.Mixin.create({

  imageLoaded: false,
  imageDataUrl: null,
  hideOverlay: false,
  timers: [],

  progressLoaderDuration: 400,

  _setup: Ember.on('didReceiveAttrs', function() {
    this.get('timers').forEach((timer) => Ember.run.cancel(timer));

    this.setProperties({
      imageLoaded: false,
      imageDataUrl: null,
      hideOverlay: false,
      timers: []
    });

    Ember.run.schedule('afterRender', () => {
      if(this.get('progress')) { this.get('progress').destroy(); }
      this.set('progress', this._createProgressBar());
      this._loadImage();
    });
  }),

  _teardown: Ember.on('willDestroyElement', function() {
    this.get('progress').destroy();
  }),

  _createProgressBar: function() {
    return new ProgressBar.Circle('#progress-circle', {
      color: '#ccc',
      strokeWidth: 8,
      fill: '#fff',
      duration: this.get('progressLoaderDuration')
    });
  },

  _loadImage: function() {
    var url = this.get('art.image.url');
    ImageDataStore.get(url, (p) => this._setProgress(p)).then((dataUrl) => this._setImageData(dataUrl));
  },

  _setProgress: function(p) {
    var progress = this.get('progress');
    progress.stop();
    progress.animate(p);
  },

  _setImageData: function(dataUrl) {
    this.set('imageDataUrl', dataUrl);
    this._setImageLoaded();
  },

  _setImageLoaded: function() {
    var timer = Ember.run.later(this, function() {
      this.set('imageLoaded', true);
      this._hideLoadingOverlay();
    }, this.get('progressLoaderDuration'));

    this.get('timers').addObject(timer);
  },

  _hideLoadingOverlay: function() {
    var timer = Ember.run.later(this, function() {
      if(this.get('isDestroyed') || this.get('isDestroying')) { return; }
      this.set('hideOverlay', true);
    }, 2000); // 2s via .loaded class fades out overlay time

    this.get('timers').addObject(timer);
  }
});
