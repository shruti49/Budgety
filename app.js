//USER INTERFACE MUST NOT CONTACT DATA MODULES

/********************************************************************/
/********************         MODEL          ************************/
/*******************************************************************/
const budgetController = (function() {
  const Expense = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  const Income = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  const data = {
    allItems: {
      inc: [],
      dec: []
    },
    totals: {
      inc: 0,
      dec: 0
    }
  };

  return {
    addItem: function(type, description, value) {
      let Id, newItem;

      //create new id
      if (data.allItems[type].length > 0) {
        Id = data.allItems[type][data.allItems[type].length - 1].id + 1;
      } else {
        Id = 0;
      }

      //create new object based on increment decrement
      if (type === 'dec') {
        newItem = new Expense(Id, description, value);
      } else if (type === 'inc') {
        newItem = new Income(Id, description, value);
      }

      //push into data structure
      data.allItems[type].push(newItem);

      //returning new element
      return newItem;
    }
  };
})();

/********************************************************************/
/********************         VIEW          ************************/
/*******************************************************************/
const UIController = (function() {
  const DomStrings = {
    inputType: document.querySelector('.add__type'),
    inputDescription: document.querySelector('.add__description'),
    inputMoney: document.querySelector('.add__value'),
    inputBtn: document.querySelector('.add__btn'),
    incomeContainer: document.querySelector('.income__list'),
    expenseContainer: document.querySelector('.expenses__list')
  };

  return {
    getInput: function() {
      return {
        type: DomStrings.inputType.value,
        description: DomStrings.inputDescription.value,
        value: DomStrings.inputMoney.value
      };
    },
    addListItem: function(Obj, type) {
      let HTML, element;

      if (type === 'inc') {
        element = DomStrings.incomeContainer;

        //create html string
        HTML = `<div class="item clearfix" id="income-${Obj.id}">
        <div class="item__description">${Obj.description}</div>
          <div class="right clearfix">
            <div class="item__value">${Obj.value}</div>
              <div class="item__delete">
                <button class="item__delete--btn">
                  <i class="ion-ios-close-outline"></i>
                </button>
              </div>
          </div>
      </div>`;
      } else if (type === 'dec') {
        element = DomStrings.expenseContainer;

        HTML = `<div class='item clearfix' id='expense-${Obj.id}'>
        <div class='item__description'>${Obj.description}</div>
        <div class='right clearfix'>
          <div class='item__value'>${Obj.value}</div>
          <div class='item__percentage'>21%</div>
          <div class='item__delete'>
            <button class='item__delete--btn'>
              <i class='ion-ios-close-outline'></i>
            </button>
          </div>
        </div>
      </div>`;
      }

      element.insertAdjacentHTML('beforeend', HTML);
    },
    clearfields: function() {
      let fields, fieldsArray;
      fields = document.querySelectorAll(
        '.add__description' + ',' + '.add__value'
      );
      fieldsArray = Array.from(fields);
      fieldsArray.forEach((current, i, array) => current.value = "");
      fieldsArray[0].focus();
    },
    getDom: function() {
      return DomStrings;
    }
  };
})();

/********************************************************************/
/********************    MAIN CONTROLLER    ************************/
/*******************************************************************/
const appController = (function(budgetCtrl, UICtrl) {
  const ctrlAddItem = function() {
    let input, newItem;

    //get input value
    input = UICtrl.getInput();

    //add item to budget controller
    newItem = budgetCtrl.addItem(input.type, input.description, input.value);

    //add item to the UI controller
    UICtrl.addListItem(newItem, input.type);

    //clearing input fields
    UICtrl.clearfields();

    //CALCULATE THE BUDGET
    //DISPLAY THE BUDGET ON UI
  };

  const setupEventListeners = function() {
    const DOM = UICtrl.getDom();
    DOM.inputBtn.addEventListener('click', ctrlAddItem);

    document.addEventListener('keypress', function(event) {
      if (event.keyCode === 13 || event.which === 13) {
        ctrlAddItem();
      }
    });
  };

  return {
    init: function() {
      console.log('Application has started');
      setupEventListeners();
    }
  };
})(budgetController, UIController);

appController.init();
