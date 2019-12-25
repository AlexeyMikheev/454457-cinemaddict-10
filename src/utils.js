import {ProfileRating, Filters, ONE_TASKS_PAGE_COUNT, RenderPosition, MINUTE_IN_HOUR, MIN_DESCRIPTION_LENGTH, MAX_DESCRIPTION_LENGTH, DESCRIPTION_SPACE, MANY_COMMENTS_COUNT, ONE_DAY, SortTypes, DIFFERENCE_DATE_FORMAT, Emoji} from './const.js';
import moment from 'moment';
import 'moment-duration-format';

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

  static getEllipsisDescription(description) {
    return (description.length > MAX_DESCRIPTION_LENGTH) ? `${description.substring(MIN_DESCRIPTION_LENGTH, (MAX_DESCRIPTION_LENGTH - DESCRIPTION_SPACE))}...` : description;
  }

  static getFormatedRating(totalWatchedFilms) {
    let formatedProfileRating = ``;

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
    const differenceTimestamp = currentDate - date;
    if (differenceTimestamp < ONE_DAY) {
      return `Today`;
    }

    const differenceDays = differenceTimestamp % ONE_DAY;
    if (differenceDays > 3) {
      return this.formatTimeStamp(date, DIFFERENCE_DATE_FORMAT);
    }
    return (differenceDays > 1) ? `${differenceDays} days ago` : `${differenceDays} day ago`;

  }

  static getFormatedCommentsTitle(comments) {
    let formatedCommentsTitle = `comment`;

    if (comments.length > MANY_COMMENTS_COUNT) {
      formatedCommentsTitle += `s`;
    }

    return `${comments.length} ${formatedCommentsTitle}`;
  }

  static getFilmsByPageNumber(films, pageNumber, countTasks = ONE_TASKS_PAGE_COUNT) {
    const startIndex = pageNumber * countTasks;
    const endIndex = startIndex + countTasks;
    return films.slice(0, endIndex);
  }

  static getTopFilmsByProperty(films, propertyName, isSimpleProperty = true) {
    const [first = null, second = null] = this.getSortedFilmsByProperty(films, propertyName, isSimpleProperty);
    return [first, second];
  }

  static getFilterValue(filter, filmsCards) {
    switch (filter.title) {
      case Filters.ALL.title: return filmsCards.length;

      case Filters.WATCHLIST.title:
        return filmsCards.reduce((total, filmCard) => {
          if (filmCard.isWaitingWatched) {
            total++;
          }
          return total;
        }, 0);

      case Filters.HISTORY.title:
        return filmsCards.reduce((total, filmCard) => {
          if (filmCard.isWatched) {
            total++;
          }
          return total;
        }, 0);

      case Filters.FAVORITES.title:
        return filmsCards.reduce((total, filmCard) => {
          if (filmCard.isFavorite) {
            total++;
          }
          return total;
        }, 0);

      default: return filter.count;
    }
  }

  static getSortedFilms(sortType, films) {
    switch (sortType) {
      case SortTypes.DEFAULT:
        return films;
      case SortTypes.DATE:
        return Utils.getSortedFilmsByProperty(films, `releaseDate`);
      case SortTypes.RATING:
        return Utils.getSortedFilmsByProperty(films, `rating`);
      default: return films;
    }
  }

  static getFiltredFilms(filterType, films) {
    return films.filter((film) => {
      return this.isFilmAvaliableAtFilter(filterType, film);
    });
  }

  static isFilmAvaliableAtFilter(filterType, film) {
    switch (filterType) {
      case Filters.ALL.title:
        return true;
      case Filters.WATCHLIST.title:
        return film.isWaitingWatched;
      case Filters.HISTORY.title:
        return film.isWatched;
      case Filters.FAVORITES.title:
        return film.isFavorite;
      default: return false;
    }
  }

  static getFormatedValue(value) {
    return value < 10 ? `0${value}` : value.toString();
  }

  static getDateValues(date) {
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    const hours = this.getFormatedValue(date.getHours());
    const minutes = this.getFormatedValue(date.getMinutes());

    return {year, month, day, hours, minutes};
  }

  static getFormatedCommentDate(date) {
    const {year, month, day, hours, minutes} = this.getDateValues(date);

    return `${year}/${month}/${day} ${hours}:${minutes}`;
  }

  static formatTimeStamp(date, format) {
    return moment(date).format(format);
  }

  static formatDurationTimeStamp(date, format) {
    return moment.duration(date, `milliseconds`).format(format);
  }

  static getHours(timestamp) {
    return moment.duration(timestamp, `milliseconds`).hours();
  }

  static getMinutes(timestamp) {
    const minutes = moment.duration(timestamp, `milliseconds`).minutes();
    if (minutes > MINUTE_IN_HOUR) {
      const hours = this.getHours(timestamp);
      return minutes - (hours * MINUTE_IN_HOUR);
    }
    return minutes;
  }

  static getDifferentDates(startDate, endDate, unit) {
    return moment(startDate).diff(moment(endDate), unit);
  }

  static isDateInRange(date, startDate, entDate) {
    return moment(date).isBetween(startDate, entDate, null, `[]`);
  }

  static changeDate(date, unit, count) {
    return moment(date).add(count, unit).valueOf();
  }

  static getSortedFilmsByProperty(films, propertyName, isSimpleProperty = true) {
    return films.slice().sort((prevFilm, nextFilm) => {
      const prevValue = isSimpleProperty ? prevFilm[propertyName] : prevFilm[propertyName].length;
      const nextValue = isSimpleProperty ? nextFilm[propertyName] : nextFilm[propertyName].length;

      if (prevValue > nextValue) {
        return -1;
      }
      if (prevValue < nextValue) {
        return 1;
      }
      return 0;
    });
  }

  static getFilmByid(films, id) {
    return films.find((film) => {
      return film.id === id;
    });
  }

  static getDefaultSelectedFilter() {
    return Filters.ALL;
  }

  static getFilters() {
    return [Filters.ALL, Filters.WATCHLIST, Filters.HISTORY, Filters.FAVORITES, Filters.STATS];
  }

  static getEmoji(emoji) {
    switch (emoji) {
      case Emoji.SLEEPING.value:
        return Emoji.SLEEPING;
      case Emoji.GRINNING.value:
        return Emoji.GRINNING;
      case Emoji.ANGRY.value:
        return Emoji.ANGRY;
      default: return null;
    }
  }

  static paserDate(data) {
    return new Date(data).valueOf();
  }
}
