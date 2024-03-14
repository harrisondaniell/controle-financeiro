const ctx1 = document.getElementById('doughnut-chart');

let rgba = [
  'rgba(255, 99, 132, 0.2)',
  'rgba(54,162, 235, 0.2)',
  'rgba(255,206, 86, 0.2)',
  'rgba(75,192, 192, 0.2)',
  'rgba(153,102, 255, 0.2)',
  'rgba(259,159, 64, 0.2)']

let rgba1 = [
  '#80b3ff',
  '#ffd41f',
  'rgba(75,192, 192, 1)',
  'rgba(153,102, 255, 1)',
  '#d6496c']

let rgba2;

let transitor;
let labelsX = []
let valores = [25, 25, 25, 25]
function att() {
  if (JSON.parse(localStorage.getItem('allExpenseRecords'))) {
    transitor = JSON.parse(localStorage.getItem(('allExpenseRecords')))
    labelsX = transitor.allCategorys
    valores = transitor.values
  }
  rgba2 = document.body.classList.contains('dark') ? rgba : rgba1;
}
att()

const data = {
  labels: labelsX,
  datasets: [{
    // label: labelsX,
    data: valores,
    backgroundColor: rgba2,
    borderColor: rgba,
    // borderWidth: 20,
    hoverOffset: 10
  }]
};

let teste = {
  type: 'doughnut',
  data: data,
}

const buttons = document.querySelectorAll('.buttons');
let doughnut = new Chart(ctx1, teste);
buttons.forEach(item => item.addEventListener('click', () => {
  att()
  doughnut.data.labels = labelsX;
  doughnut.data.datasets[0].data = valores;
  doughnut.data.datasets[0].backgroundColor = rgba2;
  doughnut.update();
})
)
