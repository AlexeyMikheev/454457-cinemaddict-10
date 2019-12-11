import Utils from './utils.js';
import Film from './components/film.js';
import FilmDeatil from './components/film-detail.js';

export default class MovieController {
  constructor(container, onDataChange, onViewChange) {
    this._container = container;
    this._film = null;
    this._filmDetailComponent = null;
    this._filmComponent = null;
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;

    this._onCloseFilmDetail = () => {
      if (this._filmDetailComponent !== null) {
        this._filmDetailComponent.removeCloseEvent();
        this._filmDetailComponent.removeElement();
        this._filmDetailComponent = null;
      }
    };

    this._onShowFilmDetail = (evt) => {
      this._onViewChange();

      const classList = evt.target.classList;

      const isClickAvaliable = classList.contains(`film-card__poster`) ||
        classList.contains(`film-card__comments`) ||
        classList.contains(`film-card__title`);

      if (isClickAvaliable) {

        this._filmDetailComponent = new FilmDeatil(this._film, document.body);
        Utils.render(this._filmDetailComponent.container, this._filmDetailComponent.getElement());

        this._filmDetailComponent.initComponents();
        this._filmDetailComponent.addCloseEvent(this._onCloseFilmDetail);
        this._filmDetailComponent.addDetailCheckedChangeEvent(this._onDataChange);
      }
    };
  }

  get film() {
    return this._film;
  }

  render(film) {
    this._film = film;
    const filmsListContainer = this._container.querySelector(`.films-list__container`);

    if (this._filmComponent === null) {
      this._filmComponent = new Film(this._film);

      filmsListContainer.appendChild(this._filmComponent.getElement());
    } else {
      const newFilmComponent = new Film(this._film);

      this.removeFilmComponentEvents();
      filmsListContainer.replaceChild(newFilmComponent.getElement(), this._filmComponent.getElement());

      this._filmComponent = newFilmComponent;
    }

    this._filmComponent.addClickEvent(this._onShowFilmDetail);
    this._filmComponent.addButtonChangeEvent(this._onDataChange);

    if (this._filmDetailComponent !== null) {
      this._filmDetailComponent.film = this._film;
      this._filmDetailComponent.rerender();
    }
  }

  get HasFilmDeatail() {
    return this._filmDetailComponent !== null;
  }

  removeComponents() {
    this.removeDetailComponent();
    this.removeDetailComponentEvets();

    this.removeFilmComponent();
    this.removeFilmComponentEvents();
  }

  removeFilmComponent() {
    if (this._filmComponent !== null) {
      this._filmComponent.removeElement();
      this._filmComponent = null;
    }
  }

  removeFilmComponentEvents() {
    if (this._filmComponent !== null) {
      this._filmComponent.removeClickEvent();
    }
  }

  removeDetailComponent() {
    if (this._filmDetailComponent !== null) {
      this._filmDetailComponent.removeElement();
      this._filmDetailComponent = null;
    }
  }

  removeDetailComponentEvets() {
    if (this._filmDetailComponent !== null) {
      this._filmDetailComponent.removeCloseEvent();
      this._filmDetailComponent.removeDetailCheckedChangeEvent();
    }
  }

  setDefaultView() {
    this._onCloseFilmDetail();
  }
}
