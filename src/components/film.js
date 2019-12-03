
import {getFormatedDuration, getEllipsisDescription, getFormatedCommentsTitle} from '../utils.js';

const createFilmsTemplate = () =>
  `<section class="films"></section>`;

const createFilmsListTemplate = () =>
  `<section class="films-list">
  <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>
  <div class="films-list__container"></div>
</section/`;

const createFilmsTopRatedTemplate = () =>
  `<section class="films-list--extra">
    <h2 class="films-list__title">Top rated</h2>
    <div class="films-list__container"></div>
  </section/`;

const createFilmsMostCommentedTemplate = () =>
  `<section class="films-list--extra">
    <h2 class="films-list__title">Most commented</h2>
    <div class="films-list__container"></div>
  </section/`;

const createFilmCardTemplate = (filmCard) => {

  const {title, rating, releaseDate, duration, genres, poster, description, comments, isWaitingWatched, isWatched, isFavorite} = filmCard;

  const releaseYear = releaseDate.getFullYear();
  const formatedDuration = getFormatedDuration(duration);
  const formatedDescription = getEllipsisDescription(description);
  const formatedCommentsTitle = getFormatedCommentsTitle(comments);
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

const createFilmsCardsTemplates = (filmsCards) =>{
  return filmsCards.reduce((fimlCardsTemplates, filmsCard) => {
    fimlCardsTemplates += createFilmCardTemplate(filmsCard);
    return fimlCardsTemplates;
  }, ``);
};

export {createFilmsTemplate, createFilmsListTemplate, createFilmsTopRatedTemplate, createFilmsMostCommentedTemplate, createFilmsCardsTemplates};