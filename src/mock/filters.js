import {Filters} from '../const.js';

// const FILTERS_COUNT = 10;

const filterNames = [Filters.ALL, Filters.WATCHLIST, Filters.HISTORY, Filters.FAVORITES];

const generateFilters = () => {
  return filterNames.map((filter) => {
    return {
      title: filter.title,
      anchor: filter.anchor,
      count: 0,
      isActive: filter.title === Filters.ALL.title
    };
  });
};

export {generateFilters};
