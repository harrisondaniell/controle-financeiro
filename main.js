const btnConfirm = document.getElementById('btnConfirm');
const btnUpdate = document.getElementById('btnUpdate');
const btnDelete = document.getElementById('btnDelete');
const modal = document.querySelector('.modal')
const tbody = document.querySelector('tbody');
const inputs = document.querySelectorAll('.inputs');
const [description, value, category, date] = inputs;
let arrayRevenue = [];
let arrayExpenditure = [];
let arrayCategorys = [];
let values = []
let allAccounts = {
  categorias: [],
  allCategorys: []
}
let edit = document.querySelectorAll('td span.edit');
let deleteSpan = document.querySelectorAll('td span.delete');
let id = 1;
let targetId;
let indexTargetElement;
let targetPosition;
const getLocalStorage = key => JSON.parse(localStorage.getItem((key)));

const verificLocalStorage = () => {
  let content = JSON.parse(localStorage.getItem('arrayRevenue'))
  if (content) {
    arrayRevenue = content.slice();
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
    super(description, value, category, date, id);
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
  let newCategory = category.value.toLowerCase();
  newCategory = newCategory.replace(newCategory[0], newCategory[0].toUpperCase());
  let newItem = new Revenue(description.value, +value.value, newCategory, date.value, date.value, id)
  newItem.formatDate()
  arrayRevenue.push(newItem)
  insertRow(newItem)
  checkAccount(newItem.category, newItem.value)
  id++
  saveLocalStorage('arrayRevenue', arrayRevenue)
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
  arrayRevenue = [];
  id = 1
  tbody.querySelectorAll('tr').forEach(item => item.remove())
}

function createTable() {
  arrayRevenue.forEach(item => {
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
  edit.forEach(item => item.addEventListener('click', upadteTd))
  deleteSpan.forEach(item => item.addEventListener('click', deleteTd))
}

function checkAccount(category, value, subt = 0) {
  if (allAccounts.allCategorys.includes(category.toLowerCase())) {
    let position = allAccounts.allCategorys.indexOf(category.toLowerCase())
    allAccounts.categorias[position].value += value - subt;
    saveLocalStorage('allAccounts', allAccounts)
    values = allAccounts.categorias.map(item => item.value).slice()
    saveLocalStorage('values', values)
  } else {
    addAccounts(category, value)
  }
}

function addAccounts(category, value) {
  let newCategory = category.toLowerCase()
  newCategory = newCategory.replace(newCategory[0], newCategory[0].toUpperCase())
  let newItem = new Account(newCategory, value)
  allAccounts.categorias.push(newItem)
  allAccounts.allCategorys.push(category.toLowerCase())
  saveLocalStorage('allAccounts', allAccounts)
  values.push(newItem.value)
  saveLocalStorage('values', values)
}

function upadteTd(event) {
  let id = +this.parentNode.parentNode.getAttribute('data-id')
  let tam = arrayRevenue.length
  for (let i = 0; i < tam; i++) {
    if (arrayRevenue[i].id === id) {
      description.value = arrayRevenue[i].description;
      value.value = arrayRevenue[i].value
      category.value = arrayRevenue[i].category
      date.value = arrayRevenue[i].dateInput
      openModal(event, 'update')
      targetId = arrayRevenue[i].id
      break
    }
  }
}

function getValuesTd(event, i, className) {
  description.value = arrayRevenue[i].description;
  value.value = arrayRevenue[i].value
  category.value = arrayRevenue[i].category
  date.value = arrayRevenue[i].dateInput
  openModal(event, className)
  targetId = arrayRevenue[i].id
}


function deleteTd(event) {
  event.preventDefault()
  let id = +this.parentNode.parentNode.getAttribute('data-id')
  indexTargetElement = this.parentNode.parentNode
  targetPosition = encontrarPosicao(arrayRevenue, id)
  inputs.forEach(item => item.disabled = true)
  getValuesTd(event, targetPosition, 'delete')
}


function encontrarPosicao(array, id) {
  for (let i = 0; i < array.length; i++) {
    if (array[i].id === id)
      return i;
  }
  return -1;
}

function updateData() {
  for (let i = 0; i < arrayRevenue.length; i++) {
    if (arrayRevenue[i].id == targetId) {
      let subt = arrayRevenue[i].value
      arrayRevenue[i].description = description.value;
      arrayRevenue[i].value = value.value;
      arrayRevenue[i].category = category.value;
      arrayRevenue[i].dateInput = date.value;
      formatDate(arrayRevenue[i].dateInput, arrayRevenue[i]);
      inputs.forEach(item => item.value = '')
      saveLocalStorage('arrayRevenue', arrayRevenue)
      checkAccount(arrayRevenue[i].category, arrayRevenue[i].value, subt)
      let tr = tbody.querySelectorAll('tr')
      tr.forEach(item => item.remove())
      createTable()
      break
    }
  }
}

btnUpdate.addEventListener('click', () => updateData())

btnDelete.addEventListener('click', () => {
  indexTargetElement.remove()
  arrayRevenue.splice(targetPosition, 1)
  saveLocalStorage('arrayRevenue', arrayRevenue)
})












