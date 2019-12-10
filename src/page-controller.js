import Profile from './components/profile.js';
import Menu from './components/menu.js';
import Sort from './components/sort.js';
import Films from './components/films';
import FilmsContainer from './components/films-container';
import MoreButton from './components/more-button.js';
import Statistic from './components/statistic.js';
import NoFilms from './components/no-films.js';
import MovieController from './movie-controller.js';

import {ONE_TASKS_PAGE_COUNT, Filters, FIMLS_COMPONENT_TYPES, RenderPosition, ESC_KEY, SortTypes} from './const.js';
import Utils from './utils.js';

export default class PageController {
  constructor(headerContainer, mainContainer, footer) {
    this._films = null;
    this._filters = null;
    this._currentPage = 0;
    this._sortType = SortTypes.DEFAULT;
    this._filmsComponent = null;
    this._filmsComponentElement = null;
    this._moreButton = null;
    this._sortComponent = new Sort(this._sortType);
    this._headerContainer = headerContainer;
    this._mainContainer = mainContainer;
    this._footer = footer;

    this._filmsControllers = [];
    this._topRatedFilmsControllers = [];
    this._mostCommentFilmsControllers = [];
  }

  getFilmsControlles() {
    return [...this._filmsControllers, ...this._topRatedFilmsControllers, ...this._mostCommentFilmsControllers];
  }

  render(films, filters) {
    this._films = films;
    this._filters = filters;

    this._onDataChange = (oldValue, newValue) => {
      this.getFilmsControlles().forEach((filmController) => {
        if (filmController.film === oldValue) {
          debugger;
        }
      });
    };

    this._isMoreButtonVisible = () => {
      return (this._currentPage + 1) * ONE_TASKS_PAGE_COUNT < this._films.length;
    };

    this._onMoreButtonClick = () => {
      this._currentPage++;

      const sortedFilms = this.getFilms();

      this.renderListFilms(this._filmsComponentElement, sortedFilms);

      if (!this._isMoreButtonVisible()) {
        this._moreButton.removeElement();
      }
    };

    this._onSortButtonClick = (sortType) => {
      this._sortType = sortType;

      if (this._sortComponent !== null) {
        this._sortComponent.selectedFilter = this._sortType;
        this._sortComponent.refreshSortElements();

        const sortedFilms = this.getFilms();

        this.renderListFilms(this._filmsComponentElement, sortedFilms);
      }
    };

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
      const filmControler = new MovieController(container, this._onDataChange);
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

    Utils.render(this._mainContainer, this._sortComponent.getElement());
    this._sortComponent.renderSortElements();
    this._sortComponent.addSortEvent(this._onSortButtonClick);
  }

  initContent() {
    const filmsContainer = new FilmsContainer().getElement();
    Utils.render(this._mainContainer, filmsContainer);

    if (this._films.length === 0) {
      Utils.render(filmsContainer, new NoFilms().getElement());
      return;
    }

    const currentPageFimls = Utils.getFilmsByPageNumber(this._films, this._currentPage);

    this._filmsComponent = new Films(FIMLS_COMPONENT_TYPES.FIMLS);

    this._filmsComponentElement = this._filmsComponent.getElement();
    Utils.render(filmsContainer, this._filmsComponentElement);

    this.renderListFilms(this._filmsComponentElement, currentPageFimls);

    const hasRatingFilms = this._films.filter((f) => {
      return f.rating > 0;
    });

    const topRatedFilms = Utils.getTopFilmsByProperty(hasRatingFilms, `rating`);

    const topRatedFilmsComponentElement = new Films(FIMLS_COMPONENT_TYPES.TOP_RATED).getElement();
    Utils.render(filmsContainer, topRatedFilmsComponentElement);
    this.renderTopRatedFilms(topRatedFilmsComponentElement, topRatedFilms);

    const hasCommentsFilms = this._films.filter((f) => {
      return f.comments !== null && f.comments.length > 0;
    });

    const mostCommentFilms = Utils.getTopFilmsByProperty(hasCommentsFilms, `comments`);

    const mostCommentFilmsComponentElement = new Films(FIMLS_COMPONENT_TYPES.MOST_COMMENTS).getElement();
    Utils.render(filmsContainer, mostCommentFilmsComponentElement);
    this.renderMostCommentFilms(mostCommentFilmsComponentElement, mostCommentFilms);

    this.initMoreButton(this._filmsComponentElement);
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
        this.getFilmsControlles().forEach((filmController) => {
          if (filmController.HasFilmDeatail) {
            filmController.removeDetailComponent();
          }
        });
      }
    });
  }

  getSortedFilms(sortType, films) {
    switch (sortType) {
      case SortTypes.DEFAULT:
        return films;
      case SortTypes.DATE:
        return Utils.getSortedFilms(films, `releaseDate`);
      case SortTypes.RATING:
        return Utils.getSortedFilms(films, `rating`);
      default: return films;
    }
  }

  getFilms() {
    const pageFilms = Utils.getFilmsByPageNumber(this._films, this._currentPage);
    return this.getSortedFilms(this._sortType, pageFilms);
  }
}
