import Utils from '../utils.js';

const createFilmsContainerTemplate = () =>
  `<section class="films"></section>`;

export default class FilmsContainer {

  getElement() {
    if (!this._element) {
      this._element = Utils.createElement(this.getTemplate());
    }
    return this._element;
  }

  getTemplate() {
    return createFilmsContainerTemplate();
  }

  removeElement() {
    this._element.remove();
    this._element = null;
  }
}
