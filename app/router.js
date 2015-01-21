import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {

  this.resource('artwork', function() {
    this.route('category', { path: ':category_slug' }, function() {
      this.route('show', { path: ':artwork_slug' });
    });
  });

  this.resource('books', function() {
    this.route('show', { path: ':book_slug' }, function() {
      this.route('bookPage', { path: ':book_page' });
    });
  });

  this.route('about');

});

export default Router;
