import Ember from 'ember';

export default Ember.Controller.extend({

  modalOpen: false,

  themeDirectory: function() {
    return window.ELOSH_THEME_DIRECTORY;
  }.property(),

  logoURL: function() {
    return this.get('themeDirectory') + '/assets/dist/images/elosh-logo.jpg';
  }.property('themeDirectory'),

  footerLogoURL: function() {
    return this.get('themeDirectory') + '/assets/dist/images/elosh-footer.jpg';
  }.property('themeDirectory')

});
