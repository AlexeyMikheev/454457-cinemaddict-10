import Profile from './components/profile.js';
import Menu from './components/menu.js';
import Sotr from './components/sort.js';
import Films from './components/films';
import MoreButton from './components/more-button.js';
import Statistic from './components/statistic.js';
import FilmDeatil from './components/film-detail.js';

import { COUNT_FILMS, ONE_TASKS_PAGE_COUNT, Filters, FIMLS_COMPONENT_TYPES } from './const.js';
import Utils from './utils.js';

import { createFilmCards } from './mock/filmCard.js';
import { generateFilters } from './mock/filters.js';

const headerContainer = document.querySelector(`.header`);
const mainContainer = document.querySelector(`.main`);
const footer = document.querySelector(`.footer`);

const isMoreButtonVisible = () => {
  return (currentPage + 1) * ONE_TASKS_PAGE_COUNT < films.length;
};

const initHeader = () => {
  let totalWatchedFilms = 0;
  filters.forEach((filter) => {
    filter.count = Utils.getFilterValue(filter, films);

    if (filter.title === Filters.ALL.title) {
      totalWatchedFilms = filter.count;
    }
  });

  new Profile(totalWatchedFilms).render(headerContainer);

  new Menu(filters).render(mainContainer);

  new Sotr().render(mainContainer);
};

const initContent = () => {
  Films.renderContainer(mainContainer);

  const currentPageFimls = Utils.getFilmsByPageNumber(films, currentPage);
  filmsComponent = Films.CreateInstance(currentPageFimls, FIMLS_COMPONENT_TYPES.FIMLS);
  filmsComponent.render();

  const hasRatingFilms = films.filter((f) => { return f.rating > 0 });
  const topRatedFilms = Utils.getTopFilmsByProperty(hasRatingFilms, `rating`);
  Films.CreateInstance(topRatedFilms, FIMLS_COMPONENT_TYPES.TOP_RATED).render();

  const hasCommentsFilms = films.filter((f) => { return f.comments !== null && f.comments.length > 0 });
  const mostCommentFilms = Utils.getTopFilmsByProperty(hasCommentsFilms, `comments`);
  Films.CreateInstance(mostCommentFilms, FIMLS_COMPONENT_TYPES.MOST_COMMENTS).render();

  initMoreButton(filmsComponent.Element);
};

const initMoreButton = (parentContainer) => {
  if (isMoreButtonVisible()) {

    const onMoreButtonClick = () => {
      currentPage++;

      const pageFilms = Utils.getFilmsByPageNumber(films, currentPage);
      filmsComponent.addFilms(pageFilms);

      if (!isMoreButtonVisible()) {
        moreButton.remove();
      }
    };

    const moreButton = new MoreButton();
    moreButton.render(parentContainer);
    moreButton.initClickEvent(onMoreButtonClick);
  }
};

const filters = generateFilters();
const films = createFilmCards(COUNT_FILMS);
let currentPage = 0;
let filmsComponent = null;

initHeader();

initContent();

new Statistic(films.length).render(footer);
