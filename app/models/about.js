import DS from 'ember-data';

var a = DS.attr, b = DS.belongsTo;

export default DS.Model.extend({
  image:        b('imageObject'),
  narrativeOne: a('string'),
  narrativeTwo: a('string')
});
