import {getFormatedRating} from '../utils.js';

const createProfileTemplate = (totalWatchedFilms) => {
  const formatedRating = getFormatedRating(totalWatchedFilms);

  const profileRating = formatedRating !== null ? `<p class="profile__rating">${formatedRating}</p>` : ``;

  return `<section class="header__profile profile">${profileRating}<img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35"></section>`;
};

export {createProfileTemplate};
