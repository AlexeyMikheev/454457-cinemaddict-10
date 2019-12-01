import {Filters} from '../const.js';

// const FILTERS_COUNT = 10;

const filterNames = [Filters.ALL, Filters.WATCHLIST, Filters.HISTORY, Filters.FAVORITES, Filters.STATS];

const generateFilters = () => {
  return filterNames.map((filter) => {
    const isStats = filter.title === Filters.STATS.title;
    return {
      title: filter.title,
      anchor: filter.anchor,
      count: !isStats ? 0 : null,
      isActive: filter.title === Filters.ALL.title,
      isAddition: isStats,
    };
  });
};

export {generateFilters};
