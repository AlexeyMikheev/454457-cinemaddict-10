import Utils from '../utils.js';

export const getTemplate = () =>
  `<ul class="sort">
    <li><a href="#" class="sort__button sort__button--active">Sort by default</a></li>
    <li><a href="#" class="sort__button">Sort by date</a></li>
    <li><a href="#" class="sort__button">Sort by rating</a></li>
  </ul>`;

export default class Sotr {
  constructor() {
    this._element = null;
  }

  getElement() {
    if (!this._element) {
      this._element = Utils.createElement(getTemplate());
    }
    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
