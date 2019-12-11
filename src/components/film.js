
import Utils from '../utils.js';
import {FilmDetailType} from '../const.js';
import AbstractComponent from './abstract-component.js';

const getFilmTemplate = (filmCard) => {

  const {title, rating, releaseDate, duration, genres, poster, description, comments, isWaitingWatched, isWatched, isFavorite} = filmCard;

  const releaseYear = new Date(releaseDate).getFullYear();
  const formatedDuration = Utils.getFormatedDuration(duration);
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
  <img src="./images/posters/${poster}" alt="" class="film-card__poster">
  <p class="film-card__description">${formatedDescription}</p>
  <a class="film-card__comments">${formatedCommentsTitle}</a>
  <form class="film-card__controls">
    <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist ${isWaitingWatchedClass}" data-detail-type="${FilmDetailType.WATCHLIST}">Add to watchlist</button>
    <button class="film-card__controls-item button film-card__controls-item--mark-as-watched ${isWatchedClass}" data-detail-type="${FilmDetailType.WATCHED}">Mark as watched</button>
    <button class="film-card__controls-item button film-card__controls-item--favorite ${isFavoriteClass}" data-detail-type="${FilmDetailType.FAVORITE}">Mark as favorite</button>
  </form>
</article>`;
};

export default class Film extends AbstractComponent {

  constructor(film) {
    super();
    this._film = film;
    this._onClickCb = null;
    this._onButtonChange = null;
    this._detailsContainer = null;
  }

  getTemplate() {
    return getFilmTemplate(this._film);
  }

  addClickEvent(cb) {
    this._onClickCb = (evt) => {
      cb(evt);
    };
    this._element.addEventListener(`click`, this._onClickCb);
  }

  addButtonChangeEvent(cb) {
    this._onButtonChange = (evt) => {
      const target = evt.target;

      switch (target.dataset[`detailType`]) {
        case FilmDetailType.WATCHLIST:
          const isWaitingWatched = !target.classList.contains(`film-card__controls-item--active`);

          cb(this._film, Object.assign({}, this._film, {isWaitingWatched}));
          break;
        case FilmDetailType.WATCHED:
          const isWatched = !target.classList.contains(`film-card__controls-item--active`);

          cb(this._film, Object.assign({}, this._film, {isWatched}));
          break;
        case FilmDetailType.FAVORITE:
          const isFavorite = !target.classList.contains(`film-card__controls-item--active`);

          cb(this._film, Object.assign({}, this._film, {isFavorite}));
          break;
      }
    };
    this._detailsContainer = this._element.querySelector(`.film-card__controls`);
    this._detailsContainer.addEventListener(`click`, this._onButtonChange);
  }

  removeClickEvent() {
    this._element.removeEventListener(`click`, this._onClickCb);
  }

  removeBttonChangeEvent() {
    this._detailsContainer.removeEventListener(`click`, this._onButtonChange);
    this._onButtonChange = null;
  }
}
