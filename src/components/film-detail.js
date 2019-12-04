import Utils from '../utils.js';
import {RenderPosition, ESC_KEY} from '../const.js';
import Comments from './comments.js';

const createGenresTemplate = (genres) => {
  return genres.map((genre) => {
    return `<span class="film-details__genre">${genre}</span>`;
  }).join(`\n`);
};

const createFilmDetailtemplate = (filmCard) => {

  const {poster, age, title, originalTitle, rating, producer, writers, actors, duration, country, releaseDate, description, genres} = filmCard;

  const formatedWriters = writers.join(`, `);
  const formatedActors = actors.join(`, `);
  const formatedReleaseDate = Utils.getFormatedReleaseDate(releaseDate);
  const formatedDuration = Utils.getFormatedDuration(duration);
  const genresTitle = genres.length > 1 ? `genres` : `genre`;
  const genresTemplate = createGenresTemplate(genres);

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
        <input type="checkbox" class="film-details__control-input visually-hidden" id="watchlist" name="watchlist">
        <label for="watchlist" class="film-details__control-label film-details__control-label--watchlist">Add to watchlist</label>

        <input type="checkbox" class="film-details__control-input visually-hidden" id="watched" name="watched">
        <label for="watched" class="film-details__control-label film-details__control-label--watched">Already watched</label>

        <input type="checkbox" class="film-details__control-input visually-hidden" id="favorite" name="favorite">
        <label for="favorite" class="film-details__control-label film-details__control-label--favorite">Add to favorites</label>
      </section>
    </div>

    <div class="form-details__bottom-container">
      <section class="film-details__comments-wrap">

      </section>
    </div>
  </form>
</section>`;
};

export default class FilmDeatil {
  constructor(film) {
    this._film = film;
    this.init();
  }

  getTamplate() {
    return this.createFilmDetailtemplate(this._film);
  }

  init() {
    this._element = Utils.createElement(this.getTemplate());

    const {comments} = this._film;

    if (comments !== null && comments.length > 0) {
      let commentsComponent = new Comments(comments);

      const commentWrapper = this._element.querySelector(`.film-details__comments-wrap`);
      if (commentWrapper !== null) {
        commentWrapper.appendChild(commentsComponent.Element);
      }
    }
  }

  get Element() {
    return this._element;
  }

  getTemplate() {
    return createFilmDetailtemplate(this._film);
  }

  render(container) {
    Utils.render(container, this._element, RenderPosition.BEFOREEND);
    this.addCloseEvents();
  }

  addCloseEvents() {
    let closeBtn = this._element.querySelector(`.film-details__close-btn`);
    closeBtn.addEventListener(`click`, () => {
      this.remove();
    });
    document.addEventListener(`keydown`, this.getOnDocumentKeyDown());
    // document.addEventListener(`click`, this.getOnDocumentClick());
  }

  getOnDocumentKeyDown() {
    return (evt) => {
      if (evt.keyCode === ESC_KEY) {
        this.remove();
      }
    };
  }

  // getOnDocumentClick() {
  //   return (evt) => {
  //     this.remove();
  //   };
  // }

  remove() {
    if (this._element !== null) {
      this._element.remove();
      document.removeEventListener(`keydown`, this.getOnDocumentKeyDown());
      // document.removeEventListener(`click`, this.getOnDocumentClick());
      this._element = this._titleElement = this._element = null;
    }
  }
}
