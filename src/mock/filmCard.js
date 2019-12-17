import {Emoji, MIN_RATING_VALUE, MAX_RATING_VALUE} from '../const.js';

const FilmsNames = [
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

const Peoples = [
  `Джеймс Кэмерон`,
  `Ренни Харлин`,
  `Марко Брамбилла`,
  `Лана Вачовски`,
  `Лилли Вачовски`,
  `Тим Миллер`
];

const Actors = [
  `Арнольд Шварцнегер`,
  `Сильвестер Сталоне`,
  `Киану Ривз`,
  `Жан Клод Ван Дам`,
  `Халк Хоган`,
  `Дмитри Комаров`
];

const Countries = [
  `США`,
  `Великобритания`,
  `Россия`,
  `Китай`
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

const Emotions = [
  Emoji.SMILE.value,
  Emoji.NEUTRAL.value,
  Emoji.GRINNING.value,
  Emoji.ANGRY.value
];

const RANDOM_LIMIT = 0.5;

const MIN_RANDOM_NUMBER = 0;

const DESCRIPTION = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.`;
const MIN_MOCK_ITEMS_COUNT = 0;
const MAX_MOCK_ITEMS_COUNT = 3;

const MIN_DURATION_COUNT = 40 * 60 * 1000;
const MAX_DURATION_COUNT = 180 * 60 * 1000;

const MIN_COMMENTS_COUNT = 0;
const MAX_COMMENTS_COUNT = 5;

const MIN_YEAR_LIMIT = 1990;
const MAX_YEAR_LIMIT = 2020;

let fimlCardIdCounter = 0;
let commentIdCounter = 0;

const getRandomDate = () => {
  const currentDate = new Date();
  const year = getRandomNumber(MIN_YEAR_LIMIT, MAX_YEAR_LIMIT);
  currentDate.setFullYear(year);

  return currentDate.valueOf();
};

const getRandomNumber = (min, max) => {
  const rand = min - RANDOM_LIMIT + Math.random() * (max - min + 1);
  return Math.abs(Math.round(rand));
};

const getRandomDecimal = (min, max) => {
  return ((max - min) * Math.random()).toFixed(1);
};

const getRandomBoolean = () => {
  return Math.random() > RANDOM_LIMIT;
};

const getRandomItem = (items) => {
  const index = getRandomNumber(MIN_RANDOM_NUMBER, items.length - 1);
  return items[index];
};

const createRandomItems = (items, min, max) => {
  return items.filter(getRandomBoolean).slice(min, max);
};

const createComment = () => {
  const id = commentIdCounter++;

  return {
    id,
    text: createRandomItems(DESCRIPTION.split(`.`), MIN_COMMENTS_COUNT, MAX_COMMENTS_COUNT).join(` `),
    emotion: getRandomItem(Emotions),
    author: getRandomItem(Peoples),
    commentDate: getRandomDate().valueOf(),
  };
};

const createComments = (count) => {
  let comments = [];
  for (let i = 0; i < count; i++) {
    comments.push(createComment());
  }
  return comments;
};

const createfilmCard = () => {

  let isWaitingWatched = getRandomBoolean();
  const isWatched = getRandomBoolean();

  if (isWatched) {
    isWaitingWatched = false;
  }

  const filmCardTitle = getRandomItem(FilmsNames);

  const id = fimlCardIdCounter++;

  return {
    id,
    title: filmCardTitle,
    originalTitle: filmCardTitle,
    rating: getRandomDecimal(MIN_RATING_VALUE, MAX_RATING_VALUE),
    producer: getRandomItem(Peoples),
    writers: createRandomItems(Peoples, MIN_MOCK_ITEMS_COUNT, MAX_MOCK_ITEMS_COUNT),
    actors: createRandomItems(Actors, MIN_MOCK_ITEMS_COUNT, MAX_MOCK_ITEMS_COUNT),
    releaseDate: getRandomDate(),
    duration: getRandomNumber(MIN_DURATION_COUNT, MAX_DURATION_COUNT),
    country: getRandomItem(Countries),
    genres: createRandomItems(Genres, MIN_MOCK_ITEMS_COUNT, MAX_MOCK_ITEMS_COUNT),
    poster: getRandomItem(Posters),
    description: createRandomItems(DESCRIPTION.split(`.`), MIN_MOCK_ITEMS_COUNT, MAX_MOCK_ITEMS_COUNT).join(` `),
    comments: createComments(getRandomNumber(MIN_COMMENTS_COUNT, MAX_COMMENTS_COUNT)),
    isFavorite: getRandomBoolean(),
    isWaitingWatched,
    isWatched,
    age: getRandomNumber(MIN_RATING_VALUE, MAX_RATING_VALUE)
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
