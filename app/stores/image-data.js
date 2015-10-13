import Ember from 'ember';

const ImageDataStore = {};

function get(url, progressCallback) {
  if(typeof ImageDataStore[url] !== 'undefined') {
    if(progressCallback) { progressCallback(1); }
    return new Ember.RSVP.Promise((resolve) => resolve(ImageDataStore[url]));
  }

  return request(url, progressCallback)
    .then((response) => readFile(response))
    .then((dataUrl) => cacheFile(url, dataUrl));
}

function request(url, progressCallback) {
  return new Ember.RSVP.Promise((resolve) => {
    var oReq = new XMLHttpRequest();

    oReq.onload = function(response) {
      resolve(this.response);
    };

    if(progressCallback) {
      oReq.onprogress = function(e) {
        var p = parseFloat(e.loaded / e.total).toFixed(2);
        progressCallback(p);
      };
    }

    oReq.open('get', url, true);
    oReq.responseType = 'blob';
    oReq.send();
  });
}

function readFile(blob) {
  return new Ember.RSVP.Promise((resolve) => {
    var reader  = new FileReader();
    reader.onloadend = function () {
      resolve(reader.result);
    };
    reader.readAsDataURL(blob);
  });
}

function cacheFile(url, dataUrl) {
  ImageDataStore[url] = dataUrl;
  return ImageDataStore[url];
}

export default {
  get: get
};
