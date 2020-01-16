
import Utils from '../utils.js';
import {FilmDetailType, DURATION_FORMAT} from '../const.js';
import AbstractComponent from './abstract-component.js';
import Film from '../models/film';
import {debounce} from '../debounce.js';

const getFilmTemplate = (filmCard) => {

  const {title, rating, releaseDate, duration, genres, poster, description, comments, isWaitingWatched, isWatched, isFavorite} = filmCard;

  const releaseYear = new Date(releaseDate).getFullYear();
  const formatedDuration = Utils.formatDurationTimeStamp(duration, DURATION_FORMAT);
  const formatedDescription = Utils.getEllipsisDescription(description);
  const formatedCommentsTitle = Utils.getFormatedCommentsTitle(comments);
  const formatedGenres = genres.length > 0 ? genres[0] : ``;

  const isWaitingWatchedClass = isWaitingWatched ? `film-card__controls-item--active` : ``;
  const isWatchedClass = isWatched ? `film-card__controls-item--active` : ``;
  const isFavoriteClass = isFavorite ? `film-card__controls-item--active` : ``;

  return `<article class="film-card">
  <h3 class="film-card__title">${title}</h3>
  <p class="film-card__rating">${rating}</p>
  <p class="film-card__info">
    <span class="film-card__year">${releaseYear}</span>
    <span class="film-card__duration">${formatedDuration}</span>
    <span class="film-card__genre">${formatedGenres}</span>
  </p>
  <img src="./${poster}" alt="" class="film-card__poster">
  <p class="film-card__description">${formatedDescription}</p>
  <a class="film-card__comments">${formatedCommentsTitle}</a>
  <form class="film-card__controls">
    <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist ${isWaitingWatchedClass}" data-detail-type="${FilmDetailType.WATCHLIST}">Add to watchlist</button>
    <button class="film-card__controls-item button film-card__controls-item--mark-as-watched ${isWatchedClass}" data-detail-type="${FilmDetailType.WATCHED}">Mark as watched</button>
    <button class="film-card__controls-item button film-card__controls-item--favorite ${isFavoriteClass}" data-detail-type="${FilmDetailType.FAVORITE}">Mark as favorite</button>
  </form>
</article>`;
};

export default class FilmComponent extends AbstractComponent {

  constructor(film) {
    super();
    this._film = film;
    this._onFilmCardClickCb = null;
    this._onDetailButtonClick = null;
    this._detailsContainer = null;
  }

  getTemplate() {
    return getFilmTemplate(this._film);
  }

  addFilmCardClickEvent(cb) {
    this._onFilmCardClickCb = (evt) => {
      evt.preventDefault();
      if (!evt.target.classList.contains(`film-card__controls-item`)) {
        cb(evt);
      }
    };
    this._element.addEventListener(`click`, this._onFilmCardClickCb);
  }

  addDetailButtonClickEvent(cb) {
    this._onDetailButtonClick = (evt) => {
      debounce(this._onDetailChange.bind(this, cb, evt));
    };

    this._detailsContainer = this._element.querySelector(`.film-card__controls`);
    this._detailsContainer.addEventListener(`click`, this._onDetailButtonClick);
  }

  removeEvents() {
    this._detailsContainer.removeEventListener(`click`, this._onDetailButtonClick);
    this._onDetailButtonClick = null;
    this._element.removeEventListener(`click`, this._onFilmCardClickCb);
    this._onDetailButtonClick = null;
  }

  _onDetailChange(cb, evt) {
    evt.preventDefault();
    const target = evt.target;
    const updatedFilm = new Film({});

    switch (target.dataset[`detailType`]) {
      case FilmDetailType.WATCHLIST:
        const isWaitingWatched = !target.classList.contains(`film-card__controls-item--active`);

        Object.assign(updatedFilm, this._film, {isWaitingWatched});
        cb(this._film, updatedFilm);
        break;
      case FilmDetailType.WATCHED:
        const isWatched = !target.classList.contains(`film-card__controls-item--active`);
        const watchedDate = isWatched ? new Date().valueOf() : 0;

        Object.assign(updatedFilm, this._film, {isWatched, watchedDate});
        cb(this._film, updatedFilm);
        break;
      case FilmDetailType.FAVORITE:
        const isFavorite = !target.classList.contains(`film-card__controls-item--active`);

        Object.assign(updatedFilm, this._film, {isFavorite});
        cb(this._film, updatedFilm);
        break;
    }
  }
}
