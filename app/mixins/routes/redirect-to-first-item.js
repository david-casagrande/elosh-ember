import Ember from 'ember';

export default Ember.Mixin.create({

  appModelName: null,
  appModelRoute: null,

  redirect: function() {
    var appModels = this.modelFor('application'),
        models = appModels[this.get('appModelName')],
        firstModel = models ? models.get('firstObject') : null,
        slug = firstModel ? firstModel.get('slug') : null;

    if(slug) {
      var route = this.get('appModelRoute');
      this.transitionTo(route, slug);
    }
  }

});
