import Profile from './components/profile.js';
import Sort from './components/sort.js';
import Films from './components/films';
import FilmsContainer from './components/films-container';
import MoreButton from './components/more-button.js';
import FooterStatistic from './components/footer-statistic.js';
import Statistic from './components/statistic.js';
import NoFilms from './components/no-films.js';
import MovieController from './movie-controller.js';
import FilterController from './filter-controller.js';

import {FIMLS_COMPONENT_TYPES, ESC_KEY, Filters} from './const.js';
import Utils from './utils.js';

export default class PageController {
  constructor(headerContainer, mainContainer, footer, films) {
    this._films = films;
    this._filmsContainerComponent = null;
    this._filmsComponent = null;
    this._filmsComponentElement = null;
    this._moreButton = null;
    this._sortComponent = new Sort(this._sortType);
    this._statisticComponent = null;
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
        this._initFilters();
        this._initProfile();
      }
    };

    this._onViewChange = () => {
      this._setDefaultView();
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
          this._initStatistic();
        } else {
          this._filmsContainerComponent.show();
          this._sortComponent.show();
          this._destroyStatistic();
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

  _getFilmsControlles() {
    return [...this._filmsControllers, ...this._topRatedFilmsControllers, ...this._mostCommentFilmsControllers];
  }

  render() {
    this._initHeader();
    this._initContent();
    this._initDocumentEvents();
    this._initFooterStatistic();
  }

  _renderListFilms(container, films) {
    this._clearFilms(this._filmsControllers);
    this._filmsControllers = [];
    this._renderFilms(container, films, this._filmsControllers);
  }

  _renderTopRatedFilms(container, films) {
    this._clearFilms(this._topRatedFilmsControllers);
    this._topRatedFilmsControllers = [];
    this._renderFilms(container, films, this._topRatedFilmsControllers);
  }

  _renderMostCommentFilms(container, films) {
    this._clearFilms(this._mostCommentFilmsControllers);
    this._mostCommentFilmsControllers = [];
    this._renderFilms(container, films, this._mostCommentFilmsControllers);
  }

  _renderFilms(container, films, filmsControllers) {
    films.forEach((film) => {
      const filmControler = new MovieController(container, this._onDataChange, this._onViewChange);
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

    if (this._films.length === 0) {
      Utils.render(filmsContainerComponentElement, new NoFilms().getElement());
      return;
    }

    const currentPageFimls = this._films.getPreparedFilms();

    this._filmsComponent = new Films(FIMLS_COMPONENT_TYPES.FIMLS);
    this._filmsComponentElement = this._filmsComponent.getElement();
    Utils.render(filmsContainerComponentElement, this._filmsComponentElement);
    this._renderListFilms(this._filmsComponentElement, currentPageFimls);

    const topRatedFilmsComponentElement = new Films(FIMLS_COMPONENT_TYPES.TOP_RATED).getElement();
    Utils.render(filmsContainerComponentElement, topRatedFilmsComponentElement);
    this._renderTopRatedFilms(topRatedFilmsComponentElement, this._films.topRatedFilms);

    const mostCommentFilmsComponentElement = new Films(FIMLS_COMPONENT_TYPES.MOST_COMMENTS).getElement();
    Utils.render(filmsContainerComponentElement, mostCommentFilmsComponentElement);
    this._renderMostCommentFilms(mostCommentFilmsComponentElement, this._films.mostCommentFilms);

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
    this._statisticComponent.renderChart();
  }

  _destroyStatistic() {
    if (this._statisticComponent !== null) {
      this._statisticComponent.removeElement();
      this._statisticComponent = null;
    }
  }


  _initDocumentEvents() {
    document.addEventListener(`keydown`, (evt) => {
      if (evt.keyCode === ESC_KEY) {
        this._setDefaultView();
      }
    });
  }
}
