const search = document.querySelector('.input-itens input')
const rows = document.querySelectorAll('tbody tr');
console.log(search)

search.addEventListener('input', searchTable);

function searchTable() {
  rows.forEach((row, i) => {
    let tableData = row.textContent.toLocaleLowerCase();
    console.log(tableData)
    let searchData = search.value.toLocaleLowerCase()
    row.classList.toggle('hide', tableData.indexOf(searchData) < 0)
    row.style.setProperty('--delay', i / 25 + 's')
  })

  document.querySelectorAll('tbody tr:not(.hide)').forEach((rowVisible, i) => {
    rowVisible.style.backgroundColor = (i % 2 == 0) ? 'transparent' : '#000000b'
  })
}
