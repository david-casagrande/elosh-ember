import Ember from 'ember';
import RedirectToFirstItem from '../../mixins/routes/redirect-to-first-item';

export default Ember.Route.extend(
  RedirectToFirstItem, {

  appModelName: 'books',
  appModelRoute: 'books.show'

});
