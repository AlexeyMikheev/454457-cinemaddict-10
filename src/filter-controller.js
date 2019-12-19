import Filter from './components/filter.js';
import Utils from './utils.js';
import {RenderPosition} from './const.js';

export default class FilterController {
  constructor(container, films) {
    this._films = films;
    this._container = container;
    this._filterComponent = null;
    this._filters = Utils.getFilters();
    this._onClickCb = null;
  }

  addFilterEvent(cb) {
    this._filterComponent.addFilterButtonClick(cb);
  }

  render() {
    this._filters.forEach((filter) => {
      filter.count = Utils.getFilterValue(filter, this._films.films);
    });

    this._filterComponent = new Filter(this._filters, this._films.filterType);
    this._filterComponent.removeExist();
    Utils.render(this._container, this._filterComponent.getElement(), RenderPosition.AFTERBEGIN);
    this._filterComponent.refreshSortElements();
  }

  destroy() {
    this._filterComponent.removeElement();
  }
}
