const ctx2 = document.getElementById('linechart');

let rgba = [
  'rgba(255, 99, 132, 0.4)',
  'rgba(54,162, 235, 0.4)',
  'rgba(255,206, 86, 0.4)',
  'rgba(75,192, 192, 0.4)',
  'rgba(153,102, 255, 0.4)',
  'rgba(259,159, 64, 0.4)']


let rgba1 = [
  'rgba(75,192, 192, 1)',
  '#ffd41f',
  '#80b3ff',
  'rgba(153,102, 255, 1)',
  '#d6496c']

let rgba2
let labelsX = ['valo1', 'valor2', 'valor3', 'valor4'];
let valores = [25, 25, 25, 25];

function att() {
  if (JSON.parse(localStorage.getItem('allRevenueRecords'))) {
    const transitor = JSON.parse(localStorage.getItem('allRevenueRecords'));
    labelsX = transitor.allCategorys;
    valores = transitor.values;
  }
  rgba2 = document.body.classList.contains('dark') ? rgba : rgba1;
}

att();

const data = {
  labels: labelsX,
  datasets: [{
    label: '',
    data: valores,
    backgroundColor: rgba2,
    fill: false,
    borderColor: '#331d4a',
    tension: 0.2
  }]
};

const config = {
  type: 'bar',
  data: data,
};

let linechart = new Chart(ctx2, config);
const buttons = document.querySelectorAll('.buttons, .btnDark');
buttons.forEach(item => {
  item.addEventListener('click', () => {
    att()
    linechart.data.labels = labelsX;
    linechart.data.datasets[0].data = valores;
    rgba2 = document.body.classList.contains('dark') ? rgba1 : rgba;

    linechart.data.datasets[0].backgroundColor = rgba2;
    linechart.update();
  })
})

linechart.data.datasets[0].backgroundColor = rgba2;
linechart.update()





