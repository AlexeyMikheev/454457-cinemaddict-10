import AbstractComponent from './abstract-component.js';
import {NoFilmTypes} from '../const.js';

export const getNoFilmsTemplate = (type) => {
  const message = type === NoFilmTypes.LOADING ? `Loading...` : `There are no movies in our database`;
  return `<section class="films-list"><h2 class="films-list__title">${message}</h2></section>`;
};

export default class NoFilms extends AbstractComponent {
  constructor(type = NoFilmTypes.EMPTY) {
    super();
    this._type = type;
  }

  getTemplate() {
    return getNoFilmsTemplate(this._type);
  }
}
