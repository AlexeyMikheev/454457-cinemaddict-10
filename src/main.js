import Profile from './components/profile.js';
import Menu from './components/menu.js';
import Sotr from './components/sort.js';
import Films from './components/films';
import MoreButton from './components/more-button.js';
import Statistic from './components/statistic.js';

import {COUNT_FILMS, ONE_TASKS_PAGE_COUNT, Filters, FIMLS_COMPONENT_TYPES, RenderPosition} from './const.js';
import Utils from './utils.js';

import {createFilmCards} from './mock/filmCard.js';
import {generateFilters} from './mock/filters.js';

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

  const profileComponent = new Profile(totalWatchedFilms);
  Utils.render(headerContainer, profileComponent.getElement());

  const menuComponent = new Menu(filters);
  menuComponent.removeExist();
  Utils.render(mainContainer, menuComponent.getElement(), RenderPosition.AFTERBEGIN);

  const sortComponent = new Sotr();
  Utils.render(mainContainer, sortComponent.getElement());
};

const initContent = () => {
  const filmsContainer = Films.getFilmsContainer();
  Utils.render(mainContainer, filmsContainer);

  const currentPageFimls = Utils.getFilmsByPageNumber(films, currentPage);

  filmsComponent = Films.createInstance(currentPageFimls, FIMLS_COMPONENT_TYPES.FIMLS);
  const filmsComponentElement = filmsComponent.getElement();
  Utils.render(filmsContainer, filmsComponentElement);
  filmsComponent.initComponets();

  const hasRatingFilms = films.filter((f) => {
    return f.rating > 0;
  });

  const topRatedFilms = Utils.getTopFilmsByProperty(hasRatingFilms, `rating`);

  const topRatedFilmsComponent = Films.createInstance(topRatedFilms, FIMLS_COMPONENT_TYPES.TOP_RATED);
  Utils.render(filmsContainer, topRatedFilmsComponent.getElement());
  topRatedFilmsComponent.initComponets();

  const hasCommentsFilms = films.filter((f) => {
    return f.comments !== null && f.comments.length > 0;
  });

  const mostCommentFilms = Utils.getTopFilmsByProperty(hasCommentsFilms, `comments`);
  const mostCommentFilmsComponent = Films.createInstance(mostCommentFilms, FIMLS_COMPONENT_TYPES.MOST_COMMENTS);
  Utils.render(filmsContainer, mostCommentFilmsComponent.getElement());
  mostCommentFilmsComponent.initComponets();

  initMoreButton(filmsComponentElement);
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
    Utils.render(parentContainer, moreButton.getElement());
    moreButton.initClickEvent(onMoreButtonClick);
  }
};

const filters = generateFilters();
const films = createFilmCards(COUNT_FILMS);
let currentPage = 0;
let filmsComponent = null;

initHeader();

initContent();

const statisticComponent = new Statistic(films.length);
statisticComponent.removeExist();
Utils.render(footer, statisticComponent.getElement());
