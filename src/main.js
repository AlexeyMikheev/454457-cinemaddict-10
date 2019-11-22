import {createProfileTemplate} from './components/profile.js';
import {createMenuTemplate} from './components/menu.js';
import {createSortTemplate} from './components/sort.js';
import {createShowMoretempalte} from './components/show-more.js';
import {createFilmsTemplate, createFilmsListTemplate, createFilmsTopRatedTemplate, createFilmsMostCommentedTemplate, createFimlCardTemplate} from './components/films';
import {createFilmDetailtemplate} from './components/film-detail';

const COUNT_FILMS = 5;
const COUNT_FILMS_EXTRA = 2;

const headerContainer = document.querySelector(`.header`);
const mainContainer = document.querySelector(`.main`);

const renderItem = (container, template, place = `beforeend`) => {
  container.insertAdjacentHTML(place, template);
};

const getFilms = (count) => {
  let fimlsTemplate = ``;
  for (let i = 0; i < count; i++) {
    fimlsTemplate += createFimlCardTemplate();
  }
  return fimlsTemplate;
};

renderItem(headerContainer, createProfileTemplate());

renderItem(mainContainer, createMenuTemplate());
renderItem(mainContainer, createSortTemplate());

renderItem(mainContainer, createFilmsTemplate());

const filmsContainer = mainContainer.querySelector(`.films`);

renderItem(filmsContainer, createFilmsListTemplate());

const filmsList = filmsContainer.querySelector(`.films-list`);
renderItem(filmsList, createShowMoretempalte());

const filmsListContainer = filmsContainer.querySelector(`.films-list .films-list__container`);

renderItem(filmsListContainer, getFilms(COUNT_FILMS));

renderItem(filmsContainer, createFilmsTopRatedTemplate());
renderItem(filmsContainer, createFilmsMostCommentedTemplate());

const filmsExtraContainers = filmsContainer.querySelectorAll(`.films-list--extra .films-list__container`);

const filmsTopRatedContainer = filmsExtraContainers[0];
renderItem(filmsTopRatedContainer, getFilms(COUNT_FILMS_EXTRA));

const filmsMostCommentedContainer = filmsExtraContainers[1];
renderItem(filmsMostCommentedContainer, getFilms(COUNT_FILMS_EXTRA));

const footer = document.querySelector(`.footer`);

renderItem(footer, createFilmDetailtemplate(), `afterend`);
