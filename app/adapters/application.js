import ActiveModelAdapter from 'active-model-adapter';

export default ActiveModelAdapter.extend({
  buildURL: function() {
    return '/wp-admin/admin-ajax.php';
  }
});
