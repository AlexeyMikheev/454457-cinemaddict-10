
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

const createFimlCardTemplate = () =>
  `<article class="film-card">
  <h3 class="film-card__title">The Man with the Golden Arm</h3>
  <p class="film-card__rating">9.0</p>
  <p class="film-card__info">
    <span class="film-card__year">1955</span>
    <span class="film-card__duration">1h 59m</span>
    <span class="film-card__genre">Drama</span>
  </p>
  <img src="./images/posters/the-man-with-the-golden-arm.jpg" alt="" class="film-card__poster">
  <p class="film-card__description">Frankie Machine (Frank Sinatra) is released from the federal Narcotic Farm in Lexington, Kentucky with a set of drums and a new outlook on…</p>
  <a class="film-card__comments">18 comments</a>
  <form class="film-card__controls">
    <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist">Add to watchlist</button>
    <button class="film-card__controls-item button film-card__controls-item--mark-as-watched  film-card__controls-item--active">Mark as watched</button>
    <button class="film-card__controls-item button film-card__controls-item--favorite">Mark as favorite</button>
  </form>
</article>`;

export {createFilmsTemplate, createFilmsListTemplate, createFilmsTopRatedTemplate, createFilmsMostCommentedTemplate, createFimlCardTemplate};
