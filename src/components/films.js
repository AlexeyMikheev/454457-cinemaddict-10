import Utils from '../utils.js';
import {FIMLS_COMPONENT_TYPES} from '../const.js';
import Film from './film.js';

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

export default class Films {
  constructor(films, componentType, parentContainer) {
    this._componentType = componentType;
    this._films = films;
    this._parentContainer = parentContainer;
  }

  static getFilmsContainer() {
    if (!this._filmsContainer) {
      this._filmsContainer = Utils.createElement(createFilmsTemplate());
    }
    return this._filmsContainer;
  }

  static createInstance(films, componentType) {
    return new this(films, componentType, this._filmsContainer);
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

  getElement() {
    if (!this._element) {
      this._element = Utils.createElement(this.getTemplate());
    }
    return this._element;
  }

  addFilms(films) {
    this._films.push(...films);
  }

  initComponets() {
    this._filmsComponents = this._films.map((c) => {
      return new Film(c);
    });

    const filmsListContainer = this._element.querySelector(`.films-list__container`);

    this._filmsComponents.forEach((filmComponent) => {
      filmsListContainer.appendChild(filmComponent.getElement());
      filmComponent.initClickEvent();
    });
  }

  clearComponents() {
    this._filmsComponents.forEach((comment) => {
      comment.remove();
    });

    this._filmsComponents = null;
  }

  remove() {
    this._element = null;
    this._parentContainer = null;
    this._componentType = null;
    this.clearComponents();
  }
}
