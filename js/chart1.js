const ctx2 = document.getElementById('linechart');

function getMonthLabels(count) {
  const currentDate = new Date();
  const labels = [];
  for (let i = 0; i < count; i++) {
    currentDate.setMonth(currentDate.getMonth() - 1);
    labels.unshift(currentDate.toLocaleString('default', { month: 'long' }));
  }

  return labels;
}
const labels = getMonthLabels(7);
const data2 = {
  labels: labels,
  datasets: [{
    label: '',
    data: [65, 59, 80, 81, 56, 55, 40],
    fill: false,
    borderColor: 'rgb(75, 192, 192)',
    tension: 0.2
  }]
};

const config = {
  type: 'line',
  data: data2,
};

const linechart = new Chart(ctx2, config);
