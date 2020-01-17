export const Filters = {
  ALL: {title: `All movies`, anchor: `all`},
  WATCHLIST: {title: `Watchlist`, anchor: `watchlist`},
  HISTORY: {title: `History`, anchor: `history`},
  FAVORITES: {title: `Favorites`, anchor: `favorites`},
  STATS: {title: `Stats`, anchor: `stats`},
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
  PUKE: {value: `puke`, img: `puke`},
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

export const FilmComponentType = {
  LIST: 1,
  TOP_RATED: 2,
  MOST_COMMENTS: 3
};

export const MINUTE_IN_HOUR = 60;
export const SECONDS_IN_MINUTE = 60;

export const DescriptionLength = {
  MIN: 0,
  MAX: 140
};
export const DESCRIPTION_SPACE = 1;

export const MANY_COMMENTS_COUNT = 1;

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

export const RatingValue = {
  MIN: 1,
  MAX: 9
};
export const RATING_RANGE = 1;

export const RELEASE_DATE_FORMAT = `DD MMMM YYYY`;

export const DURATION_FORMAT = `h[h] mm[m]`;

export const SHAKE_ANIMATION_TIMEOUT = 600;

export const ObjectState = {
  INITIAL: `initial`,
  UPDATED: `updated`
};

export const DEBOUNCE_TIMEOUT = 500;

export const NoFilmTypes = {
  LOADING: 0,
  EMPTY: 1,
};
