
import Utils from '../utils.js';
import Comment from './comment.js';
import AbstractComponent from './abstract-component.js';

const getTitleTemplate = (commentsLength) => {
  return `<h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${commentsLength}</span></h3>`;
};

const getCommentsTemplate = () => {
  return `<ul class="film-details__comments-list"></ul>`;
};

export default class Comments extends AbstractComponent {

  constructor(comments) {
    super();
    this._comments = comments;
  }

  getTemplate() {
    return getCommentsTemplate(this._comment);
  }

  getTitleElement() {
    if (!this._titleElement) {
      this._titleElement = Utils.createElement(getTitleTemplate(this._comments.length));
    }
    return this._titleElement;
  }

  initComments() {
    this._commentsComponents = this._comments.map((c) => {
      return new Comment(c);
    });

    this._commentsComponents.forEach((comment) => {
      this._element.appendChild(comment.getElement());
    });
  }

  removeTitleElement() {
    this._titleElement.remove();
    this._titleElement = null;
  }

  removeComments() {
    this._commentsComponent.forEach((comment) => {
      comment.remove();
    });
    this._commentsComponents = null;
  }
}
