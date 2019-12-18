import AbstractComponent from './abstract-component.js';

const getMoreButtonTemplate = () => `<button class="films-list__show-more">Show more</button>`;

export default class MoreButton extends AbstractComponent {

  constructor() {
    super();
  }

  getTemplate() {
    return getMoreButtonTemplate();
  }

  initMoreButtonClick(cb) {
    this._element.addEventListener(`click`, cb);
  }
}
