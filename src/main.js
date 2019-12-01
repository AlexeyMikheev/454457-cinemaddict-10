import {createProfileTemplate} from './components/profile.js';
import {createMenuTemplate} from './components/menu.js';
import {createSortTemplate} from './components/sort.js';
import {createShowMoretempalte} from './components/show-more.js';
import {createFilmsTemplate, createFilmsListTemplate, createFilmsTopRatedTemplate, createFilmsMostCommentedTemplate, createFimlsCardsTemplates} from './components/films';
import {createFilmDetailtemplate} from './components/film-detail';

import {Filters} from './const.js';
import {createFilmCards} from './mock/filmCard.js';
import {generateFilters} from './mock/filters.js';

const COUNT_FILMS = 15;
const ONE_TASKS_PAGE_COUNT = 5;
const COUNT_FILMS_EXTRA = 2;

const headerContainer = document.querySelector(`.header`);
const mainContainer = document.querySelector(`.main`);

const renderItem = (container, template, place = `beforeend`) => {
  container.insertAdjacentHTML(place, template);
};

const getFimlsCardsByPageNumber = (fimlsCards, pageNumber, countTasks = ONE_TASKS_PAGE_COUNT) =>{
  const startIndex = pageNumber * countTasks;
  const endIndex = startIndex + countTasks;
  return fimlsCards.slice(startIndex, endIndex);
};

const fillFiltersValues = (filters, fimlsCards) =>{
  filters.forEach((filter)=>{
    if (filter.title === Filters.ALL.title) {
      filter.count += fimlsCards.length;
    }

    if (filter.title === Filters.WATCHLIST.title) {
      filter.count = fimlsCards.reduce((total, filmCard) =>{
        if (filmCard.IsWaitingWatched) {
          total++;
        }
        return total;
      }, filter.count);
    }

    if (filter.title === Filters.HISTORY.title) {
      filter.count = fimlsCards.reduce((total, filmCard) =>{
        if (filmCard.IsWatched) {
          total++;
        }
        return total;
      }, filter.count);
    }

    if (filter.title === Filters.FAVORITES.title) {
      filter.count = fimlsCards.reduce((total, filmCard) =>{
        if (filmCard.isFavorite) {
          total++;
        }
        return total;
      }, filter.count);
    }
  });
};

const refreshFilters = (pageTasks) =>{
  fillFiltersValues(filters, pageTasks);
  renderItem(mainContainer, createMenuTemplate(filters), `afterBegin`);
};

const renderFilmsCardsByPageNumber = (fimlsCards, currentTasksPage) =>{
  const pageFimlsCards = getFimlsCardsByPageNumber(fimlsCards, currentTasksPage);

  refreshFilters(pageFimlsCards);
  renderItem(filmsListContainer, createFimlsCardsTemplates(pageFimlsCards));
};

renderItem(headerContainer, createProfileTemplate());

const filters = generateFilters();
renderItem(mainContainer, createMenuTemplate(filters));

renderItem(mainContainer, createSortTemplate());

renderItem(mainContainer, createFilmsTemplate());

const filmsContainer = mainContainer.querySelector(`.films`);

renderItem(filmsContainer, createFilmsListTemplate());

const filmsList = filmsContainer.querySelector(`.films-list`);
renderItem(filmsList, createShowMoretempalte());

const filmsListContainer = filmsContainer.querySelector(`.films-list .films-list__container`);

const filmsCards = createFilmCards(COUNT_FILMS);
// renderItem(filmsListContainer, createFimlsCardsTemplates(filmsCards));

let currentPage = 0;

const [editableDisplayedFilmCard, ...displayedFilmsCards] = filmsCards;
// renderItem(tasksContainer, createTaskEditTemplate(editableDisplayedTask));

renderFilmsCardsByPageNumber(displayedFilmsCards, currentPage);

// renderItem(filmsContainer, createFilmsTopRatedTemplate());
// renderItem(filmsContainer, createFilmsMostCommentedTemplate());

// const filmsExtraContainers = filmsContainer.querySelectorAll(`.films-list--extra .films-list__container`);

// const filmsTopRatedContainer = filmsExtraContainers[0];
// renderItem(filmsTopRatedContainer, getFilms(COUNT_FILMS_EXTRA));

// const filmsMostCommentedContainer = filmsExtraContainers[1];
// renderItem(filmsMostCommentedContainer, getFilms(COUNT_FILMS_EXTRA));

// const footer = document.querySelector(`.footer`);

// renderItem(footer, createFilmDetailtemplate(), `afterend`);
