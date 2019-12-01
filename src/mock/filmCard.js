const FimlsNames = [
  `Правдивая ложь`,
  `Скалолаз`,
  `Разрушитель`,
  `Матрица`,
  `Терминатор`,
  `Люди в черном`,
  `Кровавый спорт`,
  `Командо`,
  `Гром в раю`,
  `Властелин колец`,
  `Санктум`,
  `Цырство небесное`,
  `Орел и решка`,
  `Мир наизнанку`
];

const Posters = [
  `made-for-each-other.png`,
  `popeye-meets-sinbad.png`,
  `sagebrush-trail.jpg`,
  `santa-claus-conquers-the-martians.jpg`,
  `the-dance-of-life.jpg`
];

const Genres = [
  `Musical`,
  `Western`,
  `Dramma`,
  `Comedy`,
  `Cartoon`
];

const RANDOM_LIMIT = 0.5;

const MIN_RANDOM_NUMBER = 0;

const DESCRIPTION = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.`;
const MIN_DESCRIPTION_COUNT = 0;
const MAX_DESCRIPTION_COUNT = 3;

const MIN_RATING_COUNT = 0;
const MAX_RATING_COUNT = 10;

const MIN_YEAR_COUNT = 1990;
const MAX_YEAR_COUNT = 2020;

const MIN_DURATION_COUNT = 40;
const MAX_DURATION_COUNT = 180;

const MIN_COMMENTS_COUNT = 0;
const MAX_COMMENTS_COUNT = 20;

const getRandomNumber = (min, max) => {
  return Math.floor((max - min) * Math.random());
};

const getRandomDecimal = (min, max) => {
  return ((max - min) * Math.random()).toFixed(1);
};

const getRandomBoolean = () => {
  return Math.random() > RANDOM_LIMIT;
};

const getRandomItem = (items) => {
  const index = getRandomNumber(MIN_RANDOM_NUMBER, items.length);
  return items[index];
};

const createRandomItems = (items, min, max) => {
  return items
    .filter(() => getRandomBoolean())
    .slice(min, max);
};

const createfilmCard = () => {

  let isWaitingWatched = getRandomBoolean();
  let isWatched = getRandomBoolean();

  if (isWatched) {
    isWaitingWatched = false;
  }

  return {
    title: getRandomItem(FimlsNames),
    rating: getRandomDecimal(MIN_RATING_COUNT, MAX_RATING_COUNT),
    year: MIN_YEAR_COUNT + getRandomNumber(MIN_YEAR_COUNT, MAX_YEAR_COUNT),
    duration: getRandomNumber(MIN_DURATION_COUNT, MAX_DURATION_COUNT),
    genre: getRandomItem(Genres),
    poster: getRandomItem(Posters),
    description: createRandomItems(DESCRIPTION.split(`.`), MIN_DESCRIPTION_COUNT, MAX_DESCRIPTION_COUNT).join(` `),
    comments: getRandomNumber(MIN_COMMENTS_COUNT, MAX_COMMENTS_COUNT),
    isFavorite: getRandomBoolean(),
    IsWaitingWatched: isWaitingWatched,
    IsWatched: isWatched
  };
};

const createFilmCards = (count) => {
  let filmsCards = [];
  for (let i = 0; i < count; i++) {
    filmsCards.push(createfilmCard());
  }
  return filmsCards;
};

export {createFilmCards};
