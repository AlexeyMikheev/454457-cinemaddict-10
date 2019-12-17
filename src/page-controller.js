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

    this._profileComponent = null;
    this._filterController = null;

    this._filmsControllers = [];
    this._topRatedFilmsControllers = [];
    this._mostCommentFilmsControllers = [];

    this._onDataChange = (filmController, oldValue, newValue) => {
      const isSuccess = this._films.updateFilm(oldValue.id, newValue);
      if (isSuccess) {
        filmController.render(newValue);
        this.initFilters();
        this.initProfile();
      }
    };

    this._onViewChange = () => {
      this.setDefaultView();
    };

    this._onMoreButtonClick = () => {
      this._films.currentPage++;
    };

    this._onMoreButtonClickCb = () => {
      this.renderListFilms(this._filmsComponentElement, this._films.getFilms());

      this.refreshMoreButton();
    };

    this._films.moreButtonClickCb = this.__onMoreButtonClickCb;

    this._onSortButtonClick = (sortType) => {
      this._films.sortType = sortType;
    };

    this._sortTypeChangeCb = () => {
      this.renderListFilms(this._filmsComponentElement, this._films.getFilms());

      if (this._sortComponent !== null) {
        this._sortComponent.sortType = this._films.sortType;
        this._sortComponent.refreshSortElements();
      }

      this.refreshMoreButton();
    };

    this._films.sortTypeChangeCb = this._sortTypeChangeCb;

    this._onFilterButtonClick = (filterType) => {
      if (this._films.selectedFilter !== filterType) {
        this._films.filterType = filterType;
      }
    };

    this._filterTypeChangeCb = () => {
      this.renderListFilms(this._filmsComponentElement, this._films.getFilms());
      this.initFilters();

      this.refreshMoreButton();
    };

    this._films.filterTypeChangeCb = this._filterTypeChangeCb;
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

  initHeader() {
    this.initFilters();

    this.initProfile();

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
    this._filterController.addFilterEvent(this._onFilterButtonClick);
  }

  initProfile() {
    if (this._profileComponent !== null) {
      this._profileComponent.removeElement();
      this._profileComponent = null;
    }

    this._profileComponent = new Profile(this.totalWatchedFilms);
    Utils.render(this._headerContainer, this._profileComponent.getElement());
  }

  initContent() {
    const filmsContainer = new FilmsContainer().getElement();
    Utils.render(this._mainContainer, filmsContainer);

    if (this._films.length === 0) {
      Utils.render(filmsContainer, new NoFilms().getElement());
      return;
    }

    const currentPageFimls = this._films.getFilms();

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

    this.refreshMoreButton();
  }

  refreshMoreButton() {
    this.destroyMoreButton();

    if (this._films.isAvaliableLoad) {
      this._moreButton = new MoreButton();
      Utils.render(this._filmsComponentElement, this._moreButton.getElement());
      this._moreButton.initClickEvent(this._onMoreButtonClick);
    }
  }

  destroyMoreButton() {
    if (this._moreButton !== null) {
      this._moreButton.removeElement();
      this._moreButton = null;
    }
  }

  initStatistic() {
    const statisticComponent = new Statistic(this._films.totalFilms);
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
