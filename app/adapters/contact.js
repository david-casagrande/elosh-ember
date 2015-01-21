import ApplicationAdapter from './application';

export default ApplicationAdapter.extend({

  buildURL: function(type, id){
    var url = this._super(type, id) + '?action=get_contact';
    return url;
  }

});
