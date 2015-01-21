import DS from 'ember-data';

var a = DS.attr;

export default DS.Model.extend({
  name:                a('string'),
  categoryDescription: a('string'),
  slug:                a('string')
});
