import Utils from './utils.js';
import Film from './components/film.js';
import FilmDetail from './components/film-detail.js';

export default class MovieController {
  constructor(container, onDataChange, onViewChange) {
    this._container = container;
    this._film = null;
    this._filmDetailComponent = null;
    this._filmComponent = null;
    this._onDataChange = onDataChange;

    this._onDataChangeCb = (oldValue, newValue) => {
      this._onDataChange(this, oldValue, newValue);
    };

    this._onViewChange = onViewChange;

    this._renderMode = {
      default: true,
      details: false
    };

    this._onCloseFilmDetail = () => {
      this._closeDetail();
      this._onViewChange(this);
    };

    this._onShowFilmDetail = (evt) => {
      this._renderMode.details = true;
      this._onViewChange(this);

      const classList = evt.target.classList;

      const isClickAvaliable = classList.contains(`film-card__poster`) ||
        classList.contains(`film-card__comments`) ||
        classList.contains(`film-card__title`);

      if (isClickAvaliable) {

        this._filmDetailComponent = new FilmDetail(this._film, document.body, this._onDataChangeCb);
        Utils.render(this._filmDetailComponent.container, this._filmDetailComponent.getElement());

        this._filmDetailComponent.initComponents();
        this._filmDetailComponent.addCloseButtonClickEvent(this._onCloseFilmDetail);
        this._filmDetailComponent.addDetailCheckedChangeEvent();
        this._filmDetailComponent.addRatingCheckedChangeEvent();
      }
    };
  }

  get film() {
    return this._film;
  }

  set defaultModeVisibility(value) {
    this._renderMode.default = value;
  }

  get detailsModeVisibility() {
    return this._renderMode.details;
  }

  render(film) {
    this._film = film;

    if (this._renderMode.default) {
      this._renderFilmComponent();
    } else {
      this._removeFilmComponent();
    }

    if (this._renderMode.details) {
      this._renderFilmDetailComponent();
    }
  }

  setDefaultView() {
    if (this._renderMode.details) {
      this._closeDetail();
    }
  }

  removeComponents() {
    this._removeDetailComponent();
    this._removeFilmComponent();
  }

  _closeDetail() {
    if (this._filmDetailComponent !== null) {
      this._filmDetailComponent.removeEvents();
      this._filmDetailComponent.removeComponents();
      this._filmDetailComponent.removeElement();
      this._filmDetailComponent = null;
      this._renderMode.details = false;
    }
  }

  _renderFilmComponent() {
    const filmsListContainer = this._container.querySelector(`.films-list__container`);

    if (this._filmComponent === null) {
      this._filmComponent = new Film(this._film);

      filmsListContainer.appendChild(this._filmComponent.getElement());
    } else {
      const newFilmComponent = new Film(this._film);

      filmsListContainer.replaceChild(newFilmComponent.getElement(), this._filmComponent.getElement());

      this._filmComponent = newFilmComponent;
    }

    this._filmComponent.addFilmCardClickEvent(this._onShowFilmDetail);
    this._filmComponent.addDetailButtonClickEvent(this._onDataChangeCb);
  }

  _renderFilmDetailComponent() {
    if (this._filmDetailComponent !== null) {
      this._filmDetailComponent.film = this._film;
      this._filmDetailComponent.rerender();
    }
  }

  _removeFilmComponent() {
    if (this._filmComponent !== null) {
      this._filmComponent.removeElement();
      this._filmComponent = null;
    }
  }

  _removeDetailComponent() {
    if (this._filmDetailComponent !== null) {
      this._filmDetailComponent.removeEvents();
      this._filmDetailComponent.removeComponents();
      this._filmDetailComponent.removeElement();
      this._filmDetailComponent = null;
    }
  }
}
