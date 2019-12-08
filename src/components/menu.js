import AbstractComponent from './abstract-component.js';

const getMenuTemplate = (filters) => {
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

export default class Menu extends AbstractComponent {
  constructor(filters) {
    super();
    this._filters = filters;
  }

  getTemplate() {
    return getMenuTemplate(this._filters);
  }

  removeExist() {
    let filtersContainer = document.querySelector(`.main-navigation`);
    if (filtersContainer !== null) {
      filtersContainer.remove();
    }
  }
}
