export const Filters = {
  ALL: {title: `All movies`, anchor: `all`, count: 0},
  WATCHLIST: {title: `Watchlist`, anchor: `watchlist`, count: 0},
  HISTORY: {title: `History`, anchor: `history`, count: 0},
  FAVORITES: {title: `Favorites`, anchor: `favorites`, count: 0},
  STATS: {title: `Stats`, anchor: `stats`, count: 0},
};

export const Period = {
  ALL: 0,
  TODAY: 1,
  WEEK: 2,
  MONTH: 3,
  YEAR: 4
};

export const Emoji = {
  SMILE: {value: `smile`, img: `smile`},
  SLEEPING: {value: `sleeping`, img: `sleeping`},
  GRINNING: {value: `grinning`, img: `puke`},
  ANGRY: {value: `angry`, img: `angry`}
};

export const ProfileRating = {
  NOVICE: {min: 1, max: 10, name: `novice`},
  FAN: {min: 11, max: 20, name: `fan`},
  MOVIE_BUFF: {min: 21, name: `movie buff`},
};

export const ESC_KEY = 27;
export const ENTER_KEY = 13;

export const ONE_TASKS_PAGE_COUNT = 5;

export const RenderPosition = {
  AFTERBEGIN: `afterbegin`,
  BEFOREEND: `beforeend`
};

export const FIMLS_COMPONENT_TYPES = {
  FIMLS: 1,
  TOP_RATED: 2,
  MOST_COMMENTS: 3
};

export const MINUTE_IN_HOUR = 60;

export const MIN_DESCRIPTION_LENGTH = 0;
export const MAX_DESCRIPTION_LENGTH = 140;
export const DESCRIPTION_SPACE = 1;

export const MANY_COMMENTS_COUNT = 1;

export const ONE_DAY = 86400000;

export const SortTypes = {
  DEFAULT: 0,
  DATE: 1,
  RATING: 2
};

export const FilmDetailType = {
  WATCHLIST: `watchlist`,
  WATCHED: `watched`,
  FAVORITE: `favorite`,
};

export const MIN_RATING_VALUE = 1;
export const MAX_RATING_VALUE = 9;
export const RATING_RANGE = 1;

export const RELEASE_DATE_FORMAT = `DD MMMM YYYY`;

export const DURATION_FORMAT = `h[h] mm[m]`;

export const DIFFERENCE_DATE_FORMAT = `YYYY/MM/DD HH:mm`;

export const SHAKE_ANIMATION_TIMEOUT = 600;
