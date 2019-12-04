import Utils from '../utils.js';

export default class MoreButton {

  constructor() {
    this.init();
  }

  init() {
    if (!this._element) {
      this._element = Utils.createElement(this.getTemplate());
    }
  }

  getTemplate() {
    return `<button class="films-list__show-more">Show more</button>`;
  }

  render(container) {
    Utils.render(container, this._element);
  }

  initClickEvent(cb) {
    this._element.addEventListener(`click`, () => {
      cb();
    });
  }

  get Element() {
    return this._element;
  }

  remove() {
    this._element.remove();
    this._element = null;
  }
}
