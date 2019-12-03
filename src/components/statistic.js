import {Utils} from '../utils.js';

const createFooterStatisticTemplate = (totalMovies) => {
  return `<section class="footer__statistics"><p>${totalMovies} movies inside</p></section>`;
};

export default class Statistic {
  constructor(totalMovies) {
    this._totalMovies = totalMovies;
  }
  getTemplate() {
    return createFooterStatisticTemplate(this._totalMovies);
  }

  getElement() {
    if (!this._element) {
      this._element = Utils.createElement(this.getTemplate());
    }

    return this._element;
  }

  removeExist() {
    const footerStatistic = document.querySelector(`.footer .footer__statistics`);
    footerStatistic.remove();
  }

  show(container) {
    this.removeExist();

    Utils.render(container, this._element);
  }

  remove() {
    this._element = this._titleElement = this._element = null;
  }
}
