import { Revenue, Expenditure } from "./js/Classes.js"

const btnConfirm = document.getElementById('btnConfirm');
const btnUpdate = document.getElementById('btnUpdate');
const btnDelete = document.getElementById('btnDelete');
const modal = document.querySelector('.modal')
const tbody = document.querySelector('tbody');
const inputs = Array.from(document.querySelectorAll('.inputs'));
const [description, value, category, date] = inputs;
const alert = document.querySelector('.alert')
const expenditure = document.getElementById('expenditure')
const revenue = document.getElementById('revenue')
const btnOpen = document.querySelector('[data-modal="abrir"]')
const btnClose = document.querySelector('[data-modal="fechar"]')
const containerModal = document.querySelector('[data-modal="container"]')
let arrayExpenditure = [];
let arrayRevenue = [];
let values = []
let valueTotal = 0;
let allExpenseRecords = {
  categorys: [],
  allCategorys: [],
  values: [],
  valueTotal: 0
}
const getValuesAll = values => values.reduce((acc, value) => acc + value, 0)

let allRevenueRecords = {
  categorys: [],
  allCategorys: [],
  values: [],
  valueTotal: 0,
  getValues: function () {
    this.valueTotal = this.values.map((acc, value) => acc + value, 0)
  }
}
let trs = Array.from(document.querySelectorAll('tbody tr'))
let edit = document.querySelectorAll('td span.edit');
let deleteSpan = document.querySelectorAll('td span.delete');
let iDelete = document.querySelectorAll('span.delete i.fa-trash')
let id = 1;
let idR = 1;
let targetId;
let trTarget;
let targetPosition;
const getLocalStorage = key => JSON.parse(localStorage.getItem((key)));
let liSelected;

const liInput = document.querySelectorAll('#typeInput li');
liInput.forEach(item => {
  item.addEventListener('click', (event) => {
    liInput.forEach(li => li.classList.remove('selected'))
    event.target.classList.add('selected')
    alertText('')
  })
})

const verificLocalStorage = () => {
  let content = getLocalStorage('arrayExpenditure')
  if (content) {
    arrayExpenditure = content.slice();
    id = +(localStorage.getItem('id'))
    allExpenseRecords = getLocalStorage('allExpenseRecords')
    allExpenseRecords.valueTotal = getValuesAll(allExpenseRecords.values)
    console.log(allExpenseRecords.categorys[0])
    expenditure.innerText = `R$ ${allExpenseRecords.valueTotal}`
  }
  content = getLocalStorage('arrayRevenue')
  if (content) {
    arrayRevenue = content.slice();
    idR = +(localStorage.getItem('idR'))
    allRevenueRecords = getLocalStorage('allExpenseRecords')
    allRevenueRecords.valueTotal = getValuesAll(allRevenueRecords.values)
    revenue.innerText = `R$ ${valueTotal}`
  }
}
verificLocalStorage()



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
  alertText('')
  inputs.forEach(item => {
    item.value = ''
    item.disabled = false
  })
  liInput.forEach(li => li.classList.remove('selected'))
}

function clickOutsideModal(event) {
  if (event.target === this)
    closeModal(event)
}

btnOpen.addEventListener('click', openModal)
btnClose.addEventListener('click', closeModal)
containerModal.addEventListener('click', clickOutsideModal)




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

let alertText = text => alert.innerText = text

function checkFields() {
  let verific = false
  liInput.forEach(item => {
    if (item.classList.contains('selected')) {
      liSelected = item.classList[0]
      verific = true
    }
  })
  if (verific === false) {
    alertText('Selecione o tipo do registro.')
    return false
  }
  for (let i = 0; i < inputs.length; i++) {
    if (!!inputs[i].value == false) {
      alertText('Preencha todos os campos')
      return false
    }
  }
  alertText('')
  inputs.forEach(item => item.value.trim())
  return true
}

function instantiateClass(text, Class, id) {
  let inputValue = inputs.map(item => item.value)
  inputValue[2] = text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  let newItem = new Class(inputValue[0], +inputValue[1], inputValue[2], inputValue[3], inputValue[3], id)
  newItem.formatDate()
  return newItem
}

