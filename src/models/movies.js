import {ONE_TASKS_PAGE_COUNT, SortTypes} from '../const.js';
import Utils from "../utils.js";

export default class Movies {
  constructor() {
    this._films = [];
    this._currentPage = 0;
    this._sortType = SortTypes.DEFAULT;
    this._filterType = Utils.getDefaultSelectedFilter().title;
    this._filterChangeCb = null;
    this._sortTypeChangeCb = null;
    this._filterTypeChangeCb = null;
    this._moreButtonClickCb = null;
  }

  set films(value) {
    this._films = value;
  }

  get films() {
    return this._films;
  }

  getFilmById(id) {
    return Utils.getFilmByid(this._films, id);
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
    return (this._currentPage + 1) * ONE_TASKS_PAGE_COUNT < this._films.length;
  }

  set currentPage(value) {
    this._currentPage = value;

    this._callCb(this._moreButtonClickCb);
  }

  get currentPage() {
    return this._currentPage;
  }

  set moreButtonClickCb(cb) {
    this._moreButtonClickCb = cb;
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

  getFilms() {
    const pageFilms = Utils.getFilmsByPageNumber(this._films, this._currentPage);
    return Utils.getSortedFilms(this._sortType, pageFilms);
  }

  _callCb(cb) {
    if (cb !== null) {
      cb();
    }
  }
}
