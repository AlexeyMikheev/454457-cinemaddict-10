import Utils from '../utils.js';

const createProfileTemplate = (totalWatched) => {
  const formatedRating = Utils.getFormatedRating(totalWatched);
  const profileRating = formatedRating !== null ? `<p class="profile__rating">${formatedRating}</p>` : ``;

  return `<section class="header__profile profile">${profileRating}<img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35"></section>`;
};

export {createProfileTemplate};


export default class Profile {

  constructor(totalWatched) {
    this._totalWatched = totalWatched;
    this.init();
  }

  init() {
    if (!this._element) {
      this._element = Utils.createElement(this.getTemplate());
    }
  }

  getTemplate() {
    return createProfileTemplate(this._totalWatched);
  }

  get Element() {
    return this._element;
  }

  render(container) {
    Utils.render(container, this._element);
  }

  remove() {
    this._element = null;
  }
}