function addItemExpenditure() {
  if (!checkFields()) {
    return false
  }
  let newItem = instantiateClass(category.value, Expenditure, id)
  arrayExpenditure.push(newItem)
  createTr(newItem)
  checkNewAccount(allExpenseRecords, 'allExpenseRecords', newItem.category, newItem.value)
  id++
  saveLocalStorage('arrayExpenditure', arrayExpenditure)
  saveLocalStorage('id', id)
  inputs.forEach(item => item.value = '');
  return newItem
}

function addItemRevenue() {
  if (!checkFields()) {
    return false
  }
  let newItem = instantiateClass(category.value, Revenue, idR)
  arrayRevenue.push(newItem)
  createTr(newItem)
  checkNewAccount(allRevenueRecords, 'allRevenenueRecords', newItem.category, newItem.value)
  saveLocalStorage('arrayRevenue', arrayRevenue)
  saveLocalStorage('idR', idR)
  inputs.forEach(item => item.value = '');
  return newItem
}

btnConfirm.addEventListener('click', () => {
  if (checkFields()) {
    if (liSelected === 'expenditure')
      addItemExpenditure()
    else
      addItemRevenue()
  }
})

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
    insertRow(props, id)
  })
}
createTable()

function createTr(obj) {
  const { description, value, category, dateInput, date, id } = obj;
  let props = [description, value, category, date]
  insertRow(props, id)
}

function createElement(tag, ...arrayClassName) {
  let newElement = document.createElement(tag);
  arrayClassName.forEach(item => newElement.classList.add(item))
  return newElement
}

function createActions() {
  let td = createElement('td');
  let span = createElement('span', 'edit')
  let span2 = createElement('span', 'delete')
  let iEdit = createElement('i', 'fa-solid', 'fa-pen-to-square', 'fa-xl')
  let iDel = createElement('i', 'fa-solid', 'fa-trash', 'fa-xl')
  span.appendChild(iEdit)
  span2.appendChild(iDel)
  td.appendChild(span)
  td.appendChild(span2)
  return td
}

function insertRow(props, id) {
  let tr = document.createElement('tr')
  tr.setAttribute('data-id', `${id}`)
  props.forEach(element => {
    let td = document.createElement('td');
    td.innerText = element;
    tr.appendChild(td);
  })
  tr.appendChild(createActions())
  tbody.appendChild(tr)
  trs = Array.from(document.querySelectorAll('tbody tr'))
  edit = tbody.querySelectorAll('td span.edit')
  deleteSpan = tbody.querySelectorAll('td span.delete')
  iDelete = document.querySelectorAll('span.delete i.fa-trash')
  edit.forEach(item => item.addEventListener('click', updateTd))
  deleteSpan.forEach(item => item.addEventListener('click', deleteTd))
}

function checkAccount(array, arrayString, category, value) {
  if (array.allCategorys.includes(category.toLowerCase())) {
    DeleteOrSubt(category, value)
  } else {
    addAccounts(array, arrayString, category, value)
  }
}

function checkNewAccount(array, arrayString, category, value) {
  if (array.allCategorys.includes(category.toLowerCase()))
    addValue(array, arrayString, category, value)
  else
    addAccounts(array, arrayString, category, value)

}

function addValue(array, arrayString, category, value) {
  let position = array.allCategorys.indexOf(category.toLowerCase())
  console.log(position)
  if (position !== -1) {
    array.categorys[position].value += value;
    array.values[position] += value;
    array.valueTotal = getValuesAll(array.values)
    console.log(array)
    saveLocalStorage(arrayString, array)
  }
}

function addAccounts(array, arrayString, category, value) {
  let newAccount = new Account(category, value)
  array.categorys.push(newAccount)
  array.allCategorys.push(category.toLowerCase())
  array.values.push(newAccount.value)
  array.valueTotal = getValuesAll(array.values)
  saveLocalStorage(arrayString, array)
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
  if (!checkFields()) {
    return false
  }
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
  let position = allExpenseRecords.allCategorys.indexOf(category.toLowerCase())
  let verific = allExpenseRecords.categorys[position].value - value;
  if (verific <= 0) {
    allExpenseRecords.categorys.splice(position, 1)
    allExpenseRecords.allCategorys.splice(position, 1)
    values.splice(position, 1)
  } else {
    allExpenseRecords.categorys[position].value -= value
    values[position] -= value
  }
  saveLocalStorage('values', values)
  saveLocalStorage('allExpenseRecords', allExpenseRecords)
}






