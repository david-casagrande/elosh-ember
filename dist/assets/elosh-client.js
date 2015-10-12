/* jshint ignore:start */

/* jshint ignore:end */

define('elosh-client/adapters/about', ['exports', 'elosh-client/adapters/application'], function (exports, ApplicationAdapter) {

  'use strict';

  exports['default'] = ApplicationAdapter['default'].extend({

    buildURL: function buildURL(type, id) {
      var url = this._super(type, id) + '?action=get_about';
      return url;
    }

  });

});
define('elosh-client/adapters/application', ['exports', 'ember-data'], function (exports, DS) {

  'use strict';

  exports['default'] = DS['default'].ActiveModelAdapter.extend({

    buildURL: function buildURL() {
      return '/wp-admin/admin-ajax.php';
    }

  });

});
define('elosh-client/adapters/contact', ['exports', 'elosh-client/adapters/application'], function (exports, ApplicationAdapter) {

  'use strict';

  exports['default'] = ApplicationAdapter['default'].extend({

    buildURL: function buildURL(type, id) {
      var url = this._super(type, id) + '?action=get_contact';
      return url;
    }

  });

});
define('elosh-client/app', ['exports', 'ember', 'ember/resolver', 'elosh-client/config/environment'], function (exports, Ember, Resolver, config) {

  'use strict';

  var App;

  Ember['default'].MODEL_FACTORY_INJECTIONS = true;

  App = Ember['default'].Application.extend({
    modulePrefix: config['default'].modulePrefix,
    Resolver: Resolver['default']
  });

  exports['default'] = App;

});
define('elosh-client/components/art-modal', ['exports', 'ember', 'elosh-client/mixins/components/art-modal-height-management', 'elosh-client/mixins/components/art-modal-loading-management', 'elosh-client/mixins/components/art-modal-keyboard-navigation', 'elosh-client/mixins/components/art-modal-close-intent'], function (exports, Ember, HeightManagement, LoadingManagement, KeyboardNavigation, CloseIntent) {

  'use strict';

  exports['default'] = Ember['default'].Component.extend(HeightManagement['default'], LoadingManagement['default'], KeyboardNavigation['default'], CloseIntent['default'], {

    classNames: ['art-modal'],

    actions: {
      closeModal: function closeModal() {
        this.sendAction('closeModal');
      },
      nextItem: function nextItem() {
        this.sendAction('nextItem', this.get('art'));
      },
      previousItem: function previousItem() {
        this.sendAction('previousItem', this.get('art'));
      }
    },

    _parseKeyPress: function _parseKeyPress(e) {
      if (!this.get('imageLoaded')) {
        return;
      }
      this._super(e);
    }

  });

});
define('elosh-client/components/max-width', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Component.extend({

    attributeBindings: ['style'],

    style: Ember['default'].computed('width', {
      get: function get() {
        var width = this.get('width') ? this.get('width') : 0;
        return new Ember['default'].Handlebars.SafeString('max-width: ' + width + 'px;');
      }
    })
  });

});
define('elosh-client/components/nav-section', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Component.extend({

    classNames: ['section'],
    open: false,

    closedHeight: 20,
    openHeight: 0,

    attributeBindings: ['style'],

    style: Ember['default'].computed('open', 'openHeight', {
      get: function get() {
        var sectionHeight = this.get('open') ? this.get('openHeight') : this.get('closedHeight');
        return new Ember['default'].Handlebars.SafeString('height: ' + sectionHeight + 'px;');
      }
    }),

    _setOpenHeight: (function () {
      var height = this.$().find('.links').outerHeight();
      this.set('openHeight', height + this.get('closedHeight'));
    }).on('didInsertElement'),

    // _currentPathChange: Ember.observer(function() {
    //
    // }

    _currentPathChange: (function () {
      var parentRoute = this.get('currentPath').split('.').objectAt(0),
          open = parentRoute === this.get('path');

      this.set('open', open);
    }).observes('currentPath').on('init')

  });

});
define('elosh-client/controllers/application', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Controller.extend({
    modalOpen: false,

    themeDirectory: Ember['default'].computed({
      get: function get() {
        return window.ELOSH_THEME_DIRECTORY;
      }
    }),

    logoURL: Ember['default'].computed('themeDirectory', {
      get: function get() {
        return this.get('themeDirectory') + '/assets/dist/images/elosh-logo.jpg';
      }
    }),

    footerLogoURL: Ember['default'].computed('themeDirectory', {
      get: function get() {
        return this.get('themeDirectory') + '/assets/dist/images/elosh-footer.jpg';
      }
    })
  });

});
define('elosh-client/initializers/app-version', ['exports', 'elosh-client/config/environment', 'ember'], function (exports, config, Ember) {

  'use strict';

  var classify = Ember['default'].String.classify;
  var registered = false;

  exports['default'] = {
    name: 'App Version',
    initialize: function initialize(container, application) {
      if (!registered) {
        var appName = classify(application.toString());
        Ember['default'].libraries.register(appName, config['default'].APP.version);
        registered = true;
      }
    }
  };

});
define('elosh-client/initializers/export-application-global', ['exports', 'ember', 'elosh-client/config/environment'], function (exports, Ember, config) {

  'use strict';

  exports.initialize = initialize;

  function initialize() {
    var application = arguments[1] || arguments[0];
    if (config['default'].exportApplicationGlobal !== false) {
      var value = config['default'].exportApplicationGlobal;
      var globalName;

      if (typeof value === 'string') {
        globalName = value;
      } else {
        globalName = Ember['default'].String.classify(config['default'].modulePrefix);
      }

      if (!window[globalName]) {
        window[globalName] = application;

        application.reopen({
          willDestroy: function willDestroy() {
            this._super.apply(this, arguments);
            delete window[globalName];
          }
        });
      }
    }
  }

  exports['default'] = {
    name: 'export-application-global',

    initialize: initialize
  };

});
define('elosh-client/mixins/components/art-modal-close-intent', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Mixin.create({

    closeIntentBindingId: null,

    _setupCloseIntent: (function () {
      this._setCloseIntentBindingId();
      this._setCloseIntent();
    }).on('didInsertElement'),

    _setCloseIntentBindingId: function _setCloseIntentBindingId() {
      var id = ['click', 'artModalComponent', this.get('elementId')];
      this.set('closeIntentBindingId', id.join('.'));
    },

    _setCloseIntent: function _setCloseIntent() {
      var _this = this;

      var win = Ember['default'].$(window);
      win.on(this.get('closeIntentBindingId'), function (e) {
        _this._parseClickEvent(e);
      });
    },

    _parseClickEvent: function _parseClickEvent(e) {
      var target = Ember['default'].$(e.target),
          parents = target.parents('#modal .margin');

      if (parents.length < 1 && this.get('imageLoaded')) {
        this.send('closeModal');
      }
    },

    _teardownCloseIntent: (function () {
      Ember['default'].$(window).off(this.get('closeIntentBindingId'));
    }).on('willDestroyElement')

  });

});
define('elosh-client/mixins/components/art-modal-height-management', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Mixin.create({

    artModalBindingId: null,

    setupHeightManagement: (function () {
      this._setArtModalBindingId();
      this._setArtModalManagement();
    }).on('didInsertElement'),

    _setArtModalBindingId: function _setArtModalBindingId() {
      var id = ['resize', 'artModalComponent', this.get('elementId')];
      this.set('artModalBindingId', id.join('.'));
    },

    _setArtModalManagement: function _setArtModalManagement() {
      var _this = this;

      var win = Ember['default'].$(window);
      this._setHeight(win);
      win.on(this.get('artModalBindingId'), function () {
        _this._setHeight(win);
      });
    },

    _setHeight: function _setHeight(win) {
      var marginTotal = 80,
          //80 for outside margin
      modalPadding = 40,
          windowHeight = win.outerHeight(),
          detailsHeight = this.$().find('.artwork-details').outerHeight();

      var modalHeight = windowHeight - marginTotal - modalPadding - detailsHeight;

      this.$().css({ height: windowHeight - marginTotal });
      this.$().find('.art-modal-image').css({
        height: modalHeight,
        'line-height': modalHeight + 'px'
      });
    },

    teardownHeightManagement: (function () {
      Ember['default'].$(window).off(this.get('artModalBindingId'));
    }).on('willDestroyElement')

  });

});
define('elosh-client/mixins/components/art-modal-keyboard-navigation', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Mixin.create({

    keyboardNavigationBindingId: null,

    _setupKeyboardNavigation: (function () {
      this._setKeyboardNavigationBindingId();
      this._setKeyboardNavigationManagement();
    }).on('didInsertElement'),

    _setKeyboardNavigationBindingId: function _setKeyboardNavigationBindingId() {
      var id = ['keyup', 'artModalComponent', this.get('elementId')];
      this.set('keyboardNavigationBindingId', id.join('.'));
    },

    _setKeyboardNavigationManagement: function _setKeyboardNavigationManagement() {
      var _this = this;

      var win = Ember['default'].$(window);
      win.on(this.get('keyboardNavigationBindingId'), function (e) {
        _this._parseKeyPress(e);
      });
    },

    _parseKeyPress: function _parseKeyPress(e) {
      var keyCode = e.keyCode;
      if (keyCode !== 37 && keyCode !== 39) {
        return;
      }
      var action = keyCode === 37 ? 'previousItem' : 'nextItem';
      this.send(action);
    },

    _teardownKeyboardNavigationManagement: (function () {
      Ember['default'].$(window).off(this.get('keyboardNavigationBindingId'));
    }).on('willDestroyElement')

  });

});
define('elosh-client/mixins/components/art-modal-loading-management', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  /* global ProgressBar */

  var ImageDataStore = {};

  exports['default'] = Ember['default'].Mixin.create({

    imageLoaded: false,
    imageDataUrl: null,
    hideOverlay: false,

    progressLoaderDuration: 400,

    _setup: (function () {
      this.set('progress', this._createProgressBar());
      this._loadImage();
    }).on('didInsertElement'),

    _teardown: (function () {
      this.get('progress').destroy();
    }).on('willDestroyElement'),

    _createProgressBar: function _createProgressBar() {
      return new ProgressBar.Circle('#progress-circle', {
        color: '#ccc',
        strokeWidth: 8,
        fill: '#fff',
        duration: this.get('progressLoaderDuration')
      });
    },

    _loadImage: function _loadImage() {
      var artUrl = this.get('art.image.url');
      if (typeof ImageDataStore[artUrl] !== 'undefined') {
        this._setImageData(ImageDataStore[artUrl]);
        this.get('progress').animate(1);
      } else {
        var self = this;
        var oReq = new XMLHttpRequest();
        oReq.onload = function () {
          self._readFile(this.response);
        };
        oReq.onprogress = function (e) {
          var p = parseFloat(e.loaded / e.total).toFixed(2),
              progress = self.get('progress');

          progress.stop();
          progress.animate(p);
        };
        oReq.open('get', this.get('art.image.url'), true);
        oReq.responseType = 'blob';
        oReq.send();
      }
    },

    _readFile: function _readFile(blob) {
      var self = this;
      var reader = new FileReader();
      reader.onloadend = function () {
        self._setImageData(reader.result);
      };
      reader.readAsDataURL(blob);
    },

    _setImageData: function _setImageData(dataUrl) {
      this.set('imageDataUrl', dataUrl);
      this._setImageLoaded();
      this._cacheImageData(dataUrl);
    },

    _cacheImageData: function _cacheImageData(dataUrl) {
      var artUrl = this.get('art.image.url');
      if (typeof ImageDataStore[artUrl] !== 'undefined') {
        return;
      }
      ImageDataStore[artUrl] = dataUrl;
    },

    _setImageLoaded: function _setImageLoaded() {
      Ember['default'].run.later(this, function () {
        this.set('imageLoaded', true);
        this._hideLoadingOverlay();
      }, this.get('progressLoaderDuration'));
    },

    _hideLoadingOverlay: function _hideLoadingOverlay() {
      Ember['default'].run.later(this, function () {
        if (this.get('isDestroyed') || this.get('isDestroying')) {
          return;
        }
        this.set('hideOverlay', true);
      }, 2000); // 2s via .loaded class fades out overlay time
    }
  });

});
define('elosh-client/mixins/routes/redirect-to-first-item', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Mixin.create({

    appModelName: null,
    appModelRoute: null,

    redirect: function redirect() {
      var appModels = this.modelFor('application'),
          models = appModels[this.get('appModelName')],
          firstModel = models ? models.get('firstObject') : null,
          slug = firstModel ? firstModel.get('slug') : null;

      if (slug) {
        var route = this.get('appModelRoute');
        this.transitionTo(route, slug);
      }
    }

  });

});
define('elosh-client/mixins/routes/scroll-to-top', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Mixin.create({

    beforeModel: function beforeModel() {
      Ember['default'].$('#app-window').scrollTop(0);
      this._super();
    }

  });

});
define('elosh-client/models/about', ['exports', 'ember-data'], function (exports, DS) {

  'use strict';

  var a = DS['default'].attr,
      b = DS['default'].belongsTo;

  exports['default'] = DS['default'].Model.extend({
    image: b('imageObject'),
    narrativeOne: a('string'),
    narrativeTwo: a('string')
  });

});
define('elosh-client/models/artwork-category', ['exports', 'ember-data'], function (exports, DS) {

  'use strict';

  var a = DS['default'].attr;

  exports['default'] = DS['default'].Model.extend({
    name: a('string'),
    categoryDescription: a('string'),
    slug: a('string')
  });

});
define('elosh-client/models/artwork', ['exports', 'ember-data'], function (exports, DS) {

  'use strict';

  var a = DS['default'].attr,
      b = DS['default'].belongsTo;

  exports['default'] = DS['default'].Model.extend({
    bookTitle: a('string'),
    categories: a(),
    description: a('string'),
    medium: a('string'),
    slug: a('string'),
    title: a('string'),

    image: b('imageObject'),
    thumbnail: b('imageObject')
  });

});
define('elosh-client/models/book', ['exports', 'ember-data'], function (exports, DS) {

  'use strict';

  var a = DS['default'].attr,
      b = DS['default'].belongsTo,
      h = DS['default'].hasMany;

  exports['default'] = DS['default'].Model.extend({
    title: a('string'),
    titleNotes: a('string'),
    bannerImage: b('imageObject'),
    coverImage: b('imageObject'),
    narrative: a('string'),
    slug: a('string'),
    bookPages: h('artwork')
  });

});
define('elosh-client/models/contact', ['exports', 'ember-data', 'ember'], function (exports, DS, Ember) {

  'use strict';

  var a = DS['default'].attr;

  exports['default'] = DS['default'].Model.extend({
    contactNarrative: a('string'),
    email: a('string'),
    phone: a('string'),
    twitter: a('string'),
    storeLink: a('string'),

    mailTo: Ember['default'].computed('email', {
      get: function get() {
        return this.get('email') ? 'mailto:' + this.get('email') : null;
      }
    }),

    twitterLink: Ember['default'].computed('twitter', {
      get: function get() {
        return this.get('twitter') ? 'https://twitter.com/' + this.get('twitter') : null;
      }
    })
  });

});
define('elosh-client/models/image-object', ['exports', 'ember-data'], function (exports, DS) {

  'use strict';

  var a = DS['default'].attr;

  exports['default'] = DS['default'].Model.extend({
    url: a('string'),
    height: a('number'),
    width: a('number')
  });

});
define('elosh-client/router', ['exports', 'ember', 'elosh-client/config/environment'], function (exports, Ember, config) {

  'use strict';

  var Router = Ember['default'].Router.extend({
    location: config['default'].locationType
  });

  Router.map(function () {

    this.resource('artwork', function () {
      this.route('category', { path: ':category_slug' }, function () {
        this.route('show', { path: ':artwork_slug' });
      });
    });

    this.resource('books', function () {
      this.route('show', { path: ':book_slug' }, function () {
        this.route('bookPage', { path: ':book_page' });
      });
    });

    this.route('about');
  });

  exports['default'] = Router;

});
define('elosh-client/routes/about', ['exports', 'ember', 'elosh-client/mixins/routes/scroll-to-top'], function (exports, Ember, ScrollToTop) {

  'use strict';

  exports['default'] = Ember['default'].Route.extend(ScrollToTop['default'], {

    model: function model() {
      return Ember['default'].RSVP.hash({
        about: this.modelFor('application').about,
        contact: this.modelFor('application').contact
      });
      //return this.get('store').find('about', 1);
    },

    setupController: function setupController(controller, model) {
      this._super(controller, model);

      // controller.setProperties({
      //   model: model.about,
      //   contact: model.contact
      // });
      // var contactModel = this.modelFor('application').contact;
      // controller.set('contact', contactModel);
    }

  });

});
define('elosh-client/routes/application', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Route.extend({

    model: function model() {
      var store = this.get('store');
      return Ember['default'].RSVP.hash({
        books: store.find('book', { 'action': 'get_books' }),
        artworkCategories: store.find('artworkCategory', { 'action': 'get_artwork_categories' }),
        contact: store.find('contact', 1),
        about: store.find('about', 1),
        artwork: store.find('artwork', { 'action': 'get_artwork' })
      });
    },

    afterModel: function afterModel() {
      return new Ember['default'].RSVP.Promise(function (resolve) {
        //Ember.run.later(() => {
        Ember['default'].$('#elosh-stub').remove();
        resolve();
        //}, 2000);
      });
    },

    actions: {
      openModal: function openModal(opts) {
        this._renderModal(opts);
      },
      closeModal: function closeModal() {
        this._disconnectModal();
      },
      willTransition: function willTransition() {
        this._disconnectModal();
        return true;
      }
    },

    _renderModal: function _renderModal(opts) {
      var template = opts.template,
          data = {
        into: 'application',
        outlet: 'modal'
      };

      if (opts.controller) {
        data.controller = opts.controller;
      }
      this.render(template, data);
      this.get('controller').set('modalOpen', true);
    },

    _disconnectModal: function _disconnectModal() {
      this.get('controller').set('modalOpen', false);
      this.disconnectOutlet({ outlet: 'modal', parentView: 'application' });
    }

  });

});
define('elosh-client/routes/artwork', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Route.extend({

    _loadedArtwork: null,

    model: function model() {
      return this.modelFor('application').artwork;
      // if(!this.get('_loadedArtwork')) {
      //   var artwork = this.get('store').find('artwork', { 'action': 'get_artwork' });
      //   this.set('_loadedArtwork', artwork);
      // }
      // return this.get('_loadedArtwork');
    }

  });

});
define('elosh-client/routes/artwork/category', ['exports', 'ember', 'elosh-client/mixins/routes/scroll-to-top'], function (exports, Ember, ScrollToTop) {

  'use strict';

  exports['default'] = Ember['default'].Route.extend(ScrollToTop['default'], {

    actions: {
      closeModal: function closeModal() {
        var slug = this.get('controller.model.category.slug');
        this.transitionTo('artwork.category', slug);
        return true;
      },
      nextItem: function nextItem(art) {
        this._transitionToArt(art);
      },
      previousItem: function previousItem(art) {
        this._transitionToArt(art, true);
      },
      linkToArtModal: function linkToArtModal(art) {
        this.transitionTo('artwork.category.show', art.get('slug'));
      }
    },

    model: function model(params) {
      var artwork = this.modelFor('artwork'),
          artworkCategories = this.store.all('artworkCategory'),
          category = artworkCategories.findBy('slug', params.category_slug);

      artwork = artwork.filter(function (artwork) {
        var categories = artwork.get('categories');
        return categories.contains(params.category_slug);
      });

      return Ember['default'].Object.create({ artwork: artwork, category: category });
    },

    _transitionToArt: function _transitionToArt(art) {
      var previous = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

      var allArtwork = this.get('controller.model.artwork'),
          artIndex,
          nextArtIndex;

      allArtwork.find(function (artwork, idx) {
        var found = artwork.get('id') === art.get('id');
        if (found) {
          artIndex = idx;
        }
        return found;
      });

      if (previous) {
        nextArtIndex = artIndex !== 0 ? artIndex - 1 : allArtwork.get('length') - 1;
      } else {
        nextArtIndex = artIndex < allArtwork.get('length') - 1 ? artIndex + 1 : 0;
      }

      this.transitionTo('artwork.category.show', allArtwork.objectAt(nextArtIndex).get('slug'));
    }

  });

});
define('elosh-client/routes/artwork/category/show', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Route.extend({

    model: function model(params) {
      var artwork = this.store.all('artwork'),
          art = artwork.findBy('slug', params.artwork_slug);

      return art ? art : {};
    },

    renderTemplate: function renderTemplate(controller) {
      this.send('openModal', { template: 'artwork.category.show', controller: controller });
    }

  });

});
define('elosh-client/routes/artwork/index', ['exports', 'ember', 'elosh-client/mixins/routes/redirect-to-first-item'], function (exports, Ember, RedirectToFirstItem) {

  'use strict';

  exports['default'] = Ember['default'].Route.extend(RedirectToFirstItem['default'], {

    appModelName: 'artworkCategories',
    appModelRoute: 'artwork.category'

  });

});
define('elosh-client/routes/books/index', ['exports', 'ember', 'elosh-client/mixins/routes/redirect-to-first-item'], function (exports, Ember, RedirectToFirstItem) {

  'use strict';

  exports['default'] = Ember['default'].Route.extend(RedirectToFirstItem['default'], {

    appModelName: 'books',
    appModelRoute: 'books.show'

  });

});
define('elosh-client/routes/books/show', ['exports', 'ember', 'elosh-client/mixins/routes/scroll-to-top'], function (exports, Ember, ScrollToTop) {

  'use strict';

  exports['default'] = Ember['default'].Route.extend(ScrollToTop['default'], {

    actions: {
      closeModal: function closeModal() {
        var slug = this.get('controller.model.slug');
        this.transitionTo('books.show', slug);
        return true;
      },
      nextItem: function nextItem(bookPage) {
        this._transitionToBookPage(bookPage);
      },
      previousItem: function previousItem(bookPage) {
        this._transitionToBookPage(bookPage, true);
      },
      linkToArtModal: function linkToArtModal(bookPage) {
        this.transitionTo('books.show.bookPage', bookPage.get('slug'));
      }
    },

    model: function model(params) {
      var books = this.store.all('book'),
          book = books.findBy('slug', params.book_slug);

      return book ? book : {};
    },

    _transitionToBookPage: function _transitionToBookPage(bookPage) {
      var previous = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

      var bookPages = this.get('controller.model.bookPages'),
          bookIndex,
          nextBookIndex;

      bookPages.find(function (page, idx) {
        var found = page.get('id') === bookPage.get('id');
        if (found) {
          bookIndex = idx;
        }
        return found;
      });

      if (previous) {
        nextBookIndex = bookIndex !== 0 ? bookIndex - 1 : bookPages.get('length') - 1;
      } else {
        nextBookIndex = bookIndex < bookPages.get('length') - 1 ? bookIndex + 1 : 0;
      }

      this.transitionTo('books.show.bookPage', bookPages.objectAt(nextBookIndex).get('slug'));
    }

  });

});
define('elosh-client/routes/books/show/book-page', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Route.extend({

    model: function model(params) {
      var artwork = this.store.all('artwork'),
          art = artwork.findBy('slug', params.book_page);

      return art ? art : {};
    },

    renderTemplate: function renderTemplate(controller) {
      this.send('openModal', { template: 'books.show.bookPage', controller: controller });
    }

  });

});
define('elosh-client/routes/index', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Route.extend({

    redirect: function redirect() {
      this.transitionTo('artwork');
    }

  });

});
define('elosh-client/serializers/about', ['exports', 'elosh-client/serializers/application', 'ember-data'], function (exports, ApplicationSerializer, DS) {

  'use strict';

  exports['default'] = ApplicationSerializer['default'].extend(DS['default'].EmbeddedRecordsMixin, {

    attrs: {
      image: { embedded: 'always' }
    }

  });

});
define('elosh-client/serializers/application', ['exports', 'ember-data'], function (exports, DS) {

	'use strict';

	exports['default'] = DS['default'].ActiveModelSerializer;

});
define('elosh-client/serializers/artwork-category', ['exports', 'elosh-client/serializers/application'], function (exports, ApplicationSerializer) {

  'use strict';

  exports['default'] = ApplicationSerializer['default'].extend({

    normalizePayload: function normalizePayload(payload) {
      payload.artwork_categories.forEach(function (category) {
        category.id = category.term_id;
      });
      return payload;
    }

  });

});
define('elosh-client/serializers/artwork', ['exports', 'elosh-client/serializers/application', 'ember-data'], function (exports, ApplicationSerializer, DS) {

  'use strict';

  exports['default'] = ApplicationSerializer['default'].extend(DS['default'].EmbeddedRecordsMixin, {

    attrs: {
      thumbnail: { embedded: 'always' },
      image: { embedded: 'always' }
    }

  });

});
define('elosh-client/serializers/book', ['exports', 'elosh-client/serializers/application', 'ember-data'], function (exports, ApplicationSerializer, DS) {

  'use strict';

  exports['default'] = ApplicationSerializer['default'].extend(DS['default'].EmbeddedRecordsMixin, {

    attrs: {
      bannerImage: { embedded: 'always' },
      coverImage: { embedded: 'always' },
      bookPages: { embedded: 'always' }
    }

  });

});
define('elosh-client/templates/about', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      var child0 = (function() {
        return {
          isHTMLBars: true,
          revision: "Ember@1.12.0",
          blockParams: 0,
          cachedFragment: null,
          hasRendered: false,
          build: function build(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("          ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("p");
            var el2 = dom.createElement("a");
            dom.setAttribute(el2,"title","Email Eric Losh");
            dom.setAttribute(el2,"target","_blank");
            var el3 = dom.createComment("");
            dom.appendChild(el2, el3);
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          render: function render(context, env, contextualElement) {
            var dom = env.dom;
            var hooks = env.hooks, element = hooks.element, content = hooks.content;
            dom.detectNamespace(contextualElement);
            var fragment;
            if (env.useFragmentCache && dom.canClone) {
              if (this.cachedFragment === null) {
                fragment = this.build(dom);
                if (this.hasRendered) {
                  this.cachedFragment = fragment;
                } else {
                  this.hasRendered = true;
                }
              }
              if (this.cachedFragment) {
                fragment = dom.cloneNode(this.cachedFragment, true);
              }
            } else {
              fragment = this.build(dom);
            }
            var element1 = dom.childAt(fragment, [1, 0]);
            var morph0 = dom.createMorphAt(element1,0,0);
            element(env, element1, context, "bind-attr", [], {"href": "model.contact.mailTo"});
            content(env, morph0, context, "model.contact.email");
            return fragment;
          }
        };
      }());
      var child1 = (function() {
        return {
          isHTMLBars: true,
          revision: "Ember@1.12.0",
          blockParams: 0,
          cachedFragment: null,
          hasRendered: false,
          build: function build(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("          ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("p");
            var el2 = dom.createComment("");
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          render: function render(context, env, contextualElement) {
            var dom = env.dom;
            var hooks = env.hooks, content = hooks.content;
            dom.detectNamespace(contextualElement);
            var fragment;
            if (env.useFragmentCache && dom.canClone) {
              if (this.cachedFragment === null) {
                fragment = this.build(dom);
                if (this.hasRendered) {
                  this.cachedFragment = fragment;
                } else {
                  this.hasRendered = true;
                }
              }
              if (this.cachedFragment) {
                fragment = dom.cloneNode(this.cachedFragment, true);
              }
            } else {
              fragment = this.build(dom);
            }
            var morph0 = dom.createMorphAt(dom.childAt(fragment, [1]),0,0);
            content(env, morph0, context, "model.contact.phone");
            return fragment;
          }
        };
      }());
      var child2 = (function() {
        return {
          isHTMLBars: true,
          revision: "Ember@1.12.0",
          blockParams: 0,
          cachedFragment: null,
          hasRendered: false,
          build: function build(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("          ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("p");
            var el2 = dom.createTextNode("Twitter: ");
            dom.appendChild(el1, el2);
            var el2 = dom.createElement("a");
            dom.setAttribute(el2,"target","_blank");
            dom.setAttribute(el2,"title","Eric Losh's Twitter");
            var el3 = dom.createTextNode("@");
            dom.appendChild(el2, el3);
            var el3 = dom.createComment("");
            dom.appendChild(el2, el3);
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          render: function render(context, env, contextualElement) {
            var dom = env.dom;
            var hooks = env.hooks, element = hooks.element, content = hooks.content;
            dom.detectNamespace(contextualElement);
            var fragment;
            if (env.useFragmentCache && dom.canClone) {
              if (this.cachedFragment === null) {
                fragment = this.build(dom);
                if (this.hasRendered) {
                  this.cachedFragment = fragment;
                } else {
                  this.hasRendered = true;
                }
              }
              if (this.cachedFragment) {
                fragment = dom.cloneNode(this.cachedFragment, true);
              }
            } else {
              fragment = this.build(dom);
            }
            var element0 = dom.childAt(fragment, [1, 1]);
            var morph0 = dom.createMorphAt(element0,1,1);
            element(env, element0, context, "bind-attr", [], {"href": "model.contact.twitterLink"});
            content(env, morph0, context, "model.contact.twitter");
            return fragment;
          }
        };
      }());
      var child3 = (function() {
        return {
          isHTMLBars: true,
          revision: "Ember@1.12.0",
          blockParams: 0,
          cachedFragment: null,
          hasRendered: false,
          build: function build(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("        ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("div");
            dom.setAttribute(el1,"class","narrative-one");
            var el2 = dom.createTextNode("\n          ");
            dom.appendChild(el1, el2);
            var el2 = dom.createComment("");
            dom.appendChild(el1, el2);
            var el2 = dom.createTextNode("\n        ");
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          render: function render(context, env, contextualElement) {
            var dom = env.dom;
            var hooks = env.hooks, content = hooks.content;
            dom.detectNamespace(contextualElement);
            var fragment;
            if (env.useFragmentCache && dom.canClone) {
              if (this.cachedFragment === null) {
                fragment = this.build(dom);
                if (this.hasRendered) {
                  this.cachedFragment = fragment;
                } else {
                  this.hasRendered = true;
                }
              }
              if (this.cachedFragment) {
                fragment = dom.cloneNode(this.cachedFragment, true);
              }
            } else {
              fragment = this.build(dom);
            }
            var morph0 = dom.createUnsafeMorphAt(dom.childAt(fragment, [1]),1,1);
            content(env, morph0, context, "model.about.narrativeOne");
            return fragment;
          }
        };
      }());
      var child4 = (function() {
        return {
          isHTMLBars: true,
          revision: "Ember@1.12.0",
          blockParams: 0,
          cachedFragment: null,
          hasRendered: false,
          build: function build(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("        ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("div");
            dom.setAttribute(el1,"class","mini-border");
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n        ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("div");
            dom.setAttribute(el1,"class","narrative-two");
            var el2 = dom.createTextNode("\n          ");
            dom.appendChild(el1, el2);
            var el2 = dom.createComment("");
            dom.appendChild(el1, el2);
            var el2 = dom.createTextNode("\n        ");
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          render: function render(context, env, contextualElement) {
            var dom = env.dom;
            var hooks = env.hooks, content = hooks.content;
            dom.detectNamespace(contextualElement);
            var fragment;
            if (env.useFragmentCache && dom.canClone) {
              if (this.cachedFragment === null) {
                fragment = this.build(dom);
                if (this.hasRendered) {
                  this.cachedFragment = fragment;
                } else {
                  this.hasRendered = true;
                }
              }
              if (this.cachedFragment) {
                fragment = dom.cloneNode(this.cachedFragment, true);
              }
            } else {
              fragment = this.build(dom);
            }
            var morph0 = dom.createUnsafeMorphAt(dom.childAt(fragment, [3]),1,1);
            content(env, morph0, context, "model.about.narrativeTwo");
            return fragment;
          }
        };
      }());
      return {
        isHTMLBars: true,
        revision: "Ember@1.12.0",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("    ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          dom.setAttribute(el1,"class","about-narratives");
          var el2 = dom.createTextNode("\n      ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("div");
          dom.setAttribute(el2,"class","contact-info clear-fix");
          var el3 = dom.createTextNode("\n        ");
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("p");
          var el4 = dom.createElement("strong");
          var el5 = dom.createTextNode("ERIC LOSH");
          dom.appendChild(el4, el5);
          dom.appendChild(el3, el4);
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n");
          dom.appendChild(el2, el3);
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("      ");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n\n");
          dom.appendChild(el1, el2);
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n");
          dom.appendChild(el1, el2);
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("    ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, get = hooks.get, block = hooks.block;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var element2 = dom.childAt(fragment, [1]);
          var element3 = dom.childAt(element2, [1]);
          var morph0 = dom.createMorphAt(element3,3,3);
          var morph1 = dom.createMorphAt(element3,4,4);
          var morph2 = dom.createMorphAt(element3,5,5);
          var morph3 = dom.createMorphAt(element2,3,3);
          var morph4 = dom.createMorphAt(element2,5,5);
          block(env, morph0, context, "if", [get(env, context, "model.contact.email")], {}, child0, null);
          block(env, morph1, context, "if", [get(env, context, "model.contact.phone")], {}, child1, null);
          block(env, morph2, context, "if", [get(env, context, "model.contact.twitter")], {}, child2, null);
          block(env, morph3, context, "if", [get(env, context, "model.about.narrativeOne")], {}, child3, null);
          block(env, morph4, context, "if", [get(env, context, "model.about.narrativeTwo")], {}, child4, null);
          return fragment;
        }
      };
    }());
    return {
      isHTMLBars: true,
      revision: "Ember@1.12.0",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"id","about");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("img");
        dom.setAttribute(el2,"alt","About Eric Losh");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, element = hooks.element, get = hooks.get, block = hooks.block;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var element4 = dom.childAt(fragment, [0]);
        var element5 = dom.childAt(element4, [1]);
        var morph0 = dom.createMorphAt(element4,3,3);
        element(env, element5, context, "bind-attr", [], {"src": "model.about.image.url"});
        block(env, morph0, context, "max-width", [], {"width": get(env, context, "model.about.image.width")}, child0, null);
        return fragment;
      }
    };
  }()));

});
define('elosh-client/templates/application', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.12.0",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createElement("img");
          dom.setAttribute(el1,"alt","Eric Losh");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, get = hooks.get, element = hooks.element;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var element0 = dom.childAt(fragment, [0]);
          element(env, element0, context, "bind-attr", [], {"src": get(env, context, "logoURL")});
          return fragment;
        }
      };
    }());
    return {
      isHTMLBars: true,
      revision: "Ember@1.12.0",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"id","left-nav");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","brand clear-fix");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","footer clear-fix");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("img");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("p");
        var el4 = dom.createTextNode("Web by ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("a");
        dom.setAttribute(el4,"href","https://github.com/david-casagrande");
        dom.setAttribute(el4,"target","_blank");
        dom.setAttribute(el4,"title","David Casagrande");
        var el5 = dom.createTextNode("David Casagrande");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"id","app-window");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","margin");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","page clear-fix");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"id","modal");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","margin");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, block = hooks.block, inline = hooks.inline, get = hooks.get, element = hooks.element, content = hooks.content;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var element1 = dom.childAt(fragment, [0]);
        var element2 = dom.childAt(element1, [5, 1]);
        var element3 = dom.childAt(fragment, [4]);
        var morph0 = dom.createMorphAt(dom.childAt(element1, [1]),1,1);
        var morph1 = dom.createMorphAt(element1,3,3);
        var morph2 = dom.createMorphAt(dom.childAt(fragment, [2, 1, 1]),1,1);
        var morph3 = dom.createMorphAt(dom.childAt(element3, [1]),1,1);
        block(env, morph0, context, "link-to", ["index"], {}, child0, null);
        inline(env, morph1, context, "partial", ["partials/main-navigation"], {});
        element(env, element2, context, "bind-attr", [], {"src": get(env, context, "footerLogoURL")});
        content(env, morph2, context, "outlet");
        element(env, element3, context, "bind-attr", [], {"class": "modalOpen:show"});
        inline(env, morph3, context, "outlet", ["modal"], {});
        return fragment;
      }
    };
  }()));

});
define('elosh-client/templates/artwork/category', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.12.0",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          dom.setAttribute(el1,"class","artwork-category-image clear-fix");
          var el2 = dom.createTextNode("\n    ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("img");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n  ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, element = hooks.element;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var element0 = dom.childAt(fragment, [1, 1]);
          element(env, element0, context, "bind-attr", [], {"src": "model.category.categoryDescription", "alt": "model.category.name"});
          return fragment;
        }
      };
    }());
    return {
      isHTMLBars: true,
      revision: "Ember@1.12.0",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("h1");
        dom.setAttribute(el1,"class","artwork-category-title");
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, content = hooks.content, get = hooks.get, block = hooks.block, inline = hooks.inline;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var morph0 = dom.createMorphAt(dom.childAt(fragment, [0]),0,0);
        var morph1 = dom.createMorphAt(fragment,2,2,contextualElement);
        var morph2 = dom.createMorphAt(fragment,4,4,contextualElement);
        content(env, morph0, context, "model.category.name");
        block(env, morph1, context, "if", [get(env, context, "model.category.categoryDescription")], {}, child0, null);
        inline(env, morph2, context, "partial", ["partials/artwork-thumbnails"], {});
        return fragment;
      }
    };
  }()));

});
define('elosh-client/templates/artwork/category/show', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      isHTMLBars: true,
      revision: "Ember@1.12.0",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, get = hooks.get, inline = hooks.inline;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var morph0 = dom.createMorphAt(fragment,0,0,contextualElement);
        dom.insertBoundary(fragment, 0);
        inline(env, morph0, context, "art-modal", [], {"art": get(env, context, "model"), "closeModal": "closeModal", "nextItem": "nextItem", "previousItem": "previousItem"});
        return fragment;
      }
    };
  }()));

});
define('elosh-client/templates/books/show', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.12.0",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("    ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("h1");
          dom.setAttribute(el1,"class","book-title");
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode(" ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("span");
          var el3 = dom.createTextNode("- ");
          dom.appendChild(el2, el3);
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, content = hooks.content;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var element0 = dom.childAt(fragment, [1]);
          var morph0 = dom.createMorphAt(element0,0,0);
          var morph1 = dom.createMorphAt(dom.childAt(element0, [2]),1,1);
          content(env, morph0, context, "model.title");
          content(env, morph1, context, "model.titleNotes");
          return fragment;
        }
      };
    }());
    var child1 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.12.0",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("    ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("h1");
          dom.setAttribute(el1,"class","book-title");
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, content = hooks.content;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var morph0 = dom.createMorphAt(dom.childAt(fragment, [1]),0,0);
          content(env, morph0, context, "model.title");
          return fragment;
        }
      };
    }());
    return {
      isHTMLBars: true,
      revision: "Ember@1.12.0",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"id","books");
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","book-images clear-fix");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","book-banner-image");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("img");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","book-cover-image large-5-columns");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("img");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"id","book-narrative-and-pages");
        dom.setAttribute(el2,"class","clear-fix");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","book-narrative");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","padding");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","book-pages");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","padding");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, get = hooks.get, block = hooks.block, element = hooks.element, content = hooks.content, inline = hooks.inline;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var element1 = dom.childAt(fragment, [0]);
        var element2 = dom.childAt(element1, [3]);
        var element3 = dom.childAt(element2, [1, 1]);
        var element4 = dom.childAt(element2, [3, 1]);
        var element5 = dom.childAt(element1, [5]);
        var morph0 = dom.createMorphAt(element1,1,1);
        var morph1 = dom.createUnsafeMorphAt(dom.childAt(element5, [1, 1]),1,1);
        var morph2 = dom.createMorphAt(dom.childAt(element5, [3, 1]),1,1);
        block(env, morph0, context, "if", [get(env, context, "model.titleNotes")], {}, child0, child1);
        element(env, element3, context, "bind-attr", [], {"src": "model.bannerImage.url"});
        element(env, element4, context, "bind-attr", [], {"src": "model.coverImage.url"});
        content(env, morph1, context, "model.narrative");
        inline(env, morph2, context, "partial", ["partials/book-thumbnails"], {});
        return fragment;
      }
    };
  }()));

});
define('elosh-client/templates/books/show/book-page', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      isHTMLBars: true,
      revision: "Ember@1.12.0",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, get = hooks.get, inline = hooks.inline;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var morph0 = dom.createMorphAt(fragment,0,0,contextualElement);
        dom.insertBoundary(fragment, 0);
        inline(env, morph0, context, "art-modal", [], {"art": get(env, context, "model"), "closeModal": "closeModal", "nextItem": "nextItem", "previousItem": "previousItem"});
        return fragment;
      }
    };
  }()));

});
define('elosh-client/templates/components/art-modal', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.12.0",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("    ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("img");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, element = hooks.element;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var element1 = dom.childAt(fragment, [1]);
          element(env, element1, context, "bind-attr", [], {"src": "imageDataUrl", "alt": "art.title"});
          return fragment;
        }
      };
    }());
    var child1 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.12.0",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createElement("p");
          dom.setAttribute(el1,"class","art-title");
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, content = hooks.content;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var morph0 = dom.createMorphAt(dom.childAt(fragment, [0]),0,0);
          content(env, morph0, context, "art.title");
          return fragment;
        }
      };
    }());
    var child2 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.12.0",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createElement("p");
          dom.setAttribute(el1,"class","book-title");
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, content = hooks.content;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var morph0 = dom.createMorphAt(dom.childAt(fragment, [0]),0,0);
          content(env, morph0, context, "art.bookTitle");
          return fragment;
        }
      };
    }());
    var child3 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.12.0",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createElement("p");
          dom.setAttribute(el1,"class","art-medium");
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, content = hooks.content;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var morph0 = dom.createMorphAt(dom.childAt(fragment, [0]),0,0);
          content(env, morph0, context, "art.medium");
          return fragment;
        }
      };
    }());
    var child4 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.12.0",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createElement("div");
          dom.setAttribute(el1,"class","art-description");
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, content = hooks.content;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var morph0 = dom.createUnsafeMorphAt(dom.childAt(fragment, [0]),0,0);
          content(env, morph0, context, "art.description");
          return fragment;
        }
      };
    }());
    var child5 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.12.0",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createElement("div");
          var el2 = dom.createTextNode("\n  ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("div");
          dom.setAttribute(el2,"id","progress-circle");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, element = hooks.element;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var element0 = dom.childAt(fragment, [0]);
          element(env, element0, context, "bind-attr", [], {"class": "imageLoaded:loaded :loading-overlay"});
          return fragment;
        }
      };
    }());
    return {
      isHTMLBars: true,
      revision: "Ember@1.12.0",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","art-modal-image");
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","artwork-details");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("a");
        dom.setAttribute(el1,"href","#");
        dom.setAttribute(el1,"class","modal-navigation previous");
        var el2 = dom.createTextNode("Previous");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("a");
        dom.setAttribute(el1,"href","#");
        dom.setAttribute(el1,"class","modal-navigation next");
        var el2 = dom.createTextNode("Next");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("a");
        dom.setAttribute(el1,"href","#");
        dom.setAttribute(el1,"class","modal-navigation close");
        var el2 = dom.createTextNode("Close Modal");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, get = hooks.get, block = hooks.block, element = hooks.element;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var element2 = dom.childAt(fragment, [2]);
        var element3 = dom.childAt(fragment, [5]);
        var element4 = dom.childAt(fragment, [7]);
        var element5 = dom.childAt(fragment, [9]);
        var morph0 = dom.createMorphAt(dom.childAt(fragment, [0]),1,1);
        var morph1 = dom.createMorphAt(element2,1,1);
        var morph2 = dom.createMorphAt(element2,3,3);
        var morph3 = dom.createMorphAt(element2,5,5);
        var morph4 = dom.createMorphAt(element2,7,7);
        var morph5 = dom.createMorphAt(fragment,4,4,contextualElement);
        block(env, morph0, context, "if", [get(env, context, "imageDataUrl")], {}, child0, null);
        block(env, morph1, context, "if", [get(env, context, "art.title")], {}, child1, null);
        block(env, morph2, context, "if", [get(env, context, "art.bookTitle")], {}, child2, null);
        block(env, morph3, context, "if", [get(env, context, "art.medium")], {}, child3, null);
        block(env, morph4, context, "if", [get(env, context, "art.description")], {}, child4, null);
        block(env, morph5, context, "unless", [get(env, context, "hideOverlay")], {}, child5, null);
        element(env, element3, context, "action", ["previousItem"], {});
        element(env, element4, context, "action", ["nextItem"], {});
        element(env, element5, context, "action", ["closeModal"], {});
        return fragment;
      }
    };
  }()));

});
define('elosh-client/templates/components/max-width', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      isHTMLBars: true,
      revision: "Ember@1.12.0",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, content = hooks.content;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var morph0 = dom.createMorphAt(fragment,0,0,contextualElement);
        dom.insertBoundary(fragment, 0);
        content(env, morph0, context, "yield");
        return fragment;
      }
    };
  }()));

});
define('elosh-client/templates/components/nav-section', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      isHTMLBars: true,
      revision: "Ember@1.12.0",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, content = hooks.content;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var morph0 = dom.createMorphAt(fragment,0,0,contextualElement);
        dom.insertBoundary(fragment, 0);
        content(env, morph0, context, "yield");
        return fragment;
      }
    };
  }()));

});
define('elosh-client/templates/loading', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      isHTMLBars: true,
      revision: "Ember@1.12.0",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"id","loading-route");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","margin");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("h1");
        var el4 = dom.createTextNode("Loading");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("span");
        dom.setAttribute(el4,"class","first");
        var el5 = dom.createTextNode(".");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("span");
        dom.setAttribute(el4,"class","second");
        var el5 = dom.createTextNode(".");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("span");
        dom.setAttribute(el4,"class","third");
        var el5 = dom.createTextNode(".");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        return fragment;
      }
    };
  }()));

});
define('elosh-client/templates/partials/-artwork-thumbnails', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.12.0",
        blockParams: 1,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("    ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("li");
          var el2 = dom.createTextNode("\n      ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("img");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n      ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("p");
          dom.setAttribute(el2,"class","art-thumb-title");
          var el3 = dom.createTextNode("\n        ");
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("a");
          dom.setAttribute(el3,"href","#");
          var el4 = dom.createComment("");
          dom.appendChild(el3, el4);
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n      ");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n    ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement, blockArguments) {
          var dom = env.dom;
          var hooks = env.hooks, set = hooks.set, get = hooks.get, element = hooks.element, content = hooks.content;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var element0 = dom.childAt(fragment, [1]);
          var element1 = dom.childAt(element0, [1]);
          var morph0 = dom.createMorphAt(dom.childAt(element0, [3, 1]),0,0);
          set(env, context, "art", blockArguments[0]);
          element(env, element0, context, "action", ["linkToArtModal", get(env, context, "art")], {});
          element(env, element1, context, "bind-attr", [], {"src": "art.thumbnail.url", "alt": "art.title"});
          content(env, morph0, context, "art.title");
          return fragment;
        }
      };
    }());
    return {
      isHTMLBars: true,
      revision: "Ember@1.12.0",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("ul");
        dom.setAttribute(el1,"class","art-thumbs large-block-grid-4 medium-block-grid-3 small-block-grid-1");
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, get = hooks.get, block = hooks.block;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var morph0 = dom.createMorphAt(dom.childAt(fragment, [0]),1,1);
        block(env, morph0, context, "each", [get(env, context, "model.artwork")], {}, child0, null);
        return fragment;
      }
    };
  }()));

});
define('elosh-client/templates/partials/-book-thumbnails', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.12.0",
        blockParams: 1,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("    ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("li");
          var el2 = dom.createTextNode("\n      ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("a");
          dom.setAttribute(el2,"href","#");
          var el3 = dom.createTextNode("\n        ");
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("img");
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n      ");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n    ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement, blockArguments) {
          var dom = env.dom;
          var hooks = env.hooks, set = hooks.set, get = hooks.get, element = hooks.element;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var element0 = dom.childAt(fragment, [1, 1]);
          var element1 = dom.childAt(element0, [1]);
          set(env, context, "bookPage", blockArguments[0]);
          element(env, element0, context, "action", ["linkToArtModal", get(env, context, "bookPage")], {});
          element(env, element1, context, "bind-attr", [], {"src": "bookPage.thumbnail.url", "alt": "bookPage.title"});
          return fragment;
        }
      };
    }());
    return {
      isHTMLBars: true,
      revision: "Ember@1.12.0",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("ul");
        dom.setAttribute(el1,"class","large-block-grid-2 small-block-grid-1");
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, get = hooks.get, block = hooks.block;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var morph0 = dom.createMorphAt(dom.childAt(fragment, [0]),1,1);
        block(env, morph0, context, "each", [get(env, context, "model.bookPages")], {}, child0, null);
        return fragment;
      }
    };
  }()));

});
define('elosh-client/templates/partials/-main-navigation', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      var child0 = (function() {
        return {
          isHTMLBars: true,
          revision: "Ember@1.12.0",
          blockParams: 0,
          cachedFragment: null,
          hasRendered: false,
          build: function build(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("Artwork");
            dom.appendChild(el0, el1);
            return el0;
          },
          render: function render(context, env, contextualElement) {
            var dom = env.dom;
            dom.detectNamespace(contextualElement);
            var fragment;
            if (env.useFragmentCache && dom.canClone) {
              if (this.cachedFragment === null) {
                fragment = this.build(dom);
                if (this.hasRendered) {
                  this.cachedFragment = fragment;
                } else {
                  this.hasRendered = true;
                }
              }
              if (this.cachedFragment) {
                fragment = dom.cloneNode(this.cachedFragment, true);
              }
            } else {
              fragment = this.build(dom);
            }
            return fragment;
          }
        };
      }());
      var child1 = (function() {
        var child0 = (function() {
          return {
            isHTMLBars: true,
            revision: "Ember@1.12.0",
            blockParams: 0,
            cachedFragment: null,
            hasRendered: false,
            build: function build(dom) {
              var el0 = dom.createDocumentFragment();
              var el1 = dom.createComment("");
              dom.appendChild(el0, el1);
              return el0;
            },
            render: function render(context, env, contextualElement) {
              var dom = env.dom;
              var hooks = env.hooks, content = hooks.content;
              dom.detectNamespace(contextualElement);
              var fragment;
              if (env.useFragmentCache && dom.canClone) {
                if (this.cachedFragment === null) {
                  fragment = this.build(dom);
                  if (this.hasRendered) {
                    this.cachedFragment = fragment;
                  } else {
                    this.hasRendered = true;
                  }
                }
                if (this.cachedFragment) {
                  fragment = dom.cloneNode(this.cachedFragment, true);
                }
              } else {
                fragment = this.build(dom);
              }
              var morph0 = dom.createMorphAt(fragment,0,0,contextualElement);
              dom.insertBoundary(fragment, null);
              dom.insertBoundary(fragment, 0);
              content(env, morph0, context, "artworkCategory.name");
              return fragment;
            }
          };
        }());
        return {
          isHTMLBars: true,
          revision: "Ember@1.12.0",
          blockParams: 1,
          cachedFragment: null,
          hasRendered: false,
          build: function build(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("          ");
            dom.appendChild(el0, el1);
            var el1 = dom.createComment("");
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          render: function render(context, env, contextualElement, blockArguments) {
            var dom = env.dom;
            var hooks = env.hooks, set = hooks.set, get = hooks.get, block = hooks.block;
            dom.detectNamespace(contextualElement);
            var fragment;
            if (env.useFragmentCache && dom.canClone) {
              if (this.cachedFragment === null) {
                fragment = this.build(dom);
                if (this.hasRendered) {
                  this.cachedFragment = fragment;
                } else {
                  this.hasRendered = true;
                }
              }
              if (this.cachedFragment) {
                fragment = dom.cloneNode(this.cachedFragment, true);
              }
            } else {
              fragment = this.build(dom);
            }
            var morph0 = dom.createMorphAt(fragment,1,1,contextualElement);
            set(env, context, "artworkCategory", blockArguments[0]);
            block(env, morph0, context, "link-to", ["artwork.category", get(env, context, "artworkCategory.slug")], {}, child0, null);
            return fragment;
          }
        };
      }());
      return {
        isHTMLBars: true,
        revision: "Ember@1.12.0",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("      ");
          dom.appendChild(el0, el1);
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n      ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          dom.setAttribute(el1,"class","links");
          var el2 = dom.createTextNode("\n");
          dom.appendChild(el1, el2);
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("      ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, block = hooks.block, get = hooks.get;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var morph0 = dom.createMorphAt(fragment,1,1,contextualElement);
          var morph1 = dom.createMorphAt(dom.childAt(fragment, [3]),1,1);
          block(env, morph0, context, "link-to", ["artwork"], {"classNames": "parent-link artwork"}, child0, null);
          block(env, morph1, context, "each", [get(env, context, "model.artworkCategories")], {}, child1, null);
          return fragment;
        }
      };
    }());
    var child1 = (function() {
      var child0 = (function() {
        return {
          isHTMLBars: true,
          revision: "Ember@1.12.0",
          blockParams: 0,
          cachedFragment: null,
          hasRendered: false,
          build: function build(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("Books");
            dom.appendChild(el0, el1);
            return el0;
          },
          render: function render(context, env, contextualElement) {
            var dom = env.dom;
            dom.detectNamespace(contextualElement);
            var fragment;
            if (env.useFragmentCache && dom.canClone) {
              if (this.cachedFragment === null) {
                fragment = this.build(dom);
                if (this.hasRendered) {
                  this.cachedFragment = fragment;
                } else {
                  this.hasRendered = true;
                }
              }
              if (this.cachedFragment) {
                fragment = dom.cloneNode(this.cachedFragment, true);
              }
            } else {
              fragment = this.build(dom);
            }
            return fragment;
          }
        };
      }());
      var child1 = (function() {
        var child0 = (function() {
          return {
            isHTMLBars: true,
            revision: "Ember@1.12.0",
            blockParams: 0,
            cachedFragment: null,
            hasRendered: false,
            build: function build(dom) {
              var el0 = dom.createDocumentFragment();
              var el1 = dom.createComment("");
              dom.appendChild(el0, el1);
              return el0;
            },
            render: function render(context, env, contextualElement) {
              var dom = env.dom;
              var hooks = env.hooks, content = hooks.content;
              dom.detectNamespace(contextualElement);
              var fragment;
              if (env.useFragmentCache && dom.canClone) {
                if (this.cachedFragment === null) {
                  fragment = this.build(dom);
                  if (this.hasRendered) {
                    this.cachedFragment = fragment;
                  } else {
                    this.hasRendered = true;
                  }
                }
                if (this.cachedFragment) {
                  fragment = dom.cloneNode(this.cachedFragment, true);
                }
              } else {
                fragment = this.build(dom);
              }
              var morph0 = dom.createMorphAt(fragment,0,0,contextualElement);
              dom.insertBoundary(fragment, null);
              dom.insertBoundary(fragment, 0);
              content(env, morph0, context, "book.title");
              return fragment;
            }
          };
        }());
        return {
          isHTMLBars: true,
          revision: "Ember@1.12.0",
          blockParams: 1,
          cachedFragment: null,
          hasRendered: false,
          build: function build(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("          ");
            dom.appendChild(el0, el1);
            var el1 = dom.createComment("");
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          render: function render(context, env, contextualElement, blockArguments) {
            var dom = env.dom;
            var hooks = env.hooks, set = hooks.set, get = hooks.get, block = hooks.block;
            dom.detectNamespace(contextualElement);
            var fragment;
            if (env.useFragmentCache && dom.canClone) {
              if (this.cachedFragment === null) {
                fragment = this.build(dom);
                if (this.hasRendered) {
                  this.cachedFragment = fragment;
                } else {
                  this.hasRendered = true;
                }
              }
              if (this.cachedFragment) {
                fragment = dom.cloneNode(this.cachedFragment, true);
              }
            } else {
              fragment = this.build(dom);
            }
            var morph0 = dom.createMorphAt(fragment,1,1,contextualElement);
            set(env, context, "book", blockArguments[0]);
            block(env, morph0, context, "link-to", ["books.show", get(env, context, "book.slug")], {}, child0, null);
            return fragment;
          }
        };
      }());
      return {
        isHTMLBars: true,
        revision: "Ember@1.12.0",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("      ");
          dom.appendChild(el0, el1);
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n      ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          dom.setAttribute(el1,"class","links");
          var el2 = dom.createTextNode("\n");
          dom.appendChild(el1, el2);
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("      ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, block = hooks.block, get = hooks.get;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var morph0 = dom.createMorphAt(fragment,1,1,contextualElement);
          var morph1 = dom.createMorphAt(dom.childAt(fragment, [3]),1,1);
          block(env, morph0, context, "link-to", ["books"], {"classNames": "parent-link books"}, child0, null);
          block(env, morph1, context, "each", [get(env, context, "model.books")], {}, child1, null);
          return fragment;
        }
      };
    }());
    var child2 = (function() {
      var child0 = (function() {
        return {
          isHTMLBars: true,
          revision: "Ember@1.12.0",
          blockParams: 0,
          cachedFragment: null,
          hasRendered: false,
          build: function build(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("          ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("p");
            var el2 = dom.createElement("a");
            dom.setAttribute(el2,"title","Email Eric Losh");
            dom.setAttribute(el2,"target","_blank");
            var el3 = dom.createComment("");
            dom.appendChild(el2, el3);
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          render: function render(context, env, contextualElement) {
            var dom = env.dom;
            var hooks = env.hooks, element = hooks.element, content = hooks.content;
            dom.detectNamespace(contextualElement);
            var fragment;
            if (env.useFragmentCache && dom.canClone) {
              if (this.cachedFragment === null) {
                fragment = this.build(dom);
                if (this.hasRendered) {
                  this.cachedFragment = fragment;
                } else {
                  this.hasRendered = true;
                }
              }
              if (this.cachedFragment) {
                fragment = dom.cloneNode(this.cachedFragment, true);
              }
            } else {
              fragment = this.build(dom);
            }
            var element0 = dom.childAt(fragment, [1, 0]);
            var morph0 = dom.createMorphAt(element0,0,0);
            element(env, element0, context, "bind-attr", [], {"href": "model.contact.mailTo"});
            content(env, morph0, context, "model.contact.email");
            return fragment;
          }
        };
      }());
      return {
        isHTMLBars: true,
        revision: "Ember@1.12.0",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("      ");
          dom.appendChild(el0, el1);
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n      ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          dom.setAttribute(el1,"class","links about");
          var el2 = dom.createTextNode("\n        ");
          dom.appendChild(el1, el2);
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n");
          dom.appendChild(el1, el2);
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("      ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, inline = hooks.inline, content = hooks.content, get = hooks.get, block = hooks.block;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var element1 = dom.childAt(fragment, [3]);
          var morph0 = dom.createMorphAt(fragment,1,1,contextualElement);
          var morph1 = dom.createUnsafeMorphAt(element1,1,1);
          var morph2 = dom.createMorphAt(element1,3,3);
          inline(env, morph0, context, "link-to", ["About", "about"], {"classNames": "parent-link about"});
          content(env, morph1, context, "model.contact.contactNarrative");
          block(env, morph2, context, "if", [get(env, context, "model.contact.email")], {}, child0, null);
          return fragment;
        }
      };
    }());
    return {
      isHTMLBars: true,
      revision: "Ember@1.12.0",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","nav");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","artwork-nav");
        var el3 = dom.createTextNode("\n\n");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","border artwork");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n\n");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","border books");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n\n");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","border about");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","section");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("a");
        dom.setAttribute(el4,"class","parent-link shop");
        dom.setAttribute(el4,"target","_blank");
        var el5 = dom.createTextNode("Shop");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","border shop");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, get = hooks.get, block = hooks.block, element = hooks.element;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var element2 = dom.childAt(fragment, [0, 1]);
        var element3 = dom.childAt(element2, [13, 1]);
        var morph0 = dom.createMorphAt(element2,1,1);
        var morph1 = dom.createMorphAt(element2,5,5);
        var morph2 = dom.createMorphAt(element2,9,9);
        block(env, morph0, context, "nav-section", [], {"currentPath": get(env, context, "currentPath"), "path": "artwork"}, child0, null);
        block(env, morph1, context, "nav-section", [], {"currentPath": get(env, context, "currentPath"), "path": "books"}, child1, null);
        block(env, morph2, context, "nav-section", [], {"currentPath": get(env, context, "currentPath"), "path": "about"}, child2, null);
        element(env, element3, context, "bind-attr", [], {"href": "model.contact.storeLink"});
        return fragment;
      }
    };
  }()));

});
define('elosh-client/tests/adapters/about.jshint', function () {

  'use strict';

  module('JSHint - adapters');
  test('adapters/about.js should pass jshint', function() { 
    ok(true, 'adapters/about.js should pass jshint.'); 
  });

});
define('elosh-client/tests/adapters/application.jshint', function () {

  'use strict';

  module('JSHint - adapters');
  test('adapters/application.js should pass jshint', function() { 
    ok(true, 'adapters/application.js should pass jshint.'); 
  });

});
define('elosh-client/tests/adapters/contact.jshint', function () {

  'use strict';

  module('JSHint - adapters');
  test('adapters/contact.js should pass jshint', function() { 
    ok(true, 'adapters/contact.js should pass jshint.'); 
  });

});
define('elosh-client/tests/app.jshint', function () {

  'use strict';

  module('JSHint - .');
  test('app.js should pass jshint', function() { 
    ok(true, 'app.js should pass jshint.'); 
  });

});
define('elosh-client/tests/components/art-modal.jshint', function () {

  'use strict';

  module('JSHint - components');
  test('components/art-modal.js should pass jshint', function() { 
    ok(true, 'components/art-modal.js should pass jshint.'); 
  });

});
define('elosh-client/tests/components/max-width.jshint', function () {

  'use strict';

  module('JSHint - components');
  test('components/max-width.js should pass jshint', function() { 
    ok(true, 'components/max-width.js should pass jshint.'); 
  });

});
define('elosh-client/tests/components/nav-section.jshint', function () {

  'use strict';

  module('JSHint - components');
  test('components/nav-section.js should pass jshint', function() { 
    ok(true, 'components/nav-section.js should pass jshint.'); 
  });

});
define('elosh-client/tests/controllers/application.jshint', function () {

  'use strict';

  module('JSHint - controllers');
  test('controllers/application.js should pass jshint', function() { 
    ok(true, 'controllers/application.js should pass jshint.'); 
  });

});
define('elosh-client/tests/helpers/resolver', ['exports', 'ember/resolver', 'elosh-client/config/environment'], function (exports, Resolver, config) {

  'use strict';

  var resolver = Resolver['default'].create();

  resolver.namespace = {
    modulePrefix: config['default'].modulePrefix,
    podModulePrefix: config['default'].podModulePrefix
  };

  exports['default'] = resolver;

});
define('elosh-client/tests/helpers/resolver.jshint', function () {

  'use strict';

  module('JSHint - helpers');
  test('helpers/resolver.js should pass jshint', function() { 
    ok(true, 'helpers/resolver.js should pass jshint.'); 
  });

});
define('elosh-client/tests/helpers/start-app', ['exports', 'ember', 'elosh-client/app', 'elosh-client/router', 'elosh-client/config/environment'], function (exports, Ember, Application, Router, config) {

  'use strict';



  exports['default'] = startApp;
  function startApp(attrs) {
    var application;

    var attributes = Ember['default'].merge({}, config['default'].APP);
    attributes = Ember['default'].merge(attributes, attrs); // use defaults, but you can override;

    Ember['default'].run(function () {
      application = Application['default'].create(attributes);
      application.setupForTesting();
      application.injectTestHelpers();
    });

    return application;
  }

});
define('elosh-client/tests/helpers/start-app.jshint', function () {

  'use strict';

  module('JSHint - helpers');
  test('helpers/start-app.js should pass jshint', function() { 
    ok(true, 'helpers/start-app.js should pass jshint.'); 
  });

});
define('elosh-client/tests/mixins/components/art-modal-close-intent.jshint', function () {

  'use strict';

  module('JSHint - mixins/components');
  test('mixins/components/art-modal-close-intent.js should pass jshint', function() { 
    ok(true, 'mixins/components/art-modal-close-intent.js should pass jshint.'); 
  });

});
define('elosh-client/tests/mixins/components/art-modal-height-management.jshint', function () {

  'use strict';

  module('JSHint - mixins/components');
  test('mixins/components/art-modal-height-management.js should pass jshint', function() { 
    ok(true, 'mixins/components/art-modal-height-management.js should pass jshint.'); 
  });

});
define('elosh-client/tests/mixins/components/art-modal-keyboard-navigation.jshint', function () {

  'use strict';

  module('JSHint - mixins/components');
  test('mixins/components/art-modal-keyboard-navigation.js should pass jshint', function() { 
    ok(true, 'mixins/components/art-modal-keyboard-navigation.js should pass jshint.'); 
  });

});
define('elosh-client/tests/mixins/components/art-modal-loading-management.jshint', function () {

  'use strict';

  module('JSHint - mixins/components');
  test('mixins/components/art-modal-loading-management.js should pass jshint', function() { 
    ok(true, 'mixins/components/art-modal-loading-management.js should pass jshint.'); 
  });

});
define('elosh-client/tests/mixins/routes/redirect-to-first-item.jshint', function () {

  'use strict';

  module('JSHint - mixins/routes');
  test('mixins/routes/redirect-to-first-item.js should pass jshint', function() { 
    ok(true, 'mixins/routes/redirect-to-first-item.js should pass jshint.'); 
  });

});
define('elosh-client/tests/mixins/routes/scroll-to-top.jshint', function () {

  'use strict';

  module('JSHint - mixins/routes');
  test('mixins/routes/scroll-to-top.js should pass jshint', function() { 
    ok(true, 'mixins/routes/scroll-to-top.js should pass jshint.'); 
  });

});
define('elosh-client/tests/models/about.jshint', function () {

  'use strict';

  module('JSHint - models');
  test('models/about.js should pass jshint', function() { 
    ok(true, 'models/about.js should pass jshint.'); 
  });

});
define('elosh-client/tests/models/artwork-category.jshint', function () {

  'use strict';

  module('JSHint - models');
  test('models/artwork-category.js should pass jshint', function() { 
    ok(true, 'models/artwork-category.js should pass jshint.'); 
  });

});
define('elosh-client/tests/models/artwork.jshint', function () {

  'use strict';

  module('JSHint - models');
  test('models/artwork.js should pass jshint', function() { 
    ok(true, 'models/artwork.js should pass jshint.'); 
  });

});
define('elosh-client/tests/models/book.jshint', function () {

  'use strict';

  module('JSHint - models');
  test('models/book.js should pass jshint', function() { 
    ok(true, 'models/book.js should pass jshint.'); 
  });

});
define('elosh-client/tests/models/contact.jshint', function () {

  'use strict';

  module('JSHint - models');
  test('models/contact.js should pass jshint', function() { 
    ok(true, 'models/contact.js should pass jshint.'); 
  });

});
define('elosh-client/tests/models/image-object.jshint', function () {

  'use strict';

  module('JSHint - models');
  test('models/image-object.js should pass jshint', function() { 
    ok(true, 'models/image-object.js should pass jshint.'); 
  });

});
define('elosh-client/tests/router.jshint', function () {

  'use strict';

  module('JSHint - .');
  test('router.js should pass jshint', function() { 
    ok(true, 'router.js should pass jshint.'); 
  });

});
define('elosh-client/tests/routes/about.jshint', function () {

  'use strict';

  module('JSHint - routes');
  test('routes/about.js should pass jshint', function() { 
    ok(true, 'routes/about.js should pass jshint.'); 
  });

});
define('elosh-client/tests/routes/application.jshint', function () {

  'use strict';

  module('JSHint - routes');
  test('routes/application.js should pass jshint', function() { 
    ok(true, 'routes/application.js should pass jshint.'); 
  });

});
define('elosh-client/tests/routes/artwork.jshint', function () {

  'use strict';

  module('JSHint - routes');
  test('routes/artwork.js should pass jshint', function() { 
    ok(true, 'routes/artwork.js should pass jshint.'); 
  });

});
define('elosh-client/tests/routes/artwork/category.jshint', function () {

  'use strict';

  module('JSHint - routes/artwork');
  test('routes/artwork/category.js should pass jshint', function() { 
    ok(true, 'routes/artwork/category.js should pass jshint.'); 
  });

});
define('elosh-client/tests/routes/artwork/category/show.jshint', function () {

  'use strict';

  module('JSHint - routes/artwork/category');
  test('routes/artwork/category/show.js should pass jshint', function() { 
    ok(true, 'routes/artwork/category/show.js should pass jshint.'); 
  });

});
define('elosh-client/tests/routes/artwork/index.jshint', function () {

  'use strict';

  module('JSHint - routes/artwork');
  test('routes/artwork/index.js should pass jshint', function() { 
    ok(true, 'routes/artwork/index.js should pass jshint.'); 
  });

});
define('elosh-client/tests/routes/books/index.jshint', function () {

  'use strict';

  module('JSHint - routes/books');
  test('routes/books/index.js should pass jshint', function() { 
    ok(true, 'routes/books/index.js should pass jshint.'); 
  });

});
define('elosh-client/tests/routes/books/show.jshint', function () {

  'use strict';

  module('JSHint - routes/books');
  test('routes/books/show.js should pass jshint', function() { 
    ok(true, 'routes/books/show.js should pass jshint.'); 
  });

});
define('elosh-client/tests/routes/books/show/book-page.jshint', function () {

  'use strict';

  module('JSHint - routes/books/show');
  test('routes/books/show/book-page.js should pass jshint', function() { 
    ok(true, 'routes/books/show/book-page.js should pass jshint.'); 
  });

});
define('elosh-client/tests/routes/index.jshint', function () {

  'use strict';

  module('JSHint - routes');
  test('routes/index.js should pass jshint', function() { 
    ok(true, 'routes/index.js should pass jshint.'); 
  });

});
define('elosh-client/tests/serializers/about.jshint', function () {

  'use strict';

  module('JSHint - serializers');
  test('serializers/about.js should pass jshint', function() { 
    ok(true, 'serializers/about.js should pass jshint.'); 
  });

});
define('elosh-client/tests/serializers/application.jshint', function () {

  'use strict';

  module('JSHint - serializers');
  test('serializers/application.js should pass jshint', function() { 
    ok(true, 'serializers/application.js should pass jshint.'); 
  });

});
define('elosh-client/tests/serializers/artwork-category.jshint', function () {

  'use strict';

  module('JSHint - serializers');
  test('serializers/artwork-category.js should pass jshint', function() { 
    ok(true, 'serializers/artwork-category.js should pass jshint.'); 
  });

});
define('elosh-client/tests/serializers/artwork.jshint', function () {

  'use strict';

  module('JSHint - serializers');
  test('serializers/artwork.js should pass jshint', function() { 
    ok(true, 'serializers/artwork.js should pass jshint.'); 
  });

});
define('elosh-client/tests/serializers/book.jshint', function () {

  'use strict';

  module('JSHint - serializers');
  test('serializers/book.js should pass jshint', function() { 
    ok(true, 'serializers/book.js should pass jshint.'); 
  });

});
define('elosh-client/tests/test-helper', ['elosh-client/tests/helpers/resolver', 'ember-qunit'], function (resolver, ember_qunit) {

	'use strict';

	ember_qunit.setResolver(resolver['default']);

});
define('elosh-client/tests/test-helper.jshint', function () {

  'use strict';

  module('JSHint - .');
  test('test-helper.js should pass jshint', function() { 
    ok(true, 'test-helper.js should pass jshint.'); 
  });

});
define('elosh-client/tests/unit/initializers/preload-artwork-test', ['ember', 'elosh-client/initializers/preload-artwork'], function (Ember, preload_artwork) {

  'use strict';

  var container, application;

  module('PreloadArtworkInitializer', {
    setup: function setup() {
      Ember['default'].run(function () {
        application = Ember['default'].Application.create();
        container = application.__container__;
        application.deferReadiness();
      });
    }
  });

  // Replace this with your real tests.
  test('it works', function () {
    preload_artwork.initialize(container, application);

    // you would normally confirm the results of the initializer here
    ok(true);
  });

});
define('elosh-client/tests/unit/initializers/preload-artwork-test.jshint', function () {

  'use strict';

  module('JSHint - unit/initializers');
  test('unit/initializers/preload-artwork-test.js should pass jshint', function() { 
    ok(false, 'unit/initializers/preload-artwork-test.js should pass jshint.\nunit/initializers/preload-artwork-test.js: line 6, col 1, \'module\' is not defined.\nunit/initializers/preload-artwork-test.js: line 17, col 1, \'test\' is not defined.\nunit/initializers/preload-artwork-test.js: line 21, col 3, \'ok\' is not defined.\n\n3 errors'); 
  });

});
define('elosh-client/tests/views/application.jshint', function () {

  'use strict';

  module('JSHint - views');
  test('views/application.js should pass jshint', function() { 
    ok(true, 'views/application.js should pass jshint.'); 
  });

});
define('elosh-client/views/application', ['exports', 'ember'], function (exports, Ember) {

	'use strict';

	exports['default'] = Ember['default'].View.extend({});

});
/* jshint ignore:start */

/* jshint ignore:end */

/* jshint ignore:start */

define('elosh-client/config/environment', ['ember'], function(Ember) {
  return { 'default': {"modulePrefix":"elosh-client","environment":"development","baseURL":"/","locationType":"auto","EmberENV":{"FEATURES":{}},"APP":{"name":"elosh-client","version":"0.0.0.cb00ad41"},"contentSecurityPolicyHeader":"Content-Security-Policy-Report-Only","contentSecurityPolicy":{"default-src":"'none'","script-src":"'self' 'unsafe-eval'","font-src":"'self'","connect-src":"'self'","img-src":"'self'","style-src":"'self'","media-src":"'self'"},"exportApplicationGlobal":true}};
});

if (runningTests) {
  require("elosh-client/tests/test-helper");
} else {
  require("elosh-client/app")["default"].create({"name":"elosh-client","version":"0.0.0.cb00ad41"});
}

/* jshint ignore:end */
//# sourceMappingURL=elosh-client.map