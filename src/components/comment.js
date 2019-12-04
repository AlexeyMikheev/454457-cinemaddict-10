
import Utils from '../utils.js';

const createCommentTemplate = (comment) => {

  const currentDate = new Date();
  const {emotion, text, author, commentDate} = comment;
  const formatedDifferenceDate = Utils.getFormatedDiffrenceDate(commentDate, currentDate);

  return `<li class="film-details__comment">
                <span class="film-details__comment-emoji">
                  <img src="./images/emoji/${emotion}.png" width="55" height="55" alt="emoji">
                </span>
                <div>
                  <p class="film-details__comment-text">${text}</p>
                  <p class="film-details__comment-info">
                    <span class="film-details__comment-author">${author}</span>
                    <span class="film-details__comment-day">${formatedDifferenceDate}</span>
                    <button class="film-details__comment-delete">Delete</button>
                  </p>
                </div>
            </li>`;
};

export default class Comment {

  constructor(comment) {
    this._comment = comment;
    this.init();
  }

  init() {
    if (!this._element) {
      this._element = Utils.createElement(this.getTemplate());
    }
  }

  getTemplate() {
    return createCommentTemplate(this._comment);
  }

  get Element() {
    return this._element;
  }

  remove() {
    this._element = null;
  }
}
