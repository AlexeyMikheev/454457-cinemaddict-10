import Profile from './components/profile.js';
import Menu from './components/menu.js';
import Sotr from './components/sort.js';
import MoreButton from './components/more-button.js';
import {createFilmsCardsTemplates} from './components/film.js';
import FilmDeatil from './components/film-detail.js';
import Statistic from './components/statistic.js';

import {COUNT_FILMS, ONE_TASKS_PAGE_COUNT, Filters, FIMLS_COMPONENT_TYPES} from './const.js';
import {renderItem, getTopFilmsByProperty, getFilterValue, renderFilmsCardsByPageNumber} from './utils.js';
import {createFilmCards} from './mock/filmCard.js';
import {generateFilters} from './mock/filters.js';
import Films from './components/films';

const headerContainer = document.querySelector(`.header`);
const mainContainer = document.querySelector(`.main`);
const footer = document.querySelector(`.footer`);

const isMoreButtonVisible = () => {
  return (currentPage + 1) * ONE_TASKS_PAGE_COUNT < filmsCards.length;
};

const initMenu = (pageTasks) => {
  let totalWatchedFilms = 0;
  filters.forEach((filter) => {
    filter.count = getFilterValue(filter, pageTasks);

    if (filter.title === Filters.ALL.title) {
      totalWatchedFilms = filter.count;
    }
  });

  new Profile(totalWatchedFilms).render(headerContainer);

  new Menu(filters).render(mainContainer);
};

const initMoreButton = () => {
  if (isMoreButtonVisible()) {

    const onMoreButtonClick = () => {
      currentPage++;
      renderFilmsCardsByPageNumber(filmsListContainer, filmsCards, currentPage);

      if (!isMoreButtonVisible()) {
        moreButton.remove();
      }
    };

    const moreButton = new MoreButton();
    moreButton.render(filmsContainer.querySelector(`.films-list`));
    moreButton.initClickEvent(onMoreButtonClick);
  }
};

const filters = generateFilters();
const filmsCards = createFilmCards(COUNT_FILMS);

new Sotr().render(mainContainer);
debugger;
Films.renderContainer(mainContainer);
const filmsContainer = Films.FilmsContainer;

const films = new Films(filmsCards, FIMLS_COMPONENT_TYPES.FIMLS);
films.render(filmsContainer);

const topRatedFilms1 = new Films(filmsCards, FIMLS_COMPONENT_TYPES.TOP_RATED);
topRatedFilms1.render(filmsContainer);

const mostCommentFilms1 = new Films(filmsCards, FIMLS_COMPONENT_TYPES.MOST_COMMENTS);
mostCommentFilms1.render(filmsContainer);

let currentPage = 0;

initMenu(filmsCards);
//renderFilmsCardsByPageNumber(filmsListContainer, filmsCards, currentPage);

initMoreButton();

// renderItem(filmsContainer, createFilmsTopRatedTemplate());
// renderItem(filmsContainer, createFilmsMostCommentedTemplate());

//const filmsExtraContainers = filmsContainer.querySelectorAll(`.films-list--extra .films-list__container`);

//const filmsTopRatedContainer = filmsExtraContainers[0];
// const topRatedFilms = getTopFilmsByProperty(filmsCards, `rating`);
// renderItem(filmsTopRatedContainer, createFilmsCardsTemplates(topRatedFilms));

//const filmsMostCommentedContainer = filmsExtraContainers[1];
// const mostCommentFilms = getTopFilmsByProperty(filmsCards, `comments`);
// renderItem(filmsMostCommentedContainer, createFilmsCardsTemplates(mostCommentFilms));

new Statistic(filmsCards.length).render(footer);

const filmDeatil = new FilmDeatil(filmsCards[0]);
filmDeatil.render(document.body);
