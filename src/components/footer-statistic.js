import AbstractComponent from './abstract-component.js';

const getStatisticTemplate = (totalMovies) => {
  return `<section class="footer__statistics"><p>${totalMovies} movies inside</p></section>`;
};

export default class FooterStatistic extends AbstractComponent {
  constructor(totalMovies) {
    super();
    this._totalMovies = totalMovies;
  }

  getTemplate() {
    return getStatisticTemplate(this._totalMovies);
  }

  removeExist() {
    const footerStatistic = document.querySelector(`.footer .footer__statistics`);
    if (footerStatistic !== null) {
      footerStatistic.remove();
    }
  }
}
