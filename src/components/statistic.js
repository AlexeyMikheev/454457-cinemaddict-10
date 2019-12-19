import AbstractComponent from './abstract-component.js';
import {Period} from '../const.js';
import Utils from '../utils.js';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

const getStatisticTemplate = (totalFilms, totalDuration, topGenreName) => {
  const durationHours = Utils.getHours(totalDuration);
  const durationMinutes = Utils.getMinutes(totalDuration);
  const formatedRating = Utils.getFormatedRating(totalFilms);

  return `<section class="statistic">
  <p class="statistic__rank">
    Your rank
    <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
    <span class="statistic__rank-label">${formatedRating}</span>
  </p>

  <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
    <p class="statistic__filters-description">Show stats:</p>

    <input type="radio" date-period="${Period.ALL}" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-all-time" value="all-time" checked>
    <label for="statistic-all-time" class="statistic__filters-label">All time</label>

    <input type="radio" date-period="${Period.TODAY}" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-today" value="today">
    <label for="statistic-today" class="statistic__filters-label">Today</label>

    <input type="radio" date-period="${Period.WEEK}" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-week" value="week">
    <label for="statistic-week" class="statistic__filters-label">Week</label>

    <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-month" value="month">
    <label for="statistic-month" date-period="${Period.MONTH}" class="statistic__filters-label">Month</label>

    <input type="radio" date-period="${Period.YEAR}" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-year" value="year">
    <label for="statistic-year" class="statistic__filters-label">Year</label>
  </form>

  <ul class="statistic__text-list">
    <li class="statistic__text-item">
      <h4 class="statistic__item-title">You watched</h4>
      <p class="statistic__item-text">${totalFilms} <span class="statistic__item-description">movies</span></p>
    </li>
    <li class="statistic__text-item">
      <h4 class="statistic__item-title">Total duration</h4>
      <p class="statistic__item-text">${durationHours} <span class="statistic__item-description">h</span> ${durationMinutes} <span class="statistic__item-description">m</span></p>
    </li>
    <li class="statistic__text-item">
      <h4 class="statistic__item-title">Top genre</h4>
      <p class="statistic__item-text">${topGenreName}</p>
    </li>
  </ul>

  <div class="statistic__chart-wrap">
    <canvas class="statistic__chart" width="1000"></canvas>
  </div>

</section>`;
};

export default class Statistic extends AbstractComponent {
  constructor(films) {
    super();
    this._films = films;
    this._totalWatchedFilms = 0;
    this._totalDurationFilms = 0;
    this._topGenreName = `-`;
    this._genres = new Map();
    this._genresLabels = [];
    this._genresValues = [];
    this._genresColors = [];
    this._statisticChart = null;
    this._updateStatistics();
  }

  getTemplate() {
    return getStatisticTemplate(this._totalWatchedFilms.length, this._totalDurationFilms, this._topGenreName);
  }

  _updateStatistics() {
    this._totalWatchedFilms = this._films.getWathedFilmsByPeriod(Period.ALL);

    this._totalDurationFilms = this._totalWatchedFilms.reduce((total, film) => {
      total += film.duration;
      return total;
    }, 0);

    const filmsGenres = this._totalWatchedFilms.reduce((allGenres, film) => {
      allGenres.push(...film.genres);
      return allGenres;
    }, []);

    const distinctionGenres = new Set(filmsGenres);

    let genres = new Map();

    distinctionGenres.forEach((genre) => {
      genres.set(genre, 0);
    });

    filmsGenres.forEach((filmGenre) => {
      let genreValue = genres.get(filmGenre);
      if (genreValue === null) {
        genres.set(filmGenre, 0);
      } else {
        genres.set(filmGenre, ++genreValue);
      }
    });

    this._genres = new Map([...genres.entries()].sort((a, b) => b[1] - a[1]));

    let maxGenreValue = 0;
    Array.from(this._genres.entries()).forEach((genre) => {
      const genreLabel = genre[0];
      const genreValue = genre[1];
      this._genresLabels.push(`${genreLabel}      ${genreValue}      `);
      this._genresValues.push(genreValue);
      this._genresColors.push(`#FBE44D`);
      if (genreValue > maxGenreValue) {
        maxGenreValue = genreValue;
        this._topGenreName = genreLabel;
      }
    });
  }

  renderChart() {

    const minXLimit = 0;
    const maxXLimit = Math.max(...this._genresValues);

    const statisticCharContext = this._element.querySelector(`.statistic__chart`).getContext(`2d`);

    const chartData = {
      labels: this._genresLabels,
      datasets: [{
        data: this._genresValues,
        backgroundColor: this._genresColors,
        datalabels: {
          color: `black`
        }
      }]
    };

    this._statisticChart = new Chart(statisticCharContext, {
      type: `horizontalBar`,
      data: chartData,
      responsive: true,
      showTooltips: false,
      plugins: [ChartDataLabels],
      options: {
        scales: {
          xAxes: [{
            display: false,
            ticks: {
              suggestedMin: minXLimit,
              suggestedMax: maxXLimit
            }
          }],
          yAxes: [{
            gridLines: {
              display: false,
              drawBorder: false,
            }
          }]
        },
        legend: {
          display: false
        }
      }
    });
  }
}
