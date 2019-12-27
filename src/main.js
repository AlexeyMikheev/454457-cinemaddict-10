

import PageController from './page-controller.js';
import Films from './models/films.js';
import API from './api.js';

const AUTHORIZATION = `Basic eo0w590ik29889a`;
const END_POINT = `https://htmlacademy-es-10.appspot.com/cinemaddict`;

const headerContainer = document.querySelector(`.header`);
const mainContainer = document.querySelector(`.main`);
const footer = document.querySelector(`.footer`);

const api = new API(END_POINT, AUTHORIZATION);
const filmsModel = new Films();

const pageController = new PageController(headerContainer, mainContainer, footer, filmsModel, api);


api.getFilms()
  .then((films) => {
    filmsModel.films = films;
    pageController.render();
  });

