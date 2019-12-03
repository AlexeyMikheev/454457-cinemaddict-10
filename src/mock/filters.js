import {Filters} from '../const.js';

const filterNames = [Filters.ALL, Filters.WATCHLIST, Filters.HISTORY, Filters.FAVORITES, Filters.STATS];

const generateFilters = () => {
  return filterNames.map((filter) => {
    const isStats = filter.title === Filters.STATS.title;
    return {
      title: filter.title,
      anchor: filter.anchor,
      count: isStats ? null : 0,
      isActive: filter.title === Filters.ALL.title,
      isAddition: isStats,
    };
  });
};

export {generateFilters};
