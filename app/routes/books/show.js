import Ember from 'ember';

export default Ember.Route.extend({

  actions: {
    closeModal: function() {
      var slug = this.get('controller.model.slug');
      this.transitionTo('books.show', slug);
      return true;
    },
    nextItem: function(bookPage) {
      this._transitionToBookPage(bookPage);
    },
    previousItem: function(bookPage) {
      this._transitionToBookPage(bookPage, true);
    },
    linkToArtModal: function(bookPage) {
      this.transitionTo('books.show.bookPage', bookPage.get('slug'));
    }
  },

  model: function(params) {
    var books = this.store.all('book'),
        book = books.findBy('slug', params.book_slug);

    return book ? book : {};
  },

  _transitionToBookPage: function(bookPage, previous = false) {
    var bookPages = this.get('controller.model.bookPages'),
        bookIndex, nextBookIndex;

    bookPages.find(function(page, idx) {
      var found = page.get('id') === bookPage.get('id');
      if(found) { bookIndex = idx; }
      return found;
    });

    if(previous) {
      nextBookIndex = bookIndex !== 0 ? (bookIndex - 1) : bookPages.get('length') - 1;
    }
    else {
      nextBookIndex = bookIndex < (bookPages.get('length') - 1) ? (bookIndex + 1) : 0;
    }

    this.transitionTo('books.show.bookPage', bookPages.objectAt(nextBookIndex).get('slug'));
  }

});
