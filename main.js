const btnConfirm = document.getElementById('btnConfirm');
const btnUpdate = document.getElementById('btnUpdate');
const btnDelete = document.getElementById('btnDelete');
const modal = document.querySelector('.modal')
const tbody = document.querySelector('tbody');
const inputs = document.querySelectorAll('.inputs');
const [description, value, category, date] = inputs;
let arrayExpenditure = [];
let arrayRevenue = [];
// let arrayCategorys = [];
let values = []
let allAccounts = {
  categorias: [],
  allCategorys: []
}
let edit = document.querySelectorAll('td span.edit');
let deleteSpan = document.querySelectorAll('td span.delete');
let id = 1;
let targetId;
let trTarget;
let targetPosition;
const getLocalStorage = key => JSON.parse(localStorage.getItem((key)));

const verificLocalStorage = () => {
  let content = JSON.parse(localStorage.getItem('arrayExpenditure'))
  if (content) {
    arrayExpenditure = content.slice();
    id = +(localStorage.getItem('id'))
    values = getLocalStorage('values')
    allAccounts = getLocalStorage('allAccounts')
  }
}
verificLocalStorage()

class Transactions {
  constructor(description, value, category, dateInput, id) {
    this.description = description;
    this.value = value;
    this.category = category;
    this.dateInput = dateInput;
    this.date;
    this.id = id;
  }

  formatDate() {
    const [ano, mes, dia] = this.dateInput.split('-');
    this.date = `${dia}/${mes}/${ano}`;
  }
}

class Revenue extends Transactions {
  constructor(description, value, category, dateInput, date, id) {
    super(description, value, category, dateInput, id);
  }
}

class Expenditure extends Transactions {
  constructor(description, value, category, date, dateInput, id) {
    super(description, value, category, dateInput, id);
  }
}

class Account {
  constructor(category, value) {
    this.category = category;
    this.value = value;
  }
}

function formatDate(dateInput, element) {
  const [ano, mes, dia] = dateInput.split('-');
  element.date = `${dia}/${mes}/${ano}`;
}

function saveLocalStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

function addItem() {
  for (let i = 0; i < inputs.length; i++) {
    if (!!inputs[i].value == false) {
      console.log('Preencha todos os campos')
      return false
    }
  }
  inputs.forEach(item => item.value.trim())
  let newCategory = category.value.charAt(0).toUpperCase() + category.value.slice(1).toLowerCase();
  let newItem = new Expenditure(description.value, +value.value, newCategory, date.value, date.value, id)
  newItem.formatDate()
  arrayExpenditure.push(newItem)
  insertRow(newItem)
  checkAccount(newItem.category, newItem.value)
  id++
  saveLocalStorage('arrayExpenditure', arrayExpenditure)
  saveLocalStorage('id', id)
  inputs.forEach(item => item.value = '');
  return newItem
}
btnConfirm.addEventListener('click', addItem)

const btnOpen = document.querySelector('[data-modal="abrir"]')
const btnClose = document.querySelector('[data-modal="fechar"]')
const containerModal = document.querySelector('[data-modal="container"]')

function openModal(event, className) {
  event.preventDefault();
  containerModal.classList.add('active')
  if (className) {
    modal.classList.add(className)
  }
}

function closeModal(event) {
  event.preventDefault();
  containerModal.classList.remove('active')
  modal.classList.remove('update', 'delete')
  inputs.forEach(item => {
    item.value = ''
    item.disabled = false
  })

}

function clickOutsideModal(event) {
  if (event.target === this)
    closeModal(event)
}

btnOpen.addEventListener('click', openModal)
btnClose.addEventListener('click', closeModal)
containerModal.addEventListener('click', clickOutsideModal)


const del = document.getElementById('delete')
del.addEventListener('click', clear)

function clear() {
  localStorage.clear();
  arrayExpenditure = [];
  id = 1
  tbody.querySelectorAll('tr').forEach(item => item.remove())
}

function createTable() {
  arrayExpenditure.forEach(item => {
    const { description, value, category, dateInput, date, id } = item;
    let props = [description, value, category, date]
    createTr(props, id)
  })
}
createTable()


function insertRow(obj) {
  const { description, value, category, dateInput, date, id } = obj;
  let props = [description, value, category, date]
  createTr(props, id)
}

