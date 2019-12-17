import Filter from './components/filter.js';
import Utils from './utils.js';
import {Filters, RenderPosition} from './const.js';

export default class FilterController {
  constructor(container, films) {
    this._films = films;
    this._container = container;
    this._filterComponent = null;
    this._totalWatchedFilms = 0;
    this._filters = Utils.getFilters();
  }

  get totalWatchedFilms() {
    return this._totalWatchedFilms;
  }

  render() {
    this._filters.forEach((filter) => {
      filter.count = Utils.getFilterValue(filter, this._films.films);

      if (filter.title === Filters.ALL.title) {
        this._totalWatchedFilms = filter.count;
      }
    });

    this._filterComponent = new Filter(this._filters, this._films.selectedFilter);
    this._filterComponent.removeExist();
    Utils.render(this._container, this._filterComponent.getElement(), RenderPosition.AFTERBEGIN);
    this._filterComponent.renderFiltersElements();
  }

  destroy() {
    this._filterComponent.removeElement();
  }
}
