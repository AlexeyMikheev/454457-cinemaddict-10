import {ObjectState} from '../const.js';
import Film from '../models/film.js';
import Comment from '../models/comment.js';

export default class Provider {
  constructor(api, store) {
    this._api = api;
    this._store = store;
    this._isSynchronized = true;
  }

  get isSynchronized() {
    return this._isSynchronized;
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
      this._isSynchronized = false;
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
        this._isSynchronized = false;
        return Promise.resolve(Comment.parseComments(storeFilm.comments));
      }
      return Promise.resolve([]);
    }
  }

  deleteComment(commentId) {
    if (this._isOnline()) {
      return this._api.deleteComment(commentId).then(() => {
        this._deleteStoreComment(commentId);
        this._isSynchronized = false;
        return Promise.resolve();
      });
    } else {
      this._deleteStoreComment(commentId);
      this._isSynchronized = false;
      return Promise.resolve();
    }
  }

  sync() {
    const data = this._store.getData();
    const items = Object.values(data).filter((dataItem) => {
      return dataItem.state === ObjectState.UPDATED;
    }).map((item) => {
      return item.data;
    });
    return this._api.sync(items).then((result) => {
      this._isSynchronized = true;

      if (result && result.updated) {
        const updatedFilms = Film.parseFilms(result.updated);
        return Promise.resolve(updatedFilms);
      }
      return Promise.resolve([]);
    });
  }

  _deleteStoreComment(commentId) {
    const storeFilm = this._store.getDataByCommentId(commentId);
    if (storeFilm) {
      const index = storeFilm.comments.findIndex((it) => it.id === commentId);
      storeFilm.comments = [].concat(storeFilm.comments.slice(0, index), storeFilm.comments.slice(index + 1));
      this._setStoreItem(storeFilm.id, storeFilm);
    }
  }

  _setStoreItem(key, data, state = ObjectState.INITIAL) {
    this._store.setItem(key, {
      state,
      data: data.toRAW()
    });
  }

  _isOnline() {
    return navigator.onLine;
  }
}
