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

const Months = [`January`, `February`, `March`, `April`, `May`, `June`,
  `July`, `August`, `September`, `October`, `November`, `December`
];

export {Filters, ProfileRating, Emotion, Months};
