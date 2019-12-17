import AbstractComponent from './abstract-component.js';
import {Filters} from '../const.js';
import Utils from '../utils.js';

const getFilterTemplate = (selectedFilter, filter) => {
  const {title, anchor, count} = filter;

  const activeClass = selectedFilter.title === filter.title ? `main-navigation__item--active` : ``;
  let additionClass = ``;

  const isStat = filter.title === Filters.STATS.title;
  const isAll = filter.title === Filters.STATS.title;

  if (isStat) {
    additionClass = `main-navigation__item--additional`;
  }

  if (isStat || isAll) {
    return `<a href="#${anchor}" data-filter="${anchor}" class="main-navigation__item ${activeClass} ${additionClass}">${title}</a>`;
  }

  return `<a href="#${anchor}" data-filter="${anchor}" class="main-navigation__item ${activeClass}">${title} <span class="main-navigation__item-count">${count}</span></a>`;
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
    let filtersContainer = document.querySelector(`.main-navigation`);
    if (filtersContainer !== null) {
      filtersContainer.remove();
    }
  }

  refreshSortElements() {
    this.removeFiltersElements();
    this.renderFiltersElements();
  }

  renderFiltersElements() {
    this._filterElements = this._filters.map((sortFilter) => {
      return Utils.createElement(getFilterTemplate(this._selectedFilter, sortFilter));
    });

    this._filterElements.forEach((filterElement) => {
      this._element.appendChild(filterElement);
    });
  }

  removeFiltersElements() {
    this._filterElements.forEach((filterElement) => {
      filterElement.remove();
    });
  }

  removeSortEvent() {
    this._element.removeEventListener(`click`, this._onClickCb);
    this._onClickCb = null;
  }
}
