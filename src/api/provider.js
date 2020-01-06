import {ObjectState} from '../const.js';
import Film from '../models/film.js';

export default class Provider {
  constructor(api, store) {
    this._api = api;
    this._store = store;
    this._isSynchronized = false;
  }

  getFilms() {
    if (this._isOnline()) {
      return this._api.getFilms().then((films) => {
        films.forEach((film) => {
          this._store.setItem(film.id, {
            state: ObjectState.INITIAL,
            data: film.toRAW()
          });
        });
        return Promise.resolve(films);
      });
    } else {
      const data = this._store.getData();
      const items = Object.values(data).map((item) => {
        return item.data;
      });
      return Promise.resolve(Film.parseFilms(items));
    }
  }

  // updateFilm(id, data) {
  //   return this._send({
  //     url: `movies/${id}`,
  //     method: Method.PUT,
  //     body: JSON.stringify(data.toRAW()),
  //     headers: new Headers({ 'Content-Type': `application/json` })
  //   })
  //     .then((response) => response.json())
  //     .then((json) => Film.parseFilm(json));
  // }

  // getComments(movieId) {
  //   return this._send({ url: `comments/${movieId}` })
  //     .then((response) => response.json())
  //     .then((json) => Comment.parseComments(json));
  // }

  // createComment(comment, movieId) {
  //   return this._send({
  //     url: `comments/${movieId}`,
  //     method: Method.POST,
  //     body: JSON.stringify(comment.toRAW()),
  //     headers: new Headers({ 'Content-Type': `application/json` })
  //   })
  //     .then((response) => response.json())
  //     .then((json) => Comment.parseComments(json.comments));
  // }

  // deleteComment(id) {
  //   return this._send({ url: `comments/${id}`, method: Method.DELETE });
  // }

  _isOnline() {
    return !navigator.onLine;
  }
}
