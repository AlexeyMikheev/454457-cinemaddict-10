

import PageController from './page-controller.js';
import Films from './models/films.js';
import API from './api/api.js';
import Provider from './api/provider.js';
import Store from './api/store.js';
import FilmsContainer from './components/films-container.js';
import NoFilms from './components/no-films.js';
import Utils from './utils.js';
import {NoFilmTypes} from './const.js';

const AUTHORIZATION = `Basic eo0w590ik29889a`;
const END_POINT = `https://htmlacademy-es-10.appspot.com/cinemaddict`;
const STORE_KEY = `Cinemaddict eo0w590ik29889a`;

window.addEventListener(`load`, () => {
  navigator.serviceWorker.register(`/sw.js`)
    .then(() => {

    }).catch(() => {

    });
});


const headerContainer = document.querySelector(`.header`);
const mainContainer = document.querySelector(`.main`);
const footer = document.querySelector(`.footer`);

const windowTitle = document.title;

const api = new API(END_POINT, AUTHORIZATION);
const store = new Store(STORE_KEY, window.localStorage);
const provider = new Provider(api, store);
const filmsModel = new Films();

const pageController = new PageController(headerContainer, mainContainer, footer, filmsModel, provider);

const filmsContainerComponent = new FilmsContainer();
const filmsContainerComponentElement = filmsContainerComponent.getElement();
Utils.render(mainContainer, filmsContainerComponentElement);
Utils.render(filmsContainerComponentElement, new NoFilms(NoFilmTypes.LOADING).getElement());


provider.getFilms()
  .then((films) => {
    filmsContainerComponent.removeElement();
    filmsModel.films = films;

    const commentsPromisses = filmsModel.films.map((film) => {
      return provider.getComments(film.id).then((comments) => {
        film.comments = comments;
      });
    });

    Promise.all(commentsPromisses).then(() => {
      pageController.render();
    });
  });

window.addEventListener(`online`, () => {
  document.title = windowTitle;

  if (!provider.isSynchronized) {
    provider.sync().then((updatedFilms) => {
      updatedFilms.forEach((updatedFilm) => {
        filmsModel.updateFilm(updatedFilm.id, updatedFilm);
      });

      pageController.refresh();
    });
  }
});

window.addEventListener(`offline`, () => {
  document.title = `${windowTitle} [offline]`;
});

