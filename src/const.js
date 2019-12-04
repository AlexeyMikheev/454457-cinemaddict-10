const Filters = {
  ALL: {title: `All movies`, anchor: `all`},
  WATCHLIST: {title: `Watchlist`, anchor: `watchlist`},
  HISTORY: {title: `History`, anchor: `history`},
  FAVORITES: {title: `Favorites`, anchor: `favorites`},
  STATS: {title: `Stats`, anchor: `stats`},
};

const ProfileRating = {
  NOVICE: {min: 1, max: 10, name: `novice`},
  FAN: {min: 11, max: 20, name: `fan`},
  MOVIE_BUFF: {min: 21, name: `movie buff`},
};

const Emotion = {
  SMILE: `smile`,
  SLEEPING: `sleeping`,
  PUKE: `puke`,
  ANGRY: `angry`
};

const MONTHS = [`January`, `February`, `March`, `April`, `May`, `June`,
  `July`, `August`, `September`, `October`, `November`, `December`
];

const ESC_KEY = 27;

const COUNT_FILMS = 15;
const ONE_TASKS_PAGE_COUNT = 5;

const RenderPosition = {
  AFTERBEGIN: `afterbegin`,
  BEFOREEND: `beforeend`
};

const FIMLS_COMPONENT_TYPES = {
  FIMLS: 1,
  TOP_RATED: 2,
  MOST_COMMENTS: 3
};

const MINUTE_IN_HOUR = 60;

const MIN_DESCRIPTION_LENGTH = 0;
const MAX_DESCRIPTION_LENGTH = 140;
const DESCRIPTION_SPACE = 1;

const MANY_COMMENTS_COUNT = 1;

const ONE_DAY = 86400000;

export {Filters, ProfileRating, Emotion, MONTHS, ESC_KEY, COUNT_FILMS, ONE_TASKS_PAGE_COUNT, RenderPosition, FIMLS_COMPONENT_TYPES, MINUTE_IN_HOUR, MIN_DESCRIPTION_LENGTH, MAX_DESCRIPTION_LENGTH, DESCRIPTION_SPACE, MANY_COMMENTS_COUNT, ONE_DAY};
