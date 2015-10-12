import DS from 'ember-data';

var a = DS.attr;

export default DS.Model.extend({
  contactNarrative: a('string'),
  email:            a('string'),
  phone:            a('string'),
  twitter:          a('string'),
  storeLink:        a('string'),

  mailTo: Ember.computed('email', {
    get() {
      return this.get('email') ? 'mailto:'+this.get('email') : null;
    }
  }),

  twitterLink: Ember.computed('twitter', {
    get() {
      return this.get('twitter') ? 'https://twitter.com/'+this.get('twitter') : null;
    }
  })
});
