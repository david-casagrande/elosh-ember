import Ember from 'ember';

export default Ember.Route.extend({

  model: function() {
    var store = this.get('store');
    return Ember.RSVP.hash({
      books:             store.find('book', { 'action': 'get_books' }),
      artworkCategories: store.find('artworkCategory', { 'action': 'get_artwork_categories' }),
      contact:           store.find('contact', 1),
      about:             store.find('about', 1)
    });
  },

  afterModel: function() {
    return new Ember.RSVP.Promise(function(resolve) {
      Ember.run.later(() => {
        Ember.$('#elosh-stub').remove();
        resolve();
      }, 5000);
    });
  },

  actions: {
    openModal: function(opts) {
      this._renderModal(opts);
    },
    closeModal: function() {
      this._disconnectModal();
    },
    willTransition: function() {
      this._disconnectModal();
      return true;
    }
  },

  _renderModal: function(opts) {
    var template = opts.template,
    data = {
      into:   'application',
      outlet: 'modal'
    };

    if(opts.controller) {
      data.controller = opts.controller;
    }
    this.render(template, data);
    this.get('controller').set('modalOpen', true);
  },

  _disconnectModal: function() {
    this.get('controller').set('modalOpen', false);
    this.disconnectOutlet({ outlet: 'modal', parentView: 'application' });
  }

});
