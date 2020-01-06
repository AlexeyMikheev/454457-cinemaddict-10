import Utils from '../utils.js';

export default class Comment {
  constructor(data) {

    this.id = data[`id`];
    this.emotion = data[`emotion`];
    this.author = data[`author`];
    this.comment = data[`comment`];
    this.commentDate = Utils.paserDate(data[`date`]) || null;
  }

  toRAW() {
    return {
      'id': this.id,
      'emotion': this.emotion,
      'author': this.author,
      'comment': this.comment,
      'date': this.commentDate ? new Date(this.commentDate).toISOString() : null
    };
  }

  static parseComment(data) {
    return new Comment(data);
  }

  static parseComments(data) {
    return data.map(Comment.parseComment);
  }

  static clone(data) {
    return new Comment(data.toRAW());
  }
}
