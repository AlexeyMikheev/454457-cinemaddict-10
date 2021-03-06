import Utils from '../utils.js';
import Rating from './rating.js';
import Comments from './comments.js';
import AddNewCommentForm from './add-comment-form.js';
import {FilmDetailType, RELEASE_DATE_FORMAT, DURATION_FORMAT} from '../const.js';
import AbstractSmartComponent from './abstract-smart-component.js';
import Film from '../models/film';
import {debounce} from '../debounce.js';

const getGenresTemplate = (genres) => {
  return genres.map((genre) => {
    return `<span class="film-details__genre">${genre}</span>`;
  }).join(`\n`);
};

const getDetailsTemplate = (filmCard) => {

  const {isFavorite, isWaitingWatched, isWatched} = filmCard;

  const isWaitingWatchedChecked = isWaitingWatched ? `checked` : ``;
  const isWatchedChecked = isWatched ? `checked` : ``;
  const isFavoriteChecked = isFavorite ? `checked` : ``;

  return `<input type="checkbox" class="film-details__control-input visually-hidden" id="watchlist" name="watchlist" ${isWaitingWatchedChecked} data-detail-type="${FilmDetailType.WATCHLIST}">
  <label for="watchlist" class="film-details__control-label film-details__control-label--watchlist">Add to watchlist</label>

  <input type="checkbox" class="film-details__control-input visually-hidden" id="watched" name="watched" ${isWatchedChecked} data-detail-type="${FilmDetailType.WATCHED}">
  <label for="watched" class="film-details__control-label film-details__control-label--watched">Already watched</label>

  <input type="checkbox" class="film-details__control-input visually-hidden" id="favorite" name="favorite" ${isFavoriteChecked} data-detail-type="${FilmDetailType.FAVORITE}">
  <label for="favorite" class="film-details__control-label film-details__control-label--favorite">Add to favorites</label>`;
};

