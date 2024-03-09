class Transactions {
  constructor(description, value, category, dateInput, id, type) {
    this.description = description;
    this.value = value;
    this.category = category;
    this.dateInput = dateInput;
    this.date;
    this.id = id;
    this.type = type
  }
  formatDate() {
    const [ano, mes, dia] = this.dateInput.split('-');
    this.date = `${dia}/${mes}/${ano}`;
  }
}

class Revenue extends Transactions {
  constructor(description, value, category, dateInput, date, id, type) {
    super(description, value, category, dateInput, id, type);
  }
}

class Expenditure extends Transactions {
  constructor(description, value, category, date, dateInput, id, type) {
    super(description, value, category, dateInput, id, type);
  }
}

class Account {
  constructor(category, value) {
    this.category = category;
    this.value = value;
  }
}

export { Revenue, Expenditure, Account }