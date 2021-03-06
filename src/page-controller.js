import Profile from './components/profile.js';
import Sort from './components/sort.js';
import Films from './components/films.js';
import FilmsContainer from './components/films-container.js';
import MoreButton from './components/more-button.js';
import FooterStatistic from './components/footer-statistic.js';
import Statistic from './components/statistic.js';
import NoFilms from './components/no-films.js';
import MovieController from './movie-controller.js';
import FilterController from './filter-controller.js';

import {FilmComponentType, ESC_KEY, Filters} from './const.js';
import Utils from './utils.js';

export default class PageController {
  constructor(headerContainer, mainContainer, footer, films, api) {
    this._isReadOnly = !api.isOnline;
    this._films = films;
    this._api = api;
    this._filmsContainerComponent = null;
    this._filmsComponent = null;
    this._filmsComponentElement = null;
    this._moreButton = null;
    this._sortComponent = new Sort();
    this._statisticComponent = null;
    this._headerContainer = headerContainer;
    this._mainContainer = mainContainer;
    this._footer = footer;
    this._topRatedFilmsComponentElement = null;
    this._mostCommentFilmsComponentElement = null;
    this._popupController = null;

    this._profileComponent = null;
    this._filterController = null;

    this._filmsControllers = [];
    this._topRatedFilmsControllers = [];
    this._mostCommentFilmsControllers = [];

    this._onDocumentKeyDown = (evt) => {
      if (evt.keyCode === ESC_KEY) {
        this._setDefaultView();
        this._removeDocumentEvents();
        this._clearPopupController();
      }
    };

    this._onDataChange = (filmController, oldValue, newValue, parentValue = null) => {
      if (parentValue === null) {
        this._updateFilm(filmController, oldValue, newValue);
      } else {
        if (newValue !== null) {
          this._createComment(filmController, newValue, parentValue);
        } else if (oldValue !== null) {
          this._deleteComment(filmController, oldValue, parentValue);
        }
      }
    };

    this._onViewChange = (movieController) => {
      this._setDefaultView();
      if (movieController.detailsModeVisibility) {
        movieController.showFilmDetail();
        this._initDocumentEvents();
        this._popupController = movieController;
      } else {
        this._removeDocumentEvents();
      }
    };

    this._onMoreButtonClick = () => {
      this._films.currentPage++;
    };

    this._onMoreButtonClickCb = () => {
      this._renderListFilms(this._filmsComponentElement, this._films.getPreparedFilms());

      this._refreshMoreButton();
    };

    this._films.moreButtonClickCb = this._onMoreButtonClickCb;

    this._onSortButtonClick = (sortType) => {
      this._films.sortType = sortType;
    };

    this._sortTypeChangeCb = () => {
      this._renderListFilms(this._filmsComponentElement, this._films.getPreparedFilms());

      if (this._sortComponent !== null) {
        this._sortComponent.sortType = this._films.sortType;
        this._sortComponent.refreshSortElements();
      }

      this._refreshMoreButton();
    };

    this._films.sortTypeChangeCb = this._sortTypeChangeCb;

    this._onFilterButtonClick = (filterType) => {
      if (this._films.selectedFilter !== filterType) {
        this._films.filterType = filterType;

        if (filterType === Filters.STATS.title) {
          this._filmsContainerComponent.hide();
          this._sortComponent.hide();
          this._statisticComponent.show();
        } else {
          this._filmsContainerComponent.show();
          this._sortComponent.show();
          this._statisticComponent.hide();
        }
      }
    };

    this._filterTypeChangeCb = () => {
      this._renderListFilms(this._filmsComponentElement, this._films.getPreparedFilms());
      this._initFilters();

      this._refreshMoreButton();
    };

    this._films.filterTypeChangeCb = this._filterTypeChangeCb;
  }

  render() {
    this._initHeader();
    this._initContent();
    this._initStatistic();
    this._initFooterStatistic();
  }

  refresh() {
    this._updateAllControllers();
  }

  setReadOnlyMode(isReadOnly) {
    this._isReadOnly = isReadOnly;
    this._filmsControllers.forEach((controller) => {
      controller.isReadOnly = isReadOnly;
    });

    if (this._popupController !== null) {
      this._popupController.render();
    }
  }