const getFilmDetailTemplate = (filmCard) => {

  const {poster, age, title, originalTitle, rating, producer, writers, actors, duration, country, releaseDate, description, genres} = filmCard;

  const formatedWriters = writers.join(`, `);
  const formatedActors = actors.join(`, `);
  const formatedReleaseDate = Utils.formatTimeStamp(releaseDate, RELEASE_DATE_FORMAT);
  const formatedDuration = Utils.formatDurationTimeStamp(duration, DURATION_FORMAT);
  const genresTitle = genres.length > 1 ? `genres` : `genre`;
  const genresTemplate = getGenresTemplate(genres);

  const detailsTemplate = getDetailsTemplate(filmCard);

  return `<section class="film-details">
  <form class="film-details__inner" action="" method="get">
    <div class="form-details__top-container">

    <div class="film-details__close">
        <button class="film-details__close-btn" type="button">close</button>
      </div>

      <div class="film-details__info-wrap">
        <div class="film-details__poster">
          <img class="film-details__poster-img" src="./${poster}" alt="">

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
       ${detailsTemplate}
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

export default class FilmDetail extends AbstractSmartComponent {
  constructor(film, container, onDataChange, isCommentsReadOnly) {
    super();
    this._container = container;
    this._film = film;
    this._onCloseButtonClickCb = null;
    this._closeBtn = null;
    this._detailsContainer = null;
    this._ratingContainer = null;
    this._ratingComponent = null;
    this._commentsComponent = null;
    this._addCommentComponent = null;
    this._onDataChange = onDataChange;
    this._commentWrapper = null;
    this._isCommentsReadOnly = isCommentsReadOnly;

    this._onDetailCheckedChange = (evt) => {
      const target = evt.target;

      debounce(this._onDetailChange.bind(this, target));
    };

    this._onCommentsChanged = (oldValue, newValue) => {
      if (newValue !== null) {
        this._addCommentComponent.enabled = false;
      }

      if (oldValue !== null) {
        this._commentsComponent.deleteButtonText = `Deleting...`;
      }

      this._onDataChange(oldValue, newValue, this._film);
    };

    this._onRatingChanged = (oldValue, newValue) => {
      this._ratingComponent.enabled = false;
      this._onDataChange(oldValue, newValue);
    };
  }

  get container() {
    return this._container;
  }

  set film(value) {
    this._film = value;
  }

  set isCommentsReadOnly(value) {
    this._isCommentsReadOnly = value;
  }

  getTemplate() {
    return getFilmDetailTemplate(this._film);
  }

  recoveryListeners() {
    this._detailsContainer = this._element.querySelector(`.film-details__controls`);
    this._detailsContainer.addEventListener(`change`, this._onDetailCheckedChange);

    this._closeBtn = this._element.querySelector(`.film-details__close-btn`);
    this._closeBtn.addEventListener(`click`, this._onCloseButtonClickCb);

    this.addRatingCheckedChangeEvent();
  }

  resetComponentsStyles() {
    this._addCommentComponent.enabled = true;
    this._commentsComponent.deleteButtonText = `Delete`;
    this._ratingComponent.resetWarning();
    this._ratingComponent.selectCurrentRating();
  }

  initComponents() {
    this.removeComponents();

    this._initComments();
    if (!this._isCommentsReadOnly) {
      this._initAddCommentForm();
    }
    this._initDetails();
    this._initRating();
    this._updateRating();
  }

  setAddCommentWarning() {
    this._addCommentComponent.showWarning();
  }

  resetAddCommentWarning() {
    this._addCommentComponent.enabled = true;
    this._addCommentComponent.resetWarning();
  }

  setRatingWarning() {
    if (this._ratingComponent !== null) {
      this._ratingComponent.showWarning();
    }
  }

  addRatingCheckedChangeEvent() {
    if (this._ratingComponent !== null) {
      this._ratingComponent.addRatingCheckedChange(this._onRatingChanged);
      this._ratingComponent.addUndoButtonClickEvent(this._onRatingChanged);
    }
  }

  addCloseButtonClickEvent(cb) {
    this._onCloseButtonClickCb = (evt) => {
      cb(evt);
    };

    this._closeBtn = this._element.querySelector(`.film-details__close-btn`);
    this._closeBtn.addEventListener(`click`, this._onCloseButtonClickCb);
  }

  addDetailCheckedChangeEvent() {
    this._detailsContainer = this._element.querySelector(`.film-details__controls`);
    this._detailsContainer.addEventListener(`change`, this._onDetailCheckedChange);
  }

  removeComponents() {
    if (this._commentsComponent !== null) {
      this._commentsComponent.removeComments();
      this._commentsComponent.removeElement();
    }

    if (this._addCommentComponent !== null) {
      this._addCommentComponent.removeEvents();
      this._addCommentComponent.removeElement();
    }

    if (this._ratingComponent !== null) {
      this._ratingComponent.removeElement();
    }

    if (this._detailsContainer !== null) {
      this._detailsContainer.innerText = ``;
    }

    this._commentWrapper = null;
  }

  removeEvents() {
    if (this._closeBtn !== null) {
      this._closeBtn.removeEventListener(`click`, this._onCloseButtonClickCb);
      this._onCloseButtonClickCb = null;
    }

    if (this._detailsContainer !== null) {
      this._detailsContainer.removeEventListener(`change`, this._onDetailCheckedChange);
      this._onDetailCheckedChange = null;
    }

    if (this._ratingComponent !== null) {
      this._ratingComponent.removeRatingEvents();
    }
  }

  _onDetailChange(target) {
    const updatedFilm = new Film({});

    switch (target.dataset[`detailType`]) {
      case FilmDetailType.WATCHLIST:
        const isWaitingWatched = target.checked;
        Object.assign(updatedFilm, this._film, {isWaitingWatched});

        this._onDataChange(this._film, updatedFilm);
        break;
      case FilmDetailType.WATCHED:
        const isWatched = target.checked;
        const personalRating = isWatched ? this._film.personalRating : 0;
        const watchedDate = isWatched ? new Date().valueOf() : 0;

        Object.assign(updatedFilm, this._film, {personalRating, isWatched, watchedDate});
        this._onDataChange(this._film, updatedFilm);
        break;
      case FilmDetailType.FAVORITE:
        const isFavorite = target.checked;

        Object.assign(updatedFilm, this._film, {isFavorite});
        this._onDataChange(this._film, updatedFilm);
        break;
    }
  }

  _updateRating() {
    this._element.querySelector(`.film-details__total-rating`).innerText = this._film.rating;
  }

  _getCommentWrapper() {
    if (this._commentWrapper === null) {
      this._commentWrapper = this._element.querySelector(`.film-details__comments-wrap`);
    }
    return this._commentWrapper;
  }

  _initDetails() {
    if (this._detailsContainer !== null) {
      Utils.insertHtml(this._detailsContainer, getDetailsTemplate(this._film));
    }
  }

  _initRating() {
    if (this._film.isWatched) {
      this._ratingContainer = this._element.querySelector(`.form-details__middle-container`);
      this._ratingComponent = new Rating(this._film);
      this._ratingContainer.appendChild(this._ratingComponent.getElement());

    } else if (this._ratingComponent !== null) {
      this._ratingComponent.removeRatingEvents();
      this._ratingComponent.removeElement();
      this._ratingComponent = null;
      this._ratingContainer = null;
    }
  }

  _initComments() {
    const {comments} = this._film;

    if (comments !== null && comments.length > 0) {
      this._commentsComponent = new Comments(comments, this._onCommentsChanged, this._isCommentsReadOnly);

      const commentWrapper = this._getCommentWrapper();
      if (commentWrapper !== null) {
        commentWrapper.appendChild(this._commentsComponent.getTitleElement());
        commentWrapper.appendChild(this._commentsComponent.getElement());
        this._commentsComponent.initComments();
      }
    }
  }

  _initAddCommentForm() {
    const commentWrapper = this._getCommentWrapper();
    if (commentWrapper !== null) {
      const {comments} = this._film;

      this._addCommentComponent = new AddNewCommentForm(comments, this._onCommentsChanged);
      commentWrapper.appendChild(this._addCommentComponent.getElement());
      this._addCommentComponent.initEvents();
    }
  }
}
