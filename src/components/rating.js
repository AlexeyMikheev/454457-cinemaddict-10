
import {MIN_RATING_VALUE, MAX_RATING_VALUE, RATING_RANGE} from '../const';
import AbstractComponent from './abstract-component.js';
import Film from '../models/film';

const getRatingValuesTemplate = (selectedValue) => {
  let template = ``;

  for (let rating = MIN_RATING_VALUE; rating <= MAX_RATING_VALUE; rating += RATING_RANGE) {
    const isChecked = rating === selectedValue ? `checked` : ``;
    template += `<input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="${rating}" id="rating-${rating}" ${isChecked}>
    <label id="label-rating-${rating}" class="film-details__user-rating-label" for="rating-${rating}">${rating}</label>`;
  }
  return template;
};

const getRatingTemplate = (film) => {

  const {poster, title, personalRating} = film;

  const ratingValuesTemplate = getRatingValuesTemplate(personalRating);

  return `<section class="film-details__user-rating-wrap">
  <div class="film-details__user-rating-controls">
    <button class="film-details__watched-reset" type="button">Undo</button>
  </div>

  <div class="film-details__user-score">
    <div class="film-details__user-rating-poster">
      <img src="./${poster}" alt="film-poster" class="film-details__user-rating-img">
    </div>

    <section class="film-details__user-rating-inner">
      <h3 class="film-details__user-rating-title">${title}</h3>

      <p class="film-details__user-rating-feelings">How you feel it?</p>

      <div class="film-details__user-rating-score">
        ${ratingValuesTemplate}
      </div>
    </section>
  </div>
</section>`;
};

export default class Rating extends AbstractComponent {

  constructor(film) {
    super();
    this._film = film;
    this._detailsContainer = null;
    this._undoButton = null;
    this._enabled = true;
    this._selectedPersonalRating = null;
  }

  set enabled(value) {
    this._enabled = value;
    Array.from(this._element.querySelector(`.film-details__user-rating-input `)).forEach((element) => {
      element.disabled = !this._enabled;
    });
  }

  set selectedRatingStyle(value) {
    const selectedRating = this._element.querySelector(`#label-rating-${this._selectedPersonalRating}`);
    if (selectedRating !== null) {
      selectedRating.style.backgroundColor = value;
    }
  }

  getTemplate() {
    return getRatingTemplate(this._film);
  }

  showWarning() {
    if (this._selectedPersonalRating !== null) {
      this._setBackgroundColor(`#label-rating-${this._selectedPersonalRating}`, `red`);
    }
  }

  resetWarning() {
    if (this._selectedPersonalRating !== null) {
      this._setBackgroundColor(`#label-rating-${this._selectedPersonalRating}`, null);
      this._selectedPersonalRating = null;
    }
  }

  selectCurrentRating() {
    const selectedRating = this._element.querySelector(`#rating-${this._film.personalRating}`);
    if (selectedRating !== null) {
      selectedRating.checked = true;
    }
  }

  addRatingCheckedChange(cb) {
    this._onRatingCheckedChangeCb = (evt) => {
      if (!this._enabled) {
        return;
      }

      const personalRating = parseInt(evt.target.value, 10);

      this._selectedPersonalRating = personalRating;

      const updatedFilm = new Film({});
      Object.assign(updatedFilm, this._film, {personalRating});

      cb(this._film, updatedFilm);
    };
    this._detailsContainer = this._element.querySelector(`.film-details__user-rating-score`);
    this._detailsContainer.addEventListener(`change`, this._onRatingCheckedChangeCb);
  }

  addUndoButtonClickEvent(cb) {
    this._onUndoButtonClickCb = () => {
      if (!this._enabled) {
        return;
      }

      const updatedFilm = new Film({});
      Object.assign(updatedFilm, this._film, {personalRating: 0});

      cb(this._film, updatedFilm);
    };
    this._undoButton = this._element.querySelector(`.film-details__watched-reset`);
    this._undoButton.addEventListener(`click`, this._onUndoButtonClickCb);
  }

  removeRatingEvents() {
    this._detailsContainer.removeEventListener(`change`, this._onRatingCheckedChangeCb);
    this._detailsContainer = null;
    this._onRatingCheckedChangeCb = null;

    this._undoButton.removeEventListener(`click`, this._onUndoButtonClickCb);
    this._onUndoButtonClickCb = null;
    this._undoButton = null;
  }

  recoveryListeners() {
    this._detailsContainer.addEventListener(`change`, this._onRatingCheckedChangeCb);
    this._undoButton.addEventListener(`click`, this._onUndoButtonClickCb);
  }

  _setBackgroundColor(selector, color = null) {
    const selectedRating = this._element.querySelector(selector);
    if (selectedRating !== null) {
      selectedRating.style.backgroundColor = color;
    }
  }
}
