import DS from 'ember-data';

var a = DS.attr, b = DS.belongsTo;

export default DS.Model.extend({
  bookTitle:   a('string'),
  categories:  a(),
  description: a('string'),
  medium:      a('string'),
  slug:        a('string'),
  title:       a('string'),

  image:       b('imageObject', { async: true }),
  thumbnail:   b('imageObject', { async: true })
});
