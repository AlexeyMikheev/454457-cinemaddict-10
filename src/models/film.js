import Utils from '../utils.js';

export default class Film {
  constructor(data) {
    const filmInfo = Film.parseFilmInfo(data[`film_info`]);
    const userDetail = Film.parseUserDetail(data[`user_details`]);

    this.id = data[`id`];

    this.title = filmInfo.title;
    this.originalTitle = filmInfo.originalTitle;
    this.rating = filmInfo.rating;
    this.producer = filmInfo.producer;
    this.writers = filmInfo.writers;
    this.actors = filmInfo.writers;
    this.releaseDate = filmInfo.releaseDate;
    this.duration = filmInfo.duration;
    this.country = filmInfo.country;
    this.genres = filmInfo.genres;
    this.poster = filmInfo.poster;
    this.description = filmInfo.description;
    this.age = filmInfo.age;

    this.comments = data[`comments`] || [];

    this.isFavorite = userDetail.isFavorite;
    this.isWaitingWatched = userDetail.isWaitingWatched;
    this.watchedDate = userDetail.watchedDate;
    this.isWatched = userDetail.isWatched;
    this.personalRating = userDetail.personalRating;
  }

  toRAW() {
    return {
      'id': this.id,
      'description': this.description,
      'due_date': this.dueDate ? this.dueDate.toISOString() : null,
      'tags': Array.from(this.tags),
      'repeating_days': this.repeatingDays,
      'color': this.color,
      'is_favorite': this.isFavorite,
      'is_archived': this.isArchive,
    };
  }

  static parseFilm(data) {
    return new Film(data);
  }

  static parseFilms(data) {
    return data.map(Film.parseFilm);
  }

  static parseFilmInfo(data) {
    return {
      title: data[`title`] || [],
      originalTitle: data[`alternative_title`] || ``,
      rating: parseInt(data[`total_rating`], 10) || 0,
      duration: parseInt(data[`runtime`], 10) * 60 * 1000 || 0,
      producer: data[`director`] || ``,
      actors: data[`actors`] || [],
      age: data[`age_rating`] || 0,
      writers: data[`writers`] || [],
      releaseDate: Utils.paserDate(data[`release`][`date`]) || null,
      country: data[`release`][`release_country`] || ``,
      genres: data[`genre`] || [],
      poster: data[`poster`] || ``,
      description: data[`description`] || ``,

    };
  }

  static parseUserDetail(data) {
    return {
      isFavorite: Boolean(data[`favorite`]),
      personalRating: parseInt(data[`personal_rating`], 10) || 0,
      isWaitingWatched: Boolean(data[`watchlist`]),
      watchedDate: Utils.paserDate(data[`watching_date`]) || null,
      isWatched: Boolean(data[`already_watched`])

    };
  }

  static clone(data) {
    return new Film(data.toRAW());
  }
}
