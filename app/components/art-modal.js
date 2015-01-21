import Ember from 'ember';
import HeightManagement from '../mixins/components/art-modal-height-management';
import LoadingManagement from '../mixins/components/art-modal-loading-management';
import KeyboardNavigation from '../mixins/components/art-modal-keyboard-navigation';
import CloseIntent from '../mixins/components/art-modal-close-intent';

export default Ember.Component.extend(
  HeightManagement,
  LoadingManagement,
  KeyboardNavigation,
  CloseIntent, {

  classNames: ['art-modal'],

  actions: {
    closeModal: function() {
      this.sendAction('closeModal');
    },
    nextItem: function() {
      this.sendAction('nextItem', this.get('art'));
    },
    previousItem: function() {
      this.sendAction('previousItem', this.get('art'));
    }
  },

  _parseKeyPress: function(e) {
    if(!this.get('imageLoaded')) { return; }
    this._super(e);
  },

});
