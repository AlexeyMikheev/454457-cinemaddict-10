import Profile from './components/profile.js';
import Menu from './components/menu.js';
import Sotr from './components/sort.js';
import Films from './components/films';
import FilmsContainer from './components/films-container';
import FilmDeatil from './components/film-detail.js';
import MoreButton from './components/more-button.js';
import Statistic from './components/statistic.js';
import NoFilms from './components/no-films.js';

import {COUNT_FILMS, ONE_TASKS_PAGE_COUNT, Filters, FIMLS_COMPONENT_TYPES, RenderPosition, ESC_KEY} from './const.js';
import Utils from './utils.js';

import {createFilmCards} from './mock/filmCard.js';
import {generateFilters} from './mock/filters.js';

const headerContainer = document.querySelector(`.header`);
const mainContainer = document.querySelector(`.main`);
const footer = document.querySelector(`.footer`);

const isMoreButtonVisible = () => {
  return (currentPage + 1) * ONE_TASKS_PAGE_COUNT < films.length;
};

const onShowFilmDetail = (evt, film) => {
  onCloseFilmDetail();

  const classList = evt.target.classList;
  if (classList.contains(`film-card__poster`) ||
    classList.contains(`film-card__comments`) ||
    classList.contains(`film-card__title`)) {

    filmDetail = new FilmDeatil(film);
    Utils.render(document.body, filmDetail.getElement());

    filmDetail.initComments();
    filmDetail.initAddCommentForm();
    filmDetail.addCloseEvent(onCloseFilmDetail);
  }
};

const onCloseFilmDetail = () => {
  if (filmDetail !== null) {
    filmDetail.removeCb();
    filmDetail.removeElement();
    filmDetail = null;
  }
};

const initDocumentEvents = () => {
  document.addEventListener(`keydown`, (evt) => {
    if (evt.keyCode === ESC_KEY) {
      onCloseFilmDetail();
    }
  });
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
  const filmsContainer = new FilmsContainer().getElement();
  Utils.render(mainContainer, filmsContainer);

  if (films.length > 0) {

    const currentPageFimls = Utils.getFilmsByPageNumber(films, currentPage);

    filmsComponent = new Films(currentPageFimls, FIMLS_COMPONENT_TYPES.FIMLS);
    const filmsComponentElement = filmsComponent.getElement();
    Utils.render(filmsContainer, filmsComponentElement);

    filmsComponent.initComponets(onShowFilmDetail);

    const hasRatingFilms = films.filter((f) => {
      return f.rating > 0;
    });

    const topRatedFilms = Utils.getTopFilmsByProperty(hasRatingFilms, `rating`);

    const topRatedFilmsComponent = new Films(topRatedFilms, FIMLS_COMPONENT_TYPES.TOP_RATED);
    Utils.render(filmsContainer, topRatedFilmsComponent.getElement());
    topRatedFilmsComponent.initComponets(onShowFilmDetail);

    const hasCommentsFilms = films.filter((f) => {
      return f.comments !== null && f.comments.length > 0;
    });

    const mostCommentFilms = Utils.getTopFilmsByProperty(hasCommentsFilms, `comments`);
    const mostCommentFilmsComponent = new Films(mostCommentFilms, FIMLS_COMPONENT_TYPES.MOST_COMMENTS);
    Utils.render(filmsContainer, mostCommentFilmsComponent.getElement());
    mostCommentFilmsComponent.initComponets(onShowFilmDetail);

    initMoreButton(filmsComponentElement);
  } else {
    Utils.render(filmsContainer, new NoFilms().getElement());
  }
};

const initMoreButton = (parentContainer) => {
  if (isMoreButtonVisible()) {

    const onMoreButtonClick = () => {
      currentPage++;

      const pageFilms = Utils.getFilmsByPageNumber(films, currentPage);
      filmsComponent.addFilms(pageFilms);
      filmsComponent.clearComponents();
      filmsComponent.initComponets(onShowFilmDetail);

      if (!isMoreButtonVisible()) {
        moreButton.removeElement();
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
let filmDetail = null;

initHeader();

initContent();

initDocumentEvents();

const statisticComponent = new Statistic(films.length);
statisticComponent.removeExist();
Utils.render(footer, statisticComponent.getElement());
