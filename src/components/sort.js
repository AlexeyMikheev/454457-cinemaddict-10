import AbstractComponent from './abstract-component.js';

export const getSortTemplate = () =>
  `<ul class="sort">
    <li><a href="#" class="sort__button sort__button--active">Sort by default</a></li>
    <li><a href="#" class="sort__button">Sort by date</a></li>
    <li><a href="#" class="sort__button">Sort by rating</a></li>
  </ul>`;

export default class Sotr extends AbstractComponent {
  constructor() {
    super();
  }

  getTemplate() {
    return getSortTemplate();
  }
}
