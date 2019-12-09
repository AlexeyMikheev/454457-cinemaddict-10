import Utils from '../utils.js';
import AbstractComponent from './abstract-component.js';

const getProfileTemplate = (totalWatched) => {
  const formatedRating = Utils.getFormatedRating(totalWatched);
  const profileRating = formatedRating !== null ? `<p class="profile__rating">${formatedRating}</p>` : ``;

  return `<section class="header__profile profile">${profileRating}<img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35"></section>`;
};

export default class Profile extends AbstractComponent {

  constructor(totalWatched) {
    super();
    this._totalWatched = totalWatched;
  }

  getTemplate() {
    return getProfileTemplate();
  }
}
