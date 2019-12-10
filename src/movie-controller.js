import Utils from './utils.js';
import Film from './components/film.js';
import FilmDeatil from './components/film-detail.js';

export default class MovieController {
  constructor(container, onDataChange) {
    this._container = container;
    this._film = null;
    this._filmDetailComponent = null;
    this._filmComponent = null;
    this._onDataChange = onDataChange;

    this._onCloseFilmDetail = () => {
      if (this._filmDetailComponent !== null) {
        this._filmDetailComponent.removeCloseEvent();
        this._filmDetailComponent.removeElement();
        this._filmDetailComponent = null;
      }
    };

    this._onShowFilmDetail = (evt) => {
      this._onCloseFilmDetail();

      // this._onDataChange(this._film, null);

      const classList = evt.target.classList;

      const isClickAvaliable = classList.contains(`film-card__poster`) ||
        classList.contains(`film-card__comments`) ||
        classList.contains(`film-card__title`);

      if (isClickAvaliable) {

        this._filmDetailComponent = new FilmDeatil(this._film);
        Utils.render(document.body, this._filmDetailComponent.getElement());

        this._filmDetailComponent.initComments();
        this._filmDetailComponent.initAddCommentForm();
        this._filmDetailComponent.addCloseEvent(this._onCloseFilmDetail);
      }
    };
  }

  get film() {
    return this._film;
  }

  render(film) {
    this._film = film;
    this._filmComponent = new Film(this._film);

    const filmsListContainer = this._container.querySelector(`.films-list__container`);

    filmsListContainer.appendChild(this._filmComponent.getElement());
    this._filmComponent.addClickEvent(this._onShowFilmDetail);
  }

  get HasFilmDeatail() {
    return this._filmDetailComponent !== null;
  }

  removeComponents() {
    this.removeDetailComponent();

    if (this._filmComponent !== null) {
      this._filmComponent.removeClickEvent();
      this._filmComponent.removeElement();
    }
  }

  removeDetailComponent() {
    if (this._filmDetailComponent !== null) {
      this._filmDetailComponent.removeCloseEvent();
      this._filmDetailComponent.removeElement();
      this._filmDetailComponent = null;
    }
  }
}
