import {ONE_TASKS_PAGE_COUNT, SortTypes, Filters, Period} from '../const.js';
import Utils from '../utils.js';

export default class Films {
  constructor() {
    this._films = [];
    this._displayedFilms = [];
    this._currentPage = 0;
    this._sortType = SortTypes.DEFAULT;
    this._filterType = Utils.getDefaultSelectedFilter().title;
    this._filterChangeCb = null;
    this._sortTypeChangeCb = null;
    this._filterTypeChangeCb = null;
    this._moreButtonClickCb = null;
    this._datachangeCb = null;
  }

  set films(value) {
    this._films = value;
    this._displayedFilms = value;
  }

  get films() {
    return this._films;
  }

  get totalFilms() {
    return this._films.length;
  }

  get totalWatchedFilmsCount() {
    return Utils.getFiltredFilms(Filters.HISTORY.title, this._films).length;
  }

  get topRatedFilms() {
    const hasRatingFilms = this._films.filter((f) => {
      return f.rating > 0;
    });

    return Utils.getTopFilmsByProperty(hasRatingFilms, `rating`);
  }

  get mostCommentFilms() {
    const hasCommentsFilms = this._films.filter((f) => {
      return f.comments !== null && f.comments.length > 0;
    });

    return Utils.getTopFilmsByProperty(hasCommentsFilms, `comments`);
  }

  get isAvaliableLoad() {
    return (this._currentPage + 1) * ONE_TASKS_PAGE_COUNT < this._getCurrentCountFilms();
  }

  set currentPage(value) {
    this._currentPage = value;

    this._callCb(this._moreButtonClickCb);
  }

  get currentPage() {
    return this._currentPage;
  }

  set moreButtonClickCb(value) {
    this._moreButtonClickCb = value;
  }

  set sortType(value) {
    this._sortType = value;

    this._callCb(this._sortTypeChangeCb);
  }

  get sortType() {
    return this._sortType;
  }

  set sortTypeChangeCb(cb) {
    this._sortTypeChangeCb = cb;
  }

  get filterType() {
    return this._filterType;
  }

  set filterType(value) {
    this._filterType = value;

    this._callCb(this._filterTypeChangeCb);
  }

  set filterTypeChangeCb(cb) {
    this._filterTypeChangeCb = cb;
  }

  set dataChangeCb(cb) {
    this._datachangeCb = cb;
  }

  isFilmAvaliableAtCurrentFilter(film) {
    return Utils.isFilmAvaliableAtFilter(this._filterType, film);
  }

  getWathedFilmsByPeriod(period = Period.ALL) {
    const watchedfilms = Utils.getFiltredFilms(Filters.HISTORY.title, this._films);
    const today = new Date().valueOf();

    switch (period) {
      case Period.ALL: return watchedfilms;
      case Period.TODAY:
        return watchedfilms.filter((film) => {
          const startDate = Utils.changeDate(today, `day`, -1);
          return Utils.isDateInRange(film.watchedDate, startDate, today);
        });
      case Period.WEEK:
        return watchedfilms.filter((film) => {
          const startDate = Utils.changeDate(today, `week`, -1);
          return Utils.isDateInRange(film.watchedDate, startDate, today);
        });
      case Period.MONTH:
        return watchedfilms.filter((film) => {
          const startDate = Utils.changeDate(today, `months`, -1);
          return Utils.isDateInRange(film.watchedDate, startDate, today);
        });
      case Period.YEAR:
        return watchedfilms.filter((film) => {
          const startDate = Utils.changeDate(today, `year`, -1);
          return Utils.isDateInRange(film.watchedDate, startDate, today);
        });
      default: return watchedfilms;
    }
  }

  getFilmById(id) {
    return Utils.getFilmByid(this._films, id);
  }

  getPreparedFilms() {
    const filtredFilms = Utils.getFiltredFilms(this._filterType, this._films);
    this._displayedFilms = Utils.getSortedFilms(this._sortType, filtredFilms);

    return Utils.getFilmsByPageNumber(this._displayedFilms, this._currentPage);
  }

  updateFilm(id, film) {
    const index = this._films.findIndex((it) => it.id === id);

    if (index === -1) {
      return false;
    }

    film.comments = this._films[index].comments.slice();

    this._films = [].concat(this._films.slice(0, index), film, this._films.slice(index + 1));

    return true;
  }

  setComments(comments, filmId) {
    const film = this.getFilmById(filmId);

    if (film === null) {
      return false;
    }

    film.comments = comments;

    return true;
  }

  removeComment(id, filmId) {
    const film = this.getFilmById(filmId);

    if (film === null) {
      return false;
    }

    const index = film.comments.findIndex((it) => it.id === id);

    if (index === -1) {
      return false;
    }

    film.comments = [].concat(film.comments.slice(0, index), film.comments.slice(index + 1));

    return true;
  }

  _callCb(cb) {
    if (cb !== null) {
      cb();
    }
  }

  _getCurrentCountFilms() {
    return this._filterType === Filters.ALL.title ? this._films.length : this._displayedFilms.length;
  }
}
