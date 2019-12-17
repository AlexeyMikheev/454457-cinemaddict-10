
import Utils from '../utils.js';
import AbstractComponent from './abstract-component.js';

const getCommentTemplate = (comment) => {

  const {id, emotion, text, author, commentDate} = comment;
  const formatedDifferenceDate = Utils.getFormatedDiffrenceDate(commentDate, new Date().valueOf());

  return `<li class="film-details__comment">
                <span class="film-details__comment-emoji">
                  <img src="./images/emoji/${emotion}.png" width="55" height="55" alt="emoji">
                </span>
                <div>
                  <p class="film-details__comment-text">${text}</p>
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
  }

  getTemplate() {
    return getCommentTemplate(this._comment);
  }

  addDeleteButtonClick(cb) {
    const deletebutton = this._element.querySelector(`.film-details__comment-delete`);
    deletebutton.addEventListener(`click`, cb);
  }
}
