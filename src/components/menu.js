import Utils from '../utils.js';
import {RenderPosition} from '../const.js';

const createMenuTemplate = (filters) => {
  const filtersMappedTemplate = filters.reduce((template, filter) => {
    const {title, anchor, count, isActive, isAddition} = filter;
    const activeClass = isActive ? `main-navigation__item--active` : ``;
    const additionClass = isAddition ? `main-navigation__item--additional` : ``;

    if (count !== null) {
      template += `<a href="#${anchor}" class="main-navigation__item ${activeClass} ${additionClass}">${title} <span class="main-navigation__item-count">${count}</span></a>`;
    } else {
      template += `<a href="#${anchor}" class="main-navigation__item ${activeClass} ${additionClass}">${title}</a>`;
    }

    return template;
  }, ``);

  return `<nav class="main-navigation">${filtersMappedTemplate}</nav>`;
};

export default class Menu {
  constructor(filters) {
    this._filters = filters;
    this.init();
  }

  init() {
    if (!this._element) {
      this._element = Utils.createElement(this.getTemplate());
    }
  }

  getTemplate() {
    return createMenuTemplate(this._filters);
  }

  get Element() {
    return this._element;
  }

  removeExist() {
    let filtersContainer = document.querySelector(`.main-navigation`);
    if (filtersContainer !== null) {
      filtersContainer.remove();
    }
  }

  render(container) {
    this.removeExist();

    Utils.render(container, this._element, RenderPosition.AFTERBEGIN);
  }

  remove() {
    this._element = null;
  }
}
