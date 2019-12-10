

import {createFilmCards} from './mock/filmCard.js';
import {generateFilters} from './mock/filters.js';
import PageController from './page-controller.js';
import {COUNT_FILMS} from './const.js';

const filters = generateFilters();
const films = createFilmCards(COUNT_FILMS);

const headerContainer = document.querySelector(`.header`);
const mainContainer = document.querySelector(`.main`);
const footer = document.querySelector(`.footer`);

const pageController = new PageController(headerContainer, mainContainer, footer);
pageController.render(films, filters);

