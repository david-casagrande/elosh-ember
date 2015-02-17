/* global ProgressBar */

import Ember from 'ember';

var ImageDataStore = {};

export default Ember.Mixin.create({

  imageLoaded: false,
  imageDataUrl: null,

  progressLoaderDuration: 400,

  _setup: function() {
    this.set('progress', this._createProgressBar());
    this._loadImage();
  }.on('didInsertElement'),

  _teardown: function() {
    this.get('progress').destroy();
  }.on('willDestroyElement'),

  _createProgressBar: function() {
    return new ProgressBar.Circle('#progress-circle', {
      color: '#ccc',
      strokeWidth: 8,
      fill: '#fff',
      duration: this.get('progressLoaderDuration')
    });
  },

  _loadImage: function() {
    var artUrl = this.get('art.image.url');
    if(typeof ImageDataStore[artUrl] !== 'undefined') {
      this._setImageData(ImageDataStore[artUrl]);
      this.get('progress').animate(1);
    }
    else {
      var self = this;
      var oReq = new XMLHttpRequest();
      oReq.onload = function() {
        self._readFile(this.response);
      };
      oReq.onprogress = function(e) {
        var p = parseFloat(e.loaded / e.total).toFixed(2),
            progress = self.get('progress');

        progress.stop();
        progress.animate(p);
      };
      oReq.open('get', this.get('art.image.url'), true);
      oReq.responseType = 'blob';
      oReq.send();
    }
  },

  _readFile: function(blob) {
    var self = this;
    var reader  = new FileReader();
    reader.onloadend = function () {
      self._setImageData(reader.result);
    };
    reader.readAsDataURL(blob);
  },

  _setImageData: function(dataUrl) {
    this.set('imageDataUrl', dataUrl);
    this._setImageLoaded();
    this._cacheImageData(dataUrl);
  },

  _cacheImageData: function(dataUrl) {
    var artUrl = this.get('art.image.url');
    if(typeof ImageDataStore[artUrl] !== 'undefined') { return; }
    ImageDataStore[artUrl] = dataUrl;
  },

  _setImageLoaded: function() {
    Ember.run.later(this, function() {
      this.set('imageLoaded', true);
    }, this.get('progressLoaderDuration'));
  }

});
