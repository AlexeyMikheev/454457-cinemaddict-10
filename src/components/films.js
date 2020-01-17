import {FilmComponentType} from '../const.js';
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
  constructor(componentType) {
    super();
    this._componentType = componentType;
  }

  getTemplate() {
    switch (this._componentType) {
      case FilmComponentType.LIST:
        return createFilmsListTemplate();
      case FilmComponentType.TOP_RATED:
        return createFilmsTopRatedTemplate();
      case FilmComponentType.MOST_COMMENTS:
        return createFilmsMostCommentedTemplate();
      default: return ``;
    }
  }
}
