import Profile from './components/profile.js';
import {createMenuTemplate} from './components/menu.js';
import {createSortTemplate} from './components/sort.js';
import MoreButton from './components/more-button.js';
import {createFilmsTemplate, createFilmsListTemplate, createFilmsTopRatedTemplate, createFilmsMostCommentedTemplate, createFilmsCardsTemplates} from './components/film.js';
import FilmDeatil from './components/film-detail.js';
import Statistic from './components/statistic.js';

import {COUNT_FILMS, ONE_TASKS_PAGE_COUNT, Filters} from './const.js';
import {renderItem, getTopFilmsByProperty, getFilterValue, renderFilmsCardsByPageNumber} from './utils.js';
import {Utils} from './utils.js';
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

const isMoreButtonVisible = () => {
  return (currentPage + 1) * ONE_TASKS_PAGE_COUNT < filmsCards.length;
};

const addMoreButton = () => {
  if (isMoreButtonVisible()) {

    const onMoreButtonClick = () => {
      currentPage++;
      renderFilmsCardsByPageNumber(filmsListContainer, filmsCards, currentPage);

      if (!isMoreButtonVisible()) {
        moreButton.remove();
      }
    };

    const moreButton = new MoreButton();
    moreButton.showIn(filmsContainer.querySelector(`.films-list`));
    moreButton.initClickEvent(onMoreButtonClick);
  }
};

const addStatistic = () => {
  const statistic = new Statistic(filmsCards.length);
  statistic.showIn(footer);
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

Utils.render(headerContainer, new Profile(totalWatchedFilms).Element);

addStatistic();

const showFilmDeatils = (filmsCard) => {
  const filmDeatil = new FilmDeatil(filmsCard);
  filmDeatil.showIn(document.body);
};

showFilmDeatils(filmsCards[0]);
