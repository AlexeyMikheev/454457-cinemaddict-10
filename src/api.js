import Film from './models/film.js';
import Comment from './models/comment.js';

const Method = {
  GET: `GET`,
  POST: `POST`,
  PUT: `PUT`,
  DELETE: `DELETE`
};

const checkStatus = (response) => {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    throw new Error(`${response.status}: ${response.statusText}`);
  }
};

const API = class {
  constructor(endPoint, authorization) {
    this._endPoint = endPoint;
    this._authorization = authorization;
  }

  getFilms() {
    return this._send({url: `movies`})
      .then((response) => response.json())
      .then((json) => Film.parseFilms(json));
  }

  updateFilm(id, data) {
    return this._send({
      url: `movies/${id}`,
      method: Method.PUT,
      body: JSON.stringify(data.toRAW()),
      headers: new Headers({'Content-Type': `application/json`})
    })
      .then((response) => response.json())
      .then((json) => Film.parseFilm(json));
  }

  getComments(movieId) {
    return this._send({url: `comments/${movieId}`})
    .then((response) => response.json())
    .then((json) => Comment.parseComments(json));
  }

  createComment(comment, movieId) {
    return this._send({
      url: `comments/${movieId}`,
      method: Method.POST,
      body: JSON.stringify(comment.toRAW()),
      headers: new Headers({'Content-Type': `application/json`})
    })
      .then((response) => response.json())
      .then((json) => Comment.parseComments(json.comments));
  }

  deleteComment(id) {
    return this._send({url: `comments/${id}`, method: Method.DELETE});
  }

  _send({url, method = Method.GET, body = null, headers = new Headers()}) {
    headers.append(`Authorization`, this._authorization);

    return fetch(`${this._endPoint}/${url}`, {method, body, headers})
      .then(checkStatus)
      .catch((err) => {
        throw err;
      });
  }
};

export default API;
