import { Revenue, Expenditure, Account } from "./Classes.js"
import initFilter from "./filter.js";
import initSideBar from "./sidebar.js";
import { handleTheme } from "./darkmode.js";

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
const btnOpen = document.querySelectorAll('[data-modal="abrir"]')
const btnClose = document.querySelector('[data-modal="fechar"]')
const containerModal = document.querySelector('[data-modal="container"]')
const getValuesAll = values => values.reduce((acc, value) => acc + value, 0)
const balance = document.getElementById('balance')
let arrayExpenditure = [];
let arrayRevenue = [];
let allExpenseRecords = {
  categorys: [],
  allCategorys: [],
  values: [],
  valueTotal: 0
}
let allRevenueRecords = {
  categorys: [],
  allCategorys: [],
  values: [],
  valueTotal: 0
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
let typeTarget;
const getLocalStorage = key => JSON.parse(localStorage.getItem((key)));
const saveLocalStorage = (key, value) => localStorage.setItem(key, JSON.stringify(value))
const alertText = text => alert.innerText = text
let liSelected;
const liInput = document.querySelectorAll('#typeInput li');

function classesLi(event) {
  liInput.forEach(li => li.classList.remove('selected'))
  event.target.classList.add('selected')
  alertText('')
}
const addEventLi = () => liInput.forEach(item => item.addEventListener('click', classesLi))
addEventLi()
const verificLocalStorage = () => {
  let content = getLocalStorage('arrayExpenditure')
  let saldo = 0;
  if (content) {
    arrayExpenditure = content.slice();
    id = +(localStorage.getItem('id'))
    allExpenseRecords = getLocalStorage('allExpenseRecords')
    allExpenseRecords.valueTotal = +getValuesAll(allExpenseRecords.values)
    expenditure.innerText = `R$ ${allExpenseRecords.valueTotal}`
    saldo -= allExpenseRecords.valueTotal
  }
  content = getLocalStorage('arrayRevenue')
  if (content) {
    arrayRevenue = content.slice();
    idR = +(localStorage.getItem('idR'))
    allRevenueRecords = getLocalStorage('allRevenueRecords')
    if (allRevenueRecords && allRevenueRecords.values) {
      allRevenueRecords.valueTotal = +getValuesAll(allRevenueRecords.values)
      revenue.innerText = `R$ ${allRevenueRecords.valueTotal}`
      saldo += allRevenueRecords.valueTotal
    }
  }
  balance.textContent = `R$ ${saldo}`
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
  addEventLi()
}

function clickOutsideModal(event) {
  if (event.target === this)
    closeModal(event)
}

btnOpen.forEach(btn => btn.addEventListener('click', openModal))
btnClose.addEventListener('click', closeModal)
containerModal.addEventListener('click', clickOutsideModal)


function formatDate(dateInput, element) {
  const [ano, mes, dia] = dateInput.split('-');
  element.date = `${dia}/${mes}/${ano}`;
}



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
  let newItem = new Class(inputValue[0], +inputValue[1], inputValue[2], inputValue[3], inputValue[3], id, liSelected)
  newItem.formatDate()
  return newItem
}

function addItemExpenditure() {
  if (!checkFields())
    return false
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
  checkNewAccount(allRevenueRecords, 'allRevenueRecords', newItem.category, newItem.value)
  idR++
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
    addEventLi()
  }
})

const del = document.getElementById('delete')
del.addEventListener('click', clear)

function clear() {
  localStorage.clear();
  id = 1
  idR = 1
  tbody.querySelectorAll('tr').forEach(item => item.remove())
}

function createTable() {
  let fullArray = arrayExpenditure.concat(arrayRevenue)

  fullArray.forEach(item => {
    const { description, value, category, dateInput, date, id, type } = item;
    let props = [type, description, value, category, date]
    insertRow(props, id)
  })

}
createTable()

function createTr(obj) {
  const { description, value, category, dateInput, date, id, type } = obj;
  let props = [type, description, value, category, date]
  insertRow(props, id)
}

function createElement(tag, ...arrayClassName) {
  let newElement = document.createElement(tag);
  arrayClassName.forEach(item => newElement.classList.add(item))
  return newElement
}

function createActions() {
  let td = createElement('td', 'spans');
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
  tr.setAttribute('value', `${props[0]}`)
  props.forEach((element, index) => {
    let td = document.createElement('td');
    td.innerText = element;
    if (index === 0) {
      td.classList.add(element)
      td.innerText = '';
    }
    tr.appendChild(td);
  })
  tr.appendChild(createActions())
  tbody.appendChild(tr)
  trs = Array.from(document.querySelectorAll('tbody tr'))
  let type = document.querySelector('tbody tr td')

  edit = tbody.querySelectorAll('td span.edit')
  deleteSpan = tbody.querySelectorAll('td span.delete')
  iDelete = document.querySelectorAll('span.delete i.fa-trash')
  edit.forEach(item => item.addEventListener('click', updateTd))
  deleteSpan.forEach(item => item.addEventListener('click', deleteTd))
}

