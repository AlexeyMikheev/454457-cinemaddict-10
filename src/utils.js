import {ProfileRating} from './const.js';

const MINUTE_IN_HOUR = 60;

const MIN_DESCRIPTION_LENGTH = 0;
const MAX_DESCRIPTION_LENGTH = 140;
const DESCRIPTION_SPACE = 1;

const MANY_COMMENTS_COUNT = 1;

const getHours = (duration) => {
  return Math.floor(duration / MINUTE_IN_HOUR);
};

const getMinutes = (duration) => {
  return Math.floor(duration % MINUTE_IN_HOUR);
};

const getFormatedDuration = (duration) => {
  let formatedDuration = ``;

  if (duration < MINUTE_IN_HOUR) {
    formatedDuration += `${duration}m`;
  } else if (duration === MINUTE_IN_HOUR) {
    formatedDuration += `${getHours(duration)}h`;
  } else {
    formatedDuration += `${getHours(duration)}h ${getMinutes(duration)}m`;
  }

  return formatedDuration;
};

const getEllipsisDescription = (description) =>{
  return (description.length > MAX_DESCRIPTION_LENGTH) ? `${description.substring(MIN_DESCRIPTION_LENGTH, (MAX_DESCRIPTION_LENGTH - DESCRIPTION_SPACE))}...` : description;
};

const getFormatedComments = (comments) =>{
  return comments.length > MANY_COMMENTS_COUNT ? `${comments.length} comments` : `${comments.length} comment`;
};

const getFormatedRating = (totalWatchedFilms) =>{
  let formatedProfileRating = null;

  if (ProfileRating.NOVICE.min <= totalWatchedFilms && totalWatchedFilms <= ProfileRating.NOVICE.max) {
    formatedProfileRating = ProfileRating.NOVICE.name;
  } else if (ProfileRating.FAN.min <= totalWatchedFilms && totalWatchedFilms <= ProfileRating.FAN.max) {
    formatedProfileRating = ProfileRating.FAN.name;
  } else if (ProfileRating.MOVIE_BUFF.min <= totalWatchedFilms) {
    formatedProfileRating = ProfileRating.MOVIE_BUFF.name;
  }

  return formatedProfileRating;
};

export {getFormatedDuration, getEllipsisDescription, getFormatedComments, getFormatedRating};
