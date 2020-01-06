import {ObjectState} from '../const.js';
import Film from '../models/film.js';
import Comment from '../models/comment.js';

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


  updateFilm(id, data) {
    if (this._isOnline()) {
      return this._api.updateFilm(id, data);
    } else {
      this._setStoreItem(id, data, ObjectState.UPDATED);
      return Promise.resolve(data);
    }
  }

  getComments(movieId) {
    if (this._isOnline()) {
      return this._api.getComments(movieId).then((comments) => {
        const storeFilm = this._store.getDataById(movieId);
        if (storeFilm) {
          storeFilm.comments = comments;
          this._setStoreItem(storeFilm.id, storeFilm);
        }
        return Promise.resolve(comments);
      });
    } else {
      const storeFilm = this._store.getDataById(movieId);
      if (storeFilm) {
        return Promise.resolve(Comment.parseComments(storeFilm.comments));
      }
      return Promise.resolve([]);
    }
  }

  createComment(comment, movieId) {
    if (this._isOnline()) {
      return this._api.createComment(comment, movieId).then((comments) => {
        const storeFilm = this._store.getDataById(movieId);
        if (storeFilm) {
          storeFilm.comments = comments;
          this._setStoreItem(storeFilm.id, storeFilm);
        }
        return Promise.resolve(comments);
      });
    } else {
      const storeFilm = this._store.getDataById(movieId);
      if (storeFilm) {
        storeFilm.comments.push(comment.toRAW());
        this._setStoreItem(storeFilm.id, storeFilm);
        return Promise.resolve(Comment.parseComments(storeFilm.comments));
      }
      return Promise.resolve([]);
    }
  }

  // deleteComment(id) {
  //   return this._send({ url: `comments/${id}`, method: Method.DELETE });
  // }

  _setStoreItem(key, data, state = ObjectState.INITIAL) {
    this._store.setItem(key, {
      state,
      data: data.toRAW()
    });
  }

  _isOnline() {
    return !navigator.onLine;
  }
}