function checkAccount(array, arrayString, category, value) {
  if (array.allCategorys.includes(category.toLowerCase())) {
    DeleteOrSubt(array, arrayString, category, value)
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
  if (position !== -1) {
    array.categorys[position].value += value;
    array.values[position] += value;
    array.valueTotal = getValuesAll(array.values)
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

function getValuesTd(array, event, i, className) {
  description.value = array[i].description;
  value.value = array[i].value
  category.value = array[i].category
  date.value = array[i].dateInput
  targetId = array[i].id
  liInput.forEach(item => {
    item.classList.contains(array[i].type) ? item.classList.add('selected') : ''
    item.removeEventListener('click', classesLi)
  })
  openModal(event, className)
}

function updateTd(event) {
  let id = +this.parentNode.parentNode.getAttribute('data-id')
  let type = this.parentNode.parentNode.getAttribute('value')
  let i;
  if (type === 'expenditure') {
    i = findPosition(arrayExpenditure, id);
    getValuesTd(arrayExpenditure, event, i, 'update')
  } else {
    i = findPosition(arrayRevenue, id);
    getValuesTd(arrayRevenue, event, i, 'update')
  }
  typeTarget = type
  targetPosition = i;
}

function updateData(array, arrayString, subArray, subArrayString) {
  if (!checkFields())
    return false
  let i = targetPosition
  let categoryA = array[i].category
  let valueA = array[i].value
  array[i].description = description.value;
  array[i].value = +value.value;
  array[i].category = category.value;
  array[i].dateInput = date.value;
  formatDate(array[i].dateInput, array[i]);
  inputs.forEach(item => item.value = '')
  saveLocalStorage(arrayString, array)
  checkAccount(subArray, subArrayString, categoryA, valueA)
  checkAccount(subArray, subArrayString, array[i].category, array[i].value)
  let tr = tbody.querySelectorAll('tr')
  tr.forEach(item => item.remove())
  createTable()
}

btnUpdate.addEventListener('click', () => {
  if (typeTarget === 'expenditure')
    updateData(arrayExpenditure, 'arrayExpenditure', allExpenseRecords, 'allExpenseRecords')
  else
    updateData(arrayRevenue, 'arrayRevenue', allRevenueRecords, 'allRevenueRecords')

})

function deleteTd(event) {
  event.preventDefault()
  let id = +this.parentNode.parentNode.getAttribute('data-id')
  trTarget = this.parentNode.parentNode
  typeTarget = this.parentNode.parentNode.getAttribute('value');
  if (typeTarget === 'expenditure') {
    targetPosition = findPosition(arrayExpenditure, id)
    inputs.forEach(item => item.disabled = true)
    getValuesTd(arrayExpenditure, event, targetPosition, 'delete')
  } else {
    targetPosition = findPosition(arrayRevenue, id)
    inputs.forEach(item => item.disabled = true)
    getValuesTd(arrayRevenue, event, targetPosition, 'delete')
  }
}

function finishDelete(position, array, arrayString, subArray, subArrayString) {
  let c, v;
  c = array[position].category
  v = array[position].value
  DeleteOrSubt(subArray, subArrayString, c, v)
  array.splice(position, 1)
  saveLocalStorage(arrayString, array)
}
btnDelete.addEventListener('click', () => {
  trTarget.remove()
  let c, v;
  if (typeTarget === 'expenditure') {
    c = arrayExpenditure[targetPosition].category
    v = arrayExpenditure[targetPosition].value
    DeleteOrSubt(allExpenseRecords, 'allExpenseRecords', c, v)
    arrayExpenditure.splice(targetPosition, 1)
    saveLocalStorage('arrayExpenditure', arrayExpenditure)
  }
  else {
    c = arrayRevenue[targetPosition].category
    v = arrayRevenue[targetPosition].value
    DeleteOrSubt(allRevenueRecords, 'allRevenueRecords', c, v)
    arrayRevenue.splice(targetPosition, 1)
    saveLocalStorage('arrayRevenue', arrayRevenue)
  }
})

function DeleteOrSubt(array, arrayString, category, value) {
  let position = array.allCategorys.indexOf(category.toLowerCase())
  let verific = array.categorys[position].value - value;
  if (verific <= 0) {
    array.categorys.splice(position, 1)
    array.allCategorys.splice(position, 1)
    array.values.splice(position, 1)
  } else {
    array.categorys[position].value -= value
    array.values[position] -= value
    array.valueTotal = getValuesAll(array.values)
    allExpenseRecords
  }
  saveLocalStorage(arrayString, array)
  // if(array.categorys.length === 0){
  //   clear()
  // }
}


function updateCards() {
  let saldo = 0;
  expenditure.textContent = `R$ ${allExpenseRecords.valueTotal}`
  saldo -= allExpenseRecords.valueTotal
  revenue.innerText = `R$ ${allRevenueRecords.valueTotal}`
  saldo += allRevenueRecords.valueTotal
  balance.textContent = `R$ ${saldo}`
}
let buttons = document.querySelectorAll('.buttons')
buttons.forEach(item => item.addEventListener('click', updateCards))

initFilter()
initSideBar()
handleTheme()

