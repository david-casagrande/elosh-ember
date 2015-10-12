import DS from 'ember-data';

var a = DS.attr;

export default DS.Model.extend({
  contactNarrative: a('string'),
  email:            a('string'),
  phone:            a('string'),
  twitter:          a('string'),
  storeLink:        a('string'),

  mailTo: Ember.computed('email', function() {
    return this.get('email') ? 'mailto:'+this.get('email') : null;
  }),

  // mailTo: function(){
  //   return this.get('email') ? 'mailto:'+this.get('email') : null;
  // }.property('email'),

  twitterLink: function(){
    return this.get('twitter') ? 'https://twitter.com/'+this.get('twitter') : null;
  }.property('twitter')

});
