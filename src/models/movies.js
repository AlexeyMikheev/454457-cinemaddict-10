import {ONE_TASKS_PAGE_COUNT, SortTypes, Filters} from '../const.js';
import Utils from "../utils.js";

export default class Movies {
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

  _getCurrentCountFilms() {
    return this._filterType === Filters.ALL.title ? this._films.length : this._displayedFilms.length;
  }

  getFilmById(id) {
    return Utils.getFilmByid(this._films, id);
  }

  getFilms() {
    const filtredFilms = Utils.getFiltredFilms(this._filterType, this._films);
    this._displayedFilms = Utils.getSortedFilms(this._sortType, filtredFilms);

    return Utils.getFilmsByPageNumber(this._displayedFilms, this._currentPage);
  }

  updateFilm(id, newFilm) {
    const index = this._films.findIndex((it) => it.id === id);

    if (index === -1) {
      return false;
    }

    this._films = [].concat(this._films.slice(0, index), newFilm, this._films.slice(index + 1));

    return true;
  }

  _callCb(cb) {
    if (cb !== null) {
      cb();
    }
  }
}
