import {ProfileRating, Filters, ONE_TASKS_PAGE_COUNT, RenderPosition, MINUTE_IN_HOUR, SECONDS_IN_MINUTE, DescriptionLength, DESCRIPTION_SPACE, MANY_COMMENTS_COUNT, SortTypes, Emoji} from './const.js';
import moment from 'moment';
import 'moment-duration-format';
import numberToWords from 'number-to-words';

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

  static insertHtml(container, template) {
    container.insertAdjacentHTML(`afterBegin`, template);
  }

  static getEllipsisDescription(description) {
    return (description.length > DescriptionLength.MAX) ? `${description.substring(DescriptionLength.MIN, (DescriptionLength.MAX - DESCRIPTION_SPACE))}...` : description;
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

  static numberToWords(valueNumber) {
    return numberToWords.toWords(valueNumber);
  }

  static getFormatedDiffrenceDate(date, currentDate) {
    const differenceTimestamp = currentDate - date;

    const daysCount = this.getDays(differenceTimestamp);
    const hoursCount = this.getHours(differenceTimestamp);
    const minutesCount = this.getMinutes(differenceTimestamp);
    const secondCount = this.getSeconds(differenceTimestamp);

    let formatedDate = ``;

    if (daysCount > 1) {
      const daysCountText = this.numberToWords(daysCount);
      formatedDate = `a ${daysCountText.toLowerCase()} days ago`;
    } else if (daysCount === 1) {
      formatedDate = `a day ago`;
    } else if (hoursCount >= 2 && hoursCount <= 23 && minutesCount >= 0 && minutesCount <= 59) {
      formatedDate = `a few hours ago`;
    } else if (hoursCount === 1 && minutesCount >= 0 && minutesCount <= 59) {
      formatedDate = `a hour ago`;
    } else if (minutesCount >= 4 && minutesCount <= 59) {
      formatedDate = ` a few minutes ago`;
    } else if (minutesCount >= 1 && minutesCount <= 3) {
      formatedDate = `a minute ago`;
    } else if (secondCount >= 0 && secondCount <= 59) {
      formatedDate = `now`;
    }
    return formatedDate;
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

  static formatTimeStamp(date, format) {
    return moment(date).format(format);
  }

  static formatDurationTimeStamp(date, format) {
    return moment.duration(date, `milliseconds`).format(format);
  }

  static getDays(timestamp) {
    return moment.duration(timestamp, `milliseconds`).days();
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

  static getSeconds(timestamp) {
    const seconds = moment.duration(timestamp, `milliseconds`).seconds();
    if (seconds > SECONDS_IN_MINUTE) {
      const minutes = this.getMinutes(timestamp);
      return seconds - (minutes * SECONDS_IN_MINUTE);
    }
    return seconds;
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

  static getDefaultSelectedFilter() {
    return Filters.ALL;
  }

  static getFilters() {
    return [Filters.ALL, Filters.WATCHLIST, Filters.HISTORY, Filters.FAVORITES, Filters.STATS];
  }

  static getEmoji(emoji) {
    switch (emoji) {
      case Emoji.SMILE.value:
        return Emoji.SMILE;
      case Emoji.SLEEPING.value:
        return Emoji.SLEEPING;
      case Emoji.PUKE.value:
        return Emoji.PUKE;
      case Emoji.ANGRY.value:
        return Emoji.ANGRY;
      default: return null;
    }
  }

  static paserDate(data) {
    return new Date(data).valueOf();
  }
}
