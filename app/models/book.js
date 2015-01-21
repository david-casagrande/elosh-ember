import DS from 'ember-data';

var a = DS.attr, b = DS.belongsTo, h = DS.hasMany;

export default DS.Model.extend({
  title:       a('string'),
  titleNotes:  a('string'),
  bannerImage: b('imageObject'),
  coverImage:  b('imageObject'),
  narrative:   a('string'),
  slug:        a('string'),
  bookPages:   h('artwork')
});
