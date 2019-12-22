
import {MIN_RATING_VALUE, MAX_RATING_VALUE, RATING_RANGE} from '../const';
import AbstractComponent from './abstract-component.js';
import Film from '../models/film';

const getRatingValuesTemplate = (selectedValue) => {
  let template = ``;

  for (let rating = MIN_RATING_VALUE; rating <= MAX_RATING_VALUE; rating += RATING_RANGE) {
    const isChecked = rating === selectedValue ? `checked` : ``;
    template += `<input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="${rating}" id="rating-${rating}" ${isChecked}>
    <label class="film-details__user-rating-label" for="rating-${rating}">${rating}</label>`;
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
    this._onRatingCheckedChangeCb = null;
  }

  getTemplate() {
    return getRatingTemplate(this._film);
  }

  addRatingCheckedChange(cb) {
    this._onRatingCheckedChangeCb = (evt) => {
      const personalRating = parseInt(evt.target.value, 10);
      const updatedFilm = new Film({});
      Object.assign(updatedFilm, this._film, {personalRating});

      cb(this._film, updatedFilm);
    };

    this._detailsContainer = this._element.querySelector(`.film-details__user-rating-score`);
    this._detailsContainer.addEventListener(`change`, this._onRatingCheckedChangeCb);
  }

  removeRatingCheckedChange() {
    this._detailsContainer.removeEventListener(`change`, this._onRatingCheckedChangeCb);
    this._onRatingCheckedChangeCb = null;
  }

  recoveryListeners() {
    this._detailsContainer = this._element.querySelector(`.film-details__user-rating-score`);
    this._detailsContainer.addEventListener(`change`, this._onRatingCheckedChangeCb);
  }
}
