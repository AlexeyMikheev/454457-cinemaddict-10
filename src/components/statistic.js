import {Utils} from '../utils.js';

const createFooterStatisticTemplate = (totalMovies) => {
  return `<section class="footer__statistics"><p>${totalMovies} movies inside</p></section>`;
};

export default class Statistic {
  constructor(totalMovies) {
    this._totalMovies = totalMovies;
    this.init();
  }

  init() {
    if (!this._element) {
      this._element = Utils.createElement(this.getTemplate());
    }
  }

  getTemplate() {
    return createFooterStatisticTemplate(this._totalMovies);
  }

  get Element() {
    return this._element;
  }

  removeExist() {
    const footerStatistic = document.querySelector(`.footer .footer__statistics`);
    if (footerStatistic !== null) {
      footerStatistic.remove();
    }
  }

  render(container) {
    this.removeExist();

    Utils.render(container, this._element);
  }

  remove() {
    this._element = this._titleElement = null;
  }
}
