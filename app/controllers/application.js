import Ember from 'ember';

export default Ember.ObjectController.extend({

  modalOpen: false,

  themeDirectory: function() {
    return window.ELOSH_THEME_DIRECTORY;
  }.property(),

  logoURL: function() {
    return this.get('themeDirectory') + '/assets/images/elosh-logo.jpg';
  }.property('themeDirectory'),

  footerLogoURL: function() {
    return this.get('themeDirectory') + '/assets/images/elosh-footer.jpg';
  }.property('themeDirectory')

});
