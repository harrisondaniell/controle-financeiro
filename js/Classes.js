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

export {Revenue, Expenditure}