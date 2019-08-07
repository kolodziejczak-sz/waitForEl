function waitForSetup({ base = document.body, timeout = 200}) {
  const observerConfig = { childList: true, subtree: true };
  const noop = (el, error) => {};
  const getEl = (selector) => base.querySelector(selector);
  const timeoutError = (selector) => `waitFor: Selector ${selector} did not resolved after ${timeout}ms`; 

  return (selector, callback = noop) => {
    let isResolved = false;

    const observer = new MutationObserver(() => {
      const el = getEl(selector);
      el && unsubscribe(el, null);
    });

    const unsubscribe = (el, err) => {
      isResolved = true;
      observer.disconnect();
      callback(el, err);
    }

    if(timeout !== 0) {
      setTimeout(_ => {
        !isResolved && unsubscribe(null, timeoutError(selector))
      }, timeout);
    }

    observer.observe(base, observerConfig);

    return _ => unsubscribe(null, null);
  }
}


// usage
(function() {
  const waitFor = waitForSetup({timeout: 1000});
  const unsub = waitFor('foo', console.log)

  setTimeout(() => {
    const el = document.createElement('div');
    el.id='foo';
    document.body.appendChild(el);
  }, 500);
})();

