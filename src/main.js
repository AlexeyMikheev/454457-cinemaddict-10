

import PageController from './page-controller.js';
import Films from './models/films.js';
import API from './api/api.js';
import Provider from './api/provider.js';
import Store from './api/store.js';

const AUTHORIZATION = `Basic eo0w590ik29889a`;
const END_POINT = `https://htmlacademy-es-10.appspot.com/cinemaddict`;
const STORE_KEY = `Cinemaddict eo0w590ik29889a`;

const headerContainer = document.querySelector(`.header`);
const mainContainer = document.querySelector(`.main`);
const footer = document.querySelector(`.footer`);

const windowTitle = document.title;

const api = new API(END_POINT, AUTHORIZATION);
const store = new Store(STORE_KEY, window.localStorage);
const provider = new Provider(api, store);
const filmsModel = new Films();

const pageController = new PageController(headerContainer, mainContainer, footer, filmsModel, provider);

provider.getFilms()
  .then((films) => {
    filmsModel.films = films;
    pageController.render();
  });

window.addEventListener(`online`, () => {
  document.title = windowTitle;

  if (!provider._isSynchronized) {

  }
});

window.addEventListener(`offline`, () => {
  document.title = `${windowTitle} [offline]`;
});

