import { ProfileRating, MONTHS, Filters, ONE_TASKS_PAGE_COUNT, RenderPosition, MINUTE_IN_HOUR, MIN_DESCRIPTION_LENGTH, MAX_DESCRIPTION_LENGTH, DESCRIPTION_SPACE, MANY_COMMENTS_COUNT, ONE_DAY } from './const.js';

const getHours = (duration) => {
  return Math.floor(duration / MINUTE_IN_HOUR);
};

const getMinutes = (duration) => {
  return Math.floor(duration % MINUTE_IN_HOUR);
};

const getFormatedValue = (value) => {
  return value < 10 ? `0${value}` : value.toString();
};

const getDateValues = (date) => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();
  const hours = getFormatedValue(date.getHours());
  const minutes = getFormatedValue(date.getMinutes());

  return { year, month, day, hours, minutes };
};

const getFormatedCommentDate = (date) => {
  const { year, month, day, hours, minutes } = getDateValues(date);

  return `${year}/${month}/${day} ${hours}:${minutes}`;
};

const getSortedByDescFilms = (films, propertyName) => {
  return films.slice().sort((prevFilm, nextFilm) => {
    if (prevFilm[propertyName] > nextFilm[propertyName]) {
      return -1;
    }
    if (prevFilm[propertyName] < nextFilm[propertyName]) {
      return 1;
    }
    return 0;
  });
};

export default class Utils {

  static createElement(template) {
    const newElement = document.createElement(`div`);
    newElement.innerHTML = template;
    return newElement.firstChild;
  }

  static render(container, element, place = RenderPosition.BEFOREEND) {
    switch (place) {
      case RenderPosition.AFTERBEGIN:
        container.prepend(element);
        break;
      case RenderPosition.BEFOREEND:
        container.append(element);
        break;
    }
  }

  static getFormatedReleaseDate(date) {

    const { year, month, day } = getDateValues(date);

    return `${year} ${MONTHS[month]} ${day}`;
  }

  static getEllipsisDescription(description) {
    return (description.length > MAX_DESCRIPTION_LENGTH) ? `${description.substring(MIN_DESCRIPTION_LENGTH, (MAX_DESCRIPTION_LENGTH - DESCRIPTION_SPACE))}...` : description;
  }

  static getFormatedDuration(duration) {
    let formatedDuration = ``;

    if (duration < MINUTE_IN_HOUR) {
      formatedDuration += `${duration}m`;
    } else if (duration === MINUTE_IN_HOUR) {
      formatedDuration += `${getHours(duration)}h`;
    } else {
      formatedDuration += `${getHours(duration)}h ${getMinutes(duration)}m`;
    }

    return formatedDuration;
  }

  static getFormatedRating(totalWatchedFilms) {
    let formatedProfileRating = null;

    if (ProfileRating.NOVICE.min <= totalWatchedFilms && totalWatchedFilms <= ProfileRating.NOVICE.max) {
      formatedProfileRating = ProfileRating.NOVICE.name;
    } else if (ProfileRating.FAN.min <= totalWatchedFilms && totalWatchedFilms <= ProfileRating.FAN.max) {
      formatedProfileRating = ProfileRating.FAN.name;
    } else if (ProfileRating.MOVIE_BUFF.min <= totalWatchedFilms) {
      formatedProfileRating = ProfileRating.MOVIE_BUFF.name;
    }

    return formatedProfileRating;
  }

  static getFormatedDiffrenceDate(date, currentDate) {
    const differenceTimestamp = currentDate.valueOf() - date.valueOf();
    if (differenceTimestamp < ONE_DAY) {
      return `Today`;
    }

    const differenceDays = differenceTimestamp % ONE_DAY;
    if (differenceDays > 3) {
      return getFormatedCommentDate(date);
    }
    return (differenceDays > 1) ? `${differenceDays} days ago` : `${differenceDays} day ago`;

  }

  static getFormatedCommentsTitle(comments) {
    let formatedCommentsTitle = `comment`;

    if (comments.length > MANY_COMMENTS_COUNT) {
      formatedCommentsTitle += `s`;
    }

    return formatedCommentsTitle;
  }

  static getFilmsByPageNumber(films, pageNumber, countTasks = ONE_TASKS_PAGE_COUNT) {
    const startIndex = pageNumber * countTasks;
    const endIndex = startIndex + countTasks;
    return films.slice(startIndex, endIndex);
  };

  static getTopFilmsByProperty(films, propertyName) {
    const [first = null, second = null] = getSortedByDescFilms(films, propertyName);
    return [first, second];
  };

  static getFilterValue(filter, filmsCards) {
    switch (filter.title) {
      case Filters.ALL.title: return filmsCards.length;

      case Filters.WATCHLIST.title:
        return filmsCards.reduce((total, filmCard) => {
          if (filmCard.isWaitingWatched) {
            total++;
          }
          return total;
        }, filter.count);

      case Filters.HISTORY.title:
        return filmsCards.reduce((total, filmCard) => {
          if (filmCard.isWatched) {
            total++;
          }
          return total;
        }, filter.count);

      case Filters.FAVORITES.title:
        return filmsCards.reduce((total, filmCard) => {
          if (filmCard.isFavorite) {
            total++;
          }
          return total;
        }, filter.count);

      default: return filter.count;
    }
  }
}
