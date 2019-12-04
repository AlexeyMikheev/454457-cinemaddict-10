
import {Utils} from '../utils.js';
import Comment from './comment.js';

export default class Comments {

  constructor(comments) {
    this._comments = comments;
    this.init();
  }

  init() {
    this._commentsComponents = this._comments.map((c) => {
      return new Comment(c);
    });

    this.initTitleElement();
    this.initElement();
  }

  get Element() {
    return this._element;
  }

  getTitleTemplate() {
    return `<h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${this._comments.length}</span></h3>`;
  }

  initTitleElement() {
    if (!this._titleElement) {
      this._titleElement = Utils.createElement(this.getTitleTemplate());
    }

    return this._element;
  }

  getTemplate() {
    return `<ul class="film-details__comments-list"></ul>`;
  }

  initElement() {
    if (!this._element) {
      this._element = Utils.createElement(this.getTemplate());
    }

    this._commentsComponents.forEach((comment) => {
      this._element.appendChild(comment.Element);
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
