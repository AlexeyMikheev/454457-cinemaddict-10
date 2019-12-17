

import {createFilmCards} from './mock/filmCard.js';
import {generateFilters} from './mock/filters.js';
import PageController from './page-controller.js';
import Movies from './models/movies.js';
import {COUNT_FILMS} from './const.js';

const filters = generateFilters();
const films = createFilmCards(COUNT_FILMS);

const headerContainer = document.querySelector(`.header`);
const mainContainer = document.querySelector(`.main`);
const footer = document.querySelector(`.footer`);

const movies = new Movies();
movies.films = films;
const pageController = new PageController(headerContainer, mainContainer, footer, movies);
pageController.render(filters);

