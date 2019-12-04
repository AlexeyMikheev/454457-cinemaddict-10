import Utils from '../utils.js';
import { FIMLS_COMPONENT_TYPES } from '../const.js';

const createFilmsTemplate = () =>
    `<section class="films"></section>`;

const createFilmsListTemplate = () =>
    `<section class="films-list">
  <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>
  <div class="films-list__container"></div>
</section/`;

const createFilmsTopRatedTemplate = () =>
    `<section class="films-list--extra">
    <h2 class="films-list__title">Top rated</h2>
    <div class="films-list__container"></div>
  </section/`;

const createFilmsMostCommentedTemplate = () =>
    `<section class="films-list--extra">
    <h2 class="films-list__title">Most commented</h2>
    <div class="films-list__container"></div>
  </section/`;

export default class Films {
    constructor(films, componentType, parentContainer) {
        this._componentType = componentType;
        this._films = films;
        this._parentContainer = parentContainer;

        this.init();
    }

    static renderContainer(container) {
        this._filmsContainer = Utils.createElement(createFilmsTemplate());
        Utils.render(container, this._filmsContainer);
    }

    static get FilmsContainer() {
        return this._filmsContainer;
    }

    static CreateInstance(films, componentType) {
        return new this(films, componentType, this._filmsContainer)
    }

    init() {
        // this._filmsComponents = this._films.map((c) => {
        //     return new Film(c);
        // });

        this.initElement();
    }

    initElement() {
        if (!this._element) {
            this._element = Utils.createElement(this.getTemplate());
        }

        const filmsListContainer = this._element.querySelector(`.films-list .films-list__container`);

        // this._commentsComponents.forEach((comment) => {
        //     this.filmsListContainer.appendChild(comment.Element);
        // });
    }

    getTemplate() {
        switch (this._componentType) {
            case FIMLS_COMPONENT_TYPES.FIMLS: return createFilmsListTemplate();
            case FIMLS_COMPONENT_TYPES.TOP_RATED: return createFilmsTopRatedTemplate();
            case FIMLS_COMPONENT_TYPES.MOST_COMMENTS: return createFilmsMostCommentedTemplate();
            default: return ``;
        }
        return createSortTemplate();
    }

    get Element() {
        return this._element;
    }

    render() {
        Utils.render(this._parentContainer, this._element);
    }

    remove() {
        this._element = null;
    }
}