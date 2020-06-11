document
  .getElementsByClassName("list-type")[0]
  .addEventListener("click", function (event) {
    var clickedList = event.target.id;
    var inc = document.getElementsByClassName("income-list")[0];
    var exp = document.getElementsByClassName("expense-list")[0];
    inc.style.display = "none";
    exp.style.display = "none";
    if (clickedList === "list-type-income") {
      inc.style.display = "inline";
    } else {
      exp.style.display = "inline";
    }
  });

var dataController = (function () {
  //to-do
  var budgetData = {
    inc: [],
    exp: [],
    totalInc: 0,
    totalExp: 0,
  };

  var Income = function (ID, description, value) {
    this.ID = ID;
    this.description = description;
    this.value = value;
  };

  var Expense = function (ID, description, value) {
    this.ID = ID;
    this.description = description;
    this.value = value;
  };

  return {
    addItem: function (type, desc, val) {
      var id;
      var newItem;
      if (budgetData[type].length === 0) id = 1;
      else id = budgetData[type][budgetData[type].length - 1].ID + 1;
      if (type === "inc") {
        newItem = new Income(id, desc, val);
        budgetData.totalInc += val;
      } else {
        newItem = new Expense(id, desc, val);
        budgetData.totalExp += val;
      }
      budgetData[type].push(newItem);
      return newItem;
    },
    getTotal: function () {
      return {
        inc: budgetData.totalInc,
        exp: budgetData.totalExp,
      };
    },
    testOp: function (type, desc, val) {
      console.log(budgetData);
    },
  };
})();
var uiController = (function () {
  var DOMStrings = {
    type: ".add__type",
    description: "#desc",
    value: "#value",
    addBtn: "#add-btn",
    incList: ".income-list",
    expList: ".expense-list",
    incomeTotal: ".total-income",
    expenseTotal: ".total-expense",
  };
  return {
    getInput: function () {
      var type, desc, val;
      type = document.querySelector(DOMStrings.type).value;
      desc = document.querySelector(DOMStrings.description).value;
      val = parseInt(document.querySelector(DOMStrings.value).value);
      return {
        type: type,
        desc: desc,
        val: val,
      };
    },
    getDomStrings: function () {
      return DOMStrings;
    },
    updateUI: function (newItem, type) {
      var id, desc, val, table;
      id = newItem.ID;
      desc = newItem.description;
      val = newItem.value;
      htmlString =
        '<div class="item" id="$$$$-' +
        id +
        '"><div class="item-desc">' +
        desc +
        '</div><div class="item-value">' +
        val +
        '<span class="delete-btn">hello</span></div></div>';
      if (type === "inc") {
        htmlString = htmlString.replace("$$$$", "inc");
        table = document.querySelector(DOMStrings.incList);
      } else {
        htmlString = htmlString.replace("$$$$", "exp");
        table = document.querySelector(DOMStrings.expList);
      }
      table.insertAdjacentHTML("beforeend", htmlString);
    },
    updateTotal: function (totalBudget) {
      var inc, exp;
      inc = totalBudget.inc;
      exp = totalBudget.exp;
      console.log(inc, exp);
      document.querySelector(DOMStrings.incomeTotal).textContent = inc;
      document.querySelector(DOMStrings.expenseTotal).textContent = exp;
    },
  };
})();

var appController = (function (dataCtrl, uiCtrl) {
  //1. Add a new item
  var addItem = function () {
    var inputData, newItem, totalBudget;
    //Get data from Ui
    inputData = uiCtrl.getInput();
    newItem = dataCtrl.addItem(inputData.type, inputData.desc, inputData.val);
    uiCtrl.updateUI(newItem, inputData.type);
    totalBudget = dataCtrl.getTotal();
    // console.log(totalBudget);
    uiCtrl.updateTotal(totalBudget);

    dataCtrl.testOp();
  };
  var setUpEventListeners = function () {
    var DomStrings;
    DomStrings = uiCtrl.getDomStrings();
    document
      .querySelector(DomStrings.addBtn)
      .addEventListener("click", addItem);
  };
  return {
    init: function () {
      setUpEventListeners();
    },
  };
})(dataController, uiController);

appController.init();
