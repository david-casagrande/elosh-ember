import Ember from 'ember';

export default Ember.Controller.extend({
  modalOpen: false,

  themeDirectory: Ember.computed({
    get() {
      return window.ELOSH_THEME_DIRECTORY;
    }
  }),

  logoURL: Ember.computed('themeDirectory', {
    get() {
      return this.get('themeDirectory') + '/assets/dist/images/elosh-logo.jpg';
    }
  }),

  footerLogoURL: Ember.computed('themeDirectory', {
    get() {
      return this.get('themeDirectory') + '/assets/dist/images/elosh-footer.jpg';
    }
  })
});
