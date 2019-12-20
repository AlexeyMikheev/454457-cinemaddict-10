
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

  constructor(comments, onCommentsChanged) {
    super();
    this._comments = comments;
    this._onCommentsChanged = onCommentsChanged;
    this._onDeleteCb = (evt) => {
      evt.preventDefault();

      const commentId = parseInt(evt.target.dataset[`id`], 10);
      const deletedIndex = this._comments.findIndex((comment) => {
        return comment.id === commentId;
      });

      if (deletedIndex !== -1) {
        const changedComments = [].concat(this._comments.slice(0, deletedIndex), this._comments.slice(deletedIndex + 1));
        this._onCommentsChanged(changedComments);
      }
    };
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

  removeTitleElement() {
    this._titleElement.remove();
    this._titleElement = null;
  }

  initComments() {
    this._commentsComponents = this._comments.map((c) => {
      return new Comment(c);
    });

    this._commentsComponents.forEach((comment) => {
      this._element.appendChild(comment.getElement());
      comment.addDeleteButtonClick(this._onDeleteCb);
    });
  }

  removeComments() {
    if (this._commentsComponents !== null) {
      this._commentsComponents.forEach((comment) => {
        comment.removeEvents();
        comment.removeElement();
      });
      this._commentsComponents = null;
    }

    if (this._titleElement !== null) {
      this._titleElement.remove();
    }
  }
}
