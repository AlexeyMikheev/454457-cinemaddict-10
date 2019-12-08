import Utils from '../utils.js';
import {FIMLS_COMPONENT_TYPES} from '../const.js';
import Film from './film.js';

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

export default class Films {
  constructor(films, componentType) {
    this._componentType = componentType;
    this._films = films;
  }

  getElement() {
    if (!this._element) {
      this._element = Utils.createElement(this.getTemplate());
    }
    return this._element;
  }

  getTemplate() {
    switch (this._componentType) {
      case FIMLS_COMPONENT_TYPES.FIMLS:
        return createFilmsListTemplate();
      case FIMLS_COMPONENT_TYPES.TOP_RATED:
        return createFilmsTopRatedTemplate();
      case FIMLS_COMPONENT_TYPES.MOST_COMMENTS:
        return createFilmsMostCommentedTemplate();
      default: return ``;
    }
  }

  addFilms(films) {
    this._films.push(...films);
  }

  initComponets(cb) {
    this._filmsComponents = this._films.map((c) => {
      return new Film(c);
    });

    const filmsListContainer = this._element.querySelector(`.films-list__container`);

    this._filmsComponents.forEach((filmComponent) => {
      filmsListContainer.appendChild(filmComponent.getElement());
      filmComponent.initClickEvent(cb);
    });
  }

  clearComponents() {
    this._filmsComponents.forEach((filmComponent) => {
      filmComponent.removeCb();
      filmComponent.removeElement();
    });

    this._filmsComponents = null;
  }

  removeElement() {
    this._element.removeElement();
    this._element = null;
    this._componentType = null;
  }
}
