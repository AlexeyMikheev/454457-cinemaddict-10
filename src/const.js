export const Filters = {
  ALL: {title: `All movies`, anchor: `all`},
  WATCHLIST: {title: `Watchlist`, anchor: `watchlist`},
  HISTORY: {title: `History`, anchor: `history`},
  FAVORITES: {title: `Favorites`, anchor: `favorites`},
  STATS: {title: `Stats`, anchor: `stats`},
};

export const ProfileRating = {
  NOVICE: {min: 1, max: 10, name: `novice`},
  FAN: {min: 11, max: 20, name: `fan`},
  MOVIE_BUFF: {min: 21, name: `movie buff`},
};

export const Emotion = {
  SMILE: `smile`,
  SLEEPING: `sleeping`,
  PUKE: `puke`,
  ANGRY: `angry`
};

export const MONTHS = [`January`, `February`, `March`, `April`, `May`, `June`,
  `July`, `August`, `September`, `October`, `November`, `December`
];

export const ESC_KEY = 27;

export const COUNT_FILMS = 15;
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
