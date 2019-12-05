import Utils from '../utils.js';

const getTemplate = (totalWatched) => {
  const formatedRating = Utils.getFormatedRating(totalWatched);
  const profileRating = formatedRating !== null ? `<p class="profile__rating">${formatedRating}</p>` : ``;

  return `<section class="header__profile profile">${profileRating}<img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35"></section>`;
};

export default class Profile {

  constructor(totalWatched) {
    this._totalWatched = totalWatched;
  }

  getElement() {
    if (!this._element) {
      this._element = Utils.createElement(getTemplate(this._totalWatched));
    }
    return this._element;
  }

  remove() {
    this._element = null;
  }
}
