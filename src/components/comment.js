
import Utils from '../utils.js';
import AbstractComponent from './abstract-component.js';
import he from 'he';

const MAX_TEXT_LENGTH = 140;

const getCommentTemplate = (comment) => {
  const {id, emotion, author, commentDate} = comment;
  const formatedDifferenceDate = Utils.getFormatedDiffrenceDate(commentDate, new Date().valueOf());
  const emoji = Utils.getEmoji(emotion);
  const emojiImg = emoji !== null ? emoji.img : null;

  let {text} = comment;

  if (text.length > MAX_TEXT_LENGTH) {
    text = `${text.substring(0, MAX_TEXT_LENGTH - 1)}...`;
  }

  const displayText = he.encode(text);

  return `<li class="film-details__comment">
                <span class="film-details__comment-emoji">
                  ${ emojiImg !== null ? `<img src="./images/emoji/${emojiImg}.png" width="55" height="55" alt="emoji">` : ``}
                </span>
                <div>
                  <p class="film-details__comment-text">${displayText}</p>
                  <p class="film-details__comment-info">
                    <span class="film-details__comment-author">${author}</span>
                    <span class="film-details__comment-day">${formatedDifferenceDate}</span>
                    <button class="film-details__comment-delete" data-id="${id}">Delete</button>
                  </p>
                </div>
            </li>`;
};

export default class Comment extends AbstractComponent {

  constructor(comment) {
    super();
    this._comment = comment;
    this._deletebutton = null;
  }

  set deleteButtonText(value) {
    if (this._deletebutton !== null) {
      this._deletebutton.innerText = value;
    }
  }

  getTemplate() {
    return getCommentTemplate(this._comment);
  }

  addDeleteButtonClick(cb) {
    this._onDeleteButtonClickCb = (evt) => {
      cb(evt, this);
    };

    this._deletebutton = this._element.querySelector(`.film-details__comment-delete`);
    this._deletebutton.addEventListener(`click`, this._onDeleteButtonClickCb);
  }

  removeEvents() {
    if (this._deletebutton !== null) {
      this._deletebutton.removeEventListener(`click`, this._onDeleteButtonClickCb);
      this._deletebutton = null;
    }
  }
}
