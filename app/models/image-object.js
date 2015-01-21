import DS from 'ember-data';

var a = DS.attr;

export default DS.Model.extend({
  url:    a('string'),
  height: a('number'),
  width:  a('number')
});
