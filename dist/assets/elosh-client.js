"use strict";
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
define('elosh-client/adapters/application', ['exports', 'active-model-adapter'], function (exports, ActiveModelAdapter) {

  'use strict';

  exports['default'] = ActiveModelAdapter['default'].extend({
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
define('elosh-client/app', ['exports', 'ember', 'ember/resolver', 'ember/load-initializers', 'elosh-client/config/environment'], function (exports, Ember, Resolver, loadInitializers, config) {

  'use strict';

  var App;

  Ember['default'].MODEL_FACTORY_INJECTIONS = true;

  App = Ember['default'].Application.extend({
    modulePrefix: config['default'].modulePrefix,
    podModulePrefix: config['default'].podModulePrefix,
    Resolver: Resolver['default']
  });

  loadInitializers['default'](App, config['default'].modulePrefix);

  exports['default'] = App;

});
define('elosh-client/components/app-version', ['exports', 'ember-cli-app-version/components/app-version', 'elosh-client/config/environment'], function (exports, AppVersionComponent, config) {

  'use strict';

  var _config$APP = config['default'].APP;
  var name = _config$APP.name;
  var version = _config$APP.version;

  exports['default'] = AppVersionComponent['default'].extend({
    version: version,
    name: name
  });

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

    _update: Ember['default'].on('didReceiveAttrs', function () {
      var _this = this;

      Ember['default'].run.schedule('afterRender', function () {
        return _this._setHeight();
      });
    }),

    _setHeight: function _setHeight() {
      var height = this.get('closedHeight');
      var open = this._checkIfOpen();

      if (open) {
        height = this.$().find('.links').outerHeight() + this.get('closedHeight');
      }

      this.$().css({ height: height });
    },

    _checkIfOpen: function _checkIfOpen() {
      var parentRoute = this.get('currentPath').split('.').objectAt(0);
      return parentRoute === this.get('path');
    }
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
define('elosh-client/controllers/array', ['exports', 'ember'], function (exports, Ember) {

	'use strict';

	exports['default'] = Ember['default'].Controller;

});
define('elosh-client/controllers/object', ['exports', 'ember'], function (exports, Ember) {

	'use strict';

	exports['default'] = Ember['default'].Controller;

});
define('elosh-client/initializers/active-model-adapter', ['exports', 'active-model-adapter', 'active-model-adapter/active-model-serializer'], function (exports, ActiveModelAdapter, ActiveModelSerializer) {

  'use strict';

  exports['default'] = {
    name: 'active-model-adapter',
    initialize: function initialize() {
      var application = arguments[1] || arguments[0];
      application.register('adapter:-active-model', ActiveModelAdapter['default']);
      application.register('serializer:-active-model', ActiveModelSerializer['default']);
    }
  };

});
define('elosh-client/initializers/app-version', ['exports', 'ember-cli-app-version/initializer-factory', 'elosh-client/config/environment'], function (exports, initializerFactory, config) {

  'use strict';

  var _config$APP = config['default'].APP;
  var name = _config$APP.name;
  var version = _config$APP.version;

  exports['default'] = {
    name: 'App Version',
    initialize: initializerFactory['default'](name, version)
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
define('elosh-client/instance-initializers/active-model-adapter', ['exports', 'active-model-adapter', 'active-model-adapter/active-model-serializer'], function (exports, ActiveModelAdapter, ActiveModelSerializer) {

  'use strict';

  exports['default'] = {
    name: 'active-model-adapter',
    initialize: function initialize(applicationOrRegistry) {
      var registry;
      if (applicationOrRegistry.registry) {
        // initializeStoreService was registered with an
        // instanceInitializer. The first argument is the application
        // instance.
        registry = applicationOrRegistry.registry;
      } else {
        // initializeStoreService was called by an initializer instead of
        // an instanceInitializer. The first argument is a registy. This
        // case allows ED to support Ember pre 1.12
        registry = applicationOrRegistry;
      }

      registry.register('adapter:-active-model', ActiveModelAdapter['default']);
      registry.register('serializer:-active-model', ActiveModelSerializer['default']);
    }
  };

});
define('elosh-client/mixins/components/art-modal-close-intent', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Mixin.create({
    closeIntentBindingId: null,

    _setupCloseIntent: Ember['default'].on('didInsertElement', function () {
      this._setCloseIntentBindingId();
      this._setCloseIntent();
    }),

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

    _teardownCloseIntent: Ember['default'].on('willDestroyElement', function () {
      Ember['default'].$(window).off(this.get('closeIntentBindingId'));
    })
  });

});
define('elosh-client/mixins/components/art-modal-height-management', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Mixin.create({
    artModalBindingId: null,

    setupHeightManagement: Ember['default'].on('didInsertElement', function () {
      this._setArtModalBindingId();
      this._setArtModalManagement();
    }),

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

    teardownHeightManagement: Ember['default'].on('willDestroyElement', function () {
      Ember['default'].$(window).off(this.get('artModalBindingId'));
    })
  });

});
define('elosh-client/mixins/components/art-modal-keyboard-navigation', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Mixin.create({
    keyboardNavigationBindingId: null,

    _setupKeyboardNavigation: Ember['default'].on('didInsertElement', function () {
      this._setKeyboardNavigationBindingId();
      this._setKeyboardNavigationManagement();
    }),

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

    _teardownKeyboardNavigationManagement: Ember['default'].on('willDestroyElement', function () {
      Ember['default'].$(window).off(this.get('keyboardNavigationBindingId'));
    })
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
    timers: [],

    progressLoaderDuration: 400,

    _setup: Ember['default'].on('didReceiveAttrs', function () {
      var _this = this;

      this.get('timers').forEach(function (timer) {
        return Ember['default'].run.cancel(timer);
      });

      this.setProperties({
        imageLoaded: false,
        imageDataUrl: null,
        hideOverlay: false,
        timers: []
      });

      Ember['default'].run.schedule('afterRender', function () {
        if (_this.get('progress')) {
          _this.get('progress').destroy();
        }
        _this.set('progress', _this._createProgressBar());
        _this._loadImage();
      });
    }),

    _teardown: Ember['default'].on('willDestroyElement', function () {
      this.get('progress').destroy();
    }),

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
          var p = parseFloat(e.loaded / e.total).toFixed(2);
          var progress = self.get('progress');

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
      var timer = Ember['default'].run.later(this, function () {
        this.set('imageLoaded', true);
        this._hideLoadingOverlay();
      }, this.get('progressLoaderDuration'));

      this.get('timers').addObject(timer);
    },

    _hideLoadingOverlay: function _hideLoadingOverlay() {
      var timer = Ember['default'].run.later(this, function () {
        if (this.get('isDestroyed') || this.get('isDestroying')) {
          return;
        }
        this.set('hideOverlay', true);
      }, 2000); // 2s via .loaded class fades out overlay time

      this.get('timers').addObject(timer);
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

    this.route('artwork', function () {
      this.route('category', { path: ':category_slug' }, function () {
        this.route('show', { path: ':artwork_slug' });
      });
    });

    this.route('books', function () {
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
        books: store.query('book', { 'action': 'get_books' }),
        artworkCategories: store.query('artworkCategory', { 'action': 'get_artwork_categories' }),
        contact: store.find('contact', 1),
        about: store.find('about', 1),
        artwork: store.query('artwork', { 'action': 'get_artwork' })
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
define('elosh-client/routes/artwork/category/show', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Route.extend({

    model: function model(params) {
      var artwork = this.store.peekAll('artwork'),
          art = artwork.findBy('slug', params.artwork_slug);

      return art ? art : {};
    },

    renderTemplate: function renderTemplate(controller) {
      this.send('openModal', { template: 'artwork.category.show', controller: controller });
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
          artworkCategories = this.store.peekAll('artworkCategory'),
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
define('elosh-client/routes/artwork/index', ['exports', 'ember', 'elosh-client/mixins/routes/redirect-to-first-item'], function (exports, Ember, RedirectToFirstItem) {

  'use strict';

  exports['default'] = Ember['default'].Route.extend(RedirectToFirstItem['default'], {

    appModelName: 'artworkCategories',
    appModelRoute: 'artwork.category'

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
define('elosh-client/routes/books/index', ['exports', 'ember', 'elosh-client/mixins/routes/redirect-to-first-item'], function (exports, Ember, RedirectToFirstItem) {

  'use strict';

  exports['default'] = Ember['default'].Route.extend(RedirectToFirstItem['default'], {

    appModelName: 'books',
    appModelRoute: 'books.show'

  });

});
define('elosh-client/routes/books/show/book-page', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Route.extend({

    model: function model(params) {
      var artwork = this.store.peekAll('artwork'),
          art = artwork.findBy('slug', params.book_page);

      return art ? art : {};
    },

    renderTemplate: function renderTemplate(controller) {
      this.send('openModal', { template: 'books.show.bookPage', controller: controller });
    }

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
      var books = this.store.peekAll('book'),
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
define('elosh-client/serializers/application', ['exports', 'active-model-adapter'], function (exports, active_model_adapter) {

  'use strict';

  exports['default'] = active_model_adapter.ActiveModelSerializer.extend({
    isNewSerializerAPI: true
  });

});
define('elosh-client/serializers/artwork-category', ['exports', 'elosh-client/serializers/application'], function (exports, ApplicationSerializer) {

  'use strict';

  exports['default'] = ApplicationSerializer['default'].extend({
    normalizeResponse: function normalizeResponse(store, primaryModelClass, payload, id, requestType) {
      payload.artwork_categories.forEach(function (category) {
        category.id = category.term_id;
      });
      return this._super(store, primaryModelClass, payload, id, requestType);
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
          meta: {
            "topLevel": null,
            "revision": "Ember@2.1.0",
            "loc": {
              "source": null,
              "start": {
                "line": 8,
                "column": 8
              },
              "end": {
                "line": 10,
                "column": 8
              }
            },
            "moduleName": "elosh-client/templates/about.hbs"
          },
          isEmpty: false,
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
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
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var element1 = dom.childAt(fragment, [1, 0]);
            var morphs = new Array(2);
            morphs[0] = dom.createAttrMorph(element1, 'href');
            morphs[1] = dom.createMorphAt(element1,0,0);
            return morphs;
          },
          statements: [
            ["attribute","href",["concat",[["get","model.contact.mailTo",["loc",[null,[9,24],[9,44]]]]]]],
            ["content","model.contact.email",["loc",[null,[9,88],[9,111]]]]
          ],
          locals: [],
          templates: []
        };
      }());
      var child1 = (function() {
        return {
          meta: {
            "topLevel": null,
            "revision": "Ember@2.1.0",
            "loc": {
              "source": null,
              "start": {
                "line": 11,
                "column": 8
              },
              "end": {
                "line": 13,
                "column": 8
              }
            },
            "moduleName": "elosh-client/templates/about.hbs"
          },
          isEmpty: false,
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
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
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var morphs = new Array(1);
            morphs[0] = dom.createMorphAt(dom.childAt(fragment, [1]),0,0);
            return morphs;
          },
          statements: [
            ["content","model.contact.phone",["loc",[null,[12,13],[12,36]]]]
          ],
          locals: [],
          templates: []
        };
      }());
      var child2 = (function() {
        return {
          meta: {
            "topLevel": null,
            "revision": "Ember@2.1.0",
            "loc": {
              "source": null,
              "start": {
                "line": 14,
                "column": 8
              },
              "end": {
                "line": 16,
                "column": 8
              }
            },
            "moduleName": "elosh-client/templates/about.hbs"
          },
          isEmpty: false,
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
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
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var element0 = dom.childAt(fragment, [1, 1]);
            var morphs = new Array(2);
            morphs[0] = dom.createAttrMorph(element0, 'href');
            morphs[1] = dom.createMorphAt(element0,1,1);
            return morphs;
          },
          statements: [
            ["attribute","href",["concat",[["get","model.contact.twitterLink",["loc",[null,[15,33],[15,58]]]]]]],
            ["content","model.contact.twitter",["loc",[null,[15,107],[15,132]]]]
          ],
          locals: [],
          templates: []
        };
      }());
      var child3 = (function() {
        return {
          meta: {
            "topLevel": null,
            "revision": "Ember@2.1.0",
            "loc": {
              "source": null,
              "start": {
                "line": 19,
                "column": 6
              },
              "end": {
                "line": 23,
                "column": 6
              }
            },
            "moduleName": "elosh-client/templates/about.hbs"
          },
          isEmpty: false,
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
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
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var morphs = new Array(1);
            morphs[0] = dom.createUnsafeMorphAt(dom.childAt(fragment, [1]),1,1);
            return morphs;
          },
          statements: [
            ["content","model.about.narrativeOne",["loc",[null,[21,10],[21,40]]]]
          ],
          locals: [],
          templates: []
        };
      }());
      var child4 = (function() {
        return {
          meta: {
            "topLevel": null,
            "revision": "Ember@2.1.0",
            "loc": {
              "source": null,
              "start": {
                "line": 25,
                "column": 6
              },
              "end": {
                "line": 30,
                "column": 6
              }
            },
            "moduleName": "elosh-client/templates/about.hbs"
          },
          isEmpty: false,
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
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
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var morphs = new Array(1);
            morphs[0] = dom.createUnsafeMorphAt(dom.childAt(fragment, [3]),1,1);
            return morphs;
          },
          statements: [
            ["content","model.about.narrativeTwo",["loc",[null,[28,10],[28,40]]]]
          ],
          locals: [],
          templates: []
        };
      }());
      return {
        meta: {
          "topLevel": null,
          "revision": "Ember@2.1.0",
          "loc": {
            "source": null,
            "start": {
              "line": 4,
              "column": 2
            },
            "end": {
              "line": 32,
              "column": 2
            }
          },
          "moduleName": "elosh-client/templates/about.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
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
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var element2 = dom.childAt(fragment, [1]);
          var element3 = dom.childAt(element2, [1]);
          var morphs = new Array(5);
          morphs[0] = dom.createMorphAt(element3,3,3);
          morphs[1] = dom.createMorphAt(element3,4,4);
          morphs[2] = dom.createMorphAt(element3,5,5);
          morphs[3] = dom.createMorphAt(element2,3,3);
          morphs[4] = dom.createMorphAt(element2,5,5);
          return morphs;
        },
        statements: [
          ["block","if",[["get","model.contact.email",["loc",[null,[8,14],[8,33]]]]],[],0,null,["loc",[null,[8,8],[10,15]]]],
          ["block","if",[["get","model.contact.phone",["loc",[null,[11,14],[11,33]]]]],[],1,null,["loc",[null,[11,8],[13,15]]]],
          ["block","if",[["get","model.contact.twitter",["loc",[null,[14,14],[14,35]]]]],[],2,null,["loc",[null,[14,8],[16,15]]]],
          ["block","if",[["get","model.about.narrativeOne",["loc",[null,[19,12],[19,36]]]]],[],3,null,["loc",[null,[19,6],[23,13]]]],
          ["block","if",[["get","model.about.narrativeTwo",["loc",[null,[25,12],[25,36]]]]],[],4,null,["loc",[null,[25,6],[30,13]]]]
        ],
        locals: [],
        templates: [child0, child1, child2, child3, child4]
      };
    }());
    return {
      meta: {
        "topLevel": null,
        "revision": "Ember@2.1.0",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 35,
            "column": 0
          }
        },
        "moduleName": "elosh-client/templates/about.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
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
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var element4 = dom.childAt(fragment, [0]);
        var element5 = dom.childAt(element4, [1]);
        var morphs = new Array(2);
        morphs[0] = dom.createAttrMorph(element5, 'src');
        morphs[1] = dom.createMorphAt(element4,3,3);
        return morphs;
      },
      statements: [
        ["attribute","src",["concat",[["get","model.about.image.url",["loc",[null,[2,14],[2,35]]]]]]],
        ["block","max-width",[],["width",["subexpr","@mut",[["get","model.about.image.width",["loc",[null,[4,21],[4,44]]]]],[],[]]],0,null,["loc",[null,[4,2],[32,16]]]]
      ],
      locals: [],
      templates: [child0]
    };
  }()));

});
define('elosh-client/templates/application', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      return {
        meta: {
          "topLevel": null,
          "revision": "Ember@2.1.0",
          "loc": {
            "source": null,
            "start": {
              "line": 3,
              "column": 4
            },
            "end": {
              "line": 3,
              "column": 65
            }
          },
          "moduleName": "elosh-client/templates/application.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createElement("img");
          dom.setAttribute(el1,"alt","Eric Losh");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var element0 = dom.childAt(fragment, [0]);
          var morphs = new Array(1);
          morphs[0] = dom.createAttrMorph(element0, 'src');
          return morphs;
        },
        statements: [
          ["attribute","src",["concat",[["get","logoURL",["loc",[null,[3,36],[3,43]]]]]]]
        ],
        locals: [],
        templates: []
      };
    }());
    return {
      meta: {
        "topLevel": false,
        "revision": "Ember@2.1.0",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 25,
            "column": 0
          }
        },
        "moduleName": "elosh-client/templates/application.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
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
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var element1 = dom.childAt(fragment, [0]);
        var element2 = dom.childAt(element1, [5, 1]);
        var element3 = dom.childAt(fragment, [4]);
        var morphs = new Array(6);
        morphs[0] = dom.createMorphAt(dom.childAt(element1, [1]),1,1);
        morphs[1] = dom.createMorphAt(element1,3,3);
        morphs[2] = dom.createAttrMorph(element2, 'src');
        morphs[3] = dom.createMorphAt(dom.childAt(fragment, [2, 1, 1]),1,1);
        morphs[4] = dom.createAttrMorph(element3, 'class');
        morphs[5] = dom.createMorphAt(dom.childAt(element3, [1]),1,1);
        return morphs;
      },
      statements: [
        ["block","link-to",["index"],[],0,null,["loc",[null,[3,4],[3,77]]]],
        ["inline","partial",["partials/main-navigation"],[],["loc",[null,[5,2],[5,40]]]],
        ["attribute","src",["concat",[["get","footerLogoURL",["loc",[null,[7,16],[7,29]]]]]]],
        ["content","outlet",["loc",[null,[15,6],[15,16]]]],
        ["attribute","class",["concat",[["subexpr","if",[["get","modalOpen",["loc",[null,[20,28],[20,37]]]],"show"],[],["loc",[null,[20,23],[20,46]]]]]]],
        ["inline","outlet",["modal"],[],["loc",[null,[22,4],[22,22]]]]
      ],
      locals: [],
      templates: [child0]
    };
  }()));

});
define('elosh-client/templates/artwork/category/show', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      meta: {
        "topLevel": null,
        "revision": "Ember@2.1.0",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 2,
            "column": 0
          }
        },
        "moduleName": "elosh-client/templates/artwork/category/show.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(1);
        morphs[0] = dom.createMorphAt(fragment,0,0,contextualElement);
        dom.insertBoundary(fragment, 0);
        return morphs;
      },
      statements: [
        ["inline","art-modal",[],["art",["subexpr","@mut",[["get","model",["loc",[null,[1,16],[1,21]]]]],[],[]],"closeModal","closeModal","nextItem","nextItem","previousItem","previousItem"],["loc",[null,[1,0],[1,95]]]]
      ],
      locals: [],
      templates: []
    };
  }()));

});
define('elosh-client/templates/artwork/category', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      return {
        meta: {
          "topLevel": null,
          "revision": "Ember@2.1.0",
          "loc": {
            "source": null,
            "start": {
              "line": 2,
              "column": 0
            },
            "end": {
              "line": 6,
              "column": 0
            }
          },
          "moduleName": "elosh-client/templates/artwork/category.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
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
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var element0 = dom.childAt(fragment, [1, 1]);
          var morphs = new Array(2);
          morphs[0] = dom.createAttrMorph(element0, 'src');
          morphs[1] = dom.createAttrMorph(element0, 'alt');
          return morphs;
        },
        statements: [
          ["attribute","src",["concat",[["get","model.category.categoryDescription",["loc",[null,[4,16],[4,50]]]]]]],
          ["attribute","alt",["concat",[["get","model.category.name",["loc",[null,[4,61],[4,80]]]]]]]
        ],
        locals: [],
        templates: []
      };
    }());
    return {
      meta: {
        "topLevel": false,
        "revision": "Ember@2.1.0",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 9,
            "column": 0
          }
        },
        "moduleName": "elosh-client/templates/artwork/category.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
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
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(3);
        morphs[0] = dom.createMorphAt(dom.childAt(fragment, [0]),0,0);
        morphs[1] = dom.createMorphAt(fragment,2,2,contextualElement);
        morphs[2] = dom.createMorphAt(fragment,4,4,contextualElement);
        return morphs;
      },
      statements: [
        ["content","model.category.name",["loc",[null,[1,35],[1,58]]]],
        ["block","if",[["get","model.category.categoryDescription",["loc",[null,[2,6],[2,40]]]]],[],0,null,["loc",[null,[2,0],[6,7]]]],
        ["inline","partial",["partials/artwork-thumbnails"],[],["loc",[null,[8,0],[8,41]]]]
      ],
      locals: [],
      templates: [child0]
    };
  }()));

});
define('elosh-client/templates/books/show/book-page', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      meta: {
        "topLevel": null,
        "revision": "Ember@2.1.0",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 2,
            "column": 0
          }
        },
        "moduleName": "elosh-client/templates/books/show/book-page.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(1);
        morphs[0] = dom.createMorphAt(fragment,0,0,contextualElement);
        dom.insertBoundary(fragment, 0);
        return morphs;
      },
      statements: [
        ["inline","art-modal",[],["art",["subexpr","@mut",[["get","model",["loc",[null,[1,16],[1,21]]]]],[],[]],"closeModal","closeModal","nextItem","nextItem","previousItem","previousItem"],["loc",[null,[1,0],[1,95]]]]
      ],
      locals: [],
      templates: []
    };
  }()));

});
define('elosh-client/templates/books/show', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      return {
        meta: {
          "topLevel": null,
          "revision": "Ember@2.1.0",
          "loc": {
            "source": null,
            "start": {
              "line": 2,
              "column": 2
            },
            "end": {
              "line": 4,
              "column": 2
            }
          },
          "moduleName": "elosh-client/templates/books/show.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
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
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var element0 = dom.childAt(fragment, [1]);
          var morphs = new Array(2);
          morphs[0] = dom.createMorphAt(element0,0,0);
          morphs[1] = dom.createMorphAt(dom.childAt(element0, [2]),1,1);
          return morphs;
        },
        statements: [
          ["content","model.title",["loc",[null,[3,27],[3,42]]]],
          ["content","model.titleNotes",["loc",[null,[3,51],[3,71]]]]
        ],
        locals: [],
        templates: []
      };
    }());
    var child1 = (function() {
      return {
        meta: {
          "topLevel": null,
          "revision": "Ember@2.1.0",
          "loc": {
            "source": null,
            "start": {
              "line": 4,
              "column": 2
            },
            "end": {
              "line": 6,
              "column": 2
            }
          },
          "moduleName": "elosh-client/templates/books/show.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
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
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(dom.childAt(fragment, [1]),0,0);
          return morphs;
        },
        statements: [
          ["content","model.title",["loc",[null,[5,27],[5,42]]]]
        ],
        locals: [],
        templates: []
      };
    }());
    return {
      meta: {
        "topLevel": null,
        "revision": "Ember@2.1.0",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 32,
            "column": 0
          }
        },
        "moduleName": "elosh-client/templates/books/show.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
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
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var element1 = dom.childAt(fragment, [0]);
        var element2 = dom.childAt(element1, [3]);
        var element3 = dom.childAt(element2, [1, 1]);
        var element4 = dom.childAt(element2, [3, 1]);
        var element5 = dom.childAt(element1, [5]);
        var morphs = new Array(5);
        morphs[0] = dom.createMorphAt(element1,1,1);
        morphs[1] = dom.createAttrMorph(element3, 'src');
        morphs[2] = dom.createAttrMorph(element4, 'src');
        morphs[3] = dom.createUnsafeMorphAt(dom.childAt(element5, [1, 1]),1,1);
        morphs[4] = dom.createMorphAt(dom.childAt(element5, [3, 1]),1,1);
        return morphs;
      },
      statements: [
        ["block","if",[["get","model.titleNotes",["loc",[null,[2,8],[2,24]]]]],[],0,1,["loc",[null,[2,2],[6,9]]]],
        ["attribute","src",["concat",[["get","model.bannerImage.url",["loc",[null,[10,18],[10,39]]]]]]],
        ["attribute","src",["concat",[["get","model.coverImage.url",["loc",[null,[13,18],[13,38]]]]]]],
        ["content","model.narrative",["loc",[null,[20,8],[20,29]]]],
        ["inline","partial",["partials/book-thumbnails"],[],["loc",[null,[26,8],[26,46]]]]
      ],
      locals: [],
      templates: [child0, child1]
    };
  }()));

});
define('elosh-client/templates/components/art-modal', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      return {
        meta: {
          "topLevel": null,
          "revision": "Ember@2.1.0",
          "loc": {
            "source": null,
            "start": {
              "line": 2,
              "column": 2
            },
            "end": {
              "line": 4,
              "column": 2
            }
          },
          "moduleName": "elosh-client/templates/components/art-modal.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("    ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("img");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var element0 = dom.childAt(fragment, [1]);
          var morphs = new Array(2);
          morphs[0] = dom.createAttrMorph(element0, 'src');
          morphs[1] = dom.createAttrMorph(element0, 'alt');
          return morphs;
        },
        statements: [
          ["attribute","src",["concat",[["get","imageDataUrl",["loc",[null,[3,16],[3,28]]]]]]],
          ["attribute","alt",["concat",[["get","art.title",["loc",[null,[3,39],[3,48]]]]]]]
        ],
        locals: [],
        templates: []
      };
    }());
    var child1 = (function() {
      return {
        meta: {
          "topLevel": null,
          "revision": "Ember@2.1.0",
          "loc": {
            "source": null,
            "start": {
              "line": 7,
              "column": 2
            },
            "end": {
              "line": 7,
              "column": 57
            }
          },
          "moduleName": "elosh-client/templates/components/art-modal.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createElement("p");
          dom.setAttribute(el1,"class","art-title");
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(dom.childAt(fragment, [0]),0,0);
          return morphs;
        },
        statements: [
          ["content","art.title",["loc",[null,[7,40],[7,53]]]]
        ],
        locals: [],
        templates: []
      };
    }());
    var child2 = (function() {
      return {
        meta: {
          "topLevel": null,
          "revision": "Ember@2.1.0",
          "loc": {
            "source": null,
            "start": {
              "line": 8,
              "column": 2
            },
            "end": {
              "line": 8,
              "column": 66
            }
          },
          "moduleName": "elosh-client/templates/components/art-modal.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createElement("p");
          dom.setAttribute(el1,"class","book-title");
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(dom.childAt(fragment, [0]),0,0);
          return morphs;
        },
        statements: [
          ["content","art.bookTitle",["loc",[null,[8,45],[8,62]]]]
        ],
        locals: [],
        templates: []
      };
    }());
    var child3 = (function() {
      return {
        meta: {
          "topLevel": null,
          "revision": "Ember@2.1.0",
          "loc": {
            "source": null,
            "start": {
              "line": 9,
              "column": 2
            },
            "end": {
              "line": 9,
              "column": 60
            }
          },
          "moduleName": "elosh-client/templates/components/art-modal.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createElement("p");
          dom.setAttribute(el1,"class","art-medium");
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(dom.childAt(fragment, [0]),0,0);
          return morphs;
        },
        statements: [
          ["content","art.medium",["loc",[null,[9,42],[9,56]]]]
        ],
        locals: [],
        templates: []
      };
    }());
    var child4 = (function() {
      return {
        meta: {
          "topLevel": null,
          "revision": "Ember@2.1.0",
          "loc": {
            "source": null,
            "start": {
              "line": 10,
              "column": 2
            },
            "end": {
              "line": 10,
              "column": 81
            }
          },
          "moduleName": "elosh-client/templates/components/art-modal.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createElement("div");
          dom.setAttribute(el1,"class","art-description");
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createUnsafeMorphAt(dom.childAt(fragment, [0]),0,0);
          return morphs;
        },
        statements: [
          ["content","art.description",["loc",[null,[10,54],[10,75]]]]
        ],
        locals: [],
        templates: []
      };
    }());
    return {
      meta: {
        "topLevel": false,
        "revision": "Ember@2.1.0",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 18,
            "column": 0
          }
        },
        "moduleName": "elosh-client/templates/components/art-modal.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
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
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var element1 = dom.childAt(fragment, [2]);
        var element2 = dom.childAt(fragment, [4]);
        var element3 = dom.childAt(fragment, [6]);
        var element4 = dom.childAt(fragment, [8]);
        var element5 = dom.childAt(fragment, [10]);
        var morphs = new Array(9);
        morphs[0] = dom.createMorphAt(dom.childAt(fragment, [0]),1,1);
        morphs[1] = dom.createMorphAt(element1,1,1);
        morphs[2] = dom.createMorphAt(element1,3,3);
        morphs[3] = dom.createMorphAt(element1,5,5);
        morphs[4] = dom.createMorphAt(element1,7,7);
        morphs[5] = dom.createAttrMorph(element2, 'class');
        morphs[6] = dom.createElementMorph(element3);
        morphs[7] = dom.createElementMorph(element4);
        morphs[8] = dom.createElementMorph(element5);
        return morphs;
      },
      statements: [
        ["block","if",[["get","imageDataUrl",["loc",[null,[2,8],[2,20]]]]],[],0,null,["loc",[null,[2,2],[4,9]]]],
        ["block","if",[["get","art.title",["loc",[null,[7,8],[7,17]]]]],[],1,null,["loc",[null,[7,2],[7,64]]]],
        ["block","if",[["get","art.bookTitle",["loc",[null,[8,8],[8,21]]]]],[],2,null,["loc",[null,[8,2],[8,73]]]],
        ["block","if",[["get","art.medium",["loc",[null,[9,8],[9,18]]]]],[],3,null,["loc",[null,[9,2],[9,67]]]],
        ["block","if",[["get","art.description",["loc",[null,[10,8],[10,23]]]]],[],4,null,["loc",[null,[10,2],[10,88]]]],
        ["attribute","class",["concat",["loading-overlay ",["subexpr","if",[["get","imageLoaded",["loc",[null,[12,33],[12,44]]]],"loaded"],[],["loc",[null,[12,28],[12,55]]]]," ",["subexpr","if",[["get","hideOverlay",["loc",[null,[12,61],[12,72]]]],"hide"],[],["loc",[null,[12,56],[12,81]]]]]]],
        ["element","action",["previousItem"],[],["loc",[null,[15,46],[15,71]]]],
        ["element","action",["nextItem"],[],["loc",[null,[16,42],[16,63]]]],
        ["element","action",["closeModal"],[],["loc",[null,[17,43],[17,66]]]]
      ],
      locals: [],
      templates: [child0, child1, child2, child3, child4]
    };
  }()));

});
define('elosh-client/templates/components/max-width', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      meta: {
        "topLevel": null,
        "revision": "Ember@2.1.0",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 2,
            "column": 0
          }
        },
        "moduleName": "elosh-client/templates/components/max-width.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(1);
        morphs[0] = dom.createMorphAt(fragment,0,0,contextualElement);
        dom.insertBoundary(fragment, 0);
        return morphs;
      },
      statements: [
        ["content","yield",["loc",[null,[1,0],[1,9]]]]
      ],
      locals: [],
      templates: []
    };
  }()));

});
define('elosh-client/templates/components/nav-section', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      meta: {
        "topLevel": null,
        "revision": "Ember@2.1.0",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 2,
            "column": 0
          }
        },
        "moduleName": "elosh-client/templates/components/nav-section.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(1);
        morphs[0] = dom.createMorphAt(fragment,0,0,contextualElement);
        dom.insertBoundary(fragment, 0);
        return morphs;
      },
      statements: [
        ["content","yield",["loc",[null,[1,0],[1,9]]]]
      ],
      locals: [],
      templates: []
    };
  }()));

});
define('elosh-client/templates/loading', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      meta: {
        "topLevel": null,
        "revision": "Ember@2.1.0",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 6,
            "column": 0
          }
        },
        "moduleName": "elosh-client/templates/loading.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
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
      buildRenderNodes: function buildRenderNodes() { return []; },
      statements: [

      ],
      locals: [],
      templates: []
    };
  }()));

});
define('elosh-client/templates/partials/-artwork-thumbnails', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      return {
        meta: {
          "topLevel": null,
          "revision": "Ember@2.1.0",
          "loc": {
            "source": null,
            "start": {
              "line": 2,
              "column": 2
            },
            "end": {
              "line": 9,
              "column": 2
            }
          },
          "moduleName": "elosh-client/templates/partials/-artwork-thumbnails.hbs"
        },
        isEmpty: false,
        arity: 1,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
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
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var element0 = dom.childAt(fragment, [1]);
          var element1 = dom.childAt(element0, [1]);
          var morphs = new Array(4);
          morphs[0] = dom.createElementMorph(element0);
          morphs[1] = dom.createAttrMorph(element1, 'src');
          morphs[2] = dom.createAttrMorph(element1, 'alt');
          morphs[3] = dom.createMorphAt(dom.childAt(element0, [3, 1]),0,0);
          return morphs;
        },
        statements: [
          ["element","action",["linkToArtModal",["get","art",["loc",[null,[3,34],[3,37]]]]],[],["loc",[null,[3,8],[3,39]]]],
          ["attribute","src",["concat",[["get","art.thumbnail.url",["loc",[null,[4,18],[4,35]]]]]]],
          ["attribute","alt",["concat",[["get","art.title",["loc",[null,[4,46],[4,55]]]]]]],
          ["content","art.title",["loc",[null,[6,20],[6,33]]]]
        ],
        locals: ["art"],
        templates: []
      };
    }());
    return {
      meta: {
        "topLevel": null,
        "revision": "Ember@2.1.0",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 11,
            "column": 0
          }
        },
        "moduleName": "elosh-client/templates/partials/-artwork-thumbnails.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
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
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(1);
        morphs[0] = dom.createMorphAt(dom.childAt(fragment, [0]),1,1);
        return morphs;
      },
      statements: [
        ["block","each",[["get","model.artwork",["loc",[null,[2,10],[2,23]]]]],[],0,null,["loc",[null,[2,2],[9,11]]]]
      ],
      locals: [],
      templates: [child0]
    };
  }()));

});
define('elosh-client/templates/partials/-book-thumbnails', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      return {
        meta: {
          "topLevel": null,
          "revision": "Ember@2.1.0",
          "loc": {
            "source": null,
            "start": {
              "line": 2,
              "column": 2
            },
            "end": {
              "line": 8,
              "column": 2
            }
          },
          "moduleName": "elosh-client/templates/partials/-book-thumbnails.hbs"
        },
        isEmpty: false,
        arity: 1,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
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
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var element0 = dom.childAt(fragment, [1, 1]);
          var element1 = dom.childAt(element0, [1]);
          var morphs = new Array(3);
          morphs[0] = dom.createElementMorph(element0);
          morphs[1] = dom.createAttrMorph(element1, 'src');
          morphs[2] = dom.createAttrMorph(element1, 'alt');
          return morphs;
        },
        statements: [
          ["element","action",["linkToArtModal",["get","bookPage",["loc",[null,[4,44],[4,52]]]]],[],["loc",[null,[4,18],[4,54]]]],
          ["attribute","src",["concat",[["get","bookPage.thumbnail.url",["loc",[null,[5,20],[5,42]]]]]]],
          ["attribute","alt",["concat",[["get","bookPage.title",["loc",[null,[5,53],[5,67]]]]]]]
        ],
        locals: ["bookPage"],
        templates: []
      };
    }());
    return {
      meta: {
        "topLevel": null,
        "revision": "Ember@2.1.0",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 10,
            "column": 0
          }
        },
        "moduleName": "elosh-client/templates/partials/-book-thumbnails.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
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
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(1);
        morphs[0] = dom.createMorphAt(dom.childAt(fragment, [0]),1,1);
        return morphs;
      },
      statements: [
        ["block","each",[["get","model.bookPages",["loc",[null,[2,10],[2,25]]]]],[],0,null,["loc",[null,[2,2],[8,11]]]]
      ],
      locals: [],
      templates: [child0]
    };
  }()));

});
define('elosh-client/templates/partials/-main-navigation', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      var child0 = (function() {
        return {
          meta: {
            "topLevel": null,
            "revision": "Ember@2.1.0",
            "loc": {
              "source": null,
              "start": {
                "line": 5,
                "column": 6
              },
              "end": {
                "line": 5,
                "column": 68
              }
            },
            "moduleName": "elosh-client/templates/partials/-main-navigation.hbs"
          },
          isEmpty: false,
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("Artwork");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes() { return []; },
          statements: [

          ],
          locals: [],
          templates: []
        };
      }());
      var child1 = (function() {
        var child0 = (function() {
          return {
            meta: {
              "topLevel": null,
              "revision": "Ember@2.1.0",
              "loc": {
                "source": null,
                "start": {
                  "line": 8,
                  "column": 10
                },
                "end": {
                  "line": 8,
                  "column": 86
                }
              },
              "moduleName": "elosh-client/templates/partials/-main-navigation.hbs"
            },
            isEmpty: false,
            arity: 0,
            cachedFragment: null,
            hasRendered: false,
            buildFragment: function buildFragment(dom) {
              var el0 = dom.createDocumentFragment();
              var el1 = dom.createComment("");
              dom.appendChild(el0, el1);
              return el0;
            },
            buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
              var morphs = new Array(1);
              morphs[0] = dom.createMorphAt(fragment,0,0,contextualElement);
              dom.insertBoundary(fragment, 0);
              dom.insertBoundary(fragment, null);
              return morphs;
            },
            statements: [
              ["content","artworkCategory.name",["loc",[null,[8,62],[8,86]]]]
            ],
            locals: [],
            templates: []
          };
        }());
        return {
          meta: {
            "topLevel": null,
            "revision": "Ember@2.1.0",
            "loc": {
              "source": null,
              "start": {
                "line": 7,
                "column": 8
              },
              "end": {
                "line": 9,
                "column": 8
              }
            },
            "moduleName": "elosh-client/templates/partials/-main-navigation.hbs"
          },
          isEmpty: false,
          arity: 1,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("          ");
            dom.appendChild(el0, el1);
            var el1 = dom.createComment("");
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var morphs = new Array(1);
            morphs[0] = dom.createMorphAt(fragment,1,1,contextualElement);
            return morphs;
          },
          statements: [
            ["block","link-to",["artwork.category",["get","artworkCategory.slug",["loc",[null,[8,40],[8,60]]]]],[],0,null,["loc",[null,[8,10],[8,98]]]]
          ],
          locals: ["artworkCategory"],
          templates: [child0]
        };
      }());
      return {
        meta: {
          "topLevel": null,
          "revision": "Ember@2.1.0",
          "loc": {
            "source": null,
            "start": {
              "line": 4,
              "column": 4
            },
            "end": {
              "line": 11,
              "column": 4
            }
          },
          "moduleName": "elosh-client/templates/partials/-main-navigation.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
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
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(2);
          morphs[0] = dom.createMorphAt(fragment,1,1,contextualElement);
          morphs[1] = dom.createMorphAt(dom.childAt(fragment, [3]),1,1);
          return morphs;
        },
        statements: [
          ["block","link-to",["artwork"],["classNames","parent-link artwork"],0,null,["loc",[null,[5,6],[5,80]]]],
          ["block","each",[["get","model.artworkCategories",["loc",[null,[7,16],[7,39]]]]],[],1,null,["loc",[null,[7,8],[9,17]]]]
        ],
        locals: [],
        templates: [child0, child1]
      };
    }());
    var child1 = (function() {
      var child0 = (function() {
        return {
          meta: {
            "topLevel": null,
            "revision": "Ember@2.1.0",
            "loc": {
              "source": null,
              "start": {
                "line": 15,
                "column": 6
              },
              "end": {
                "line": 15,
                "column": 62
              }
            },
            "moduleName": "elosh-client/templates/partials/-main-navigation.hbs"
          },
          isEmpty: false,
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("Books");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes() { return []; },
          statements: [

          ],
          locals: [],
          templates: []
        };
      }());
      var child1 = (function() {
        var child0 = (function() {
          return {
            meta: {
              "topLevel": null,
              "revision": "Ember@2.1.0",
              "loc": {
                "source": null,
                "start": {
                  "line": 18,
                  "column": 10
                },
                "end": {
                  "line": 18,
                  "column": 59
                }
              },
              "moduleName": "elosh-client/templates/partials/-main-navigation.hbs"
            },
            isEmpty: false,
            arity: 0,
            cachedFragment: null,
            hasRendered: false,
            buildFragment: function buildFragment(dom) {
              var el0 = dom.createDocumentFragment();
              var el1 = dom.createComment("");
              dom.appendChild(el0, el1);
              return el0;
            },
            buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
              var morphs = new Array(1);
              morphs[0] = dom.createMorphAt(fragment,0,0,contextualElement);
              dom.insertBoundary(fragment, 0);
              dom.insertBoundary(fragment, null);
              return morphs;
            },
            statements: [
              ["content","book.title",["loc",[null,[18,45],[18,59]]]]
            ],
            locals: [],
            templates: []
          };
        }());
        return {
          meta: {
            "topLevel": null,
            "revision": "Ember@2.1.0",
            "loc": {
              "source": null,
              "start": {
                "line": 17,
                "column": 8
              },
              "end": {
                "line": 19,
                "column": 8
              }
            },
            "moduleName": "elosh-client/templates/partials/-main-navigation.hbs"
          },
          isEmpty: false,
          arity: 1,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("          ");
            dom.appendChild(el0, el1);
            var el1 = dom.createComment("");
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var morphs = new Array(1);
            morphs[0] = dom.createMorphAt(fragment,1,1,contextualElement);
            return morphs;
          },
          statements: [
            ["block","link-to",["books.show",["get","book.slug",["loc",[null,[18,34],[18,43]]]]],[],0,null,["loc",[null,[18,10],[18,71]]]]
          ],
          locals: ["book"],
          templates: [child0]
        };
      }());
      return {
        meta: {
          "topLevel": null,
          "revision": "Ember@2.1.0",
          "loc": {
            "source": null,
            "start": {
              "line": 14,
              "column": 4
            },
            "end": {
              "line": 21,
              "column": 4
            }
          },
          "moduleName": "elosh-client/templates/partials/-main-navigation.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
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
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(2);
          morphs[0] = dom.createMorphAt(fragment,1,1,contextualElement);
          morphs[1] = dom.createMorphAt(dom.childAt(fragment, [3]),1,1);
          return morphs;
        },
        statements: [
          ["block","link-to",["books"],["classNames","parent-link books"],0,null,["loc",[null,[15,6],[15,74]]]],
          ["block","each",[["get","model.books",["loc",[null,[17,16],[17,27]]]]],[],1,null,["loc",[null,[17,8],[19,17]]]]
        ],
        locals: [],
        templates: [child0, child1]
      };
    }());
    var child2 = (function() {
      var child0 = (function() {
        return {
          meta: {
            "topLevel": null,
            "revision": "Ember@2.1.0",
            "loc": {
              "source": null,
              "start": {
                "line": 28,
                "column": 8
              },
              "end": {
                "line": 30,
                "column": 8
              }
            },
            "moduleName": "elosh-client/templates/partials/-main-navigation.hbs"
          },
          isEmpty: false,
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
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
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var element0 = dom.childAt(fragment, [1, 0]);
            var morphs = new Array(2);
            morphs[0] = dom.createAttrMorph(element0, 'href');
            morphs[1] = dom.createMorphAt(element0,0,0);
            return morphs;
          },
          statements: [
            ["attribute","href",["concat",[["get","model.contact.mailTo",["loc",[null,[29,24],[29,44]]]]]]],
            ["content","model.contact.email",["loc",[null,[29,88],[29,111]]]]
          ],
          locals: [],
          templates: []
        };
      }());
      return {
        meta: {
          "topLevel": null,
          "revision": "Ember@2.1.0",
          "loc": {
            "source": null,
            "start": {
              "line": 24,
              "column": 4
            },
            "end": {
              "line": 32,
              "column": 4
            }
          },
          "moduleName": "elosh-client/templates/partials/-main-navigation.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
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
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var element1 = dom.childAt(fragment, [3]);
          var morphs = new Array(3);
          morphs[0] = dom.createMorphAt(fragment,1,1,contextualElement);
          morphs[1] = dom.createUnsafeMorphAt(element1,1,1);
          morphs[2] = dom.createMorphAt(element1,3,3);
          return morphs;
        },
        statements: [
          ["inline","link-to",["About","about"],["classNames","parent-link about"],["loc",[null,[25,6],[25,64]]]],
          ["content","model.contact.contactNarrative",["loc",[null,[27,8],[27,44]]]],
          ["block","if",[["get","model.contact.email",["loc",[null,[28,14],[28,33]]]]],[],0,null,["loc",[null,[28,8],[30,15]]]]
        ],
        locals: [],
        templates: [child0]
      };
    }());
    return {
      meta: {
        "topLevel": null,
        "revision": "Ember@2.1.0",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 42,
            "column": 0
          }
        },
        "moduleName": "elosh-client/templates/partials/-main-navigation.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
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
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var element2 = dom.childAt(fragment, [0, 1]);
        var element3 = dom.childAt(element2, [13, 1]);
        var morphs = new Array(4);
        morphs[0] = dom.createMorphAt(element2,1,1);
        morphs[1] = dom.createMorphAt(element2,5,5);
        morphs[2] = dom.createMorphAt(element2,9,9);
        morphs[3] = dom.createAttrMorph(element3, 'href');
        return morphs;
      },
      statements: [
        ["block","nav-section",[],["currentPath",["subexpr","@mut",[["get","currentPath",["loc",[null,[4,31],[4,42]]]]],[],[]],"path","artwork"],0,null,["loc",[null,[4,4],[11,20]]]],
        ["block","nav-section",[],["currentPath",["subexpr","@mut",[["get","currentPath",["loc",[null,[14,31],[14,42]]]]],[],[]],"path","books"],1,null,["loc",[null,[14,4],[21,20]]]],
        ["block","nav-section",[],["currentPath",["subexpr","@mut",[["get","currentPath",["loc",[null,[24,31],[24,42]]]]],[],[]],"path","about"],2,null,["loc",[null,[24,4],[32,20]]]],
        ["attribute","href",["concat",[["get","model.contact.storeLink",["loc",[null,[36,17],[36,40]]]]]]]
      ],
      locals: [],
      templates: [child0, child1, child2]
    };
  }()));

});
define('elosh-client/tests/adapters/about.jshint', function () {

  'use strict';

  QUnit.module('JSHint - adapters');
  QUnit.test('adapters/about.js should pass jshint', function(assert) { 
    assert.ok(true, 'adapters/about.js should pass jshint.'); 
  });

});
define('elosh-client/tests/adapters/application.jshint', function () {

  'use strict';

  QUnit.module('JSHint - adapters');
  QUnit.test('adapters/application.js should pass jshint', function(assert) { 
    assert.ok(true, 'adapters/application.js should pass jshint.'); 
  });

});
define('elosh-client/tests/adapters/contact.jshint', function () {

  'use strict';

  QUnit.module('JSHint - adapters');
  QUnit.test('adapters/contact.js should pass jshint', function(assert) { 
    assert.ok(true, 'adapters/contact.js should pass jshint.'); 
  });

});
define('elosh-client/tests/app.jshint', function () {

  'use strict';

  QUnit.module('JSHint - .');
  QUnit.test('app.js should pass jshint', function(assert) { 
    assert.ok(true, 'app.js should pass jshint.'); 
  });

});
define('elosh-client/tests/components/art-modal.jshint', function () {

  'use strict';

  QUnit.module('JSHint - components');
  QUnit.test('components/art-modal.js should pass jshint', function(assert) { 
    assert.ok(true, 'components/art-modal.js should pass jshint.'); 
  });

});
define('elosh-client/tests/components/max-width.jshint', function () {

  'use strict';

  QUnit.module('JSHint - components');
  QUnit.test('components/max-width.js should pass jshint', function(assert) { 
    assert.ok(true, 'components/max-width.js should pass jshint.'); 
  });

});
define('elosh-client/tests/components/nav-section.jshint', function () {

  'use strict';

  QUnit.module('JSHint - components');
  QUnit.test('components/nav-section.js should pass jshint', function(assert) { 
    assert.ok(true, 'components/nav-section.js should pass jshint.'); 
  });

});
define('elosh-client/tests/controllers/application.jshint', function () {

  'use strict';

  QUnit.module('JSHint - controllers');
  QUnit.test('controllers/application.js should pass jshint', function(assert) { 
    assert.ok(true, 'controllers/application.js should pass jshint.'); 
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

  QUnit.module('JSHint - helpers');
  QUnit.test('helpers/resolver.js should pass jshint', function(assert) { 
    assert.ok(true, 'helpers/resolver.js should pass jshint.'); 
  });

});
define('elosh-client/tests/helpers/start-app', ['exports', 'ember', 'elosh-client/app', 'elosh-client/config/environment'], function (exports, Ember, Application, config) {

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

  QUnit.module('JSHint - helpers');
  QUnit.test('helpers/start-app.js should pass jshint', function(assert) { 
    assert.ok(true, 'helpers/start-app.js should pass jshint.'); 
  });

});
define('elosh-client/tests/mixins/components/art-modal-close-intent.jshint', function () {

  'use strict';

  QUnit.module('JSHint - mixins/components');
  QUnit.test('mixins/components/art-modal-close-intent.js should pass jshint', function(assert) { 
    assert.ok(true, 'mixins/components/art-modal-close-intent.js should pass jshint.'); 
  });

});
define('elosh-client/tests/mixins/components/art-modal-height-management.jshint', function () {

  'use strict';

  QUnit.module('JSHint - mixins/components');
  QUnit.test('mixins/components/art-modal-height-management.js should pass jshint', function(assert) { 
    assert.ok(true, 'mixins/components/art-modal-height-management.js should pass jshint.'); 
  });

});
define('elosh-client/tests/mixins/components/art-modal-keyboard-navigation.jshint', function () {

  'use strict';

  QUnit.module('JSHint - mixins/components');
  QUnit.test('mixins/components/art-modal-keyboard-navigation.js should pass jshint', function(assert) { 
    assert.ok(true, 'mixins/components/art-modal-keyboard-navigation.js should pass jshint.'); 
  });

});
define('elosh-client/tests/mixins/components/art-modal-loading-management.jshint', function () {

  'use strict';

  QUnit.module('JSHint - mixins/components');
  QUnit.test('mixins/components/art-modal-loading-management.js should pass jshint', function(assert) { 
    assert.ok(true, 'mixins/components/art-modal-loading-management.js should pass jshint.'); 
  });

});
define('elosh-client/tests/mixins/routes/redirect-to-first-item.jshint', function () {

  'use strict';

  QUnit.module('JSHint - mixins/routes');
  QUnit.test('mixins/routes/redirect-to-first-item.js should pass jshint', function(assert) { 
    assert.ok(true, 'mixins/routes/redirect-to-first-item.js should pass jshint.'); 
  });

});
define('elosh-client/tests/mixins/routes/scroll-to-top.jshint', function () {

  'use strict';

  QUnit.module('JSHint - mixins/routes');
  QUnit.test('mixins/routes/scroll-to-top.js should pass jshint', function(assert) { 
    assert.ok(true, 'mixins/routes/scroll-to-top.js should pass jshint.'); 
  });

});
define('elosh-client/tests/models/about.jshint', function () {

  'use strict';

  QUnit.module('JSHint - models');
  QUnit.test('models/about.js should pass jshint', function(assert) { 
    assert.ok(true, 'models/about.js should pass jshint.'); 
  });

});
define('elosh-client/tests/models/artwork-category.jshint', function () {

  'use strict';

  QUnit.module('JSHint - models');
  QUnit.test('models/artwork-category.js should pass jshint', function(assert) { 
    assert.ok(true, 'models/artwork-category.js should pass jshint.'); 
  });

});
define('elosh-client/tests/models/artwork.jshint', function () {

  'use strict';

  QUnit.module('JSHint - models');
  QUnit.test('models/artwork.js should pass jshint', function(assert) { 
    assert.ok(true, 'models/artwork.js should pass jshint.'); 
  });

});
define('elosh-client/tests/models/book.jshint', function () {

  'use strict';

  QUnit.module('JSHint - models');
  QUnit.test('models/book.js should pass jshint', function(assert) { 
    assert.ok(true, 'models/book.js should pass jshint.'); 
  });

});
define('elosh-client/tests/models/contact.jshint', function () {

  'use strict';

  QUnit.module('JSHint - models');
  QUnit.test('models/contact.js should pass jshint', function(assert) { 
    assert.ok(true, 'models/contact.js should pass jshint.'); 
  });

});
define('elosh-client/tests/models/image-object.jshint', function () {

  'use strict';

  QUnit.module('JSHint - models');
  QUnit.test('models/image-object.js should pass jshint', function(assert) { 
    assert.ok(true, 'models/image-object.js should pass jshint.'); 
  });

});
define('elosh-client/tests/router.jshint', function () {

  'use strict';

  QUnit.module('JSHint - .');
  QUnit.test('router.js should pass jshint', function(assert) { 
    assert.ok(true, 'router.js should pass jshint.'); 
  });

});
define('elosh-client/tests/routes/about.jshint', function () {

  'use strict';

  QUnit.module('JSHint - routes');
  QUnit.test('routes/about.js should pass jshint', function(assert) { 
    assert.ok(true, 'routes/about.js should pass jshint.'); 
  });

});
define('elosh-client/tests/routes/application.jshint', function () {

  'use strict';

  QUnit.module('JSHint - routes');
  QUnit.test('routes/application.js should pass jshint', function(assert) { 
    assert.ok(true, 'routes/application.js should pass jshint.'); 
  });

});
define('elosh-client/tests/routes/artwork/category/show.jshint', function () {

  'use strict';

  QUnit.module('JSHint - routes/artwork/category');
  QUnit.test('routes/artwork/category/show.js should pass jshint', function(assert) { 
    assert.ok(true, 'routes/artwork/category/show.js should pass jshint.'); 
  });

});
define('elosh-client/tests/routes/artwork/category.jshint', function () {

  'use strict';

  QUnit.module('JSHint - routes/artwork');
  QUnit.test('routes/artwork/category.js should pass jshint', function(assert) { 
    assert.ok(true, 'routes/artwork/category.js should pass jshint.'); 
  });

});
define('elosh-client/tests/routes/artwork/index.jshint', function () {

  'use strict';

  QUnit.module('JSHint - routes/artwork');
  QUnit.test('routes/artwork/index.js should pass jshint', function(assert) { 
    assert.ok(true, 'routes/artwork/index.js should pass jshint.'); 
  });

});
define('elosh-client/tests/routes/artwork.jshint', function () {

  'use strict';

  QUnit.module('JSHint - routes');
  QUnit.test('routes/artwork.js should pass jshint', function(assert) { 
    assert.ok(true, 'routes/artwork.js should pass jshint.'); 
  });

});
define('elosh-client/tests/routes/books/index.jshint', function () {

  'use strict';

  QUnit.module('JSHint - routes/books');
  QUnit.test('routes/books/index.js should pass jshint', function(assert) { 
    assert.ok(true, 'routes/books/index.js should pass jshint.'); 
  });

});
define('elosh-client/tests/routes/books/show/book-page.jshint', function () {

  'use strict';

  QUnit.module('JSHint - routes/books/show');
  QUnit.test('routes/books/show/book-page.js should pass jshint', function(assert) { 
    assert.ok(true, 'routes/books/show/book-page.js should pass jshint.'); 
  });

});
define('elosh-client/tests/routes/books/show.jshint', function () {

  'use strict';

  QUnit.module('JSHint - routes/books');
  QUnit.test('routes/books/show.js should pass jshint', function(assert) { 
    assert.ok(true, 'routes/books/show.js should pass jshint.'); 
  });

});
define('elosh-client/tests/routes/index.jshint', function () {

  'use strict';

  QUnit.module('JSHint - routes');
  QUnit.test('routes/index.js should pass jshint', function(assert) { 
    assert.ok(true, 'routes/index.js should pass jshint.'); 
  });

});
define('elosh-client/tests/serializers/about.jshint', function () {

  'use strict';

  QUnit.module('JSHint - serializers');
  QUnit.test('serializers/about.js should pass jshint', function(assert) { 
    assert.ok(true, 'serializers/about.js should pass jshint.'); 
  });

});
define('elosh-client/tests/serializers/application.jshint', function () {

  'use strict';

  QUnit.module('JSHint - serializers');
  QUnit.test('serializers/application.js should pass jshint', function(assert) { 
    assert.ok(true, 'serializers/application.js should pass jshint.'); 
  });

});
define('elosh-client/tests/serializers/artwork-category.jshint', function () {

  'use strict';

  QUnit.module('JSHint - serializers');
  QUnit.test('serializers/artwork-category.js should pass jshint', function(assert) { 
    assert.ok(true, 'serializers/artwork-category.js should pass jshint.'); 
  });

});
define('elosh-client/tests/serializers/artwork.jshint', function () {

  'use strict';

  QUnit.module('JSHint - serializers');
  QUnit.test('serializers/artwork.js should pass jshint', function(assert) { 
    assert.ok(true, 'serializers/artwork.js should pass jshint.'); 
  });

});
define('elosh-client/tests/serializers/book.jshint', function () {

  'use strict';

  QUnit.module('JSHint - serializers');
  QUnit.test('serializers/book.js should pass jshint', function(assert) { 
    assert.ok(true, 'serializers/book.js should pass jshint.'); 
  });

});
define('elosh-client/tests/test-helper', ['elosh-client/tests/helpers/resolver', 'ember-qunit'], function (resolver, ember_qunit) {

	'use strict';

	ember_qunit.setResolver(resolver['default']);

});
define('elosh-client/tests/test-helper.jshint', function () {

  'use strict';

  QUnit.module('JSHint - .');
  QUnit.test('test-helper.js should pass jshint', function(assert) { 
    assert.ok(true, 'test-helper.js should pass jshint.'); 
  });

});
/* jshint ignore:start */

/* jshint ignore:end */

/* jshint ignore:start */

define('elosh-client/config/environment', ['ember'], function(Ember) {
  var prefix = 'elosh-client';
/* jshint ignore:start */

try {
  var metaName = prefix + '/config/environment';
  var rawConfig = Ember['default'].$('meta[name="' + metaName + '"]').attr('content');
  var config = JSON.parse(unescape(rawConfig));

  return { 'default': config };
}
catch(err) {
  throw new Error('Could not read config from meta tag with name "' + metaName + '".');
}

/* jshint ignore:end */

});

if (runningTests) {
  require("elosh-client/tests/test-helper");
} else {
  require("elosh-client/app")["default"].create({"name":"elosh-client","version":"0.0.0+badf82c6"});
}

/* jshint ignore:end */
//# sourceMappingURL=elosh-client.map