import {createProfileTemplate} from './components/profile.js';
import {createMenuTemplate} from './components/menu.js';
import {createSortTemplate} from './components/sort.js';
import {createMoreTemplate} from './components/show-more.js';
import {createFilmsTemplate, createFilmsListTemplate, createFilmsTopRatedTemplate, createFilmsMostCommentedTemplate, createFilmsCardsTemplates} from './components/film.js';
import {createFilmDetailtemplate, removeFilmDetail} from './components/film-detail.js';
import {createFooterStatisticTemplate} from './components/footer-statistic.js';

import {ESC_KEY, COUNT_FILMS, ONE_TASKS_PAGE_COUNT, Filters} from './const.js';
import {renderItem, getTopFilmsByProperty, getFilterValue, renderFilmsCardsByPageNumber} from './utils.js';
import {createFilmCards} from './mock/filmCard.js';
import {generateFilters} from './mock/filters.js';

const headerContainer = document.querySelector(`.header`);
const mainContainer = document.querySelector(`.main`);
const footer = document.querySelector(`.footer`);

let totalWatchedFilms = 0;

const refreshFilters = (pageTasks) => {
  filters.forEach((filter) => {
    filter.count = getFilterValue(filter, pageTasks);

    if (filter.title === Filters.ALL.title) {
      totalWatchedFilms = filter.count;
    }
  });
  renderItem(mainContainer, createMenuTemplate(filters), `afterBegin`);
};

const isMoreButtonVisibility = () => {
  return (currentPage + 1) * ONE_TASKS_PAGE_COUNT < filmsCards.length;
};

const addMoreButton = () => {
  const filmsList = filmsContainer.querySelector(`.films-list`);

  if (isMoreButtonVisibility()) {
    renderItem(filmsList, createMoreTemplate());

    const moreButton = filmsList.querySelector(`.films-list__show-more`);
    moreButton.addEventListener(`click`, () => {
      currentPage++;
      renderFilmsCardsByPageNumber(filmsListContainer, filmsCards, currentPage);

      if (!isMoreButtonVisibility()) {
        moreButton.remove();
      }
    });
  }
};

const addStatistic = () => {
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

refreshFilters(filmsCards);
renderFilmsCardsByPageNumber(filmsListContainer, filmsCards, currentPage);

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

let isFilmDetailOpened = false;

const initCloseFilmDetailEvents = () => {
  let closeBtn = document.querySelector(`.film-details__close-btn`);
  closeBtn.addEventListener(`click`, () => {
    hideFilmDeatils();
  });
};

const hideFilmDeatils = () => {
  if (isFilmDetailOpened) {
    removeFilmDetail();
    isFilmDetailOpened = false;
  }
};

const showFilmDeatils = (filmsCard) => {
  hideFilmDeatils();

  renderItem(footer, createFilmDetailtemplate(filmsCard), `afterend`);
  initCloseFilmDetailEvents();
  isFilmDetailOpened = true;
};

showFilmDeatils(filmsCards[0]);

const initDocumentEvents = () => {
  document.addEventListener(`keydown`, (evt) => {
    if (evt.keyCode === ESC_KEY) {
      hideFilmDeatils();
    }
  });
};

initDocumentEvents();
