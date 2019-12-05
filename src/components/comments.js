
import Utils from '../utils.js';
import Comment from './comment.js';

const getTitleTemplate = (commentsLength) => {
  return `<h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${commentsLength}</span></h3>`;
};

const getTemplate = () => {
  return `<ul class="film-details__comments-list"></ul>`;
};

export default class Comments {

  constructor(comments) {
    this._comments = comments;
  }

  getElement() {
    if (!this._element) {
      this._element = Utils.createElement(getTemplate());
    }
    return this._element;
  }

  getTitleElement() {
    if (!this._titleElement) {
      this._titleElement = Utils.createElement(getTitleTemplate(this._comments.length));
    }

    return this._element;
  }

  initComments() {
    this._commentsComponents = this._comments.map((c) => {
      return new Comment(c);
    });

    this._commentsComponents.forEach((comment) => {
      this._element.appendChild(comment.getElement());
    });
  }

  remove() {
    this._element = this._titleElement = null;

    this._commentsComponent.forEach((comment) => {
      comment.remove();
    });

    this._commentsComponents = null;
  }
}
