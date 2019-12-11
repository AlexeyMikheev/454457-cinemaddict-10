import Utils from '../utils.js';
import Rating from './rating.js';
import Comments from './comments.js';
import AddNewCommentForm from './add-comment-form.js';
import {FilmDetailType} from '../const.js';
import AbstractSmartComponent from './abstract-smart-component.js';

const getGenresTemplate = (genres) => {
  return genres.map((genre) => {
    return `<span class="film-details__genre">${genre}</span>`;
  }).join(`\n`);
};

const getFilmDetailTemplate = (filmCard) => {

  const {poster, age, title, originalTitle, rating, producer, writers, actors, duration, country, releaseDate, description, genres, isFavorite, isWaitingWatched, isWatched} = filmCard;

  const formatedWriters = writers.join(`, `);
  const formatedActors = actors.join(`, `);
  const formatedReleaseDate = Utils.getFormatedReleaseDate(releaseDate);
  const formatedDuration = Utils.getFormatedDuration(duration);
  const genresTitle = genres.length > 1 ? `genres` : `genre`;
  const genresTemplate = getGenresTemplate(genres);

  const isWaitingWatchedChecked = isWaitingWatched ? `checked` : ``;
  const isWatchedChecked = isWatched ? `checked` : ``;
  const isFavoriteChecked = isFavorite ? `checked` : ``;

  return `<section class="film-details">
  <form class="film-details__inner" action="" method="get">
    <div class="form-details__top-container">

    <div class="film-details__close">
        <button class="film-details__close-btn" type="button">close</button>
      </div>

      <div class="film-details__info-wrap">
        <div class="film-details__poster">
          <img class="film-details__poster-img" src="./images/posters/${poster}" alt="">

          <p class="film-details__age">${age}+</p>
        </div>

        <div class="film-details__info">
          <div class="film-details__info-head">
            <div class="film-details__title-wrap">
              <h3 class="film-details__title">${title}</h3>
              <p class="film-details__title-original">Original: ${originalTitle}</p>
            </div>

            <div class="film-details__rating">
              <p class="film-details__total-rating">${rating}</p>
            </div>
          </div>

          <table class="film-details__table">
            <tr class="film-details__row">
              <td class="film-details__term">Director</td>
              <td class="film-details__cell">${producer}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Writers</td>
              <td class="film-details__cell">${formatedWriters}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Actors</td>
              <td class="film-details__cell">${formatedActors}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Release Date</td>
              <td class="film-details__cell">${formatedReleaseDate}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Runtime</td>
              <td class="film-details__cell">${formatedDuration}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Country</td>
              <td class="film-details__cell">${country}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">${genresTitle}</td>
              <td class="film-details__cell">
               ${genresTemplate}
              </td>
            </tr>
          </table>

          <p class="film-details__film-description">
            ${description}
          </p>
        </div>
      </div>

      <section class="film-details__controls">
        <input type="checkbox" class="film-details__control-input visually-hidden" id="watchlist" name="watchlist" ${isWaitingWatchedChecked} data-detail-type="${FilmDetailType.WATCHLIST}">
        <label for="watchlist" class="film-details__control-label film-details__control-label--watchlist">Add to watchlist</label>

        <input type="checkbox" class="film-details__control-input visually-hidden" id="watched" name="watched" ${isWatchedChecked} data-detail-type="${FilmDetailType.WATCHED}">
        <label for="watched" class="film-details__control-label film-details__control-label--watched">Already watched</label>

        <input type="checkbox" class="film-details__control-input visually-hidden" id="favorite" name="favorite" ${isFavoriteChecked} data-detail-type="${FilmDetailType.FAVORITE}">
        <label for="favorite" class="film-details__control-label film-details__control-label--favorite">Add to favorites</label>
      </section>
    </div>

    <div class="form-details__middle-container">

    </div>

    <div class="form-details__bottom-container">
      <section class="film-details__comments-wrap">

      </section>
    </div>
  </form>
</section>`;
};

