import AbstractComponent from './abstract-component.js';

export const getNoFilmsTemplate = () =>
  `<section class="films-list"><h2 class="films-list__title">There are no movies in our database</h2></section>`;

export default class NoFilms extends AbstractComponent {
  constructor() {
    super();
  }

  getTemplate() {
    return getNoFilmsTemplate();
  }
}
