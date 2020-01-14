
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

  constructor(comments, onCommentsChanged, isReadOnly) {
    super();
    this._comments = comments;
    this._onCommentsChanged = onCommentsChanged;
    this._deletingCommentComponent = null;
    this._enabled = true;
    this._isReadOnly = isReadOnly;
    this._onDeleteCb = (evt, commentComponent) => {
      evt.preventDefault();
      if (!this._enabled) {
        return;
      }

      this._enabled = false;

      const commentId = evt.target.dataset[`id`];
      const deletedComment = this._comments.find((comment) => {
        return comment.id === commentId;
      });

      if (deletedComment !== null) {
        this._deletingCommentComponent = commentComponent;
        this._onCommentsChanged(deletedComment, null);
      }
    };
  }

  getTemplate() {
    return getCommentsTemplate(this._comment);
  }

  set deleteButtonText(value) {
    if (this._deletingCommentComponent !== null) {
      this._deletingCommentComponent.deleteButtonText = value;
    }
  }

  set enabled(value) {
    this._enabled = value;
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
      return new Comment(c, this._isReadOnly);
    });

    this._commentsComponents.forEach((comment) => {
      this._element.appendChild(comment.getElement());
      if (!this._isReadOnly) {
        comment.addDeleteButtonClick(this._onDeleteCb);
      }
    });
  }

  removeComments() {
    if (this._commentsComponents !== null) {
      this._commentsComponents.forEach((comment) => {
        if (!this._isReadOnly) {
          comment.removeEvents();
        }
        comment.removeElement();
      });
      this._commentsComponents = null;
    }

    if (this._titleElement !== null) {
      this._titleElement.remove();
    }
  }
}
