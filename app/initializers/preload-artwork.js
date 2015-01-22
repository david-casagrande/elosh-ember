export function initialize(container, application) {
  //console.log(window.ELOSH_PRELOADED_ARTWORK)
  //console.log(container.lookup('store:main'), application);

  //var store = container.lookup('store:main');
  //store.pushPayload(window.ELOSH_PRELOADED_ARTWORK);
  // application.inject('route', 'foo', 'service:foo');
}

export default {
  name: 'preload-artwork',
  after: 'store',
  initialize: initialize
};