  _updateFilm(filmController, oldValue, newValue) {
    this._api.updateFilm(oldValue.id, newValue)
      .then((filmModel) => {
        const isSuccess = this._films.updateFilm(oldValue.id, filmModel);
        if (isSuccess) {

          const updatedFilm = this._films.getFilmById(oldValue.id);
          filmController.render(updatedFilm);

          this._initFilters();
          this._initProfile();
          this._updateAllControllers();
          this._refreshMoreButton();
        }
      }).catch(() => {
        filmController.shake(() => {
          filmController.filmDetailComponent.setRatingWarning();
        }, () => {
          filmController.render(oldValue);
        });
      });
  }

  _createComment(filmController, newComment, film) {
    this._api.createComment(newComment, film.id)
      .then((commentsModel) => {
        const isSuccess = this._films.setComments(commentsModel, film.id);
        if (isSuccess) {
          const updatedFilm = this._films.getFilmById(film.id);

          filmController.render(updatedFilm);

          this._updateAllControllers();
          this._refreshMoreButton();
        }
      }).catch(() => {
        filmController.shake(() => {
          filmController.setAddCommentWarning();
        }, () => {
          filmController.resetAddCommentWarning();
        });
      });
  }

  _deleteComment(filmController, comment, film) {
    this._api.deleteComment(comment.id)
      .then(() => {
        const isSuccess = this._films.removeComment(comment.id, film.id);
        if (isSuccess) {
          const updatedFilm = this._films.getFilmById(film.id);

          filmController.render(updatedFilm);

          this._updateAllControllers();
          this._refreshMoreButton();
        }
      }).catch(() => {
        filmController.shake(null, () => {
          filmController.render(film);
        });
      });
  }

  _getFilmsControlles() {
    return [...this._filmsControllers, ...this._topRatedFilmsControllers, ...this._mostCommentFilmsControllers];
  }

  _renderListFilms(container, films) {
    this._clearFilms(this._filmsControllers);
    this._filmsControllers = [];
    this._renderFilms(container, films, this._filmsControllers);
  }

  _updateAllControllers() {
    const oldFilmsControllers = this._filmsControllers.slice();
    this._filmsControllers = [];
    this._updateControllers(oldFilmsControllers, this._filmsControllers, this._films.getPreparedFilms(), this._filmsComponentElement);

    const oldTopRatedFilmsControllers = this._topRatedFilmsControllers.slice();
    this._topRatedFilmsControllers = [];
    this._updateControllers(oldTopRatedFilmsControllers, this._topRatedFilmsControllers, this._films.topRatedFilms, this._topRatedFilmsComponentElement);

    const oldMostCommentFilmsControllers = this._mostCommentFilmsControllers.slice();
    this._mostCommentFilmsControllers = [];

    this._updateControllers(oldMostCommentFilmsControllers, this._mostCommentFilmsControllers, this._films.mostCommentFilms, this._mostCommentFilmsComponentElement);
  }

  _updateControllers(oldFilmsControllers, filmsControllers, currentPageFilms, container) {
    let isPopupExistInOldFilmControllers = false;
    const isPopupExistInContainer = this._popupController !== null && this._popupController.container === container;

    oldFilmsControllers.forEach((controller) => {
      if (isPopupExistInContainer && controller.film.id === this._popupController.film.id) {
        this._popupController.defaultModeVisibility = false;
        this._popupController.render();
        isPopupExistInOldFilmControllers = true;
      } else {
        controller.removeComponents();
        controller = null;
      }
    });

    let isPopupControllerAdded = false;

    currentPageFilms.forEach((film) => {
      if (isPopupExistInContainer && film.id === this._popupController.film.id && !isPopupControllerAdded && isPopupExistInOldFilmControllers) {
        this._popupController.defaultModeVisibility = true;
        this._popupController.render(film);
        filmsControllers.push(this._popupController);
        isPopupControllerAdded = true;
      } else {
        const controller = new MovieController(container, this._onDataChange, this._onViewChange);
        controller.isReadOnly = this._isReadOnly;
        controller.render(film);
        filmsControllers.push(controller);
      }
    });

    if (isPopupExistInContainer && !isPopupControllerAdded && isPopupExistInOldFilmControllers) {
      filmsControllers.push(this._popupController);
    }
  }

  _renderTopRatedFilms(container, films) {
    this._topRatedFilmsControllers = [];
    this._renderFilms(container, films, this._topRatedFilmsControllers);
  }

