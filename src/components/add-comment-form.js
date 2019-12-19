import AbstractComponent from './abstract-component.js';
import {Emoji, ENTER_KEY} from '../const.js';
import Utils from '../utils.js';

const getAddNewCommentTemplate = () => {
  return `<div class="film-details__new-comment">
      <div for="add-emoji" class="film-details__add-emoji-label"></div>

      <label class="film-details__comment-label">
        <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
      </label>

      <div class="film-details__emoji-list">
        <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="${Emoji.SMILE.value}">
        <label class="film-details__emoji-label" for="emoji-smile">
          <img src="./images/emoji/${Emoji.SMILE.img}.png" width="30" height="30" alt="emoji">
        </label>

        <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="${Emoji.NEUTRAL.value}">
        <label class="film-details__emoji-label" for="emoji-sleeping">
          <img src="./images/emoji/${Emoji.NEUTRAL.img}.png" width="30" height="30" alt="emoji">
        </label>

        <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-gpuke" value="${Emoji.GRINNING.value}">
        <label class="film-details__emoji-label" for="emoji-gpuke">
          <img src="./images/emoji/${Emoji.GRINNING.img}.png" width="30" height="30" alt="emoji">
        </label>

        <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="${Emoji.ANGRY.value}">
        <label class="film-details__emoji-label" for="emoji-angry">
          <img src="./images/emoji/${Emoji.ANGRY.img}.png" width="30" height="30" alt="emoji">
        </label>
      </div>
    </div>`;
};

const getEmojiTemplate = (emoji) => {
  return `<img src="images/emoji/${emoji.img}.png" width="55" height="55" alt="emoji">`;
};

export default class AddNewCommentForm extends AbstractComponent {
  constructor(comments, onCommentsChanged) {
    super();
    this._comments = comments;
    this._onCommentsChanged = onCommentsChanged;
    this._selectedEmojiElement = null;
    this._selectedEmoji = null;
  }

  getTemplate() {
    return getAddNewCommentTemplate();
  }

  initEvents() {
    const emojiList = this._element.querySelector(`.film-details__emoji-list`);
    emojiList.addEventListener(`change`, (evt) => {
      this._selectedEmoji = Utils.getEmoji(evt.target.value);
      if (this._selectedEmoji !== null) {
        this._refreshSelectedEmoji();
      }
    });

    const commentInput = this._element.querySelector(`.film-details__comment-input`);
    commentInput.addEventListener(`keydown`, (evt) => {

      if (evt.ctrlKey && evt.keyCode === ENTER_KEY) {
        if (this._selectedEmoji === null || !evt.target.value) {
          return;
        }

        const commentText = evt.target.value;
        const commentsIds = this._comments.map((c) => {
          return c.id;
        });

        let newCommentId = 0;
        if (commentsIds.length > 0) {
          newCommentId = Math.max(...commentsIds);
          newCommentId++;
        }

        const newComment = {
          id: newCommentId,
          text: commentText,
          emotion: this._selectedEmoji !== null ? this._selectedEmoji.value : null,
          commentDate: new Date().valueOf(),
          author: `author`
        };

        const changedComments = [].concat(this._comments, newComment);
        this._onCommentsChanged(changedComments);
      }
    });
  }

  _refreshSelectedEmoji() {
    if (this._selectedEmojiElement !== null) {
      this._selectedEmojiElement.remove();
      this._selectedEmojiElement = null;
    }

    this._selectedEmojiElement = Utils.createElement(getEmojiTemplate(this._selectedEmoji));
    const emojicontainer = this._element.querySelector(`.film-details__add-emoji-label`);
    emojicontainer.appendChild(this._selectedEmojiElement);
  }
}
