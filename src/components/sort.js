import Utils from '../utils.js';

export const createSortTemplate = () =>
  `<ul class="sort">
    <li><a href="#" class="sort__button sort__button--active">Sort by default</a></li>
    <li><a href="#" class="sort__button">Sort by date</a></li>
    <li><a href="#" class="sort__button">Sort by rating</a></li>
  </ul>`;

  export default class Sotr {
    constructor() {
      this.init();
    }
  
    init() {
      if (!this._element) {
        this._element = Utils.createElement(this.getTemplate());
      }
    }
  
    getTemplate() {
      return createSortTemplate();
    }
  
    get Element() {
      return this._element;
    }
  
    render(container) {
      Utils.render(container, this._element);
    }
  
    remove() {
      this._element = null;
    }
  }