  _renderMostCommentFilms(container, films) {
    this._mostCommentFilmsControllers = [];
    this._renderFilms(container, films, this._mostCommentFilmsControllers);
  }

  _renderFilms(container, films, filmsControllers) {
    films.forEach((film) => {
      const filmControler = new MovieController(container, this._onDataChange, this._onViewChange);
      filmControler.isReadOnly = this._isReadOnly;
      filmControler.render(film);

      filmsControllers.push(filmControler);
    });
  }

  _clearFilms(filmsControllers) {
    filmsControllers.forEach((filmController) => {
      filmController.removeComponents();
      filmController = null;
    });
  }

  _setDefaultView() {
    this._getFilmsControlles().forEach((filmController) => {
      filmController.setDefaultView();
    });
  }

  _initHeader() {
    this._initFilters();

    this._initProfile();

    Utils.render(this._mainContainer, this._sortComponent.getElement());
    this._sortComponent._renderSortElements();
    this._sortComponent.addSortButtonClick(this._onSortButtonClick);
  }

  _initFilters() {
    if (this._filterController !== null) {
      this._filterController.destroy();
      this._filterController = null;
    }

    this._filterController = new FilterController(this._mainContainer, this._films);
    this._filterController.render();
    this._filterController.addFilterEvent(this._onFilterButtonClick);
  }

  _initProfile() {
    if (this._profileComponent !== null) {
      this._profileComponent.removeElement();
      this._profileComponent = null;
    }

    this._profileComponent = new Profile(this._films.totalWatchedFilmsCount);
    Utils.render(this._headerContainer, this._profileComponent.getElement());
  }

  _initContent() {
    this._filmsContainerComponent = new FilmsContainer();
    const filmsContainerComponentElement = this._filmsContainerComponent.getElement();

    Utils.render(this._mainContainer, filmsContainerComponentElement);

    if (this._films.totalFilms === 0) {
      Utils.render(filmsContainerComponentElement, new NoFilms().getElement());
      return;
    }

    const currentPageFimls = this._films.getPreparedFilms();

    this._filmsComponent = new Films(FilmComponentType.LIST);
    this._filmsComponentElement = this._filmsComponent.getElement();
    Utils.render(filmsContainerComponentElement, this._filmsComponentElement);
    this._renderListFilms(this._filmsComponentElement, currentPageFimls);

    this._topRatedFilmsComponentElement = new Films(FilmComponentType.TOP_RATED).getElement();
    Utils.render(filmsContainerComponentElement, this._topRatedFilmsComponentElement);
    this._renderTopRatedFilms(this._topRatedFilmsComponentElement, this._films.topRatedFilms);

    this._mostCommentFilmsComponentElement = new Films(FilmComponentType.MOST_COMMENTS).getElement();
    Utils.render(filmsContainerComponentElement, this._mostCommentFilmsComponentElement);
    this._renderMostCommentFilms(this._mostCommentFilmsComponentElement, this._films.mostCommentFilms);

    this._refreshMoreButton();
  }

  _refreshMoreButton() {
    this._destroyMoreButton();

    if (this._films.isAvaliableLoad) {
      this._moreButton = new MoreButton();
      Utils.render(this._filmsComponentElement, this._moreButton.getElement());
      this._moreButton.initMoreButtonClick(this._onMoreButtonClick);
    }
  }

  _destroyMoreButton() {
    if (this._moreButton !== null) {
      this._moreButton.removeElement();
      this._moreButton = null;
    }
  }

  _initFooterStatistic() {
    const footerStatisticComponent = new FooterStatistic(this._films.totalFilms);
    footerStatisticComponent.removeExist();
    Utils.render(this._footer, footerStatisticComponent.getElement());
  }

  _initStatistic() {
    this._statisticComponent = new Statistic(this._films);
    Utils.render(this._mainContainer, this._statisticComponent.getElement());
    this._statisticComponent.addFiltesChangeEvents();
    this._statisticComponent.hide();
  }

  _initDocumentEvents() {
    document.addEventListener(`keydown`, this._onDocumentKeyDown);
  }

  _removeDocumentEvents() {
    document.removeEventListener(`keydown`, this._onDocumentKeyDown);
  }

  _clearPopupController() {
    if (this._popupController !== null) {
      this._popupController = null;
    }
  }
}
