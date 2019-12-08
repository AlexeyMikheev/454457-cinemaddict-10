import Profile from './components/profile.js';
import Menu from './components/menu.js';
import Sotr from './components/sort.js';
import Films from './components/films';
import FilmsContainer from './components/films-container';
import FilmDeatil from './components/film-detail.js';
import MoreButton from './components/more-button.js';
import Statistic from './components/statistic.js';
import NoFilms from './components/no-films.js';

import {ONE_TASKS_PAGE_COUNT, Filters, FIMLS_COMPONENT_TYPES, RenderPosition, ESC_KEY} from './const.js';
import Utils from './utils.js';
export default class PageController {
  constructor(films, filters) {
    this._films = films;
    this._filters = filters;
    this._currentPage = 0;
    this._filmsComponent = null;
    this._filmDetail = null;
    this._onCloseFilmDetail = null;
    this._moreButton = null;
    this._headerContainer = document.querySelector(`.header`);
    this._mainContainer = document.querySelector(`.main`);
    this._footer = document.querySelector(`.footer`);
  }

  init() {
    this._onCloseFilmDetail = () => {
      if (this._filmDetail !== null) {
        this._filmDetail.removeCb();
        this._filmDetail.removeElement();
        this._filmDetail = null;
      }
    };

    this._isMoreButtonVisible = () => {
      return (this._currentPage + 1) * ONE_TASKS_PAGE_COUNT < this._films.length;
    };

    this._onShowFilmDetail = (evt, film) => {
      this._onCloseFilmDetail();

      const classList = evt.target.classList;
      if (classList.contains(`film-card__poster`) ||
        classList.contains(`film-card__comments`) ||
        classList.contains(`film-card__title`)) {

        this._filmDetail = new FilmDeatil(film);
        Utils.render(document.body, this._filmDetail.getElement());

        this._filmDetail.initComments();
        this._filmDetail.initAddCommentForm();
        this._filmDetail.addCloseEvent(this._onCloseFilmDetail);
      }
    };

    this._onMoreButtonClick = () => {
      this._currentPage++;

      const pageFilms = Utils.getFilmsByPageNumber(this._films, this._currentPage);
      this._filmsComponent.addFilms(pageFilms);
      this._filmsComponent.clearComponents();
      this._filmsComponent.initComponets(this._onShowFilmDetail);

      if (!this._isMoreButtonVisible()) {
        this._moreButton.removeElement();
      }
    };

    this.initHeader();
    this.initContent();
    this.initDocumentEvents();
    this.initStatistic();
  }

  initHeader() {
    let totalWatchedFilms = 0;
    this._filters.forEach((filter) => {
      filter.count = Utils.getFilterValue(filter, this._films);

      if (filter.title === Filters.ALL.title) {
        totalWatchedFilms = filter.count;
      }
    });

    const profileComponent = new Profile(totalWatchedFilms);
    Utils.render(this._headerContainer, profileComponent.getElement());

    const menuComponent = new Menu(this._filters);
    menuComponent.removeExist();
    Utils.render(this._mainContainer, menuComponent.getElement(), RenderPosition.AFTERBEGIN);

    const sortComponent = new Sotr();
    Utils.render(this._mainContainer, sortComponent.getElement());
  }

  initContent() {
    const filmsContainer = new FilmsContainer().getElement();
    Utils.render(this._mainContainer, filmsContainer);

    if (this._films.length > 0) {

      const currentPageFimls = Utils.getFilmsByPageNumber(this._films, this._currentPage);

      this._filmsComponent = new Films(currentPageFimls, FIMLS_COMPONENT_TYPES.FIMLS);
      const filmsComponentElement = this._filmsComponent.getElement();
      Utils.render(filmsContainer, filmsComponentElement);

      this._filmsComponent.initComponets(this._onShowFilmDetail);

      const hasRatingFilms = this._films.filter((f) => {
        return f.rating > 0;
      });

      const topRatedFilms = Utils.getTopFilmsByProperty(hasRatingFilms, `rating`);

      const topRatedFilmsComponent = new Films(topRatedFilms, FIMLS_COMPONENT_TYPES.TOP_RATED);
      Utils.render(filmsContainer, topRatedFilmsComponent.getElement());
      topRatedFilmsComponent.initComponets(this._onShowFilmDetail);

      const hasCommentsFilms = this._films.filter((f) => {
        return f.comments !== null && f.comments.length > 0;
      });

      const mostCommentFilms = Utils.getTopFilmsByProperty(hasCommentsFilms, `comments`);
      const mostCommentFilmsComponent = new Films(mostCommentFilms, FIMLS_COMPONENT_TYPES.MOST_COMMENTS);
      Utils.render(filmsContainer, mostCommentFilmsComponent.getElement());
      mostCommentFilmsComponent.initComponets(this._onShowFilmDetail);

      this.initMoreButton(filmsComponentElement);
    } else {
      Utils.render(filmsContainer, new NoFilms().getElement());
    }
  }

  initMoreButton(parentContainer) {
    if (this._isMoreButtonVisible()) {
      this._moreButton = new MoreButton();
      Utils.render(parentContainer, this._moreButton.getElement());
      this._moreButton.initClickEvent(this._onMoreButtonClick);
    }
  }

  initStatistic() {
    const statisticComponent = new Statistic(this._films.length);
    statisticComponent.removeExist();
    Utils.render(this._footer, statisticComponent.getElement());
  }

  initDocumentEvents() {
    document.addEventListener(`keydown`, (evt) => {
      if (evt.keyCode === ESC_KEY) {
        this._onCloseFilmDetail();
      }
    });
  }
}