import {FIMLS_COMPONENT_TYPES} from '../const.js';
import Film from './film.js';
import AbstractComponent from './abstract-component.js';

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

export default class Films extends AbstractComponent {
  constructor(films, componentType) {
    super();
    this._componentType = componentType;
    this._films = films;
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

  set films(value) {
    this._films = value;
  }

  refreshComponents(cb) {
    this.clearComponents();
    this.initComponets(cb);
  }

  initComponets(cb) {
    this._filmsComponents = this._films.map((c) => {
      return new Film(c);
    });

    const filmsListContainer = this._element.querySelector(`.films-list__container`);

    this._filmsComponents.forEach((filmComponent) => {
      filmsListContainer.appendChild(filmComponent.getElement());
      filmComponent.addClickEvent(cb);
    });
  }

  clearComponents() {
    this._filmsComponents.forEach((filmComponent) => {
      filmComponent.removeClickEvent();
      filmComponent.removeElement();
    });

    this._filmsComponents = null;
  }
}
