import ApplicationSerializer from './application';

export default ApplicationSerializer.extend({

  normalizePayload: function(payload) {
    payload.artwork_categories.forEach(function(category) {
      category.id = category.term_id;
    });
    return payload;
  }

});
