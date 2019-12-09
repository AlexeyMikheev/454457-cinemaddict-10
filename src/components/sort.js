import AbstractComponent from './abstract-component.js';
import {SORT_TYPES} from '../const.js';
import Utils from '../utils.js';

export const getSortFilterTemplate = (selectedFilter, sortFilter) => {
  const {value, text} = sortFilter;
  const activeClass = selectedFilter === value ? `sort__button--active` : ``;
  return `<li><a href="#" data-sort="${value}" class="sort__button ${activeClass}">${text}</a></li>`;
};

export const getSortFiltersTemplate = () => `<ul class="sort"></ul>`;

export default class Sort extends AbstractComponent {
  constructor(selectedFilter) {
    super();
    this._selectedFilter = selectedFilter;
    this._sortElements = [];
    this._sortFilters = [
      {value: SORT_TYPES.DEFAULT, text: `Sort by default`},
      {value: SORT_TYPES.DATE, text: `Sort by date`},
      {value: SORT_TYPES.RATING, text: `Sort by rating`}];
  }

  getTemplate() {
    return getSortFiltersTemplate(this._selectedFilter, this._sortFilters);
  }

  set SelectedFilter(value) {
    this._selectedFilter = value;
  }

  addSortEvent(cb) {
    this._onClickCb = (evt) => {
      evt.preventDefault();
      if (evt.target.classList.contains(`sort__button`)) {
        const selectedFilter = parseInt(evt.target.dataset[`sort`], 10);

        cb(selectedFilter);
      }
    };

    this._element.addEventListener(`click`, this._onClickCb);
  }

  refreshSortElements() {
    this.removeSortElements();
    this.renderSortElements();
  }

  renderSortElements() {
    this._sortElements = this._sortFilters.map((sortFilter)=>{
      return Utils.createElement(getSortFilterTemplate(this._selectedFilter, sortFilter));
    });

    this._sortElements.forEach((sortElement) => {
      this._element.appendChild(sortElement);
    });
  }

  removeSortElements() {
    this._sortElements.forEach((sortElement)=>{
      sortElement.remove();
    });
  }

  removeCb() {
    this._element.removeEventListener(`click`, this._onClickCb);
    this._onClickCb = null;
  }
}
