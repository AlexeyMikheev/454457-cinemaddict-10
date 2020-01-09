import {DEBOUNCE_TIMEOUT} from './const.js';

let lastTimeout = null;

export const debounce = (cb, ...args) => {
  if (lastTimeout) {
    window.clearTimeout(lastTimeout);
  }
  lastTimeout = window.setTimeout(function () {
    cb(...args);
  }, DEBOUNCE_TIMEOUT);
};