export default class FilmDeatil extends AbstractSmartComponent {
  constructor(film, container, onDataChange) {
    super();
    this._container = container;
    this._film = film;
    this._onClickCb = null;
    this._closeBtn = null;
    this._detailsContainer = null;
    this._ratingContainer = null;
    this._ratingComponent = null;
    this._commentsComponent = null;
    this._addCommentComponent = null;
    this._onDataChange = onDataChange;
  }

  getTemplate() {
    return getFilmDetailTemplate(this._film);
  }

  get container() {
    return this._container;
  }

  set film(value) {
    this._film = value;
  }

  initComponents() {
    this.initComments();
    this.initAddCommentForm();
    this.initRating();
  }

  initRating() {
    if (this._film.isWatched) {
      this._ratingContainer = this._element.querySelector(`.form-details__middle-container`);
      this._ratingComponent = new Rating(this._film);
      this._ratingContainer.appendChild(this._ratingComponent.getElement());

    } else if (this._ratingComponent !== null) {
      this._ratingComponent.removeCheckedChangeEvent();
      this._ratingComponent.removeElement();
      this._ratingComponent = null;
      this._ratingContainer = null;
    }
  }

  addRatingCheckedChangeEvent() {
    if (this._ratingComponent !== null) {
      this._ratingComponent.addCheckedChangeEvent(this._onDataChange);
    }
  }

  getCommentWrapper() {
    return this._element.querySelector(`.film-details__comments-wrap`);
  }

  initComments() {
    const {comments} = this._film;

    if (comments !== null && comments.length > 0) {
      this._commentsComponent = new Comments(comments);

      const commentWrapper = this.getCommentWrapper();
      if (commentWrapper !== null) {
        commentWrapper.appendChild(this._commentsComponent.getTitleElement());
        commentWrapper.appendChild(this._commentsComponent.getElement());
        this._commentsComponent.initComments();
      }
    }
  }

  initAddCommentForm() {
    const commentWrapper = this.getCommentWrapper();
    if (commentWrapper !== null) {
      this._addCommentComponent = new AddNewCommentForm();
      commentWrapper.appendChild(this._addCommentComponent.getElement());
    }
  }

  addCloseEvent(cb) {
    this._onClickCb = (evt) => {
      cb(evt);
    };

    this._closeBtn = this._element.querySelector(`.film-details__close-btn`);
    this._closeBtn.addEventListener(`click`, this._onClickCb);
  }

  addDetailCheckedChangeEvent() {
    this._onDetailCheckedChange = (evt) => {
      const target = evt.target;

      switch (target.dataset[`detailType`]) {
        case FilmDetailType.WATCHLIST:
          const isWaitingWatched = target.checked;
          this._onDataChange(this._film, {isWaitingWatched});
          break;
        case FilmDetailType.WATCHED:
          const isWatched = target.checked;
          const rating = isWatched ? this._film.rating : 0;
          this._onDataChange(this._film, {rating, isWatched});
          break;
        case FilmDetailType.FAVORITE:
          const isFavorite = target.checked;
          this._onDataChange(this._film, {isFavorite});
          break;
      }
    };
    this._detailsContainer = this._element.querySelector(`.film-details__controls`);
    this._detailsContainer.addEventListener(`change`, this._onDetailCheckedChange);
  }

  removeComponents() {
    if (this._commentsComponent !== null) {
      this._commentsComponent.removeElement();
    }

    if (this._addCommentComponent !== null) {
      this._addCommentComponent.removeElement();
    }

    if (this._ratingComponent !== null) {
      this._ratingComponent.removeElement();
    }
  }

  removeEvents() {
    this._closeBtn.removeEventListener(`click`, this._onClickCb);
    this._onClickCb = null;

    this._detailsContainer.removeEventListener(`change`, this._onDetailCheckedChange);
    this._onDetailCheckedChange = null;

    if (this._ratingComponent !== null) {
      this._ratingComponent.removeCheckedChangeEvent();
    }
  }


  recoveryListeners() {
    this._detailsContainer = this._element.querySelector(`.film-details__controls`);
    this._detailsContainer.addEventListener(`change`, this._onDetailCheckedChange);

    this._closeBtn = this._element.querySelector(`.film-details__close-btn`);
    this._closeBtn.addEventListener(`click`, this._onClickCb);

    this.addRatingCheckedChangeEvent();
  }
}
