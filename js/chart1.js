const ctx2 = document.getElementById('linechart');

let rgba1 = [
  'rgba(255, 99, 132, 1)',
  'rgba(54,162, 235, 1)',
  'rgba(255,206, 86, 1)',
  'rgba(75,192, 192, 1)',
  'rgba(153,102, 255, 1)',
  'rgba(259,159, 64, 1)']

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
    backgroundColor: rgba1,
    fill: false,
    borderColor: 'rgb(75, 192, 192)',
    tension: 0.2
  }]
};

const config = {
  type: 'bar',
  data: data2,
};

const linechart = new Chart(ctx2, config);
