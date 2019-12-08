
import Utils from '../utils.js';

const getTemplate = (filmCard) => {

  const {title, rating, releaseDate, duration, genres, poster, description, comments, isWaitingWatched, isWatched, isFavorite} = filmCard;

  const releaseYear = releaseDate.getFullYear();
  const formatedDuration = Utils.getFormatedDuration(duration);
  const formatedDescription = Utils.getEllipsisDescription(description);
  const formatedCommentsTitle = Utils.getFormatedCommentsTitle(comments);
  const formatedGenres = genres.length > 0 ? genres[0] : ``;

  const activeClass = isFavorite || isWatched || isWaitingWatched ? `film-card__controls-item--active` : ``;

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
    <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist ${activeClass}">Add to watchlist</button>
    <button class="film-card__controls-item button film-card__controls-item--mark-as-watched ${activeClass} film-card__controls-item--active">Mark as watched</button>
    <button class="film-card__controls-item button film-card__controls-item--favorite ${activeClass}">Mark as favorite</button>
  </form>
</article>`;
};

export default class Film {

  constructor(film) {
    this._film = film;
    this._onClickCb = null;
  }

  initClickEvent(cb) {
    this._onClickCb = (evt) => {
      cb(evt, this._film);
    };
    this._element.addEventListener(`click`, this._onClickCb);
  }

  getElement() {
    if (!this._element) {
      this._element = Utils.createElement(getTemplate(this._film));
    }
    return this._element;
  }

  removeCb() {
    this._element.removeEventListener(`click`, this._onClickCb);
  }

  removeElement() {
    this._element.remove();
    this._element = null;
  }
}
