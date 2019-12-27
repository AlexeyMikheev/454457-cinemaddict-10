import AbstractComponent from './abstract-component.js';
import {Period} from '../const.js';
import Utils from '../utils.js';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

const getStatisticHeaderTemplate = (totalFilms, totalDuration, topGenreName) => {
  const durationHours = Utils.getHours(totalDuration);
  const durationMinutes = Utils.getMinutes(totalDuration);

  return `<ul class="statistic__text-list">
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
  </ul>`;
};

const getStatisticTemplate = (totalFilms) => {

  const formatedRating = Utils.getFormatedRating(totalFilms);

  return `<section class="statistic">
  <p class="statistic__rank">
    Your rank
    <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
    <span class="statistic__rank-label">${formatedRating}</span>
  </p>

  <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
    <p class="statistic__filters-description">Show stats:</p>

    <input type="radio" data-period="${Period.ALL}" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-all-time" value="all-time" checked>
    <label for="statistic-all-time" class="statistic__filters-label">All time</label>

    <input type="radio" data-period="${Period.TODAY}" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-today" value="today">
    <label for="statistic-today" class="statistic__filters-label">Today</label>

    <input type="radio" data-period="${Period.WEEK}" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-week" value="week">
    <label for="statistic-week" class="statistic__filters-label">Week</label>

    <input type="radio" data-period="${Period.MONTH}" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-month" value="month">
    <label for="statistic-month" class="statistic__filters-label">Month</label>

    <input type="radio" data-period="${Period.YEAR}" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-year" value="year">
    <label for="statistic-year" class="statistic__filters-label">Year</label>
  </form>

  <ul class="statistic__text-list"></ul>

  <div class="statistic__chart-wrap">
    <canvas class="statistic__chart" width="1000"></canvas>
  </div>

</section>`;
};

export default class Statistic extends AbstractComponent {
  constructor(films) {
    super();
    this._films = films;
    this._selectedPeriod = Period.ALL;
    this._totalWatchedFilms = 0;
    this._totalDurationFilms = 0;
    this._topGenreName = `-`;
    this._genres = new Map();
    this._genresLabels = [];
    this._genresValues = [];
    this._genresColors = [];
    this._statisticChart = null;
    this._statisticHeaderElement = null;

    this._onStatisticFiltersContainerChangeCb = (evt) => {
      this._selectedPeriod = parseInt(evt.target.dataset[`period`], 10);

      this._update();
    };
  }

  getTemplate() {
    return getStatisticTemplate(this._totalWatchedFilms, this._totalDurationFilms, this._topGenreName);
  }

  show() {
    super.show();

    this._update();
  }

  addFiltesChangeEvents() {
    this._element.querySelector(`.statistic__filters`).addEventListener(`change`, this._onStatisticFiltersContainerChangeCb);
  }

  _update() {
    this._updateStatistics();
    this._updateStatisticHeader();
    this._renderChart();
  }

  _updateStatisticHeader() {
    const statisticHeaderElement = Utils.createElement(getStatisticHeaderTemplate(this._totalWatchedFilms, this._totalDurationFilms, this._topGenreName));

    const oldStatisticHeaderElement = this._statisticHeaderElement !== null ? this._statisticHeaderElement : this._element.querySelector(`.statistic__text-list`);

    this._element.replaceChild(statisticHeaderElement, oldStatisticHeaderElement);
  }

  _renderChart() {
    this._destroyChart();

    const MIN_X_LIMIT = 0;

    const LABEL_FONT_SIZE = 20;
    const LABEL_COLOR = `#FFF`;
    const LABEL_PADDING = 100;
    const LABEL_OFFSET = 50;
    const LABEL_ALIGNT = `left`;
    const LABEL_ANCHOR = `start`;

    const BAR_HEIGHT = 50;

    const maxXLimit = Math.max(...this._genresValues);

    const chartData = {
      labels: this._genresLabels,
      datasets: [{
        data: this._genresValues,
        backgroundColor: this._genresColors,

      }]
    };

    const chartOptions = {
      plugins: {
        datalabels: {
          color: LABEL_COLOR,
          fontSize: LABEL_FONT_SIZE,
          anchor: LABEL_ANCHOR,
          align: LABEL_ALIGNT,
          offset: LABEL_OFFSET,
        }
      },
      scales: {
        xAxes: [{
          display: false,
          ticks: {
            suggestedMin: MIN_X_LIMIT,
            suggestedMax: maxXLimit
          }
        }],
        yAxes: [{
          gridLines: {
            display: false,
            drawBorder: false,
          },
          ticks: {
            fontColor: LABEL_COLOR,
            fontSize: LABEL_FONT_SIZE,
            padding: LABEL_PADDING,
          }
        }]
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false
      },
    };

    const statisticCharContextCanvas = this._element.querySelector(`.statistic__chart`);

    statisticCharContextCanvas.height = BAR_HEIGHT * this._genresLabels.length;

    const statisticCharContext = statisticCharContextCanvas.getContext(`2d`);

    this._statisticChart = new Chart(statisticCharContext, {
      type: `horizontalBar`,
      data: chartData,
      responsive: true,
      maintainAspectRatio: false,
      showTooltips: false,
      plugins: [ChartDataLabels],
      options: chartOptions
    });
  }

  _updateStatistics() {
    this._genresLabels = [];
    this._genresValues = [];
    this._genresColors = [];
    this._topGenreName = `-`;

    const totalWatchedFilms = this._films.getWathedFilmsByPeriod(this._selectedPeriod);

    this._totalWatchedFilms = totalWatchedFilms.length;

    this._totalDurationFilms = totalWatchedFilms.reduce((total, film) => {
      total += film.duration;
      return total;
    }, 0);

    const filmsGenres = totalWatchedFilms.reduce((allGenres, film) => {
      allGenres.push(...film.genres);
      return allGenres;
    }, []);

    const distinctionGenres = new Set(filmsGenres);

    const genres = new Map();

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

    const GENRE_COLOR = `#FBE44D`;

    let maxGenreValue = 0;
    Array.from(this._genres.entries()).forEach((genre) => {
      const genreLabel = genre[0];
      const genreValue = genre[1];
      this._genresLabels.push(`${genreLabel}`);
      this._genresValues.push(genreValue);
      this._genresColors.push(GENRE_COLOR);
      if (genreValue > maxGenreValue) {
        maxGenreValue = genreValue;
        this._topGenreName = genreLabel;
      }
    });
  }

  _destroy() {
    if (this._statisticFiltersContainer !== null) {
      this._statisticFiltersContainer.removeEventListener(this._onStatisticFiltersContainerChangeCb);
    }
  }

  _destroyChart() {
    if (this._statisticChart !== null) {
      this._statisticChart.destroy();
      this._statisticChart = null;
    }
  }
}
