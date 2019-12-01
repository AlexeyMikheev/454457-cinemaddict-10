import {createProfileTemplate} from './components/profile.js';
import {createMenuTemplate} from './components/menu.js';
import {createSortTemplate} from './components/sort.js';
import {createMoreTemplate} from './components/show-more.js';
import {createFilmsTemplate, createFilmsListTemplate, createFilmsTopRatedTemplate, createFilmsMostCommentedTemplate, createFilmsCardsTemplates} from './components/films';
import {createFilmDetailtemplate} from './components/film-detail';
import {createFooterStatisticTemplate} from './components/footer-statistic.js';

import {Filters} from './const.js';
import {createFilmCards} from './mock/filmCard.js';
import {generateFilters} from './mock/filters.js';

const COUNT_FILMS = 15;
const ONE_TASKS_PAGE_COUNT = 5;
const COUNT_FILMS_EXTRA = 2;

const headerContainer = document.querySelector(`.header`);
const mainContainer = document.querySelector(`.main`);
const footer = document.querySelector(`.footer`);

let totalWatchedFilms = 0;

const renderItem = (container, template, place = `beforeend`) => {
  container.insertAdjacentHTML(place, template);
};

const getSortedByDescFilms = (films, propertyName) =>{
  return films.slice().sort((prevFilm, nextFilm)=>{
    if (prevFilm[propertyName] > nextFilm[propertyName]) {
      return -1;
    }
    if (prevFilm[propertyName] < nextFilm[propertyName]) {
      return 1;
    }
    return 0;
  });
};

const getTopFilmsByProperty = (films, propertyName) => {
  const [first = null, second = null] = getSortedByDescFilms(films, propertyName);
  return [first, second];
};

const getFimlsCardsByPageNumber = (filmsCards, pageNumber, countTasks = ONE_TASKS_PAGE_COUNT) =>{
  const startIndex = pageNumber * countTasks;
  const endIndex = startIndex + countTasks;
  return filmsCards.slice(startIndex, endIndex);
};

const fillFiltersValues = (filters, filmsCards) =>{
  filters.forEach((filter)=>{
    if (filter.title === Filters.ALL.title) {
      filter.count += filmsCards.length;
    }

    if (filter.title === Filters.WATCHLIST.title) {
      filter.count = filmsCards.reduce((total, filmCard) =>{
        if (filmCard.IsWaitingWatched) {
          total++;
        }
        return total;
      }, filter.count);
    }

    if (filter.title === Filters.HISTORY.title) {
      totalWatchedFilms = filter.count = filmsCards.reduce((total, filmCard) =>{
        if (filmCard.IsWatched) {
          total++;
        }
        return total;
      }, filter.count);
    }

    if (filter.title === Filters.FAVORITES.title) {
      filter.count = filmsCards.reduce((total, filmCard) =>{
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

  renderItem(filmsListContainer, createFilmsCardsTemplates(pageFimlsCards));
};

const getMoreButtonVisibility = () => {
  return (currentPage + 1) * ONE_TASKS_PAGE_COUNT < filmsCards.length;
};

const addMoreButton = () => {
  const filmsList = filmsContainer.querySelector(`.films-list`);

  if (getMoreButtonVisibility()) {
    renderItem(filmsList, createMoreTemplate());

    const moreButton = filmsList.querySelector(`.films-list__show-more`);
    moreButton.addEventListener(`click`, () => {
      currentPage++;
      renderFilmsCardsByPageNumber(displayedFilmsCards, currentPage);

      if (!getMoreButtonVisibility()) {
        moreButton.remove();
      }

    });
  }
};

const addStatistic = () =>{
  const footerStatistic = document.querySelector(`.footer .footer__statistics`);
  footerStatistic.remove();

  renderItem(footer, createFooterStatisticTemplate(filmsCards.length), `beforeEnd`);
};

const filters = generateFilters();
renderItem(mainContainer, createMenuTemplate(filters));

renderItem(mainContainer, createSortTemplate());

renderItem(mainContainer, createFilmsTemplate());

const filmsContainer = mainContainer.querySelector(`.films`);
renderItem(filmsContainer, createFilmsListTemplate());


const filmsListContainer = filmsContainer.querySelector(`.films-list .films-list__container`);

let currentPage = 0;

const filmsCards = createFilmCards(COUNT_FILMS);
const [editableDisplayedFilmCard, ...displayedFilmsCards] = filmsCards;
// renderItem(tasksContainer, createTaskEditTemplate(editableDisplayedTask));

refreshFilters(displayedFilmsCards);
renderFilmsCardsByPageNumber(displayedFilmsCards, currentPage);

addMoreButton();

renderItem(filmsContainer, createFilmsTopRatedTemplate());
renderItem(filmsContainer, createFilmsMostCommentedTemplate());

const filmsExtraContainers = filmsContainer.querySelectorAll(`.films-list--extra .films-list__container`);

const filmsTopRatedContainer = filmsExtraContainers[0];
const topRatedFilms = getTopFilmsByProperty(filmsCards, `rating`);
renderItem(filmsTopRatedContainer, createFilmsCardsTemplates(topRatedFilms));

const filmsMostCommentedContainer = filmsExtraContainers[1];
const mostCommentFilms = getTopFilmsByProperty(filmsCards, `comments`);
renderItem(filmsMostCommentedContainer, createFilmsCardsTemplates(mostCommentFilms));

renderItem(headerContainer, createProfileTemplate(totalWatchedFilms));

addStatistic();

//renderItem(footer, createFilmDetailtemplate(), `afterend`);


