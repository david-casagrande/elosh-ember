import ApplicationSerializer from './application';

export default ApplicationSerializer.extend({
  normalizeResponse: function(store, primaryModelClass, payload, id, requestType) {
    payload.artwork_categories.forEach(function(category) {
      category.id = category.term_id;
    });
    return this._super(store, primaryModelClass, payload, id, requestType);
  }
});
