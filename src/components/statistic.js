import Utils from '../utils.js';

const getTemplate = (totalMovies) => {
  return `<section class="footer__statistics"><p>${totalMovies} movies inside</p></section>`;
};

export default class Statistic {
  constructor(totalMovies) {
    this._totalMovies = totalMovies;
    this._element = null;
  }

  getElement() {
    if (!this._element) {
      this._element = Utils.createElement(getTemplate(this._totalMovies));
    }
    return this._element;
  }

  removeExist() {
    const footerStatistic = document.querySelector(`.footer .footer__statistics`);
    if (footerStatistic !== null) {
      footerStatistic.remove();
    }
  }

  removeElement() {
    this._element = null;
  }
}
