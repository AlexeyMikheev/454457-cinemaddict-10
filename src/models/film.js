import Utils from '../utils.js';

export default class Film {
  constructor(data) {
    this.id = data[`id`];

    if (data[`film_info`]) {
      const filmInfo = Film.parseFilmInfo(data[`film_info`]);
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
    }

    this.comments = data[`comments`] || [];

    if (data[`user_details`]) {
      const userDetail = Film.parseUserDetail(data[`user_details`]);
      this.isFavorite = userDetail.isFavorite;
      this.isWaitingWatched = userDetail.isWaitingWatched;
      this.watchedDate = userDetail.watchedDate;
      this.isWatched = userDetail.isWatched;
      this.personalRating = userDetail.personalRating;
    }
  }

  toRAW() {
    return {
      'id': this.id,
      'comments': this.comments.map((comment) => {
        return comment.id ? comment.id : comment;
      }),
      'film_info': Film.toRawFilmInfo(this),
      'user_details': Film.toRawUserDetail(this)
    };
  }

  toStoreRAW() {
    return {
      'id': this.id,
      'comments': this.comments,
      'film_info': Film.toRawFilmInfo(this),
      'user_details': Film.toRawUserDetail(this)
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

  static toRawFilmInfo(data) {
    return {
      'title': data.title,
      'alternative_title': data.originalTitle,
      'total_rating': data.rating,
      'runtime': data.duration % 60 % 1000,
      'director': data.producer,
      'actors': data.actors,
      'age_rating': data.age,
      'writers': data.writers,
      'release': {
        'date': data.releaseDate ? new Date(data.releaseDate).toISOString() : new Date(0).toISOString(),
        'release_country': data.country,
      },
      'genre': data.genres,
      'poster': data.poster,
      'description': data.description,
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

  static toRawUserDetail(data) {
    return {
      'favorite': data.isFavorite,
      'personal_rating': data.personalRating,
      'watchlist': data.isWaitingWatched,
      'watching_date': data.watchedDate ? new Date(data.watchedDate).toISOString() : new Date(0).toISOString(),
      'already_watched': data.isWatched
    };
  }

  // static toRawComments(data) {
  //   return data.comments !== null ? data.comments.map((comment) => {
  //     return comment.id ? comment.id : comment;
  //   }) : [];
  // }

  static clone(data) {
    return new Film(data.toRAW());
  }
}
