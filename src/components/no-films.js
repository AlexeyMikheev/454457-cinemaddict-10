import Utils from '../utils.js';

export const getNoFilmsTemplate = () =>
  `<section class="films-list"><h2 class="films-list__title">There are no movies in our database</h2></section>`;

export default class NoFilms {
  constructor() {
    this._element = null;
  }

  getElement() {
    if (!this._element) {
      this._element = Utils.createElement(this.getTemplate());
    }
    return this._element;
  }

  getTemplate() {
    return getNoFilmsTemplate();
  }

  remove() {
    this._element = null;
  }
}
