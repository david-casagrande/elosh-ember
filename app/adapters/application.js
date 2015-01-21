import DS from 'ember-data';

export default DS.ActiveModelAdapter.extend({

  buildURL: function(){
    return '/wp-admin/admin-ajax.php';
  }

});
