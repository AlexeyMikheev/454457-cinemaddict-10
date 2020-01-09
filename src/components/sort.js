import AbstractComponent from './abstract-component.js';
import {SortTypes} from '../const.js';
import Utils from '../utils.js';

export const getSortFilterTemplate = (selectedFilter, sortFilter) => {
  const {value, text} = sortFilter;
  const activeClass = selectedFilter === value ? `sort__button--active` : ``;
  return `<li><a href="#" data-sort="${value}" class="sort__button ${activeClass}">${text}</a></li>`;
};

export const getSortFiltersTemplate = () => `<ul class="sort"></ul>`;

export default class Sort extends AbstractComponent {
  constructor() {
    super();
    this._sortType = SortTypes.DEFAULT;
    this._sortElements = [];
    this._sortFilters = [
      {value: SortTypes.DEFAULT, text: `Sort by default`},
      {value: SortTypes.DATE, text: `Sort by date`},
      {value: SortTypes.RATING, text: `Sort by rating`}];
  }

  getTemplate() {
    return getSortFiltersTemplate();
  }

  set sortType(value) {
    this._sortType = value;
  }

  addSortButtonClick(cb) {
    this._onSortButtonClickCb = (evt) => {
      evt.preventDefault();
      if (evt.target.classList.contains(`sort__button`)) {
        const sortType = parseInt(evt.target.dataset[`sort`], 10);
        if (this._sortType !== sortType) {
          cb(sortType);
        }
      }
    };

    this._element.addEventListener(`click`, this._onSortButtonClickCb);
  }

  refreshSortElements() {
    this._removeSortElements();
    this._renderSortElements();
  }

  _renderSortElements() {
    this._sortElements = this._sortFilters.map((sortFilter) => {
      return Utils.createElement(getSortFilterTemplate(this._sortType, sortFilter));
    });

    this._sortElements.forEach((sortElement) => {
      this._element.appendChild(sortElement);
    });
  }

  _removeSortElements() {
    this._sortElements.forEach((sortElement) => {
      sortElement.remove();
    });
  }
  _removeEvents() {
    if (this._element !== null) {
      this._element.removeEventListener(`click`, this._onSortButtonClickCb);
    }
  }
}
