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

const initHeader = (pageTasks) => {
  let totalWatchedFilms = 0;
  filters.forEach((filter) => {
    filter.count = Utils.getFilterValue(filter, pageTasks);

    if (filter.title === Filters.ALL.title) {
      totalWatchedFilms = filter.count;
    }
  });

  new Profile(totalWatchedFilms).render(headerContainer);

  new Menu(filters).render(mainContainer);

  new Sotr().render(mainContainer);
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

initHeader(films);

Films.renderContainer(mainContainer);

let currentPage = 0;

const currentPageFimls = Utils.getFilmsByPageNumber(films, currentPage);
const filmsComponent = Films.CreateInstance(currentPageFimls, FIMLS_COMPONENT_TYPES.FIMLS);
filmsComponent.render();

const topRatedFilms = Utils.getTopFilmsByProperty(films, `rating`);
Films.CreateInstance(topRatedFilms, FIMLS_COMPONENT_TYPES.TOP_RATED).render();

const mostCommentFilms = Utils.getTopFilmsByProperty(films, `comments`);
Films.CreateInstance(mostCommentFilms, FIMLS_COMPONENT_TYPES.MOST_COMMENTS).render();

initMoreButton(filmsComponent.Element);

new Statistic(films.length).render(footer);

const filmDeatil = new FilmDeatil(films[0]);
filmDeatil.render(document.body);
