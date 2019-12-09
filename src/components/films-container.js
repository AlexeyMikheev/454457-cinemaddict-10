import AbstractComponent from './abstract-component.js';

const createFilmsContainerTemplate = () =>
  `<section class="films"></section>`;

export default class FilmsContainer extends AbstractComponent {
  constructor() {
    super();
  }

  getTemplate() {
    return createFilmsContainerTemplate();
  }
}
