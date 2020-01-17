import AbstractComponent from './abstract-component.js';
import {Filters} from '../const.js';
import Utils from '../utils.js';

const getFilterTemplate = (selectedFilter, filter) => {
  const {title, anchor, count} = filter;

  const activeClass = selectedFilter === filter.title ? `main-navigation__item--active` : ``;

  const isStat = filter.title === Filters.STATS.title;
  const isAll = filter.title === Filters.ALL.title;

  const additionClass = isStat ? `main-navigation__item--additional` : ``;

  if (isStat || isAll) {
    return `<a href="#${anchor}" data-filter="${title}" class="main-navigation__item ${activeClass} ${additionClass}">${title}</a>`;
  }

  return `<a href="#${anchor}" data-filter="${title}" class="main-navigation__item ${activeClass}">${title} <span class="main-navigation__item-count">${count}</span></a>`;
};

const getFiltersTemplate = () => `<nav class="main-navigation"></nav>`;

export default class Filter extends AbstractComponent {
  constructor(filters, selectedFilter) {
    super();
    this._filters = filters;
    this._selectedFilter = selectedFilter;
    this._filterElements = [];
  }

  getTemplate() {
    return getFiltersTemplate();
  }

  removeExist() {
    const filtersContainer = document.querySelector(`.main-navigation`);
    if (filtersContainer !== null) {
      filtersContainer.remove();
    }
  }

  addFilterButtonClick(cb) {
    this._onfilterButtonClickCb = (evt) => {
      evt.preventDefault();

      if (evt.target.classList.contains(`main-navigation__item`)) {
        const selectedFilter = evt.target.dataset[`filter`];
        cb(selectedFilter);
      }
    };

    this._element.addEventListener(`click`, this._onfilterButtonClickCb);
  }

  refreshSortElements() {
    this._removeFiltersElements();
    this._renderFiltersElements();
  }

  _renderFiltersElements() {
    this._filterElements = this._filters.map((sortFilter) => {
      return Utils.createElement(getFilterTemplate(this._selectedFilter, sortFilter));
    });

    this._filterElements.forEach((filterElement) => {
      this._element.appendChild(filterElement);
    });
  }

  _removeFiltersElements() {
    this._filterElements.forEach((filterElement) => {
      filterElement.remove();
    });
  }
}
