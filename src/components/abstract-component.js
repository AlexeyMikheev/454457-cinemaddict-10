import Utils from '../utils.js';

export default class AbstractComponent {
  constructor() {
    if (new.target === AbstractComponent) {
      throw new Error(`Can't instantiate AbstractComponent, only concrete one.`);
    }
    this._element = null;
  }

  getTemplate() {
    throw new Error(`Abstract method not implemented: getTemplate`);
  }

  getElement() {
    if (!this._element) {
      this._element = Utils.createElement(this.getTemplate());
    }
    return this._element;
  }

  removeElement() {
    if (this._element !== null) {
      this._element.remove();
      this._element = null;
    }
  }

  show() {
    this._element.classList.remove(`visually-hidden`);
  }

  hide() {
    this._element.classList.add(`visually-hidden`);
  }
}
