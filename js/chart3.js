const ctx3 = document.getElementById('ctx3');
import { newDate, newDateString, namedColor, CHART_COLORS, months } from "./Utils.js";

const DATA_COUNT = 7;
const NUMBER_CFG = { count: DATA_COUNT, min: 0, max: 100 };

const labels = months({ count: 7 });
const data = {
  labels: labels,
  datasets: [
    {
      label: '',
      data: [10, 30, 39, 20, 25, 34, -10],
      borderColor: CHART_COLORS.red,
      backgroundColor: CHART_COLORS.red,
    },
    {
      label: '',
      data: [18, 33, 22, 19, 11, 39, 30],
      borderColor: CHART_COLORS.blue,
      backgroundColor: CHART_COLORS.blue,
    }
  ]
};

const config = {
  type: 'line',
  data: data,
  options: {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Ilustração'
      }
    },
    scales: {
      y: {
        suggestedMin: 30,

        suggestedMax: 50,
      }
    }
  },
};

const line = new Chart(ctx3, config);


