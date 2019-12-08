

import {createFilmCards} from './mock/filmCard.js';
import {generateFilters} from './mock/filters.js';
import PageController from './page-controller.js';
import {COUNT_FILMS} from './const.js';

const filters = generateFilters();
const films = createFilmCards(COUNT_FILMS);

const pageController = new PageController(films, filters);
pageController.init();

