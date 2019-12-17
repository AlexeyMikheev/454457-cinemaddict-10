import Profile from './components/profile.js';
import Sort from './components/sort.js';
import Films from './components/films';
import FilmsContainer from './components/films-container';
import MoreButton from './components/more-button.js';
import Statistic from './components/statistic.js';
import NoFilms from './components/no-films.js';
import MovieController from './movie-controller.js';
import FilterController from './filter-controller.js';

import {FIMLS_COMPONENT_TYPES, ESC_KEY} from './const.js';
import Utils from './utils.js';

export default class PageController {
  constructor(headerContainer, mainContainer, footer, films) {
    this._films = films;
    this._filmsComponent = null;
    this._filmsComponentElement = null;
    this._moreButton = null;
    this._sortComponent = new Sort(this._sortType);
    this._headerContainer = headerContainer;
    this._mainContainer = mainContainer;
    this._footer = footer;

    this._filterController = null;

    this._filmsControllers = [];
    this._topRatedFilmsControllers = [];
    this._mostCommentFilmsControllers = [];

    this._onDataChange = (oldValue, newValue) => {
      this.getFilmsControlles().forEach((filmController) => {
        const filmId = filmController.film.id;

        if (filmId === oldValue.id) {
          const filmToUpdate = this._films.getFilmById(filmId);

          if (filmToUpdate !== null) {
            Object.assign(filmToUpdate, newValue);
            filmController.render(filmToUpdate);
          }
        }
      });

      this.initFilters();
    };

    this._onViewChange = () => {
      this.setDefaultView();
    };

    this._onMoreButtonClick = () => {
      this._films.currentPage++;
    };

    this.__onMoreButtonClickCb = () => {
      const sortedFilms = this.getFilms();
      this.renderListFilms(this._filmsComponentElement, sortedFilms);

      if (!this._films.isAvaliableLoad) {
        this._moreButton.removeElement();
      }
    };

    this._films.moreButtonClickCb = this.__onMoreButtonClickCb;

    this._onSortButtonClick = (sortType) => {
      this._films.sortType = sortType;
    };

    this._sortTypeChangeCb = () => {
      const sortedFilms = this.getFilms();
      this.renderListFilms(this._filmsComponentElement, sortedFilms);

      if (this._sortComponent !== null) {
        this._sortComponent.selectedFilter = this._films.sortType;
        this._sortComponent.refreshSortElements();
      }
    };

    this._films.sortTypeChangeCb = this._sortTypeChangeCb;
  }

  get totalWatchedFilms() {
    return this._filterController !== null ? this._filterController.totalWatchedFilms : 0;
  }

  getFilmsControlles() {
    return [...this._filmsControllers, ...this._topRatedFilmsControllers, ...this._mostCommentFilmsControllers];
  }

  render() {
    this.initHeader();
    this.initContent();
    this.initDocumentEvents();
    this.initStatistic();
  }

  renderListFilms(container, films) {
    this.clearFilms(this._filmsControllers);
    this._filmsControllers = [];
    this.renderFilms(container, films, this._filmsControllers);
  }

  renderTopRatedFilms(container, films) {
    this.clearFilms(this._topRatedFilmsControllers);
    this._topRatedFilmsControllers = [];
    this.renderFilms(container, films, this._topRatedFilmsControllers);
  }

  renderMostCommentFilms(container, films) {
    this.clearFilms(this._mostCommentFilmsControllers);
    this._mostCommentFilmsControllers = [];
    this.renderFilms(container, films, this._mostCommentFilmsControllers);
  }

  renderFilms(container, films, filmsControllers) {
    films.forEach((film) => {
      const filmControler = new MovieController(container, this._onDataChange, this._onViewChange);
      filmControler.render(film);

      filmsControllers.push(filmControler);
    });
  }

  clearFilms(filmsControllers) {
    filmsControllers.forEach((filmController) => {
      filmController.removeComponents();
      filmController = null;
    });
  }

  setDefaultView() {
    this.getFilmsControlles().forEach((filmController) => {
      filmController.setDefaultView();
    });
  }

  getFilms() {
    return this._films.getFilmsByPageNumber();
  }

  initHeader() {
    this.initFilters();

    const profileComponent = new Profile(this.totalWatchedFilms);
    Utils.render(this._headerContainer, profileComponent.getElement());

    Utils.render(this._mainContainer, this._sortComponent.getElement());
    this._sortComponent.renderSortElements();
    this._sortComponent.addSortEvent(this._onSortButtonClick);
  }

  initFilters() {
    if (this._filterController !== null) {
      this._filterController.destroy();
      this._filterController = null;
    }

    this._filterController = new FilterController(this._mainContainer, this._films);
    this._filterController.render();
  }

  initContent() {
    const filmsContainer = new FilmsContainer().getElement();
    Utils.render(this._mainContainer, filmsContainer);

    if (this._films.length === 0) {
      Utils.render(filmsContainer, new NoFilms().getElement());
      return;
    }

    const currentPageFimls = this._films.getFilmsByPageNumber();

    this._filmsComponent = new Films(FIMLS_COMPONENT_TYPES.FIMLS);
    this._filmsComponentElement = this._filmsComponent.getElement();
    Utils.render(filmsContainer, this._filmsComponentElement);
    this.renderListFilms(this._filmsComponentElement, currentPageFimls);

    const topRatedFilmsComponentElement = new Films(FIMLS_COMPONENT_TYPES.TOP_RATED).getElement();
    Utils.render(filmsContainer, topRatedFilmsComponentElement);
    this.renderTopRatedFilms(topRatedFilmsComponentElement, this._films.topRatedFilms);

    const mostCommentFilmsComponentElement = new Films(FIMLS_COMPONENT_TYPES.MOST_COMMENTS).getElement();
    Utils.render(filmsContainer, mostCommentFilmsComponentElement);
    this.renderMostCommentFilms(mostCommentFilmsComponentElement, this._films.mostCommentFilms);

    if (this._films.isAvaliableLoad) {
      this._moreButton = new MoreButton();
      Utils.render(this._filmsComponentElement, this._moreButton.getElement());
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
        this.setDefaultView();
      }
    });
  }
}
