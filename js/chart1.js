const ctx2 = document.getElementById('linechart');

let rgba = [
  'rgba(255, 99, 132, 0.6)',
  'rgba(54,162, 235, 0.6)',
  'rgba(255,206, 86, 0.6)',
  'rgba(75,192, 192, 0.6)',
  'rgba(153,102, 255, 0.6)',
  'rgba(259,159, 64, 0.6)']


let rgba1 = [
  'rgba(75,192, 192, 1)',
  '#ffd41f',
  '#80b3ff',
  'rgba(153,102, 255, 1)',
  '#d6496c']

let rgba2
let labelsX = [];
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
    label: labelsX,
    data: valores,
    backgroundColor: rgba2,
    fill: false,
    borderColor: 'rgb(75, 192, 192)',
    tension: 0.2
  }]
};

const config = {
  type: 'bar',
  data: data,
};

let linechart = new Chart(ctx2, config);
const buttons = document.querySelectorAll('button');
buttons.forEach(item => {
  item.addEventListener('click', () => {
    att()
    linechart.data.labels = labelsX;
    linechart.data.datasets[0].data = valores;
    linechart.data.datasets[0].backgroundColor = rgba2;
    linechart.update();
  })
})

rgba2 = document.body.classList.contains('dark') ? rgba : rgba1;
linechart.data.datasets[0].backgroundColor = rgba2;
linechart.update()





const btnDark = document.getElementById('darkmode')
btnDark.addEventListener('click', () => {
  rgba2 = document.body.classList.contains('dark') ? rgba : rgba1;
  console.log(rgba2)
  att()

})