function createActions() {
  let td = document.createElement('td');
  let span = document.createElement('span')
  let span2 = document.createElement('span')
  td.classList.add('span')
  span.classList.add('edit')
  span2.classList.add('delete')
  span.innerText = 'Editar'
  span2.innerText = 'Apagar'
  td.appendChild(span)
  td.appendChild(span2)
  return td
}

function createTr(props, id) {
  let tr = document.createElement('tr')
  tr.setAttribute('data-id', `${id}`)
  props.forEach(element => {
    let td = document.createElement('td');
    td.innerText = element;
    tr.appendChild(td);
  })
  tr.appendChild(createActions())
  tbody.appendChild(tr)
  edit = tbody.querySelectorAll('td span.edit')
  deleteSpan = tbody.querySelectorAll('td span.delete')
  edit.forEach(item => item.addEventListener('click', updateTd))
  deleteSpan.forEach(item => item.addEventListener('click', deleteTd))
}

function checkAccount(category, value) {
  if (allAccounts.allCategorys.includes(category.toLowerCase())) {
    DeleteOrSubt(category, value)
  } else {
    addAccounts(category, value)
  }
}

function addAccounts(category, value) {
  let newCategory = category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();
  let newItem = new Account(newCategory, value)
  allAccounts.categorias.push(newItem)
  allAccounts.allCategorys.push(category.toLowerCase())
  values.push(newItem.value)
  saveLocalStorage('allAccounts', allAccounts)
  saveLocalStorage('values', values)
}

function findPosition(array, id) {
  for (let i = 0; i < array.length; i++) {
    if (array[i].id === id)
      return i;
  }
  return -1;
}


function getValuesTd(event, i, className) {
  description.value = arrayExpenditure[i].description;
  value.value = arrayExpenditure[i].value
  category.value = arrayExpenditure[i].category
  date.value = arrayExpenditure[i].dateInput
  openModal(event, className)
  targetId = arrayExpenditure[i].id
}

function updateTd(event) {
  let id = +this.parentNode.parentNode.getAttribute('data-id')
  let i = findPosition(arrayExpenditure, id);
  targetPosition = i;
  getValuesTd(event, i, 'update')
}

function updateData() {
  let i = targetPosition
  let categoryA = arrayExpenditure[i].category
  let valueA = arrayExpenditure[i].value
  arrayExpenditure[i].description = description.value;
  arrayExpenditure[i].value = value.value;
  arrayExpenditure[i].category = category.value;
  arrayExpenditure[i].dateInput = date.value;
  formatDate(arrayExpenditure[i].dateInput, arrayExpenditure[i]);
  inputs.forEach(item => item.value = '')
  saveLocalStorage('arrayExpenditure', arrayExpenditure)
  checkAccount(categoryA, valueA)
  checkAccount(arrayExpenditure[i].category, arrayExpenditure[i].value)
  let tr = tbody.querySelectorAll('tr')
  tr.forEach(item => item.remove())
  createTable()
}

btnUpdate.addEventListener('click', () => updateData())

function deleteTd(event) {
  event.preventDefault()
  let id = +this.parentNode.parentNode.getAttribute('data-id')
  trTarget = this.parentNode.parentNode
  targetPosition = findPosition(arrayExpenditure, id)
  inputs.forEach(item => item.disabled = true)
  getValuesTd(event, targetPosition, 'delete')
}

btnDelete.addEventListener('click', () => {
  trTarget.remove()
  let c = arrayExpenditure[targetPosition].category
  let v = arrayExpenditure[targetPosition].value
  DeleteOrSubt(c, v)
  arrayExpenditure.splice(targetPosition, 1)
  saveLocalStorage('arrayExpenditure', arrayExpenditure)
})

function DeleteOrSubt(category, value) {
  let position = allAccounts.allCategorys.indexOf(category.toLowerCase())
  let verific = allAccounts.categorias[position].value - value;
  if (verific <= 0) {
    allAccounts.categorias.splice(position, 1)
    allAccounts.allCategorys.splice(position, 1)
    values.splice(position, 1)
  } else {
    allAccounts.categorias[position].value -= value
    values[position] -= value
  }
  saveLocalStorage('values', values)
  saveLocalStorage('allAccounts', allAccounts)
}

console.log(allAccounts.allCategorys)
console.log(allAccounts.allCategorys.indexOf('saúde'.toLowerCase()))
















